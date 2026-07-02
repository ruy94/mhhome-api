import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WebsiteJwtAuthGuard extends AuthGuard('website-jwt') {
  handleRequest<TUser = unknown>(err: unknown, user: unknown): TUser {
    if (err || !user) {
      throw (err as Error) || new UnauthorizedException();
    }

    return user as TUser;
  }
}
