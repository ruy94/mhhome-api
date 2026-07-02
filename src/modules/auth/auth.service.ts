import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { randomUUID } from 'crypto';

import appConfig from '../../config/app.config.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthCacheService } from '../../common/redis/auth-cache.service.js';
import { UserPlatform } from '../../generated/prisma/enums.js';
import type { LoginDto } from './dto/login.dto.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { JwtDecoded, JwtPayload } from './dto/jwt.dto.js';
import type { WebsiteJwtDecoded, WebsiteJwtPayload } from './dto/website-jwt.dto.js';
import type { WebsiteLoginDto } from './dto/website-login.dto.js';
import type { WebsiteRegisterDto } from './dto/website-register.dto.js';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

export interface WebsiteAuthUser {
  id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  avatar: string | null;
  emailVerifiedAt: Date | null;
  phoneVerifiedAt: Date | null;
  registeredFrom: UserPlatform;
  lastLoginFrom: UserPlatform | null;
  isGuest: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebsiteAuthResult extends TokenPair {
  user: WebsiteAuthUser;
}

export interface WebsiteAuthResponse {
  access_token: string;
  user: WebsiteAuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly authCache: AuthCacheService,
    @Inject(appConfig.KEY) private readonly cfg: ConfigType<typeof appConfig>,
  ) {}

  async login(dto: LoginDto): Promise<TokenPair> {
    const admin = await this.prisma.admin.findUnique({
      where: { username: dto.username, isActive: true },
    });

    if (!admin) throw new UnauthorizedException('Invalid credentials');
    if (!compareSync(dto.password, admin.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signTokenPair({ sub: admin.id, username: admin.username });
  }

  async registerWebsite(dto: WebsiteRegisterDto): Promise<WebsiteAuthResult> {
    const email = this.normalizeEmail(dto.email);
    const existing = await this.prisma.user.findUnique({ where: { email } });

    if (existing?.passwordHash) {
      throw new ConflictException('Email already registered');
    }

    if (existing && !existing.isActive) {
      throw new UnauthorizedException('Customer account is inactive');
    }

    const passwordHash = hashSync(dto.password, 10);
    const data = this.compactUndefined({
      email,
      passwordHash,
      name: dto.name,
      phone: dto.phone,
      phoneNormalized: this.normalizePhone(dto.phone),
      registeredFrom: existing?.registeredFrom ?? UserPlatform.Website,
      lastLoginFrom: UserPlatform.Website,
      isGuest: false,
      isActive: true,
    });

    const user = existing
      ? await this.prisma.user.update({
          where: { id: existing.id },
          data,
          select: this.websiteAuthUserSelect(),
        })
      : await this.prisma.user.create({
          data,
          select: this.websiteAuthUserSelect(),
        });

    return {
      ...(await this.signWebsiteTokenPair(user)),
      user,
    };
  }

  async loginWebsite(dto: WebsiteLoginDto): Promise<WebsiteAuthResult> {
    const email = this.normalizeEmail(dto.email);
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...this.websiteAuthUserSelect(),
        passwordHash: true,
      },
    });

