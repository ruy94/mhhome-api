import { PartialType } from '@nestjs/mapped-types';

import { CreateWebsiteUserDto } from './create-website-user.dto.js';

export class UpdateWebsiteUserDto extends PartialType(CreateWebsiteUserDto) {}
