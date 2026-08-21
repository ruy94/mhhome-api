const AdminNotificationDeliveryMode = {
  Inbox: 'Inbox',
  Toast: 'Toast',
  InboxAndToast: 'InboxAndToast',
} as const;
const AdminNotificationSeverity = {
  Info: 'Info',
  Success: 'Success',
  Warning: 'Warning',
  Error: 'Error',
} as const;

jest.mock('../../generated/prisma/client.js', () => ({
  AdminNotificationDeliveryMode,
  AdminNotificationSeverity,
  PrismaClient: class {},
}));

import { AdminNotificationService } from './admin-notification.service.js';

describe('AdminNotificationService', () => {
  const notification = {
    id: 'notification-1',
    type: 'order.created',
    title: 'Bạn có đơn hàng mới #ORD1',
    content: 'Đơn hàng có giá trị 100.000 đ',
    link: '/orders/1',
    severity: AdminNotificationSeverity.Success,
    deliveryMode: AdminNotificationDeliveryMode.InboxAndToast,
    metadata: null,
    dedupeKey: 'order:created:1',
    createdAt: new Date('2026-08-19T10:00:00.000Z'),
  };

  function createService() {
    const prisma = {
      $transaction: jest.fn(async (operations: Promise<unknown>[]) => Promise.all(operations)),
      admin: { findMany: jest.fn().mockResolvedValue([{ id: 'admin-1' }]) },
      adminNotification: {
        findUnique: jest.fn().mockResolvedValue(null),
        findUniqueOrThrow: jest.fn(),
        create: jest.fn().mockResolvedValue(notification),
      },
      adminNotificationRecipient: {
        findMany: jest.fn().mockResolvedValue([]),
        count: jest.fn().mockResolvedValue(0),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn(),
      },
    };
    const realtime = { publish: jest.fn().mockResolvedValue(undefined) };
    const service = new AdminNotificationService(prisma as never, realtime as never);
    return { service, prisma, realtime };
  }

  it('returns no more than 15 inbox notifications and the full unread count', async () => {
    const { service, prisma } = createService();
    prisma.adminNotificationRecipient.findMany.mockResolvedValue([
      {
        notificationId: notification.id,
        adminId: 'admin-1',
        readAt: null,
        createdAt: notification.createdAt,
        notification,
      },
    ]);
    prisma.adminNotificationRecipient.count.mockResolvedValue(4);

    await expect(service.findLatest('admin-1', 99)).resolves.toEqual({
      items: [
        expect.objectContaining({
          id: notification.id,
          readAt: null,
        }),
      ],
      unreadCount: 4,
    });
    expect(prisma.adminNotificationRecipient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 15 }),
    );
  });

  it('persists one order notification for every active admin and publishes it', async () => {
    const { service, prisma, realtime } = createService();
    prisma.admin.findMany.mockResolvedValue([{ id: 'admin-1' }, { id: 'admin-2' }]);

    await expect(
      service.notifyOrderCreated({
        id: 1,
        code: 'ORD1',
        totalAmount: 100_000,
        platform: 'ZaloMiniApp',
      }),
    ).resolves.toBeUndefined();

    expect(prisma.adminNotification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dedupeKey: 'order:created:1',
          link: '/orders/1',
          recipients: {
            create: [{ adminId: 'admin-1' }, { adminId: 'admin-2' }],
          },
        }),
      }),
    );
    expect(realtime.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        adminIds: ['admin-1', 'admin-2'],
        event: 'notification.created',
      }),
    );
  });

  it('does not publish a duplicate notification', async () => {
    const { service, prisma, realtime } = createService();
    prisma.adminNotification.findUnique.mockResolvedValue(notification);

    await service.notifyOrderCreated({
      id: 1,
      code: 'ORD1',
      totalAmount: 100_000,
      platform: 'ZaloMiniApp',
    });

    expect(prisma.adminNotification.create).not.toHaveBeenCalled();
    expect(realtime.publish).not.toHaveBeenCalled();
  });

  it('does not reject order flow when notification persistence keeps failing', async () => {
    const { service, prisma } = createService();
    prisma.adminNotification.findUnique.mockRejectedValue(new Error('database unavailable'));
    const retryableService = service as unknown as {
      delay: (ms: number) => Promise<void>;
    };
    jest.spyOn(retryableService, 'delay').mockResolvedValue();

    await expect(
      service.notifyOrderCreated({
        id: 1,
        code: 'ORD1',
        totalAmount: 100_000,
        platform: 'ZaloMiniApp',
      }),
    ).resolves.toBeUndefined();
    expect(prisma.adminNotification.findUnique).toHaveBeenCalledTimes(3);
  });
});
