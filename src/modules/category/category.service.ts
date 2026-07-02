import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { UploadService } from '../upload/upload.service.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(pageOptionsDto: PageOptionsDto) {
    const result = await this.findAllWithProductCount(pageOptionsDto);
    return new PageDto(result.items, new PageMetaDto({ itemCount: result.itemCount, pageOptionsDto }));
  }

  async findAllMiniapp(pageOptionsDto: PageOptionsDto) {
    const result = await this.findAllWithProductCount(pageOptionsDto);
    const items = result.items.map((category) => this.mapMiniappCategory(category));
    return new PageDto(items, new PageMetaDto({ itemCount: result.itemCount, pageOptionsDto }));
  }

  async findAllWebsite(pageOptionsDto: PageOptionsDto) {
    const result = await this.findAllWithProductCount(pageOptionsDto);
    const items = result.items.map((category) => this.mapWebsiteCategory(category));
    return new PageDto(items, new PageMetaDto({ itemCount: result.itemCount, pageOptionsDto }));
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id, isDeleted: 0 },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(data: CreateCategoryDto) {
    return await this.prisma.category.create({
      data,
    });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id, isDeleted: 0 },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const nextImage = dto.image ?? category.image;
    const nextWebsiteImage = dto.websiteImage ?? category.websiteImage;

    return this.prisma.$transaction(async (tx) => {
      const updatedCategory = await tx.category.update({
        where: { id },
        data: {
          name: dto.name,
          image: nextImage,
          websiteImage: nextWebsiteImage,
        },
      });

      await this.deleteRemovedImages(
        [category.image, category.websiteImage],
        [nextImage, nextWebsiteImage],
      );

      return updatedCategory;
    });
  }

  async remove(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return await this.prisma.category.update({
      where: {
        id,
      },
      data: {
        isDeleted: 1,
      },
    });
  }

  private async findAllWithProductCount(pageOptionsDto: PageOptionsDto) {
    const where = {
      isDeleted: 0,
      ...(pageOptionsDto.q ? { name: { contains: pageOptionsDto.q } } : {}),
    };

    const [categories, itemCount] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      }),
      this.prisma.category.count({ where }),
    ]);

    const products = await this.prisma.product.findMany({
      where: { isDeleted: 0 },
      select: { categoryId: true },
    });

    const productCountByCategory = products.reduce((acc, product) => {
      for (const categoryId of product.categoryId) {
        acc.set(categoryId, (acc.get(categoryId) ?? 0) + 1);
      }
      return acc;
    }, new Map<number, number>());

    const items = categories.map((category) => ({
      ...category,
      productCount: productCountByCategory.get(category.id) ?? 0,
    }));

    return { items, itemCount };
  }

  private mapMiniappCategory<T extends { websiteImage: string }>(category: T) {
    const { websiteImage: _websiteImage, ...rest } = category;
    return rest;
  }

  private mapWebsiteCategory<T>(category: T) {
    return category;
  }

  private async deleteRemovedImages(oldImages: string[], nextImages: string[]) {
    const nextImageSet = new Set(nextImages.filter(Boolean));
    const removedImages = [...new Set(oldImages.filter(Boolean))].filter(
      (image) => !nextImageSet.has(image),
    );

    await Promise.all(removedImages.map((image) => this.uploadService.deleteImage(image)));
  }
}
