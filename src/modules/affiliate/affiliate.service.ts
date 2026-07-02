import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AffiliateStatus, CommissionStatus, Prisma } from '../../generated/prisma/client.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto.js';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto.js';
import { UpdateAffiliateStatusDto } from './dto/update-affiliate-status.dto.js';
import { UpdateCommissionRateDto } from './dto/update-commission-rate.dto.js';
import { UpdateCommissionStatusDto } from './dto/update-commission-status.dto.js';
import { UpdateRefCodeDto } from './dto/update-ref-code.dto.js';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto.js';

@Injectable()
export class AffiliateService {
  constructor(private prisma: PrismaService) {}

  // ==================== APP ====================

  async register(dto: RegisterAffiliateDto) {
    const existingUser = await this.prisma.affiliate.findUnique({
      where: { userId: dto.userId },
    });
    if (existingUser) {
      throw new BadRequestException('Bạn đã đăng ký affiliate rồi');
    }

    const existingCode = await this.prisma.affiliate.findUnique({
      where: { refCode: dto.refCode },
    });
    if (existingCode) {
      throw new BadRequestException('refCode này đã được sử dụng, vui lòng chọn refCode khác');
    }

    return this.prisma.affiliate.create({
      data: {
        userId: dto.userId,
        refCode: dto.refCode,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankHolder: dto.bankHolder,
      },
    });
  }

