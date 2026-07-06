import { Module } from '@nestjs/common';
import { OrderService } from './order.service.js';
import { OrderController } from './order.controller.js';
import { MiniappOrderController } from './miniapp-order.controller.js';
import { WebsiteOrderController } from './website-order.controller.js';
import { MiniappShippingController } from './miniapp-shipping.controller.js';
import { WebsiteShippingController } from './website-shipping.controller.js';
import { AffiliateModule } from '../affiliate/affiliate.module.js';
import { ShippingModule } from '../shipping/shipping.module.js';
import { SaleWorkStockSyncModule } from '../salework-sync/salework-stock-sync.module.js';
import { OrderInventoryModule } from '../order-inventory/order-inventory.module.js';

@Module({
  imports: [AffiliateModule, ShippingModule, SaleWorkStockSyncModule, OrderInventoryModule],
  controllers: [OrderController, MiniappOrderController, WebsiteOrderController, MiniappShippingController, WebsiteShippingController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
