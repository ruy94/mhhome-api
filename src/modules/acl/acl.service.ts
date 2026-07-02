import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import { AuthCacheService } from '../../common/redis/auth-cache.service.js';
import type { CreateRoleDto } from './dto/create-role.dto.js';
import type { UpdateRoleDto } from './dto/update-role.dto.js';

const SUPER_ADMIN_ROLE_NAME = 'Super Admin';

@Injectable()
export class AclService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authCache: AuthCacheService,
  ) {}

  /** Danh sách tất cả permissions */
  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: { action: 'asc' } });
  }

  /** Danh sách tất cả roles (kèm số lượng admin đang dùng) */
  async findAllRoles() {
    return this.prisma.role.findMany({
      where: { name: { not: SUPER_ADMIN_ROLE_NAME } },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { admins: true } },
        permissions: { include: { permission: true } },
      },
    });
  }

  /** Chi tiết một role — dùng khi fill form edit */
  async findOneRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: { select: { admins: true } },
        permissions: { include: { permission: true } },
      },
    });
    if (!role || role.name === SUPER_ADMIN_ROLE_NAME) throw new NotFoundException('Role not found');
    return role;
  }

  /** Tạo role mới */
  async createRole(dto: CreateRoleDto) {
    this.assertNotProtectedRoleName(dto.name);

    const exists = await this.prisma.role.findUnique({ where: { name: dto.name } });
    if (exists) throw new BadRequestException('Role name already exists');

    return this.prisma.role.create({
      data: {
        name: dto.name,
        description: dto.description,
        permissions: {
          create: dto.permissionIds.map((permissionId) => ({ permissionId })),
        },
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });
  }

  /** Cập nhật role — replace toàn bộ permissionIds nếu có */
  async updateRole(id: string, dto: UpdateRoleDto) {
    await this.findOneRole(id);
    if (dto.name) this.assertNotProtectedRoleName(dto.name);

    return this.prisma.$transaction(async (tx) => {
      await tx.role.update({
        where: { id },
        data: {
          ...(dto.name && { name: dto.name }),
          ...(dto.description !== undefined && { description: dto.description }),
        },
      });

      if (dto.permissionIds !== undefined) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        if (dto.permissionIds.length) {
          await tx.rolePermission.createMany({
            data: dto.permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
          });
        }

        // Invalidate permissions cache cho tất cả admin đang giữ role này
        const affected = await tx.adminRole.findMany({
          where: { roleId: id },
          select: { adminId: true },
        });
        await Promise.all(affected.map((a) => this.authCache.clearPermissions(a.adminId)));
      }

      return tx.role.findUnique({
        where: { id },
        include: {
          permissions: { include: { permission: true } },
          _count: { select: { admins: true } },
        },
      });
    });
  }

  /** Xóa role — không cho xóa nếu đang được gán cho admin */
  async removeRole(id: string) {
    await this.findOneRole(id);

    const inUse = await this.prisma.adminRole.count({ where: { roleId: id } });
    if (inUse > 0) {
      throw new BadRequestException('Cannot delete a role that is assigned to admins');
    }

    await this.prisma.role.delete({ where: { id } });
  }

  private assertNotProtectedRoleName(name: string) {
    if (name.trim() === SUPER_ADMIN_ROLE_NAME) {
      throw new BadRequestException('Cannot manage protected system role');
    }
  }
}
