import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsIn, IsOptional } from 'class-validator';
import { OrderPlatform, OrderStatus, PaymentMethod } from '../../../generated/prisma/client.js';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export type OrderShippingStage = 'processing' | 'waiting_pickup';

export class OrderPageOptionsDto extends PageOptionsDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  @IsIn(['processing', 'waiting_pickup'])
  @IsOptional()
  readonly shippingStage?: OrderShippingStage;

  @IsDateString()
  @IsOptional()
  readonly createdFrom?: string;

  @IsDateString()
  @IsOptional()
  readonly createdTo?: string;

  @IsEnum(PaymentMethod)
  @IsOptional()
  readonly paymentMethod?: PaymentMethod;

  @IsEnum(OrderPlatform)
  @IsOptional()
  readonly platform?: OrderPlatform;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  readonly includeShippingEvents?: boolean;
}
