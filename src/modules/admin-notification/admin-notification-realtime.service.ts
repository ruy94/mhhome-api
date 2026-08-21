import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  type MessageEvent,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Redis } from 'ioredis';
import { randomUUID } from 'node:crypto';
import { Observable, type Subscriber } from 'rxjs';

import { RedisService } from '../../common/redis/redis.service.js';
import type { AdminNotificationEventEnvelope } from './admin-notification.types.js';

const NOTIFICATION_CHANNEL = 'admin:notifications';
const HEARTBEAT_INTERVAL_MS = 25_000;

interface StreamConnection {
  subscriber: Subscriber<MessageEvent>;
  heartbeat: NodeJS.Timeout;
  cleanup: () => void;
}

@Injectable()
export class AdminNotificationRealtimeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AdminNotificationRealtimeService.name);
  private readonly connections = new Map<string, Map<string, StreamConnection>>();
  private subscriberClient: Redis | null = null;

  constructor(private readonly redis: RedisService) {}

  async onModuleInit(): Promise<void> {
    this.subscriberClient = this.redis.getClient().duplicate();
    this.subscriberClient.on('message', (channel, payload) => {
      if (channel !== NOTIFICATION_CHANNEL) return;
      try {
        this.dispatch(JSON.parse(payload) as AdminNotificationEventEnvelope);
      } catch (error) {
        this.logger.warn(`Ignored invalid notification event: ${(error as Error).message}`);
      }
    });
    await this.subscriberClient.subscribe(NOTIFICATION_CHANNEL);
  }

  connect(adminId: string, request: Request): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const connectionId = randomUUID();
      let cleaned = false;

      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        const adminConnections = this.connections.get(adminId);
        const connection = adminConnections?.get(connectionId);
        if (connection) clearInterval(connection.heartbeat);
        adminConnections?.delete(connectionId);
        if (adminConnections?.size === 0) this.connections.delete(adminId);
        request.off('close', cleanup);
        request.off('aborted', cleanup);
        if (!subscriber.closed) subscriber.complete();
      };

      const heartbeat = setInterval(() => {
        if (subscriber.closed || request.destroyed) {
          cleanup();
          return;
        }
        subscriber.next({ type: 'heartbeat', data: { timestamp: new Date().toISOString() } });
      }, HEARTBEAT_INTERVAL_MS);
      heartbeat.unref();

      const adminConnections = this.connections.get(adminId) ?? new Map();
      adminConnections.set(connectionId, { subscriber, heartbeat, cleanup });
      this.connections.set(adminId, adminConnections);
      request.once('close', cleanup);
      request.once('aborted', cleanup);

      subscriber.next({ type: 'connected', data: { connectedAt: new Date().toISOString() } });
      return cleanup;
    });
  }

  async publish(envelope: AdminNotificationEventEnvelope): Promise<void> {
    await this.redis.getClient().publish(NOTIFICATION_CHANNEL, JSON.stringify(envelope));
  }

  async onModuleDestroy(): Promise<void> {
    for (const adminConnections of this.connections.values()) {
      for (const connection of adminConnections.values()) connection.cleanup();
    }
    this.connections.clear();

    if (this.subscriberClient) {
      await this.subscriberClient.unsubscribe(NOTIFICATION_CHANNEL).catch(() => undefined);
      await this.subscriberClient.quit().catch(() => undefined);
      this.subscriberClient = null;
    }
  }

  private dispatch(envelope: AdminNotificationEventEnvelope): void {
    for (const adminId of envelope.adminIds) {
      const adminConnections = this.connections.get(adminId);
      if (!adminConnections) continue;
      for (const connection of [...adminConnections.values()]) {
        if (connection.subscriber.closed) {
          connection.cleanup();
          continue;
        }
        connection.subscriber.next({ type: envelope.event, data: envelope.data });
      }
    }
  }
}
