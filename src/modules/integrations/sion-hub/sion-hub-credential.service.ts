import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import sionHubConfig from '../../../config/sion-hub.config.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { RedisService } from '../../../common/redis/redis.service.js';
import { RedisKey } from '../../../common/redis/redis-key.js';

const CREDENTIAL_TTL_SECONDS = 60 * 60;

@Injectable()
export class SionHubCredentialService implements OnModuleInit {
  private readonly logger = new Logger(SionHubCredentialService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    @Inject(sionHubConfig.KEY)
    private readonly cfg: ConfigType<typeof sionHubConfig>,
  ) {}

  async onModuleInit(): Promise<void> {
    const record = await this.prisma.serviceCredential.findUnique({
      where: { service: this.cfg.serviceName },
    });

    if (!record) {
      await this.prisma.serviceCredential.create({
        data: {
          service: this.cfg.serviceName,
          apiKey: this.cfg.apiKey,
          webhookSecret: this.cfg.webhookSecret || undefined,
        },
      });

      if (!this.cfg.apiKey) {
        this.logger.warn(
          `ServiceCredential ${this.cfg.serviceName} was created without an API key`,
        );
      }
      return;
    }

    const shouldFillApiKey = !record.apiKey && this.cfg.apiKey;
    const shouldFillWebhookSecret = !record.webhookSecret && this.cfg.webhookSecret;

    if (shouldFillApiKey || shouldFillWebhookSecret) {
      await this.prisma.serviceCredential.update({
        where: { service: this.cfg.serviceName },
        data: {
          ...(shouldFillApiKey && { apiKey: this.cfg.apiKey }),
          ...(shouldFillWebhookSecret && { webhookSecret: this.cfg.webhookSecret }),
        },
      });
      await this.clearCache();
    }
  }

  async getApiKey(): Promise<string> {
    const client = this.redis.getClient();
    const key = RedisKey.sionHubApiKey(this.cfg.serviceName);
    const cached = await client.get(key);
    if (cached) return cached;

    const record = await this.prisma.serviceCredential.findUnique({
      where: { service: this.cfg.serviceName },
    });

    if (!record?.apiKey) {
      throw new InternalServerErrorException('API key chưa được khởi tạo. Hãy liên hệ với nhà cung cấp dịch vụ.');
    }

    await client.set(key, record.apiKey, 'EX', CREDENTIAL_TTL_SECONDS);
    return record.apiKey;
  }

  async getWebhookSecret(): Promise<string> {
    const client = this.redis.getClient();
    const key = RedisKey.sionHubWebhookSecret(this.cfg.serviceName);
    const cached = await client.get(key);
    if (cached) return cached;

    const record = await this.prisma.serviceCredential.findUnique({
      where: { service: this.cfg.serviceName },
    });
    const secret = record?.webhookSecret || this.cfg.webhookSecret;

    if (!secret) {
      throw new InternalServerErrorException('Webhook secret chưa được khởi tạo. Hãy liên hệ cho nhà cung cấp dịch vụ.');
    }

    await client.set(key, secret, 'EX', CREDENTIAL_TTL_SECONDS);
    return secret;
  }

  async rotateApiKey(apiKey: string): Promise<void> {
    await this.prisma.serviceCredential.upsert({
      where: { service: this.cfg.serviceName },
      update: { apiKey, rotatedAt: new Date() },
      create: {
        service: this.cfg.serviceName,
        apiKey,
        webhookSecret: this.cfg.webhookSecret || undefined,
        rotatedAt: new Date(),
      },
    });
    await this.clearCache();
    this.logger.log(`API chưa được khởi tạo. Hãy liên hệ cho nhà cung cấp dịch vụ.`);
  }

  async clearCache(): Promise<void> {
    await this.redis
      .getClient()
      .del(
        RedisKey.sionHubApiKey(this.cfg.serviceName),
        RedisKey.sionHubWebhookSecret(this.cfg.serviceName),
      );
  }
}
