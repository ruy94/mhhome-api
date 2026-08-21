import { Injectable } from '@nestjs/common';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

@Injectable()
export class MarketplaceHmacService {
  hashBody(body?: Buffer | string): string {
    return createHash('sha256').update(body ?? '').digest('hex');
  }

  canonical(input: {
    method: string;
    pathWithQuery: string;
    timestamp: string;
    nonce: string;
    idempotencyKey?: string;
    bodyHash: string;
  }): string {
    return [
      input.method.toUpperCase(),
      input.pathWithQuery,
      input.timestamp,
      input.nonce,
      input.idempotencyKey ?? '',
      input.bodyHash,
    ].join('\n');
  }

  sign(secret: string, canonicalPayload: string): string {
    return createHmac('sha256', secret).update(canonicalPayload).digest('hex');
  }

  verify(expected: string, received: string): boolean {
    const expectedBuffer = Buffer.from(expected, 'hex');
    const receivedBuffer = Buffer.from(received, 'hex');
    return (
      expectedBuffer.length > 0 &&
      expectedBuffer.length === receivedBuffer.length &&
      timingSafeEqual(expectedBuffer, receivedBuffer)
    );
  }
}
