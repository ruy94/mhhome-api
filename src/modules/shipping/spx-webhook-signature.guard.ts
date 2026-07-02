import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Request } from 'express';
import { timingSafeEqual } from 'node:crypto';

import shippingConfig from '../../config/shipping.config.js';
import { SpxShippingSignerService } from '../integrations/shipping/spx/spx-shipping-signer.service.js';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Injectable()
export class SpxWebhookSignatureGuard implements CanActivate {
  constructor(
    @Inject(shippingConfig.KEY)
    private readonly cfg: ConfigType<typeof shippingConfig>,
    private readonly signer: SpxShippingSignerService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithRawBody>();
    const signature = this.getHeader(request, 'check-sign');
    const timestamp = this.getHeader(request, 'timestamp');
    const randomNum = this.getHeader(request, 'random-num');
    const appId = Number(this.getHeader(request, 'app-id') ?? this.cfg.spx.appId);

    if (!signature || !timestamp || !randomNum || !appId || !this.cfg.spx.secretKey) {
      throw new UnauthorizedException('Missing SPX signature headers');
    }

    const rawBody = request.rawBody?.toString('utf8');
    if (!rawBody) throw new UnauthorizedException('Missing raw body');

    const expected = this.signer.generateCheckSign(
      appId,
      this.cfg.spx.secretKey,
      timestamp,
      randomNum,
      rawBody,
    );
    if (!this.safeEqual(expected, signature)) {
      throw new UnauthorizedException('Invalid SPX signature');
    }

    return true;
  }

  private getHeader(request: Request, name: string) {
    const value = request.headers[name];
    if (Array.isArray(value)) return value[0];
    return value;
  }

  private safeEqual(expected: string, received: string) {
    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');
    return (
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
