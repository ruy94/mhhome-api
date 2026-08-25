jest.mock('../../generated/prisma/client.js', () => ({
  OrderStatus: {
    Pending: 'Pending',
    Prepare: 'Prepare',
    Delivering: 'Delivering',
    Cancel: 'Cancel',
    SoftCancel: 'SoftCancel',
    Return: 'Return',
  },
  PaymentMethod: { COD: 'COD' },
  Prisma: {},
  ShippingManagedBy: { Local: 'Local' },
  ShippingOrderStatus: {
    Pending: 'Pending',
    Created: 'Created',
    Failed: 'Failed',
    Cancelled: 'Cancelled',
  },
  ShippingProvider: { SPX: 'SPX', JNT: 'JNT' },
}));
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../integrations/shipping/spx/spx-shipping-client.service.js', () => ({
  SpxShippingClientService: class {},
}));
jest.mock('../salework-sync/salework-stock-sync.service.js', () => ({
  SaleWorkStockSyncService: class {},
}));
jest.mock('../order-inventory/order-inventory.service.js', () => ({
  OrderInventoryService: class {},
}));
jest.mock('../marketplace/marketplace-client.service.js', () => ({
  MarketplaceClientService: class {},
}));

import { OrderStatus } from '../../generated/prisma/client.js';
import { ShippingService } from './shipping.service.js';

describe('ShippingService marketplace soft cancellation', () => {
  const order: {
    id: number;
    code: string;
    status: OrderStatus;
    updatedAt: Date;
    marketplaceSubOrderId: string;
  } = {
    id: 12,
    code: 'ORD12',
    status: OrderStatus.Prepare,
    updatedAt: new Date('2026-08-24T10:00:00.000Z'),
    marketplaceSubOrderId: 'sub-order-12',
  };

  function setup(current = order) {
    const prisma = {
      order: {
        findUnique: jest.fn().mockResolvedValue(current),
        findUniqueOrThrow: jest.fn().mockImplementation(async () => ({
          ...current,
          status:
            current.status === OrderStatus.SoftCancel
              ? OrderStatus.Pending
              : OrderStatus.SoftCancel,
        })),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };
    const marketplaceClient = {
      requestSourceShipmentSoftCancel: jest.fn().mockResolvedValue({ data: {} }),
      releaseSourceShipmentSoftCancel: jest.fn().mockResolvedValue({ data: {} }),
    };
    const service = new ShippingService(
      prisma as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      marketplaceClient as never,
    );
    return { marketplaceClient, prisma, service };
  }

  it('marks the local source order only after Marketplace accepts the request', async () => {
    const { marketplaceClient, prisma, service } = setup();

    await service.softCancelMarketplaceShippingOrder(order.id);

    expect(marketplaceClient.requestSourceShipmentSoftCancel).toHaveBeenCalledWith(
      order.marketplaceSubOrderId,
      expect.stringContaining('source-soft-cancel:'),
    );
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: order.id, status: OrderStatus.Prepare },
      data: { status: OrderStatus.SoftCancel },
    });
  });

  it('does not update the local order when Marketplace rejects the request', async () => {
    const { marketplaceClient, prisma, service } = setup();
    marketplaceClient.requestSourceShipmentSoftCancel.mockRejectedValue(
      new Error('Marketplace unavailable'),
    );

    await expect(service.softCancelMarketplaceShippingOrder(order.id)).rejects.toThrow(
      'Marketplace unavailable',
    );
    expect(prisma.order.updateMany).not.toHaveBeenCalled();
  });

  it('releases the request and returns the local order to pending pickup handling', async () => {
    const softCancelled = { ...order, status: OrderStatus.SoftCancel };
    const { marketplaceClient, prisma, service } = setup(softCancelled);

    await service.releaseMarketplaceSoftCancel(order.id);

    expect(marketplaceClient.releaseSourceShipmentSoftCancel).toHaveBeenCalledWith(
      order.marketplaceSubOrderId,
      expect.stringContaining('source-soft-cancel-release:'),
    );
    expect(prisma.order.updateMany).toHaveBeenCalledWith({
      where: { id: order.id, status: OrderStatus.SoftCancel },
      data: { status: OrderStatus.Pending },
    });
  });
});
