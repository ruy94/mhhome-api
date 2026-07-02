import { IsNotEmpty, IsString } from 'class-validator';

export class DecodePhoneZaloDto {
  @IsNotEmpty()
  @IsString()
  phoneZaloToken!: string;

  @IsNotEmpty()
  @IsString()
  accessZaloToken!: string;
}
