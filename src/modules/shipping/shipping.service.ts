import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { createHash, randomUUID } from 'node:crypto';

import { CreateOrderDto } from '../order/dto/create-order.dto.js';
import type { QuotedOrderItem } from '../order/order.service.js';
import { SpxShippingClientService } from '../integrations/shipping/spx/spx-shipping-client.service.js';
import { VtpShippingClientService } from '../integrations/shipping/vtp/vtp-shipping-client.service.js';
import type {
  VtpEditInput,
  VtpFailureDetails,
  VtpWebhookData,
} from '../integrations/shipping/vtp/vtp-shipping.types.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  OrderStatus,
  PaymentMethod,
  Prisma,
  ShippingManagedBy,
  ShippingOrderStatus,
  ShippingProvider,
} from '../../generated/prisma/client.js';
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
import { SaleWorkStockSyncService } from '../salework-sync/salework-stock-sync.service.js';
import { OrderInventoryService } from '../order-inventory/order-inventory.service.js';
import {
  mapSpxStatusToOrderStatus,
  SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES,
} from './spx-status-mapper.js';
import { MarketplaceClientService } from '../marketplace/marketplace-client.service.js';
import { mapVtpStatus } from './vtp-status-mapper.js';

import { RedisService } from '../../common/redis/redis.service.js';
import { AdminNotificationService } from '../admin-notification/admin-notification.service.js';
const SPX_VN_MAX_PARCEL_WEIGHT_GRAMS = 15_000;
const SPX_VN_MAX_PARCEL_WEIGHT_MESSAGE =
  'Giỏ hàng vượt quá trọng lượng vận chuyển (tối đa 15kg), hãy chia bớt sản phẩm cho đơn sau';

@Injectable()
export class ShippingService {
  private readonly logger = new Logger(ShippingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly adminNotifications: AdminNotificationService,
    private readonly spxClient: SpxShippingClientService,
    private readonly vtpClient: VtpShippingClientService,
    private readonly saleWorkStockSync: SaleWorkStockSyncService,
    private readonly orderInventory: OrderInventoryService,
    private readonly marketplaceClient: MarketplaceClientService,
  ) {}

  isSpxEnabled() {
    return this.configService.get<boolean>('shipping.spx.enabled') === true;
  }

  isVtpEnabled() {
    return this.configService.get<boolean>('shipping.vtp.enabled') === true;
  }

  isProviderEnabled(provider: ShippingProvider) {
    if (provider === ShippingProvider.SPX) return this.isSpxEnabled();
    if (provider === ShippingProvider.VTP) return this.isVtpEnabled();
    return false;
  }

