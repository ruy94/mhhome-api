import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  cneeName?: string;

  @IsOptional()
  @IsString()
  cneePhone?: string;

  @IsOptional()
  @IsString()
  idCity?: string;

  @IsOptional()
  @IsString()
  idDistrict?: string;

  @IsOptional()
  @IsString()
  idWard?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  fullAddr?: string;
}
