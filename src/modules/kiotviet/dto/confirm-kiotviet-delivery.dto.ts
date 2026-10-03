import { IsBoolean, IsIn, IsInt, IsOptional, Min } from 'class-validator';

export class ConfirmKiotVietDeliveryDto {
  @IsInt()
  @Min(0)
  totalPayment!: number;

  @IsIn(['Cash', 'Card', 'Transfer'])
  method!: 'Cash' | 'Card' | 'Transfer';

  @IsOptional()
  @IsBoolean()
  usingCod?: boolean;
}