    if (!user?.passwordHash || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!compareSync(dto.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginFrom: UserPlatform.Website, isGuest: false },
      select: this.websiteAuthUserSelect(),
    });

    return {
      ...(await this.signWebsiteTokenPair(updated)),
      user: updated,
    };
  }

  async refreshWebsiteToken(refreshToken?: string): Promise<WebsiteAuthResult> {
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    try {
      const payload = await this.jwtService.verifyAsync<WebsiteJwtDecoded>(refreshToken, {
        secret: this.cfg.jwt.refreshSecret,
      });

      if (payload.platform !== UserPlatform.Website) {
        throw new UnauthorizedException('Invalid customer token');
      }

      if (payload.jti && (await this.authCache.isBlacklisted(payload.jti))) {
        throw new UnauthorizedException('Token has been revoked');
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
        select: this.websiteAuthUserSelect(),
      });

      if (!user) throw new UnauthorizedException('Access denied');

      return {
        ...(await this.signWebsiteTokenPair(user)),
        user,
      };
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  async getWebsiteMe(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        passwordHash: { not: null },
        isActive: true,
      },
      select: {
        ...this.websiteAuthUserSelect(),
        addresses: {
          where: { isDeleted: 0 },
          orderBy: { id: 'desc' },
        },
      },
    });

    if (!user) throw new UnauthorizedException('Access denied');
    return user;
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtDecoded>(refreshToken, {
        secret: this.cfg.jwt.refreshSecret,
      });

      // Kiểm tra blacklist — token đã bị thu hồi (logout trước đó)
      if (payload.jti && (await this.authCache.isBlacklisted(payload.jti))) {
        throw new UnauthorizedException('Token has been revoked');
      }

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub, isActive: true },
      });
      if (!admin) throw new UnauthorizedException('Access denied');

      return this.signTokenPair({ sub: admin.id, username: admin.username });
    } catch {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }
  }

  /** Blacklist một refresh token theo jti — gọi khi logout */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      const payload = this.jwtService.decode<JwtDecoded>(refreshToken);
      if (!payload?.jti || !payload.exp) return;
      const remaining = payload.exp - Math.floor(Date.now() / 1000);
      if (remaining > 0) {
        await this.authCache.blacklistToken(payload.jti, remaining);
      }
    } catch {
      // Ignore — token không decode được thì không cần blacklist
    }
  }

  async changePassword(dto: ChangePasswordDto, adminId: string): Promise<void> {
    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const admin = await this.prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (!compareSync(dto.currentPassword, admin.password)) {
      throw new BadRequestException('Current password is incorrect');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { password: hashSync(dto.newPassword, 10) },
    });
  }

  private async signTokenPair(payload: JwtPayload): Promise<TokenPair> {
    // expiresIn cần cast vì @nestjs/jwt dùng branded ms.StringValue, không nhận plain string
    type JwtSignOpts = NonNullable<Parameters<JwtService['signAsync']>[1]>;
    type JwtExp = JwtSignOpts['expiresIn'];

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.cfg.jwt.accessSecret,
        expiresIn: this.cfg.jwt.accessExpires as JwtExp,
      }),
      this.jwtService.signAsync(
        { ...payload, jti: randomUUID() },
        {
          secret: this.cfg.jwt.refreshSecret,
          expiresIn: this.cfg.jwt.refreshExpires as JwtExp,
        },
      ),
    ]);
    return { access_token, refresh_token };
  }

  private async signWebsiteTokenPair(
    user: Pick<WebsiteAuthUser, 'id' | 'email'>,
  ): Promise<TokenPair> {
    if (!user.email) {
      throw new UnauthorizedException('Customer account has no email');
    }

    type JwtSignOpts = NonNullable<Parameters<JwtService['signAsync']>[1]>;
    type JwtExp = JwtSignOpts['expiresIn'];

    const payload: WebsiteJwtPayload = {
      sub: String(user.id),
      email: user.email,
      platform: UserPlatform.Website,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.cfg.jwt.accessSecret,
        expiresIn: this.cfg.jwt.accessExpires as JwtExp,
      }),
      this.jwtService.signAsync(
        { ...payload, jti: randomUUID() },
        {
          secret: this.cfg.jwt.refreshSecret,
          expiresIn: this.cfg.jwt.refreshExpires as JwtExp,
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  private websiteAuthUserSelect() {
    return {
      id: true,
      email: true,
      name: true,
      phone: true,
      avatar: true,
      emailVerifiedAt: true,
      phoneVerifiedAt: true,
      registeredFrom: true,
      lastLoginFrom: true,
      isGuest: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    } as const;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone?: string | null) {
    if (!phone) return undefined;

    const digits = phone.replace(/\D/g, '');
    if (!digits) return undefined;
    if (digits.startsWith('84')) return `0${digits.slice(2)}`;
    return digits;
  }

  private compactUndefined<T extends Record<string, unknown>>(data: T) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }
}
