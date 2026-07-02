import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { ProductService } from './product.service.js';
import { WebsiteProductQueryDto } from './dto/website-product-query.dto.js';

@Public()
@Controller('website/products')
export class WebsiteProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: WebsiteProductQueryDto) {
    return await this.productService.findAllWebsite(pageOptionsDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptionsDto: WebsiteProductQueryDto,
  ) {
    return await this.productService.findOne(id, {
      publicView: true,
      viewerUserId: pageOptionsDto.userId,
    });
  }
}
