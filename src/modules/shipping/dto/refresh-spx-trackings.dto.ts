import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsOptional } from 'class-validator';

export class RefreshSpxTrackingsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  @IsOptional()
  orderIds?: number[];
}
