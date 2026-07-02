import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'node:crypto';

import { CreateOrderDto } from '../order/dto/create-order.dto.js';
import type { QuotedOrderItem } from '../order/order.service.js';
import { SpxShippingClientService } from '../integrations/shipping/spx/spx-shipping-client.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { OrderStatus, PaymentMethod, Prisma, ShippingOrderStatus, ShippingProvider } from '../../generated/prisma/client.js';
import type {
  ShippingOrderDraft,
  ShippingParcelItem,
  ShippingParty,
  ShippingTrackOrderResult,
} from './shipping.types.js';
import {
  normalizeSpxAddress,
  normalizeSpxSenderAddress,
  SPX_ADDRESS_UPDATE_REQUIRED_MESSAGE,
  SPX_COD_UNAVAILABLE_MESSAGE,
  SPX_DELIVERY_UNAVAILABLE_MESSAGE,
  SPX_PICKUP_UNAVAILABLE_MESSAGE,
} from './spx-address-normalizer.js';

const SPX_VN_MAX_PARCEL_WEIGHT_GRAMS = 15_000;
const SPX_VN_MAX_PARCEL_WEIGHT_MESSAGE =
  'Giỏ hàng vượt quá trọng lượng vận chuyển (tối đa 15kg), hãy chia bớt sản phẩm cho đơn sau';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly spxClient: SpxShippingClientService,
  ) {}

  isSpxEnabled() {
    return this.configService.get<boolean>('shipping.spx.enabled') === true;
  }

  async estimateCheckoutDeliveryFee(
    tx: Prisma.TransactionClient,
    dto: CreateOrderDto,
    quoteItems: QuotedOrderItem[],
    payableAmountBeforeDelivery: number,
  ) {
    const provider = dto.shippingProvider ?? ShippingProvider.SPX;
    if (provider === ShippingProvider.JNT) {
      throw new BadRequestException('J&T Express chưa được hỗ trợ');
    }
    if (provider !== ShippingProvider.SPX) {
      throw new BadRequestException('Phương thức vận chuyển không hợp lệ');
    }
    if (!this.isSpxEnabled()) return { deliveryFee: dto.deliveryFee ?? 0, shippingQuote: null };

    const draft = await this.buildDraftFromCheckout(
      tx,
      `quote_${Date.now()}`,
      dto,
      quoteItems,
      payableAmountBeforeDelivery,
    );
    const [estimate] = await this.spxClient.estimateFee([draft]);
    if (!estimate) throw new BadRequestException('SPX không trả về phí vận chuyển dự kiến');

    return {
      deliveryFee: Math.round(estimate.estimatedFee),
      shippingQuote: estimate,
    };
  }

  async createSpxOrder(orderId: number) {
    return this.createSpxOrders([orderId]);
  }

  async createSpxOrders(orderIds: number[]) {
    this.assertSpxEnabled();

    const uniqueOrderIds = [...new Set(orderIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueOrderIds.length) throw new BadRequestException('Vui lòng chọn ít nhất một đơn hàng');
    if (uniqueOrderIds.length > 100) throw new BadRequestException('SPX chỉ hỗ trợ tối đa 100 đơn mỗi lần');

    const orders = await this.prisma.order.findMany({
      where: { id: { in: uniqueOrderIds } },
      include: {
        shippingOrders: {
          where: {
            provider: ShippingProvider.SPX,
            status: { in: [ShippingOrderStatus.Pending, ShippingOrderStatus.Created] },
          },
          take: 1,
        },
        orderProducts: {
          include: {
            product: { select: { id: true, name: true, image: true } },
            variant: true,
          },
        },
      },
    });

    if (orders.length !== uniqueOrderIds.length) {
      throw new NotFoundException('Một số đơn hàng không tồn tại');
    }

    for (const order of orders) {
      if (order.status !== OrderStatus.Pending) {
        throw new BadRequestException(`Đơn #${order.code} không ở trạng thái chờ xử lý`);
      }
      if (order.trackingCode) {
        throw new BadRequestException(`Đơn #${order.code} đã có mã vận đơn`);
      }
      if (order.shippingOrders.length > 0) {
        throw new BadRequestException(`Đơn #${order.code} đã có vận đơn SPX đang xử lý`);
      }
    }

    const addresses = await this.prisma.address.findMany({
      where: { id: { in: [...new Set(orders.map((order) => order.addressId))] }, isDeleted: 0 },
    });
    const addressMap = new Map(addresses.map((address) => [address.id, address]));

    const drafts = orders.map((order) => {
      const address = addressMap.get(order.addressId);
      if (!address) throw new BadRequestException(`Đơn #${order.code} thiếu địa chỉ giao hàng`);
      return this.buildDraftFromOrder(order, address);
    });

    const batchResult = await this.spxClient.createOrdersBatch(drafts);

    const batch = await this.prisma.$transaction(async (tx) => {
      const createdBatch = await tx.shippingBatch.create({
        data: {
          provider: ShippingProvider.SPX,
          providerBatchNo: batchResult.providerBatchNo,
          totalCount: drafts.length,
          requestPayload: this.toJson(drafts),
          responsePayload: this.toJson(batchResult.raw),
        },
      });

      await tx.shippingOrder.createMany({
        data: orders.map((order, index) => ({
          orderId: order.id,
          batchId: createdBatch.id,
          provider: ShippingProvider.SPX,
          status: ShippingOrderStatus.Pending,
          providerOrderId: order.code,
          estimatedFee: order.deliveryFee,
          requestPayload: this.toJson(drafts[index]),
          responsePayload: this.toJson(batchResult.raw),
        })),
      });

      return createdBatch;
    });

    const refreshedBatch = await this.waitForBatchCreateResult(batch.id);
    const shippingOrders = await this.prisma.shippingOrder.findMany({
      where: { batchId: batch.id },
      include: { batch: true },
      orderBy: { id: 'asc' },
    });
    const trackingNos = shippingOrders
      .map((shippingOrder) => shippingOrder.trackingNo)
      .filter((trackingNo): trackingNo is string => Boolean(trackingNo));
    const awb = trackingNos.length ? await this.spxClient.getAwbByTrackingNos(trackingNos) : null;

    return {
      batch: refreshedBatch ?? batch,
      shippingOrders,
      awbLink: awb?.awbLink,
      awbFailures: awb?.failures ?? [],
    };
  }

  async getAwbForOrders(input: { orderIds?: number[]; trackingNos?: string[] }) {
    this.assertSpxEnabled();

    const trackingNos = new Set(
      (input.trackingNos ?? [])
        .map((trackingNo) => trackingNo.trim())
        .filter(Boolean),
    );

    if (input.orderIds?.length) {
      const shippingOrders = await this.prisma.shippingOrder.findMany({
        where: {
          orderId: { in: input.orderIds },
          provider: ShippingProvider.SPX,
          trackingNo: { not: null },
          status: { not: ShippingOrderStatus.Cancelled },
        },
        orderBy: { createdAt: 'desc' },
      });
      shippingOrders.forEach((shippingOrder) => {
        if (shippingOrder.trackingNo) trackingNos.add(shippingOrder.trackingNo);
      });
    }

    const normalizedTrackingNos = [...trackingNos];
    if (!normalizedTrackingNos.length) throw new BadRequestException('Không có mã vận đơn để in nhãn');
    if (normalizedTrackingNos.length > 100) throw new BadRequestException('SPX chỉ hỗ trợ tối đa 100 vận đơn mỗi lần');

    const awb = await this.spxClient.getAwbByTrackingNos(normalizedTrackingNos);
    if (!awb.awbLink) throw new BadRequestException('SPX chưa trả về link nhãn vận đơn');
    return awb;
  }

  async cancelShippingOrder(orderId: number) {
    this.assertSpxEnabled();

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingOrders: {
          where: { provider: ShippingProvider.SPX, trackingNo: { not: null } },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const shippingOrder = order.shippingOrders[0];
    if (!shippingOrder?.trackingNo) {
      return this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.Cancel },
      });
    }

    const result = await this.spxClient.cancelOrders([shippingOrder.trackingNo]);
    const failure = result.failures.find((item) => item.trackingNo === shippingOrder.trackingNo);
    if (failure) throw new BadRequestException(failure.message || 'SPX hủy vận đơn thất bại');

    return this.prisma.$transaction(async (tx) => {
      await tx.shippingOrder.update({
        where: { id: shippingOrder.id },
        data: {
          status: ShippingOrderStatus.Cancelled,
          responsePayload: this.toJson(result.raw),
          errorMessage: null,
        },
      });
      await tx.shippingEvent.create({
        data: {
          shippingOrderId: shippingOrder.id,
          provider: ShippingProvider.SPX,
          providerEventId: `cancel:${shippingOrder.trackingNo}:${Date.now()}`,
          trackingNo: shippingOrder.trackingNo,
          providerOrderId: shippingOrder.providerOrderId,
          eventType: 'cancel_order',
          status: 'success',
          rawPayload: this.toJson(result.raw),
        },
      });
      return tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.Cancel },
      });
    });
  }

  async refreshBatch(batchId: number) {
    this.assertSpxEnabled();

    const batch = await this.prisma.shippingBatch.findUnique({
      where: { id: batchId },
      include: { shippingOrders: { include: { order: true } } },
    });
    if (!batch?.providerBatchNo) throw new NotFoundException('Shipping batch not found');

    const result = await this.spxClient.getBatchCreateResult(batch.providerBatchNo);
    const successByOrderId = new Map(result.orders.map((item) => [item.providerOrderId, item]));
    const failureByOrderId = new Map(result.failures.map((item) => [item.providerOrderId, item]));

    return this.prisma.$transaction(async (tx) => {
      await tx.shippingBatch.update({
        where: { id: batch.id },
        data: {
          taskStatus: result.taskStatus,
          status: result.description,
          progress: result.progress,
          totalCount: result.totalCount,
          successCount: result.successCount,
          failCount: result.failCount,
          responsePayload: this.toJson(result.raw),
        },
      });

      for (const shippingOrder of batch.shippingOrders) {
        const providerOrderId = shippingOrder.providerOrderId ?? shippingOrder.order.code;
        const success = successByOrderId.get(providerOrderId);
        const failure = failureByOrderId.get(providerOrderId);

        if (success) {
          await tx.shippingOrder.update({
            where: { id: shippingOrder.id },
            data: {
              status: ShippingOrderStatus.Created,
              trackingNo: success.trackingNo,
              trackingLink: success.trackingLink,
              estimatedFee: success.estimatedFee ?? shippingOrder.estimatedFee,
              responsePayload: this.toJson(success.raw),
              errorMessage: null,
            },
          });
          await tx.order.update({
            where: { id: shippingOrder.orderId },
            data: { trackingCode: success.trackingNo },
          });
        }

        if (failure) {
          await tx.shippingOrder.update({
            where: { id: shippingOrder.id },
            data: {
              status: ShippingOrderStatus.Failed,
              responsePayload: this.toJson(failure),
              errorMessage: failure.debugMessage || failure.message,
            },
          });
        }
      }

      return tx.shippingBatch.findUnique({
        where: { id: batch.id },
        include: { shippingOrders: true },
      });
    });
  }

  async refreshActualFee(orderId: number) {
    this.assertSpxEnabled();

    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: { orderId, provider: ShippingProvider.SPX, trackingNo: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
    if (!shippingOrder?.trackingNo) throw new NotFoundException('Đơn hàng chưa có mã vận đơn SPX');

    const [actualFee] = await this.spxClient.getActualFee([shippingOrder.trackingNo]);
    if (!actualFee) throw new BadRequestException('SPX không trả về phí thực tế');

    return this.prisma.shippingOrder.update({
      where: { id: shippingOrder.id },
      data: {
        actualFee: Math.round(actualFee.actualFee),
        responsePayload: this.toJson(actualFee.raw),
      },
    });
  }


  getPickupTimeslots() {
    this.assertSpxEnabled();
    const serviceType = this.configService.get<number>('shipping.spx.serviceType') ?? 1;
    return this.spxClient.getPickupTimeslots(serviceType);
  }

  async refreshTracking(orderId: number) {
    this.assertSpxEnabled();

    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: { orderId, provider: ShippingProvider.SPX, trackingNo: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
    if (!shippingOrder?.trackingNo) throw new NotFoundException('Đơn hàng chưa có mã vận đơn SPX');

    const [track] = await this.spxClient.trackOrders({ trackingNos: [shippingOrder.trackingNo] });
    if (!track) throw new BadRequestException('SPX không trả về thông tin vận đơn');

    return this.prisma.$transaction((tx) => this.applyTrackOrderResult(tx, shippingOrder.id, track));
  }

  async confirmSpxOrder(orderId: number, operation: 1 | 2) {
    this.assertSpxEnabled();

    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: { orderId, provider: ShippingProvider.SPX, trackingNo: { not: null } },
      orderBy: { createdAt: 'desc' },
    });
    if (!shippingOrder?.trackingNo) throw new NotFoundException('Đơn hàng chưa có mã vận đơn SPX');

    const result = await this.spxClient.confirmOrder(shippingOrder.trackingNo, operation);
    await this.prisma.shippingEvent.create({
      data: {
        shippingOrderId: shippingOrder.id,
        provider: ShippingProvider.SPX,
        providerEventId: `confirm:${operation}:${shippingOrder.trackingNo}:${Date.now()}`,
        trackingNo: shippingOrder.trackingNo,
        providerOrderId: shippingOrder.providerOrderId,
        eventType: operation === 1 ? 'confirm_return' : 'confirm_reattempt',
        status: result.operationResult === 1 ? 'success' : 'failed',
        rawPayload: this.toJson(result.raw),
      },
    });

    return result;
  }

  async handleSpxWebhook(eventType: string, payload: unknown, rawBody?: Buffer) {
    const rawPayload = this.toRecord(payload);
    const payloadHash = createHash('sha256')
      .update(rawBody?.toString('utf8') ?? JSON.stringify(rawPayload))
      .digest('hex');

    const existing = await this.prisma.shippingWebhookEvent.findUnique({
      where: { payloadHash },
    });
    if (existing) return { received: true, duplicate: true };

    const webhookEvent = await this.prisma.shippingWebhookEvent.create({
      data: {
        provider: ShippingProvider.SPX,
        eventId: this.asString(rawPayload.id),
        eventType,
        payloadHash,
        rawPayload: this.toJson(rawPayload),
      },
    });

    try {
      await this.applySpxWebhookPayload(eventType, rawPayload);
      await this.prisma.shippingWebhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processedAt: new Date() },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process SPX webhook';
      this.logger.error(`SPX webhook ${eventType} failed`, message);
    }

    return { received: true, duplicate: false };
  }

  private async waitForBatchCreateResult(batchId: number) {
    let result = null;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      result = await this.refreshBatch(batchId);
      const shippingOrders = result?.shippingOrders ?? [];
      const hasTracking = shippingOrders.some((shippingOrder) => Boolean(shippingOrder.trackingNo));
      const allResolved =
        shippingOrders.length > 0 &&
        shippingOrders.every((shippingOrder) =>
          ([ShippingOrderStatus.Created, ShippingOrderStatus.Failed, ShippingOrderStatus.Cancelled] as ShippingOrderStatus[]).includes(
            shippingOrder.status,
          ),
        );

      if (hasTracking || allResolved) return result;
      await this.delay(1000);
    }
    return result;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async applySpxWebhookPayload(eventType: string, payload: Record<string, unknown>) {
    if (payload.batch_no !== undefined && payload.task_status !== undefined) {
      await this.applyBatchWebhook(payload);
      return;
    }

    const trackingNo = this.asString(payload.tracking_no) ?? this.asString(payload.forward_tracking_no);
    const providerOrderId = this.asString(payload.order_id) ?? this.asString(payload.customer_order_id);

    if (trackingNo || providerOrderId) {
      await this.applyShippingPayload(eventType, payload, trackingNo, providerOrderId);
    }
  }

  private async applyBatchWebhook(payload: Record<string, unknown>) {
    const providerBatchNo = this.asString(payload.batch_no);
    if (!providerBatchNo) return;

    await this.prisma.shippingBatch.updateMany({
      where: { provider: ShippingProvider.SPX, providerBatchNo },
      data: {
        taskStatus: this.asNumber(payload.task_status),
        status: this.asString(payload.description),
        progress: this.asString(payload.progress),
        totalCount: this.asNumber(payload.total_count),
        successCount: this.asNumber(payload.success_count),
        failCount: this.asNumber(payload.fail_count),
        responsePayload: this.toJson(payload),
      },
    });
  }

  private async applyShippingPayload(
    eventType: string,
    payload: Record<string, unknown>,
    trackingNo?: string,
    providerOrderId?: string,
  ) {
    const shippingOrder = await this.findShippingOrderForProviderPayload(trackingNo, providerOrderId);

    await this.prisma.$transaction(async (tx) => {
      if (shippingOrder) {
        await tx.shippingOrder.update({
          where: { id: shippingOrder.id },
          data: {
            ...(trackingNo ? { trackingNo } : {}),
            ...(this.asString(payload.tracking_link) ? { trackingLink: this.asString(payload.tracking_link) } : {}),
            ...(this.asString(payload.status) ? { providerStatus: this.asString(payload.status) } : {}),
            ...(this.asString(payload.status_code) ? { providerStatusCode: this.asString(payload.status_code) } : {}),
            trackingSyncedAt: new Date(),
            ...(this.asNumber(payload.latest_shipping_fee) !== undefined
              ? { actualFee: Math.round(this.asNumber(payload.latest_shipping_fee) ?? 0) }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_weight) !== undefined
              ? { latestChargeableWeight: this.asNumber(payload.latest_chargeable_weight) }
              : {}),
            ...(this.asNumber(payload.latest_actual_weight) !== undefined
              ? { latestActualWeight: this.asNumber(payload.latest_actual_weight) }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_parcel_length) !== undefined
              ? { latestChargeableParcelLength: this.asNumber(payload.latest_chargeable_parcel_length) }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_parcel_width) !== undefined
              ? { latestChargeableParcelWidth: this.asNumber(payload.latest_chargeable_parcel_width) }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_parcel_height) !== undefined
              ? { latestChargeableParcelHeight: this.asNumber(payload.latest_chargeable_parcel_height) }
              : {}),
            ...(this.asString(payload.driver_phone_number)
              ? { driverPhoneNumber: this.asString(payload.driver_phone_number) }
              : {}),
            responsePayload: this.toJson(payload),
          },
        });

        const mappedStatus = this.mapSpxStatusToOrderStatus(
          this.asString(payload.status),
          this.asString(payload.status_code),
        );
        if (trackingNo || mappedStatus) {
          await tx.order.updateMany({
            where: {
              id: shippingOrder.orderId,
              ...(mappedStatus === OrderStatus.Cancel ? {} : { status: { not: OrderStatus.SoftCancel } }),
            },
            data: {
              ...(trackingNo ? { trackingCode: trackingNo } : {}),
              ...(mappedStatus ? { status: mappedStatus } : {}),
            },
          });
        }
      }

      await tx.shippingEvent.createMany({
        data: [
          {
            shippingOrderId: shippingOrder?.id,
            provider: ShippingProvider.SPX,
            providerEventId:
              this.asString(payload.id) ??
              `${eventType}:${trackingNo ?? providerOrderId ?? 'unknown'}:${this.asString(payload.timestamp) ?? Date.now()}`,
            trackingNo,
            providerOrderId,
            eventType,
            status: this.asString(payload.status),
            statusCode: this.asString(payload.status_code),
            message: this.asString(payload.message),
            happenedAt: this.timestampToDate(payload.timestamp),
            rawPayload: this.toJson(payload),
          },
        ],
        skipDuplicates: true,
      });
    });
  }

  private async applyTrackOrderResult(
    tx: Prisma.TransactionClient,
    shippingOrderId: number,
    track: ShippingTrackOrderResult,
  ) {
    const updated = await tx.shippingOrder.update({
      where: { id: shippingOrderId },
      data: {
        ...(track.trackingNo ? { trackingNo: track.trackingNo } : {}),
        ...(track.trackingLink ? { trackingLink: track.trackingLink } : {}),
        providerStatus: track.status,
        providerStatusCode: track.statusCode,
        trackingSyncedAt: new Date(),
        responsePayload: this.toJson(track.raw),
      },
    });

    const mappedStatus = this.mapSpxStatusToOrderStatus(track.status, track.statusCode);
    if (track.trackingNo || mappedStatus) {
      await tx.order.updateMany({
        where: {
          id: updated.orderId,
          ...(mappedStatus === OrderStatus.Cancel ? {} : { status: { not: OrderStatus.SoftCancel } }),
        },
        data: {
          ...(track.trackingNo ? { trackingCode: track.trackingNo } : {}),
          ...(mappedStatus ? { status: mappedStatus } : {}),
        },
      });
    }

    if (track.routes.length) {
      await tx.shippingEvent.createMany({
        data: track.routes.map((route) => ({
          shippingOrderId,
          provider: ShippingProvider.SPX,
          providerEventId: `${track.trackingNo ?? updated.trackingNo}:${route.statusCode ?? route.status ?? 'route'}:${route.timestamp ?? ''}`,
          trackingNo: track.trackingNo ?? updated.trackingNo,
          providerOrderId: track.providerOrderId ?? updated.providerOrderId,
          eventType: 'track_order',
          status: route.status,
          statusCode: route.statusCode,
          message: route.message,
          happenedAt: this.timestampToDate(route.timestamp),
          rawPayload: this.toJson(route),
        })),
        skipDuplicates: true,
      });
    }

    return tx.shippingOrder.findUnique({
      where: { id: shippingOrderId },
      include: { events: { orderBy: { happenedAt: 'asc' } } },
    });
  }

  private async findShippingOrderForProviderPayload(trackingNo?: string, providerOrderId?: string) {
    if (!trackingNo && !providerOrderId) return null;

    return this.prisma.shippingOrder.findFirst({
      where: {
        provider: ShippingProvider.SPX,
        OR: [
          ...(trackingNo ? [{ trackingNo }] : []),
          ...(providerOrderId ? [{ providerOrderId }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private mapSpxStatusToOrderStatus(status?: string, statusCode?: string) {
    const value = `${statusCode ?? ''} ${status ?? ''}`.toLowerCase();
    if (!value.trim()) return undefined;

    if (value.includes('cancel')) return OrderStatus.Cancel;
    if (value.includes('delivered') || value.includes('delivery done') || value.includes('completed')) {
      return OrderStatus.Paid;
    }
    if (value.includes('out for delivery') || value.includes('delivering')) {
      return OrderStatus.Delivering;
    }
    if (
      value.includes('pickup') ||
      value.includes('picked') ||
      value.includes('collect') ||
      value.includes('transport') ||
      value.includes('transit') ||
      value.includes('sorting') ||
      value.includes('handover') ||
      value.includes('inbound') ||
      value.includes('outbound')
    ) {
      return OrderStatus.Prepare;
    }

    return undefined;
  }

  private async buildDraftFromCheckout(
    tx: Prisma.TransactionClient,
    orderId: string,
    dto: CreateOrderDto,
    quoteItems: QuotedOrderItem[],
    payableAmountBeforeDelivery: number,
  ): Promise<ShippingOrderDraft> {
    const recipient = await this.resolveRecipient(tx, dto, dto.paymentMethod);
    return this.buildDraft(orderId, dto.paymentMethod, dto.note, quoteItems, recipient, payableAmountBeforeDelivery);
  }

  private buildDraftFromOrder(
    order: Prisma.OrderGetPayload<{
      include: {
        shippingOrders: true;
        orderProducts: { include: { product: { select: { id: true; name: true; image: true } }; variant: true } };
      };
    }>,
    address: {
      cneeName: string | null;
      cneePhone: string | null;
      city: string | null;
      district: string | null;
      ward: string | null;
      fullAddr: string | null;
    },
  ) {
    const items: QuotedOrderItem[] = order.orderProducts.map((item) => {
      if (!item.variant) throw new BadRequestException('Đơn hàng có biến thể không hợp lệ');
      return {
        productId: item.productId,
        variantId: item.variant.id,
        quantity: item.quantity,
        originalPrice: Number(item.originalPrice),
        finalPrice: Number(item.finalPrice),
        lineAmount: Number(item.finalPrice) * item.quantity,
        itemVoucherDiscount: Number(item.itemVoucherDiscount),
        pricingMode: item.pricingMode,
        product: { id: item.product.id, name: item.product.name, image: item.product.image },
        variant: {
          id: item.variant.id,
          name: item.variant.name,
          image: item.variant.image,
          dimensions: item.variant.dimensions,
          stock: item.variant.stock,
          pricingMode: item.pricingMode,
          minOrderQuantity: 1,
          packageWeightGrams: item.variant.packageWeightGrams,
          packageLengthCm: item.variant.packageLengthCm ? Number(item.variant.packageLengthCm) : null,
          packageWidthCm: item.variant.packageWidthCm ? Number(item.variant.packageWidthCm) : null,
          packageHeightCm: item.variant.packageHeightCm ? Number(item.variant.packageHeightCm) : null,
        },
      };
    });

    return this.buildDraft(
      order.code,
      order.paymentMethod,
      order.note ?? undefined,
      items,
      this.mapAddressToParty(address, order.paymentMethod),
      Number(order.totalAmount),
    );
  }

  private buildDraft(
    orderId: string,
    paymentMethod: PaymentMethod | undefined,
    note: string | undefined,
    quoteItems: QuotedOrderItem[],
    recipient: ShippingParty,
    payableAmount: number,
  ): ShippingOrderDraft {
    const parcel = this.buildParcel(quoteItems);
    const codAmount = paymentMethod === PaymentMethod.COD ? Math.max(Math.round(payableAmount), 0) : 0;
    const collectType = this.configService.get<number>('shipping.spx.collectType') ?? 2;
    const pickupTime = this.configService.get<number>('shipping.spx.pickupTime');
    const pickupTimeRangeId = this.configService.get<number>('shipping.spx.pickupTimeRangeId');
    const pickupTimeRange = this.configService.get<string>('shipping.spx.pickupTimeRange') || undefined;

    if (collectType === 1 && (!pickupTime || !pickupTimeRangeId || !pickupTimeRange)) {
      throw new BadRequestException('SPX pickup cần cấu hình pickup_time, pickup_time_range_id và pickup_time_range');
    }

    return {
      orderId: orderId.slice(0, 32),
      serviceType: this.configService.get<number>('shipping.spx.serviceType') ?? 1,
      sender: this.resolveSender(),
      recipient,
      paymentRole: this.configService.get<number>('shipping.spx.paymentRole') ?? 1,
      codAmount,
      collectType,
      pickupTime,
      pickupTimeRangeId,
      pickupTimeRange,
      highValueProcessingCollection:
        this.configService.get<number>('shipping.spx.highValueProcessingCollection') ?? 1,
      note: note?.slice(0, 256),
      parcel,
    };
  }

  private buildParcel(quoteItems: QuotedOrderItem[]) {
    const parcelItems: ShippingParcelItem[] = quoteItems.map((item) => {
      const weight = item.variant.packageWeightGrams ?? 0;
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new BadRequestException(`Biến thể ${item.variant.name} chưa có trọng lượng vận chuyển hợp lệ`);
      }

      return {
        itemId: item.variantId,
        name: `${item.product.name} - ${item.variant.name}`.slice(0, 256),
        weightGrams: weight,
        price: item.finalPrice,
        quantity: item.quantity,
        picture: item.variant.image ?? item.product.image[0],
      };
    });

    const totalWeight = parcelItems.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0);
    const totalQuantity = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
    if (totalWeight > SPX_VN_MAX_PARCEL_WEIGHT_GRAMS) {
      throw new BadRequestException(SPX_VN_MAX_PARCEL_WEIGHT_MESSAGE);
    }

    const lengthCm = this.maxOptionalDimension(quoteItems.map((item) => item.variant.packageLengthCm));
    const widthCm = this.maxOptionalDimension(quoteItems.map((item) => item.variant.packageWidthCm));
    const heightCm = this.maxOptionalDimension(quoteItems.map((item) => item.variant.packageHeightCm));
    if ([lengthCm, widthCm, heightCm].every((value) => value !== undefined)) {
      const sum = (lengthCm ?? 0) + (widthCm ?? 0) + (heightCm ?? 0);
      if (sum > 180 || [lengthCm, widthCm, heightCm].some((value) => (value ?? 0) > 60)) {
        throw new BadRequestException('Kích thước kiện hàng vượt giới hạn SPX cho Việt Nam');
      }
    }

    return {
      weightGrams: totalWeight,
      lengthCm,
      widthCm,
      heightCm,
      itemName: parcelItems[0]?.name ?? 'MH Home order',
      itemQuantity: totalQuantity,
      insuredValue: quoteItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
      items: parcelItems,
    };
  }

  private maxOptionalDimension(values: Array<number | null | undefined>) {
    const normalized = values
      .map((value) => (value === null || value === undefined ? undefined : Number(value)))
      .filter((value): value is number =>
        value !== undefined && Number.isFinite(value) && value > 0,
      );
    if (!normalized.length) return undefined;
    return Math.max(...normalized);
  }

  private async resolveRecipient(tx: Prisma.TransactionClient, dto: CreateOrderDto, paymentMethod?: PaymentMethod) {
    if (dto.address) return this.mapCheckoutAddressToParty(dto.address, paymentMethod);
    if (!dto.addressId) throw new BadRequestException('Thiếu địa chỉ giao hàng để tính phí vận chuyển');

    const address = await tx.address.findFirst({ where: { id: dto.addressId, isDeleted: 0 } });
    if (!address) throw new BadRequestException('Không tìm thấy địa chỉ giao hàng');
    return this.mapAddressToParty(address, paymentMethod);
  }

  private mapCheckoutAddressToParty(address: NonNullable<CreateOrderDto['address']>, paymentMethod?: PaymentMethod): ShippingParty {
    const normalized = this.normalizeRecipientAddress(address.city, address.district, address.ward, paymentMethod);
    return {
      name: address.cneeName,
      phone: address.cneePhone,
      state: normalized.state,
      city: normalized.city,
      district: normalized.district,
      addressVersion: normalized.addressVersion,
      deliveryAvailable: normalized.deliveryAvailable,
      pickupAvailable: normalized.pickupAvailable,
      codAvailable: normalized.codAvailable,
      detailAddress: address.fullAddr,
    };
  }

  private mapAddressToParty(address: {
    cneeName: string | null;
    cneePhone: string | null;
    city: string | null;
    district: string | null;
    ward: string | null;
    fullAddr: string | null;
  }, paymentMethod?: PaymentMethod): ShippingParty {
    const normalized = this.normalizeRecipientAddress(address.city, address.district, address.ward, paymentMethod);
    return {
      name: address.cneeName ?? '',
      phone: address.cneePhone ?? '',
      state: normalized.state,
      city: normalized.city,
      district: normalized.district,
      addressVersion: normalized.addressVersion,
      deliveryAvailable: normalized.deliveryAvailable,
      pickupAvailable: normalized.pickupAvailable,
      codAvailable: normalized.codAvailable,
      detailAddress: address.fullAddr ?? '',
    };
  }

  private normalizeRecipientAddress(
    city?: string | null,
    district?: string | null,
    ward?: string | null,
    paymentMethod?: PaymentMethod,
  ) {
    const normalized = normalizeSpxAddress(city, district, ward);
    if (!normalized) {
      throw new BadRequestException(SPX_ADDRESS_UPDATE_REQUIRED_MESSAGE);
    }
    if (!normalized.deliveryAvailable) {
      throw new BadRequestException(SPX_DELIVERY_UNAVAILABLE_MESSAGE);
    }
    if (paymentMethod === PaymentMethod.COD && !normalized.codAvailable) {
      throw new BadRequestException(SPX_COD_UNAVAILABLE_MESSAGE);
    }
    return normalized;
  }

  private resolveSender(): ShippingParty {
    const sender = this.configService.get<ShippingParty>('shipping.spx.sender');
    const addressVersion = this.configService.get<number>('shipping.spx.addressVersion') === 2 ? 2 : 0;
    const collectType = this.configService.get<number>('shipping.spx.collectType') ?? 2;

    if (!sender?.name || !sender.phone || !sender.state || !sender.city || !sender.detailAddress) {
      throw new BadRequestException('Thiếu cấu hình địa chỉ gửi hàng SPX');
    }

    if (addressVersion === 2) {
      const normalized = normalizeSpxSenderAddress(sender.state, sender.city);
      if (!normalized) {
        throw new BadRequestException('Địa chỉ gửi hàng SPX đã cũ, vui lòng cập nhật lại địa chỉ mới.');
      }
      if (collectType === 1 && !normalized.pickupAvailable) {
        throw new BadRequestException(SPX_PICKUP_UNAVAILABLE_MESSAGE);
      }
      return {
        ...sender,
        state: normalized.state,
        city: normalized.city,
        district: '',
        addressVersion: normalized.addressVersion,
        deliveryAvailable: normalized.deliveryAvailable,
        pickupAvailable: normalized.pickupAvailable,
        codAvailable: normalized.codAvailable,
      };
    }

    if (!sender.district) {
      throw new BadRequestException('Thiếu cấu hình địa chỉ gửi hàng SPX');
    }
    return { ...sender, addressVersion: 0 };
  }

  private toRecord(payload: unknown): Record<string, unknown> {
    return payload && typeof payload === 'object' ? (payload as Record<string, unknown>) : {};
  }

  private asString(value: unknown) {
    if (value === undefined || value === null || value === '') return undefined;
    return String(value);
  }

  private asNumber(value: unknown) {
    if (value === undefined || value === null || value === '') return undefined;
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : undefined;
  }

  private timestampToDate(value: unknown) {
    const timestamp = this.asNumber(value);
    if (!timestamp) return undefined;
    return new Date(timestamp * 1000);
  }

  private assertSpxEnabled() {
    if (!this.isSpxEnabled()) throw new BadRequestException('SPX shipping chưa được bật');
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
