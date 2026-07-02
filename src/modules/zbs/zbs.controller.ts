import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentAdmin } from '../../common/decorators/current-admin.decorator.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import type { AuthenticatedAdmin } from '../../common/types.js';
import { CheckQuotaDto, CreateCampaignDto } from './dto/create-campaign.dto.js';
import { ZbsService } from './zbs.service.js';

@ApiTags('zbs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('zbs')
export class ZbsController {
  constructor(private readonly zbsService: ZbsService) {}

  @Get('templates/approved')
  @RequirePermissions('zbs:view')
  @ApiOperation({ summary: 'Lấy danh sách template ZBS đã duyệt của tenant từ SionHub' })
  getTenantTemplates() {
    return this.zbsService.getTenantTemplates();
  }

  @Post('campaigns')
  @RequirePermissions('zbs:send')
  @ApiOperation({ summary: 'Tạo campaign gửi ZBS qua SionHub' })
  createCampaign(@Body() dto: CreateCampaignDto, @CurrentAdmin() admin: AuthenticatedAdmin) {
    return this.zbsService.createCampaign(dto, admin.id);
  }

  @Post('quota-check')
  @RequirePermissions('zbs:send')
  @ApiOperation({ summary: 'Kiểm tra quota gửi ZBS trong ngày theo template' })
  checkQuota(@Body() dto: CheckQuotaDto) {
    return this.zbsService.checkQuotaPriorSend(dto);
  }
}
