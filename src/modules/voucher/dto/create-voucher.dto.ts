import {
  ConditionType,
  DiscountType,
  VoucherScope,
  VoucherType,
} from '../../../generated/prisma/client.js';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateVoucherDto {
  @IsNumber()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Mã voucher không được để trống' })
  code!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(VoucherType)
  @IsNotEmpty()
  type!: VoucherType;

  @IsEnum(VoucherScope)
  @IsOptional()
  scope?: VoucherScope;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  productIds?: number[];

  @IsEnum(DiscountType)
  @IsNotEmpty()
  discountType!: DiscountType;

  @IsNumber()
  @Min(0)
  discountValue!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsNumber()
  @Min(0)
  minOrderValue!: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsNumber()
  @Min(1)
  limitPerUser!: number;

  @IsDate()
  @Type(() => Date)
  validFrom!: Date;

  @IsDate()
  @Type(() => Date)
  validUntil!: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsEnum(ConditionType)
  @IsOptional()
  conditionType?: ConditionType;
}
