import { IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateVariantDto {
  @IsInt()
  @IsNotEmpty()
  productId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsNumber()
  @Min(0)
  originalPrice!: number;

  @IsOptional()
  @IsNumber()
  wholesaleBasePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  wholesalePrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  wholesaleMinQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  packageWeightGrams?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageLengthCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageWidthCm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packageHeightCm?: number;

  @IsInt()
  @Min(0)
  stock!: number;

  // Validate JSONB: { "Color": "Red", "Size": "M" }
  @IsOptional()
  @IsObject()
  dimensions?: Record<string, string>;
}