  async getMyProfile(userId: number) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, name: true, avatar: true, phone: true } },
      },
    });
    if (!affiliate) throw new NotFoundException('Chưa đăng ký affiliate');

    return {
      ...affiliate,
      totalEarned: Number(affiliate.totalEarned),
      totalWithdrawn: Number(affiliate.totalWithdrawn),
      availableBalance: Number(affiliate.totalEarned) - Number(affiliate.totalWithdrawn),
    };
  }

  async getMyCommissions(userId: number, pageOptionsDto: PageOptionsDto) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });
    if (!affiliate) throw new NotFoundException('Chưa đăng ký affiliate');

    const where: Prisma.AffiliateCommissionWhereInput = {
      affiliateId: affiliate.id,
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.affiliateCommission.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      }),
      this.prisma.affiliateCommission.count({ where }),
    ]);

    const mapped = items.map((c) => ({
      ...c,
      productAmount: Number(c.productAmount),
      commissionAmount: Number(c.commissionAmount),
    }));

    return new PageDto(mapped, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async createWithdrawal(dto: CreateWithdrawalDto) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId: dto.userId },
    });
    if (!affiliate) throw new NotFoundException('Chưa đăng ký affiliate');
    if (affiliate.status !== AffiliateStatus.Approved) {
      throw new BadRequestException('Tài khoản affiliate chưa được duyệt');
    }

    const available = Number(affiliate.totalEarned) - Number(affiliate.totalWithdrawn);
    if (dto.amount > available) {
      throw new BadRequestException(
        `Số dư không đủ. Hiện có: ${available.toLocaleString('vi-VN')}đ`,
      );
    }

    // Kiểm tra không có yêu cầu rút tiền đang chờ xử lý
    const pendingWithdrawal = await this.prisma.affiliateWithdrawal.findFirst({
      where: {
        affiliateId: affiliate.id,
        status: { in: ['Pending', 'Processing'] },
      },
    });
    if (pendingWithdrawal) {
      throw new BadRequestException('Bạn đang có yêu cầu rút tiền chưa được xử lý');
    }

    return this.prisma.affiliateWithdrawal.create({
      data: {
        affiliateId: affiliate.id,
        amount: dto.amount,
        bankName: dto.bankName,
        bankAccount: dto.bankAccount,
        bankHolder: dto.bankHolder,
      },
    });
  }

  async getMyWithdrawals(userId: number, pageOptionsDto: PageOptionsDto) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
    });
    if (!affiliate) throw new NotFoundException('Chưa đăng ký affiliate');

    const where: Prisma.AffiliateWithdrawalWhereInput = {
      affiliateId: affiliate.id,
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.affiliateWithdrawal.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      }),
      this.prisma.affiliateWithdrawal.count({ where }),
    ]);

    const mapped = items.map((w) => ({ ...w, amount: Number(w.amount) }));
    return new PageDto(mapped, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  // ==================== ADMIN ====================

  async adminFindAll(pageOptionsDto: PageOptionsDto) {
    const where: Prisma.AffiliateWhereInput = pageOptionsDto.q
      ? { refCode: { contains: pageOptionsDto.q, mode: 'insensitive' } }
      : {};

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.affiliate.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        include: {
          user: { select: { id: true, name: true, avatar: true, phone: true } },
        },
      }),
      this.prisma.affiliate.count({ where }),
    ]);

    const mapped = items.map((a) => ({
      ...a,
      totalEarned: Number(a.totalEarned),
      totalWithdrawn: Number(a.totalWithdrawn),
      availableBalance: Number(a.totalEarned) - Number(a.totalWithdrawn),
    }));

    return new PageDto(mapped, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async adminUpdateStatus(id: number, dto: UpdateAffiliateStatusDto) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate không tồn tại');

    return this.prisma.affiliate.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async adminUpdateCommissionRate(id: number, dto: UpdateCommissionRateDto) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate không tồn tại');

    return this.prisma.affiliate.update({
      where: { id },
      data: { commissionRate: dto.commissionRate },
    });
  }

  async adminUpdateRefCode(id: number, dto: UpdateRefCodeDto) {
    const affiliate = await this.prisma.affiliate.findUnique({ where: { id } });
    if (!affiliate) throw new NotFoundException('Affiliate không tồn tại');

    const existing = await this.prisma.affiliate.findUnique({
      where: { refCode: dto.refCode },
    });
    if (existing && existing.id !== id) {
      throw new BadRequestException('refCode này đã được sử dụng');
    }

    return this.prisma.affiliate.update({
      where: { id },
      data: { refCode: dto.refCode },
    });
  }

  async adminFindAllCommissions(pageOptionsDto: PageOptionsDto) {
    const where: Prisma.AffiliateCommissionWhereInput = pageOptionsDto.q
      ? {
          affiliate: {
            refCode: { contains: pageOptionsDto.q, mode: 'insensitive' },
          },
        }
      : {};

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.affiliateCommission.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        include: {
          affiliate: {
            select: {
              id: true,
              refCode: true,
              commissionRate: true,
              user: { select: { name: true } },
            },
          },
          order: { select: { id: true, code: true } },
          product: { select: { id: true, name: true } },
        },
      }),
      this.prisma.affiliateCommission.count({ where }),
    ]);

    const mapped = items.map((c) => ({
      ...c,
      productAmount: Number(c.productAmount),
      commissionAmount: Number(c.commissionAmount),
    }));

    return new PageDto(mapped, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async adminUpdateCommissionStatus(id: number, dto: UpdateCommissionStatusDto) {
    const commission = await this.prisma.affiliateCommission.findUnique({
      where: { id },
    });
    if (!commission) throw new NotFoundException('Commission không tồn tại');

    // Khi duyệt commission, cộng vào totalEarned của affiliate
    if (
      dto.status === CommissionStatus.Approved &&
      commission.status !== CommissionStatus.Approved
    ) {
      await this.prisma.$transaction([
        this.prisma.affiliateCommission.update({
          where: { id },
          data: { status: dto.status, note: dto.note },
        }),
        this.prisma.affiliate.update({
          where: { id: commission.affiliateId },
          data: { totalEarned: { increment: commission.commissionAmount } },
        }),
      ]);
      return { message: 'Đã duyệt commission' };
    }

    // Khi từ chối commission đã Approved trước đó, trừ lại totalEarned
    if (
      dto.status === CommissionStatus.Rejected &&
      commission.status === CommissionStatus.Approved
    ) {
      await this.prisma.$transaction([
        this.prisma.affiliateCommission.update({
          where: { id },
          data: { status: dto.status, note: dto.note },
        }),
        this.prisma.affiliate.update({
          where: { id: commission.affiliateId },
          data: { totalEarned: { decrement: commission.commissionAmount } },
        }),
      ]);
      return { message: 'Đã từ chối commission' };
    }

    return this.prisma.affiliateCommission.update({
      where: { id },
      data: { status: dto.status, note: dto.note },
    });
  }

  async adminFindAllWithdrawals(pageOptionsDto: PageOptionsDto) {
    const where: Prisma.AffiliateWithdrawalWhereInput = pageOptionsDto.q
      ? {
          affiliate: {
            refCode: { contains: pageOptionsDto.q, mode: 'insensitive' },
          },
        }
      : {};

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.affiliateWithdrawal.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        include: {
          affiliate: {
            select: {
              id: true,
              refCode: true,
              user: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.affiliateWithdrawal.count({ where }),
    ]);

    const mapped = items.map((w) => ({ ...w, amount: Number(w.amount) }));
    return new PageDto(mapped, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async adminUpdateWithdrawal(id: number, dto: UpdateWithdrawalDto) {
    const withdrawal = await this.prisma.affiliateWithdrawal.findUnique({
      where: { id },
      include: { affiliate: true },
    });
    if (!withdrawal) throw new NotFoundException('Yêu cầu rút tiền không tồn tại');

    // Khi hoàn thành withdrawal, cộng vào totalWithdrawn
    if (dto.status === 'Completed' && withdrawal.status !== 'Completed') {
      const available =
        Number(withdrawal.affiliate.totalEarned) - Number(withdrawal.affiliate.totalWithdrawn);
      if (Number(withdrawal.amount) > available) {
        throw new BadRequestException('Số dư affiliate không đủ để xử lý yêu cầu này');
      }

      await this.prisma.$transaction([
        this.prisma.affiliateWithdrawal.update({
          where: { id },
          data: { status: dto.status, adminNote: dto.adminNote },
        }),
        this.prisma.affiliate.update({
          where: { id: withdrawal.affiliateId },
          data: { totalWithdrawn: { increment: withdrawal.amount } },
        }),
      ]);
      return { message: 'Đã xử lý rút tiền thành công' };
    }

    return this.prisma.affiliateWithdrawal.update({
      where: { id },
      data: { status: dto.status, adminNote: dto.adminNote },
    });
  }

  // ==================== INTERNAL (dùng trong OrderService) ====================

  async createCommission(params: {
    affiliateCode: string;
    orderId: number;
    orderUserId: number;
    affiliateProductId: number;
    orderProducts: {
      productId: number;
      finalPrice: number;
      quantity: number;
      itemVoucherDiscount?: number;
    }[];
  }) {
    const { affiliateCode, orderId, orderUserId, affiliateProductId, orderProducts } = params;

    const affiliate = await this.prisma.affiliate.findUnique({
      where: { refCode: affiliateCode },
    });
    if (!affiliate) return;
    if (affiliate.status !== AffiliateStatus.Approved) return;
    if (affiliate.userId === orderUserId) return; // không tự giới thiệu

    const matchedItems = orderProducts.filter((p) => p.productId === affiliateProductId);
    if (matchedItems.length === 0) return;

    const productAmount = matchedItems.reduce(
      (sum, item) => sum + item.finalPrice * item.quantity - (item.itemVoucherDiscount ?? 0),
      0,
    );
    const commissionAmount = Math.floor((productAmount * affiliate.commissionRate) / 100);

    await this.prisma.affiliateCommission.create({
      data: {
        affiliateId: affiliate.id,
        orderId,
        productId: affiliateProductId,
        productAmount,
        commissionRate: affiliate.commissionRate,
        commissionAmount,
      },
    });
  }

  async rejectCommissionByOrder(orderId: number) {
    const commission = await this.prisma.affiliateCommission.findUnique({
      where: { orderId },
    });
    if (!commission) return;
    if (
      commission.status !== CommissionStatus.Pending &&
      commission.status !== CommissionStatus.Approved
    )
      return;

    const updates: Prisma.PrismaPromise<unknown>[] = [
      this.prisma.affiliateCommission.update({
        where: { orderId },
        data: { status: CommissionStatus.Rejected },
      }),
    ];

    // Nếu đã Approved thì trừ lại totalEarned
    if (commission.status === CommissionStatus.Approved) {
      updates.push(
        this.prisma.affiliate.update({
          where: { id: commission.affiliateId },
          data: { totalEarned: { decrement: commission.commissionAmount } },
        }),
      );
    }

    await this.prisma.$transaction(updates);
  }
}
