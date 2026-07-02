import { Controller, Get, Query } from '@nestjs/common';
import { ZaloVideoService } from './zalo-video.service.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('miniapp/zalo-videos')
export class MiniappZaloVideoController {
  constructor(private readonly zaloVideoService: ZaloVideoService) {}

  @Get()
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.zaloVideoService.findAll(pageOptionsDto);
  }
}
