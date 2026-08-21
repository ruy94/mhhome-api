jest.mock('../../prisma/prisma.service.js', () => ({
  PrismaService: class {},
}));
jest.mock('../marketplace/marketplace-catalog.service.js', () => ({
  MarketplaceCatalogService: class {},
}));

import { SaleworkService } from './salework.service.js';

describe('SaleworkService syncLinkedVariantStocks', () => {
  const createService = () => {
    const saleworkClient = {
      getProducts: jest.fn().mockResolvedValue({
        products: {
          SKU_POSITIVE: {
            code: 'SKU_POSITIVE',
            stocks: [{ wid: 'W1', value: 12 }],
          },
          SKU_NEGATIVE: {
            code: 'SKU_NEGATIVE',
            stocks: [{ wid: 'W1', value: -4 }],
          },
        },
        warehouses: [{ wid: 'W1' }],
      }),
    };
    const variant = {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, productId: 10, saleworkProductCode: 'SKU_POSITIVE', saleworkWarehouseId: 'W1' },
          { id: 2, productId: 11, saleworkProductCode: 'SKU_NEGATIVE', saleworkWarehouseId: 'W1' },
          { id: 3, productId: 12, saleworkProductCode: 'SKU_MISSING', saleworkWarehouseId: 'W1' },
        ]),
        update: jest.fn().mockResolvedValue({}),
    };
    const prisma = {
      variant,
      marketplaceInventoryReservation: {
        groupBy: jest.fn().mockResolvedValue([
          { variantId: 1, _sum: { quantity: 2 } },
          { variantId: 2, _sum: { quantity: 1 } },
        ]),
      },
      $transaction: jest.fn(async (callback: (tx: unknown) => unknown) => callback({ variant })),
    };
    const marketplaceCatalog = { recordProductChanges: jest.fn().mockResolvedValue(undefined) };

    return {
      service: new SaleworkService(
        saleworkClient as never,
        prisma as never,
        marketplaceCatalog as never,
      ),
      saleworkClient,
      prisma,
      marketplaceCatalog,
    };
  };

  it('updates linked variants after subtracting active marketplace reservations', async () => {
    const { service, prisma } = createService();

    await expect(service.syncLinkedVariantStocks()).resolves.toEqual({
      totalLinked: 3,
      updated: 2,
      skipped: 1,
      items: [
        {
          variantId: 1,
          saleworkProductCode: 'SKU_POSITIVE',
          saleworkWarehouseId: 'W1',
          saleworkStock: 12,
          appliedStock: 10,
        },
        {
          variantId: 2,
          saleworkProductCode: 'SKU_NEGATIVE',
          saleworkWarehouseId: 'W1',
          saleworkStock: -4,
          appliedStock: -5,
        },
      ],
      skippedItems: [
        {
          variantId: 3,
          saleworkProductCode: 'SKU_MISSING',
          saleworkWarehouseId: 'W1',
          reason: 'Không tìm thấy SKU hoặc kho SaleWork',
        },
      ],
    });
    expect(prisma.marketplaceInventoryReservation.groupBy).toHaveBeenCalledWith({
      by: ['variantId'],
      where: {
        variantId: { in: [1, 2, 3] },
        reservation: { status: 'Reserved' },
      },
      _sum: { quantity: true },
    });
    expect(prisma.variant.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { stock: 10 } });
    expect(prisma.variant.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { stock: -5 } });
    expect(prisma.variant.update).toHaveBeenCalledTimes(2);
  });
});
