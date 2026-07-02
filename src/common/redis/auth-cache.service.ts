import { Injectable } from '@nestjs/common';

import { RedisService } from './redis.service.js';
import { RedisKey } from './redis-key.js';

const PERMISSIONS_TTL = 60 * 60; // 1 giờ

@Injectable()
export class AuthCacheService {
  constructor(private readonly redis: RedisService) {}

  async getPermissions(adminId: string): Promise<string[] | null> {
    const data = await this.redis.getClient().get(RedisKey.adminPermissions(adminId));
    return data ? (JSON.parse(data) as string[]) : null;
  }

  async setPermissions(adminId: string, permissions: string[]): Promise<void> {
    await this.redis
      .getClient()
      .set(RedisKey.adminPermissions(adminId), JSON.stringify(permissions), 'EX', PERMISSIONS_TTL);
  }

  async clearPermissions(adminId: string): Promise<void> {
    await this.redis.getClient().del(RedisKey.adminPermissions(adminId));
  }

  async blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
    await this.redis.getClient().set(RedisKey.refreshTokenBlacklist(jti), '1', 'EX', ttlSeconds);
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const val = await this.redis.getClient().get(RedisKey.refreshTokenBlacklist(jti));
    return val !== null;
  }
}
