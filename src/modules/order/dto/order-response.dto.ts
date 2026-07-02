import { OrderStatus, PricingMode } from '../../../generated/prisma/client.js';

export class OrderItemResponseDto {
  productId!: number;
  productName!: string;
  productImage!: string[];
  variantId!: number;
  variantName!: string;
  quantity!: number;
  pricingMode!: PricingMode;
  originalPrice!: number;
  finalPrice!: number;
  flashSaleId?: number;
  flashSaleType?: string;
  flashSaleValue?: number;
  itemVoucherId?: number;
  itemVoucherType?: string;
  itemVoucherValue?: number;
  itemVoucherDiscount!: number;
}

export class OrderResponseDto {
  id!: string;
  createdAt!: Date;
  status!: OrderStatus;

  estAmount!: number;
  itemVoucherDiscount!: number;
  productDiscount!: number;
  deliveryFee!: number;
  deliveryDiscount!: number;
  deliveryAmount!: number;
  totalAmount!: number;

  items!: OrderItemResponseDto[];
}
