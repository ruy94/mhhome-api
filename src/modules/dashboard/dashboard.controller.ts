import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@RequirePermissions('dashboard:view')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('revenue')
  async getRevenue(@Query('from') from: string, @Query('to') to: string) {
    return this.dashboardService.getRevenue(new Date(from), new Date(to));
  }

  @Get('messages')
  async getMessageStats(@Query('from') from: string, @Query('to') to: string) {
    return this.dashboardService.getMessageStats(new Date(from), new Date(to));
  }

  @Get('affiliate')
  async getAffiliateStats() {
    return this.dashboardService.getAffiliateStats();
  }
}
