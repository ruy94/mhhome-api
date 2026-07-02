import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// 1. DTO cho cấu trúc Tier (Màu sắc, Size...) của Product
export class TierVariationDto {
  @IsString()
  @IsNotEmpty()
  name!: string; // VD: "Màu sắc"

  @IsArray()
  @IsString({ each: true })
  options!: string[]; // VD: ["Đỏ", "Xanh"]
}

// 2. DTO cho Variant khi tạo mới (Nested)
export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

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
  @IsNumber()
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

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsOptional()
  @IsString()
  image?: string; // Schema variant có image riêng

  // Validate JSONB dimensions: { "Màu sắc": "Đỏ" }
  @IsOptional()
  @IsObject()
  dimensions?: Record<string, string>;
}

// 3. DTO Chính
export class CreateProductDto {
  @IsArray()
  @IsNumber({}, { each: true })
  categoryId!: number[];

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  detail!: string;

  @IsArray()
  @IsString({ each: true })
  image!: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  videoThumbnail?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsNumber()
  fakeSold?: number;

  @IsOptional()
  @IsBoolean()
  wholesaleEnabled?: boolean;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  wholesaleUserIds?: number[];

  @IsOptional()
  @IsNumber()
  warranty?: number;

  @IsOptional()
  @IsEnum(['Days', 'Months', 'Years'])
  warrantyType?: 'Days' | 'Months' | 'Years';

  // Validate JSONB Tier Variations
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TierVariationDto)
  tierVariations?: TierVariationDto[];

  // Validate Variants
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants!: CreateVariantDto[];
}
