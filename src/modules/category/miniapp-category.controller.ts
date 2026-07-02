import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('miniapp/categories')
export class MiniappCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.categoryService.findAllMiniapp(pageOptionsDto);
  }
}
