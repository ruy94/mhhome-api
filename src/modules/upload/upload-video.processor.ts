import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import {
  COMPRESS_VIDEO_JOB,
  type CompressVideoJobData,
  UPLOAD_VIDEO_QUEUE,
  UploadService,
} from './upload.service.js';

@Processor(UPLOAD_VIDEO_QUEUE, { concurrency: 1 })
export class UploadVideoProcessor extends WorkerHost {
  private readonly logger = new Logger(UploadVideoProcessor.name);

  constructor(private readonly uploadService: UploadService) {
    super();
  }

  async process(job: Job<CompressVideoJobData>): Promise<void> {
    if (job.name !== COMPRESS_VIDEO_JOB) {
      this.logger.warn(`Unsupported upload video job: ${job.name}`);
      return;
    }

    this.logger.log(`Compressing uploaded video: ${job.data.filename}`);
    await this.uploadService.compressQueuedVideo(job.data);
  }
}
