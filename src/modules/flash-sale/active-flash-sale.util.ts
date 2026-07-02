import { DiscountType } from '../../generated/prisma/client.js';

type FlashSaleLike = {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
};

type FlashSaleItemLike = {
  id: number;
  flashSaleId: number;
  discountType: DiscountType;
  discountPercent: number | null;
  salePrice: unknown;
  saleStock: number;
  sold: number;
  flashSale: FlashSaleLike;
};

type VariantWithFlashSaleItems = {
  originalPrice: unknown;
  stock: number;
  flashSaleItems?: FlashSaleItemLike[];
};

export function mapActiveFlashSale(
  variant: VariantWithFlashSaleItems,
  requestedQuantity = 1,
) {
  const item = variant.flashSaleItems?.[0];
  if (!item) return null;

  const originalPrice = Number(variant.originalPrice);
  const availableStock = Math.max(0, Math.min(variant.stock, item.saleStock - item.sold));

  if (availableStock <= 0 || requestedQuantity > availableStock) {
    return null;
  }

  const finalPrice =
    item.discountType === DiscountType.Percentage
      ? Math.floor(originalPrice * (1 - (item.discountPercent ?? 0) / 100))
      : Number(item.salePrice ?? 0);
  const soldPercent =
    item.saleStock > 0 ? Math.min(100, Math.round((item.sold / item.saleStock) * 100)) : 0;

  return {
    flashSaleId: item.flashSaleId,
    flashSaleItemId: item.id,
    title: item.flashSale.title,
    startTime: item.flashSale.startTime,
    endTime: item.flashSale.endTime,
    remainingSeconds: Math.max(0, Math.floor((item.flashSale.endTime.getTime() - Date.now()) / 1000)),
    discountType: item.discountType,
    discountPercent: item.discountPercent,
    salePrice: item.salePrice,
    saleStock: item.saleStock,
    sold: item.sold,
    availableStock,
    soldPercent,
    originalPrice,
    finalPrice,
  };
}
