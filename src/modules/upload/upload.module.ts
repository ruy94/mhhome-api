import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { UploadService, UPLOAD_VIDEO_QUEUE } from './upload.service.js';
import { UploadController } from './upload.controller.js';
import { UploadVideoProcessor } from './upload-video.processor.js';

@Module({
  imports: [BullModule.registerQueue({ name: UPLOAD_VIDEO_QUEUE })],
  controllers: [UploadController],
  providers: [UploadService, UploadVideoProcessor],
  exports: [UploadService],
})
export class UploadModule {}
