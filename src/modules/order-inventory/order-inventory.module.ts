import { Module } from '@nestjs/common';

import { OrderInventoryService } from './order-inventory.service.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';

@Module({
  imports: [MarketplaceModule],
  providers: [OrderInventoryService],
  exports: [OrderInventoryService],
})
export class OrderInventoryModule {}
