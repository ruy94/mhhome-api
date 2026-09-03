import { IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class VtpStatusActionDto {
  @IsInt()
  @IsIn([2, 3])
  type!: 2 | 3;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  note?: string;
}
