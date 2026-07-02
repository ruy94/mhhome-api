import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt } from 'class-validator';

export class BatchSpxOrdersDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  orderIds!: number[];
}
