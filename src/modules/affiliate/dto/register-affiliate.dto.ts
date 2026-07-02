import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min } from 'class-validator';

export class RegisterAffiliateDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'refCode chỉ được chứa chữ cái, số và dấu gạch dưới',
  })
  refCode!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  bankAccount?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankHolder?: string;
}
