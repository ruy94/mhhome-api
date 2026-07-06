import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule, utilities as winstonUtilities } from 'nest-winston';
import * as winston from 'winston';

import appConfig from './config/app.config.js';
import databaseConfig from './config/database.config.js';
import redisConfig from './config/redis.config.js';
import sionHubConfig from './config/sion-hub.config.js';
import shippingConfig from './config/shipping.config.js';
import saleworkConfig from './config/salework.config.js';
import zaloConfig from './config/zalo.config.js';
import { validateEnv } from './config/env.validation.js';

import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './common/redis/redis.module.js';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from './common/guards/permissions.guard.js';

import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AclModule } from './modules/acl/acl.module.js';
import { UserModule } from './modules/user/user.module.js';
import { AddressModule } from './modules/address/address.module.js';
import { AffiliateModule } from './modules/affiliate/affiliate.module.js';
import { BannerModule } from './modules/banner/banner.module.js';
import { BillingModule } from './modules/billing/billing.module.js';
import { CampaignModule } from './modules/campaign/campaign.module.js';
import { CartModule } from './modules/cart/cart.module.js';
import { CategoryModule } from './modules/category/category.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { FlashSaleModule } from './modules/flash-sale/flash-sale.module.js';
import { OrderModule } from './modules/order/order.module.js';
import { ShippingModule } from './modules/shipping/shipping.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { ReviewModule } from './modules/review/review.module.js';
import { UploadModule } from './modules/upload/upload.module.js';
import { VariantModule } from './modules/variant/variant.module.js';
import { VoucherModule } from './modules/voucher/voucher.module.js';
import { ZaloModule } from './modules/zalo/zalo.module.js';
import { ZaloVideoModule } from './modules/zalo-video/zalo-video.module.js';
import { ZbsModule } from './modules/zbs/zbs.module.js';
import { SocketModule } from './modules/socket/socket.module.js';
import { SionHubModule } from './modules/integrations/sion-hub/sion-hub.module.js';
import { SaleworkModule } from './modules/salework/salework.module.js';
import { WebhookReceiverModule } from './modules/webhook-receiver/webhook-receiver.module.js';

const vietnamDateTimeFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

function vietnamTimestamp(): string {
  const parts = vietnamDateTimeFormatter.formatToParts(new Date());
  let year = '';
  let month = '';
  let day = '';
  let hour = '';
  let minute = '';
  let second = '';

  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    else if (part.type === 'month') month = part.value;
    else if (part.type === 'day') day = part.value;
    else if (part.type === 'hour') hour = part.value;
    else if (part.type === 'minute') minute = part.value;
    else if (part.type === 'second') second = part.value;
  }

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
        sionHubConfig,
        shippingConfig,
        saleworkConfig,
        zaloConfig,
      ],
      validate: validateEnv,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`],
    }),

    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const isProd = cfg.get<string>('app.env') === 'production';
        const level = cfg.get<string>('app.logLevel') ?? 'info';

        const devFormat = winston.format.combine(
          winston.format.timestamp({ format: vietnamTimestamp }),
          winston.format.ms(),
          winstonUtilities.format.nestLike('nestLikeAPI', {
            colors: true,
            prettyPrint: true,
          }),
        );

        const prodFormat = winston.format.combine(
          winston.format.timestamp({ format: vietnamTimestamp }),
          winston.format.json(),
        );

        return {
          level,
          transports: [
            new winston.transports.Console({
              format: isProd ? prodFormat : devFormat,
            }),
          ],
        };
      },
    }),

    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>('redis.host') ?? 'localhost',
          port: cfg.get<number>('redis.port') ?? 6379,
          password: cfg.get<string>('redis.password') || undefined,
          db: cfg.get<number>('redis.db') ?? 0,
        },
      }),
    }),

    PrismaModule,
    RedisModule,
    ScheduleModule.forRoot(),
    HealthModule,
    AuthModule,
    AdminModule,
    AclModule,
    UserModule,
    CartModule,
    CategoryModule,
    ProductModule,
    VariantModule,
    VoucherModule,
    FlashSaleModule,
    OrderModule,
    ShippingModule,
    ReviewModule,
    UploadModule,
    ZaloVideoModule,
    AddressModule,
    ZaloModule,
    BannerModule,
    DashboardModule,
    AffiliateModule,
    BillingModule,
    CampaignModule,
    ZbsModule,
    SaleworkModule,
    SocketModule,
    SionHubModule,
    WebhookReceiverModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
