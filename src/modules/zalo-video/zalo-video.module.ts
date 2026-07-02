import { Module } from '@nestjs/common';
import { UploadModule } from '../upload/upload.module.js';
import { ZaloVideoService } from './zalo-video.service.js';
import { ZaloVideoController } from './zalo-video.controller.js';
import { MiniappZaloVideoController } from './miniapp-zalo-video.controller.js';
import { WebsiteZaloVideoController } from './website-zalo-video.controller.js';

@Module({
  imports: [UploadModule],
  controllers: [ZaloVideoController, MiniappZaloVideoController, WebsiteZaloVideoController],
  providers: [ZaloVideoService],
  exports: [ZaloVideoService],
})
export class ZaloVideoModule {}
