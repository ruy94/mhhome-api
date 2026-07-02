import { Injectable } from '@nestjs/common';

import { RedisKey } from './redis-key.js';
import { RedisService } from './redis.service.js';

export interface ReceiverIdentifier {
  type: 'phone' | 'uid';
  value: string;
}

@Injectable()
export class ZbsCacheService {
  constructor(private readonly redis: RedisService) {}

  async getQuotas(
    templateId: string,
    identifiers: ReceiverIdentifier[],
  ): Promise<Map<string, number>> {
    if (identifiers.length === 0) return new Map();

    const pipeline = this.redis.getClient().pipeline();

    for (const item of identifiers) {
      const key =
        item.type === 'phone'
          ? RedisKey.zbsPhoneQuota(templateId, item.value)
          : RedisKey.zbsUidQuota(templateId, item.value);
      pipeline.get(key);
    }

    const results = await pipeline.exec();
    const quotaMap = new Map<string, number>();
    if (!results) return quotaMap;

    for (let i = 0; i < identifiers.length; i++) {
      const count = Number(results[i]?.[1] || 0);
      quotaMap.set(identifiers[i]!.value, count);
    }

    return quotaMap;
  }

  async incrementQuotas(templateId: string, identifiers: ReceiverIdentifier[]): Promise<void> {
    if (identifiers.length === 0) return;

    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const secondsUntilMidnight = Math.floor((tomorrow.getTime() - now.getTime()) / 1000);

    const pipeline = this.redis.getClient().pipeline();

    for (const item of identifiers) {
      const key =
        item.type === 'phone'
          ? RedisKey.zbsPhoneQuota(templateId, item.value)
          : RedisKey.zbsUidQuota(templateId, item.value);

      pipeline.incr(key);
      pipeline.expire(key, secondsUntilMidnight);
    }

    await pipeline.exec();
  }
}
