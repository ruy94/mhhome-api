import { PartialType } from '@nestjs/mapped-types';

import { CreateZbDto } from './create-zb.dto.js';

export class UpdateZbDto extends PartialType(CreateZbDto) {}
