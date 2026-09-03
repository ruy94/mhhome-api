import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { PaymentMethod, ShippingProvider } from '../../../generated/prisma/enums.js';
import { ElectronicInvoiceRequestDto } from '../../order/dto/create-order.dto.js';

export enum MarketplaceQuoteMode {
  LocalHost = 'LocalHost',
  CrossSource = 'CrossSource',
}

export enum MarketplaceVoucherSelectionMode {
  Auto = 'Auto',
  Manual = 'Manual',
}

export class MarketplaceSourceQuoteContextDto {
  @IsString()
  @IsNotEmpty()
  hostShopCode!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  hostLocalUserId?: number;

  @IsString()
  @IsNotEmpty()
  opaqueCustomerRef!: string;

  @IsEnum(MarketplaceQuoteMode)
  mode!: MarketplaceQuoteMode;
}

export class MarketplaceSourceQuoteItemDto {
  @IsString()
  @IsNotEmpty()
  sourceProductId!: string;

  @IsString()
  @IsNotEmpty()
  sourceVariantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class MarketplaceSourceItemVoucherDto {
  @IsString()
  @IsNotEmpty()
  sourceProductId!: string;

  @IsString()
  @IsNotEmpty()
  voucherId!: string;
}

export class MarketplaceSourceVoucherSelectionDto {
  @IsEnum(MarketplaceVoucherSelectionMode)
  mode: MarketplaceVoucherSelectionMode = MarketplaceVoucherSelectionMode.Auto;

  @IsOptional()
  @IsString()
  orderVoucherId?: string | null;

  @IsOptional()
  @IsString()
  shippingVoucherId?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MarketplaceSourceItemVoucherDto)
  itemVouchers?: MarketplaceSourceItemVoucherDto[];
}

export class MarketplaceSourceQuotePreviewDto {
  @ValidateNested()
  @Type(() => MarketplaceSourceQuoteContextDto)
  context!: MarketplaceSourceQuoteContextDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MarketplaceSourceQuoteItemDto)
  items!: MarketplaceSourceQuoteItemDto[];
}

export class MarketplaceSourceQuoteFinalizeDto extends MarketplaceSourceQuotePreviewDto {
  @IsInt()
  @Min(0)
  shippingFee!: number;

  @ValidateNested()
  @Type(() => MarketplaceSourceVoucherSelectionDto)
  voucherSelection!: MarketplaceSourceVoucherSelectionDto;
}

export class MarketplaceSourceReserveDto extends MarketplaceSourceQuoteFinalizeDto {
  @IsString()
  @IsNotEmpty()
  reservationId!: string;

  @IsString()
  @IsNotEmpty()
  checkoutSessionId!: string;

  @IsDateString()
  expiresAt!: string;
}

export class MarketplaceOrderPartyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsOptional()
  @IsString()
  district?: string | null;

  @IsString()
  @IsNotEmpty()
  detailAddress!: string;

  @IsOptional()
  @IsInt()
  addressVersion?: number;

  @IsOptional()
  @IsString()
  longitude?: string | null;

  @IsOptional()
  @IsString()
  latitude?: string | null;
}

export class MarketplaceConfirmReservationDto {
  @IsString()
  @IsNotEmpty()
  parentOrderId!: string;

  @IsString()
  @IsNotEmpty()
  parentOrderCode!: string;

  @IsString()
  @IsNotEmpty()
  subOrderId!: string;

  @IsString()
  @IsNotEmpty()
  subOrderCode!: string;

  @IsString()
  @IsNotEmpty()
  hostShopCode!: string;

  @ValidateNested()
  @Type(() => MarketplaceOrderPartyDto)
  recipient!: MarketplaceOrderPartyDto;

  @ValidateNested()
  @Type(() => MarketplaceOrderPartyDto)
  sender!: MarketplaceOrderPartyDto;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => ElectronicInvoiceRequestDto)
  invoiceRequest?: ElectronicInvoiceRequestDto | null;

  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @IsEnum(ShippingProvider)
  shippingProvider!: ShippingProvider;
}

export enum MarketplaceShipmentStatus {
  Pending = 'Pending',
  Creating = 'Creating',
  PendingPickup = 'PendingPickup',
  InTransit = 'InTransit',
  Delivered = 'Delivered',
  Returning = 'Returning',
  Returned = 'Returned',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

export class MarketplaceShipmentEventDto {
  @IsInt()
  @Min(1)
  eventId!: number;

  @IsString()
  @IsNotEmpty()
  shipmentId!: string;

  @IsEnum(ShippingProvider)
  provider!: ShippingProvider;

  @IsEnum(MarketplaceShipmentStatus)
  status!: MarketplaceShipmentStatus;

  @IsOptional()
  @IsString()
  trackingNo?: string | null;

  @IsOptional()
  @IsString()
  trackingLink?: string | null;

  @IsOptional()
  @IsString()
  providerOrderId?: string | null;

  @IsOptional()
  @IsString()
  statusCode?: string | null;

  @IsOptional()
  @IsString()
  providerStatus?: string | null;

  @IsOptional()
  @IsString()
  message?: string | null;

  @IsOptional()
  @IsDateString()
  happenedAt?: string | null;

  @IsOptional()
  @IsObject()
  rawPayload?: Record<string, unknown>;
}

export class MarketplaceRefundOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
