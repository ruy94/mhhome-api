import { Module } from '@nestjs/common';

import { AdminNotificationController } from './admin-notification.controller.js';
import { AdminNotificationRealtimeService } from './admin-notification-realtime.service.js';
import { AdminNotificationService } from './admin-notification.service.js';

@Module({
  controllers: [AdminNotificationController],
  providers: [AdminNotificationRealtimeService, AdminNotificationService],
  exports: [AdminNotificationService, AdminNotificationRealtimeService],
})
export class AdminNotificationModule {}
