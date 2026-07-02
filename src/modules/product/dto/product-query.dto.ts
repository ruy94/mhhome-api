import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export enum ProductSortBy {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  SOLD = 'sold',
}

export enum ProductStockStatus {
  ALL = 'all',
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
}

export class ProductQueryDto extends PageOptionsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly userId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly categoryId?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly maxPrice?: number;

  @IsEnum(ProductStockStatus)
  @IsOptional()
  readonly stockStatus?: ProductStockStatus = ProductStockStatus.ALL;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  readonly inStock?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly minStock?: number;

  @IsEnum(ProductSortBy)
  @IsOptional()
  readonly sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

  @IsEnum(ProductSortBy)
  @IsOptional()
  readonly sort?: ProductSortBy;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  readonly excludeFlashSaleProducts?: boolean;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly excludeFlashSaleId?: number;
}
