import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class SaleworkWarehouseCommonInfoDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  @IsNotEmpty()
  warehouse_id!: string;
}

class SaleworkWarehouseProductInfoDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class SaleworkWarehouseTransactionDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkWarehouseCommonInfoDto)
  common_info!: SaleworkWarehouseCommonInfoDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleworkWarehouseProductInfoDto)
  products_info!: SaleworkWarehouseProductInfoDto[];
}

