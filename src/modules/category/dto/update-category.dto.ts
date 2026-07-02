import { PartialType } from '@nestjs/mapped-types'; // Dùng cái này thay vì @nestjs/swagger
import { CreateCategoryDto } from './create-category.dto.js';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
