import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import type {
  SaleworkAddressData,
  SaleworkInventoryTransactionsData,
  SaleworkLogisticsData,
  SaleworkMutationResult,
  SaleworkProductReportData,
  SaleworkProductsData,
} from '../integrations/salework/salework.types.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import {
  CreateSaleworkInStoreOrderDto,
  CreateSaleworkSelfLogisticsOrderDto,
  CreateSaleworkThirdLogisticsOrderDto,
} from './dto/create-salework-order.dto.js';
import { CreateSaleworkDebtDto, GenerateSaleworkQrDto } from './dto/salework-debt.dto.js';
import { SaleworkInventoryTransactionDto } from './dto/salework-inventory-transaction.dto.js';
import { SaleworkProductReportDto } from './dto/salework-report.dto.js';
import { SaleworkWarehouseTransactionDto } from './dto/salework-warehouse.dto.js';
import { SaleworkService } from './salework.service.js';

@ApiTags('salework')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('salework')
export class SaleworkController {
  constructor(private readonly saleworkService: SaleworkService) {}

  @Get('products')
  @RequirePermissions('salework:view')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm/kho từ Salework' })
  getProducts(): Promise<SaleworkProductsData> {
    return this.saleworkService.getProducts();
  }


  @Post('products/sync-stock')
  @RequirePermissions('salework:warehouse')
  @ApiOperation({ summary: 'Đồng bộ tồn kho Variant đã liên kết từ Salework' })
  syncLinkedVariantStocks() {
    return this.saleworkService.syncLinkedVariantStocks();
  }

  @Get('addresses')
  @RequirePermissions('salework:view')
  @ApiOperation({ summary: 'Lấy danh sách địa chỉ từ Salework' })
  getAddressList(): Promise<SaleworkAddressData> {
    return this.saleworkService.getAddressList();
  }

  @Get('logistics')
  @RequirePermissions('salework:view')
  @ApiOperation({ summary: 'Lấy danh sách đơn vị vận chuyển từ Salework' })
  getLogistics(): Promise<SaleworkLogisticsData> {
    return this.saleworkService.getLogistics();
  }

  @Post('orders/3rd-logistics')
  @RequirePermissions('salework:create')
  @ApiOperation({ summary: 'Tạo đơn Salework qua đơn vị vận chuyển thứ ba' })
  createThirdLogisticsOrder(@Body() dto: CreateSaleworkThirdLogisticsOrderDto) {
    return this.saleworkService.createThirdLogisticsOrder(dto);
  }

  @Post('orders/self-logistics')
  @RequirePermissions('salework:create')
  @ApiOperation({ summary: 'Tạo đơn Salework tự vận chuyển' })
  createSelfLogisticsOrder(@Body() dto: CreateSaleworkSelfLogisticsOrderDto) {
    return this.saleworkService.createSelfLogisticsOrder(dto);
  }

  @Post('orders/in-store')
  @RequirePermissions('salework:create')
  @ApiOperation({ summary: 'Tạo đơn Salework bán tại cửa hàng' })
  createInStoreOrder(@Body() dto: CreateSaleworkInStoreOrderDto) {
    return this.saleworkService.createInStoreOrder(dto);
  }

  @Post('warehouse/import')
  @RequirePermissions('salework:warehouse')
  @ApiOperation({ summary: 'Nhập kho Salework' })
  warehouseImport(@Body() dto: SaleworkWarehouseTransactionDto) {
    return this.saleworkService.warehouseImport(dto);
  }

  @Post('warehouse/export')
  @RequirePermissions('salework:warehouse')
  @ApiOperation({ summary: 'Xuất kho Salework' })
  warehouseExport(@Body() dto: SaleworkWarehouseTransactionDto) {
    return this.saleworkService.warehouseExport(dto);
  }

  @Post('warehouse/return')
  @RequirePermissions('salework:warehouse')
  @ApiOperation({ summary: 'Hoàn kho Salework' })
  warehouseReturn(@Body() dto: SaleworkWarehouseTransactionDto) {
    return this.saleworkService.warehouseReturn(dto);
  }

  @Post('reports/products')
  @RequirePermissions('salework:view')
  @ApiOperation({ summary: 'Lấy báo cáo sản phẩm từ Salework' })
  getProductReport(@Body() dto: SaleworkProductReportDto) {
    return this.saleworkService.getProductReport(dto);
  }

  @Post('inventory-transactions')
  @RequirePermissions('salework:view')
  @ApiOperation({ summary: 'Lấy lịch sử giao dịch tồn kho từ Salework' })
  getInventoryTransactions(@Body() dto: SaleworkInventoryTransactionDto) {
    return this.saleworkService.getInventoryTransactions(dto);
  }

  @Get('merchants')
  @RequirePermissions('salework:banking')
  @ApiOperation({ summary: 'Lấy danh sách merchant Salework Banking' })
  getMerchants() {
    return this.saleworkService.getMerchants();
  }

  @Post('debts')
  @RequirePermissions('salework:banking')
  @ApiOperation({ summary: 'Tạo khoản phải thu Salework Banking' })
  createDebt(@Body() dto: CreateSaleworkDebtDto) {
    return this.saleworkService.createDebt(dto);
  }

  @Get('debts/qr')
  @RequirePermissions('salework:banking')
  @ApiOperation({ summary: 'Tạo QR thanh toán cho khoản phải thu Salework Banking' })
  generateQr(@Query() dto: GenerateSaleworkQrDto) {
    return this.saleworkService.generateQr(dto);
  }
}

