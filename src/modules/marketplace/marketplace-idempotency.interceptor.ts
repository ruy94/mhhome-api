import {
  CallHandler,
  ConflictException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { catchError, from, map, mergeMap, type Observable, of, throwError } from 'rxjs';

import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

interface MarketplaceRequest extends Request {
  marketplaceIdempotency?: { key: string; requestHash: string };
}

@Injectable()
export class MarketplaceIdempotencyInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest<MarketplaceRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const current = request.marketplaceIdempotency;
    if (!current) throw new UnauthorizedException('Missing x-idempotency-key header');

    const existing = await this.prisma.marketplaceIdempotencyRecord.findUnique({
      where: { key: current.key },
    });
    if (existing) {
      if (existing.requestHash !== current.requestHash) {
        throw new ConflictException('Idempotency key was used with a different request');
      }
      if (existing.responseStatus !== null) {
        response.status(existing.responseStatus);
        return of(existing.responseBody);
      }
      throw new ConflictException('Idempotent request is still processing');
    }

    let record;
    try {
      record = await this.prisma.marketplaceIdempotencyRecord.create({
        data: {
          key: current.key,
          method: request.method,
          path: request.originalUrl,
          requestHash: current.requestHash,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });
    } catch {
      const concurrent = await this.prisma.marketplaceIdempotencyRecord.findUnique({
        where: { key: current.key },
      });
      if (concurrent?.requestHash !== current.requestHash) {
        throw new ConflictException('Idempotency key was used with a different request');
      }
      if (concurrent?.responseStatus !== null && concurrent?.responseStatus !== undefined) {
        response.status(concurrent.responseStatus);
        return of(concurrent.responseBody);
      }
      throw new ConflictException('Idempotent request is still processing');
    }
    return next.handle().pipe(
      mergeMap((data) =>
        from(
          this.prisma.marketplaceIdempotencyRecord.update({
            where: { id: record.id },
            data: { responseStatus: response.statusCode, responseBody: this.toJson(data) },
          }),
        ).pipe(map(() => data)),
      ),
      catchError((error) =>
        from(this.prisma.marketplaceIdempotencyRecord.delete({ where: { id: record.id } })).pipe(
          catchError(() => of(null)),
          mergeMap(() => throwError(() => error)),
        ),
      ),
    );
  }

  private toJson(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }
}
