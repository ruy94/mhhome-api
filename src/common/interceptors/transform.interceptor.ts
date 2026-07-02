import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { map, Observable } from 'rxjs';

import { RESPONSE_MESSAGE } from '../decorators/response-message.decorator.js';

interface StandardResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
}

interface PaginatedPayload<T> {
  items: T[];
  meta: unknown;
}

function isPaginated<T>(data: unknown): data is PaginatedPayload<T> {
  return (
    data !== null &&
    typeof data === 'object' &&
    'items' in data &&
    'meta' in data
  );
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse<Response>();
        const message =
          this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) ?? 'Success';

        if (isPaginated<T>(data)) {
          return {
            statusCode: response.statusCode,
            message,
            data: data.items as unknown as T,
            meta: data.meta,
          };
        }

        return {
          statusCode: response.statusCode,
          message,
          data: data as T,
        };
      }),
    );
  }
}
