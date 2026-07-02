import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('miniapp/products')
export class MiniappProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: ProductQueryDto) {
    return await this.productService.findAllMiniapp(pageOptionsDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptionsDto: ProductQueryDto,
  ) {
    return await this.productService.findOne(id, {
      publicView: true,
      viewerUserId: pageOptionsDto.userId,
    });
  }
}
