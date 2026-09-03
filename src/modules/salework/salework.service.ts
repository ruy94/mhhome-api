import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { randomUUID } from 'node:crypto';

import { SaleworkClientService } from '../integrations/salework/salework-client.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type {
  SaleworkAddressData,
  SaleworkInventoryTransactionsData,
  SaleworkLogisticsData,
  SaleworkMutationResult,
  SaleworkProductReportData,
  SaleworkProductsData,
} from '../integrations/salework/salework.types.js';
import type {
  CreateSaleworkInStoreOrderDto,
  CreateSaleworkSelfLogisticsOrderDto,
  CreateSaleworkThirdLogisticsOrderDto,
} from './dto/create-salework-order.dto.js';
import type { CreateSaleworkDebtDto, GenerateSaleworkQrDto } from './dto/salework-debt.dto.js';
import type { SaleworkInventoryTransactionDto } from './dto/salework-inventory-transaction.dto.js';
import type { SaleworkProductReportDto } from './dto/salework-report.dto.js';
import type { SaleworkWarehouseTransactionDto } from './dto/salework-warehouse.dto.js';
import { MarketplaceCatalogService } from '../marketplace/marketplace-catalog.service.js';
import { MarketplaceReservationStatus } from '../../generated/prisma/enums.js';
import { RedisService } from '../../common/redis/redis.service.js';
import { AdminNotificationService } from '../admin-notification/admin-notification.service.js';

const STOCK_RECONCILIATION_JOB = 'salework-stock-reconciliation';

