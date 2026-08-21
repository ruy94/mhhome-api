import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import type {
  AdminNotification,
  AdminNotificationRecipient,
} from '../../generated/prisma/client.js';
import {
  AdminNotificationDeliveryMode,
  AdminNotificationSeverity,
} from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdminNotificationRealtimeService } from './admin-notification-realtime.service.js';
import type { CreateAdminNotificationInput } from './admin-notification.types.js';

const INBOX_MODES = [
  AdminNotificationDeliveryMode.Inbox,
  AdminNotificationDeliveryMode.InboxAndToast,
];
const MAX_ITEMS = 15;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 250;

type RecipientWithNotification = AdminNotificationRecipient & {
  notification: AdminNotification;
};

@Injectable()
export class AdminNotificationService {
  private readonly logger = new Logger(AdminNotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: AdminNotificationRealtimeService,
  ) {}

  async findLatest(adminId: string, requestedLimit = MAX_ITEMS) {
    const limit = Math.min(Math.max(requestedLimit, 1), MAX_ITEMS);
    const [recipients, unreadCount] = await this.prisma.$transaction([
      this.prisma.adminNotificationRecipient.findMany({
        where: {
          adminId,
          notification: { deliveryMode: { in: INBOX_MODES } },
        },
        include: { notification: true },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
      this.prisma.adminNotificationRecipient.count({
        where: {
          adminId,
          readAt: null,
          notification: { deliveryMode: { in: INBOX_MODES } },
        },
      }),
    ]);

    return {
      items: recipients.map((recipient) => this.toDto(recipient)),
      unreadCount,
    };
  }

  async markAsRead(adminId: string, notificationId: string) {
    const readAt = new Date();
    const updated = await this.prisma.adminNotificationRecipient.updateMany({
      where: {
        adminId,
        notificationId,
        readAt: null,
        notification: { deliveryMode: { in: INBOX_MODES } },
      },
      data: { readAt },
    });

    if (!updated.count) {
      const recipient = await this.prisma.adminNotificationRecipient.findUnique({
        where: { notificationId_adminId: { notificationId, adminId } },
      });
      if (!recipient) throw new NotFoundException('Notification not found');
      return { notificationId, readAt: recipient.readAt };
    }

    const payload = { notificationId, readAt: readAt.toISOString() };
    await this.publishSafely({
      adminIds: [adminId],
      event: 'notification.read',
      data: payload,
    });
    return payload;
  }

  async markAllAsRead(adminId: string) {
    const readAt = new Date();
    await this.prisma.adminNotificationRecipient.updateMany({
      where: {
        adminId,
        readAt: null,
        notification: { deliveryMode: { in: INBOX_MODES } },
      },
      data: { readAt },
    });

    const payload = { readAt: readAt.toISOString() };
    await this.publishSafely({
      adminIds: [adminId],
      event: 'notification.read-all',
      data: payload,
    });
    return payload;
  }

  async notifyOrderCreated(order: {
    id: number;
    code: string;
    totalAmount: unknown;
    platform: string;
  }): Promise<void> {
    const isMarketplace = order.platform === 'Marketplace';
    await this.create({
      type: isMarketplace ? 'marketplace-order.created' : 'order.created',
      title: isMarketplace
        ? `Bạn có đơn mua chéo mới #${order.code}`
        : `Bạn có đơn hàng mới #${order.code}`,
      content: `Đơn hàng có giá trị ${this.formatCurrency(Number(order.totalAmount))}`,
      link: isMarketplace ? `/marketplace-orders/${order.id}` : `/orders/${order.id}`,
      severity: AdminNotificationSeverity.Success,
      deliveryMode: AdminNotificationDeliveryMode.InboxAndToast,
      metadata: {
        orderId: order.id,
        orderCode: order.code,
        platform: order.platform,
        totalAmount: Number(order.totalAmount),
      },
      dedupeKey: `${isMarketplace ? 'marketplace-order' : 'order'}:created:${order.id}`,
    });
  }

  async create(input: CreateAdminNotificationInput): Promise<void> {
    let persisted:
      | {
          notification: AdminNotification;
          adminIds: string[];
          created: boolean;
        }
      | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        persisted ??= await this.persist(input);
        if (!persisted.created) return;
        await this.realtime.publish({
          adminIds: persisted.adminIds,
          event: 'notification.created',
          data: this.toNotificationDto(persisted.notification, null),
        });
        return;
      } catch (error) {
        if (attempt === MAX_RETRIES) {
          this.logger.error(
            `Unable to create admin notification ${input.type}: ${(error as Error).message}`,
          );
          return;
        }
        await this.delay(RETRY_DELAY_MS * 2 ** attempt);
      }
    }
  }

  private async persist(input: CreateAdminNotificationInput) {
    if (input.dedupeKey) {
      const existing = await this.prisma.adminNotification.findUnique({
        where: { dedupeKey: input.dedupeKey },
      });
      if (existing) return { notification: existing, adminIds: [], created: false };
    }

    const admins = await this.prisma.admin.findMany({
      where: { isActive: true },
      select: { id: true },
    });
    if (!admins.length) {
      throw new Error('No active admin recipients');
    }

    try {
      const notification = await this.prisma.adminNotification.create({
        data: {
          type: input.type,
          title: input.title,
          content: input.content,
          link: input.link,
          severity: input.severity,
          deliveryMode: input.deliveryMode,
          metadata: input.metadata,
          dedupeKey: input.dedupeKey,
          recipients: {
            create: admins.map((admin) => ({ adminId: admin.id })),
          },
        },
      });
      return {
        notification,
        adminIds: admins.map((admin) => admin.id),
        created: true,
      };
    } catch (error) {
      if (input.dedupeKey && this.isUniqueConstraintError(error)) {
        const existing = await this.prisma.adminNotification.findUniqueOrThrow({
          where: { dedupeKey: input.dedupeKey },
        });
        return { notification: existing, adminIds: [], created: false };
      }
      throw error;
    }
  }

  private async publishSafely(
    envelope: Parameters<AdminNotificationRealtimeService['publish']>[0],
  ): Promise<void> {
    try {
      await this.realtime.publish(envelope);
    } catch (error) {
      this.logger.warn(`Unable to publish notification state: ${(error as Error).message}`);
    }
  }

  private toDto(recipient: RecipientWithNotification) {
    return this.toNotificationDto(recipient.notification, recipient.readAt);
  }

  private toNotificationDto(notification: AdminNotification, readAt: Date | null) {
    return {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      content: notification.content,
      link: notification.link,
      severity: notification.severity,
      deliveryMode: notification.deliveryMode,
      metadata: notification.metadata,
      readAt,
      createdAt: notification.createdAt,
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'P2002'
    );
  }

  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
