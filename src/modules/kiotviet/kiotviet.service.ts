import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { createHash, createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { Queue } from 'bullmq';
import axios from 'axios';

import kiotvietConfig from '../../config/kiotviet.config.js';
import { KiotVietBranchService } from '../integrations/kiotviet/kiotviet-branch.service.js';
import {
  encodeKiotVietWebhookSecret,
  KiotVietClientService,
} from '../integrations/kiotviet/kiotviet-client.service.js';
import { KiotVietPageQueryDto, KiotVietProductsQueryDto } from './dto/kiotviet-page-query.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { MarketplaceCatalogService } from '../marketplace/marketplace-catalog.service.js';
import { RedisService } from '../../common/redis/redis.service.js';
import {
  InventoryProvider,
  KiotVietOutboxStatus,
  MarketplaceReservationStatus,
  OrderStatus,
} from '../../generated/prisma/enums.js';
import { parseKiotVietStock } from './kiotviet-stock.js';
import { KiotVietInvoiceService } from './kiotviet-invoice.service.js';
import { KiotVietOrderExportService } from './kiotviet-order-export.service.js';
import {
  KIOTVIET_STOCK_EVENT_JOB,
  KIOTVIET_STOCK_QUEUE,
  KIOTVIET_STOCK_SYNC_JOB,
  type KiotVietStockEventJob,
  type KiotVietStockSyncJob,
  type KiotVietStockSyncJobStatus,
  type KiotVietStockSyncProgress,
  type KiotVietStockSyncRequestResult,
  type KiotVietStockSyncResult,
  type KiotVietStockSyncSource,
} from './kiotviet-stock-sync.js';

export { KIOTVIET_STOCK_EVENT_JOB, KIOTVIET_STOCK_QUEUE } from './kiotviet-stock-sync.js';
const WEBHOOK_INITIAL_DELAY_MS = 15_000;
const WEBHOOK_RETRY_INITIAL_MS = 60_000;
const WEBHOOK_RETRY_MAX_MS = 30 * 60_000;
const WEBHOOK_HEALTHY_CHECK_MS = 30 * 60_000;
const STOCK_READ_CONCURRENCY = 7;
const STOCK_READ_MAX_ATTEMPTS = 3;
const STOCK_READ_RETRY_DELAY_MS = 250;

type StockFetchFailure = { code: string; reason: string };
type StockFetchResult = {
  stocks: Map<string, number>;
  failedItems: StockFetchFailure[];
};

@Injectable()
export class KiotVietService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KiotVietService.name);
  private pollTimer: NodeJS.Timeout | null = null;
  private webhookTimer: NodeJS.Timeout | null = null;
  private webhookRegistrationRunning = false;
  private webhookRetryMs = WEBHOOK_RETRY_INITIAL_MS;
  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
    private readonly client: KiotVietClientService,
    private readonly branches: KiotVietBranchService,
    private readonly prisma: PrismaService,
    private readonly marketplaceCatalog: MarketplaceCatalogService,
    private readonly redis: RedisService,
    @InjectQueue(KIOTVIET_STOCK_QUEUE) private readonly webhookQueue: Queue,
    private readonly invoices: KiotVietInvoiceService,
    private readonly orderExports: KiotVietOrderExportService,
  ) {}

  private invoiceWriteEnabled(): boolean {
    return (
      this.cfg.autoWriteFrom instanceof Date && Number.isFinite(this.cfg.autoWriteFrom.getTime())
    );
  }

  onModuleInit(): void {
    if (this.cfg.enabled && this.cfg.stockSyncEnabled) {
      if (this.invoiceWriteEnabled())
        this.invoices.setOnSucceeded((orderId) => this.reconcileAfterOrderPaid(orderId));
      this.orderExports.setOnStockChanged((source, codes, orderId) =>
        this.requestStockSync(source, codes, orderId).then(() => undefined),
      );
      this.pollTimer = setInterval(
        () => void this.requestStockSyncSafely('POLL'),
        this.cfg.stockPollSeconds * 1000,
      );
      this.pollTimer.unref();
      void this.requestStockSyncSafely('STARTUP');
    }
    if (this.cfg.webhookEnabled) this.scheduleWebhookRegistration(WEBHOOK_INITIAL_DELAY_MS);
  }

  onModuleDestroy(): void {
    if (this.pollTimer) clearInterval(this.pollTimer);
    if (this.webhookTimer) clearTimeout(this.webhookTimer);
    this.pollTimer = null;
    this.webhookTimer = null;
  }

  private scheduleWebhookRegistration(delayMs: number): void {
    if (!this.cfg.webhookEnabled) return;
    if (this.webhookTimer) clearTimeout(this.webhookTimer);
    this.webhookTimer = setTimeout(() => void this.reconcileWebhookRegistrationSafely(), delayMs);
    this.webhookTimer.unref();
  }

  private async requestStockSyncSafely(source: KiotVietStockSyncSource): Promise<void> {
    try {
      await this.requestStockSync(source);
    } catch (error) {
      this.logger.error(
        `Could not enqueue KiotViet ${source.toLowerCase()} stock sync: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async reconcileWebhookRegistrationSafely(): Promise<void> {
    if (this.webhookRegistrationRunning || !this.cfg.webhookEnabled) return;
    this.webhookRegistrationRunning = true;
    let nextDelayMs = WEBHOOK_HEALTHY_CHECK_MS;
    try {
      const status = await this.registerStockWebhook();
      this.webhookRetryMs = WEBHOOK_RETRY_INITIAL_MS;
      this.logger.log(
        `KiotViet stock webhook is active${status.webhookId ? ` (#${String(status.webhookId)})` : ''}`,
      );
    } catch (error) {
      nextDelayMs = this.webhookRetryMs;
      this.webhookRetryMs = Math.min(this.webhookRetryMs * 2, WEBHOOK_RETRY_MAX_MS);
      this.logger.warn(
        `KiotViet webhook auto-registration failed; API remains available and will retry: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      this.webhookRegistrationRunning = false;
      this.scheduleWebhookRegistration(nextDelayMs);
    }
  }

  async getStatus() {
    const pendingEvents = this.cfg.stockSyncEnabled
      ? await this.webhookQueue.getJobCounts('waiting', 'active', 'delayed', 'failed')
      : null;
    const lastSuccessfulSyncAt = this.cfg.stockSyncEnabled
      ? await this.redis.getClient().get('kiotviet:last-successful-stock-sync')
      : null;
    const webhookActive = this.cfg.webhookEnabled
      ? (await this.redis.getClient().get('kiotviet:webhook:active')) === '1'
      : false;
    const lastWebhookReceivedAt = this.cfg.webhookEnabled
      ? await this.redis.getClient().get('kiotviet:webhook:last-received-at')
      : null;
    const lastWebhookProcessedAt = this.cfg.webhookEnabled
      ? await this.redis.getClient().get('kiotviet:webhook:last-processed-at')
      : null;
    const lastSyncMs = lastSuccessfulSyncAt ? Date.parse(lastSuccessfulSyncAt) : NaN;
    return {
      enabled: this.cfg.enabled,
      mode: !this.cfg.enabled
        ? ('DISABLED' as const)
        : this.invoiceWriteEnabled()
          ? ('MANUAL_INVOICE' as const)
          : this.cfg.stockSyncEnabled
            ? ('STOCK_SYNC' as const)
            : ('READ_ONLY' as const),
      retailerConfigured: Boolean(this.cfg.retailer),
      branchIdConfigured: this.cfg.branchId,
      stockSyncEnabled: this.cfg.stockSyncEnabled,
      // Kept for Admin API compatibility: invoices are never sent without seller confirmation.
      autoWriteEnabled: false,
      invoiceWriteEnabled: this.invoiceWriteEnabled(),
      autoWriteFrom: this.cfg.autoWriteFrom?.toISOString() ?? null,
      webhookEnabled: this.cfg.webhookEnabled,
      callbackConfigured: Boolean(this.cfg.callbackUrl),
      webhookActive,
      lastWebhookReceivedAt,
      lastWebhookProcessedAt,
      lastSuccessfulSyncAt,
      stockStale:
        this.cfg.stockSyncEnabled &&
        (!Number.isFinite(lastSyncMs) ||
          (!webhookActive && Date.now() - lastSyncMs > this.cfg.stockStaleSeconds * 1000)),
      stockPollSeconds: this.cfg.stockPollSeconds,
      safetyStock: this.cfg.safetyStock,
      pendingEvents,
      syncState: pendingEvents?.active
        ? ('RUNNING' as const)
        : (pendingEvents?.waiting ?? 0) + (pendingEvents?.delayed ?? 0) > 0
          ? ('QUEUED' as const)
          : ('IDLE' as const),
    };
  }

  async requestStockSync(
    source: KiotVietStockSyncSource,
    codes: string[] = [],
    orderId?: number,
  ): Promise<KiotVietStockSyncRequestResult> {
    this.assertEnabled();
    if (!this.cfg.stockSyncEnabled)
      throw new ServiceUnavailableException('Đồng bộ tồn KiotViet chưa được bật');

    const normalizedCodes = [...new Set(codes.map((code) => code.trim()).filter(Boolean))].sort();
    const pending = await this.webhookQueue.getJobs(['active', 'waiting', 'delayed'], 0, 100);
    const existing =
      source === 'ORDER_PAID'
        ? undefined
        : pending.find((job) => {
            if (job.name !== KIOTVIET_STOCK_SYNC_JOB) return false;
            const data = job.data as KiotVietStockSyncJob;
            if (!data.codes.length) return true;
            if (!normalizedCodes.length) return false;
            return normalizedCodes.every((code) => data.codes.includes(code));
          });
    if (existing) {
      const state = await existing.getState();
      return {
        state: state === 'active' ? 'RUNNING' : 'QUEUED',
        accepted: true,
        started: false,
        jobId: String(existing.id),
        message: 'Đồng bộ KiotViet đang được xử lý',
      };
    }

    const fingerprint = createHash('sha256')
      .update(normalizedCodes.length ? normalizedCodes.join('\n') : 'all')
      .digest('hex')
      .slice(0, 16);
    const job = await this.webhookQueue.add(
      KIOTVIET_STOCK_SYNC_JOB,
      { source, codes: normalizedCodes, requestedAt: new Date().toISOString(), orderId },
      {
        jobId: `sync-${fingerprint}-${randomUUID()}`,
        priority: source === 'CHECKOUT' ? 1 : source === 'MANUAL' ? 5 : 10,
        attempts: 8,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { age: 3600, count: 1000 },
      },
    );
    return {
      state: 'QUEUED',
      accepted: true,
      started: true,
      jobId: String(job.id),
      message: 'Đã xếp hàng đồng bộ tồn kho KiotViet',
    };
  }

  async getStockSyncJob(jobId: string): Promise<KiotVietStockSyncJobStatus> {
    const job = await this.webhookQueue.getJob(jobId);
    if (!job || job.name !== KIOTVIET_STOCK_SYNC_JOB)
      throw new NotFoundException('Không tìm thấy lượt đồng bộ tồn kho KiotViet');

    const state = await job.getState();
    const data = job.data as KiotVietStockSyncJob;
    const result =
      state === 'completed' && job.returnvalue && typeof job.returnvalue === 'object'
        ? (job.returnvalue as KiotVietStockSyncResult)
        : null;
    const progress =
      job.progress && typeof job.progress === 'object'
        ? (job.progress as KiotVietStockSyncProgress)
        : null;
    const normalizedState: KiotVietStockSyncJobStatus['state'] =
      state === 'completed'
        ? result && result.failed > 0
          ? 'PARTIAL'
          : 'SUCCEEDED'
        : state === 'failed'
          ? 'FAILED'
          : state === 'active'
            ? 'RUNNING'
            : 'QUEUED';

    return {
      jobId: String(job.id),
      state: normalizedState,
      source: data.source,
      requestedAt: data.requestedAt,
      progress,
      result,
      error: normalizedState === 'FAILED' ? job.failedReason || 'Đồng bộ KiotViet thất bại' : null,
    };
  }

  async testConnection() {
    this.assertEnabled();
    const branch = await this.branches.resolve();
    return {
      connected: true,
      mode: this.invoiceWriteEnabled()
        ? ('MANUAL_INVOICE' as const)
        : this.cfg.stockSyncEnabled
          ? ('STOCK_SYNC' as const)
          : ('READ_ONLY' as const),
      branch,
    };
  }

  async getBranches(query: KiotVietPageQueryDto) {
    this.assertEnabled();
    return this.client.getBranches(query.pageSize, query.currentItem);
  }

  async getProducts(query: KiotVietProductsQueryDto) {
    this.assertEnabled();
    const searchValue = query.name?.trim();

    if (!searchValue) {
      return this.client.getProducts({
        pageSize: query.pageSize,
        currentItem: query.currentItem,
        includeInventory: true,
      });
    }

    if (!searchValue.includes(' ')) {
      const product = await this.client.getProductByCode(searchValue);
      if (product) {
        return {
          total: 1,
          pageSize: query.pageSize,
          data: [product],
        };
      }
    }

    return this.client.getProducts({
      pageSize: query.pageSize,
      currentItem: query.currentItem,
      name: searchValue,
      includeInventory: true,
    });
  }

  private assertEnabled(): void {
    if (!this.cfg.enabled) throw new ServiceUnavailableException('Tích hợp KiotViet chưa được bật');
  }

  async linkVariant(id: number, rawCode: string) {
    const operationId = randomUUID();
    const startedAt = Date.now();
    const code = typeof rawCode === 'string' ? rawCode.trim() : '';
    let branchId: number | undefined;
    let stage = 'validate';
    this.logger.log({
      event: 'kiotviet.link.started',
      operationId,
      variantId: id,
      productCode: code.slice(0, 255),
    });
    try {
      this.assertEnabled();
      if (!this.cfg.stockSyncEnabled)
        throw new ServiceUnavailableException('Đồng bộ tồn KiotViet chưa được bật');
      if (!code || code.length > 255) throw new BadRequestException('Mã SKU KiotViet không hợp lệ');
      const variant = await this.prisma.variant.findFirst({ where: { id, isDeleted: 0 } });
      if (!variant) throw new NotFoundException('Không tìm thấy SKU nội bộ');
      if (variant.saleworkProductCode || variant.saleworkWarehouseId) {
        throw new BadRequestException('Hãy hủy liên kết SaleWork trước khi liên kết KiotViet');
      }
      stage = 'active-holds';
      await this.assertNoActiveHolds(id);
      stage = 'resolve-branch';
      const branch = await this.branches.resolve();
      branchId = branch.id;
      stage = 'read-product';
      const remote = await this.client.getProductByCode(code, operationId);
      if (
        !remote ||
        remote.code !== code ||
        remote.isActive === false ||
        remote.allowsSale === false
      ) {
        throw new BadRequestException('SKU KiotViet không tồn tại hoặc không được bán');
      }
      stage = 'read-inventory';
      const inventory = Array.isArray(remote.inventories)
        ? remote.inventories
            .map((value: unknown) => parseKiotVietStock(value, code))
            .find((value) => value?.branchId === branch.id)
        : undefined;
      if (!inventory)
        throw new BadRequestException('Không tìm thấy tồn SKU tại chi nhánh KiotViet');
      const stock = Math.max(0, Math.floor(inventory.onHand - inventory.reserved));
      stage = 'save-link';
      const result = await this.prisma.$transaction(async (tx) => {
        const syncedAt = new Date();
        const sharedInventory = await tx.kiotVietInventory.upsert({
          where: { productCode: code },
          create: {
            productCode: code,
            branchId: branch.id,
            remoteAvailableStock: stock,
            availableStock: Math.max(0, stock - (this.cfg.safetyStock ?? 0)),
            stockSyncedAt: syncedAt,
          },
          update: {},
        });
        if (sharedInventory.branchId !== branch.id) {
          throw new ConflictException(
            `Mã ${code} đã liên kết với chi nhánh KiotViet #${sharedInventory.branchId}`,
          );
        }
        const updated = await tx.variant.update({
          where: { id },
          data: {
            kiotvietProductCode: code,
            kiotvietBranchId: branch.id,
            kiotvietLinkedAt: syncedAt,
            kiotvietStockSyncedAt: sharedInventory.stockSyncedAt,
            inventoryProvider: InventoryProvider.KIOTVIET,
            stock: sharedInventory.availableStock,
          },
        });
        if (variant.kiotvietProductCode && variant.kiotvietProductCode !== code) {
          const remaining = await tx.variant.count({
            where: {
              id: { not: id },
              kiotvietProductCode: variant.kiotvietProductCode,
            },
          });
          if (!remaining) {
            await tx.kiotVietInventory.deleteMany({
              where: { productCode: variant.kiotvietProductCode },
            });
          }
        }
        await this.marketplaceCatalog.recordProductChanges(tx, [variant.productId]);
        return updated;
      });
      this.logger.log({
        event: 'kiotviet.link.succeeded',
        operationId,
        variantId: id,
        productCode: code,
        branchId,
        stage,
        durationMs: Date.now() - startedAt,
      });
      return result;
    } catch (error) {
      this.logger.warn({
        event: 'kiotviet.link.failed',
        operationId,
        variantId: id,
        productCode: code.slice(0, 255),
        branchId,
        stage,
        durationMs: Date.now() - startedAt,
        errorType: error instanceof Error ? error.name : 'UnknownError',
      });
      throw error;
    }
  }

  async unlinkVariant(id: number) {
    const variant = await this.prisma.variant.findFirst({ where: { id, isDeleted: 0 } });
    if (!variant) throw new NotFoundException('Không tìm thấy SKU nội bộ');
    await this.assertNoActiveHolds(id);
    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.variant.update({
        where: { id },
        data: {
          kiotvietProductCode: null,
          kiotvietBranchId: null,
          kiotvietLinkedAt: null,
          kiotvietStockSyncedAt: null,
          inventoryProvider: InventoryProvider.LOCAL,
        },
      });
      if (variant.kiotvietProductCode) {
        const remaining = await tx.variant.count({
          where: {
            id: { not: id },
            kiotvietProductCode: variant.kiotvietProductCode,
          },
        });
        if (!remaining) {
          await tx.kiotVietInventory.deleteMany({
            where: { productCode: variant.kiotvietProductCode },
          });
        }
      }
      await this.marketplaceCatalog.recordProductChanges(tx, [variant.productId]);
      return updated;
    });
  }

  private async assertNoActiveHolds(id: number): Promise<void> {
    const [orders, reservations] = await Promise.all([
      this.prisma.orderProduct.count({
        where: {
          variantId: id,
          order: {
            status: {
              in: [
                OrderStatus.Pending,
                OrderStatus.Prepare,
                OrderStatus.Delivering,
                OrderStatus.SoftCancel,
              ],
            },
          },
        },
      }),
      this.prisma.marketplaceInventoryReservation.count({
        where: { variantId: id, reservation: { status: MarketplaceReservationStatus.Reserved } },
      }),
    ]);
    if (orders || reservations)
      throw new ConflictException('SKU còn đơn hoặc giữ hàng; chưa thể đổi nguồn tồn');
  }

  private async heldByLocal(
    ids: number[],
    linkedAtByVariant = new Map<number, Date | null>(),
    stockReadStartedAt = new Date(),
  ) {
    if (!ids.length) return new Map<number, number>();
    const [marketplaceItems, orderItems, paidItems] = await Promise.all([
      this.prisma.marketplaceInventoryReservation.groupBy({
        by: ['variantId'],
        where: {
          variantId: { in: ids },
          reservation: { status: MarketplaceReservationStatus.Reserved },
        },
        _sum: { quantity: true },
      }),
      this.prisma.orderProduct.findMany({
        where: {
          variantId: { in: ids },
          order: {
            status: {
              in: [
                OrderStatus.Pending,
                OrderStatus.Prepare,
                OrderStatus.Delivering,
                OrderStatus.SoftCancel,
              ],
            },
          },
        },
        select: { orderId: true, variantId: true, quantity: true },
      }),
      linkedAtByVariant.size
        ? this.prisma.orderProduct.findMany({
            where: { variantId: { in: ids }, order: { status: OrderStatus.Paid } },
            select: {
              orderId: true,
              variantId: true,
              quantity: true,
              order: {
                select: {
                  createdAt: true,
                  kiotVietOutboxLogs: {
                    where: { status: KiotVietOutboxStatus.SUCCESS },
                    select: { completedAt: true },
                  },
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);
    const remoteReservedOrders = await this.orderExports.remotelyReservedOrderIds([
      ...new Set([
        ...orderItems.map((item) => item.orderId),
        ...paidItems.map((item) => item.orderId),
      ]),
    ]);
    const held = new Map<number, number>();
    for (const item of marketplaceItems) {
      if (item.variantId === null) continue;
      held.set(item.variantId, (held.get(item.variantId) ?? 0) + (item._sum.quantity ?? 0));
    }
    for (const item of orderItems) {
      if (item.variantId === null || remoteReservedOrders.has(item.orderId)) continue;
      held.set(item.variantId, (held.get(item.variantId) ?? 0) + item.quantity);
    }
    for (const item of paidItems) {
      if (item.variantId === null || remoteReservedOrders.has(item.orderId)) continue;
      const linkedAt = linkedAtByVariant.get(item.variantId);
      if (
        linkedAt &&
        item.order.createdAt >= linkedAt &&
        !item.order.kiotVietOutboxLogs.some(
          (log) => log.completedAt && log.completedAt <= stockReadStartedAt,
        )
      ) {
        held.set(item.variantId, (held.get(item.variantId) ?? 0) + item.quantity);
      }
    }
    return held;
  }

  private isTransientStockReadError(error: unknown): boolean {
    if (!(error instanceof HttpException)) return false;
    const remoteStatus = error.message.match(/\bHTTP (\d{3})\b/)?.[1];
    if (remoteStatus) {
      const status = Number(remoteStatus);
      return status === 429 || status >= 500;
    }
    const status = error.getStatus();
    return status === 429 || status >= 500;
  }

  private stockReadErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim()) return error.message.slice(0, 500);
    return 'Không thể đọc tồn kho từ KiotViet';
  }

  private async getProductByCodeWithRetry(code: string): Promise<Record<string, unknown> | null> {
    for (let attempt = 1; attempt <= STOCK_READ_MAX_ATTEMPTS; attempt += 1) {
      try {
        return await this.client.getProductByCode(code);
      } catch (error) {
        if (attempt === STOCK_READ_MAX_ATTEMPTS || !this.isTransientStockReadError(error))
          throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, STOCK_READ_RETRY_DELAY_MS * 2 ** (attempt - 1)),
        );
      }
    }
    return null;
  }

  private async reportStockSyncProgress(
    callback: ((progress: KiotVietStockSyncProgress) => Promise<void> | void) | undefined,
    progress: KiotVietStockSyncProgress,
  ): Promise<void> {
    if (!callback) return;
    try {
      await callback(progress);
    } catch (error) {
      this.logger.warn(
        `Could not publish KiotViet stock sync progress: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async fetchStocks(
    branchId: number,
    codes: string[],
    onProgress?: (progress: KiotVietStockSyncProgress) => Promise<void> | void,
  ): Promise<StockFetchResult> {
    const stocks = new Map<string, number>();
    const failedItems: StockFetchFailure[] = [];
    const uniqueCodes = [...new Set(codes.map((code) => code.trim()).filter(Boolean))];
    let nextIndex = 0;
    let processed = 0;
    let succeeded = 0;

    // Only linked SKUs are relevant. Scanning /productOnHands would read the retailer's
    // entire catalogue (potentially hundreds of thousands of products) on every sync.
    const worker = async () => {
      while (true) {
        const index = nextIndex;
        nextIndex += 1;
        if (index >= uniqueCodes.length) return;
        const code = uniqueCodes[index];
        try {
          const product = await this.getProductByCodeWithRetry(code);
          if (!product) {
            failedItems.push({ code, reason: 'Không tìm thấy sản phẩm trên KiotViet' });
          } else if (product.code !== code || !Array.isArray(product.inventories)) {
            failedItems.push({ code, reason: 'KiotViet trả dữ liệu sản phẩm không hợp lệ' });
          } else {
            const stock = product.inventories
              .map((value: unknown) => parseKiotVietStock(value, code))
              .find((value) => value?.branchId === branchId);
            if (!stock) {
              failedItems.push({
                code,
                reason: 'Không tìm thấy tồn hợp lệ tại chi nhánh KiotViet',
              });
            } else {
              stocks.set(code, Math.max(0, Math.floor(stock.onHand - stock.reserved)));
              succeeded += 1;
            }
          }
        } catch (error) {
          failedItems.push({ code, reason: this.stockReadErrorMessage(error) });
        }
        processed += 1;
        await this.reportStockSyncProgress(onProgress, {
          phase: 'FETCHING',
          total: uniqueCodes.length,
          processed,
          succeeded,
          failed: failedItems.length,
        });
      }
    };

    await Promise.all(
      Array.from({ length: Math.min(STOCK_READ_CONCURRENCY, uniqueCodes.length) }, () => worker()),
    );
    return { stocks, failedItems };
  }

  async syncLinkedVariantStocks(
    codes?: string[],
    onProgress?: (progress: KiotVietStockSyncProgress) => Promise<void> | void,
  ): Promise<KiotVietStockSyncResult> {
    this.assertEnabled();
    if (!this.cfg.stockSyncEnabled)
      throw new ServiceUnavailableException('Đồng bộ tồn KiotViet chưa được bật');
    const lockKey = 'kiotviet:stock-sync';
    const lockValue = randomUUID();
    const locked = await this.redis.getClient().set(lockKey, lockValue, 'EX', 110, 'NX');
    if (locked !== 'OK') throw new ConflictException('Đồng bộ KiotViet đang chạy');
    const renewTimer = setInterval(() => {
      void this.redis
        .getClient()
        .eval(
          'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("expire", KEYS[1], ARGV[2]) end return 0',
          1,
          lockKey,
          lockValue,
          110,
        )
        .catch(() => undefined);
    }, 30_000);
    renewTimer.unref();
    try {
      const branch = await this.branches.resolve();
      const variants = await this.prisma.variant.findMany({
        where: {
          isDeleted: 0,
          kiotvietProductCode: codes?.length ? { in: codes } : { not: null },
          kiotvietBranchId: branch.id,
          inventoryProvider: InventoryProvider.KIOTVIET,
        },
        select: {
          id: true,
          productId: true,
          stock: true,
          kiotvietProductCode: true,
          kiotvietLinkedAt: true,
        },
      });
      if (!variants.length) {
        if (!codes?.length)
          await this.redis
            .getClient()
            .set('kiotviet:last-successful-stock-sync', new Date().toISOString());
        return {
          total: 0,
          totalLinked: 0,
          succeeded: 0,
          updated: 0,
          unchanged: 0,
          failed: 0,
          skipped: 0,
          failedItems: [],
          skippedItems: [],
          items: [],
        };
      }
      const stockReadStartedAt = new Date();
      const stockFetch = await this.fetchStocks(
        branch.id,
        variants.flatMap((variant) =>
          variant.kiotvietProductCode ? [variant.kiotvietProductCode] : [],
        ),
        onProgress,
      );
      const { stocks } = stockFetch;
      const fetchFailureByCode = new Map(
        stockFetch.failedItems.map((item) => [item.code, item.reason]),
      );
      const skippedItems: Array<{ variantId: number; code: string | null; reason: string }> =
        variants
          .filter((variant) => !stocks.has(variant.kiotvietProductCode ?? ''))
          .map((variant) => ({
            variantId: variant.id,
            code: variant.kiotvietProductCode,
            reason:
              fetchFailureByCode.get(variant.kiotvietProductCode ?? '') ??
              'Không tìm thấy tồn hợp lệ tại chi nhánh KiotViet',
          }));
      const reserved = await this.heldByLocal(
        variants.map((item) => item.id),
        new Map(variants.map((item) => [item.id, item.kiotvietLinkedAt])),
        stockReadStartedAt,
      );
      const heldByCode = new Map<string, number>();
      for (const variant of variants) {
        const code = variant.kiotvietProductCode;
        if (!code) continue;
        heldByCode.set(code, (heldByCode.get(code) ?? 0) + (reserved.get(variant.id) ?? 0));
      }
      const items = variants.flatMap((variant) => {
        const code = variant.kiotvietProductCode ?? '';
        const stock = stocks.get(code);
        const localHeldStock = heldByCode.get(code) ?? 0;
        return stock === undefined
          ? []
          : [
              {
                variantId: variant.id,
                kiotvietProductCode: variant.kiotvietProductCode,
                kiotVietAvailableStock: stock,
                localHeldStock,
                safetyStock: this.cfg.safetyStock ?? 0,
                appliedStock: Math.max(0, stock - localHeldStock - (this.cfg.safetyStock ?? 0)),
              },
            ];
      });
      const refreshedIds = new Set<number>();
      const changedIds = new Set<number>();
      if (items.length) {
        await this.reportStockSyncProgress(onProgress, {
          phase: 'SAVING',
          total: variants.length,
          processed: 0,
          succeeded: 0,
          failed: skippedItems.length,
        });
        const syncedAt = new Date();
        const variantById = new Map(variants.map((variant) => [variant.id, variant]));
        const inventoryRows = await this.prisma.kiotVietInventory.findMany({
          where: {
            productCode: {
              in: [...new Set(items.flatMap((item) => item.kiotvietProductCode ?? []))],
            },
          },
          select: { productCode: true, branchId: true, availableStock: true },
        });
        const inventoryByCode = new Map(inventoryRows.map((row) => [row.productCode, row]));
        await this.prisma.$transaction(async (tx) => {
          const itemCodes = [...new Set(items.flatMap((item) => item.kiotvietProductCode ?? []))];
          for (const code of itemCodes) {
            const inventory = inventoryByCode.get(code);
            const codeItems = items.filter((item) => item.kiotvietProductCode === code);
            if (!inventory || inventory.branchId !== branch.id) {
              codeItems.forEach((item) =>
                skippedItems.push({
                  variantId: item.variantId,
                  code,
                  reason: 'Chưa có kho tồn dùng chung hợp lệ cho SKU KiotViet',
                }),
              );
              continue;
            }
            const sample = codeItems[0];
            const updatedInventory = await tx.kiotVietInventory.updateMany({
              where: {
                productCode: code,
                branchId: branch.id,
                availableStock: inventory.availableStock,
              },
              data: {
                remoteAvailableStock: sample.kiotVietAvailableStock,
                availableStock: sample.appliedStock,
                stockSyncedAt: syncedAt,
              },
            });
            if (!updatedInventory.count) {
              codeItems.forEach((item) =>
                skippedItems.push({
                  variantId: item.variantId,
                  code,
                  reason: 'Tồn dùng chung thay đổi đồng thời; sẽ đọc lại ở lượt sau',
                }),
              );
              continue;
            }
            await tx.variant.updateMany({
              where: {
                isDeleted: 0,
                inventoryProvider: InventoryProvider.KIOTVIET,
                kiotvietProductCode: code,
                kiotvietBranchId: branch.id,
              },
              data: { stock: sample.appliedStock, kiotvietStockSyncedAt: syncedAt },
            });
            codeItems.forEach((item) => {
              refreshedIds.add(item.variantId);
              const previous = variantById.get(item.variantId);
              if (previous && previous.stock !== item.appliedStock) changedIds.add(item.variantId);
            });
          }
          await this.marketplaceCatalog.recordProductChanges(tx, [
            ...new Set(
              variants
                .filter((variant) => changedIds.has(variant.id))
                .map((variant) => variant.productId),
            ),
          ]);
        });
      }
      const failed = variants.length - refreshedIds.size;
      if (!codes?.length && failed === 0)
        await this.redis
          .getClient()
          .set('kiotviet:last-successful-stock-sync', new Date().toISOString());
      return {
        total: variants.length,
        totalLinked: variants.length,
        succeeded: refreshedIds.size,
        updated: changedIds.size,
        unchanged: refreshedIds.size - changedIds.size,
        failed,
        skipped: failed,
        failedItems: skippedItems,
        skippedItems,
        items,
      };
    } finally {
      clearInterval(renewTimer);
      await this.redis
        .getClient()
        .eval(
          'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) end return 0',
          1,
          lockKey,
          lockValue,
        )
        .catch(() => undefined);
    }
  }

  async ensureCheckoutStockFresh(variantIds: number[]): Promise<void> {
    if (!variantIds.length) return;
    const loadVariants = () =>
      this.prisma.variant.findMany({
        where: { id: { in: [...new Set(variantIds)] }, isDeleted: 0 },
        select: {
          id: true,
          inventoryProvider: true,
          kiotvietProductCode: true,
          kiotvietStockSyncedAt: true,
        },
      });
    let variants = await loadVariants();
    try {
      await this.client.assertStockFresh(variants);
      return;
    } catch (error) {
      if (!this.isStaleStockError(error)) throw error;
    }

    const deadline = Date.now() + Math.min(this.cfg.requestTimeoutMs || 5000, 5000);
    let attemptedSync = false;
    while (Date.now() < deadline) {
      const lockBeforeSync = await this.redis.getClient().get('kiotviet:stock-sync');
      if (!lockBeforeSync && !attemptedSync) {
        try {
          const codes = [
            ...new Set(
              variants.flatMap((variant) =>
                variant.inventoryProvider === InventoryProvider.KIOTVIET &&
                variant.kiotvietProductCode
                  ? [variant.kiotvietProductCode]
                  : [],
              ),
            ),
          ];
          if (!codes.length) {
            attemptedSync = true;
            break;
          }
          await this.syncLinkedVariantStocks(codes);
          attemptedSync = true;
        } catch (error) {
          if (!(error instanceof ConflictException)) throw this.stockUnavailableError(error);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 150));
      variants = await loadVariants();
      try {
        await this.client.assertStockFresh(variants);
        return;
      } catch (error) {
        if (!this.isStaleStockError(error)) throw error;
      }
      const lockExists = await this.redis.getClient().get('kiotviet:stock-sync');
      if (!lockExists && attemptedSync) break;
    }
    throw this.stockUnavailableError();
  }

  private isStaleStockError(error: unknown): boolean {
    return error instanceof ServiceUnavailableException && error.message.includes('đã cũ');
  }

  private stockUnavailableError(cause?: unknown): ServiceUnavailableException {
    if (cause)
      this.logger.warn(
        `KiotViet checkout stock refresh failed: ${cause instanceof Error ? cause.message : String(cause)}`,
      );
    return new ServiceUnavailableException({
      code: 'KIOTVIET_STOCK_UNAVAILABLE',
      message: 'Chưa thể xác nhận tồn kho KiotViet, vui lòng thử lại sau ít giây',
      retryable: true,
      retryAfterSeconds: 5,
    });
  }

  async reconcileLinkedVariantStocks(): Promise<void> {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled) return;
    await this.requestStockSyncSafely('POLL');
  }

  async processStockSync(
    event: KiotVietStockSyncJob,
    onProgress?: (progress: KiotVietStockSyncProgress) => Promise<void> | void,
  ): Promise<KiotVietStockSyncResult> {
    await this.reportStockSyncProgress(onProgress, {
      phase: 'STARTING',
      total: event.codes.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
    });
    const result = await this.syncLinkedVariantStocks(
      event.codes.length ? event.codes : undefined,
      onProgress,
    );
    if (
      event.source === 'ORDER_PAID' &&
      event.orderId &&
      result.totalLinked === event.codes.length &&
      result.skipped === 0
    )
      await this.invoices.markStockRefreshed(event.orderId);
    if (result.updated)
      this.logger.log(
        `KiotViet ${event.source.toLowerCase()} stock sync updated ${result.updated}/${result.totalLinked} variants`,
      );
    return result;
  }

  /** Re-read only the affected KiotViet SKUs after Local confirms delivery. */
  async reconcileAfterOrderPaid(orderId: number): Promise<void> {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled) return;
    if (this.invoiceWriteEnabled()) {
      try {
        await this.invoices.enqueuePaidOrder(orderId);
      } catch (error) {
        this.logger.error(
          `KiotViet invoice preparation failed for order #${orderId}; recovery will retry: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }
    const lines = await this.prisma.orderProduct.findMany({
      where: {
        orderId,
        variant: {
          isDeleted: 0,
          inventoryProvider: InventoryProvider.KIOTVIET,
          kiotvietProductCode: { not: null },
        },
      },
      select: { variant: { select: { kiotvietProductCode: true } } },
    });
    const codes = [
      ...new Set(
        lines.flatMap((line) =>
          line.variant?.kiotvietProductCode ? [line.variant.kiotvietProductCode] : [],
        ),
      ),
    ];
    if (!codes.length) return;
    await this.requestStockSync('ORDER_PAID', codes, orderId).catch((error) =>
      this.logger.warn(
        `KiotViet reconciliation after paid order #${orderId} could not be queued: ${error instanceof Error ? error.message : String(error)}`,
      ),
    );
  }

  async webhookStatus() {
    const configurationError = this.webhookConfigurationError();
    if (configurationError) {
      await this.redis.getClient().del('kiotviet:webhook:active');
      return {
        enabled: this.cfg.webhookEnabled,
        configured: false,
        callbackUrl: this.cfg.callbackUrl || null,
        registered: false,
        webhookId: null,
        isActive: null,
        configurationError,
      };
    }
    let currentItem = 0;
    let activeRegistration: Record<string, unknown> | null = null;
    let inactiveRegistration: Record<string, unknown> | null = null;
    let total = 0;
    do {
      const page = await this.client.getWebhooks(100, currentItem);
      total = page.total;
      for (const item of page.data) {
        if (item.type !== 'stock.update' || item.url !== this.cfg.callbackUrl) continue;
        if (item.isActive === true) activeRegistration ??= item;
        else if (item.isActive === false) inactiveRegistration ??= item;
      }
      currentItem += page.data.length;
      if (!page.data.length) break;
    } while (!activeRegistration && currentItem < total);
    const registration = activeRegistration ?? inactiveRegistration;
    const result = {
      enabled: true,
      configured: true,
      callbackUrl: this.cfg.callbackUrl,
      registered: Boolean(activeRegistration),
      webhookId: registration?.id ?? null,
      isActive: typeof registration?.isActive === 'boolean' ? registration.isActive : null,
    };
    if (result.registered)
      await this.redis.getClient().set('kiotviet:webhook:active', '1', 'EX', 3600);
    else await this.redis.getClient().del('kiotviet:webhook:active');
    return result;
  }

  async registerStockWebhook() {
    const configurationError = this.webhookConfigurationError();
    if (configurationError) throw new ServiceUnavailableException(configurationError);
    const status = await this.webhookStatus();
    if (status.registered) return status;
    let callbackStatus: number;
    try {
      const probe = await axios.post(
        this.cfg.callbackUrl,
        {},
        {
          headers: { 'X-Hub-Signature': 'invalid-probe' },
          timeout: Math.min(this.cfg.requestTimeoutMs, 5000),
          validateStatus: () => true,
        },
      );
      callbackStatus = probe.status;
    } catch {
      throw new ServiceUnavailableException('Callback KiotViet chưa truy cập được từ API');
    }
    if (callbackStatus !== 401)
      throw new ServiceUnavailableException(
        `Callback KiotViet chưa sẵn sàng (HTTP ${callbackStatus}); cần trả 401 cho chữ ký sai`,
      );
    if (status.isActive === false && status.webhookId !== null) {
      const inactiveWebhookId = Number(status.webhookId);
      if (Number.isSafeInteger(inactiveWebhookId) && inactiveWebhookId > 0)
        await this.client.deleteWebhook(inactiveWebhookId);
    }
    await this.client.createStockWebhook(this.cfg.callbackUrl, this.cfg.webhookRawSecret);
    const registeredStatus = await this.webhookStatus();
    if (!registeredStatus.registered)
      throw new ServiceUnavailableException(
        'KiotViet đã tạo webhook nhưng webhook không hoạt động; kiểm tra callback và chữ ký',
      );
    return registeredStatus;
  }

  private webhookConfigurationError(): string | null {
    if (!this.cfg.webhookEnabled) return 'Webhook KiotViet chưa được bật';
    if (!this.cfg.enabled) return 'Kết nối KiotViet chưa được bật';
    if (!this.cfg.stockSyncEnabled) return 'Đồng bộ tồn KiotViet chưa được bật';
    if (!this.cfg.callbackUrl) return 'Chưa cấu hình callback URL cho webhook KiotViet';
    if (!this.cfg.webhookRawSecret || this.cfg.webhookRawSecret.length < 8)
      return 'Webhook secret KiotViet phải có ít nhất 8 ký tự';
    try {
      const callbackUrl = new URL(this.cfg.callbackUrl);
      if (callbackUrl.protocol !== 'https:') return 'Callback webhook KiotViet phải sử dụng HTTPS';
    } catch {
      return 'Callback URL webhook KiotViet không hợp lệ';
    }
    return null;
  }

  async handleStockWebhook(
    signature: string | undefined,
    rawBody: Buffer | undefined,
  ): Promise<{ received: true }> {
    if (!this.cfg.stockSyncEnabled || !this.cfg.webhookEnabled || !this.cfg.webhookRawSecret)
      throw new ServiceUnavailableException('Webhook KiotViet chưa được bật');
    if (!signature || !rawBody) {
      this.logger.warn({
        event: 'kiotviet.webhook.rejected',
        reason: 'missing-signature-or-raw-body',
        hasSignature: Boolean(signature),
        hasRawBody: Boolean(rawBody),
      });
      throw new UnauthorizedException('Thiếu chữ ký webhook KiotViet');
    }
    const suppliedRaw = signature.replace(/^sha256=/i, '').trim();
    const supplied = /^[0-9a-f]{64}$/i.test(suppliedRaw) ? suppliedRaw.toLowerCase() : suppliedRaw;
    const registeredSecret = encodeKiotVietWebhookSecret(this.cfg.webhookRawSecret);
    const digest = createHmac('sha256', registeredSecret).update(rawBody).digest();
    const valid = [digest.toString('hex'), digest.toString('base64')].some((expected) => {
      const a = Buffer.from(expected);
      const b = Buffer.from(supplied);
      return a.length === b.length && timingSafeEqual(a, b);
    });
    if (!valid) {
      this.logger.warn({
        event: 'kiotviet.webhook.rejected',
        reason: 'signature-mismatch',
        signatureEncoding: /^[0-9a-f]{64}$/i.test(suppliedRaw) ? 'hex' : 'other',
        bodyBytes: rawBody.length,
      });
      throw new UnauthorizedException('Chữ ký webhook KiotViet không hợp lệ');
    }
    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(rawBody.toString('utf8')) as Record<string, unknown>;
    } catch {
      throw new BadRequestException('Payload webhook KiotViet không hợp lệ');
    }
    if (!Array.isArray(payload.Notifications))
      throw new BadRequestException('Webhook KiotViet thiếu Notifications');
    const branches = new Set<number>();
    const codes = new Set<string>();
    for (const notification of payload.Notifications) {
      if (!notification || typeof notification !== 'object') continue;
      const data = (notification as Record<string, unknown>).Data;
      if (!Array.isArray(data)) continue;
      for (const value of data) {
        if (!value || typeof value !== 'object') continue;
        const row = value as Record<string, unknown>;
        const branchId = Number(row.BranchId ?? row.branchId);
        if (Number.isInteger(branchId) && branchId > 0) branches.add(branchId);
        const code = row.ProductCode ?? row.productCode;
        if (typeof code === 'string' && code.trim()) codes.add(code.trim());
      }
    }
    const id =
      typeof payload.Id === 'string' && payload.Id
        ? payload.Id
        : createHash('sha256').update(rawBody).digest('hex');
    const jobId = `stock-${createHash('sha256').update(`${this.cfg.retailer}:${id}`).digest('hex')}`;
    try {
      await this.webhookQueue.add(
        KIOTVIET_STOCK_EVENT_JOB,
        { eventId: id, branches: [...branches], codes: [...codes] },
        {
          jobId,
          attempts: 8,
          backoff: { type: 'exponential', delay: 2000 },
          removeOnComplete: { age: 86400, count: 10000 },
        },
      );
    } catch {
      throw new ServiceUnavailableException('Không thể lưu webhook KiotViet để xử lý');
    }
    await Promise.all([
      this.redis.getClient().set('kiotviet:webhook:last-received-at', new Date().toISOString()),
      this.redis.getClient().set('kiotviet:webhook:active', '1', 'EX', 3600),
    ]).catch(() => undefined);
    return { received: true };
  }

  async processStockWebhook(event: KiotVietStockEventJob): Promise<void> {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled) return;
    const branch = await this.branches.resolve();
    if (event.branches.length && !event.branches.includes(branch.id)) return;
    if (event.codes.length) await this.syncLinkedVariantStocks(event.codes);
    else await this.syncLinkedVariantStocks();
    await this.redis
      .getClient()
      .set('kiotviet:webhook:last-processed-at', new Date().toISOString());
  }
}
