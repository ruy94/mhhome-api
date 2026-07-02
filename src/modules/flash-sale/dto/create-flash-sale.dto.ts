import { CreateFlashSaleItemDto } from './create-flash-sale-item.dto.js';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlashSaleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDate()
  @Type(() => Date)
  startTime!: Date;

  @IsDate()
  @Type(() => Date)
  endTime!: Date;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleItemDto) // Convert object -> Class Instance
  items!: CreateFlashSaleItemDto[];
}
