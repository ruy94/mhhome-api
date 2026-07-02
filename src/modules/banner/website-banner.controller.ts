import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { BannerService } from './banner.service.js';

@Public()
@Controller('website/banners')
export class WebsiteBannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.bannerService.findAllWebsite(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bannerService.findOneWebsite(id);
  }
}
