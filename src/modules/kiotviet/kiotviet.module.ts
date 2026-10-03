import { forwardRef, Module } from '@nestjs/common';
import { KiotVietIntegrationModule } from '../integrations/kiotviet/kiotviet-integration.module.js';
import { KiotVietController, KiotVietWebhookController } from './kiotviet.controller.js';
import { KiotVietService } from './kiotviet.service.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';
import { KiotVietWebhookProcessor } from './kiotviet-webhook.processor.js';
import { KiotVietInvoiceService } from './kiotviet-invoice.service.js';
import { KiotVietOrderExportService } from './kiotviet-order-export.service.js';

@Module({
  imports: [KiotVietIntegrationModule, forwardRef(() => MarketplaceModule)],
  controllers: [KiotVietController, KiotVietWebhookController],
  providers: [
    KiotVietService,
    KiotVietInvoiceService,
    KiotVietOrderExportService,
    KiotVietWebhookProcessor,
  ],
  exports: [KiotVietService, KiotVietOrderExportService],
})
export class KiotVietModule {}
