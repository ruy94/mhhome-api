import { PartialType } from '@nestjs/mapped-types';
import { CreateZaloVideoDto } from './create-zalo-video.dto.js';

export class UpdateZaloVideoDto extends PartialType(CreateZaloVideoDto) {}
