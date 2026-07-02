import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BannerService } from './banner.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';

@Public()
@Controller('miniapp/banners')
export class MiniappBannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.bannerService.findAllMiniapp(pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.bannerService.findOneMiniapp(id);
  }
}
