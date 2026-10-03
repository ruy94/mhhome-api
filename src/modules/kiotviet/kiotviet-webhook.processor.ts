import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import type { Job } from 'bullmq';
import { KiotVietService } from './kiotviet.service.js';
import {
  KIOTVIET_STOCK_EVENT_JOB,
  KIOTVIET_STOCK_QUEUE,
  KIOTVIET_STOCK_SYNC_JOB,
  type KiotVietStockEventJob,
  type KiotVietStockSyncJob,
  type KiotVietStockSyncResult,
} from './kiotviet-stock-sync.js';

@Injectable()
@Processor(KIOTVIET_STOCK_QUEUE, { concurrency: 1 })
export class KiotVietWebhookProcessor extends WorkerHost {
  constructor(private readonly service: KiotVietService) {
    super();
  }

  async process(
    job: Job<KiotVietStockEventJob | KiotVietStockSyncJob>,
  ): Promise<KiotVietStockSyncResult | void> {
    if (job.name === KIOTVIET_STOCK_EVENT_JOB) {
      await this.service.processStockWebhook(job.data as KiotVietStockEventJob);
      return;
    }
    if (job.name === KIOTVIET_STOCK_SYNC_JOB) {
      return this.service.processStockSync(job.data as KiotVietStockSyncJob, (progress) =>
        job.updateProgress(progress),
      );
    }
  }
}
