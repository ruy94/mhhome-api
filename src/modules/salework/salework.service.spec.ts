jest.mock('../../prisma/prisma.service.js', () => ({
  PrismaService: class {},
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
    const prisma = {
      variant: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, saleworkProductCode: 'SKU_POSITIVE', saleworkWarehouseId: 'W1' },
          { id: 2, saleworkProductCode: 'SKU_NEGATIVE', saleworkWarehouseId: 'W1' },
          { id: 3, saleworkProductCode: 'SKU_MISSING', saleworkWarehouseId: 'W1' },
        ]),
        update: jest.fn().mockResolvedValue({}),
      },
    };

    return {
      service: new SaleworkService(saleworkClient as never, prisma as never),
      saleworkClient,
      prisma,
    };
  };

  it('updates linked variants and clamps negative Salework stock to zero', async () => {
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
          appliedStock: 12,
        },
        {
          variantId: 2,
          saleworkProductCode: 'SKU_NEGATIVE',
          saleworkWarehouseId: 'W1',
          saleworkStock: -4,
          appliedStock: 0,
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
    expect(prisma.variant.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { stock: 12 } });
    expect(prisma.variant.update).toHaveBeenCalledWith({ where: { id: 2 }, data: { stock: 0 } });
    expect(prisma.variant.update).toHaveBeenCalledTimes(2);
  });
});
