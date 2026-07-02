import type { UserPlatform } from '../../../generated/prisma/enums.js';

export interface WebsiteJwtPayload {
  sub: string;
  email: string;
  platform: UserPlatform;
  jti?: string;
}

export interface WebsiteJwtDecoded extends WebsiteJwtPayload {
  iat: number;
  exp: number;
}
