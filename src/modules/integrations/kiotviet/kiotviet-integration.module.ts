import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';

import kiotvietConfig from '../../../config/kiotviet.config.js';
import { KiotVietAuthService } from './kiotviet-auth.service.js';
import { KiotVietBranchService } from './kiotviet-branch.service.js';
import { KiotVietClientService } from './kiotviet-client.service.js';
import { KIOTVIET_STOCK_QUEUE } from '../../kiotviet/kiotviet-stock-sync.js';

@Module({
  imports: [
    ConfigModule.forFeature(kiotvietConfig),
    BullModule.registerQueue({ name: KIOTVIET_STOCK_QUEUE }),
  ],
  providers: [KiotVietAuthService, KiotVietClientService, KiotVietBranchService],
  exports: [KiotVietClientService, KiotVietBranchService, BullModule],
})
export class KiotVietIntegrationModule {}
