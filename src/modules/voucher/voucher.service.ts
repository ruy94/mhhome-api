import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateVoucherDto } from './dto/create-voucher.dto.js';
import { UpdateVoucherDto } from './dto/update-voucher.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { ConditionType, Prisma, VoucherScope, VoucherType } from '../../generated/prisma/client.js';
import { VoucherQueryDto } from './dto/voucher-query.dto.js';

const PRODUCT_VOUCHER_TYPES: VoucherType[] = [
  VoucherType.Normal,
  VoucherType.Secret,
  VoucherType.Hidden,
];

type VoucherWithProducts = Prisma.VoucherGetPayload<{
  include: { voucherProducts: { select: { productId: true } } };
}>;

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  async findAll(pageOptionsDto: VoucherQueryDto) {
    const where = this.buildVoucherWhere(pageOptionsDto);

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.voucher.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { createdAt: pageOptionsDto.order },
        include: { voucherProducts: { select: { productId: true } } },
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return new PageDto(
      items.map((item) => this.serializeVoucher(item)),
      new PageMetaDto({ itemCount, pageOptionsDto }),
    );
  }

  async findOne(id: number) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id, isDeleted: 0 },
      include: { voucherProducts: { select: { productId: true } } },
    });
    if (!voucher) throw new NotFoundException('Voucher not found');
    return this.serializeVoucher(voucher);
  }

  async getMiniappPublicVouchers(pageOptionsDto: VoucherQueryDto) {
    return this.getPublicVouchers(pageOptionsDto, ConditionType.ZaloMiniApp);
  }

  async getWebsitePublicVouchers(pageOptionsDto: VoucherQueryDto) {
    return this.getPublicVouchers(pageOptionsDto, ConditionType.Website);
  }

  async getPublicVouchers(
    pageOptionsDto: VoucherQueryDto,
    conditionType: ConditionType = ConditionType.ZaloMiniApp,
  ) {
    const now = new Date();
    const vouchers = await this.prisma.voucher.findMany({
      where: {
        ...this.buildVoucherWhere(pageOptionsDto),
        conditionType,
        type: { notIn: [VoucherType.Secret, VoucherType.Hidden] },
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      include: { voucherProducts: { select: { productId: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const filtered = vouchers.filter((v) => {
      if (v.usageLimit && v.usedCount >= v.usageLimit) return false;
      return true;
    });
    const items = pageOptionsDto.take
      ? filtered.slice(pageOptionsDto.skip ?? 0, (pageOptionsDto.skip ?? 0) + pageOptionsDto.take)
      : filtered;

    return new PageDto(
      items.map((item) => this.serializeVoucher(item)),
      new PageMetaDto({ itemCount: filtered.length, pageOptionsDto }),
    );
  }

  async getMiniappHiddenVoucher(voucherCode: string) {
    return this.getHiddenVoucher(voucherCode, ConditionType.ZaloMiniApp);
  }

  async getWebsiteHiddenVoucher(voucherCode: string) {
    return this.getHiddenVoucher(voucherCode, ConditionType.Website);
  }

  async getHiddenVoucher(
    voucherCode: string,
    conditionType: ConditionType = ConditionType.ZaloMiniApp,
  ) {
    const now = new Date();
    const voucher = await this.prisma.voucher.findFirst({
      where: {
        code: voucherCode,
        conditionType,
        isDeleted: 0,
        isActive: true,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      include: { voucherProducts: { select: { productId: true } } },
    });
    if (!voucher) throw new NotFoundException('Không tìm thấy Voucher, hãy kiểm tra lại mã');
    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new NotFoundException('Voucher đã hết lượt sử dụng');
    }
    return this.serializeVoucher(voucher);
  }

  async getMiniappVoucherWallet(userId: number, pageOptionsDto: VoucherQueryDto) {
    return this.getVoucherWallet(userId, pageOptionsDto, ConditionType.ZaloMiniApp);
  }

  async getWebsiteVoucherWallet(userId: number, pageOptionsDto: VoucherQueryDto) {
    return this.getVoucherWallet(userId, pageOptionsDto, ConditionType.Website);
  }

  async getVoucherWallet(
    userId: number,
    pageOptionsDto: VoucherQueryDto,
    conditionType: ConditionType = ConditionType.ZaloMiniApp,
  ) {
    const now = new Date();
    // Tìm tất cả bản ghi trong bảng UserVoucher của User này
    const userVouchers = await this.prisma.userVoucher.findMany({
      where: {
        userId: userId,
        usedAt: null, // QUAN TRỌNG: Chỉ lấy những voucher chưa sử dụng
        voucher: {
          ...this.buildVoucherWhere(pageOptionsDto),
          conditionType,
          isActive: true,
          validFrom: { lte: now }, // Đã bắt đầu hiệu lực
          validUntil: { gte: now }, // Chưa hết hạn
        },
      },
      include: {
        voucher: { include: { voucherProducts: { select: { productId: true } } } },
      },
    });

    const vouchers = userVouchers
      .filter((uv) => {
        // Kiểm tra thêm điều kiện usageLimit toàn hệ thống (phòng trường hợp voucher hết lượt dùng chung)
        const v = uv.voucher;
        if (v.usageLimit !== null && v.usedCount >= v.usageLimit) return false;
        return true;
      })
      .map((uv) => this.serializeVoucher(uv.voucher));
    const items = pageOptionsDto.take
      ? vouchers.slice(pageOptionsDto.skip ?? 0, (pageOptionsDto.skip ?? 0) + pageOptionsDto.take)
      : vouchers;

    return new PageDto(items, new PageMetaDto({ itemCount: vouchers.length, pageOptionsDto }));
  }

  async saveMiniappVoucher(userId: number, voucherId: number) {
    return this.saveVoucher(userId, voucherId, ConditionType.ZaloMiniApp);
  }

  async saveWebsiteVoucher(userId: number, voucherId: number) {
    return this.saveVoucher(userId, voucherId, ConditionType.Website);
  }

  async saveVoucher(
    userId: number,
    voucherId: number,
    conditionType: ConditionType = ConditionType.ZaloMiniApp,
  ) {
    const voucher = await this.prisma.voucher.findFirst({
      where: { id: voucherId, conditionType, isDeleted: 0 },
    });

    if (!voucher) throw new NotFoundException('Voucher không tồn tại trên nền tảng này');
    if (!voucher.isActive) throw new BadRequestException('Voucher hiện đang bị khóa');

    const now = new Date();
    if (now < voucher.validFrom)
      throw new BadRequestException('Voucher chưa đến thời gian áp dụng');
    if (now > voucher.validUntil) throw new BadRequestException('Voucher đã hết hạn');

    // Kiểm tra số lượng phát hành toàn hệ thống (usageLimit)
    // Nếu usageLimit là null nghĩa là không giới hạn
    if (voucher.usageLimit !== null && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher đã hết lượt sử dụng');
    }

    // Đếm tổng số lần User này đã sở hữu Voucher này (Bao gồm cả Đã dùng và Đang lưu)
    const currentUserUsageCount = await this.prisma.userVoucher.count({
      where: { userId: userId, voucherId: voucherId },
    });

    // So sánh với giới hạn cho phép
    // limitPerUser default là 1, nên luôn có giá trị
    if (currentUserUsageCount >= voucher.limitPerUser) {
      throw new BadRequestException(`Bạn đã đạt giới hạn sưu tầm voucher này`);
    }

     // Kiểm tra xem User có đang giữ voucher này trong ví mà CHƯA DÙNG không?
    // Tránh việc user bấm lưu liên tục tạo ra nhiều bản ghi rác nếu chưa dùng cái cũ
    const existingInWallet = await this.prisma.userVoucher.findFirst({
      where: { userId: userId, voucherId: voucherId, usedAt: null },
    });

    // Nếu đã có trong ví rồi thì trả về luôn, coi như lưu thành công (Idempotency)
    if (existingInWallet) return existingInWallet;

    return await this.prisma.userVoucher.create({
      data: { userId: userId, voucherId: voucherId, usedAt: null },
    });
  }

  async create(data: CreateVoucherDto) {
    if (data.validFrom >= data.validUntil) {
      throw new BadRequestException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    const exists = await this.prisma.voucher.findFirst({ where: { code: data.code } });
    if (exists) throw new BadRequestException('Voucher code existed!');

    const { userId, productIds, ...voucherData } = data;
    const scope = this.resolveVoucherScope(voucherData.type, voucherData.scope);
    const normalizedProductIds = this.normalizeProductIds(productIds);
    await this.validateVoucherScope(voucherData.type, scope, normalizedProductIds);

    const createData = {
      ...voucherData,
      scope,
      ...(scope === VoucherScope.Product
        ? {
            voucherProducts: {
              create: normalizedProductIds.map((productId) => ({ productId })),
            },
          }
        : {}),
      ...(userId ? { userVouchers: { create: { userId: userId, usedAt: null } } } : {}),
    };

    const created = await this.prisma.voucher.create({
      data: createData,
      include: { voucherProducts: { select: { productId: true } } },
    });
    return this.serializeVoucher(created);
  }

  async update(id: number, dto: UpdateVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id, isDeleted: 0 },
      include: { voucherProducts: { select: { productId: true } } },
    });
    if (!voucher) throw new NotFoundException('Voucher not found');

    const validFrom = dto.validFrom ?? voucher.validFrom;
    const validUntil = dto.validUntil ?? voucher.validUntil;

    if (validFrom >= validUntil) {
      throw new BadRequestException('Ngày bắt đầu phải nhỏ hơn ngày kết thúc');
    }

    if (dto.code && dto.code !== voucher.code) {
      const exists = await this.prisma.voucher.findFirst({
        where: { code: dto.code, isDeleted: 0, NOT: { id: id } },
      });
      if (exists) throw new BadRequestException('Voucher code existed!');
    }

    const finalType = dto.type ?? voucher.type;
    const finalScope = this.resolveVoucherScope(finalType, dto.scope ?? voucher.scope);
    const finalProductIds = this.normalizeProductIds(
      dto.productIds ?? voucher.voucherProducts.map((item) => item.productId),
    );
    await this.validateVoucherScope(finalType, finalScope, finalProductIds);

    const { userId: _userId, productIds: _productIds, ...voucherData } = dto;
    const updated = await this.prisma.voucher.update({
      where: { id },
      data: {
        ...voucherData,
        scope: finalScope,
        ...(finalScope === VoucherScope.Product
          ? {
              voucherProducts: {
                deleteMany: {},
                create: finalProductIds.map((productId) => ({ productId })),
              },
            }
          : { voucherProducts: { deleteMany: {} } }),
      },
      include: { voucherProducts: { select: { productId: true } } },
    });

    return this.serializeVoucher(updated);
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.prisma.voucher.update({
      where: { id },
      data: { isDeleted: 1 },
    });
  }

  private buildVoucherWhere(pageOptionsDto: VoucherQueryDto): Prisma.VoucherWhereInput {
    return {
      isDeleted: 0,
      ...(pageOptionsDto.q ? { code: { contains: pageOptionsDto.q } } : {}),
      ...(pageOptionsDto.scope ? { scope: pageOptionsDto.scope } : {}),
      ...(pageOptionsDto.productId
        ? { voucherProducts: { some: { productId: pageOptionsDto.productId } } }
        : {}),
    };
  }

  private resolveVoucherScope(type: VoucherType, scope?: VoucherScope) {
    if (scope) return scope;
    return type === VoucherType.Freeship ? VoucherScope.Shipping : VoucherScope.Order;
  }

  private normalizeProductIds(productIds?: number[]) {
    return [...new Set(productIds ?? [])];
  }

  private async validateVoucherScope(type: VoucherType, scope: VoucherScope, productIds: number[]) {
    if (scope === VoucherScope.Shipping && type !== VoucherType.Freeship) {
      throw new BadRequestException('Voucher vận chuyển phải có type Freeship');
    }

    if (scope !== VoucherScope.Shipping && type === VoucherType.Freeship) {
      throw new BadRequestException('Voucher Freeship chỉ được dùng cho vận chuyển');
    }

    if (scope === VoucherScope.Product) {
      if (!PRODUCT_VOUCHER_TYPES.includes(type)) {
        throw new BadRequestException(
          'Voucher riêng cho sản phẩm chỉ hỗ trợ Normal, Secret hoặc Hidden',
        );
      }
      if (productIds.length === 0) {
        throw new BadRequestException('Voucher riêng cho sản phẩm cần chọn ít nhất một sản phẩm');
      }
      await this.validateProductVoucherProducts(productIds);
      return;
    }

    if (productIds.length > 0) {
      throw new BadRequestException('Chỉ voucher riêng cho sản phẩm mới được gắn sản phẩm');
    }
  }

  private async validateProductVoucherProducts(productIds: number[]) {
    const products = await this.prisma.product.count({
      where: { id: { in: productIds }, isDeleted: 0 },
    });
    if (products !== productIds.length) {
      throw new BadRequestException('Một số sản phẩm áp dụng voucher không hợp lệ');
    }

    const now = new Date();
    const activeFlashSaleVariant = await this.prisma.variant.findFirst({
      where: {
        productId: { in: productIds },
        isDeleted: 0,
        flashSaleItems: {
          some: {
            flashSale: {
              status: 'Active',
              startTime: { lte: now },
              endTime: { gte: now },
            },
          },
        },
      },
      select: { productId: true },
    });

    if (activeFlashSaleVariant) {
      throw new BadRequestException(
        'Không thể tạo voucher riêng cho sản phẩm đang có biến thể flash sale',
      );
    }
  }

  private serializeVoucher(voucher: VoucherWithProducts) {
    return {
      ...voucher,
      discountValue: Number(voucher.discountValue),
      maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
      minOrderValue: Number(voucher.minOrderValue),
      productIds: voucher.voucherProducts.map((item) => item.productId),
      voucherProducts: undefined,
    };
  }
}
