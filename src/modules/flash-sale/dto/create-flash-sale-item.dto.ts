import { DiscountType } from '../../../generated/prisma/client.js';
import { IsEnum, IsInt, IsNumber, IsPositive, Max, Min, ValidateIf } from 'class-validator';

export class CreateFlashSaleItemDto {
  @IsInt()
  @IsPositive()
  variantId!: number;

  @IsEnum(DiscountType)
  discountType!: DiscountType;

  @ValidateIf((o: CreateFlashSaleItemDto) => o.discountType === DiscountType.Percentage)
  @IsInt()
  @Min(1)
  @Max(99, { message: 'Phần trăm giảm giá phải từ 1% đến 99%' })
  discountPercent?: number;

  @ValidateIf((o: CreateFlashSaleItemDto) => o.discountType === DiscountType.Fixed)
  @IsNumber()
  @Min(0)
  salePrice?: number;

  @IsInt()
  @Min(1)
  saleStock!: number;
}
