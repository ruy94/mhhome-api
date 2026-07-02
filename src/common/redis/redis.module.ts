import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import redisConfig from '../../config/redis.config.js';
import { RedisService } from './redis.service.js';
import { AuthCacheService } from './auth-cache.service.js';
import { ZbsCacheService } from './zbs-cache.service.js';

@Global()
@Module({
  imports: [ConfigModule.forFeature(redisConfig)],
  providers: [RedisService, AuthCacheService, ZbsCacheService],
  exports: [RedisService, AuthCacheService, ZbsCacheService],
})
export class RedisModule {}
