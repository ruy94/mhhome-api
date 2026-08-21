import 'reflect-metadata';

import { ConflictException } from '@nestjs/common';
import {
  MarketplaceReservationStatus,
  OrderStatus,
  PaymentMethod,
  PricingMode,
  VoucherScope,
} from '../../generated/prisma/enums.js';
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class PrismaService {} }));
jest.mock('./marketplace-catalog.service.js', () => ({
  MarketplaceCatalogService: class MarketplaceCatalogService {},
}));
jest.mock('../salework-sync/salework-stock-sync.service.js', () => ({
  SaleWorkStockSyncService: class SaleWorkStockSyncService {},
}));
jest.mock('../admin-notification/admin-notification.service.js', () => ({
  AdminNotificationService: class {},
}));

import { MarketplaceReservationService } from './marketplace-reservation.service.js';
import {
  MarketplaceQuoteMode,
  MarketplaceShipmentStatus,
} from './dto/marketplace-commerce.dto.js';

describe('MarketplaceReservationService', () => {
  const tx = {
    marketplaceCheckoutReservation: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    address: { create: jest.fn() },
    variant: { updateMany: jest.fn(), update: jest.fn() },
    flashSaleItem: { findUnique: jest.fn(), updateMany: jest.fn() },
    voucher: { findUnique: jest.fn(), updateMany: jest.fn() },
    userVoucher: {
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
      updateMany: jest.fn(),
    },
    marketplaceVoucherReservation: { update: jest.fn() },
    order: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    shippingEvent: { findUnique: jest.fn(), create: jest.fn() },
    shippingOrder: { upsert: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
    marketplaceCheckoutReservation: {
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn(),
    },
    marketplaceIdempotencyRecord: { deleteMany: jest.fn() },
    order: {
      findUnique: jest.fn().mockResolvedValue({
        id: 19,
        code: 'ORD19',
        totalAmount: 100_000,
        platform: 'Marketplace',
      }),
    },
  };
  const commerce = { finalizeWithTransaction: jest.fn() };
  const catalog = { recordProductChanges: jest.fn() };
  const saleWorkStockSync = {
    exportOrderStock: jest.fn(),
    returnOrderStockIfFinalCancelled: jest.fn(),
  };
  const service = new MarketplaceReservationService(
    prisma as never,
    commerce as never,
    catalog as never,
    saleWorkStockSync as never,
    { notifyOrderCreated: jest.fn() } as never,
    { reservationTtlSeconds: 300 } as never,
  );

  beforeEach(() => jest.clearAllMocks());

  it('rejects an atomic stock hold when the available stock was taken concurrently', async () => {
    tx.marketplaceCheckoutReservation.findUnique.mockResolvedValue(null);
    commerce.finalizeWithTransaction.mockResolvedValue({
      items: [
        {
          sourceProductId: '1',
          sourceVariantId: '11',
          productName: 'Product',
          variantName: 'Variant',
          quantity: 1,
          unitPrice: 100_000,
          pricingMode: PricingMode.Retail,
          flashSaleItemId: null,
        },
      ],
      merchandiseSubtotal: 100_000,
      itemVoucherDiscount: 0,
      orderVoucherDiscount: 0,
      shippingFee: 20_000,
      shippingVoucherDiscount: 0,
      shippingAmount: 20_000,
      totalAmount: 120_000,
      voucherSelection: {},
      voucherCandidates: { order: [], shipping: [], items: [] },
    });
    tx.variant.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.reserve({
        reservationId: 'reservation-1',
        checkoutSessionId: 'session-1',
        expiresAt: new Date(Date.now() + 60_000).toISOString(),
        context: {
          hostShopCode: 'shop-a',
          hostLocalUserId: 7,
          opaqueCustomerRef: 'opaque',
          mode: 'LocalHost' as never,
        },
        items: [{ sourceProductId: '1', sourceVariantId: '11', quantity: 1 }],
        shippingFee: 20_000,
        voucherSelection: { mode: 'Manual' as never },
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.marketplaceCheckoutReservation.create).not.toHaveBeenCalled();
  });

  it('does not attach a CrossSource order or voucher to the host local user', async () => {
    const expiresAt = new Date(Date.now() + 60_000);
    tx.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-cross',
      status: MarketplaceReservationStatus.Reserved,
      orderId: null,
      expiresAt,
      hostShopCode: 'shop-a',
      hostLocalUserId: 7,
      opaqueCustomerRef: 'opaque',
      mode: MarketplaceQuoteMode.CrossSource,
      merchandiseSubtotal: 100_000,
      itemVoucherDiscount: 0,
      orderVoucherDiscount: 0,
      shippingFee: 20_000,
      shippingDiscount: 0,
      shippingAmount: 20_000,
      totalAmount: 120_000,
      inventoryItems: [
        {
          id: 'item-1',
          productId: 1,
          variantId: 11,
          quantity: 1,
          unitPrice: 100_000,
          pricingMode: PricingMode.Retail,
          flashSaleItemId: null,
          itemSnapshot: { originalPrice: 100_000 },
        },
      ],
      vouchers: [
        {
          id: 'voucher-reservation-1',
          voucherId: 3,
          scope: VoucherScope.Order,
          sourceProductId: null,
          discountAmount: 0,
          voucherSnapshot: {},
        },
      ],
      order: null,
    });
    tx.address.create.mockResolvedValue({ id: 31 });
    tx.order.create.mockResolvedValue({ id: 19 });
    tx.voucher.updateMany.mockResolvedValue({ count: 1 });
    tx.marketplaceCheckoutReservation.update.mockResolvedValue({});
    prisma.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-cross',
      checkoutSessionId: 'session-1',
      status: MarketplaceReservationStatus.Confirmed,
      expiresAt,
      quoteSnapshot: {},
      order: { id: 19, code: 'ORD19', status: OrderStatus.Pending },
    });

    await service.confirm('reservation-cross', {
      parentOrderId: 'parent-order-id',
      parentOrderCode: 'MP001',
      subOrderId: 'sub-order-id',
      subOrderCode: 'MPS001',
      hostShopCode: 'shop-a',
      recipient: {
        name: 'Customer',
        phone: '0911111111',
        state: 'Ha Noi',
        city: 'Ha Noi',
        detailAddress: 'Recipient address',
      },
      sender: {
        name: 'Source sender',
        phone: '0900000000',
        state: 'Ha Noi',
        city: 'Ha Noi',
        detailAddress: 'Sender address',
      },
      paymentMethod: PaymentMethod.COD,
    });

    expect(tx.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ userId: null }),
      }),
    );
    expect(tx.voucher.updateMany).toHaveBeenCalledWith({
      where: { id: 3, reservedCount: { gte: 1 } },
      data: { reservedCount: { decrement: 1 }, usedCount: { increment: 1 } },
    });
    expect(tx.userVoucher.findFirst).not.toHaveBeenCalled();
    expect(tx.userVoucher.create).not.toHaveBeenCalled();
    expect(tx.marketplaceVoucherReservation.update).not.toHaveBeenCalled();
  });

  it('does not restore stock again when release is retried after completion', async () => {
    tx.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-1',
      status: MarketplaceReservationStatus.Released,
      inventoryItems: [],
      vouchers: [],
    });
    prisma.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-1',
      checkoutSessionId: 'session-1',
      status: MarketplaceReservationStatus.Released,
      expiresAt: new Date(Date.now() + 60_000),
      quoteSnapshot: {},
    });

    const result = await service.release('reservation-1');

    expect(result.status).toBe(MarketplaceReservationStatus.Released);
    expect(tx.variant.update).not.toHaveBeenCalled();
  });

  it('compensates a reserved hold when central state is stale after confirm', async () => {
    tx.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-1',
      status: MarketplaceReservationStatus.Reserved,
      inventoryItems: [{ productId: 1, variantId: 11, quantity: 2, flashSaleItemId: null }],
      vouchers: [],
    });
    prisma.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({
      id: 'reservation-1',
      checkoutSessionId: 'session-1',
      status: MarketplaceReservationStatus.Compensated,
      expiresAt: new Date(Date.now() + 60_000),
      quoteSnapshot: {},
    });

    const result = await service.compensate('reservation-1');

    expect(result.status).toBe(MarketplaceReservationStatus.Compensated);
    expect(tx.variant.update).toHaveBeenCalledWith({
      where: { id: 11 },
      data: { stock: { increment: 2 } },
    });
    expect(tx.marketplaceCheckoutReservation.update).toHaveBeenCalledWith({
      where: { id: 'reservation-1' },
      data: {
        status: MarketplaceReservationStatus.Compensated,
        releasedAt: expect.any(Date),
      },
    });
  });

  it('acknowledges a duplicate shipment callback without restoring stock again', async () => {
    tx.order.findUnique.mockResolvedValue({
      id: 19,
      status: OrderStatus.Delivering,
      marketplaceReservation: { id: 'reservation-1' },
    });
    tx.shippingEvent.findUnique.mockResolvedValue({ id: 91 });

    const result = await service.applyShipmentEvent('sub-order-1', {
      eventId: 1,
      shipmentId: 'shipment-1',
      status: MarketplaceShipmentStatus.Returned,
    });

    expect(result).toEqual({ received: true, duplicate: true, orderId: 19 });
    expect(tx.shippingOrder.upsert).not.toHaveBeenCalled();
    expect(tx.variant.update).not.toHaveBeenCalled();
    expect(saleWorkStockSync.returnOrderStockIfFinalCancelled).not.toHaveBeenCalled();
  });

  it('maps Returning to delivery progress and Returned to the terminal return status', () => {
    const internal = service as unknown as {
      marketplaceShipmentOrderStatus(status: MarketplaceShipmentStatus): OrderStatus | null;
    };

    expect(internal.marketplaceShipmentOrderStatus(MarketplaceShipmentStatus.Returning)).toBe(
      OrderStatus.Delivering,
    );
    expect(internal.marketplaceShipmentOrderStatus(MarketplaceShipmentStatus.Returned)).toBe(
      OrderStatus.Return,
    );
  });
  it('refunds a confirmed source order and restores local and SaleWork stock once', async () => {
    tx.order.findUnique.mockResolvedValue({ id: 19, status: OrderStatus.Paid, marketplaceReservation: { id: 'reservation-1', status: MarketplaceReservationStatus.Confirmed } });
    tx.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({ id: 'reservation-1', status: MarketplaceReservationStatus.Confirmed, inventoryItems: [{ productId: 1, variantId: 11, quantity: 2, flashSaleItemId: null }], vouchers: [], order: { id: 19, status: OrderStatus.Paid } });
    prisma.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({ id: 'reservation-1', checkoutSessionId: 'session-1', status: MarketplaceReservationStatus.Refunded, expiresAt: new Date(Date.now() + 60_000), quoteSnapshot: {}, order: { id: 19, code: 'ORD19', status: OrderStatus.Refund } });

    const result = await service.refundOrder('sub-order-1', 'Customer refund');

    expect(result.status).toBe(MarketplaceReservationStatus.Refunded);
    expect(tx.variant.update).toHaveBeenCalledWith({ where: { id: 11 }, data: { stock: { increment: 2 } } });
    expect(tx.order.update).toHaveBeenCalledWith({ where: { id: 19 }, data: { status: OrderStatus.Refund } });
    expect(saleWorkStockSync.returnOrderStockIfFinalCancelled).toHaveBeenCalledTimes(1);
  });

  it('acknowledges a repeated refund without restoring stock again', async () => {
    tx.order.findUnique.mockResolvedValue({ id: 19, status: OrderStatus.Refund, marketplaceReservation: { id: 'reservation-1', status: MarketplaceReservationStatus.Refunded } });
    prisma.marketplaceCheckoutReservation.findUniqueOrThrow.mockResolvedValue({ id: 'reservation-1', checkoutSessionId: 'session-1', status: MarketplaceReservationStatus.Refunded, expiresAt: new Date(Date.now() + 60_000), quoteSnapshot: {}, order: { id: 19, code: 'ORD19', status: OrderStatus.Refund } });

    await service.refundOrder('sub-order-1');

    expect(tx.variant.update).not.toHaveBeenCalled();
    expect(saleWorkStockSync.returnOrderStockIfFinalCancelled).not.toHaveBeenCalled();
  });
});
