import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export class ReviewQueryDto extends PageOptionsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  readonly rating?: number;

  @IsString()
  @IsOptional()
  readonly ratings?: string;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  @IsOptional()
  readonly hasMedia?: boolean;

  get ratingValues(): number[] {
    const values = [
      ...(this.rating ? [this.rating] : []),
      ...(this.ratings ?? '')
        .split(',')
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= 5),
    ];

    return Array.from(new Set(values));
  }
}
