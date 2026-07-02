import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto.js';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DiscountType, FlashSaleStatus, Prisma } from '../../generated/prisma/client.js';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';

// 1. Import các hàm cần thiết từ date-fns
import { isBefore, isAfter, isEqual, differenceInSeconds } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const TZ_VN = 'Asia/Ho_Chi_Minh';

// Định nghĩa lại Type cho Prisma Response
type FlashSaleWithRelations = Prisma.FlashSaleGetPayload<{
  include: {
    items: {
      include: {
        variant: {
          select: {
            id: true;
            name: true;
            originalPrice: true;
            image: true;
            stock: true; // Nên lấy thêm stock để FE biết
            dimensions: true; // <--- THÊM DÒNG NÀY (Lấy JSONB dimensions)
            product: {
              select: {
                id: true;
                name: true;
                image: true;
                tierVariations: true;
              }; // <--- THÊM tierVariations (Optional: nếu muốn hiện full option ở card)
            };
          };
        };
      };
    };
  };
}>;

type FlashSaleItemPayload = CreateFlashSaleDto['items'][number];

type VariantForValidation = {
  id: number;
  productId: number;
  originalPrice: Prisma.Decimal;
  stock: number;
};

@Injectable()
export class FlashSaleService {
  private readonly logger = new Logger(FlashSaleService.name);

  constructor(private readonly prisma: PrismaService) {}

