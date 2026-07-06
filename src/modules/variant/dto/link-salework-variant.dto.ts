import { IsNotEmpty, IsString } from 'class-validator';

export class LinkSaleworkVariantDto {
  @IsString()
  @IsNotEmpty()
  saleworkProductCode!: string;

  @IsString()
  @IsNotEmpty()
  saleworkWarehouseId!: string;
}
