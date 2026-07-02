import { Module } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { MiniappCategoryController } from './miniapp-category.controller.js';
import { WebsiteCategoryController } from './website-category.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [CategoryController, MiniappCategoryController, WebsiteCategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
