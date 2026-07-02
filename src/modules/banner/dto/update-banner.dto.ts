import { ArrayMaxSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserPlatform } from '../../../generated/prisma/enums.js';

export class UpdateBannerDto {
  @IsEnum(UserPlatform)
  @IsNotEmpty()
  platform!: UserPlatform;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  adBanners?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @IsString({ each: true })
  camBanners?: string[];
}
