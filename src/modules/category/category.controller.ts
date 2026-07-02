import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';

@Controller('categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @RequirePermissions('category:view')
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.categoryService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('category:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.findOne(id);
  }

  @Post()
  @RequirePermissions('category:create')
  async create(@Body() data: CreateCategoryDto) {
    return await this.categoryService.create(data);
  }

  @Put(':id')
  @RequirePermissions('category:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return await this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('category:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.categoryService.remove(id);
  }
}
