import {
  Controller,
  DefaultValuePipe,
  Get,
  Header,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  Req,
  Sse,
  type MessageEvent,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

import { CurrentAdmin } from '../../common/decorators/current-admin.decorator.js';
import { SkipTransform } from '../../common/decorators/skip-transform.decorator.js';
import { AdminNotificationRealtimeService } from './admin-notification-realtime.service.js';
import { AdminNotificationService } from './admin-notification.service.js';

@Controller('admin-notifications')
export class AdminNotificationController {
  constructor(
    private readonly notifications: AdminNotificationService,
    private readonly realtime: AdminNotificationRealtimeService,
  ) {}

  @Get()
  findLatest(
    @CurrentAdmin('id') adminId: string,
    @Query('limit', new DefaultValuePipe(15), ParseIntPipe) limit: number,
  ) {
    return this.notifications.findLatest(adminId, limit);
  }

  @Patch('read-all')
  markAllAsRead(@CurrentAdmin('id') adminId: string) {
    return this.notifications.markAllAsRead(adminId);
  }

  @Patch(':id/read')
  markAsRead(@CurrentAdmin('id') adminId: string, @Param('id') id: string) {
    return this.notifications.markAsRead(adminId, id);
  }

  @Sse('stream')
  @SkipTransform()
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('X-Accel-Buffering', 'no')
  stream(
    @CurrentAdmin('id') adminId: string,
    @Req() request: Request,
  ): Observable<MessageEvent> {
    return this.realtime.connect(adminId, request);
  }
}
