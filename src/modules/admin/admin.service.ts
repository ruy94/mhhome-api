import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { hashSync } from 'bcryptjs';

import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthCacheService } from '../../common/redis/auth-cache.service.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import type { CreateAdminDto } from './dto/create-admin.dto.js';
import type { UpdateAdminDto } from './dto/update-admin.dto.js';

const SUPER_ADMIN_ROLE_NAME = 'Super Admin';

const ADMIN_SELECT = {
  id: true,
  username: true,
  name: true,
  email: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      role: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authCache: AuthCacheService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto) {
    const where = {
      roles: { none: { role: { name: SUPER_ADMIN_ROLE_NAME } } },
      ...(pageOptionsDto.q
        ? {
            OR: [
              { name: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
              { username: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
              { email: { contains: pageOptionsDto.q, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.admin.findMany({
        where,
        select: ADMIN_SELECT,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      }),
      this.prisma.admin.count({ where }),
    ]);

    return new PageDto(items.map(this.formatAdmin), new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: ADMIN_SELECT,
    });
    if (!admin || this.isProtectedAdmin(admin)) throw new NotFoundException('Admin not found');
    return this.formatAdmin(admin);
  }

  async create(dto: CreateAdminDto) {
    await this.assertNoProtectedRoles(dto.roleIds);

    const exists = await this.prisma.admin.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });
    if (exists) throw new BadRequestException('Username or email already exists');

    const admin = await this.prisma.admin.create({
      data: {
        username: dto.username,
        password: hashSync(dto.password, 10),
        name: dto.name,
        email: dto.email,
        ...(dto.roleIds?.length
          ? {
              roles: {
                create: dto.roleIds.map((roleId) => ({ roleId })),
              },
            }
          : {}),
      },
      select: ADMIN_SELECT,
    });
    return this.formatAdmin(admin);
  }

  async update(id: string, dto: UpdateAdminDto) {
    await this.findOne(id);
    await this.assertNoProtectedRoles(dto.roleIds);

    await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.email && { email: dto.email }),
          ...(dto.isActive !== undefined && { isActive: dto.isActive }),
          ...(dto.password && { password: hashSync(dto.password, 10) }),
        },
      });

      if (dto.roleIds !== undefined) {
        await tx.adminRole.deleteMany({ where: { adminId: id } });
        if (dto.roleIds.length) {
          await tx.adminRole.createMany({
            data: dto.roleIds.map((roleId) => ({ adminId: id, roleId })),
          });
        }
      }
    });

    // Xoá cache permissions khi roles thay đổi
    if (dto.roleIds !== undefined || dto.isActive !== undefined) {
      await this.authCache.clearPermissions(id);
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.admin.delete({ where: { id } });
    await this.authCache.clearPermissions(id);
  }

  async getRoles() {
    return this.prisma.role.findMany({
      where: { name: { not: SUPER_ADMIN_ROLE_NAME } },
      select: {
        id: true,
        name: true,
        description: true,
        permissions: {
          select: { permission: { select: { id: true, action: true, description: true } } },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  private isProtectedAdmin(admin: {
    roles: { role: { name: string } }[];
  }) {
    return admin.roles.some((role) => role.role.name === SUPER_ADMIN_ROLE_NAME);
  }

  private async assertNoProtectedRoles(roleIds?: string[]) {
    if (!roleIds?.length) return;

    const protectedRole = await this.prisma.role.findFirst({
      where: { id: { in: roleIds }, name: SUPER_ADMIN_ROLE_NAME },
      select: { id: true },
    });

    if (protectedRole) {
      throw new BadRequestException('Cannot assign protected system role');
    }
  }

  private formatAdmin(admin: {
    id: string;
    username: string;
    name: string;
    email: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    roles: { role: { id: string; name: string; description: string | null } }[];
  }) {
    return {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      email: admin.email,
      isActive: admin.isActive,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      roles: admin.roles.map((r) => r.role),
    };
  }
}
