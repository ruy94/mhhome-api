import { IsNotEmpty, IsNumber } from 'class-validator';

export class SaveVoucherDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNotEmpty()
  @IsNumber()
  voucherId!: number;
}
