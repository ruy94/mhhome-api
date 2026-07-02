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
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @RequirePermissions('product:view')
  async findAll(@Query() pageOptionsDto: ProductQueryDto) {
    return await this.productService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('product:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.findOne(id);
  }

  @Post()
  @RequirePermissions('product:create')
  async create(@Body() data: CreateProductDto) {
    return await this.productService.create(data);
  }

  @Put(':id')
  @RequirePermissions('product:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return await this.productService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('product:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productService.remove(id);
  }
}
