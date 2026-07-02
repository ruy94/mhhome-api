import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { AffiliateService } from './affiliate.service.js';
import { UpdateAffiliateStatusDto } from './dto/update-affiliate-status.dto.js';
import { UpdateCommissionRateDto } from './dto/update-commission-rate.dto.js';
import { UpdateCommissionStatusDto } from './dto/update-commission-status.dto.js';
import { UpdateRefCodeDto } from './dto/update-ref-code.dto.js';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto.js';

@Controller('affiliates')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  // ==================== Affiliates ====================

  @Get()
  @RequirePermissions('affiliate:view')
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.affiliateService.adminFindAll(pageOptionsDto);
  }

  @Patch(':id/status')
  @RequirePermissions('affiliate:update')
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAffiliateStatusDto) {
    return await this.affiliateService.adminUpdateStatus(id, dto);
  }

  @Patch(':id/commission-rate')
  @RequirePermissions('affiliate:update')
  async updateCommissionRate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommissionRateDto,
  ) {
    return await this.affiliateService.adminUpdateCommissionRate(id, dto);
  }

  @Patch(':id/ref-code')
  @RequirePermissions('affiliate:update')
  async updateRefCode(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRefCodeDto) {
    return await this.affiliateService.adminUpdateRefCode(id, dto);
  }

  // ==================== Commissions ====================

  @Get('commissions')
  @RequirePermissions('affiliate:view')
  async findAllCommissions(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.affiliateService.adminFindAllCommissions(pageOptionsDto);
  }

  @Patch('commissions/:id/status')
  @RequirePermissions('affiliate:update')
  async updateCommissionStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommissionStatusDto,
  ) {
    return await this.affiliateService.adminUpdateCommissionStatus(id, dto);
  }

  // ==================== Withdrawals ====================

  @Get('withdrawals')
  @RequirePermissions('affiliate:view')
  async findAllWithdrawals(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.affiliateService.adminFindAllWithdrawals(pageOptionsDto);
  }

  @Patch('withdrawals/:id')
  @RequirePermissions('affiliate:update')
  async updateWithdrawal(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateWithdrawalDto) {
    return await this.affiliateService.adminUpdateWithdrawal(id, dto);
  }
}
