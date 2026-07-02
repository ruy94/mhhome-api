import { Module } from '@nestjs/common';
import { AffiliateService } from './affiliate.service.js';
import { MiniappAffiliateController } from './miniapp-affiliate.controller.js';
import { WebsiteAffiliateController } from './website-affiliate.controller.js';
import { AffiliateController } from './affiliate.controller.js';

@Module({
  controllers: [AffiliateController, MiniappAffiliateController, WebsiteAffiliateController],
  providers: [AffiliateService],
  exports: [AffiliateService],
})
export class AffiliateModule {}
