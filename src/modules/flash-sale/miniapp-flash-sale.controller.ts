import { Controller, Get, Query } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('miniapp/flash-sales')
export class MiniappFlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Get()
  async getActiveFlashSale(@Query('userId') userId?: string) {
    const viewerUserId = userId ? Number(userId) : undefined;
    return await this.flashSaleService.getActiveFlashSale(
      Number.isFinite(viewerUserId) ? viewerUserId : undefined,
    );
  }
}
