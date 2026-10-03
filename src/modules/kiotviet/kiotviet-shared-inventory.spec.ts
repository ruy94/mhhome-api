import { InventoryProvider } from '../../generated/prisma/enums.js';
import {
  KiotVietSharedStockError,
  reserveKiotVietSharedStock,
  restoreKiotVietSharedStock,
} from './kiotviet-shared-inventory.js';

describe('KiotViet shared inventory', () => {
  const linkedVariants = [
    {
      id: 11,
      productId: 101,
      inventoryProvider: InventoryProvider.KIOTVIET,
      kiotvietProductCode: 'KV-001',
      kiotvietBranchId: 44,
    },
    {
      id: 22,
      productId: 202,
      inventoryProvider: InventoryProvider.KIOTVIET,
      kiotvietProductCode: 'KV-001',
      kiotvietBranchId: 44,
    },
  ];

  const items = [
    { variantId: 11, productId: 101, quantity: 1, variantName: 'SKU A' },
    { variantId: 22, productId: 202, quantity: 1, variantName: 'SKU B' },
  ];

  it('reserves aliases as one atomic quantity and mirrors the remaining stock', async () => {
    const tx = {
      variant: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce(linkedVariants)
          .mockResolvedValueOnce([{ productId: 101 }, { productId: 202 }]),
        updateMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
      kiotVietInventory: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ availableStock: 0 }),
      },
    };

    const result = await reserveKiotVietSharedStock(tx as never, items);

    expect(tx.kiotVietInventory.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.kiotVietInventory.updateMany).toHaveBeenCalledWith({
      where: { productCode: 'KV-001', branchId: 44, availableStock: { gte: 2 } },
      data: { availableStock: { decrement: 2 } },
    });
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: {
        isDeleted: 0,
        inventoryProvider: InventoryProvider.KIOTVIET,
        kiotvietProductCode: 'KV-001',
        kiotvietBranchId: 44,
      },
      data: { stock: 0 },
    });
    expect([...result.variantIds]).toEqual([11, 22]);
    expect([...result.affectedProductIds]).toEqual([101, 202]);
  });

  it('rejects the whole reservation when the shared quantity is insufficient', async () => {
    const tx = {
      variant: { findMany: jest.fn().mockResolvedValue(linkedVariants), updateMany: jest.fn() },
      kiotVietInventory: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        findUniqueOrThrow: jest.fn(),
      },
    };

    await expect(reserveKiotVietSharedStock(tx as never, items)).rejects.toBeInstanceOf(
      KiotVietSharedStockError,
    );
    expect(tx.kiotVietInventory.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.variant.updateMany).not.toHaveBeenCalled();
  });

  it('restores a released hold once per shared product code', async () => {
    const tx = {
      variant: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce(linkedVariants)
          .mockResolvedValueOnce([{ productId: 101 }, { productId: 202 }]),
        updateMany: jest.fn().mockResolvedValue({ count: 2 }),
      },
      kiotVietInventory: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ availableStock: 2 }),
      },
    };

    await restoreKiotVietSharedStock(tx as never, items);

    expect(tx.kiotVietInventory.updateMany).toHaveBeenCalledWith({
      where: { productCode: 'KV-001', branchId: 44 },
      data: { availableStock: { increment: 2 } },
    });
    expect(tx.variant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { stock: 2 } }),
    );
  });
});
