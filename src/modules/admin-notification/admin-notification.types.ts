import type {
  AdminNotificationDeliveryMode,
  AdminNotificationSeverity,
  Prisma,
} from '../../generated/prisma/client.js';

export interface CreateAdminNotificationInput {
  type: string;
  title: string;
  content: string;
  link?: string;
  severity?: AdminNotificationSeverity;
  deliveryMode?: AdminNotificationDeliveryMode;
  metadata?: Prisma.InputJsonValue;
  dedupeKey?: string;
}

export interface AdminNotificationEventEnvelope {
  adminIds: string[];
  event:
    | 'notification.created'
    | 'notification.read'
    | 'notification.read-all'
    | 'salework.stock.reconciled'
    | 'shipping.spx.updated'
    | 'shipping.vtp.updated';
  data: string | object;
}
