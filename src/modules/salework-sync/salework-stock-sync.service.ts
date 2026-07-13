import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service.js';
import { OrderStatus, Prisma, SaleWorkOutboxOperation, SaleWorkOutboxStatus } from '../../generated/prisma/client.js';
import { SaleworkClientService } from '../integrations/salework/salework-client.service.js';

type OrderItemSnapshot = {
  variantId: number | null;
  quantity: number;
  variant?: {
    saleworkProductCode?: string | null;
    saleworkWarehouseId?: string | null;
  } | null;
};

@Injectable()
export class SaleWorkStockSyncService {
  private readonly logger = new Logger(SaleWorkStockSyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly saleworkClient: SaleworkClientService,
  ) {}

  isEnabled() {
    return this.configService.get<boolean>('salework.enabled') === true;
  }

  async exportOrderStock(orderId: number) {
    if (!this.isEnabled()) return;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          select: {
            variantId: true,
            quantity: true,
            variant: { select: { saleworkProductCode: true, saleworkWarehouseId: true } },
          },
        },
      },
    });

    if (!order) return;
    await this.syncOperation(order.id, SaleWorkOutboxOperation.Export, order.orderProducts);
  }

  async returnOrderStockIfFinalCancelled(orderId: number, previousStatus: OrderStatus, nextStatus: OrderStatus) {
    const finalCancelledStatuses: OrderStatus[] = [OrderStatus.Cancel, OrderStatus.Refund, OrderStatus.Return];
    if (!finalCancelledStatuses.includes(nextStatus)) return;
    if (finalCancelledStatuses.includes(previousStatus)) return;
    if (!this.isEnabled()) return;

    const exportLogs = await this.prisma.saleWorkOutboxLog.findMany({
      where: { orderId, operation: SaleWorkOutboxOperation.Export },
    });

    if (exportLogs.length) {
      await this.syncOperation(
        orderId,
        SaleWorkOutboxOperation.Return,
        exportLogs.map((log) => ({
          variantId: log.variantId,
          quantity: log.quantity,
          variant: {
            saleworkProductCode: log.productCode,
            saleworkWarehouseId: log.warehouseId,
          },
        })),
      );
      return;
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          select: {
            variantId: true,
            quantity: true,
            variant: { select: { saleworkProductCode: true, saleworkWarehouseId: true } },
          },
        },
      },
    });

    if (!order) return;
    await this.syncOperation(orderId, SaleWorkOutboxOperation.Return, order.orderProducts);
  }

  private async syncOperation(orderId: number, operation: SaleWorkOutboxOperation, items: OrderItemSnapshot[]) {
    const grouped = new Map<string, Map<string, { variantId: number; quantity: number }>>();

    for (const item of items) {
      const variantId = item.variantId;
      const productCode = item.variant?.saleworkProductCode?.trim();
      const warehouseId = item.variant?.saleworkWarehouseId?.trim();
      if (!variantId || !productCode || !warehouseId || item.quantity <= 0) continue;

      const products = grouped.get(warehouseId) ?? new Map<string, { variantId: number; quantity: number }>();
      const current = products.get(productCode);
      products.set(productCode, {
        variantId,
        quantity: (current?.quantity ?? 0) + item.quantity,
      });
      grouped.set(warehouseId, products);
    }

    for (const [warehouseId, products] of grouped.entries()) {
      const payload = {
        common_info: {
          warehouse_id: warehouseId,
          note: `Zalo order #${orderId} ${operation}`,
        },
        products_info: [...products.entries()].map(([code, product]) => ({
          code,
          quantity: product.quantity,
        })),
      };

      const logs = await Promise.all(
        [...products.entries()].map(([productCode, product]) =>
          this.prisma.saleWorkOutboxLog.upsert({
            where: { orderId_variantId_operation: { orderId, variantId: product.variantId, operation } },
            create: {
              orderId,
              variantId: product.variantId,
              operation,
              warehouseId,
              productCode,
              quantity: product.quantity,
              status: SaleWorkOutboxStatus.Pending,
              requestPayload: payload as Prisma.InputJsonValue,
              errorMessage: null,
            },
            update: {
              warehouseId,
              productCode,
              quantity: product.quantity,
              status: SaleWorkOutboxStatus.Pending,
              requestPayload: payload as Prisma.InputJsonValue,
              responsePayload: Prisma.DbNull,
              errorMessage: null,
            },
          }),
        ),
      );

      try {
        const response = operation === SaleWorkOutboxOperation.Export
          ? await this.saleworkClient.warehouseExport(payload)
          : await this.saleworkClient.warehouseReturn(payload);

        await this.prisma.saleWorkOutboxLog.updateMany({
          where: { id: { in: logs.map((log) => log.id) } },
          data: {
            status: SaleWorkOutboxStatus.Success,
            responsePayload: response as Prisma.InputJsonValue,
            errorMessage: null,
          },
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'SaleWork sync failed';
        await this.prisma.saleWorkOutboxLog.updateMany({
          where: { id: { in: logs.map((log) => log.id) } },
          data: { status: SaleWorkOutboxStatus.Failed, errorMessage: message },
        });
        this.logger.error(`SaleWork ${operation} failed for order ${orderId}`, message);
      }
    }
  }
}
