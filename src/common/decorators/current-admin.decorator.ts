import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import type { AuthenticatedAdmin } from '../types.js';

export const CurrentAdmin = createParamDecorator(
  (data: keyof AuthenticatedAdmin | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const admin = request.user as AuthenticatedAdmin | undefined;

    if (data) {
      return admin ? admin[data] : undefined;
    }
    return admin;
  },
);
