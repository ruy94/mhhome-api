import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import {
  MarketplaceSourceVoucherSelectionDto,
  MarketplaceVoucherSelectionMode,
} from './marketplace-commerce.dto.js';
import { ElectronicInvoiceRequestDto } from '../../order/dto/create-order.dto.js';

export class AddMarketplaceCartItemDto {
  @IsUUID()
  listingId!: string;

  @IsString()
  @IsNotEmpty()
  sourceVariantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class UpdateMarketplaceCartItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sourceVariantId?: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class MarketplaceCheckoutSourceInputDto {
  @IsString()
  @IsNotEmpty()
  sourceShopCode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ElectronicInvoiceRequestDto)
  invoiceRequest?: ElectronicInvoiceRequestDto | null;
}

export class MarketplaceLocalQuoteItemDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  variantId!: number;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class MarketplaceHostItemVoucherDto {
  @IsInt()
  @Min(1)
  productId!: number;

  @IsInt()
  @Min(1)
  voucherId!: number;
}

export class MarketplaceHostVoucherSelectionDto {
  @IsEnum(MarketplaceVoucherSelectionMode)
  mode: MarketplaceVoucherSelectionMode = MarketplaceVoucherSelectionMode.Auto;

  @IsOptional()
  @IsInt()
  orderVoucherId?: number | null;

  @IsOptional()
  @IsInt()
  shippingVoucherId?: number | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceHostItemVoucherDto)
  itemVouchers?: MarketplaceHostItemVoucherDto[];
}

export class MarketplaceSourceVoucherGroupDto extends MarketplaceSourceVoucherSelectionDto {
  @IsString()
  @IsNotEmpty()
  sourceShopCode!: string;
}

export class MarketplaceCheckoutQuoteDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  addressId?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceLocalQuoteItemDto)
  localItems?: MarketplaceLocalQuoteItemDto[];

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  marketplaceCartItemIds!: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MarketplaceHostVoucherSelectionDto)
  hostVoucherSelection?: MarketplaceHostVoucherSelectionDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceSourceVoucherGroupDto)
  sourceVoucherSelections?: MarketplaceSourceVoucherGroupDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceCheckoutSourceInputDto)
  sourceInputs?: MarketplaceCheckoutSourceInputDto[];
}

export class MarketplaceCheckoutPrepareDto extends MarketplaceCheckoutQuoteDto {
  @IsString()
  @IsNotEmpty()
  checkoutAttemptId!: string;

  @IsDefined()
  @IsInt()
  @Min(1)
  declare addressId: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ElectronicInvoiceRequestDto)
  invoiceRequest?: ElectronicInvoiceRequestDto | null;
}
