import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class SaleworkOrderInfoDto {
  @IsOptional()
  @IsString()
  selected_payment?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total_price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cod?: number;

  @IsOptional()
  @IsString()
  price_policy?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsString()
  discount_type?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  prepaid?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
  complete_now?: boolean;
}

class SaleworkProductInfoDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

class SaleworkPackageInfoDto {
  @IsNumber()
  @Min(0)
  height!: number;

  @IsNumber()
  @Min(0)
  width!: number;

  @IsNumber()
  @Min(0)
  length!: number;

  @IsNumber()
  @Min(0)
  weight!: number;
}

class SaleworkCustomerInfoDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsOptional()
  @IsString()
  phone_alt?: string;

  @IsString()
  @IsNotEmpty()
  address!: string;

  @IsString()
  @IsNotEmpty()
  province_id!: string;

  @IsString()
  @IsNotEmpty()
  district_id!: string;

  @IsString()
  @IsNotEmpty()
  ward_id!: string;

  @IsOptional()
  @IsString()
  note?: string;
}

class SaleworkDeliveryInfoDto {
  @IsString()
  @IsNotEmpty()
  logistics!: string;

  @IsInt()
  @Min(0)
  delivery_fee_paid_by!: number;

  @IsNumber()
  @Min(0)
  shipping_fee!: number;

  @IsNumber()
  @Min(0)
  additional_fee!: number;

  @IsOptional()
  @IsString()
  note?: string;
}

class SaleworkInStoreDeliveryInfoDto {
  @IsString()
  @IsNotEmpty()
  logistics!: string;
}

class SaleworkOrderBaseDto {
  @IsString()
  @IsNotEmpty()
  warehouse_id!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SaleworkOrderInfoDto)
  order_info?: SaleworkOrderInfoDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SaleworkProductInfoDto)
  products_info!: SaleworkProductInfoDto[];

  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkCustomerInfoDto)
  customer_info!: SaleworkCustomerInfoDto;
}

export class CreateSaleworkThirdLogisticsOrderDto extends SaleworkOrderBaseDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkPackageInfoDto)
  package_info!: SaleworkPackageInfoDto;

  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkDeliveryInfoDto)
  delivery_info!: SaleworkDeliveryInfoDto;
}

export class CreateSaleworkSelfLogisticsOrderDto extends SaleworkOrderBaseDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkDeliveryInfoDto)
  delivery_info!: SaleworkDeliveryInfoDto;
}

export class CreateSaleworkInStoreOrderDto extends SaleworkOrderBaseDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => SaleworkInStoreDeliveryInfoDto)
  delivery_info!: SaleworkInStoreDeliveryInfoDto;
}

