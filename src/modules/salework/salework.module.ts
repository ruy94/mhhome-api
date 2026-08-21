import { Module } from '@nestjs/common';

import { SaleworkIntegrationModule } from '../integrations/salework/salework.module.js';
import { SaleworkController } from './salework.controller.js';
import { SaleworkService } from './salework.service.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';

@Module({
  imports: [SaleworkIntegrationModule, MarketplaceModule],
  controllers: [SaleworkController],
  providers: [SaleworkService],
})
export class SaleworkModule {}
