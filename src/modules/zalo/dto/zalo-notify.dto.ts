import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class ZaloNotifyDataDto {
  @IsString()
  @IsNotEmpty()
  appId!: string;

  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  method!: string;
}

export class ZaloNotifyDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ZaloNotifyDataDto)
  data!: ZaloNotifyDataDto;

  @IsString()
  @IsNotEmpty()
  mac!: string;
}
