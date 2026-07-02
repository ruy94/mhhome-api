import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { FlashSaleService } from './flash-sale.service.js';

@Public()
@Controller('website/flash-sales')
export class WebsiteFlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Get()
  async getActiveFlashSale(@Query('userId') userId?: string) {
    const viewerUserId = userId ? Number(userId) : undefined;
    return await this.flashSaleService.getActiveFlashSale(
      Number.isFinite(viewerUserId) ? viewerUserId : undefined,
    );
  }
}
