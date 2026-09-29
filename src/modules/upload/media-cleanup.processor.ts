import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import {
  DELETE_IMAGE_JOB,
  DELETE_VIDEO_JOB,
  MEDIA_CLEANUP_QUEUE,
  type MediaCleanupJobData,
  UploadService,
} from './upload.service.js';

@Processor(MEDIA_CLEANUP_QUEUE, { concurrency: 2 })
export class MediaCleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(MediaCleanupProcessor.name);

  constructor(private readonly uploadService: UploadService) {
    super();
  }

  async process(job: Job<MediaCleanupJobData>): Promise<void> {
    if (job.name === DELETE_IMAGE_JOB) {
      await this.uploadService.deleteImageNow(job.data.filename);
      return;
    }

    if (job.name === DELETE_VIDEO_JOB) {
      await this.uploadService.deleteVideoNow(job.data.filename);
      return;
    }

    this.logger.warn(`Unsupported media cleanup job: ${job.name}`);
  }
}
