import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { UploadService } from '../upload/upload.service.js';
import { FlashSaleStatus, PricingMode, Prisma } from '../../generated/prisma/client.js';
import { mapActiveFlashSale } from '../flash-sale/active-flash-sale.util.js';
import { Order } from '../../common/dtos/page-options.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { ProductQueryDto, ProductSortBy, ProductStockStatus } from './dto/product-query.dto.js';
import { WebsiteProductQueryDto } from './dto/website-product-query.dto.js';

type ProductListItem = Prisma.ProductGetPayload<{
  include: {
    variants: {
      include: {
        flashSaleItems: {
          include: {
            flashSale: true;
          };
        };
      };
    };
    wholesaleUsers: {
      select: {
        userId: true;
      };
    };
  };
}>;

type ProductResponseOptions = {
  publicView?: boolean;
  viewerUserId?: number;
};

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(data: CreateProductDto) {
    const tierVariations = data.tierVariations
      ? (data.tierVariations as unknown as Prisma.InputJsonValue)
      : Prisma.JsonNull;
    const wholesaleEnabled = data.wholesaleEnabled === true;
    const wholesaleUserIds = this.normalizeWholesaleUserIds(wholesaleEnabled, data.wholesaleUserIds);

    this.validateWholesaleVariants(data.variants, wholesaleEnabled);
    await this.validateWholesaleUsers(this.prisma, wholesaleUserIds);

    return await this.prisma.product.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        detail: data.detail,
        image: data.image,
        videoUrl: data.videoUrl,
        videoThumbnail: data.videoThumbnail,
        source: data.source,
        warranty: data.warranty,
        warrantyType: data.warrantyType,
        tierVariations: tierVariations,
        fakeSold: data.fakeSold,
        wholesaleEnabled,
        ...(wholesaleEnabled && wholesaleUserIds.length
          ? {
              wholesaleUsers: {
                create: wholesaleUserIds.map((userId) => ({ userId })),
              },
            }
          : {}),
        variants: {
          create: data.variants.map((variant) => ({
            name: variant.name,
            basePrice: variant.basePrice,
            originalPrice: variant.originalPrice,
            wholesaleBasePrice: wholesaleEnabled ? variant.wholesaleBasePrice : undefined,
            wholesalePrice: wholesaleEnabled ? variant.wholesalePrice : undefined,
            wholesaleMinQuantity: wholesaleEnabled ? variant.wholesaleMinQuantity : undefined,
            packageWeightGrams: variant.packageWeightGrams ?? 0,
            packageLengthCm: variant.packageLengthCm,
            packageWidthCm: variant.packageWidthCm,
            packageHeightCm: variant.packageHeightCm,
            stock: variant.stock,
            image: variant.image,
            dimensions: variant.dimensions as unknown as Prisma.InputJsonValue,
          })),
        },
      },
      include: {
        variants: true,
        wholesaleUsers: { select: { userId: true } },
      },
    });
  }

  async findAll(pageOptionsDto: ProductQueryDto) {
    return this.listProducts(pageOptionsDto);
  }

  async findAllMiniapp(pageOptionsDto: ProductQueryDto) {
    return this.listProducts(pageOptionsDto, {
      publicView: true,
      viewerUserId: pageOptionsDto.userId,
    });
  }

  async findAllWebsite(pageOptionsDto: WebsiteProductQueryDto) {
    return this.listProducts(pageOptionsDto, {
      publicView: true,
      viewerUserId: pageOptionsDto.userId,
    });
  }

  private async listProducts(pageOptionsDto: ProductQueryDto, options: ProductResponseOptions = {}) {
    this.assertValidProductQuery(pageOptionsDto);

    const variantWhere = this.buildVariantWhere(pageOptionsDto);
    const where = this.buildProductWhere(pageOptionsDto, variantWhere);
    const variantIncludeWhere = this.hasVariantFilters(pageOptionsDto)
      ? variantWhere
      : { isDeleted: 0 };

    if (this.requiresInMemorySort(pageOptionsDto)) {
      const items = await this.prisma.product.findMany({
        where,
        include: {
          variants: this.buildVariantInclude(variantIncludeWhere),
          wholesaleUsers: { select: { userId: true } },
        },
      });
      const sortedItems = this.sortProductItems(items, pageOptionsDto);
      const paginatedItems = this.paginateProductItems(sortedItems, pageOptionsDto);
      const mappedItems = paginatedItems.map((item) => this.mapProductResponse(item, options));

      return new PageDto(
        mappedItems,
        new PageMetaDto({ itemCount: sortedItems.length, pageOptionsDto }),
      );
    }

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: this.buildProductOrderBy(pageOptionsDto),
        include: {
          variants: this.buildVariantInclude(variantIncludeWhere),
          wholesaleUsers: { select: { userId: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    const mappedItems = items.map((item) => this.mapProductResponse(item, options));

    return new PageDto(mappedItems, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  private buildVariantInclude(where: Prisma.VariantWhereInput) {
    const now = new Date();

    return {
      where,
      orderBy: { originalPrice: 'asc' as const },
      include: {
        flashSaleItems: {
          where: {
            flashSale: {
              status: FlashSaleStatus.Active,
              startTime: { lte: now },
              endTime: { gte: now },
              isDeleted: 0,
            },
          },
          include: { flashSale: true },
          orderBy: { id: 'asc' as const },
        },
      },
    };
  }

  private assertValidProductQuery(pageOptionsDto: ProductQueryDto) {
    if (
      pageOptionsDto.minPrice !== undefined &&
      pageOptionsDto.maxPrice !== undefined &&
      pageOptionsDto.minPrice > pageOptionsDto.maxPrice
    ) {
      throw new BadRequestException('Khoảng giá sản phẩm không hợp lệ');
    }
  }

  private buildProductWhere(
    pageOptionsDto: ProductQueryDto,
    variantWhere: Prisma.VariantWhereInput,
  ): Prisma.ProductWhereInput {
    return {
      isDeleted: 0,
      ...(pageOptionsDto.q ? { name: { contains: pageOptionsDto.q } } : {}),
      ...(pageOptionsDto.categoryId ? { categoryId: { has: pageOptionsDto.categoryId } } : {}),
      ...(this.hasVariantFilters(pageOptionsDto) ? { variants: { some: variantWhere } } : {}),
      ...(pageOptionsDto.excludeFlashSaleProducts
        ? {
            variants: {
              ...(this.hasVariantFilters(pageOptionsDto) ? { some: variantWhere } : {}),
              none: {
                isDeleted: 0,
                flashSaleItems: {
                  some: {
                    flashSale: {
                      isDeleted: 0,
                      ...(pageOptionsDto.excludeFlashSaleId
                        ? { id: { not: pageOptionsDto.excludeFlashSaleId } }
                        : {}),
                      status: { in: [FlashSaleStatus.Active, FlashSaleStatus.Upcoming] },
                    },
                  },
                },
              },
            },
          }
        : {}),
    };
  }

  private buildVariantWhere(pageOptionsDto: ProductQueryDto): Prisma.VariantWhereInput {
    const where: Prisma.VariantWhereInput = {
      isDeleted: 0,
    };

    if (pageOptionsDto.minPrice !== undefined || pageOptionsDto.maxPrice !== undefined) {
      where.originalPrice = {
        ...(pageOptionsDto.minPrice !== undefined ? { gte: pageOptionsDto.minPrice } : {}),
        ...(pageOptionsDto.maxPrice !== undefined ? { lte: pageOptionsDto.maxPrice } : {}),
      };
    }

    const stockStatus = this.resolveStockStatus(pageOptionsDto);
    const stockFilter: Prisma.IntFilter<'Variant'> = {};
    if (stockStatus === ProductStockStatus.IN_STOCK) {
      stockFilter.gt = 0;
    }
    if (stockStatus === ProductStockStatus.OUT_OF_STOCK) {
      stockFilter.lte = 0;
    }
    if (pageOptionsDto.minStock !== undefined) {
      stockFilter.gte = pageOptionsDto.minStock;
    }
    if (Object.keys(stockFilter).length) {
      where.stock = stockFilter;
    }

    return where;
  }

  private resolveStockStatus(pageOptionsDto: ProductQueryDto) {
    if (pageOptionsDto.inStock === true) return ProductStockStatus.IN_STOCK;
    if (pageOptionsDto.inStock === false) return ProductStockStatus.OUT_OF_STOCK;
    return pageOptionsDto.stockStatus ?? ProductStockStatus.ALL;
  }

  private hasVariantFilters(pageOptionsDto: ProductQueryDto) {
    return (
      pageOptionsDto.minPrice !== undefined ||
      pageOptionsDto.maxPrice !== undefined ||
      pageOptionsDto.minStock !== undefined ||
      pageOptionsDto.inStock !== undefined ||
      this.resolveStockStatus(pageOptionsDto) !== ProductStockStatus.ALL
    );
  }

  private resolveSortBy(pageOptionsDto: ProductQueryDto) {
    return pageOptionsDto.sort ?? pageOptionsDto.sortBy ?? ProductSortBy.CREATED_AT;
  }

  private buildProductOrderBy(
    pageOptionsDto: ProductQueryDto,
  ): Prisma.ProductOrderByWithRelationInput {
    const order = pageOptionsDto.order ?? Order.DESC;
    const sortBy = this.resolveSortBy(pageOptionsDto);

    if (sortBy === ProductSortBy.NAME) return { name: order };
    if (sortBy === ProductSortBy.SOLD) return { fakeSold: order };
    return { createdAt: order };
  }

  private requiresInMemorySort(pageOptionsDto: ProductQueryDto) {
    const sortBy = this.resolveSortBy(pageOptionsDto);
    return sortBy === ProductSortBy.PRICE || sortBy === ProductSortBy.STOCK;
  }

  private sortProductItems(items: ProductListItem[], pageOptionsDto: ProductQueryDto) {
    const orderMultiplier = (pageOptionsDto.order ?? Order.DESC) === Order.ASC ? 1 : -1;
    const sortBy = this.resolveSortBy(pageOptionsDto);

    return [...items].sort((a, b) => {
      if (sortBy === ProductSortBy.PRICE) {
        return (this.productMinPrice(a) - this.productMinPrice(b)) * orderMultiplier;
      }

      if (sortBy === ProductSortBy.STOCK) {
        return (this.productTotalStock(a) - this.productTotalStock(b)) * orderMultiplier;
      }

      return 0;
    });
  }

  private paginateProductItems(items: ProductListItem[], pageOptionsDto: ProductQueryDto) {
    if (!pageOptionsDto.take) return items;
    const start = pageOptionsDto.skip ?? 0;
    return items.slice(start, start + pageOptionsDto.take);
  }

  private productMinPrice(product: ProductListItem) {
    const prices = product.variants.map((variant) => Number(variant.originalPrice));
    return prices.length ? Math.min(...prices) : Number.MAX_SAFE_INTEGER;
  }

  private productTotalStock(product: ProductListItem) {
    return product.variants.reduce((total, variant) => total + variant.stock, 0);
  }

  private isWholesaleViewer(product: ProductListItem, viewerUserId?: number) {
    return Boolean(
      product.wholesaleEnabled &&
        viewerUserId &&
        product.wholesaleUsers.some((item) => item.userId === viewerUserId),
    );
  }

  private mapProductResponse(product: ProductListItem, options: ProductResponseOptions = {}) {
    const { wholesaleUsers, ...productData } = product;
    const isWholesale = options.publicView
      ? this.isWholesaleViewer(product, options.viewerUserId)
      : false;

    return {
      ...productData,
      pricingMode: isWholesale ? PricingMode.Wholesale : PricingMode.Retail,
      ...(!options.publicView
        ? { wholesaleUserIds: wholesaleUsers.map((item) => item.userId) }
        : {}),
      variants: product.variants.map((variant) =>
        this.mapVariantResponse(variant, { ...options, isWholesale }),
      ),
    };
  }

  private mapVariantResponse(
    variant: ProductListItem['variants'][number],
    options: ProductResponseOptions & { isWholesale?: boolean } = {},
  ) {
    const {
      flashSaleItems,
      wholesaleBasePrice,
      wholesalePrice,
      wholesaleMinQuantity,
      ...variantData
    } = variant;

    if (options.publicView) {
      if (options.isWholesale) {
        return {
          ...variantData,
          basePrice: wholesaleBasePrice ? Number(wholesaleBasePrice) : null,
          originalPrice: Number(wholesalePrice),
          pricingMode: PricingMode.Wholesale,
          minOrderQuantity: wholesaleMinQuantity ?? 1,
          activeFlashSale: null,
        };
      }

      return {
        ...variantData,
        pricingMode: PricingMode.Retail,
        minOrderQuantity: 1,
        activeFlashSale: mapActiveFlashSale(variant),
      };
    }

    return {
      ...variantData,
      wholesaleBasePrice,
      wholesalePrice,
      wholesaleMinQuantity,
      pricingMode: PricingMode.Retail,
      minOrderQuantity: 1,
      activeFlashSale: mapActiveFlashSale(variant),
    };
  }

  async findOne(id: number, options: ProductResponseOptions = {}) {
    const product = await this.prisma.product.findUnique({
      where: { id, isDeleted: 0 },
      include: {
        variants: this.buildVariantInclude({ isDeleted: 0 }),
        wholesaleUsers: { select: { userId: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return this.mapProductResponse(product, options);
  }

  // --- LOGIC UPDATE MỚI (SOFT DELETE) ---
  async update(id: number, dto: UpdateProductDto) {
    // 1. Lấy Product và các Variant ĐANG ACTIVE (isDeleted = 0)
    type ProductWithVariants = Prisma.ProductGetPayload<{
      include: { variants: true; wholesaleUsers: { select: { userId: true } } };
    }>;

    const product = (await this.prisma.product.findUnique({
      where: { id, isDeleted: 0 },
      include: {
        variants: {
          where: { isDeleted: 0 },
        },
        wholesaleUsers: { select: { userId: true } },
      },
    })) as ProductWithVariants;

    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.$transaction(async (tx) => {
      const wholesaleEnabled = dto.wholesaleEnabled ?? product.wholesaleEnabled;
      const wholesaleUserIds = this.normalizeWholesaleUserIds(
        wholesaleEnabled,
        dto.wholesaleUserIds ?? product.wholesaleUsers.map((item) => item.userId),
      );

      if (dto.variants) this.validateWholesaleVariants(dto.variants, wholesaleEnabled);
      await this.validateWholesaleUsers(tx, wholesaleUserIds);

      // BƯỚC 1: Update thông tin Product
      await tx.product.update({
        where: { id },
        data: {
          categoryId: dto.categoryId,
          name: dto.name,
          detail: dto.detail,
          image: dto.image ?? product.image,
          videoUrl: dto.videoUrl ?? product.videoUrl,
          videoThumbnail: dto.videoThumbnail ?? product.videoThumbnail,
          source: dto.source,
          fakeSold: dto.fakeSold,
          wholesaleEnabled,
          warranty: dto.warranty,
          warrantyType: dto.warrantyType,
          tierVariations: dto.tierVariations
            ? (dto.tierVariations as unknown as Prisma.InputJsonValue)
            : undefined,
        },
      });

      await tx.productWholesaleUser.deleteMany({ where: { productId: id } });
      if (wholesaleEnabled && wholesaleUserIds.length) {
        await tx.productWholesaleUser.createMany({
          data: wholesaleUserIds.map((userId) => ({ productId: id, userId })),
          skipDuplicates: true,
        });
      }

      // Xóa ảnh/video thừa không còn trong payload
      if (dto.image !== undefined) {
        const newImages = new Set(dto.image);
        for (const oldImg of product.image) {
          if (!newImages.has(oldImg)) {
            await this.uploadService.deleteImage(oldImg);
          }
        }
      }
      if (dto.videoUrl !== undefined && dto.videoUrl !== product.videoUrl && product.videoUrl) {
        await this.uploadService.deleteVideo(product.videoUrl);
      }

      // BƯỚC 2: Xử lý Variants (Upsert với Soft Delete)
      if (dto.variants) {
        const currentVariantIds = product.variants.map((v) => v.id);
        const incomingVariantIds = dto.variants.filter((v) => v.id).map((v) => v.id);

        // A. SOFT DELETE: Có trong DB (active) nhưng không gửi lên
        const idsToDelete = currentVariantIds.filter((id) => !incomingVariantIds.includes(id));

        if (idsToDelete.length > 0) {
          await tx.variant.updateMany({
            where: {
              id: { in: idsToDelete },
              productId: id,
            },
            data: {
              isDeleted: 1,
            },
          });
        }

        // B. UPDATE & CREATE
        for (const v of dto.variants) {
          if (v.id) {
            // Case 1: Update
            if (!currentVariantIds.includes(v.id)) {
              throw new BadRequestException(`Variant ID ${v.id} invalid`);
            }

            await tx.variant.update({
              where: { id: v.id },
              data: {
                name: v.name,
                basePrice: v.basePrice,
                originalPrice: v.originalPrice,
                wholesaleBasePrice: wholesaleEnabled ? v.wholesaleBasePrice : null,
                wholesalePrice: wholesaleEnabled ? v.wholesalePrice : null,
                wholesaleMinQuantity: wholesaleEnabled ? v.wholesaleMinQuantity : null,
                packageWeightGrams: v.packageWeightGrams,
                packageLengthCm: v.packageLengthCm,
                packageWidthCm: v.packageWidthCm,
                packageHeightCm: v.packageHeightCm,
                stock: v.stock,
                image: v.image,
                dimensions: v.dimensions
                  ? (v.dimensions as unknown as Prisma.InputJsonValue)
                  : undefined,
              },
            });
          } else {
            // Case 2: Create New
            await tx.variant.create({
              data: {
                productId: id,
                name: v.name ?? '',
                basePrice: Number(v.basePrice || 0),
                originalPrice: Number(v.originalPrice),
                wholesaleBasePrice: wholesaleEnabled ? v.wholesaleBasePrice : undefined,
                wholesalePrice: wholesaleEnabled ? v.wholesalePrice : undefined,
                wholesaleMinQuantity: wholesaleEnabled ? v.wholesaleMinQuantity : undefined,
                packageWeightGrams: v.packageWeightGrams ?? 0,
                packageLengthCm: v.packageLengthCm,
                packageWidthCm: v.packageWidthCm,
                packageHeightCm: v.packageHeightCm,
                stock: v.stock ?? 0,
                image: v.image,
                dimensions: v.dimensions
                  ? (v.dimensions as unknown as Prisma.InputJsonValue)
                  : undefined,
                isDeleted: 0,
              },
            });
          }
        }
      }

      // Return kết quả (Chỉ trả về các variant còn active)
      return await tx.product.findUnique({
        where: { id },
        include: {
          variants: {
            where: { isDeleted: 0 },
          },
          wholesaleUsers: { select: { userId: true } },
        },
      });
    });
  }


  private normalizeWholesaleUserIds(enabled: boolean, userIds?: number[]) {
    if (!enabled) return [];
    const ids = [...new Set((userIds ?? []).map(Number).filter((id) => Number.isInteger(id) && id > 0))];
    if (!ids.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất một khách hàng được áp dụng giá sỉ');
    }
    return ids;
  }

  private async validateWholesaleUsers(
    tx: Pick<Prisma.TransactionClient, 'user'> | PrismaService,
    userIds: number[],
  ) {
    if (!userIds.length) return;
    const count = await tx.user.count({ where: { id: { in: userIds }, isActive: true } });
    if (count !== userIds.length) {
      throw new BadRequestException('Danh sách khách hàng áp dụng giá sỉ không hợp lệ');
    }
  }

  private validateWholesaleVariants(
    variants: Array<{
      name?: string;
      wholesaleBasePrice?: number;
      wholesalePrice?: number;
      wholesaleMinQuantity?: number;
    }>,
    enabled: boolean,
  ) {
    if (!enabled) return;

    for (const variant of variants) {
      const label = variant.name || 'Biến thể';
      const wholesalePrice = Number(variant.wholesalePrice ?? 0);
      const wholesaleBasePrice = Number(variant.wholesaleBasePrice ?? 0);
      const wholesaleMinQuantity = Number(variant.wholesaleMinQuantity ?? 0);

      if (!Number.isFinite(wholesalePrice) || wholesalePrice <= 0) {
        throw new BadRequestException(`${label} cần có giá bán sỉ lớn hơn 0`);
      }
      if (wholesaleBasePrice > 0 && wholesaleBasePrice <= wholesalePrice) {
        throw new BadRequestException(`${label} có giá gạch ngang sỉ phải lớn hơn giá bán sỉ`);
      }
      if (!Number.isInteger(wholesaleMinQuantity) || wholesaleMinQuantity < 1) {
        throw new BadRequestException(`${label} cần số lượng tối thiểu sỉ từ 1 trở lên`);
      }
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.$transaction(async (tx) => {
      // 1. Soft delete Variants
      await tx.variant.updateMany({
        where: { productId: id },
        data: { isDeleted: 1 },
      });

      // 2. Soft delete Product
      return await tx.product.update({
        where: { id },
        data: { isDeleted: 1 },
      });
    });
  }
}
