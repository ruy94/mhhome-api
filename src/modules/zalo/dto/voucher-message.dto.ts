import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class VoucherMessageDto {
  @IsString()
  @IsNotEmpty()
  zaloId!: string;

  //   @IsString()
  //   @IsNotEmpty()
  //   customerName: string;

  @IsString()
  @IsNotEmpty()
  voucherCode!: string;

  @IsDate()
  @Type(() => Date)
  validUntil!: number;
}
