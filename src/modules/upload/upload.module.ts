import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MEDIA_CLEANUP_QUEUE, UploadService, UPLOAD_VIDEO_QUEUE } from './upload.service.js';
import { UploadController } from './upload.controller.js';
import { UploadVideoProcessor } from './upload-video.processor.js';
import { MediaCleanupProcessor } from './media-cleanup.processor.js';

@Module({
  imports: [BullModule.registerQueue({ name: UPLOAD_VIDEO_QUEUE }, { name: MEDIA_CLEANUP_QUEUE })],
  controllers: [UploadController],
  providers: [UploadService, UploadVideoProcessor, MediaCleanupProcessor],
  exports: [UploadService],
})
export class UploadModule {}
