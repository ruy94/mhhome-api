import { Controller, Get, Param, ParseIntPipe, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import ExcelJS from 'exceljs';
import { type Response } from 'express';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { SionHubClientService } from '../integrations/sion-hub/sion-hub-client.service.js';
import { CampaignService } from './campaign.service.js';
import { FindCampaignsByTemplatesDto } from './dto/find-campaigns-by-templates.dto.js';

interface CampaignLog {
  status: string;
  createdAt: string | Date;
  receiver: string;
  receiverType: string;
  errorCode: number | string | null;
  errorMessage: string | null;
}

@ApiTags('campaigns')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly sionHub: SionHubClientService,
  ) {}

  @Get('by-templates')
  @RequirePermissions('campaign:view')
  @ApiOperation({ summary: 'Lấy campaign theo danh sách templateId' })
  @ApiQuery({
    name: 'templateIds',
    required: true,
    type: String,
    description: 'Danh sách templateId, phân tách bằng dấu phẩy',
  })
  async findAllByTemplates(@Query() query: FindCampaignsByTemplatesDto) {
    const ids = query.templateIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    return this.campaignService.findAllByTemplates(ids, query);
  }

  @Get(':localCampaignId/logs/export')
  @RequirePermissions('campaign:export')
  @ApiOperation({ summary: 'Export log gửi tin của campaign từ SionHub' })
  async exportCampaignReport(
    @Param('localCampaignId', ParseIntPipe) localCampaignId: number,
    @Res() res: Response,
  ) {
    const campaign = await this.campaignService.findOne(localCampaignId);

    if (!campaign.providerCampaignId) {
      return res.status(400).send('Không tìm thấy dữ liệu chiến dịch từ Provider');
    }

    const logsPayload = await this.sionHub.getCampaignLogs<CampaignLog[] | { data: CampaignLog[] }>(
      campaign.providerCampaignId,
    );
    const logsData = Array.isArray(logsPayload) ? logsPayload : logsPayload.data;

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Báo cáo gửi tin');

    sheet.columns = [
      { header: 'STT', key: 'stt', width: 5 },
      { header: 'Loại', key: 'type', width: 10 },
      { header: 'Số ĐT / UID', key: 'receiver', width: 20 },
      { header: 'Trạng thái', key: 'status', width: 15 },
      { header: 'Mã lỗi', key: 'errorCode', width: 10 },
      { header: 'Chi tiết / Lý do', key: 'message', width: 50 },
      { header: 'Thời gian gửi', key: 'time', width: 25 },
    ];

    logsData.forEach((log, index) => {
      sheet.addRow({
        stt: index + 1,
        type: log.receiverType,
        receiver: log.receiver,
        status: log.status === 'SUCCESS' ? 'Thành công' : 'Thất bại',
        errorCode: log.errorCode || '',
        message: log.errorMessage || 'Gửi thành công',
        time: new Date(log.createdAt).toLocaleString('vi-VN'),
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    const encodedName = encodeURIComponent(`Report_${campaign.name}.xlsx`);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="report.xlsx"; filename*=UTF-8''${encodedName}`,
    );

    await workbook.xlsx.write(res);
    return res.end();
  }
}
