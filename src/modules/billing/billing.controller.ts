import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { BillingService } from './billing.service.js';
import { CreateLocalOrderDto } from './dto/create-local-order.dto.js';

@ApiTags('billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('balance')
  @RequirePermissions('billing:view')
  @ApiOperation({ summary: 'Lấy số dư ví tenant trên SionHub' })
  getBalance() {
    return this.billingService.getBalance();
  }

  @Get('packages')
  @RequirePermissions('billing:view')
  @ApiOperation({ summary: 'Lấy danh sách gói dịch vụ từ SionHub' })
  getPackages() {
    return this.billingService.getPackages();
  }

  @Post('orders')
  @RequirePermissions('billing:create')
  @ApiOperation({ summary: 'Tạo order thanh toán/nạp tiền trên SionHub' })
  createOrder(@Body() dto: CreateLocalOrderDto) {
    return this.billingService.createOrder(dto);
  }
}
