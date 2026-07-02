import { PaymentMethod, ShippingProvider } from '../../../generated/prisma/client.js';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productId!: number;

  @IsInt()
  @IsNotEmpty()
  variantId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderItemVoucherDto {
  @IsInt()
  @IsNotEmpty()
  productId!: number;

  @IsInt()
  @IsNotEmpty()
  voucherId!: number;
}

export class CreateOrderCustomerDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateOrderAddressDto {
  @IsString()
  @IsNotEmpty()
  cneeName!: string;

  @IsString()
  @IsNotEmpty()
  cneePhone!: string;

  @IsString()
  @IsNotEmpty()
  idCity!: string;

  @IsOptional()
  @IsString()
  idDistrict?: string;

  @IsString()
  @IsNotEmpty()
  idWard!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsString()
  @IsNotEmpty()
  ward!: string;

  @IsString()
  @IsNotEmpty()
  fullAddr!: string;
}

export class WebsiteShippingEstimateDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsString()
  @IsNotEmpty()
  idCity!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  idWard!: string;

  @IsString()
  @IsNotEmpty()
  ward!: string;

  @IsOptional()
  @IsInt()
  orderVoucherId?: number;

  @IsOptional()
  @IsInt()
  productVoucherId?: number;

  @IsOptional()
  @IsInt()
  deliveryVoucherId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemVoucherDto)
  itemVouchers?: CreateOrderItemVoucherDto[];

  @IsOptional()
  @IsEnum(ShippingProvider)
  shippingProvider?: ShippingProvider;

  @IsString()
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  affiliateCode?: string;

  @IsInt()
  @IsOptional()
  affiliateProductId?: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsInt()
  addressId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderCustomerDto)
  customer?: CreateOrderCustomerDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderAddressDto)
  address?: CreateOrderAddressDto;

  @IsOptional()
  @IsInt()
  orderVoucherId?: number;

  @IsOptional()
  @IsInt()
  productVoucherId?: number;

  @IsOptional()
  @IsInt()
  deliveryVoucherId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemVoucherDto)
  itemVouchers?: CreateOrderItemVoucherDto[];

  @IsOptional()
  @IsInt()
  @Min(0)
  deliveryFee?: number;

  @IsOptional()
  @IsEnum(ShippingProvider)
  shippingProvider?: ShippingProvider;

  @IsString()
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsString()
  @IsOptional()
  affiliateCode?: string;

  @IsInt()
  @IsOptional()
  affiliateProductId?: number;
}
