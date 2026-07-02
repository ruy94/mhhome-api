import { ArrayMaxSize, ArrayMinSize, IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class GetShippingAwbDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsInt({ each: true })
  @IsOptional()
  orderIds?: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsString({ each: true })
  @IsOptional()
  trackingNos?: string[];
}
