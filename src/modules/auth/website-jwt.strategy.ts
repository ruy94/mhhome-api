import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import appConfig from '../../config/app.config.js';
import { UserPlatform } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { AuthenticatedWebsiteUser } from '../../common/types.js';
import type { WebsiteJwtDecoded } from './dto/website-jwt.dto.js';

@Injectable()
export class WebsiteJwtStrategy extends PassportStrategy(Strategy, 'website-jwt') {
  constructor(
    @Inject(appConfig.KEY) cfg: ConfigType<typeof appConfig>,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.jwt.accessSecret,
    });
  }

  async validate(payload: WebsiteJwtDecoded): Promise<AuthenticatedWebsiteUser> {
    if (payload.platform !== UserPlatform.Website) {
      throw new UnauthorizedException('Invalid customer token');
    }

    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) {
      throw new UnauthorizedException('Invalid customer token');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        email: payload.email,
        passwordHash: { not: null },
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
      },
    });

    if (!user) throw new UnauthorizedException('Customer account is inactive or deleted');

    return user;
  }
}
