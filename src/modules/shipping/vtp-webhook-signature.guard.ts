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

@Injectable()
export class VtpWebhookSignatureGuard implements CanActivate {
  constructor(
    @Inject(shippingConfig.KEY)
    private readonly cfg: ConfigType<typeof shippingConfig>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = this.header(request, 'authorization');
    const body = request.body as { TOKEN?: unknown } | undefined;
    const webhookToken = body?.TOKEN === undefined ? '' : String(body.TOKEN);

    if (!this.cfg.vtp.webhookSecret || !authorization || !webhookToken) {
      throw new UnauthorizedException('Missing ViettelPost webhook credentials');
    }
    if (!this.safeEqual(this.cfg.vtp.webhookSecret, webhookToken)) {
      throw new UnauthorizedException('Invalid ViettelPost webhook credentials');
    }
    return true;
  }

  private header(request: Request, name: string) {
    const value = request.headers[name];
    return Array.isArray(value) ? value[0] : value;
  }

  private safeEqual(expected: string, received: string) {
    const expectedBuffer = Buffer.from(expected);
    const receivedBuffer = Buffer.from(received);
    return (
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
