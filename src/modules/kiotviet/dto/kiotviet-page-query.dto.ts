import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class KiotVietPageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  currentItem = 0;
}

export class KiotVietProductsQueryDto extends KiotVietPageQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
