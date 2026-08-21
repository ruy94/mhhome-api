import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import {
  MarketplaceOutboxEventType,
  MarketplaceOutboxStatus,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MarketplaceCatalogService } from './marketplace-catalog.service.js';
import { MarketplaceClientService } from './marketplace-client.service.js';

const MAX_ATTEMPTS = 3;
const OUTBOX_BATCH_SIZE = 50;

@Injectable()
export class MarketplaceOutboxService {
  private readonly logger = new Logger(MarketplaceOutboxService.name);
  private running = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: MarketplaceCatalogService,
    private readonly client: MarketplaceClientService,
  ) {}

  @Interval(10_000)
  async processPending() {
    if (!this.catalog.isEnabled() || this.running) return;
    this.running = true;
    try {
      const now = new Date();
      await this.prisma.marketplaceOutboxLog.updateMany({
        where: {
          status: MarketplaceOutboxStatus.Processing,
          updatedAt: { lt: new Date(now.getTime() - 5 * 60_000) },
          attemptCount: { lt: MAX_ATTEMPTS },
        },
        data: { status: MarketplaceOutboxStatus.Failed, nextAttemptAt: now },
      });

      const logs = await this.prisma.marketplaceOutboxLog.findMany({
        where: {
          attemptCount: { lt: MAX_ATTEMPTS },
          OR: [
            { status: MarketplaceOutboxStatus.Pending },
            {
              status: MarketplaceOutboxStatus.Failed,
              nextAttemptAt: { lte: now },
            },
          ],
        },
        orderBy: { createdAt: 'asc' },
        take: OUTBOX_BATCH_SIZE,
      });

      for (const log of logs) await this.processOne(log.id, log.status);
    } finally {
      this.running = false;
    }
  }

  private async processOne(id: string, previousStatus: MarketplaceOutboxStatus) {
    const claimed = await this.prisma.marketplaceOutboxLog.updateMany({
      where: { id, status: previousStatus, attemptCount: { lt: MAX_ATTEMPTS } },
      data: { status: MarketplaceOutboxStatus.Processing, nextAttemptAt: null },
    });
    if (!claimed.count) return;

    const log = await this.prisma.marketplaceOutboxLog.findUnique({ where: { id } });
    if (!log) return;

    try {
      await this.client.sendCatalogEvent(log.id, {
        eventId: log.id,
        eventType:
          log.eventType === MarketplaceOutboxEventType.ProductDeleted
            ? 'product.deleted'
            : 'product.upsert',
        sequence: log.sequence,
        occurredAt: log.createdAt.toISOString(),
        sourceProductId: String(log.productId),
        ...(log.eventType === MarketplaceOutboxEventType.ProductUpsert
          ? { product: log.payload }
          : {}),
      });
      await this.prisma.marketplaceOutboxLog.update({
        where: { id },
        data: {
          status: MarketplaceOutboxStatus.Success,
          attemptCount: { increment: 1 },
          processedAt: new Date(),
          lastError: null,
          nextAttemptAt: null,
        },
      });
    } catch (error) {
      const attemptCount = log.attemptCount + 1;
      const message = error instanceof Error ? error.message : 'Marketplace catalog sync failed';
      await this.prisma.marketplaceOutboxLog.update({
        where: { id },
        data: {
          status: MarketplaceOutboxStatus.Failed,
          attemptCount,
          lastError: message,
          nextAttemptAt:
            attemptCount < MAX_ATTEMPTS
              ? new Date(Date.now() + 5_000 * 2 ** (attemptCount - 1))
              : null,
        },
      });
      this.logger.error(`Marketplace outbox ${id} failed (${attemptCount}/${MAX_ATTEMPTS}): ${message}`);
    }
  }
}
