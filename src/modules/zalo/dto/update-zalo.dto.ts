import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloDto } from './create-zalo.dto.js';

export class UpdateZaloDto extends PartialType(CreateZaloDto) {}
