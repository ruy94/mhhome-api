import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import type { Request } from 'express';

import { RedisService } from '../../common/redis/redis.service.js';
import marketplaceConfig from '../../config/marketplace.config.js';
import { MarketplaceHmacService } from './marketplace-hmac.service.js';

interface MarketplaceRequest extends Request {
  rawBody?: Buffer;
  marketplaceIdempotency?: {
    key: string;
    requestHash: string;
  };
}

@Injectable()
export class MarketplaceHmacGuard implements CanActivate {
  constructor(
    private readonly redis: RedisService,
    private readonly hmac: MarketplaceHmacService,
    @Inject(marketplaceConfig.KEY)
    private readonly config: ConfigType<typeof marketplaceConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.config.enabled) throw new NotFoundException();

    const request = context.switchToHttp().getRequest<MarketplaceRequest>();
    const shopCode = this.header(request, 'x-marketplace-shop-code');
    const keyId = this.header(request, 'x-marketplace-key-id');
    const timestamp = this.header(request, 'x-marketplace-timestamp');
    const nonce = this.header(request, 'x-marketplace-nonce');
    const signature = this.header(request, 'x-marketplace-signature');
    const idempotencyKey = request.header('x-idempotency-key')?.trim();

    if (shopCode !== this.config.shopCode || keyId !== this.config.keyId) {
      throw new UnauthorizedException('Invalid Marketplace credential');
    }

    const timestampSeconds = Number(timestamp);
    if (
      !Number.isInteger(timestampSeconds) ||
      Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) >
        this.config.hmacMaxSkewSeconds
    ) {
      throw new UnauthorizedException('Marketplace signature timestamp expired');
    }

    const bodyHash = this.hmac.hashBody(request.rawBody);
    const canonical = this.hmac.canonical({
      method: request.method,
      pathWithQuery: request.originalUrl,
      timestamp,
      nonce,
      idempotencyKey,
      bodyHash,
    });
    const expected = this.hmac.sign(this.config.hmacSecret, canonical);
    if (!this.hmac.verify(expected, signature)) {
      throw new UnauthorizedException('Invalid Marketplace signature');
    }

    const accepted = await this.redis
      .getClient()
      .set(
        `marketplace:hmac:nonce:${keyId}:${nonce}`,
        '1',
        'EX',
        this.config.nonceTtlSeconds,
        'NX',
      );
    if (accepted !== 'OK') throw new UnauthorizedException('Marketplace nonce replayed');
    if (idempotencyKey) request.marketplaceIdempotency = { key: idempotencyKey, requestHash: bodyHash };
    return true;
  }

  private header(request: Request, name: string): string {
    const value = request.header(name)?.trim();
    if (!value) throw new UnauthorizedException(`Missing ${name} header`);
    return value;
  }
}
