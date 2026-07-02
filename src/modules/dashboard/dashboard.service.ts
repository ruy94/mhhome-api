import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AffiliateStatus, CommissionStatus, OrderStatus } from '../../generated/prisma/client.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();

    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      currentMonthOrders,
      lastMonthOrders,
      campaignStats,
      totalUsers,
      usersWithZalo,
      dailyCurrentMonth,
      dailyLastMonth,
    ] = await Promise.all([
      // Doanh thu tháng này
      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.Paid,
          createdAt: { gte: startOfCurrentMonth },
        },
        _sum: { totalAmount: true },
      }),

      // Doanh thu tháng trước
      this.prisma.order.aggregate({
        where: {
          status: OrderStatus.Paid,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),

      // Thống kê tin nhắn (tổng hợp tất cả campaign)
      this.prisma.campaign.aggregate({
        _sum: { sent: true, success: true, failed: true },
      }),

      // Tổng số khách hàng
      this.prisma.user.count(),

      // Số khách có Zalo
      this.prisma.user.count({
        where: { zaloId: { not: null } },
      }),

      // Doanh thu theo ngày — tháng này (cho AreaChart)
      this.prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          status: OrderStatus.Paid,
          createdAt: { gte: startOfCurrentMonth },
        },
        _sum: { totalAmount: true },
      }),

      // Doanh thu theo ngày — tháng trước (cho AreaChart)
      this.prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          status: OrderStatus.Paid,
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    // --- Order Stats ---
    const currentRevenue = Number(currentMonthOrders._sum.totalAmount ?? 0);
    const lastRevenue = Number(lastMonthOrders._sum.totalAmount ?? 0);
    const growthPercent =
      lastRevenue === 0 ? null : Math.round(((currentRevenue - lastRevenue) / lastRevenue) * 100);

    // --- Campaign Stats ---
    const totalSent = Number(campaignStats._sum.sent ?? 0);
    const totalSuccess = Number(campaignStats._sum.success ?? 0);
    const totalFailed = Number(campaignStats._sum.failed ?? 0);
    const successRate = totalSent === 0 ? 0 : Math.round((totalSuccess / totalSent) * 100);

    // --- Daily Revenue Chart (cộng theo ngày) ---
    const buildDailyMap = (
      rows: { createdAt: Date; _sum: { totalAmount: unknown } }[],
    ): Record<string, number> => {
      const map: Record<string, number> = {};
      for (const row of rows) {
        const day = row.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
        map[day] = (map[day] ?? 0) + Number(row._sum.totalAmount ?? 0);
      }
      return map;
    };

    const currentMap = buildDailyMap(dailyCurrentMonth);
    const lastMap = buildDailyMap(dailyLastMonth);

    // Tạo mảng 31 ngày cho tháng hiện tại
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dailyRevenue = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const lastKey = `${startOfLastMonth.getFullYear()}-${String(startOfLastMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return {
        day,
        current: currentMap[currentKey] ?? 0,
        prev: lastMap[lastKey] ?? 0,
      };
    });

    return {
      orderStats: {
        currentMonthRevenue: currentRevenue,
        lastMonthRevenue: lastRevenue,
        growthPercent,
        dailyRevenue,
      },
      campaignStats: {
        totalSent,
        totalSuccess,
        totalFailed,
        successRate,
      },
      userStats: {
        totalUsers,
        usersWithZalo,
      },
    };
  }

  async getRevenue(from: Date, to: Date) {
    const rows = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        status: OrderStatus.Paid,
        createdAt: { gte: from, lte: to },
      },
      _sum: { totalAmount: true },
    });

    // Gom theo ngày YYYY-MM-DD
    const map: Record<string, number> = {};
    for (const row of rows) {
      const key = row.createdAt.toISOString().slice(0, 10);
      map[key] = (map[key] ?? 0) + Number(row._sum.totalAmount ?? 0);
    }

    // Sinh đủ các ngày trong khoảng from → to
    const dailyRevenue: { date: string; revenue: number }[] = [];
    const cursor = new Date(from);
    cursor.setHours(0, 0, 0, 0);
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);

    while (cursor <= end) {
      const key = cursor.toISOString().slice(0, 10);
      dailyRevenue.push({ date: key, revenue: map[key] ?? 0 });
      cursor.setDate(cursor.getDate() + 1);
    }

    const totalRevenue = dailyRevenue.reduce((sum, r) => sum + r.revenue, 0);
    return { dailyRevenue, totalRevenue };
  }

  async getAffiliateStats() {
    const [
      totalAffiliates,
      pendingAffiliates,
      approvedAffiliates,
      commissionAgg,
      pendingCommissionAgg,
      withdrawalAgg,
      pendingWithdrawals,
      topAffiliates,
    ] = await this.prisma.$transaction([
      this.prisma.affiliate.count(),
      this.prisma.affiliate.count({
        where: { status: AffiliateStatus.Pending },
      }),
      this.prisma.affiliate.count({
        where: { status: AffiliateStatus.Approved },
      }),
      // Tổng hoa hồng đã duyệt (Approved + Paid)
      this.prisma.affiliateCommission.aggregate({
        where: {
          status: { in: [CommissionStatus.Approved, CommissionStatus.Paid] },
        },
        _sum: { commissionAmount: true },
      }),
      // Hoa hồng đang chờ duyệt
      this.prisma.affiliateCommission.aggregate({
        where: { status: CommissionStatus.Pending },
        _sum: { commissionAmount: true },
      }),
      // Tổng đã rút (Completed)
      this.prisma.affiliateWithdrawal.aggregate({
        where: { status: 'Completed' },
        _sum: { amount: true },
      }),
      // Yêu cầu rút đang chờ
      this.prisma.affiliateWithdrawal.count({
        where: { status: { in: ['Pending', 'Processing'] } },
      }),
      // Top 5 affiliate theo totalEarned
      this.prisma.affiliate.findMany({
        where: { status: AffiliateStatus.Approved },
        orderBy: { totalEarned: 'desc' },
        take: 5,
        select: {
          id: true,
          refCode: true,
          commissionRate: true,
          totalEarned: true,
          totalWithdrawn: true,
          user: { select: { name: true, phone: true } },
        },
      }),
    ]);

    return {
      totalAffiliates,
      pendingAffiliates,
      approvedAffiliates,
      totalCommissionAmount: Number(commissionAgg._sum.commissionAmount ?? 0),
      pendingCommissionAmount: Number(pendingCommissionAgg._sum.commissionAmount ?? 0),
      totalWithdrawnAmount: Number(withdrawalAgg._sum.amount ?? 0),
      pendingWithdrawals,
      topAffiliates: topAffiliates.map((a) => ({
        ...a,
        totalEarned: Number(a.totalEarned),
        totalWithdrawn: Number(a.totalWithdrawn),
        availableBalance: Number(a.totalEarned) - Number(a.totalWithdrawn),
      })),
    };
  }

  async getMessageStats(from: Date, to: Date) {
    const stats = await this.prisma.campaign.aggregate({
      where: { createdAt: { gte: from, lte: to } },
      _sum: { sent: true, success: true, failed: true },
    });

    const totalSent = Number(stats._sum.sent ?? 0);
    const totalSuccess = Number(stats._sum.success ?? 0);
    const totalFailed = Number(stats._sum.failed ?? 0);
    const successRate = totalSent === 0 ? 0 : Math.round((totalSuccess / totalSent) * 100);

    return { totalSent, totalSuccess, totalFailed, successRate };
  }
}
