import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateAddressDto } from './create-address.dto.js';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  zaloId?: string;

  @IsOptional()
  @IsString()
  idbyOA?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsBoolean()
  followedOA?: boolean = false;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  addresses: CreateAddressDto[] = [];
}
