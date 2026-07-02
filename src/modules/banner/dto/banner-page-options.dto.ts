import { IsEnum, IsNotEmpty } from 'class-validator';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';
import { UserPlatform } from '../../../generated/prisma/enums.js';

export class BannerPageOptionsDto extends PageOptionsDto {
  @IsEnum(UserPlatform)
  @IsNotEmpty()
  readonly platform!: UserPlatform;
}
