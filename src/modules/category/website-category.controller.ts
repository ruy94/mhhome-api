import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { CategoryService } from './category.service.js';

@Public()
@Controller('website/categories')
export class WebsiteCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.categoryService.findAllWebsite(pageOptionsDto);
  }
}
