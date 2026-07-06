import { Module } from '@nestjs/common';

import { SpxShippingModule } from '../integrations/shipping/spx/spx-shipping.module.js';
import { ShippingController } from './shipping.controller.js';
import { SpxWebhookController } from './spx-webhook.controller.js';
import { SpxWebhookSignatureGuard } from './spx-webhook-signature.guard.js';
import { ShippingService } from './shipping.service.js';
import { SaleWorkStockSyncModule } from '../salework-sync/salework-stock-sync.module.js';
import { OrderInventoryModule } from '../order-inventory/order-inventory.module.js';

@Module({
  imports: [SpxShippingModule, SaleWorkStockSyncModule, OrderInventoryModule],
  controllers: [ShippingController, SpxWebhookController],
  providers: [ShippingService, SpxWebhookSignatureGuard],
  exports: [ShippingService],
})
export class ShippingModule {}
