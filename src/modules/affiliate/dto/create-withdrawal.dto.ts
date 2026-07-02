import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateWithdrawalDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsInt()
  @Min(1)
  amount!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bankName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  bankAccount!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  bankHolder!: string;
}
