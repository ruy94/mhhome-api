import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import appConfig from '../../config/app.config.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthCacheService } from '../../common/redis/auth-cache.service.js';
import type { AuthenticatedAdmin } from '../../common/types.js';
import type { JwtDecoded } from './dto/jwt.dto.js';

type AdminWithRoles = {
  id: string;
  username: string;
  roles: {
    role: {
      permissions: {
        permission: { action: string };
      }[];
    };
  }[];
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(appConfig.KEY) cfg: ConfigType<typeof appConfig>,
    private readonly prisma: PrismaService,
    private readonly authCache: AuthCacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.jwt.accessSecret,
    });
  }

  async validate(payload: JwtDecoded): Promise<AuthenticatedAdmin> {
    const adminId = payload.sub;

    // 1. Cache hit
    const cached = await this.authCache.getPermissions(adminId);
    if (cached) {
      return { id: adminId, username: payload.username, permissions: cached };
    }

    // 2. Cache miss — query DB với full permission hierarchy
    const admin = (await this.prisma.admin.findUnique({
      where: { id: adminId, isActive: true },
      select: {
        id: true,
        username: true,
        roles: {
          select: {
            role: {
              select: {
                permissions: {
                  select: { permission: { select: { action: true } } },
                },
              },
            },
          },
        },
      },
    })) as AdminWithRoles | null;

    if (!admin) throw new UnauthorizedException('Account locked or deleted');

    const permissions = [
      ...new Set(
        admin.roles.flatMap((ar) => ar.role.permissions.map((rp) => rp.permission.action)),
      ),
    ];

    await this.authCache.setPermissions(adminId, permissions);

    return { id: admin.id, username: admin.username, permissions };
  }
}
