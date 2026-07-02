import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CheckoutMessageDto {
  @IsString()
  @IsNotEmpty()
  zaloId!: string;

  @IsString()
  @IsNotEmpty()
  customerName!: string;

  @IsString()
  @IsNotEmpty()
  orderCode!: string;

  @IsNumber()
  @IsNotEmpty()
  orderAmount!: number;
}
