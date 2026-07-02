import { OrderStatus } from '../../../generated/prisma/client.js';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusOrderDto {
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status!: OrderStatus;
}
