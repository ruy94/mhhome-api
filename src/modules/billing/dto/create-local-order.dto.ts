import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';

export class CreateLocalOrderDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  packageId!: number;

  @IsNotEmpty()
  @IsString()
  returnUrl!: string;

  @IsNotEmpty()
  @IsString()
  cancelUrl!: string;
}
