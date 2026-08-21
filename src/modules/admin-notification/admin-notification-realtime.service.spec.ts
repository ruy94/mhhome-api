import { EventEmitter } from 'node:events';

jest.mock('../../common/redis/redis.service.js', () => ({
  RedisService: class {},
}));

import { AdminNotificationRealtimeService } from './admin-notification-realtime.service.js';

describe('AdminNotificationRealtimeService connection cleanup', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  function createRequest() {
    const request = new EventEmitter() as EventEmitter & { destroyed: boolean };
    request.destroyed = false;
    return request;
  }

  function connectionCount(service: AdminNotificationRealtimeService) {
    const connections = (
      service as unknown as {
        connections: Map<string, Map<string, unknown>>;
      }
    ).connections;
    return [...connections.values()].reduce((total, group) => total + group.size, 0);
  }

  it('removes the stream and heartbeat when the browser socket closes', () => {
    const service = new AdminNotificationRealtimeService({} as never);
    const request = createRequest();
    const subscription = service.connect('admin-1', request as never).subscribe();

    expect(connectionCount(service)).toBe(1);
    request.emit('close');
    expect(connectionCount(service)).toBe(0);
    expect(subscription.closed).toBe(true);
  });

  it('cleans up idempotently when the observable unsubscribes and request aborts', () => {
    const service = new AdminNotificationRealtimeService({} as never);
    const request = createRequest();
    const subscription = service.connect('admin-1', request as never).subscribe();

    subscription.unsubscribe();
    request.emit('aborted');
    request.emit('close');

    expect(connectionCount(service)).toBe(0);
  });
});
