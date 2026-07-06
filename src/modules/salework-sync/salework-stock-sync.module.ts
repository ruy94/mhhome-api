import { Module } from '@nestjs/common';

import { SaleworkIntegrationModule } from '../integrations/salework/salework.module.js';
import { SaleWorkStockSyncService } from './salework-stock-sync.service.js';

@Module({
  imports: [SaleworkIntegrationModule],
  providers: [SaleWorkStockSyncService],
  exports: [SaleWorkStockSyncService],
})
export class SaleWorkStockSyncModule {}
