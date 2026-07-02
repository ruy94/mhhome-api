import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { ZaloVideoService } from './zalo-video.service.js';

@Public()
@Controller('website/zalo-videos')
export class WebsiteZaloVideoController {
  constructor(private readonly zaloVideoService: ZaloVideoService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.zaloVideoService.findAll(pageOptionsDto);
  }
}
