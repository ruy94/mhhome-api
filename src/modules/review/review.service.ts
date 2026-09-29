import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';

import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BulkCreateReviewDto } from './dto/bulk-create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
import { ReviewQueryDto } from './dto/review-query.dto.js';
import { UploadService } from '../upload/upload.service.js';
import { MarketplaceCatalogService } from '../marketplace/marketplace-catalog.service.js';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly marketplaceCatalog: MarketplaceCatalogService,
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

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.review.createMany({ data, skipDuplicates: false });
      await this.marketplaceCatalog.recordProductChanges(
        tx,
        data.map((review) => review.productId),
      );
      return created;
    });
  }

  async update(id: number, dto: UpdateReviewDto) {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review not found`);
    }

    const nextCustomerAvatar =
      dto.customerAvatar === '' ? null : (dto.customerAvatar ?? existingReview.customerAvatar);
    const nextImages = dto.image ?? existingReview.image;
    const nextVideoUrl = dto.videoUrl === '' ? null : (dto.videoUrl ?? existingReview.videoUrl);
    const nextVideoThumbnail =
      dto.videoThumbnail === '' ? null : (dto.videoThumbnail ?? existingReview.videoThumbnail);

    const updatedReview = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.review.update({
        where: { id },
        data: {
          ...dto,
          customerAvatar: nextCustomerAvatar,
          image: nextImages,
          videoUrl: nextVideoUrl,
          videoThumbnail: nextVideoThumbnail,
        },
      });
      await this.marketplaceCatalog.recordProductChanges(tx, [existingReview.productId]);
      return updated;
    });

    const removedImages = existingReview.image.filter((image) => !new Set(nextImages).has(image));
    if (existingReview.customerAvatar && existingReview.customerAvatar !== nextCustomerAvatar) {
      removedImages.push(existingReview.customerAvatar);
    }
    await Promise.all(
      [...new Set(removedImages)].map((image) => this.uploadService.enqueueImageCleanup(image)),
    );
    if (existingReview.videoUrl && existingReview.videoUrl !== nextVideoUrl) {
      await this.uploadService.enqueueVideoCleanup(existingReview.videoUrl);
    }
    return updatedReview;
  }

  async remove(id: number) {
    const existingReview = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      throw new NotFoundException(`Review not found`);
    }

    const deletedReview = await this.prisma.$transaction(async (tx) => {
      const deleted = await tx.review.delete({
        where: { id },
      });
      await this.marketplaceCatalog.recordProductChanges(tx, [existingReview.productId]);
      return deleted;
    });

    await Promise.all(
      [existingReview.customerAvatar, ...existingReview.image]
        .filter((image): image is string => Boolean(image))
        .map((image) => this.uploadService.enqueueImageCleanup(image)),
    );
    await this.uploadService.enqueueVideoCleanup(existingReview.videoUrl ?? undefined);
    return deletedReview;
  }
}