  @Cron('0 */10 * * * *')
  async handleSpxTrackingCron() {
    if (!this.isSpxEnabled()) return;

    try {
      const result = await this.refreshTrackings({ limit: 200 });
      if (result.total > 0) {
        this.logger.log(
          `SPX tracking cron: refreshed ${result.refreshed}/${result.total}, failed ${result.failed}`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to refresh SPX tracking';
      this.logger.warn(`SPX tracking cron failed: ${message}`);
    }
  }

  @Cron('*/30 * * * * *')
  async handleSpxWebhookRetryCron() {
    if (!this.isSpxEnabled()) return;

    const events = await this.prisma.shippingWebhookEvent.findMany({
      where: {
        provider: ShippingProvider.SPX,
        processedAt: null,
        attemptCount: { lt: 10 },
      },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    for (const event of events) await this.processSpxWebhookEvent(event.id);
  }

  @Cron('*/30 * * * * *')
  async handleVtpWebhookRetryCron() {
    if (!this.isVtpEnabled()) return;

    const events = await this.prisma.shippingWebhookEvent.findMany({
      where: {
        provider: ShippingProvider.VTP,
        processedAt: null,
        attemptCount: { lt: 10 },
      },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    for (const event of events) await this.processVtpWebhookEvent(event.id);
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
    if (provider !== ShippingProvider.SPX && provider !== ShippingProvider.VTP) {
      throw new BadRequestException('Phương thức vận chuyển không hợp lệ');
    }
    if (!this.isProviderEnabled(provider)) {
      throw new BadRequestException('Đơn vị vận chuyển đang tạm ngưng');
    }

    const draft = await this.buildDraftFromCheckout(
      tx,
      `quote_${Date.now()}`,
      dto,
      quoteItems,
      payableAmountBeforeDelivery,
      provider,
    );
    const estimate =
      provider === ShippingProvider.VTP
        ? await this.vtpClient.estimateFee(draft)
        : (await this.spxClient.estimateFee([draft]))[0];
    if (!estimate) {
      throw new BadRequestException(
        provider === ShippingProvider.VTP
          ? 'ViettelPost không trả về phí vận chuyển dự kiến'
          : 'SPX không trả về phí vận chuyển dự kiến',
      );
    }

    return {
      deliveryFee: Math.round(estimate.estimatedFee),
      shippingQuote: estimate,
    };
  }

  async createOrders(orderIds: number[]) {
    const uniqueOrderIds = [...new Set(orderIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueOrderIds.length) throw new BadRequestException('Vui lòng chọn ít nhất một đơn hàng');

    const orders = await this.prisma.order.findMany({
      where: { id: { in: uniqueOrderIds } },
      select: { id: true, code: true, shippingProvider: true },
    });
    if (orders.length !== uniqueOrderIds.length) {
      throw new NotFoundException('Một số đơn hàng không tồn tại');
    }

    const byProvider = new Map<ShippingProvider, number[]>();
    for (const order of orders) {
      const ids = byProvider.get(order.shippingProvider) ?? [];
      ids.push(order.id);
      byProvider.set(order.shippingProvider, ids);
    }

    const providers: Array<{ provider: ShippingProvider; result: Record<string, unknown> }> = [];
    for (const [provider, ids] of byProvider) {
      try {
        const rawResult =
          provider === ShippingProvider.SPX
            ? await this.createSpxOrders(ids)
            : provider === ShippingProvider.VTP
              ? await this.createVtpOrders(ids)
              : (() => {
                  throw new BadRequestException('Đơn vị vận chuyển chưa được hỗ trợ');
                })();
        providers.push({
          provider,
          result: this.normalizeShippingCreateResult(rawResult, provider, ids, orders),
        });
      } catch (error) {
        const failures = this.shippingFailuresFromError(error, provider, ids, orders);
        providers.push({
          provider,
          result: {
            totalCount: ids.length,
            successCount: 0,
            failCount: ids.length,
            trackingNos: [],
            failures,
            awbFailures: [],
          },
        });
      }
    }

    const totalCount = providers.reduce(
      (total, item) => total + (this.asNumber(item.result['totalCount']) ?? 0),
      0,
    );
    const successCount = providers.reduce(
      (total, item) => total + (this.asNumber(item.result['successCount']) ?? 0),
      0,
    );
    const failCount = providers.reduce(
      (total, item) => total + (this.asNumber(item.result['failCount']) ?? 0),
      0,
    );
    const failures = providers.flatMap((item) =>
      Array.isArray(item.result['failures']) ? item.result['failures'] : [],
    );
    const trackingNos = providers.flatMap((item) =>
      Array.isArray(item.result['trackingNos'])
        ? item.result['trackingNos'].filter((value): value is string => typeof value === 'string')
        : [],
    );
    const awbFailures = providers.flatMap((item) =>
      Array.isArray(item.result['awbFailures']) ? item.result['awbFailures'] : [],
    );

    if (successCount === 0 && failCount > 0) {
      const onlyVtp = providers.length === 1 && providers[0].provider === ShippingProvider.VTP;
      throw new BadGatewayException({
        message: onlyVtp
          ? 'Không thể tạo vận đơn ViettelPost'
          : 'Không thể tạo vận đơn với các đơn vị vận chuyển đã chọn',
        error: 'Bad Gateway',
        code: onlyVtp ? 'VTP_SHIPPING_FAILED' : 'SHIPPING_FAILED',
        details: { totalCount, successCount, failCount, trackingNos, failures },
      });
    }

    if (providers.length === 1) return providers[0].result;
    return {
      totalCount,
      successCount,
      failCount,
      trackingNos,
      failures,
      awbFailures,
      providers,
    };
  }

  async createVtpOrders(orderIds: number[]) {
    this.assertVtpEnabled();
    const uniqueOrderIds = [...new Set(orderIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueOrderIds.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất một đơn hàng');
    }
    if (uniqueOrderIds.length > 100) {
      throw new BadRequestException('ViettelPost chỉ hỗ trợ tối đa 100 đơn mỗi lần');
    }

    const lockToken = randomUUID();
    const lockKeys: string[] = [];
    try {
      for (const orderId of [...uniqueOrderIds].sort((left, right) => left - right)) {
        const key = `shipping:vtp:create:${orderId}`;
        const locked = await this.redis.getClient().set(key, lockToken, 'EX', 300, 'NX');
        if (locked !== 'OK') {
          throw new ConflictException(
            `Đơn #${orderId} đang được xử lý vận chuyển, vui lòng thử lại sau`,
          );
        }
        lockKeys.push(key);
      }
      return await this.createVtpOrdersLocked(uniqueOrderIds);
    } finally {
      await Promise.all(
        lockKeys.map((key) =>
          this.redis
            .getClient()
            .eval(
              'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end',
              1,
              key,
              lockToken,
            )
            .catch(() => undefined),
        ),
      );
    }
  }

  private async createVtpOrdersLocked(uniqueOrderIds: number[]) {
    const orders = await this.prisma.order.findMany({
      where: { id: { in: uniqueOrderIds } },
      include: {
        shippingOrders: {
          where: {
            managedBy: ShippingManagedBy.Local,
            provider: ShippingProvider.VTP,
          },
          orderBy: { createdAt: 'desc' },
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
      if (order.shippingProvider !== ShippingProvider.VTP) {
        throw new BadRequestException(`Đơn #${order.code} không chọn ViettelPost`);
      }
      if (order.marketplaceSubOrderId) {
        throw new BadRequestException(`Đơn #${order.code} do Marketplace quản lý vận chuyển`);
      }
      if (order.status !== OrderStatus.Pending) {
        throw new BadRequestException(`Đơn #${order.code} không ở trạng thái chờ xử lý`);
      }

      const latest = order.shippingOrders[0];
      if (order.trackingCode && !latest?.trackingNo) {
        throw new BadRequestException(
          `Đơn #${order.code} đã có mã vận đơn nhưng thiếu audit ViettelPost`,
        );
      }
      if (order.trackingCode && latest?.trackingNo && order.trackingCode !== latest.trackingNo) {
        throw new BadRequestException(`Đơn #${order.code} có mã vận đơn không đồng nhất`);
      }
      if (latest?.status === ShippingOrderStatus.Cancelled) {
        throw new BadRequestException(`Vận đơn #${order.code} đã bị hủy`);
      }
    }

    const addresses = await this.prisma.address.findMany({
      where: {
        id: { in: [...new Set(orders.map((order) => order.addressId))] },
        isDeleted: 0,
      },
    });
    const addressMap = new Map(addresses.map((address) => [address.id, address]));
    const drafts = orders.map((order) => {
      const address = addressMap.get(order.addressId);
      if (!address) {
        throw new BadRequestException(`Đơn #${order.code} thiếu địa chỉ giao hàng`);
      }
      return this.buildDraftFromOrder(order, address, ShippingProvider.VTP);
    });

    const batch = await this.prisma.shippingBatch.create({
      data: {
        provider: ShippingProvider.VTP,
        status: 'Creating',
        totalCount: orders.length,
        requestPayload: this.toJson(drafts),
      },
    });

    type StoredShippingOrder = (typeof orders)[number]['shippingOrders'][number];
    const shippingOrderByOrderId = new Map<number, StoredShippingOrder>();
    for (const [index, order] of orders.entries()) {
      const latest = order.shippingOrders[0];
      if (latest && (latest.trackingNo || latest.status === ShippingOrderStatus.Pending)) {
        shippingOrderByOrderId.set(order.id, latest);
        continue;
      }
      const created = await this.prisma.shippingOrder.create({
        data: {
          orderId: order.id,
          batchId: batch.id,
          provider: ShippingProvider.VTP,
          managedBy: ShippingManagedBy.Local,
          status: ShippingOrderStatus.Pending,
          providerOrderId: order.code,
          estimatedFee: order.deliveryFee,
          requestPayload: this.toJson(drafts[index]),
        },
      });
      shippingOrderByOrderId.set(order.id, created);
    }

    const failures: Array<{
      orderId: number;
      orderCode: string;
      provider: 'VTP';
      stage: VtpFailureDetails['stage'];
      message: string;
      trackingNo?: string;
      providerStatus?: number;
    }> = [];
    const successfulShippingOrderIds = new Set<number>();

    for (let offset = 0; offset < orders.length; offset += 5) {
      await Promise.all(
        orders.slice(offset, offset + 5).map(async (order, indexInSlice) => {
          const draft = drafts[offset + indexInSlice];
          const shippingOrder = shippingOrderByOrderId.get(order.id);
          if (!shippingOrder) return;

          let trackingNo = shippingOrder.trackingNo;
          if (trackingNo && shippingOrder.status === ShippingOrderStatus.Created) {
            successfulShippingOrderIds.add(shippingOrder.id);
            return;
          }

          if (!trackingNo) {
            try {
              const createResult = await this.vtpClient.createOrder(draft);
              trackingNo = createResult.trackingNo;
              await this.prisma.$transaction([
                this.prisma.shippingOrder.update({
                  where: { id: shippingOrder.id },
                  data: {
                    status: ShippingOrderStatus.Created,
                    trackingNo,
                    providerServiceCode: createResult.serviceCode,
                    providerServiceName: createResult.serviceName,
                    expectedDelivery: createResult.expectedDelivery,
                    estimatedFee: createResult.estimatedFee,
                    actualFee: createResult.actualFee,
                    responsePayload: this.toJson({ create: createResult.raw }),
                    errorMessage: null,
                  },
                }),
                this.prisma.order.update({
                  where: { id: order.id },
                  data: { trackingCode: trackingNo },
                }),
                this.prisma.shippingEvent.create({
                  data: {
                    shippingOrderId: shippingOrder.id,
                    provider: ShippingProvider.VTP,
                    providerEventId: `create:${trackingNo}`,
                    trackingNo,
                    providerOrderId: order.code,
                    eventType: 'create_order',
                    status: 'accepted',
                    statusCode: '102',
                    message: 'ViettelPost đã tạo và tiếp nhận vận đơn',
                    rawPayload: this.toJson(createResult.raw),
                  },
                }),
              ]);
              successfulShippingOrderIds.add(shippingOrder.id);
            } catch (error) {
              const details = this.vtpClient.describeError(error, 'create');
              failures.push({
                orderId: order.id,
                orderCode: order.code,
                provider: 'VTP',
                stage: details.stage,
                message: details.message,
                providerStatus: details.providerStatus,
              });
              await this.prisma.$transaction([
                this.prisma.shippingOrder.update({
                  where: { id: shippingOrder.id },
                  data: {
                    status: ShippingOrderStatus.Failed,
                    responsePayload: this.toJson(details),
                    errorMessage: details.message,
                  },
                }),
                this.prisma.shippingEvent.create({
                  data: {
                    shippingOrderId: shippingOrder.id,
                    provider: ShippingProvider.VTP,
                    providerEventId: `create-failed:${shippingOrder.id}:${Date.now()}`,
                    providerOrderId: order.code,
                    eventType: 'create_order',
                    status: 'failed',
                    message: details.message,
                    rawPayload: this.toJson(details),
                  },
                }),
              ]);
              return;
            }
            return;
          }

          try {
            await this.prisma.$transaction([
              this.prisma.shippingOrder.update({
                where: { id: shippingOrder.id },
                data: {
                  status: ShippingOrderStatus.Created,
                  errorMessage: null,
                },
              }),
              this.prisma.shippingEvent.create({
                data: {
                  shippingOrderId: shippingOrder.id,
                  provider: ShippingProvider.VTP,
                  providerEventId: `create-recovered:${trackingNo}`,
                  trackingNo,
                  providerOrderId: order.code,
                  eventType: 'create_order',
                  status: 'accepted',
                  statusCode: '102',
                  message: 'ViettelPost đã tạo và tiếp nhận vận đơn',
                  rawPayload: this.toJson(shippingOrder.responsePayload),
                },
              }),
            ]);
            successfulShippingOrderIds.add(shippingOrder.id);
          } catch (error) {
            const details = this.vtpClient.describeError(error, 'create');
            failures.push({
              orderId: order.id,
              orderCode: order.code,
              provider: 'VTP',
              stage: details.stage,
              message: details.message,
              trackingNo,
              providerStatus: details.providerStatus,
            });
            await this.prisma.$transaction([
              this.prisma.shippingOrder.update({
                where: { id: shippingOrder.id },
                data: {
                  status: ShippingOrderStatus.Failed,
                  errorMessage: details.message,
                },
              }),
              this.prisma.shippingEvent.create({
                data: {
                  shippingOrderId: shippingOrder.id,
                  provider: ShippingProvider.VTP,
                  providerEventId: `create-recovery-failed:${trackingNo}:${Date.now()}`,
                  trackingNo,
                  providerOrderId: order.code,
                  eventType: 'create_order',
                  status: 'failed',
                  message: details.message,
                  rawPayload: this.toJson(details),
                },
              }),
            ]);
          }
        }),
      );
    }

    const successCount = successfulShippingOrderIds.size;
    const failCount = failures.length;
    await this.prisma.shippingBatch.update({
      where: { id: batch.id },
      data: {
        status: failCount ? (successCount ? 'Partial' : 'Failed') : 'Completed',
        successCount,
        failCount,
        responsePayload: this.toJson({ failures }),
      },
    });

    const shippingOrderIds = [...shippingOrderByOrderId.values()].map((item) => item.id);
    const shippingOrders = await this.prisma.shippingOrder.findMany({
      where: { id: { in: shippingOrderIds } },
      include: { batch: true },
      orderBy: { id: 'asc' },
    });
    const trackingNos = shippingOrders
      .filter((item) => successfulShippingOrderIds.has(item.id))
      .map((item) => item.trackingNo)
      .filter((item): item is string => Boolean(item));
    let awb: Awaited<ReturnType<VtpShippingClientService['getAwbByTrackingNos']>> | null = null;
    let awbFailures: Array<{ trackingNo: string; message: string }> = [];
    if (trackingNos.length) {
      try {
        awb = await this.vtpClient.getAwbByTrackingNos(trackingNos);
      } catch (error) {
        const details = this.vtpClient.describeError(error, 'print');
        this.logger.warn(`VTP label unavailable after shipment creation: ${details.message}`);
        awbFailures = trackingNos.map((trackingNo) => ({
          trackingNo,
          message: details.message,
        }));
      }
    }

    const result = {
      batch: await this.prisma.shippingBatch.findUnique({ where: { id: batch.id } }),
      totalCount: orders.length,
      successCount,
      failCount,
      trackingNos,
      failures,
      shippingOrders,
      awbLink: awb?.awbLink,
      awbFailures: awb?.failures ?? awbFailures,
    };

    if (successCount === 0) {
      throw new BadGatewayException({
        message: 'Không thể tạo vận đơn ViettelPost',
        error: 'Bad Gateway',
        code: 'VTP_SHIPPING_FAILED',
        details: {
          batchId: batch.id,
          totalCount: result.totalCount,
          successCount: result.successCount,
          failCount: result.failCount,
          trackingNos: result.trackingNos,
          failures: result.failures,
        },
      });
    }
    return result;
  }

  async createSpxOrder(orderId: number) {
    return this.createSpxOrders([orderId]);
  }

  async createSpxOrders(orderIds: number[]) {
    this.assertSpxEnabled();

    const uniqueOrderIds = [...new Set(orderIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueOrderIds.length) throw new BadRequestException('Vui lòng chọn ít nhất một đơn hàng');
    if (uniqueOrderIds.length > 100)
      throw new BadRequestException('SPX chỉ hỗ trợ tối đa 100 đơn mỗi lần');

    const orders = await this.prisma.order.findMany({
      where: { id: { in: uniqueOrderIds } },
      include: {
        shippingOrders: {
          where: {
            provider: ShippingProvider.SPX,
            managedBy: ShippingManagedBy.Local,
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
      if (order.shippingProvider !== ShippingProvider.SPX) {
        throw new BadRequestException(`Đơn #${order.code} không chọn SPX`);
      }
      if (order.marketplaceSubOrderId) {
        throw new BadRequestException(`Đơn #${order.code} do Marketplace quản lý vận chuyển`);
      }
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
          managedBy: ShippingManagedBy.Local,
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

  async createMarketplaceSpxOrders(orderIds: number[]) {
    const mappings = await this.marketplaceOrderMappings(orderIds);
    const subOrderIds = mappings.map((item) => item.subOrderId);
    try {
      const result = (
        await this.marketplaceClient.createSourceShipments(
          subOrderIds,
          `source-shipment:${subOrderIds.join(',')}`,
        )
      ).data;
      return this.enrichMarketplaceShippingResult(result, mappings);
    } catch (error) {
      if (!(error instanceof HttpException)) throw error;
      const response = this.toRecord(error.getResponse());
      const details = this.enrichMarketplaceShippingResult(response['details'], mappings);
      throw new BadGatewayException({
        message:
          this.asString(response['message']) ?? 'Marketplace không thể tạo vận đơn mua chéo',
        error: 'Bad Gateway',
        ...(this.asString(response['code']) ? { code: this.asString(response['code']) } : {}),
        ...(Object.keys(details).length ? { details } : {}),
      });
    }
  }

  async getMarketplaceAwb(orderIds: number[]) {
    const subOrderIds = await this.marketplaceSubOrderIds(orderIds);
    return (
      await this.marketplaceClient.getSourceAwb(
        subOrderIds,
        `source-awb:${subOrderIds.join(',')}:${Date.now()}`,
      )
    ).data;
  }

  async refreshMarketplaceTrackings(orderIds: number[]) {
    const subOrderIds = await this.marketplaceSubOrderIds(orderIds);
    return (
      await this.marketplaceClient.refreshSourceShipments(
        subOrderIds,
        `source-refresh:${subOrderIds.join(',')}:${Date.now()}`,
      )
    ).data;
  }

  async softCancelMarketplaceShippingOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        code: true,
        status: true,
        updatedAt: true,
        marketplaceSubOrderId: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.marketplaceSubOrderId) {
      throw new BadRequestException(`Đơn #${order.code} không phải đơn mua chéo`);
    }
    if (order.status === OrderStatus.SoftCancel) return order;
    if (order.status !== OrderStatus.Prepare) {
      throw new BadRequestException('Chỉ hủy đột ngột đơn đang giao cho đơn vị vận chuyển');
    }

    await this.marketplaceClient.requestSourceShipmentSoftCancel(
      order.marketplaceSubOrderId,
      `source-soft-cancel:${order.marketplaceSubOrderId}:${order.updatedAt.getTime()}`,
    );
    const updated = await this.prisma.order.updateMany({
      where: { id: order.id, status: OrderStatus.Prepare },
      data: { status: OrderStatus.SoftCancel },
    });
    if (!updated.count) {
      throw new BadRequestException('Trạng thái đơn đã thay đổi, vui lòng tải lại');
    }
    return this.prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  }

  async releaseMarketplaceSoftCancel(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        code: true,
        status: true,
        updatedAt: true,
        marketplaceSubOrderId: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (!order.marketplaceSubOrderId) {
      throw new BadRequestException(`Đơn #${order.code} không phải đơn mua chéo`);
    }
    if (order.status === OrderStatus.Pending) return order;
    if (order.status !== OrderStatus.SoftCancel) {
      throw new BadRequestException('Đơn không ở trạng thái hủy đột ngột');
    }

    await this.marketplaceClient.releaseSourceShipmentSoftCancel(
      order.marketplaceSubOrderId,
      `source-soft-cancel-release:${order.marketplaceSubOrderId}:${order.updatedAt.getTime()}`,
    );
    const updated = await this.prisma.order.updateMany({
      where: { id: order.id, status: OrderStatus.SoftCancel },
      data: { status: OrderStatus.Pending },
    });
    if (!updated.count) {
      throw new BadRequestException('Trạng thái đơn đã thay đổi, vui lòng tải lại');
    }
    return this.prisma.order.findUniqueOrThrow({ where: { id: order.id } });
  }

  async cancelMarketplaceShippingOrder(orderId: number) {
    const [subOrderId] = await this.marketplaceSubOrderIds([orderId]);
    return (
      await this.marketplaceClient.cancelSourceShipment(subOrderId, `source-cancel:${subOrderId}`)
    ).data;
  }

  async getAwbForOrders(input: { orderIds?: number[]; trackingNos?: string[] }) {
    const orderIds = [...new Set(input.orderIds ?? [])];
    const requestedTrackingNos = [
      ...new Set((input.trackingNos ?? []).map((value) => value.trim()).filter(Boolean)),
    ];
    if (!orderIds.length && !requestedTrackingNos.length) {
      throw new BadRequestException('Không có mã vận đơn để in nhãn');
    }

    const shippingOrders = await this.prisma.shippingOrder.findMany({
      where: {
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
        status: { not: ShippingOrderStatus.Cancelled },
        OR: [
          ...(orderIds.length ? [{ orderId: { in: orderIds } }] : []),
          ...(requestedTrackingNos.length ? [{ trackingNo: { in: requestedTrackingNos } }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    const uniqueByTracking = new Map(
      shippingOrders
        .filter((item): item is typeof item & { trackingNo: string } => Boolean(item.trackingNo))
        .map((item) => [item.trackingNo, item]),
    );
    if (!uniqueByTracking.size) throw new BadRequestException('Không có mã vận đơn để in nhãn');
    if (uniqueByTracking.size > 100) {
      throw new BadRequestException('Chỉ hỗ trợ tối đa 100 vận đơn mỗi lần');
    }

    const byProvider = new Map<ShippingProvider, string[]>();
    for (const item of uniqueByTracking.values()) {
      const values = byProvider.get(item.provider) ?? [];
      values.push(item.trackingNo);
      byProvider.set(item.provider, values);
    }

    const results = [];
    for (const [provider, trackingNos] of byProvider) {
      if (provider === ShippingProvider.SPX) {
        this.assertSpxEnabled();
        results.push({ provider, result: await this.spxClient.getAwbByTrackingNos(trackingNos) });
      } else if (provider === ShippingProvider.VTP) {
        this.assertVtpEnabled();
        results.push({ provider, result: await this.vtpClient.getAwbByTrackingNos(trackingNos) });
      } else {
        throw new BadRequestException('Đơn vị vận chuyển chưa hỗ trợ in nhãn');
      }
    }
    return results.length === 1 ? results[0].result : { providers: results };
  }

  async cancelShippingOrder(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingOrders: {
          where: {
            managedBy: ShippingManagedBy.Local,
            trackingNo: { not: null },
          },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.marketplaceSubOrderId) {
      throw new BadRequestException('Vận đơn này do Marketplace quản lý');
    }

    const shippingOrder = order.shippingOrders[0];
    if (!shippingOrder?.trackingNo) {
      const updated = await this.prisma.$transaction(async (tx) => {
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: OrderStatus.Cancel },
        });
        await this.orderInventory.restoreIfFinalCancelled(
          orderId,
          order.status,
          OrderStatus.Cancel,
          tx,
        );
        return updatedOrder;
      });
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        orderId,
        order.status,
        OrderStatus.Cancel,
      );
      return updated;
    }

    let raw: unknown;
    if (shippingOrder.provider === ShippingProvider.SPX) {
      this.assertSpxEnabled();
      const result = await this.spxClient.cancelOrders([shippingOrder.trackingNo]);
      const failure = result.failures.find((item) => item.trackingNo === shippingOrder.trackingNo);
      if (failure) throw new BadRequestException(failure.message || 'SPX hủy vận đơn thất bại');
      raw = result.raw;
    } else if (shippingOrder.provider === ShippingProvider.VTP) {
      this.assertVtpEnabled();
      raw = await this.vtpClient.updateStatus(shippingOrder.trackingNo, 4, 'Khách hàng hủy đơn');
    } else {
      throw new BadRequestException('Đơn vị vận chuyển chưa hỗ trợ hủy');
    }

    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      await tx.shippingOrder.update({
        where: { id: shippingOrder.id },
        data: {
          status: ShippingOrderStatus.Cancelled,
          responsePayload: this.toJson(raw),
          errorMessage: null,
        },
      });
      await tx.shippingEvent.create({
        data: {
          shippingOrderId: shippingOrder.id,
          provider: shippingOrder.provider,
          providerEventId: `cancel:${shippingOrder.trackingNo}:${Date.now()}`,
          trackingNo: shippingOrder.trackingNo,
          providerOrderId: shippingOrder.providerOrderId,
          eventType: 'cancel_order',
          status: 'success',
          rawPayload: this.toJson(raw),
        },
      });
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.Cancel },
      });
      await this.orderInventory.restoreIfFinalCancelled(
        orderId,
        order.status,
        OrderStatus.Cancel,
        tx,
      );
      return updated;
    });
    await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
      orderId,
      order.status,
      OrderStatus.Cancel,
    );
    return updatedOrder;
  }

  async updateVtpShippingOrder(orderId: number, input: VtpEditInput) {
    this.assertVtpEnabled();
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        shippingOrders: {
          where: {
            provider: ShippingProvider.VTP,
            managedBy: ShippingManagedBy.Local,
            trackingNo: { not: null },
          },
          orderBy: { createdAt: 'desc' },
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
    if (!order) throw new NotFoundException('Order not found');
    if (order.marketplaceSubOrderId) {
      return (
        await this.marketplaceClient.updateSourceVtpShipment(
          order.marketplaceSubOrderId,
          input,
          `source-vtp-update:${order.marketplaceSubOrderId}:${Date.now()}`,
        )
      ).data;
    }
    const shippingOrder = order.shippingOrders[0];
    if (!shippingOrder?.trackingNo) {
      throw new NotFoundException('Đơn hàng chưa có mã vận đơn ViettelPost');
    }
    const providerStatusCode = this.asNumber(shippingOrder.providerStatusCode);
    if (
      shippingOrder.status === ShippingOrderStatus.Cancelled ||
      (providerStatusCode !== undefined && providerStatusCode >= 200)
    ) {
      throw new BadRequestException('Chỉ sửa vận đơn ViettelPost trước khi lấy hàng');
    }

    const address = await this.prisma.address.findFirst({
      where: { id: order.addressId, isDeleted: 0 },
    });
    if (!address) throw new BadRequestException('Đơn hàng thiếu địa chỉ giao hàng');
    const draft = this.buildDraftFromOrder(order, address, ShippingProvider.VTP);
    const serviceCode =
      shippingOrder.providerServiceCode ?? (await this.vtpClient.estimateFee(draft)).serviceCode;
    const result = await this.vtpClient.editOrder(
      shippingOrder.trackingNo,
      draft,
      input,
      serviceCode,
    );

    return this.prisma.shippingOrder.update({
      where: { id: shippingOrder.id },
      data: {
        responsePayload: this.toJson(result),
        actualFee:
          result.MONEY_TOTAL === undefined ? undefined : Math.round(Number(result.MONEY_TOTAL)),
        errorMessage: null,
      },
    });
  }

  async updateVtpStatusAction(orderId: number, type: 2 | 3, note?: string) {
    this.assertVtpEnabled();
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { marketplaceSubOrderId: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.marketplaceSubOrderId) {
      return (
        await this.marketplaceClient.sourceVtpStatusAction(
          order.marketplaceSubOrderId,
          { type, note },
          `source-vtp-status:${order.marketplaceSubOrderId}:${type}:${Date.now()}`,
        )
      ).data;
    }
    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: {
        orderId,
        provider: ShippingProvider.VTP,
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!shippingOrder?.trackingNo) {
      throw new NotFoundException('Đơn hàng chưa có mã vận đơn ViettelPost');
    }
    if (shippingOrder.providerStatusCode !== '505') {
      throw new BadRequestException(
        'Chỉ duyệt hoàn hoặc phát tiếp khi ViettelPost đang ở trạng thái 505',
      );
    }
    const result = await this.vtpClient.updateStatus(shippingOrder.trackingNo, type, note);
    await this.prisma.shippingEvent.create({
      data: {
        shippingOrderId: shippingOrder.id,
        provider: ShippingProvider.VTP,
        providerEventId: `status-action:${type}:${shippingOrder.trackingNo}:${Date.now()}`,
        trackingNo: shippingOrder.trackingNo,
        providerOrderId: shippingOrder.providerOrderId,
        eventType: type === 2 ? 'confirm_return' : 'confirm_reattempt',
        status: 'success',
        rawPayload: this.toJson(result),
      },
    });
    return result;
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
      where: {
        orderId,
        provider: ShippingProvider.SPX,
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
      },
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
      where: {
        orderId,
        provider: ShippingProvider.SPX,
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
      },
      orderBy: { createdAt: 'desc' },
    });
    if (!shippingOrder?.trackingNo) throw new NotFoundException('Đơn hàng chưa có mã vận đơn SPX');

    const [track] = await this.spxClient.trackOrders({ trackingNos: [shippingOrder.trackingNo] });
    if (!track) throw new BadRequestException('SPX không trả về thông tin vận đơn');

    const previousOrder = await this.prisma.order.findUnique({
      where: { id: shippingOrder.orderId },
      select: { status: true },
    });
    const mappedStatus = mapSpxStatusToOrderStatus(track.status, track.statusCode);
    const trackingChanged = this.hasSpxTrackingStateChanged(
      shippingOrder,
      previousOrder?.status,
      track,
      mappedStatus,
    );
    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await this.applyTrackOrderResult(tx, shippingOrder.id, track);
      if (previousOrder && mappedStatus) {
        await this.orderInventory.restoreIfFinalCancelled(
          shippingOrder.orderId,
          previousOrder.status,
          mappedStatus,
          tx,
        );
      }
      return updated;
    });
    if (previousOrder && mappedStatus) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        shippingOrder.orderId,
        previousOrder.status,
        mappedStatus,
      );
    }
    if (trackingChanged) {
      await this.adminNotifications.publishRealtimeToActiveAdmins('shipping.spx.updated', {
        provider: 'SPX',
        source: 'manual',
        orderIds: [orderId],
        occurredAt: new Date().toISOString(),
      });
    }
    return result;
  }

  async refreshTrackings(input: { orderIds?: number[]; limit?: number } = {}) {
    this.assertSpxEnabled();

    const uniqueOrderIds = input.orderIds
      ? [...new Set(input.orderIds)].filter((id) => Number.isInteger(id) && id > 0)
      : undefined;
    const candidates = await this.prisma.shippingOrder.findMany({
      where: {
        provider: ShippingProvider.SPX,
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
        order: {
          status: {
            in: [
              OrderStatus.Pending,
              OrderStatus.Prepare,
              OrderStatus.Delivering,
              OrderStatus.SoftCancel,
            ],
          },
          ...(uniqueOrderIds ? { id: { in: uniqueOrderIds } } : {}),
        },
      },
      include: { order: { select: { status: true } } },
      orderBy: { createdAt: 'desc' },
      ...(input.limit ? { take: input.limit } : {}),
    });

    const latestByOrderId = new Map<number, (typeof candidates)[number]>();
    for (const shippingOrder of candidates) {
      if (!latestByOrderId.has(shippingOrder.orderId))
        latestByOrderId.set(shippingOrder.orderId, shippingOrder);
    }

    const shippingOrders = [...latestByOrderId.values()];
    const skipped = uniqueOrderIds ? Math.max(uniqueOrderIds.length - shippingOrders.length, 0) : 0;
    if (!shippingOrders.length) return { total: 0, refreshed: 0, failed: 0, skipped };

    const trackingToShippingOrder = new Map<string, (typeof shippingOrders)[number]>();
    const providerOrderToShippingOrder = new Map<string, (typeof shippingOrders)[number]>();
    for (const shippingOrder of shippingOrders) {
      if (shippingOrder.trackingNo)
        trackingToShippingOrder.set(shippingOrder.trackingNo, shippingOrder);
      if (shippingOrder.providerOrderId)
        providerOrderToShippingOrder.set(shippingOrder.providerOrderId, shippingOrder);
    }

    let refreshed = 0;
    let failed = 0;
    const changedOrderIds = new Set<number>();
    const trackingNos = [...trackingToShippingOrder.keys()];
    for (let index = 0; index < trackingNos.length; index += 50) {
      const chunk = trackingNos.slice(index, index + 50);
      let tracks: ShippingTrackOrderResult[] = [];

      try {
        tracks = await this.spxClient.trackOrders({ trackingNos: chunk });
      } catch (error) {
        failed += chunk.length;
        const message = error instanceof Error ? error.message : 'SPX track order failed';
        this.logger.warn(`SPX tracking refresh failed for ${chunk.length} orders: ${message}`);
        continue;
      }

      const matchedShippingOrderIds = new Set<number>();
      for (const track of tracks) {
        const shippingOrder =
          (track.trackingNo ? trackingToShippingOrder.get(track.trackingNo) : undefined) ??
          (track.providerOrderId
            ? providerOrderToShippingOrder.get(track.providerOrderId)
            : undefined);
        if (!shippingOrder) continue;

        matchedShippingOrderIds.add(shippingOrder.id);
        const mappedStatus = mapSpxStatusToOrderStatus(track.status, track.statusCode);
        const trackingChanged = this.hasSpxTrackingStateChanged(
          shippingOrder,
          shippingOrder.order.status,
          track,
          mappedStatus,
        );

        try {
          await this.prisma.$transaction(async (tx) => {
            await this.applyTrackOrderResult(tx, shippingOrder.id, track);
            if (mappedStatus) {
              await this.orderInventory.restoreIfFinalCancelled(
                shippingOrder.orderId,
                shippingOrder.order.status,
                mappedStatus,
                tx,
              );
            }
          });
          if (mappedStatus) {
            await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
              shippingOrder.orderId,
              shippingOrder.order.status,
              mappedStatus,
            );
          }
          refreshed += 1;
          if (trackingChanged) changedOrderIds.add(shippingOrder.orderId);
        } catch (error) {
          failed += 1;
          const message =
            error instanceof Error ? error.message : 'Unable to apply SPX tracking result';
          this.logger.warn(
            `SPX tracking apply failed for order #${shippingOrder.orderId}: ${message}`,
          );
        }
      }

      failed += chunk.filter((trackingNo) => {
        const shippingOrder = trackingToShippingOrder.get(trackingNo);
        return shippingOrder ? !matchedShippingOrderIds.has(shippingOrder.id) : true;
      }).length;
    }

    if (changedOrderIds.size) {
      await this.adminNotifications.publishRealtimeToActiveAdmins('shipping.spx.updated', {
        provider: 'SPX',
        source: 'poll',
        orderIds: [...changedOrderIds],
        occurredAt: new Date().toISOString(),
      });
    }

    return { total: shippingOrders.length, refreshed, failed, skipped };
  }

  async confirmSpxOrder(orderId: number, operation: 1 | 2) {
    this.assertSpxEnabled();

    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: {
        orderId,
        provider: ShippingProvider.SPX,
        managedBy: ShippingManagedBy.Local,
        trackingNo: { not: null },
      },
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

    void this.processSpxWebhookEvent(webhookEvent.id);

    return { received: true, duplicate: false };
  }

  private async processSpxWebhookEvent(id: number) {
    const event = await this.prisma.shippingWebhookEvent.findUnique({ where: { id } });
    if (!event || event.provider !== ShippingProvider.SPX || event.processedAt) {
      return { processed: Boolean(event?.processedAt), skipped: true };
    }

    const lockKey = `shipping:spx:webhook:${id}`;
    const lockValue = randomUUID();
    const locked = await this.redis.getClient().set(lockKey, lockValue, 'EX', 60, 'NX');
    if (locked !== 'OK') return { processed: false, skipped: true };

    try {
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { attemptCount: { increment: 1 }, errorMessage: null },
      });
      await this.applySpxWebhookPayload(event.eventType, this.toRecord(event.rawPayload));
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { processedAt: new Date(), errorMessage: null },
      });
      await this.adminNotifications.publishRealtimeToActiveAdmins('shipping.spx.updated', {
        webhookEventId: id,
        occurredAt: new Date().toISOString(),
      });
      return { processed: true, skipped: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process SPX webhook';
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { errorMessage: message },
      });
      this.logger.error(`SPX webhook #${id} failed: ${message}`);
      return { processed: false, skipped: false, error: message };
    } finally {
      await this.redis
        .getClient()
        .eval(
          'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) end return 0',
          1,
          lockKey,
          lockValue,
        )
        .catch(() => undefined);
    }
  }

  async handleVtpWebhook(payload: unknown) {
    const rawPayload = this.toRecord(payload);
    const data = this.toRecord(rawPayload.DATA ?? rawPayload.data ?? rawPayload);
    const payloadHash = createHash('sha256').update(JSON.stringify(rawPayload)).digest('hex');
    const existing = await this.prisma.shippingWebhookEvent.findUnique({
      where: { payloadHash },
    });
    if (existing) return { status: 200, received: true, duplicate: true };

    const trackingNo = this.asString(data.ORDER_NUMBER);
    const statusCode = this.asNumber(data.ORDER_STATUS);
    const webhookEvent = await this.prisma.shippingWebhookEvent.create({
      data: {
        provider: ShippingProvider.VTP,
        eventId:
          trackingNo && statusCode !== undefined
            ? `${trackingNo}:${statusCode}:${this.asString(data.ORDER_STATUSDATE) ?? payloadHash.slice(0, 12)}`
            : payloadHash,
        eventType: 'order_status',
        payloadHash,
        rawPayload: this.toJson(rawPayload),
      },
    });

    void this.processVtpWebhookEvent(webhookEvent.id);
    return { status: 200, received: true, duplicate: false };
  }

  async retryVtpWebhookEvent(id: number) {
    const event = await this.prisma.shippingWebhookEvent.findFirst({
      where: { id, provider: ShippingProvider.VTP },
    });
    if (!event) throw new NotFoundException('ViettelPost webhook event not found');
    if (event.processedAt) return { processed: true, duplicate: true };
    return this.processVtpWebhookEvent(id);
  }

  private async processVtpWebhookEvent(id: number) {
    const event = await this.prisma.shippingWebhookEvent.findUnique({ where: { id } });
    if (!event || event.provider !== ShippingProvider.VTP || event.processedAt) {
      return { processed: Boolean(event?.processedAt), skipped: true };
    }

    const lockKey = `shipping:vtp:webhook:${id}`;
    const lockValue = randomUUID();
    const locked = await this.redis.getClient().set(lockKey, lockValue, 'EX', 60, 'NX');
    if (locked !== 'OK') return { processed: false, skipped: true };

    try {
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { attemptCount: { increment: 1 }, errorMessage: null },
      });
      const rawPayload = this.toRecord(event.rawPayload);
      const data = this.toRecord(
        rawPayload.DATA ?? rawPayload.data ?? rawPayload,
      ) as VtpWebhookData;
      const orderId = await this.applyVtpWebhookData(data, event.payloadHash);
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { processedAt: new Date(), errorMessage: null },
      });
      if (orderId) {
        await this.adminNotifications.publishRealtimeToActiveAdmins('shipping.vtp.updated', {
          provider: 'VTP',
          source: 'webhook',
          webhookEventId: id,
          orderIds: [orderId],
          occurredAt: new Date().toISOString(),
        });
      }
      return { processed: true, skipped: false };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to process VTP webhook';
      await this.prisma.shippingWebhookEvent.update({
        where: { id },
        data: { errorMessage: message },
      });
      this.logger.error(`VTP webhook #${id} failed: ${message}`);
      return { processed: false, skipped: false, error: message };
    } finally {
      await this.redis
        .getClient()
        .eval(
          'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) end return 0',
          1,
          lockKey,
          lockValue,
        )
        .catch(() => undefined);
    }
  }

  private async applyVtpWebhookData(data: VtpWebhookData, payloadHash: string) {
    const trackingNo = this.asString(data.ORDER_NUMBER);
    const providerOrderId = this.asString(data.ORDER_REFERENCE);
    const statusCode = this.asNumber(data.ORDER_STATUS);
    if ((!trackingNo && !providerOrderId) || statusCode === undefined) {
      throw new BadRequestException('ViettelPost webhook thiếu mã vận đơn hoặc trạng thái');
    }

    const shippingOrder = await this.prisma.shippingOrder.findFirst({
      where: {
        provider: ShippingProvider.VTP,
        managedBy: ShippingManagedBy.Local,
        OR: [
          ...(trackingNo ? [{ trackingNo }] : []),
          ...(providerOrderId ? [{ providerOrderId }] : []),
        ],
      },
      include: { order: { select: { status: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const happenedAt = this.vtpDateToDate(data.ORDER_STATUSDATE);
    const latestEvent = shippingOrder
      ? await this.prisma.shippingEvent.findFirst({
          where: { shippingOrderId: shippingOrder.id, provider: ShippingProvider.VTP },
          orderBy: [{ happenedAt: 'desc' }, { createdAt: 'desc' }],
        })
      : null;
    const pickedUp = shippingOrder
      ? Boolean(
          await this.prisma.shippingEvent.findFirst({
            where: {
              shippingOrderId: shippingOrder.id,
              provider: ShippingProvider.VTP,
              statusCode: '200',
            },
            select: { id: true },
          }),
        ) || shippingOrder.providerStatusCode === '200'
      : false;
    const mapping = mapVtpStatus(statusCode, this.asBoolean(data.IS_RETURNING), pickedUp);
    const currentCode = this.asNumber(shippingOrder?.providerStatusCode);
    const currentMapping =
      currentCode === undefined ? undefined : mapVtpStatus(currentCode, false, pickedUp);
    const outOfOrder = Boolean(
      happenedAt && latestEvent?.happenedAt && happenedAt < latestEvent.happenedAt,
    );
    const terminalRegression = Boolean(currentMapping?.terminal && !mapping.terminal);
    const shouldApply = Boolean(shippingOrder && !outOfOrder && !terminalRegression);
    const previousStatus = shippingOrder?.order.status;

    await this.prisma.$transaction(async (tx) => {
      if (shippingOrder && shouldApply) {
        await tx.shippingOrder.update({
          where: { id: shippingOrder.id },
          data: {
            status:
              mapping.shipmentStatus === 'Cancelled'
                ? ShippingOrderStatus.Cancelled
                : mapping.shipmentStatus === 'Failed'
                  ? ShippingOrderStatus.Failed
                  : ShippingOrderStatus.Created,
            ...(trackingNo ? { trackingNo } : {}),
            ...(providerOrderId ? { providerOrderId } : {}),
            providerStatus: this.asString(data.STATUS_NAME) ?? mapping.shipmentStatus,
            providerStatusCode: String(statusCode),
            providerServiceCode: this.asString(data.ORDER_SERVICE),
            expectedDelivery: this.asString(data.EXPECTED_DELIVERY),
            trackingSyncedAt: new Date(),
            actualFee: Math.round(
              this.asNumber(data.MONEY_TOTALFEE) ??
                this.asNumber(data.MONEY_TOTAL) ??
                Number(shippingOrder.actualFee ?? shippingOrder.estimatedFee ?? 0),
            ),
            responsePayload: this.toJson(data),
            errorMessage: null,
          },
        });
        if (mapping.orderStatus) {
          await tx.order.updateMany({
            where: {
              id: shippingOrder.orderId,
              ...(mapping.terminal
                ? {}
                : { status: { notIn: SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES } }),
            },
            data: {
              ...(trackingNo ? { trackingCode: trackingNo } : {}),
              status: mapping.orderStatus,
            },
          });
          if (mapping.restoreInventory && previousStatus) {
            await this.orderInventory.restoreIfFinalCancelled(
              shippingOrder.orderId,
              previousStatus,
              mapping.orderStatus,
              tx,
            );
          }
        }
      }

      await tx.shippingEvent.createMany({
        data: [
          {
            shippingOrderId: shippingOrder?.id,
            provider: ShippingProvider.VTP,
            providerEventId: `${trackingNo ?? providerOrderId}:${statusCode}:${this.asString(data.ORDER_STATUSDATE) ?? payloadHash.slice(0, 12)}`,
            trackingNo,
            providerOrderId,
            eventType: 'order_status',
            status: this.asString(data.STATUS_NAME) ?? mapping.shipmentStatus,
            statusCode: String(statusCode),
            message:
              this.asString(data.NOTE) ??
              this.asString(data.LOCATION_CURRENTLY) ??
              this.asString(data.LOCALION_CURRENTLY),
            happenedAt,
            rawPayload: this.toJson(data),
          },
        ],
        skipDuplicates: true,
      });
    });

    if (
      shippingOrder &&
      shouldApply &&
      mapping.restoreInventory &&
      mapping.orderStatus &&
      previousStatus
    ) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        shippingOrder.orderId,
        previousStatus,
        mapping.orderStatus,
      );
    }

    return shippingOrder && shouldApply ? shippingOrder.orderId : undefined;
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
          (
            [
              ShippingOrderStatus.Created,
              ShippingOrderStatus.Failed,
              ShippingOrderStatus.Cancelled,
            ] as ShippingOrderStatus[]
          ).includes(shippingOrder.status),
        );

      if (hasTracking || allResolved) return result;
      await this.delay(1000);
    }
    return result;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async marketplaceOrderMappings(orderIds: number[]) {
    const uniqueOrderIds = [...new Set(orderIds)].filter((id) => Number.isInteger(id) && id > 0);
    if (!uniqueOrderIds.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất một đơn hàng mua chéo');
    }
    if (uniqueOrderIds.length > 100) {
      throw new BadRequestException('Chỉ hỗ trợ tối đa 100 đơn mỗi lần');
    }
    const orders = await this.prisma.order.findMany({
      where: { id: { in: uniqueOrderIds } },
      select: { id: true, code: true, marketplaceSubOrderId: true },
    });
    if (orders.length !== uniqueOrderIds.length) {
      throw new NotFoundException('Một số đơn hàng không tồn tại');
    }
    const byId = new Map(orders.map((order) => [order.id, order]));
    return uniqueOrderIds.map((orderId) => {
      const order = byId.get(orderId);
      if (!order?.marketplaceSubOrderId) {
        throw new BadRequestException(`Đơn #${order?.code ?? orderId} không phải đơn mua chéo`);
      }
      return { orderId, orderCode: order.code, subOrderId: order.marketplaceSubOrderId };
    });
  }

  private async marketplaceSubOrderIds(orderIds: number[]) {
    return (await this.marketplaceOrderMappings(orderIds)).map((item) => item.subOrderId);
  }

  private enrichMarketplaceShippingResult(
    rawResult: unknown,
    mappings: Array<{ orderId: number; orderCode: string; subOrderId: string }>,
  ): Record<string, unknown> {
    const result = this.toRecord(rawResult);
    const failures = Array.isArray(result['failures'])
      ? result['failures'].map((rawFailure) => {
          const failure = this.toRecord(rawFailure);
          const mapping = mappings.find(
            (item) => item.subOrderId === this.asString(failure['subOrderId']),
          );
          return {
            ...failure,
            ...(mapping ? { orderId: mapping.orderId, orderCode: mapping.orderCode } : {}),
          };
        })
      : [];
    const providers = Array.isArray(result['providers'])
      ? result['providers'].map((rawProvider) => {
          const provider = this.toRecord(rawProvider);
          return {
            ...provider,
            result: this.enrichMarketplaceShippingResult(provider['result'], mappings),
          };
        })
      : undefined;
    return {
      ...result,
      ...(Array.isArray(result['failures']) ? { failures } : {}),
      ...(providers ? { providers } : {}),
    };
  }

  private async applySpxWebhookPayload(eventType: string, payload: Record<string, unknown>) {
    if (payload.batch_no !== undefined && payload.task_status !== undefined) {
      await this.applyBatchWebhook(payload);
      return;
    }

    const trackingNo =
      this.asString(payload.tracking_no) ?? this.asString(payload.forward_tracking_no);
    const providerOrderId =
      this.asString(payload.order_id) ?? this.asString(payload.customer_order_id);

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
    const shippingOrder = await this.findShippingOrderForProviderPayload(
      trackingNo,
      providerOrderId,
    );
    const previousOrder = shippingOrder
      ? await this.prisma.order.findUnique({
          where: { id: shippingOrder.orderId },
          select: { status: true },
        })
      : null;
    const mappedStatus = mapSpxStatusToOrderStatus(
      this.asString(payload.status),
      this.asString(payload.status_code),
    );

    await this.prisma.$transaction(async (tx) => {
      if (shippingOrder) {
        await tx.shippingOrder.update({
          where: { id: shippingOrder.id },
          data: {
            ...(trackingNo ? { trackingNo } : {}),
            ...(this.asString(payload.tracking_link)
              ? { trackingLink: this.asString(payload.tracking_link) }
              : {}),
            ...(this.asString(payload.status)
              ? { providerStatus: this.asString(payload.status) }
              : {}),
            ...(this.asString(payload.status_code)
              ? { providerStatusCode: this.asString(payload.status_code) }
              : {}),
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
              ? {
                  latestChargeableParcelLength: this.asNumber(
                    payload.latest_chargeable_parcel_length,
                  ),
                }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_parcel_width) !== undefined
              ? {
                  latestChargeableParcelWidth: this.asNumber(
                    payload.latest_chargeable_parcel_width,
                  ),
                }
              : {}),
            ...(this.asNumber(payload.latest_chargeable_parcel_height) !== undefined
              ? {
                  latestChargeableParcelHeight: this.asNumber(
                    payload.latest_chargeable_parcel_height,
                  ),
                }
              : {}),
            ...(this.asString(payload.driver_phone_number)
              ? { driverPhoneNumber: this.asString(payload.driver_phone_number) }
              : {}),
            responsePayload: this.toJson(payload),
          },
        });

        if (trackingNo || mappedStatus) {
          await tx.order.updateMany({
            where: {
              id: shippingOrder.orderId,
              ...(mappedStatus &&
              mappedStatus !== OrderStatus.Cancel &&
              mappedStatus !== OrderStatus.Return
                ? {
                    status: {
                      notIn: SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES,
                    },
                  }
                : {}),
            },
            data: {
              ...(trackingNo ? { trackingCode: trackingNo } : {}),
              ...(mappedStatus ? { status: mappedStatus } : {}),
            },
          });
        }

        if (previousOrder && mappedStatus) {
          await this.orderInventory.restoreIfFinalCancelled(
            shippingOrder.orderId,
            previousOrder.status,
            mappedStatus,
            tx,
          );
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

    if (shippingOrder && previousOrder && mappedStatus) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        shippingOrder.orderId,
        previousOrder.status,
        mappedStatus,
      );
    }
  }

  private hasSpxTrackingStateChanged(
    shippingOrder: {
      providerStatus: string | null;
      providerStatusCode: string | null;
      trackingNo: string | null;
      trackingLink: string | null;
    },
    previousOrderStatus: OrderStatus | undefined,
    track: ShippingTrackOrderResult,
    mappedStatus: OrderStatus | undefined,
  ) {
    const canUpdateOrder =
      Boolean(mappedStatus) &&
      (mappedStatus === OrderStatus.Cancel ||
        mappedStatus === OrderStatus.Return ||
        previousOrderStatus === undefined ||
        !SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES.includes(
          previousOrderStatus as (typeof SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES)[number],
        ));

    return (
      (track.status !== undefined && shippingOrder.providerStatus !== track.status) ||
      (track.statusCode !== undefined && shippingOrder.providerStatusCode !== track.statusCode) ||
      (track.trackingNo !== undefined && shippingOrder.trackingNo !== track.trackingNo) ||
      (track.trackingLink !== undefined && shippingOrder.trackingLink !== track.trackingLink) ||
      Boolean(mappedStatus && mappedStatus !== previousOrderStatus && canUpdateOrder)
    );
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

    const mappedStatus = mapSpxStatusToOrderStatus(track.status, track.statusCode);
    if (track.trackingNo || mappedStatus) {
      await tx.order.updateMany({
        where: {
          id: updated.orderId,
          ...(mappedStatus &&
          mappedStatus !== OrderStatus.Cancel &&
          mappedStatus !== OrderStatus.Return
            ? {
                status: {
                  notIn: SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES,
                },
              }
            : {}),
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
        managedBy: ShippingManagedBy.Local,
        OR: [
          ...(trackingNo ? [{ trackingNo }] : []),
          ...(providerOrderId ? [{ providerOrderId }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async buildDraftFromCheckout(
    tx: Prisma.TransactionClient,
    orderId: string,
    dto: CreateOrderDto,
    quoteItems: QuotedOrderItem[],
    payableAmountBeforeDelivery: number,
    provider: ShippingProvider,
  ): Promise<ShippingOrderDraft> {
    const recipient = await this.resolveRecipient(tx, dto, dto.paymentMethod, provider);
    return this.buildDraft(
      orderId,
      dto.paymentMethod,
      dto.note,
      quoteItems,
      recipient,
      payableAmountBeforeDelivery,
      provider,
    );
  }

  private buildDraftFromOrder(
    order: Prisma.OrderGetPayload<{
      include: {
        shippingOrders: true;
        orderProducts: {
          include: { product: { select: { id: true; name: true; image: true } }; variant: true };
        };
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
    provider: ShippingProvider = ShippingProvider.SPX,
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
          packageLengthCm: item.variant.packageLengthCm
            ? Number(item.variant.packageLengthCm)
            : null,
          packageWidthCm: item.variant.packageWidthCm ? Number(item.variant.packageWidthCm) : null,
          packageHeightCm: item.variant.packageHeightCm
            ? Number(item.variant.packageHeightCm)
            : null,
        },
      };
    });

    return this.buildDraft(
      order.code,
      order.paymentMethod,
      order.note ?? undefined,
      items,
      this.mapAddressToParty(address, order.paymentMethod, provider),
      Number(order.totalAmount),
      provider,
    );
  }

  private buildDraft(
    orderId: string,
    paymentMethod: PaymentMethod | undefined,
    note: string | undefined,
    quoteItems: QuotedOrderItem[],
    recipient: ShippingParty,
    payableAmount: number,
    provider: ShippingProvider,
  ): ShippingOrderDraft {
    const parcel = this.buildParcel(quoteItems, provider);
    const codAmount =
      paymentMethod === PaymentMethod.COD ? Math.max(Math.round(payableAmount), 0) : 0;
    if (provider === ShippingProvider.VTP) {
      return {
        orderId: orderId.slice(0, 100),
        serviceType: 0,
        sender: this.resolveSender(provider),
        recipient,
        paymentRole: 0,
        codAmount,
        collectType: 0,
        highValueProcessingCollection: 0,
        note: note?.slice(0, 150),
        parcel,
      };
    }

    const collectType = this.configService.get<number>('shipping.spx.collectType') ?? 2;
    const pickupTime = this.configService.get<number>('shipping.spx.pickupTime');
    const pickupTimeRangeId = this.configService.get<number>('shipping.spx.pickupTimeRangeId');
    const pickupTimeRange =
      this.configService.get<string>('shipping.spx.pickupTimeRange') || undefined;

    if (collectType === 1 && (!pickupTime || !pickupTimeRangeId || !pickupTimeRange)) {
      throw new BadRequestException(
        'SPX pickup cần cấu hình pickup_time, pickup_time_range_id và pickup_time_range',
      );
    }

    return {
      orderId: orderId.slice(0, 32),
      serviceType: this.configService.get<number>('shipping.spx.serviceType') ?? 1,
      sender: this.resolveSender(provider),
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

  private buildParcel(quoteItems: QuotedOrderItem[], provider: ShippingProvider) {
    const parcelItems: ShippingParcelItem[] = quoteItems.map((item) => {
      const weight = item.variant.packageWeightGrams ?? 0;
      if (!Number.isFinite(weight) || weight <= 0) {
        throw new BadRequestException(
          `Biến thể ${item.variant.name} chưa có trọng lượng vận chuyển hợp lệ`,
        );
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

    const totalWeight = parcelItems.reduce(
      (sum, item) => sum + item.weightGrams * item.quantity,
      0,
    );
    const totalQuantity = quoteItems.reduce((sum, item) => sum + item.quantity, 0);
    if (provider === ShippingProvider.SPX && totalWeight > SPX_VN_MAX_PARCEL_WEIGHT_GRAMS) {
      throw new BadRequestException(SPX_VN_MAX_PARCEL_WEIGHT_MESSAGE);
    }

    const lengthCm = this.maxOptionalDimension(
      quoteItems.map((item) => item.variant.packageLengthCm),
    );
    const widthCm = this.maxOptionalDimension(
      quoteItems.map((item) => item.variant.packageWidthCm),
    );
    const heightCm = this.maxOptionalDimension(
      quoteItems.map((item) => item.variant.packageHeightCm),
    );
    if (
      provider === ShippingProvider.SPX &&
      [lengthCm, widthCm, heightCm].every((value) => value !== undefined)
    ) {
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
      itemName: parcelItems[0]?.name ?? 'Zalo order',
      itemQuantity: totalQuantity,
      insuredValue: quoteItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0),
      items: parcelItems,
    };
  }

  private maxOptionalDimension(values: Array<number | null | undefined>) {
    const normalized = values
      .map((value) => (value === null || value === undefined ? undefined : Number(value)))
      .filter(
        (value): value is number => value !== undefined && Number.isFinite(value) && value > 0,
      );
    if (!normalized.length) return undefined;
    return Math.max(...normalized);
  }

  private async resolveRecipient(
    tx: Prisma.TransactionClient,
    dto: CreateOrderDto,
    paymentMethod: PaymentMethod | undefined,
    provider: ShippingProvider,
  ) {
    if (dto.address) return this.mapCheckoutAddressToParty(dto.address, paymentMethod, provider);
    if (!dto.addressId)
      throw new BadRequestException('Thiếu địa chỉ giao hàng để tính phí vận chuyển');

    const address = await tx.address.findFirst({ where: { id: dto.addressId, isDeleted: 0 } });
    if (!address) throw new BadRequestException('Không tìm thấy địa chỉ giao hàng');
    return this.mapAddressToParty(address, paymentMethod, provider);
  }

  private mapCheckoutAddressToParty(
    address: NonNullable<CreateOrderDto['address']>,
    paymentMethod: PaymentMethod | undefined,
    provider: ShippingProvider,
  ): ShippingParty {
    if (provider === ShippingProvider.VTP) {
      return {
        name: address.cneeName,
        phone: address.cneePhone,
        state: address.city,
        city: address.ward,
        district: address.district,
        detailAddress: address.fullAddr,
      };
    }
    const normalized = this.normalizeRecipientAddress(
      address.city,
      address.district,
      address.ward,
      paymentMethod,
    );
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

  private mapAddressToParty(
    address: {
      cneeName: string | null;
      cneePhone: string | null;
      city: string | null;
      district: string | null;
      ward: string | null;
      fullAddr: string | null;
    },
    paymentMethod: PaymentMethod | undefined,
    provider: ShippingProvider,
  ): ShippingParty {
    if (provider === ShippingProvider.VTP) {
      return {
        name: address.cneeName ?? '',
        phone: address.cneePhone ?? '',
        state: address.city ?? '',
        city: address.ward ?? '',
        district: address.district ?? '',
        detailAddress: address.fullAddr ?? '',
      };
    }
    const normalized = this.normalizeRecipientAddress(
      address.city,
      address.district,
      address.ward,
      paymentMethod,
    );
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

  private resolveSender(provider: ShippingProvider): ShippingParty {
    if (provider === ShippingProvider.VTP) {
      const sender = this.configService.get<{ name: string; phone: string; address: string }>(
        'shipping.vtp.sender',
      );
      if (!sender?.name || !sender.phone || !sender.address) {
        throw new BadRequestException('Thiếu cấu hình địa chỉ gửi hàng ViettelPost');
      }
      return {
        name: sender.name,
        phone: sender.phone,
        state: '',
        city: '',
        district: '',
        detailAddress: sender.address,
      };
    }

    const sender = this.configService.get<ShippingParty>('shipping.spx.sender');
    const addressVersion =
      this.configService.get<number>('shipping.spx.addressVersion') === 2 ? 2 : 0;
    const collectType = this.configService.get<number>('shipping.spx.collectType') ?? 2;

    if (!sender?.name || !sender.phone || !sender.state || !sender.city || !sender.detailAddress) {
      throw new BadRequestException('Thiếu cấu hình địa chỉ gửi hàng SPX');
    }

    if (addressVersion === 2) {
      const normalized = normalizeSpxSenderAddress(sender.state, sender.city);
      if (!normalized) {
        throw new BadRequestException(
          'Địa chỉ gửi hàng SPX đã cũ, vui lòng cập nhật lại địa chỉ mới.',
        );
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

  private normalizeShippingCreateResult(
    rawResult: unknown,
    provider: ShippingProvider,
    orderIds: number[],
    orders: Array<{ id: number; code: string; shippingProvider: ShippingProvider }>,
  ): Record<string, unknown> {
    const result = this.toRecord(rawResult);
    const batch = this.toRecord(result['batch']);
    const shippingOrders = Array.isArray(result['shippingOrders'])
      ? result['shippingOrders'].map((item) => this.toRecord(item))
      : [];
    const existingFailures = Array.isArray(result['failures']) ? result['failures'] : [];
    const derivedFailures = shippingOrders
      .filter((item) => item['status'] === ShippingOrderStatus.Failed)
      .map((item) => {
        const orderId = this.asNumber(item['orderId']);
        const order = orders.find((candidate) => candidate.id === orderId);
        return {
          ...(orderId !== undefined ? { orderId } : {}),
          ...(order?.code ? { orderCode: order.code } : {}),
          provider,
          stage: 'create',
          message: this.asString(item['errorMessage']) ?? 'Đơn vị vận chuyển từ chối yêu cầu',
          ...(this.asString(item['trackingNo'])
            ? { trackingNo: this.asString(item['trackingNo']) }
            : {}),
        };
      });
    const failures = existingFailures.length ? existingFailures : derivedFailures;
    const failCount =
      this.asNumber(result['failCount']) ??
      this.asNumber(batch['failCount']) ??
      failures.length;
    const totalCount = this.asNumber(result['totalCount']) ?? orderIds.length;
    const successCount =
      this.asNumber(result['successCount']) ??
      this.asNumber(batch['successCount']) ??
      Math.max(totalCount - failCount, 0);
    const trackingNos = Array.isArray(result['trackingNos'])
      ? result['trackingNos']
      : shippingOrders
          .map((item) => this.asString(item['trackingNo']))
          .filter((value): value is string => Boolean(value));
    return {
      ...result,
      totalCount,
      successCount,
      failCount,
      trackingNos,
      failures,
      awbFailures: Array.isArray(result['awbFailures']) ? result['awbFailures'] : [],
    };
  }

  private shippingFailuresFromError(
    error: unknown,
    provider: ShippingProvider,
    orderIds: number[],
    orders: Array<{ id: number; code: string; shippingProvider: ShippingProvider }>,
  ) {
    const response = error instanceof HttpException ? this.toRecord(error.getResponse()) : {};
    const details = this.toRecord(response['details']);
    const upstreamFailures = Array.isArray(details['failures']) ? details['failures'] : [];
    if (upstreamFailures.length) return upstreamFailures;
    const message =
      this.asString(response['message']) ??
      (error instanceof Error ? error.message : 'Đơn vị vận chuyển từ chối yêu cầu');
    return orderIds.map((orderId) => ({
      orderId,
      orderCode: orders.find((order) => order.id === orderId)?.code,
      provider,
      stage: 'create',
      message,
    }));
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

  private assertVtpEnabled() {
    if (!this.isVtpEnabled()) {
      throw new BadRequestException('ViettelPost shipping chưa được bật');
    }
  }

  private asBoolean(value: unknown) {
    return value === true || value === 1 || value === '1' || value === 'true';
  }

  private vtpDateToDate(value: unknown) {
    const text = this.asString(value);
    if (!text) return undefined;
    const vietnamese = text.match(
      /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:[ T](\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/,
    );
    if (vietnamese) {
      const [, day, month, year, hour = '0', minute = '0', second = '0'] = vietnamese;
      const parsed = new Date(
        `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}+07:00`,
      );
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    }
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
