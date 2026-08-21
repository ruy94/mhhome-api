import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module.js';
import { ZaloVideoService } from './zalo-video.service.js';
import { ZaloVideoController } from './zalo-video.controller.js';
import { MiniappZaloVideoController } from './miniapp-zalo-video.controller.js';
import { WebsiteZaloVideoController } from './website-zalo-video.controller.js';
import { MarketplaceModule } from '../marketplace/marketplace.module.js';

@Module({
  imports: [UploadModule, MarketplaceModule],
  controllers: [ZaloVideoController, MiniappZaloVideoController, WebsiteZaloVideoController],
  providers: [ZaloVideoService],
  exports: [ZaloVideoService],
})
export class ZaloVideoModule {}