  private readonly adminInclude = {
    items: {
      orderBy: { id: 'asc' as const },
      include: {
        variant: {
          select: {
            id: true,
            name: true,
            originalPrice: true,
            image: true,
            stock: true,
            dimensions: true,
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                tierVariations: true,
              },
            },
          },
        },
      },
    },
  };

  async create(dto: CreateFlashSaleDto) {
    // DTO đã convert sang Date object chuẩn nhờ class-transformer
    const { variants } = await this.validateFlashSalePayload(dto);

    // 4. Create
    return await this.prisma.flashSale.create({
      data: {
        title: dto.title,
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: FlashSaleStatus.Upcoming,
        items: {
          create: dto.items.map((item) => ({
            variantId: item.variantId,
            discountType: item.discountType,
            discountPercent: item.discountPercent,
            salePrice: item.salePrice,
            saleStock: item.saleStock,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const flashSale = await this.prisma.flashSale.findUnique({
      where: { id, isDeleted: 0 },
      include: this.adminInclude,
    });

    if (!flashSale) throw new NotFoundException('FlashSale not found');
    return this.mapFlashSaleResponse(flashSale as FlashSaleWithRelations);
  }

  async update(id: number, dto: UpdateFlashSaleDto) {
    const existing = await this.prisma.flashSale.findUnique({
      where: { id, isDeleted: 0 },
      include: { items: true },
    });

    if (!existing) throw new NotFoundException('FlashSale not found');
    if (existing.status === FlashSaleStatus.Ended) {
      throw new BadRequestException('Không thể chỉnh sửa chương trình Flash Sale đã kết thúc');
    }
    if (!dto.title || !dto.startTime || !dto.endTime || !dto.items?.length) {
      throw new BadRequestException('Thiếu thông tin cập nhật Flash Sale');
    }

    await this.validateFlashSalePayload(dto as CreateFlashSaleDto, {
      excludeId: id,
      status: existing.status,
      existingItems: existing.items,
    });

    const payloadVariantIds = dto.items.map((item) => item.variantId);
    const payloadVariantIdSet = new Set(payloadVariantIds);

    if (existing.status === FlashSaleStatus.Active) {
      const removedSoldItem = existing.items.find(
        (item) => item.sold > 0 && !payloadVariantIdSet.has(item.variantId),
      );
      if (removedSoldItem) {
        throw new BadRequestException(
          `Không thể bỏ SKU ID ${removedSoldItem.variantId} vì đã bán ${removedSoldItem.sold} sản phẩm`,
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.flashSale.update({
        where: { id },
        data: {
          title: dto.title,
          startTime: dto.startTime,
          endTime: dto.endTime,
        },
      });

      await tx.flashSaleItem.deleteMany({
        where: {
          flashSaleId: id,
          variantId: { notIn: payloadVariantIds },
          sold: 0,
        },
      });

      for (const item of dto.items ?? []) {
        const currentItem = existing.items.find((entry) => entry.variantId === item.variantId);
        const data = {
          discountType: item.discountType,
          discountPercent: item.discountType === DiscountType.Percentage ? item.discountPercent : null,
          salePrice: item.discountType === DiscountType.Fixed ? item.salePrice : null,
          saleStock: item.saleStock,
        };

        if (currentItem) {
          await tx.flashSaleItem.update({
            where: { id: currentItem.id },
            data,
          });
        } else {
          await tx.flashSaleItem.create({
            data: {
              flashSaleId: id,
              variantId: item.variantId,
              ...data,
            },
          });
        }
      }
    });

    return await this.findOne(id);
  }

  async getFlashSales(pageOptionsDto: PageOptionsDto) {
    const where = {
      isDeleted: 0,
      ...(pageOptionsDto.q ? { title: { contains: pageOptionsDto.q } } : {}),
    };

    const [flashSales, itemCount] = await this.prisma.$transaction([
      this.prisma.flashSale.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { startTime: pageOptionsDto.order },
        include: this.adminInclude,
      }),
      this.prisma.flashSale.count({ where }),
    ]);

    const items = flashSales.map((fs) => this.mapFlashSaleResponse(fs as FlashSaleWithRelations));

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async getActiveFlashSale(userId?: number) {
    const now = new Date();
    const activeSale = await this.prisma.flashSale.findFirst({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
        status: FlashSaleStatus.Active,
        isDeleted: 0,
      },
      include: {
        items: {
          include: {
            variant: {
              select: {
                id: true,
                name: true,
                originalPrice: true,
                image: true,
                stock: true,
                dimensions: true, // <--- LẤY DIMENSIONS
                product: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                    tierVariations: true,
                    wholesaleEnabled: true,
                    wholesaleUsers: {
                      where: { userId: userId ?? 0 },
                      select: { userId: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!activeSale) return null;
    return this.mapFlashSaleResponse(activeSale as FlashSaleWithRelations, userId);
  }

  private async validateFlashSalePayload(
    dto: CreateFlashSaleDto,
    options: {
      excludeId?: number;
      status?: FlashSaleStatus;
      existingItems?: Array<{ variantId: number; sold: number }>;
    } = {},
  ) {
    const start = dto.startTime;
    const end = dto.endTime;
    const now = new Date();

    // 1. Validate Thời gian
    // Logic: Start >= End
    if (isAfter(start, end) || isEqual(start, end)) {
      throw new BadRequestException('Thời gian kết thúc phải sau thời gian bắt đầu');
    }
    // Logic: End < Now
    if (isBefore(end, now)) {
      throw new BadRequestException('Không thể tạo Flash Sale trong quá khứ');
    }
    if (options.status === FlashSaleStatus.Upcoming && isBefore(start, now)) {
      throw new BadRequestException('Không thể đặt thời gian bắt đầu trong quá khứ');
    }

    if (!dto.items?.length) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 SKU Flash Sale');
    }

    const variantIds = dto.items.map((item) => item.variantId);
    const uniqueVariantIds = new Set(variantIds);
    if (uniqueVariantIds.size !== variantIds.length) {
      throw new BadRequestException('Danh sách SKU Flash Sale bị trùng');
    }

    // 2. Kiểm tra chồng chéo (Overlap)
    // Prisma dùng Date object native nên truyền thẳng vào
    const overlappingSale = await this.prisma.flashSale.findFirst({
      where: {
        isDeleted: 0,
        ...(options.excludeId ? { id: { not: options.excludeId } } : {}),
        status: { in: [FlashSaleStatus.Active, FlashSaleStatus.Upcoming] },
        AND: [{ startTime: { lt: end } }, { endTime: { gt: start } }],
      },
    });

    if (overlappingSale) {
      // Format giờ VN để báo lỗi cho user
      const sTime = formatInTimeZone(overlappingSale.startTime, TZ_VN, 'HH:mm dd/MM');
      const eTime = formatInTimeZone(overlappingSale.endTime, TZ_VN, 'HH:mm dd/MM');

      throw new BadRequestException(
        `Trùng lịch với chương trình: "${overlappingSale.title}" (${sTime} - ${eTime})`,
      );
    }

    // 3. Validate Variants & Price
    const variants = await this.prisma.variant.findMany({
      where: { id: { in: variantIds }, isDeleted: 0 },
      select: { id: true, productId: true, originalPrice: true, stock: true },
    });

    if (variants.length !== variantIds.length) {
      throw new BadRequestException('Một số sản phẩm không tồn tại hoặc đã bị xóa');
    }

    await this.validateProductsNotInOtherRunningFlashSales(variants, options.excludeId);
    this.validateFlashSaleItems(dto.items, variants, options.existingItems);

    return { variants };
  }

  private async validateProductsNotInOtherRunningFlashSales(
    variants: VariantForValidation[],
    excludeId?: number,
  ) {
    const productIds = [...new Set(variants.map((variant) => variant.productId))];
    if (!productIds.length) return;

    const conflictingItem = await this.prisma.flashSaleItem.findFirst({
      where: {
        flashSale: {
          isDeleted: 0,
          ...(excludeId ? { id: { not: excludeId } } : {}),
          status: { in: [FlashSaleStatus.Active, FlashSaleStatus.Upcoming] },
        },
        variant: {
          isDeleted: 0,
          productId: { in: productIds },
        },
      },
      include: {
        flashSale: true,
        variant: {
          select: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!conflictingItem) return;

    throw new BadRequestException(
      `Sản phẩm "${conflictingItem.variant.product.name}" đang thuộc chương trình Flash Sale "${conflictingItem.flashSale.title}"`,
    );
  }

  private validateFlashSaleItems(
    items: FlashSaleItemPayload[],
    variants: VariantForValidation[],
    existingItems?: Array<{ variantId: number; sold: number }>,
  ) {
    for (const item of items) {
      const variant = variants.find((v) => v.id === item.variantId);
      if (!variant) continue;

      const originalPrice = Number(variant.originalPrice);
      const existingItem = existingItems?.find((entry) => entry.variantId === item.variantId);

      if (item.saleStock > variant.stock) {
        throw new BadRequestException(
          `Sản phẩm ID ${item.variantId} chỉ còn ${variant.stock} tồn kho (Yêu cầu ${item.saleStock})`,
        );
      }
      if (existingItem && existingItem.sold > item.saleStock) {
        throw new BadRequestException(
          `Sản phẩm ID ${item.variantId} đã bán ${existingItem.sold}, số lượng sale không được nhỏ hơn số đã bán`,
        );
      }

      if (item.discountType === DiscountType.Percentage) {
        if (!item.discountPercent || item.discountPercent <= 0 || item.discountPercent >= 100) {
          throw new BadRequestException(`Sản phẩm ID ${item.variantId} phải giảm từ 1% đến 99%`);
        }
        continue;
      }

      if (!item.salePrice) {
        throw new BadRequestException(`Sản phẩm ID ${item.variantId} thiếu giá Sale`);
      }
      if (item.salePrice >= originalPrice) {
        throw new BadRequestException(
          `Giá Sale (${item.salePrice}) phải nhỏ hơn giá gốc (${originalPrice})`,
        );
      }
    }
  }

  // --- HELPER METHODS ---
  private mapFlashSaleResponse(fs: FlashSaleWithRelations, viewerUserId?: number) {
    return {
      id: fs.id,
      title: fs.title,
      startTime: fs.startTime,
      endTime: fs.endTime,
      status: fs.status,
      // Dùng date-fns để tính giây còn lại
      remainingSeconds: differenceInSeconds(fs.endTime, new Date()),

      items: fs.items
        .map((item) => {
          if (!item.variant) return null;

          const product = item.variant.product as typeof item.variant.product & {
            wholesaleEnabled?: boolean;
            wholesaleUsers?: Array<{ userId: number }>;
          };
          if (
            viewerUserId &&
            product.wholesaleEnabled &&
            product.wholesaleUsers?.some((wholesaleUser) => wholesaleUser.userId === viewerUserId)
          ) {
            return null;
          }

          const originalPrice = Number(item.variant.originalPrice);
          let finalPrice = 0;

          if (item.discountType === DiscountType.Percentage) {
            finalPrice = Math.floor(originalPrice * (1 - (item.discountPercent ?? 0) / 100));
          } else {
            finalPrice = Number(item.salePrice ?? 0);
          }

          const soldPercent =
            item.saleStock > 0 ? Math.round((item.sold / item.saleStock) * 100) : 0;

          return {
            id: item.id,
            discountType: item.discountType,
            discountPercent: item.discountPercent,
            salePrice: item.salePrice,
            saleStock: item.saleStock,
            sold: item.sold,
            soldPercent,
            originalPrice,
            finalPrice,
            variant: {
              id: item.variant.id,
              name: item.variant.name,
              image: item.variant.image,
              stock: item.variant.stock, // Tồn kho thực tế (để FE chặn nếu kho < saleStock)
              dimensions: item.variant.dimensions, // <--- TRẢ VỀ: { "Màu": "Đỏ", "Size": "39" }
            },

            product: {
              id: item.variant.product.id,
              name: item.variant.product.name,
              image: item.variant.product.image?.[0] || '',
            },
          };
        })
        .filter(Boolean),
    };
  }

  async updateFlashSaleStatus(id: number, status: FlashSaleStatus) {
    const flashSale = await this.prisma.flashSale.findUnique({ where: { id } });
    if (!flashSale) throw new NotFoundException('FlashSale not found');

    if (status === FlashSaleStatus.Active) {
      const currentActive = await this.prisma.flashSale.findFirst({
        where: {
          status: FlashSaleStatus.Active,
          isDeleted: 0,
          id: { not: id },
        },
      });

      if (currentActive) {
        throw new BadRequestException(
          `Chương trình "${currentActive.title}" đang diễn ra. Vui lòng tắt nó trước.`,
        );
      }
    }

    return await this.prisma.flashSale.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: number) {
    await this.prisma.flashSale.findUniqueOrThrow({ where: { id } });

    return await this.prisma.flashSale.update({
      where: { id },
      data: {
        isDeleted: 1,
        status: FlashSaleStatus.Ended,
      },
    });
  }

  // --- CRON JOB ---
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleFlashSaleStatusCron() {
    const now = new Date();

    const endedSales = await this.prisma.flashSale.updateMany({
      where: {
        status: { in: [FlashSaleStatus.Active, FlashSaleStatus.Upcoming] },
        endTime: { lte: now },
        isDeleted: 0,
      },
      data: { status: FlashSaleStatus.Ended },
    });

    if (endedSales.count > 0) {
      this.logger.log(`Cron: Ended ${endedSales.count} sales.`);
    }

    const upcomingSales = await this.prisma.flashSale.findMany({
      where: {
        status: FlashSaleStatus.Upcoming,
        startTime: { lte: now },
        endTime: { gt: now },
        isDeleted: 0,
      },
    });

    for (const sale of upcomingSales) {
      const currentActive = await this.prisma.flashSale.findFirst({
        where: { status: FlashSaleStatus.Active, isDeleted: 0 },
      });

      if (!currentActive) {
        await this.prisma.flashSale.update({
          where: { id: sale.id },
          data: { status: FlashSaleStatus.Active },
        });
        this.logger.log(`Cron: Activated "${sale.title}"`);
      } else {
        this.logger.warn(
          `Cron: Cannot activate "${sale.title}" because "${currentActive.title}" is running.`,
        );
      }
    }
  }
}
