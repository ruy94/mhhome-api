import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BulkCreateReviewDto } from './dto/bulk-create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';
import { UploadService } from '../upload/upload.service.js';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async findReviewsByProduct(productId: number, pageOptionsDto: ReviewQueryDto) {
    const where: Prisma.ReviewWhereInput = { productId };
    const ratingValues = pageOptionsDto.ratingValues;

    if (ratingValues.length) {
      where.rating = { in: ratingValues };
    }

    if (pageOptionsDto.hasMedia) {
      where.OR = [{ image: { isEmpty: false } }, { videoUrl: { not: null } }];
    }

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.review.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { createdAt: pageOptionsDto.order },
      }),
      this.prisma.review.count({ where }),
    ]);

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Review not found`);
    }
    return review;
  }

  async bulkCreateReviews(dto: BulkCreateReviewDto) {
    const data = dto.reviews.map((review) => ({
      productId: review.productId,
      customerName: review.customerName,
      customerAvatar: review.customerAvatar,
      rating: review.rating,
      comment: review.comment,
      image: review.image ?? [],
      videoUrl: review.videoUrl,
      videoThumbnail: review.videoThumbnail,
      createdAt: review.createdAt,
    }));

    return await this.prisma.review.createMany({
      data,
      skipDuplicates: false,
    });
  }

  async update(id: number, dto: UpdateReviewDto) {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.review.update({
        where: { id },
        data: {
          ...dto,
          customerAvatar: dto.customerAvatar ?? existingReview.customerAvatar,
          image: dto.image ?? existingReview.image,
          videoUrl: dto.videoUrl ?? existingReview.videoUrl,
        },
      });
      if (dto.customerAvatar && dto.customerAvatar !== existingReview.customerAvatar) {
        if (existingReview.customerAvatar) {
          await this.uploadService.deleteImage(existingReview.customerAvatar);
        }
      }
      if (dto.image !== undefined) {
        const newImages = new Set(dto.image);
        for (const oldImg of existingReview.image) {
          if (!newImages.has(oldImg)) {
            await this.uploadService.deleteImage(oldImg);
          }
        }
      }
      if (
        dto.videoUrl !== undefined &&
        dto.videoUrl !== existingReview.videoUrl &&
        existingReview.videoUrl
      ) {
        await this.uploadService.deleteVideo(existingReview.videoUrl);
      }
      return await tx.review.findUnique({
        where: { id },
      });
    });
  }

  async remove(id: number) {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      if (existingReview.customerAvatar) {
        await this.uploadService.deleteImage(existingReview.customerAvatar);
      }
      if (existingReview.image && existingReview.image.length > 0) {
        for (const imgPath of existingReview.image) await this.uploadService.deleteImage(imgPath);
      }
      if (existingReview.videoUrl) {
        await this.uploadService.deleteVideo(existingReview.videoUrl);
      }
      return await tx.review.delete({
        where: { id },
      });
    });
  }
}
