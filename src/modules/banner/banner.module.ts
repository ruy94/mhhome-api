import { Module } from '@nestjs/common';
import { BannerService } from './banner.service.js';
import { BannerController } from './banner.controller.js';
import { MiniappBannerController } from './miniapp-banner.controller.js';
import { WebsiteBannerController } from './website-banner.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [BannerController, MiniappBannerController, WebsiteBannerController],
  providers: [BannerService],
})
export class BannerModule {}
