import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

import marketplaceConfig from '../../config/marketplace.config.js';
import {
  MarketplaceOutboxEventType,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { MarketplaceSnapshotQueryDto } from './dto/marketplace-catalog-query.dto.js';

const PRODUCT_SNAPSHOT_INCLUDE = {
  variants: {
    where: { isDeleted: 0 },
    orderBy: { id: 'asc' as const },
  },
} as const;

type ProductSnapshotRecord = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_SNAPSHOT_INCLUDE;
}>;

@Injectable()
export class MarketplaceCatalogService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(marketplaceConfig.KEY)
    private readonly config: ConfigType<typeof marketplaceConfig>,
  ) {}

  isEnabled(): boolean {
    return this.config.enabled;
  }

  async recordProductChanges(
    tx: Prisma.TransactionClient,
    productIds: Iterable<number>,
    eventType: MarketplaceOutboxEventType = MarketplaceOutboxEventType.ProductUpsert,
  ) {
    if (!this.config.enabled) return;

    const orderedProductIds = [...new Set(productIds)].sort((left, right) => left - right);
    for (const productId of orderedProductIds) {
      const product = await tx.product.update({
        where: { id: productId },
        data: { marketplaceSequence: { increment: 1 } },
        include: PRODUCT_SNAPSHOT_INCLUDE,
      });
      const enrichment = await this.getEnrichment(tx, [productId]);
      const payload = this.toSnapshot(product, enrichment.get(productId));
      await tx.marketplaceOutboxLog.create({
        data: {
          productId,
          eventType,
          sequence: product.marketplaceSequence,
          payload: payload as unknown as Prisma.InputJsonValue,
        },
      });
    }
  }

  async getSnapshot(query: MarketplaceSnapshotQueryDto) {
    const cursor = this.decodeCursor(query.cursor);
    const syncToken = cursor?.syncToken ?? randomUUID();
    const { products, total, enrichment } = await this.prisma.$transaction(async (tx) => {
      const [products, total] = await Promise.all([
        tx.product.findMany({
        where: {
          isDeleted: 0,
          ...(cursor ? { id: { gt: cursor.lastId } } : {}),
        },
        include: PRODUCT_SNAPSHOT_INCLUDE,
        orderBy: { id: 'asc' },
        take: query.limit + 1,
        }),
        tx.product.count({ where: { isDeleted: 0 } }),
      ]);
      return {
        products,
        total,
        enrichment: await this.getEnrichment(tx, products.map((product) => product.id)),
      };
    });
    const hasMore = products.length > query.limit;
    const pageItems = products.slice(0, query.limit);
    const lastItem = pageItems.at(-1);

    return {
      syncToken,
      items: pageItems.map((product) => this.toSnapshot(product, enrichment.get(product.id))),
      nextCursor:
        hasMore && lastItem
          ? this.encodeCursor({ lastId: lastItem.id, syncToken })
          : null,
      hasMore,
      total,
    };
  }

  resolveMedia(value: string | null | undefined, kind: 'image' | 'video' | 'thumbnail') {
    if (!value) return null;
    const baseUrl = kind === 'video'
      ? this.config.media.videoBaseUrl
      : kind === 'thumbnail'
        ? this.config.media.thumbnailBaseUrl
        : this.config.media.imageBaseUrl;
    return this.resolveMediaUrl(value, baseUrl);
  }

  private toSnapshot(
    product: ProductSnapshotRecord,
    enrichment?: {
      reviewSummary: { average: number; total: number };
      reviewPreview: Array<Record<string, unknown>>;
      zaloVideos: Array<Record<string, unknown>>;
    },
  ) {
    return {
      sourceProductId: String(product.id),
      name: product.name,
      detail: product.detail,
      images: product.image.map((image) => this.resolveMediaUrl(image, this.config.media.imageBaseUrl)),
      videoUrl: this.resolveNullableMediaUrl(product.videoUrl, this.config.media.videoBaseUrl),
      videoThumbnail: this.resolveNullableMediaUrl(
        product.videoThumbnail,
        this.config.media.thumbnailBaseUrl,
      ),
      sourceLabel: product.source,
      tierVariations: product.tierVariations,
      categorySnapshots: product.categoryId.map((id) => ({ id })),
      isActive: product.isDeleted === 0,
      sequence: product.marketplaceSequence,
      sourceUpdatedAt: null,
      reviewSummary: enrichment?.reviewSummary ?? { average: 0, total: 0 },
      reviewPreview: enrichment?.reviewPreview ?? [],
      zaloVideos: enrichment?.zaloVideos ?? [],
      variants: product.variants.map((variant) => ({
        sourceVariantId: String(variant.id),
        sku: variant.saleworkProductCode,
        name: variant.name,
        image: this.resolveNullableMediaUrl(variant.image, this.config.media.imageBaseUrl),
        retailPrice: variant.originalPrice.toString(),
        compareAtPrice: variant.basePrice?.toString() ?? null,
        stock: variant.stock,
        dimensions: variant.dimensions,
        packageWeightGrams: variant.packageWeightGrams,
        packageLengthCm: variant.packageLengthCm?.toString() ?? null,
        packageWidthCm: variant.packageWidthCm?.toString() ?? null,
        packageHeightCm: variant.packageHeightCm?.toString() ?? null,
        isActive: variant.isDeleted === 0,
        sourceUpdatedAt: null,
      })),
    };
  }

  private resolveNullableMediaUrl(value: string | null, baseUrl: string): string | null {
    return value ? this.resolveMediaUrl(value, baseUrl) : null;
  }

  private async getEnrichment(tx: Prisma.TransactionClient, productIds: number[]) {
    const result = new Map<number, {
      reviewSummary: { average: number; total: number };
      reviewPreview: Array<Record<string, unknown>>;
      zaloVideos: Array<Record<string, unknown>>;
    }>();
    if (!productIds.length) return result;

    const [reviewStats, reviews, videos] = await Promise.all([
      tx.review.groupBy({
        by: ['productId'],
        where: { productId: { in: productIds } },
        _count: { _all: true },
        _avg: { rating: true },
      }),
      tx.review.findMany({
        where: { productId: { in: productIds } },
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          productId: true,
          customerName: true,
          customerAvatar: true,
          rating: true,
          comment: true,
          image: true,
          videoUrl: true,
          videoThumbnail: true,
          createdAt: true,
        },
      }),
      tx.zaloVideo.findMany({
        where: { productId: { in: productIds }, isDeleted: 0 },
        orderBy: { id: 'desc' },
      }),
    ]);

    for (const productId of productIds) {
      const stat = reviewStats.find((item) => item.productId === productId);
      result.set(productId, {
        reviewSummary: {
          average: Number((stat?._avg.rating ?? 0).toFixed(1)),
          total: stat?._count._all ?? 0,
        },
        reviewPreview: reviews
          .filter((review) => review.productId === productId && review.rating !== null)
          .slice(0, 3)
          .map((review) => ({
            sourceReviewId: String(review.id),
            customerName: review.customerName?.trim() || 'Khách hàng',
            customerAvatar: this.resolveMedia(review.customerAvatar, 'image'),
            rating: Number(review.rating),
            comment: review.comment ?? '',
            images: review.image
              .map((value) => this.resolveMedia(value, 'image'))
              .filter((value): value is string => Boolean(value)),
            videoUrl: this.resolveMedia(review.videoUrl, 'video'),
            videoThumbnail: this.resolveMedia(review.videoThumbnail, 'thumbnail'),
            createdAt: review.createdAt.toISOString(),
          })),
        zaloVideos: videos
          .filter((video) => video.productId === productId && Boolean(video.videoUrl))
          .slice(0, 5)
          .map((video) => ({
            sourceVideoId: String(video.id),
            title: video.title ?? '',
            videoUrl: this.resolveMedia(video.videoUrl, 'video'),
            videoThumbnail: this.resolveMedia(video.videoThumbnail, 'thumbnail'),
          })),
      });
    }
    return result;
  }

  private resolveMediaUrl(value: string, baseUrl: string): string {
    if (/^https?:\/\//i.test(value)) return value;
    return `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`;
  }

  private encodeCursor(cursor: { lastId: number; syncToken: string }): string {
    return Buffer.from(JSON.stringify(cursor)).toString('base64url');
  }

  private decodeCursor(value?: string): { lastId: number; syncToken: string } | null {
    if (!value) return null;
    try {
      const parsed = JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as {
        lastId?: unknown;
        syncToken?: unknown;
      };
      if (
        !Number.isInteger(parsed.lastId) ||
        Number(parsed.lastId) < 1 ||
        typeof parsed.syncToken !== 'string' ||
        !parsed.syncToken
      ) {
        throw new Error();
      }
      return { lastId: Number(parsed.lastId), syncToken: parsed.syncToken };
    } catch {
      throw new BadRequestException('Marketplace catalog cursor không hợp lệ');
    }
  }
}
