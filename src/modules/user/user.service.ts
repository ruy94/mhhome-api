import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { UserPlatform } from '../../generated/prisma/enums.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { CreateWebsiteUserDto } from './dto/create-website-user.dto.js';
import { DecodePhoneZaloDto } from './dto/decode-phone-zalo.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateWebsiteUserDto } from './dto/update-website-user.dto.js';
import { UserPageOptionsDto } from './dto/user-page-options.dto.js';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async create(data: CreateUserDto | CreateWebsiteUserDto) {
    if ('zaloId' in data && (data.zaloId)) {
      return this.createOrUpdateMiniappUser(data);
    }

    return this.createOrUpdateWebsiteUser(data as CreateWebsiteUserDto);
  }

  async createOrUpdateMiniappUser(data: CreateUserDto) {
    if (!data.zaloId) {
      throw new BadRequestException('Missing Zalo user identity');
    }

    const user = await this.findMiniappUser(data.zaloId, data.idbyOA);
    const { addresses: incomingAddresses = [], ...userData } = data;
    const phoneNormalized = this.normalizePhone(data.phone);

    const persistedUserData = this.compactUndefined({
      ...userData,
      phoneNormalized,
      lastLoginFrom: UserPlatform.ZaloMiniApp,
      ...(user ? {} : { registeredFrom: UserPlatform.ZaloMiniApp, isGuest: false }),
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: persistedUserData,
      });

      await this.createIncomingAddresses(user.id, incomingAddresses);

      const updated = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
          addresses: {
            where: { isDeleted: 0 },
          },
        },
      });

      return this.sanitizeUser(updated);
    }

    const created = await this.prisma.user.create({
      data: {
        ...persistedUserData,
        addresses: {
          create: incomingAddresses.map((addr) => this.toAddressCreateInput(addr)),
        },
      },
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });

    return this.sanitizeUser(created);
  }

  async createOrUpdateWebsiteUser(data: CreateWebsiteUserDto) {
    const email = this.normalizeEmail(data.email);
    const phoneNormalized = this.normalizePhone(data.phone);

    if (!email && !phoneNormalized) {
      throw new BadRequestException('Website user requires an email or phone');
    }

    const { addresses: incomingAddresses = [], ...userData } = data;
    const user = email
      ? await this.prisma.user.findUnique({
          where: { email },
          include: {
            addresses: {
              where: { isDeleted: 0 },
            },
          },
        })
      : null;

    const persistedUserData = this.compactUndefined({
      ...userData,
      email,
      phoneNormalized,
      lastLoginFrom: UserPlatform.Website,
      ...(user
        ? {}
        : {
            registeredFrom: UserPlatform.Website,
            isGuest: data.isGuest ?? !email,
          }),
    });

    if (user) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: persistedUserData,
      });

      await this.createIncomingAddresses(user.id, incomingAddresses);

      const updated = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: {
          addresses: {
            where: { isDeleted: 0 },
          },
        },
      });

      return this.sanitizeUser(updated);
    }

    const created = await this.prisma.user.create({
      data: {
        ...persistedUserData,
        addresses: {
          create: incomingAddresses.map((addr) => this.toAddressCreateInput(addr)),
        },
      },
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });

    return this.sanitizeUser(created);
  }

  async findAll(pageOptionsDto: UserPageOptionsDto) {
    const where = {
      ...(pageOptionsDto.registeredFrom
        ? { registeredFrom: pageOptionsDto.registeredFrom }
        : {}),
      ...(pageOptionsDto.q
        ? {
            OR: [
              { name: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
              { phone: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
              { email: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { createdAt: pageOptionsDto.order },
        include: {
          addresses: {
            where: { isDeleted: 0 },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return new PageDto(
      items.map((item) => this.sanitizeUser(item)),
      new PageMetaDto({ itemCount, pageOptionsDto }),
    );
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });
    if (!user) throw new NotFoundException('User not exist!');
    return this.sanitizeUser(user);
  }

  async update(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not exist!');

    const { addresses: _addresses, ...userData } = data;
    const updated = await this.prisma.user.update({
      where: { id },
      data: this.compactUndefined({
        ...userData,
        phoneNormalized: this.normalizePhone(data.phone),
      }),
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });

    return this.sanitizeUser(updated);
  }

  async updateMiniappUser(id: number, data: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not exist!');

    const { addresses: _addresses, ...userData } = data;
    const updated = await this.prisma.user.update({
      where: { id },
      data: this.compactUndefined({
        ...userData,
        phoneNormalized: this.normalizePhone(data.phone),
        lastLoginFrom: UserPlatform.ZaloMiniApp,
      }),
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });

    return this.sanitizeUser(updated);
  }

  async updateWebsiteUser(id: number, data: UpdateWebsiteUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not exist!');

    const email = this.normalizeEmail(data.email);
    if (email) {
      const existingEmailUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingEmailUser && existingEmailUser.id !== id) {
        throw new ConflictException('Email already belongs to another user');
      }
    }

    const { addresses: _addresses, ...userData } = data;
    const updated = await this.prisma.user.update({
      where: { id },
      data: this.compactUndefined({
        ...userData,
        email,
        phoneNormalized: this.normalizePhone(data.phone),
        lastLoginFrom: UserPlatform.Website,
      }),
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
    });

    return this.sanitizeUser(updated);
  }

  async decodePhoneZalo(data: DecodePhoneZaloDto): Promise<{ number: string }> {
    const endpoint = 'https://graph.zalo.me/v2.0/me/info';
    const userAccessToken = data.accessZaloToken;
    const token = data.phoneZaloToken;
    const secretKey = this.configService.get<string>('ZALO_APP_SECRET_KEY');

    if (!secretKey) {
      throw new ServiceUnavailableException('Zalo app secret key is not configured');
    }

    try {
      const response = await this.httpService.axiosRef.get<{
        data?: { number?: string };
        error?: number;
        message?: string;
      }>(endpoint, {
        headers: {
          access_token: userAccessToken,
          code: token,
          secret_key: secretKey,
        },
      });

      const responseBody = response.data;
      const number = responseBody.data?.number;

      if (responseBody.error !== 0 || !number) {
        this.logger.error(
          `Invalid Zalo phone decode response: error=${responseBody.error}, message=${responseBody.message ?? 'unknown'}`,
        );
        throw new ServiceUnavailableException('Cannot decode Zalo phone number');
      }

      return { number };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      this.logger.error('Error fetching user phone from Zalo', error);
      throw new ServiceUnavailableException('Cannot decode Zalo phone number');
    }
  }

  private toAddressCreateInput(addr: CreateAddressDto) {
    return {
      cneeName: addr.cneeName,
      cneePhone: addr.cneePhone,
      idCity: addr.idCity,
      city: addr.city,
      idDistrict: addr.idDistrict,
      district: addr.district,
      idWard: addr.idWard,
      ward: addr.ward,
      fullAddr: addr.fullAddr,
    };
  }

  private async findMiniappUser(zaloId?: string, idbyOA?: string) {
    const identityWhere = [zaloId ? { zaloId } : undefined, idbyOA ? { idbyOA } : undefined].filter(
      (where): where is { zaloId: string } | { idbyOA: string } => Boolean(where),
    );

    const users = await this.prisma.user.findMany({
      where: { OR: identityWhere },
      include: {
        addresses: {
          where: { isDeleted: 0 },
        },
      },
      take: 2,
    });

    if (users.length > 1) {
      throw new ConflictException('Zalo identities belong to different users');
    }

    return users[0] ?? null;
  }

  private async createIncomingAddresses(userId: number, addresses: CreateAddressDto[]) {
    if (addresses.length === 0) return;

    const addressesToCreate = addresses.filter((addr) => addr.cneeName);
    if (addressesToCreate.length === 0) return;

    await this.prisma.address.createMany({
      data: addressesToCreate.map((addr) => ({
        ...this.toAddressCreateInput(addr),
        userId,
      })),
    });
  }

  private normalizeEmail(email?: string | null) {
    return email?.trim().toLowerCase() || undefined;
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

  private sanitizeUser<T extends { passwordHash?: string | null } | null>(user: T) {
    if (!user) return user;

    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
