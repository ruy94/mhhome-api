import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';
import { LinkSaleworkVariantDto } from './dto/link-salework-variant.dto.js';
import { Prisma, FlashSaleStatus } from '../../generated/prisma/client.js';
import { UploadService } from '../upload/upload.service.js';
import { ConfigService } from '@nestjs/config';
import { SaleworkClientService } from '../integrations/salework/salework-client.service.js';

@Injectable()
export class VariantService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
    private readonly saleworkClient: SaleworkClientService,
  ) {}

  async findOne(id: number) {
    const variant = await this.prisma.variant.findUnique({
      where: { id, isDeleted: 0 },
      include: {
        product: {
          select: { id: true, name: true, image: true, tierVariations: true, wholesaleEnabled: true },
        },
      },
    });

    if (!variant) throw new NotFoundException('Variant not found');
    return variant;
  }

  async update(id: number, dto: UpdateVariantDto) {
    const variant = await this.prisma.variant.findUnique({
      where: { id, isDeleted: 0 },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    return await this.prisma.$transaction(async (tx) => {
      await tx.variant.update({
        where: { id },
        data: {
          name: dto.name,
          image: dto.image ?? variant.image,
          basePrice: dto.basePrice,
          originalPrice: dto.originalPrice,
          wholesaleBasePrice: dto.wholesaleBasePrice,
          wholesalePrice: dto.wholesalePrice,
          packageWeightGrams: dto.packageWeightGrams,
          packageLengthCm: dto.packageLengthCm,
          packageWidthCm: dto.packageWidthCm,
          packageHeightCm: dto.packageHeightCm,
          stock: dto.stock,
          dimensions: dto.dimensions
            ? (dto.dimensions as unknown as Prisma.InputJsonValue)
            : undefined,
        },
      });
      if (dto.image && dto.image !== variant.image) {
        // Xóa ảnh cũ nếu có ảnh mới
        await this.uploadService.deleteImage(variant.image || '');
      }
      return await tx.variant.findUnique({
        where: { id },
      });
    });
  }


  async linkSalework(id: number, dto: LinkSaleworkVariantDto) {
    const saleworkProductCode = dto.saleworkProductCode.trim();
    const saleworkWarehouseId = dto.saleworkWarehouseId.trim();

    const variant = await this.prisma.variant.findUnique({ where: { id, isDeleted: 0 } });
    if (!variant) throw new NotFoundException('Variant not found');

    const linked = await this.prisma.variant.findFirst({
      where: {
        id: { not: id },
        isDeleted: 0,
        saleworkProductCode,
        saleworkWarehouseId,
      },
      select: { id: true },
    });
    if (linked) throw new BadRequestException('SKU SaleWork này đã được liên kết với SKU khác');

    const updateData: Prisma.VariantUpdateInput = { saleworkProductCode, saleworkWarehouseId };

    if (this.configService.get<boolean>('salework.enabled') === true) {
      const salework = await this.saleworkClient.getProducts();
      const product = salework.products[saleworkProductCode];
      const hasWarehouse = salework.warehouses.some((warehouse) => warehouse.wid === saleworkWarehouseId);
      const saleworkStock = product?.stocks?.find((stock) => stock.wid === saleworkWarehouseId)?.value;

      if (!product || !hasWarehouse || saleworkStock === undefined) {
        throw new BadRequestException('SKU hoặc kho SaleWork không hợp lệ');
      }

      updateData.stock = Math.max(0, saleworkStock);
    }

    return this.prisma.variant.update({
      where: { id },
      data: updateData,
    });
  }

  async unlinkSalework(id: number) {
    const variant = await this.prisma.variant.findUnique({ where: { id, isDeleted: 0 } });
    if (!variant) throw new NotFoundException('Variant not found');

    return this.prisma.variant.update({
      where: { id },
      data: { saleworkProductCode: null, saleworkWarehouseId: null },
    });
  }

  // --- LOGIC CASCADE DELETE ---
  async remove(id: number) {
    const variant = await this.prisma.variant.findUnique({
      where: { id, isDeleted: 0 },
    });
    if (!variant) throw new NotFoundException('Variant not found');

    // Sử dụng Transaction để đảm bảo tính toàn vẹn
    return await this.prisma.$transaction(async (tx) => {
      // 1. Xóa Variant khỏi các Flash Sale sắp tới (Upcoming)
      // Để tránh việc bán một sản phẩm đã bị xóa
      // Chúng ta tìm các FlashSaleItem liên quan đến variant này
      // mà thuộc về FlashSale đang Upcoming
      await tx.flashSaleItem.deleteMany({
        where: {
          variantId: id,
          flashSale: {
            status: FlashSaleStatus.Upcoming, // Chỉ xóa ở Upcoming cho an toàn
          },
        },
      });

      // 2. Soft Delete Variant
      return await tx.variant.update({
        where: { id },
        data: { isDeleted: 1 },
      });
    });
  }
}
