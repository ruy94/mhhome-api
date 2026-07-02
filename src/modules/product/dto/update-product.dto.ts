import { PartialType, OmitType } from '@nestjs/mapped-types'; // Import thêm OmitType
import { CreateProductDto, CreateVariantDto } from './create-product.dto.js';
import { IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// 1. UpdateVariantDto
// Để làm tính năng Upsert (Thêm/Sửa/Xóa), ID nên là Optional.
// - Có ID: Update
// - Không ID: Create New
export class UpdateVariantDto extends PartialType(CreateVariantDto) {
  @IsOptional()
  @IsNumber()
  id?: number;
}

// 2. UpdateProductDto
// Logic: Lấy tất cả field của CreateProductDto TRỪ 'variants' ra.
// Sau đó biến tất cả thành Optional (PartialType).
// Cuối cùng định nghĩa lại 'variants' theo ý mình.
export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['variants'] as const),
) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVariantDto)
  variants?: UpdateVariantDto[];
}
