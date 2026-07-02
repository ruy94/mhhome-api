import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';
import { UserPlatform } from '../../../generated/prisma/enums.js';

export class UserPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: UserPlatform, description: 'Nguồn đăng ký user' })
  @IsEnum(UserPlatform)
  @IsOptional()
  readonly registeredFrom?: UserPlatform;
}
