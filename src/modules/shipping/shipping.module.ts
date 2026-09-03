import { Module } from '@nestjs/common';

import { SpxShippingModule } from '../integrations/shipping/spx/spx-shipping.module.js';
import { VtpShippingModule } from '../integrations/shipping/vtp/vtp-shipping.module.js';
import { ShippingController } from './shipping.controller.js';
import { SpxWebhookController } from './spx-webhook.controller.js';
import { SpxWebhookSignatureGuard } from './spx-webhook-signature.guard.js';
import { VtpWebhookController } from './vtp-webhook.controller.js';
import { VtpWebhookSignatureGuard } from './vtp-webhook-signature.guard.js';
import { ShippingService } from './shipping.service.js';
import { SaleWorkStockSyncModule } from '../salework-sync/salework-stock-sync.module.js';
import { RedisModule } from '../../common/redis/redis.module.js';
import { AdminNotificationModule } from '../admin-notification/admin-notification.module.js';
import { OrderInventoryModule } from '../order-inventory/order-inventory.module.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';

@Module({
  imports: [SpxShippingModule, VtpShippingModule, SaleWorkStockSyncModule, OrderInventoryModule, MarketplaceModule, RedisModule, AdminNotificationModule],
  controllers: [ShippingController, SpxWebhookController, VtpWebhookController],
  providers: [ShippingService, SpxWebhookSignatureGuard, VtpWebhookSignatureGuard],
  exports: [ShippingService],
})
export class ShippingModule {}
