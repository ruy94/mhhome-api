import { IsEnum, IsIn, IsOptional } from 'class-validator';
import { OrderStatus } from '../../../generated/prisma/client.js';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export type OrderShippingStage = 'processing' | 'waiting_pickup';

export class OrderPageOptionsDto extends PageOptionsDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;

  @IsIn(['processing', 'waiting_pickup'])
  @IsOptional()
  readonly shippingStage?: OrderShippingStage;
}
