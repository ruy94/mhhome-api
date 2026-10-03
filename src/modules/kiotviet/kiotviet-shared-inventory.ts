import type { Prisma } from '../../generated/prisma/client.js';
import { InventoryProvider } from '../../generated/prisma/enums.js';

export interface KiotVietReservationItem {
  variantId: number;
  productId: number;
  quantity: number;
  variantName: string;
}

export interface KiotVietReservationResult {
  variantIds: Set<number>;
  affectedProductIds: Set<number>;
}

export class KiotVietSharedStockError extends Error {
  constructor(readonly variantName: string) {
    super(`Sản phẩm ${variantName} không đủ tồn kho`);
  }
}

/**
 * Atomically reserves stock once per KiotViet product code and mirrors the
 * resulting quantity to every local SKU linked to that shared inventory row.
 */
export async function reserveKiotVietSharedStock(
  tx: Prisma.TransactionClient,
  items: KiotVietReservationItem[],
): Promise<KiotVietReservationResult> {
  const variants = await tx.variant.findMany({
    where: { id: { in: [...new Set(items.map((item) => item.variantId))] }, isDeleted: 0 },
    select: {
      id: true,
      productId: true,
      inventoryProvider: true,
      kiotvietProductCode: true,
      kiotvietBranchId: true,
    },
  });
  const variantById = new Map(variants.map((variant) => [variant.id, variant]));
  const groups = new Map<
    string,
    { productCode: string; branchId: number; quantity: number; variantName: string }
  >();
  const variantIds = new Set<number>();

  for (const item of items) {
    const variant = variantById.get(item.variantId);
    if (
      !variant ||
      variant.productId !== item.productId ||
      variant.inventoryProvider !== InventoryProvider.KIOTVIET
    ) {
      continue;
    }
    const productCode = variant.kiotvietProductCode?.trim();
    const branchId = variant.kiotvietBranchId;
    if (!productCode || !branchId) throw new KiotVietSharedStockError(item.variantName);
    variantIds.add(item.variantId);
    const current = groups.get(productCode);
    if (current && current.branchId !== branchId) {
      throw new KiotVietSharedStockError(item.variantName);
    }
    groups.set(productCode, {
      productCode,
      branchId,
      quantity: (current?.quantity ?? 0) + item.quantity,
      variantName: current?.variantName ?? item.variantName,
    });
  }

  const affectedProductIds = new Set<number>();
  for (const group of [...groups.values()].sort((left, right) =>
    left.productCode.localeCompare(right.productCode),
  )) {
    const reserved = await tx.kiotVietInventory.updateMany({
      where: {
        productCode: group.productCode,
        branchId: group.branchId,
        availableStock: { gte: group.quantity },
      },
      data: { availableStock: { decrement: group.quantity } },
    });
    if (!reserved.count) throw new KiotVietSharedStockError(group.variantName);

    const inventory = await tx.kiotVietInventory.findUniqueOrThrow({
      where: { productCode: group.productCode },
      select: { availableStock: true },
    });
    const linkedVariants = await tx.variant.findMany({
      where: {
        isDeleted: 0,
        inventoryProvider: InventoryProvider.KIOTVIET,
        kiotvietProductCode: group.productCode,
        kiotvietBranchId: group.branchId,
      },
      select: { productId: true },
    });
    await tx.variant.updateMany({
      where: {
        isDeleted: 0,
        inventoryProvider: InventoryProvider.KIOTVIET,
        kiotvietProductCode: group.productCode,
        kiotvietBranchId: group.branchId,
      },
      data: { stock: inventory.availableStock },
    });
    linkedVariants.forEach((variant) => affectedProductIds.add(variant.productId));
  }

  return { variantIds, affectedProductIds };
}

/**
 * Releases a local reservation that has not been exported to KiotViet yet and
 * mirrors the restored quantity to every local SKU sharing the product code.
 */
export async function restoreKiotVietSharedStock(
  tx: Prisma.TransactionClient,
  items: KiotVietReservationItem[],
): Promise<KiotVietReservationResult> {
  const variants = await tx.variant.findMany({
    where: { id: { in: [...new Set(items.map((item) => item.variantId))] }, isDeleted: 0 },
    select: {
      id: true,
      productId: true,
      inventoryProvider: true,
      kiotvietProductCode: true,
      kiotvietBranchId: true,
    },
  });
  const variantById = new Map(variants.map((variant) => [variant.id, variant]));
  const groups = new Map<
    string,
    { productCode: string; branchId: number; quantity: number; variantName: string }
  >();
  const variantIds = new Set<number>();

  for (const item of items) {
    const variant = variantById.get(item.variantId);
    if (
      !variant ||
      variant.productId !== item.productId ||
      variant.inventoryProvider !== InventoryProvider.KIOTVIET
    ) {
      continue;
    }
    const productCode = variant.kiotvietProductCode?.trim();
    const branchId = variant.kiotvietBranchId;
    if (!productCode || !branchId) throw new KiotVietSharedStockError(item.variantName);
    variantIds.add(item.variantId);
    const current = groups.get(productCode);
    if (current && current.branchId !== branchId) {
      throw new KiotVietSharedStockError(item.variantName);
    }
    groups.set(productCode, {
      productCode,
      branchId,
      quantity: (current?.quantity ?? 0) + item.quantity,
      variantName: current?.variantName ?? item.variantName,
    });
  }

  const affectedProductIds = new Set<number>();
  for (const group of [...groups.values()].sort((left, right) =>
    left.productCode.localeCompare(right.productCode),
  )) {
    const restored = await tx.kiotVietInventory.updateMany({
      where: { productCode: group.productCode, branchId: group.branchId },
      data: { availableStock: { increment: group.quantity } },
    });
    if (!restored.count) throw new KiotVietSharedStockError(group.variantName);

    const inventory = await tx.kiotVietInventory.findUniqueOrThrow({
      where: { productCode: group.productCode },
      select: { availableStock: true },
    });
    const linkedVariants = await tx.variant.findMany({
      where: {
        isDeleted: 0,
        inventoryProvider: InventoryProvider.KIOTVIET,
        kiotvietProductCode: group.productCode,
        kiotvietBranchId: group.branchId,
      },
      select: { productId: true },
    });
    await tx.variant.updateMany({
      where: {
        isDeleted: 0,
        inventoryProvider: InventoryProvider.KIOTVIET,
        kiotvietProductCode: group.productCode,
        kiotvietBranchId: group.branchId,
      },
      data: { stock: inventory.availableStock },
    });
    linkedVariants.forEach((variant) => affectedProductIds.add(variant.productId));
  }

  return { variantIds, affectedProductIds };
}
