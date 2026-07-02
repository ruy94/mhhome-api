import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, ValidateNested } from 'class-validator';

import { AddCartItemDto } from './add-cart-item.dto.js';

export enum SyncCartMode {
  Merge = 'Merge',
  Replace = 'Replace',
}

export class SyncCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddCartItemDto)
  items: AddCartItemDto[] = [];

  @IsOptional()
  @IsEnum(SyncCartMode)
  mode: SyncCartMode = SyncCartMode.Merge;
}
