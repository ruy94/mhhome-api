import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import marketplaceConfig from '../../config/marketplace.config.js';
import { MarketplaceCatalogService } from './marketplace-catalog.service.js';
import { MarketplaceClientService } from './marketplace-client.service.js';
import {
  MarketplaceSourceController,
  MiniappMarketplaceController,
} from './marketplace.controller.js';
import { MarketplaceHmacGuard } from './marketplace-hmac.guard.js';
import { MarketplaceHmacService } from './marketplace-hmac.service.js';
import { MarketplaceOutboxService } from './marketplace-outbox.service.js';
import { MarketplaceCartService } from './marketplace-cart.service.js';
import { MarketplaceCommerceService } from './marketplace-commerce.service.js';
import { MarketplaceIdempotencyInterceptor } from './marketplace-idempotency.interceptor.js';
import { MarketplaceReservationService } from './marketplace-reservation.service.js';
import { SaleWorkStockSyncModule } from '../salework-sync/salework-stock-sync.module.js';
import { AdminNotificationModule } from '../admin-notification/admin-notification.module.js';

@Module({
  imports: [ConfigModule.forFeature(marketplaceConfig), SaleWorkStockSyncModule, AdminNotificationModule],
  controllers: [MarketplaceSourceController, MiniappMarketplaceController],
  providers: [
    MarketplaceCatalogService,
    MarketplaceClientService,
    MarketplaceHmacService,
    MarketplaceHmacGuard,
    MarketplaceOutboxService,
    MarketplaceCartService,
    MarketplaceCommerceService,
    MarketplaceIdempotencyInterceptor,
    MarketplaceReservationService,
  ],
  exports: [MarketplaceCatalogService, MarketplaceClientService],
})
export class MarketplaceModule {}
