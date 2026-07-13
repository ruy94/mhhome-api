import { Injectable } from '@nestjs/common';

import { OrderStatus, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class OrderInventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async restoreIfFinalCancelled(
    orderId: number,
    previousStatus: OrderStatus,
    nextStatus: OrderStatus,
    tx?: Prisma.TransactionClient,
  ) {
    const finalCancelledStatuses: OrderStatus[] = [OrderStatus.Cancel, OrderStatus.Refund, OrderStatus.Return];
    if (!finalCancelledStatuses.includes(nextStatus)) return;
    if (finalCancelledStatuses.includes(previousStatus)) return;

    if (tx) {
      await this.restoreOrderItems(tx, orderId);
      return;
    }

    await this.prisma.$transaction((transaction) => this.restoreOrderItems(transaction, orderId));
  }

  private async restoreOrderItems(tx: Prisma.TransactionClient, orderId: number) {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          select: {
            variantId: true,
            quantity: true,
            flashSaleId: true,
          },
        },
      },
    });

    if (!order) return;

    for (const item of order.orderProducts) {
      if (!item.variantId) continue;

      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { increment: item.quantity } },
      });

      if (!item.flashSaleId) continue;

      const flashSaleItem = await tx.flashSaleItem.findUnique({
        where: {
          flashSaleId_variantId: {
            flashSaleId: item.flashSaleId,
            variantId: item.variantId,
          },
        },
        select: { sold: true },
      });

      if (!flashSaleItem) continue;

      await tx.flashSaleItem.update({
        where: {
          flashSaleId_variantId: {
            flashSaleId: item.flashSaleId,
            variantId: item.variantId,
          },
        },
        data: { sold: Math.max(0, flashSaleItem.sold - item.quantity) },
      });
    }
  }
}
