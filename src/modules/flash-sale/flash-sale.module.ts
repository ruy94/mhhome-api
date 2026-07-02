import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service.js';
import { FlashSaleController } from './flash-sale.controller.js';
import { MiniappFlashSaleController } from './miniapp-flash-sale.controller.js';
import { WebsiteFlashSaleController } from './website-flash-sale.controller.js';

@Module({
  controllers: [FlashSaleController, MiniappFlashSaleController, WebsiteFlashSaleController],
  providers: [FlashSaleService],
})
export class FlashSaleModule {}
