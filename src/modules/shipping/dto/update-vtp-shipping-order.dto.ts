import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateVtpShippingOrderDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  recipientName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(70)
  recipientPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  recipientAddress?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  weightGrams?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  lengthCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  widthCm?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  heightCm?: number;

  @IsOptional()
  @IsString()
  pickupDate?: string;

  @IsOptional()
  @IsInt()
  @IsIn([0, 1, 2, 3])
  pickupCode?: 0 | 1 | 2 | 3;

  @IsOptional()
  @IsInt()
  @IsIn([-1, 1, 2, 3, 4, 5, 6])
  deliveryCode?: -1 | 1 | 2 | 3 | 4 | 5 | 6;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  note?: string;
}