@Injectable()
export class SaleworkService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(SaleworkService.name);
  private reconciliationJob: CronJob | null = null;

  constructor(
    private readonly saleworkClient: SaleworkClientService,
    private readonly prisma: PrismaService,
    private readonly marketplaceCatalog: MarketplaceCatalogService,
    private readonly configService: ConfigService,
    private readonly redis: RedisService,
    private readonly adminNotifications: AdminNotificationService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  onModuleInit(): void {
    if (
      this.configService.get<boolean>('salework.enabled') !== true ||
      this.configService.get<boolean>('salework.stockReconciliationEnabled') !== true
    ) {
      return;
    }

    const cronTime =
      this.configService.get<string>('salework.stockReconciliationCron') ??
      '0 */2 * * * *';
    try {
      this.reconciliationJob = CronJob.from({
        cronTime,
        onTick: () => void this.reconcileLinkedVariantStocks(),
        start: true,
      });
      this.schedulerRegistry.addCronJob(STOCK_RECONCILIATION_JOB, this.reconciliationJob);
      this.logger.log(`SaleWork stock reconciliation scheduled: ${cronTime}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Invalid SALEWORK_STOCK_RECONCILIATION_CRON: ${message}`);
    }
  }

  onModuleDestroy(): void {
    this.reconciliationJob?.stop();
    this.reconciliationJob = null;
  }

  getProducts(): Promise<SaleworkProductsData> {
    return this.saleworkClient.getProducts();
  }

  /** Pulls authoritative SaleWork stock for variants linked to SaleWork warehouses. */
  async syncLinkedVariantStocks() {
    const salework = await this.saleworkClient.getProducts();
    const variants = await this.prisma.variant.findMany({
      where: {
        isDeleted: 0,
        saleworkProductCode: { not: null },
        saleworkWarehouseId: { not: null },
      },
      select: {
        id: true,
        productId: true,
        stock: true,
        saleworkProductCode: true,
        saleworkWarehouseId: true,
      },
    });

    const items: Array<{
      variantId: number;
      saleworkProductCode: string;
      saleworkWarehouseId: string;
      saleworkStock: number;
      appliedStock: number;
    }> = [];
    const activeReservations = await this.prisma.marketplaceInventoryReservation.groupBy({
      by: ['variantId'],
      where: {
        variantId: { in: variants.map((variant) => variant.id) },
        reservation: { status: MarketplaceReservationStatus.Reserved },
      },
      _sum: { quantity: true },
    });
    const reservedByVariant = new Map(
      activeReservations.map((item) => [item.variantId, item._sum.quantity ?? 0]),
    );
    const skippedItems: Array<{
      variantId: number;
      saleworkProductCode: string;
      saleworkWarehouseId: string;
      reason: string;
    }> = [];

    for (const variant of variants) {
      const saleworkProductCode = variant.saleworkProductCode?.trim();
      const saleworkWarehouseId = variant.saleworkWarehouseId?.trim();
      if (!saleworkProductCode || !saleworkWarehouseId) continue;

      const product = salework.products[saleworkProductCode];
      const saleworkStock = product?.stocks?.find((stock) => stock.wid === saleworkWarehouseId)?.value;
      if (saleworkStock === undefined) {
        skippedItems.push({
          variantId: variant.id,
          saleworkProductCode,
          saleworkWarehouseId,
          reason: 'Không tìm thấy SKU hoặc kho SaleWork',
        });
        continue;
      }

      const appliedStock = saleworkStock - (reservedByVariant.get(variant.id) ?? 0);
      items.push({
        variantId: variant.id,
        saleworkProductCode,
        saleworkWarehouseId,
        saleworkStock,
        appliedStock,
      });
    }

    const currentStockByVariant = new Map(variants.map((variant) => [variant.id, variant.stock]));
    const changedItems = items.filter(
      (item) => currentStockByVariant.get(item.variantId) !== item.appliedStock,
    );

    await this.prisma.$transaction(async (tx) => {
      for (const item of changedItems) {
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: item.appliedStock },
        });
      }
      const updatedIds = new Set(changedItems.map((item) => item.variantId));
      await this.marketplaceCatalog.recordProductChanges(
        tx,
        variants
          .filter((variant) => updatedIds.has(variant.id))
          .map((variant) => variant.productId),
      );
    });

    if (changedItems.length) {
      await this.adminNotifications.publishRealtimeToActiveAdmins('salework.stock.reconciled', {
        updatedVariantIds: changedItems.map((item) => item.variantId),
        updatedCount: changedItems.length,
        occurredAt: new Date().toISOString(),
      });
    }

    return {
      totalLinked: variants.length,
      updated: changedItems.length,
      skipped: skippedItems.length,
      items,
      skippedItems,
    };
  }

  async reconcileLinkedVariantStocks(): Promise<void> {
    const enabled = this.configService.get<boolean>('salework.enabled') === true;
    const reconciliationEnabled =
      this.configService.get<boolean>('salework.stockReconciliationEnabled') === true;
    if (!enabled || !reconciliationEnabled) return;

    const lockKey = 'salework:stock-reconciliation';
    const lockValue = randomUUID();
    const ttlSeconds =
      this.configService.get<number>('salework.stockReconciliationLockTtlSeconds') ?? 110;
    const locked = await this.redis.getClient().set(lockKey, lockValue, 'EX', ttlSeconds, 'NX');
    if (locked !== 'OK') return;

    try {
      const result = await this.syncLinkedVariantStocks();
      this.logger.log(
        `SaleWork stock reconciliation updated ${result.updated}/${result.totalLinked} linked variants`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`SaleWork stock reconciliation failed: ${message}`);
    } finally {
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

  getAddressList(): Promise<SaleworkAddressData> {
    return this.saleworkClient.getAddressList();
  }

  getLogistics(): Promise<SaleworkLogisticsData> {
    return this.saleworkClient.getLogistics();
  }

  createThirdLogisticsOrder(dto: CreateSaleworkThirdLogisticsOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  createSelfLogisticsOrder(dto: CreateSaleworkSelfLogisticsOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  createInStoreOrder(dto: CreateSaleworkInStoreOrderDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.createOrder(dto);
  }

  warehouseImport(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseImport(dto);
  }

  warehouseExport(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseExport(dto);
  }

  warehouseReturn(dto: SaleworkWarehouseTransactionDto): Promise<SaleworkMutationResult> {
    return this.saleworkClient.warehouseReturn(dto);
  }

  getProductReport(dto: SaleworkProductReportDto): Promise<SaleworkProductReportData> {
    return this.saleworkClient.getProductReport(dto);
  }

  getInventoryTransactions(dto: SaleworkInventoryTransactionDto): Promise<SaleworkInventoryTransactionsData> {
    return this.saleworkClient.getInventoryTransactions(dto);
  }

  getMerchants() {
    return this.saleworkClient.getMerchants();
  }

  createDebt(dto: CreateSaleworkDebtDto) {
    return this.saleworkClient.createDebt(dto);
  }

  generateQr(dto: GenerateSaleworkQrDto) {
    return this.saleworkClient.generateQr(dto);
  }
}
