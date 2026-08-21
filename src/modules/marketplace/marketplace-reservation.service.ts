import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import marketplaceConfig from '../../config/marketplace.config.js';
import {
  DiscountType,
  MarketplaceReservationStatus,
  OrderPlatform,
  OrderStatus,
  PaymentMethod,
  ShippingManagedBy,
  ShippingOrderStatus,
  ShippingProvider,
  VoucherScope,
} from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SaleWorkStockSyncService } from '../salework-sync/salework-stock-sync.service.js';
import { generateOrderCode } from '../order/order-code.js';
import {
  MarketplaceQuoteMode,
  MarketplaceShipmentStatus,
} from './dto/marketplace-commerce.dto.js';
import type {
  MarketplaceConfirmReservationDto,
  MarketplaceShipmentEventDto,
  MarketplaceSourceReserveDto,
} from './dto/marketplace-commerce.dto.js';
import { MarketplaceCatalogService } from './marketplace-catalog.service.js';
import { MarketplaceCommerceService } from './marketplace-commerce.service.js';
import { AdminNotificationService } from '../admin-notification/admin-notification.service.js';

@Injectable()
export class MarketplaceReservationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commerce: MarketplaceCommerceService,
    private readonly catalog: MarketplaceCatalogService,
    private readonly saleWorkStockSync: SaleWorkStockSyncService,
    private readonly adminNotifications: AdminNotificationService,
    @Inject(marketplaceConfig.KEY)
    private readonly config: ConfigType<typeof marketplaceConfig>,
  ) {}

  async reserve(dto: MarketplaceSourceReserveDto) {
    const expiresAt = new Date(dto.expiresAt);
    const maximumExpiry = Date.now() + this.config.reservationTtlSeconds * 1000 + 30_000;
    if (expiresAt.getTime() <= Date.now() || expiresAt.getTime() > maximumExpiry) {
      throw new BadRequestException('Thời hạn reservation không hợp lệ');
    }

    await this.prisma.$transaction(
      async (tx) => {
        const existing = await tx.marketplaceCheckoutReservation.findUnique({
          where: { id: dto.reservationId },
        });
        if (existing) return;

        const quote = await this.commerce.finalizeWithTransaction(tx, dto);
        const productIds = new Set<number>();
        for (const item of quote.items) {
          const productId = this.positiveInt(item.sourceProductId, 'product');
          const variantId = this.positiveInt(item.sourceVariantId, 'variant');
          const updated = await tx.variant.updateMany({
            where: { id: variantId, productId, isDeleted: 0, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (!updated.count)
            throw new ConflictException(`Sản phẩm ${item.variantName} không đủ tồn kho`);
          productIds.add(productId);

          if (item.flashSaleItemId) {
            const flash = await tx.flashSaleItem.findUnique({
              where: { id: item.flashSaleItemId },
              select: { saleStock: true },
            });
            if (!flash) throw new ConflictException('Flash sale không còn khả dụng');
            const held = await tx.flashSaleItem.updateMany({
              where: { id: item.flashSaleItemId, sold: { lte: flash.saleStock - item.quantity } },
              data: { sold: { increment: item.quantity } },
            });
            if (!held.count) throw new ConflictException('Số lượng flash sale không còn đủ');
          }
        }

        const voucherSnapshots = this.selectedVouchers(quote);
        for (const selected of voucherSnapshots) {
          const voucherId = this.positiveInt(selected.id, 'voucher');
          const voucher = await tx.voucher.findUnique({ where: { id: voucherId } });
          if (!voucher) throw new ConflictException('Voucher không còn khả dụng');
          const remaining =
            voucher.usageLimit === null
              ? null
              : voucher.usageLimit - voucher.usedCount - voucher.reservedCount;
          const held = await tx.voucher.updateMany({
            where: {
              id: voucherId,
              usedCount: voucher.usedCount,
              ...(remaining === null ? {} : { reservedCount: { lte: remaining - 1 } }),
            },
            data: { reservedCount: { increment: 1 } },
          });
          if (!held.count) throw new ConflictException('Voucher đã hết lượt sử dụng');
        }

        await tx.marketplaceCheckoutReservation.create({
          data: {
            id: dto.reservationId,
            checkoutSessionId: dto.checkoutSessionId,
            hostShopCode: dto.context.hostShopCode,
            hostLocalUserId: dto.context.hostLocalUserId,
            opaqueCustomerRef: dto.context.opaqueCustomerRef,
            mode: dto.context.mode,
            expiresAt,
            shippingFee: quote.shippingFee,
            merchandiseSubtotal: quote.merchandiseSubtotal,
            itemVoucherDiscount: quote.itemVoucherDiscount,
            orderVoucherDiscount: quote.orderVoucherDiscount,
            shippingDiscount: quote.shippingVoucherDiscount,
            shippingAmount: quote.shippingAmount,
            totalAmount: quote.totalAmount,
            quoteSnapshot: quote as unknown as Prisma.InputJsonValue,
            inventoryItems: {
              create: quote.items.map((item) => ({
                productId: this.positiveInt(item.sourceProductId, 'product'),
                variantId: this.positiveInt(item.sourceVariantId, 'variant'),
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                pricingMode: item.pricingMode,
                flashSaleItemId: item.flashSaleItemId,
                itemSnapshot: item as unknown as Prisma.InputJsonValue,
              })),
            },
            vouchers: {
              create: voucherSnapshots.map((selected) => ({
                voucherId: this.positiveInt(selected.id, 'voucher'),
                sourceProductId: selected.sourceProductId,
                scope: selected.scope as VoucherScope,
                discountAmount: selected.discount,
                voucherSnapshot: selected as unknown as Prisma.InputJsonValue,
              })),
            },
          },
        });
        await this.catalog.recordProductChanges(tx, productIds);
      },
      { isolationLevel: 'Serializable' },
    );
    return this.get(dto.reservationId);
  }

  async confirm(id: string, dto: MarketplaceConfirmReservationDto) {
    let expired = false;
    let orderId: number | null = null;
    await this.prisma.$transaction(
      async (tx) => {
        const reservation = await this.findForUpdate(tx, id);
        if (reservation.status === MarketplaceReservationStatus.Confirmed) {
          orderId = reservation.orderId;
          return;
        }
        if (reservation.status !== MarketplaceReservationStatus.Reserved) {
          throw new ConflictException('Reservation không thể confirm ở trạng thái hiện tại');
        }
        if (reservation.expiresAt <= new Date()) {
          await this.restoreReserved(tx, reservation, MarketplaceReservationStatus.Expired);
          expired = true;
          return;
        }
        if (dto.hostShopCode !== reservation.hostShopCode) {
          throw new ConflictException('Host shop của đơn hàng không khớp reservation');
        }
        if (dto.paymentMethod !== PaymentMethod.COD) {
          throw new BadRequestException('Đơn hàng liên shop hiện chỉ hỗ trợ thanh toán COD');
        }
        const isLocalHost = reservation.mode === MarketplaceQuoteMode.LocalHost;

        const address = await tx.address.create({
          data: {
            userId: null,
            cneeName: dto.recipient.name,
            cneePhone: dto.recipient.phone,
            city: dto.recipient.state,
            district: dto.recipient.city,
            ward: dto.recipient.district ?? null,
            fullAddr: dto.recipient.detailAddress,
          },
        });
        const orderVoucher = reservation.vouchers.find(
          (item) => item.scope === VoucherScope.Order,
        );
        const shippingVoucher = reservation.vouchers.find(
          (item) => item.scope === VoucherScope.Shipping,
        );
        const itemVoucherAllocations = this.allocateItemVoucherDiscounts(reservation);
        const code = await this.uniqueOrderCode(tx);
        const order = await tx.order.create({
          data: {
            code,
            userId: isLocalHost ? reservation.hostLocalUserId : null,
            addressId: address.id,
            productVoucherId: orderVoucher?.voucherId ?? null,
            deliveryVoucherId: shippingVoucher?.voucherId ?? null,
            estAmount:
              Number(reservation.merchandiseSubtotal) -
              Number(reservation.itemVoucherDiscount),
            itemVoucherDiscount: reservation.itemVoucherDiscount,
            productDiscount: reservation.orderVoucherDiscount,
            deliveryFee: reservation.shippingFee,
            deliveryDiscount: reservation.shippingDiscount,
            deliveryAmount: reservation.shippingAmount,
            totalAmount: reservation.totalAmount,
            paymentMethod: dto.paymentMethod,
            note: dto.note?.trim() || null,
            ...(dto.invoiceRequest
              ? { invoiceRequest: dto.invoiceRequest as unknown as Prisma.InputJsonValue }
              : {}),
            platform: OrderPlatform.Marketplace,
            marketplaceParentId: dto.parentOrderId,
            marketplaceSubOrderId: dto.subOrderId,
            marketplaceReservationId: reservation.id,
            hostShopCode: dto.hostShopCode,
            opaqueCustomerRef: reservation.opaqueCustomerRef,
            recipientSnapshot: dto.recipient as unknown as Prisma.InputJsonValue,
            senderSnapshot: dto.sender as unknown as Prisma.InputJsonValue,
            orderProducts: {
              create: reservation.inventoryItems.map((item) => {
                const snapshot = item.itemSnapshot as Record<string, unknown>;
                const itemVoucher = reservation.vouchers.find(
                  (voucher) =>
                    voucher.scope === VoucherScope.Product &&
                    voucher.sourceProductId === String(item.productId),
                );
                const voucherSnapshot = itemVoucher?.voucherSnapshot as
                  | Record<string, unknown>
                  | undefined;
                return {
                  productId: item.productId,
                  variantId: item.variantId,
                  originalPrice: Number(snapshot.originalPrice ?? item.unitPrice),
                  finalPrice: item.unitPrice,
                  quantity: item.quantity,
                  pricingMode: item.pricingMode,
                  flashSaleId: this.optionalPositiveInt(snapshot.flashSaleId),
                  flashSaleType: this.optionalDiscountType(snapshot.flashSaleType),
                  flashSaleValue: this.optionalNumber(snapshot.flashSaleValue),
                  itemVoucherId: itemVoucher?.voucherId ?? null,
                  itemVoucherType: this.optionalDiscountType(
                    voucherSnapshot?.discountType,
                  ),
                  itemVoucherValue: this.optionalNumber(voucherSnapshot?.discountValue),
                  itemVoucherDiscount: itemVoucherAllocations.get(item.id) ?? 0,
                };
              }),
            },
          },
        });

        for (const item of reservation.vouchers) {
          const moved = await tx.voucher.updateMany({
            where: { id: item.voucherId, reservedCount: { gte: 1 } },
            data: { reservedCount: { decrement: 1 }, usedCount: { increment: 1 } },
          });
          if (!moved.count) throw new ConflictException('Voucher reservation không còn hợp lệ');

          if (isLocalHost && reservation.hostLocalUserId) {
            const existing = await tx.userVoucher.findFirst({
              where: {
                userId: reservation.hostLocalUserId,
                voucherId: item.voucherId,
                usedAt: null,
              },
            });
            const ownership = existing
              ? await tx.userVoucher.update({
                  where: { id: existing.id },
                  data: { usedAt: new Date() },
                })
              : await tx.userVoucher.create({
                  data: {
                    userId: reservation.hostLocalUserId,
                    voucherId: item.voucherId,
                    usedAt: new Date(),
                  },
                });
            await tx.marketplaceVoucherReservation.update({
              where: { id: item.id },
              data: { userVoucherId: ownership.id, userVoucherWasCreated: !existing },
            });
          }
        }
        await tx.marketplaceCheckoutReservation.update({
          where: { id },
          data: {
            status: MarketplaceReservationStatus.Confirmed,
            confirmedAt: new Date(),
            orderId: order.id,
          },
        });
        orderId = order.id;
      },
      { isolationLevel: 'Serializable' },
    );
    if (expired) throw new ConflictException('Reservation đã hết hạn');
    if (orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        select: { id: true, code: true, totalAmount: true, platform: true },
      });
      if (order) await this.adminNotifications.notifyOrderCreated(order);
    }
    if (orderId) await this.saleWorkStockSync.exportOrderStock(orderId);
    return this.get(id);
  }

  release(id: string) {
    return this.releaseWithStatus(id, MarketplaceReservationStatus.Released);
  }

  async compensate(id: string) {
    let cancelledOrder:
      | { id: number; previousStatus: OrderStatus }
      | null = null;
    await this.prisma.$transaction(
      async (tx) => {
        const reservation = await this.findForUpdate(tx, id);
        if (
          reservation.status === MarketplaceReservationStatus.Compensated ||
          reservation.status === MarketplaceReservationStatus.Released ||
          reservation.status === MarketplaceReservationStatus.Expired
        ) {
          return;
        }
        if (reservation.status === MarketplaceReservationStatus.Reserved) {
          await this.restoreReserved(tx, reservation, MarketplaceReservationStatus.Compensated);
          return;
        }
        if (reservation.status !== MarketplaceReservationStatus.Confirmed) {
          throw new ConflictException('Chỉ reservation đã confirm mới có thể compensate');
        }
        if (!reservation.order) {
          throw new ConflictException('Reservation đã confirm nhưng chưa có đơn hàng nguồn');
        }
        cancelledOrder = { id: reservation.order.id, previousStatus: reservation.order.status };
        await this.restoreConfirmed(
          tx,
          reservation,
          MarketplaceReservationStatus.Compensated,
          OrderStatus.Cancel,
        );
      },
      { isolationLevel: 'Serializable' },
    );
    const orderToReturn = cancelledOrder as
      | { id: number; previousStatus: OrderStatus }
      | null;
    if (orderToReturn) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        orderToReturn.id,
        orderToReturn.previousStatus,
        OrderStatus.Cancel,
      );
    }
    return this.get(id);
  }


  async refundOrder(subOrderId: string, reason?: string) {
    let reservationId: string | null = null;
    let stockReturn: { id: number; previousStatus: OrderStatus } | null = null;
    await this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { marketplaceSubOrderId: subOrderId },
          include: { marketplaceReservation: true },
        });
        if (!order?.marketplaceReservation) {
          throw new ConflictException('Không tìm thấy source order của sub-order marketplace');
        }
        reservationId = order.marketplaceReservation.id;
        if (
          order.status === OrderStatus.Refund ||
          order.marketplaceReservation.status === MarketplaceReservationStatus.Refunded
        ) {
          return;
        }
        const reservation = await this.findForUpdate(tx, order.marketplaceReservation.id);
        if (reservation.status !== MarketplaceReservationStatus.Confirmed) {
          throw new ConflictException('Source order không thể hoàn tiền ở trạng thái hiện tại');
        }
        stockReturn = { id: order.id, previousStatus: order.status };
        await this.restoreConfirmed(
          tx,
          reservation,
          MarketplaceReservationStatus.Refunded,
          OrderStatus.Refund,
        );
        if (reason?.trim()) {
          await tx.order.update({
            where: { id: order.id },
            data: { note: order.note ? `${order.note}\nRefund: ${reason.trim()}` : `Refund: ${reason.trim()}` },
          });
        }
      },
      { isolationLevel: 'Serializable' },
    );
    const transition = stockReturn as { id: number; previousStatus: OrderStatus } | null;
    if (transition) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        transition.id,
        transition.previousStatus,
        OrderStatus.Refund,
      );
    }
    if (!reservationId) throw new ConflictException('Không tìm thấy reservation marketplace');
    return this.get(reservationId);
  }

  async applyShipmentEvent(subOrderId: string, dto: MarketplaceShipmentEventDto) {
    let stockReturn: { id: number; previousStatus: OrderStatus; nextStatus: OrderStatus } | null = null;
    const result = await this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findUnique({
          where: { marketplaceSubOrderId: subOrderId },
          include: { marketplaceReservation: true },
        });
        if (!order || !order.marketplaceReservation) {
          throw new ConflictException('Không tìm thấy source order của sub-order marketplace');
        }

        const providerEventId = `marketplace:${dto.eventId}`;
        const duplicate = await tx.shippingEvent.findUnique({
          where: {
            provider_providerEventId: {
              provider: ShippingProvider.SPX,
              providerEventId,
            },
          },
        });
        if (duplicate) return { received: true, duplicate: true, orderId: order.id };

        const shippingStatus = this.shippingOrderStatus(dto.status);
        const shippingOrder = await tx.shippingOrder.upsert({
          where: { marketplaceShipmentId: dto.shipmentId },
          create: {
            orderId: order.id,
            provider: ShippingProvider.SPX,
            status: shippingStatus,
            managedBy: ShippingManagedBy.Marketplace,
            marketplaceShipmentId: dto.shipmentId,
            providerOrderId: dto.providerOrderId ?? null,
            trackingNo: dto.trackingNo ?? null,
            trackingLink: dto.trackingLink ?? null,
            providerStatus: dto.providerStatus ?? dto.status,
            providerStatusCode: dto.statusCode ?? null,
            trackingSyncedAt: new Date(),
            responsePayload: this.json(dto.rawPayload ?? dto),
          },
          update: {
            status: shippingStatus,
            providerOrderId: dto.providerOrderId ?? undefined,
            trackingNo: dto.trackingNo ?? undefined,
            trackingLink: dto.trackingLink ?? undefined,
            providerStatus: dto.providerStatus ?? dto.status,
            providerStatusCode: dto.statusCode ?? undefined,
            trackingSyncedAt: new Date(),
            responsePayload: this.json(dto.rawPayload ?? dto),
            errorMessage: dto.status === MarketplaceShipmentStatus.Failed ? dto.message : null,
          },
        });
        if (shippingOrder.orderId !== order.id) {
          throw new ConflictException('Shipment marketplace đã thuộc source order khác');
        }

        await tx.shippingEvent.create({
          data: {
            shippingOrderId: shippingOrder.id,
            provider: ShippingProvider.SPX,
            providerEventId,
            trackingNo: dto.trackingNo ?? shippingOrder.trackingNo,
            providerOrderId: dto.providerOrderId ?? shippingOrder.providerOrderId,
            eventType: 'marketplace_shipment',
            status: dto.providerStatus ?? dto.status,
            statusCode: dto.statusCode ?? null,
            message: dto.message ?? null,
            happenedAt: dto.happenedAt ? new Date(dto.happenedAt) : new Date(),
            rawPayload: this.json(dto.rawPayload ?? dto),
          },
        });

        const nextOrderStatus = this.marketplaceShipmentOrderStatus(dto.status);
        const reservation = await this.findForUpdate(tx, order.marketplaceReservation.id);
        if (
          (dto.status === MarketplaceShipmentStatus.Returned ||
            dto.status === MarketplaceShipmentStatus.Cancelled) &&
          reservation.status === MarketplaceReservationStatus.Confirmed
        ) {
          const terminalStatus =
            dto.status === MarketplaceShipmentStatus.Returned
              ? MarketplaceReservationStatus.Returned
              : MarketplaceReservationStatus.Compensated;
          const terminalOrderStatus =
            dto.status === MarketplaceShipmentStatus.Returned
              ? OrderStatus.Return
              : OrderStatus.Cancel;
          stockReturn = { id: order.id, previousStatus: order.status, nextStatus: terminalOrderStatus };
          await this.restoreConfirmed(tx, reservation, terminalStatus, terminalOrderStatus);
        } else if (
          nextOrderStatus &&
          order.status !== OrderStatus.Return &&
          order.status !== OrderStatus.Cancel
        ) {
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: nextOrderStatus,
              ...(dto.trackingNo ? { trackingCode: dto.trackingNo } : {}),
            },
          });
        } else if (dto.trackingNo && order.trackingCode !== dto.trackingNo) {
          await tx.order.update({ where: { id: order.id }, data: { trackingCode: dto.trackingNo } });
        }

        return { received: true, duplicate: false, orderId: order.id };
      },
      { isolationLevel: 'Serializable' },
    );

    const returnTransition = stockReturn as
      | { id: number; previousStatus: OrderStatus; nextStatus: OrderStatus }
      | null;
    if (returnTransition) {
      await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(
        returnTransition.id,
        returnTransition.previousStatus,
        returnTransition.nextStatus,
      );
    }
    return result;
  }

  @Cron('* * * * *')
  async expireReservations() {
    const expired = await this.prisma.marketplaceCheckoutReservation.findMany({
      where: { status: MarketplaceReservationStatus.Reserved, expiresAt: { lte: new Date() } },
      select: { id: true },
      take: 100,
    });
    for (const reservation of expired) {
      try {
        await this.releaseWithStatus(reservation.id, MarketplaceReservationStatus.Expired);
      } catch {
        // The next sweep retries transient failures; state transitions remain idempotent.
      }
    }
    await this.prisma.marketplaceIdempotencyRecord.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
  }

  private async releaseWithStatus(id: string, status: MarketplaceReservationStatus) {
    await this.prisma.$transaction(
      async (tx) => {
        const reservation = await this.findForUpdate(tx, id);
        if (
          reservation.status === MarketplaceReservationStatus.Released ||
          reservation.status === MarketplaceReservationStatus.Expired
        ) {
          return;
        }
        if (reservation.status !== MarketplaceReservationStatus.Reserved) {
          throw new ConflictException('Reservation không thể release ở trạng thái hiện tại');
        }
        await this.restoreReserved(tx, reservation, status);
      },
      { isolationLevel: 'Serializable' },
    );
    return this.get(id);
  }

  private async restoreReserved(
    tx: Prisma.TransactionClient,
    reservation: Awaited<ReturnType<MarketplaceReservationService['findForUpdate']>>,
    status: MarketplaceReservationStatus,
  ) {
    const productIds = new Set<number>();
    for (const item of reservation.inventoryItems) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
      if (item.flashSaleItemId) {
        await tx.flashSaleItem.updateMany({
          where: { id: item.flashSaleItemId, sold: { gte: item.quantity } },
          data: { sold: { decrement: item.quantity } },
        });
      }
      productIds.add(item.productId);
    }
    for (const item of reservation.vouchers) {
      await tx.voucher.updateMany({
        where: { id: item.voucherId, reservedCount: { gte: 1 } },
        data: { reservedCount: { decrement: 1 } },
      });
    }
    await tx.marketplaceCheckoutReservation.update({
      where: { id: reservation.id },
      data: { status, releasedAt: new Date() },
    });
    await this.catalog.recordProductChanges(tx, productIds);
  }

  private async restoreConfirmed(
    tx: Prisma.TransactionClient,
    reservation: Awaited<ReturnType<MarketplaceReservationService['findForUpdate']>>,
    status: MarketplaceReservationStatus,
    orderStatus: OrderStatus,
  ) {
    if (!reservation.order) {
      throw new ConflictException('Reservation đã confirm nhưng chưa có đơn hàng nguồn');
    }
    const productIds = new Set<number>();
    for (const item of reservation.inventoryItems) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });
      if (item.flashSaleItemId) {
        await tx.flashSaleItem.updateMany({
          where: { id: item.flashSaleItemId, sold: { gte: item.quantity } },
          data: { sold: { decrement: item.quantity } },
        });
      }
      productIds.add(item.productId);
    }
    for (const item of reservation.vouchers) {
      await tx.voucher.updateMany({
        where: { id: item.voucherId, usedCount: { gte: 1 } },
        data: { usedCount: { decrement: 1 } },
      });
      if (!item.userVoucherId) continue;
      if (item.userVoucherWasCreated) {
        await tx.userVoucher.deleteMany({ where: { id: item.userVoucherId } });
      } else {
        await tx.userVoucher.updateMany({
          where: { id: item.userVoucherId },
          data: { usedAt: null },
        });
      }
    }
    const now = new Date();
    await tx.marketplaceCheckoutReservation.update({
      where: { id: reservation.id },
      data: {
        status,
        ...(status === MarketplaceReservationStatus.Returned
          ? { returnedAt: now }
          : { releasedAt: now }),
      },
    });
    await tx.order.update({
      where: { id: reservation.order.id },
      data: { status: orderStatus },
    });
    await this.catalog.recordProductChanges(tx, productIds);
  }

  private shippingOrderStatus(status: MarketplaceShipmentStatus) {
    if (status === MarketplaceShipmentStatus.Failed) return ShippingOrderStatus.Failed;
    if (status === MarketplaceShipmentStatus.Cancelled) return ShippingOrderStatus.Cancelled;
    if (
      status === MarketplaceShipmentStatus.Pending ||
      status === MarketplaceShipmentStatus.Creating
    ) {
      return ShippingOrderStatus.Pending;
    }
    return ShippingOrderStatus.Created;
  }

  private marketplaceShipmentOrderStatus(status: MarketplaceShipmentStatus) {
    if (status === MarketplaceShipmentStatus.PendingPickup) return OrderStatus.Prepare;
    if (
      status === MarketplaceShipmentStatus.InTransit ||
      status === MarketplaceShipmentStatus.Returning
    ) {
      return OrderStatus.Delivering;
    }
    if (status === MarketplaceShipmentStatus.Delivered) return OrderStatus.Paid;
    if (status === MarketplaceShipmentStatus.Returned) return OrderStatus.Return;
    if (status === MarketplaceShipmentStatus.Cancelled) return OrderStatus.Cancel;
    return null;
  }

  private json(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private findForUpdate(tx: Prisma.TransactionClient, id: string) {
    return tx.marketplaceCheckoutReservation.findUniqueOrThrow({
      where: { id },
      include: { inventoryItems: true, vouchers: true, order: true },
    });
  }

  private async get(id: string) {
    const reservation = await this.prisma.marketplaceCheckoutReservation.findUniqueOrThrow({
      where: { id },
      include: { order: { select: { id: true, code: true, status: true } } },
    });
    return {
      ...(reservation.quoteSnapshot as Record<string, unknown>),
      reservationId: reservation.id,
      checkoutSessionId: reservation.checkoutSessionId,
      status: reservation.status,
      expiresAt: reservation.expiresAt.toISOString(),
      sourceOrder: reservation.order
        ? {
            id: reservation.order.id,
            code: reservation.order.code,
            status: reservation.order.status,
          }
        : null,
    };
  }

  private allocateItemVoucherDiscounts(
    reservation: Awaited<ReturnType<MarketplaceReservationService['findForUpdate']>>,
  ) {
    const result = new Map<string, number>();
    for (const voucher of reservation.vouchers) {
      if (voucher.scope !== VoucherScope.Product || !voucher.sourceProductId) continue;
      const items = reservation.inventoryItems.filter(
        (item) => String(item.productId) === voucher.sourceProductId,
      );
      const amounts = items.map((item) => Number(item.unitPrice) * item.quantity);
      const total = amounts.reduce((sum, amount) => sum + amount, 0);
      let allocated = 0;
      items.forEach((item, index) => {
        const discount =
          index === items.length - 1
            ? Number(voucher.discountAmount) - allocated
            : total > 0
              ? Math.floor((Number(voucher.discountAmount) * amounts[index]) / total)
              : 0;
        allocated += discount;
        result.set(item.id, discount);
      });
    }
    return result;
  }

  private async uniqueOrderCode(tx: Prisma.TransactionClient) {
    for (;;) {
      const code = generateOrderCode();
      const existing = await tx.order.findUnique({ where: { code }, select: { id: true } });
      if (!existing) return code;
    }
  }

  private optionalPositiveInt(value: unknown) {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }

  private optionalNumber(value: unknown) {
    if (value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private optionalDiscountType(value: unknown) {
    return value === DiscountType.Fixed || value === DiscountType.Percentage ? value : null;
  }

  private selectedVouchers(quote: {
    voucherSelection: {
      orderVoucherId?: string | null;
      shippingVoucherId?: string | null;
      itemVouchers?: Array<{ voucherId: string }>;
    };
    voucherCandidates: { order: unknown[]; shipping: unknown[]; items: unknown[] };
  }) {
    const candidates = [
      ...quote.voucherCandidates.order,
      ...quote.voucherCandidates.shipping,
      ...quote.voucherCandidates.items,
    ] as Array<{
      id: string;
      scope: VoucherScope;
      sourceProductId?: string;
      discount: number;
    }>;
    const ids = new Set(
      [
        quote.voucherSelection.orderVoucherId,
        quote.voucherSelection.shippingVoucherId,
        ...(quote.voucherSelection.itemVouchers ?? []).map((item) => item.voucherId),
      ].filter((value): value is string => Boolean(value)),
    );
    return [...ids].map((id) => {
      const candidate = candidates.find((item) => item.id === id);
      if (!candidate) throw new ConflictException('Voucher đã chọn không còn hợp lệ');
      return candidate;
    });
  }

  private positiveInt(value: string, label: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(`Mã ${label} nguồn không hợp lệ`);
    }
    return parsed;
  }
}
