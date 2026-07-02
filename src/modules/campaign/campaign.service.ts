import { Injectable, NotFoundException } from '@nestjs/common';

import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByTemplates(templateIds: string[], pageOptionsDto: PageOptionsDto) {
    const where = {
      templateId: {
        in: templateIds,
      },
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.campaign.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: {
          createdAt: pageOptionsDto.order,
        },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.campaign.count({ where }),
    ]);

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findOne(id: number) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
    });
    if (!campaign) throw new NotFoundException('Campaign not found');
    return campaign;
  }
}
