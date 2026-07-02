import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, pageOptionsDto: PageOptionsDto) {
    const where = { userId, isDeleted: 0 };
    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.address.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { id: pageOptionsDto.order },
      }),
      this.prisma.address.count({ where }),
    ]);

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async create(userId: number, data: CreateAddressDto) {
    if (!userId) throw new BadRequestException('User ID required');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { userId: _ignoredUserId, ...payload } = data;

    return this.prisma.address.create({
      data: {
        ...payload,
        userId,
      },
    });
  }

  async update(id: number, userId: number, data: UpdateAddressDto) {
    const address = await this.prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found or does not belong to user');
    }

    const { userId: _ignoredUserId, ...payload } = data;

    return this.prisma.address.update({
      where: { id },
      data: payload,
    });
  }

  async remove(id: number, userId: number) {
    const address = await this.prisma.address.findUnique({ where: { id } });

    if (!address || address.userId !== userId) {
      throw new NotFoundException('Address not found or does not belong to user');
    }

    return this.prisma.address.update({
      where: { id },
      data: { isDeleted: 1 },
    });
  }
}
