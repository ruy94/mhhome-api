import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';

import { SionHubCredentialService } from '../../modules/integrations/sion-hub/sion-hub-credential.service.js';

interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

@Injectable()
export class WebhookSignatureGuard implements CanActivate {
  constructor(private readonly sionHubCredentials: SionHubCredentialService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithRawBody>();

    // 1. Lấy thông tin từ Header
    const signature = request.headers['x-sionhub-signature'] as string;
    const timestamp = request.headers['x-sionhub-timestamp'] as string;

    if (!signature || !timestamp) {
      throw new UnauthorizedException('Missing Signature Headers');
    }

    // 2. Chống Replay Attack (Optional): Request quá cũ (ví dụ quá 5 phút) thì bỏ qua
    const now = Date.now();
    const timestampMs = Number(timestamp);
    if (!Number.isFinite(timestampMs) || Math.abs(now - timestampMs) > 5 * 60 * 1000) {
      throw new UnauthorizedException('Request expired');
    }

    // 3. Lấy webhook secret của tenant A do SionHub cấp
    const secret = await this.sionHubCredentials.getWebhookSecret();

    // 4. Lấy Raw Body
    if (!request.rawBody) {
      throw new BadRequestException('Raw body not enabled. Check main.ts');
    }

    // 5. Tính toán chữ ký (Phải khớp thuật toán với WebhookWorker bên B)
    // Format bên B: timestamp + "." + bodyString
    const bodyString = request.rawBody.toString('utf8');
    const dataToSign = `${timestamp}.${bodyString}`;

    const computedSignature = crypto.createHmac('sha256', secret).update(dataToSign).digest('hex');

    // 6. So sánh
    if (!this.isSafeEqual(computedSignature, signature)) {
      throw new UnauthorizedException('Invalid Signature');
    }

    return true;
  }

  private isSafeEqual(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');

    return (
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
