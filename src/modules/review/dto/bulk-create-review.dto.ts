import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { CreateReviewDto } from './create-review.dto.js';

export class BulkCreateReviewDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Danh sách review không được để trống' })
  @ValidateNested({ each: true }) // Validate từng object con bên trong mảng
  @Type(() => CreateReviewDto) // Convert object thường thành instance của CreateReviewDto
  reviews!: CreateReviewDto[];
}
