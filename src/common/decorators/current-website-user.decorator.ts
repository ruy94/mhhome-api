import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import type { AuthenticatedWebsiteUser } from '../types.js';

export const CurrentWebsiteUser = createParamDecorator(
  (data: keyof AuthenticatedWebsiteUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedWebsiteUser | undefined;

    return data ? user?.[data] : user;
  },
);
