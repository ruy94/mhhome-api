import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateZaloVideoDto {
  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsString()
  productLink?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsNotEmpty()
  @IsString()
  videoUrl!: string;

  @IsNotEmpty()
  @IsString()
  videoThumbnail!: string;
}
