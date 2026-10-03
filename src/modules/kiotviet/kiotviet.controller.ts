import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { KiotVietPageQueryDto, KiotVietProductsQueryDto } from './dto/kiotviet-page-query.dto.js';
import { KiotVietService } from './kiotviet.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { KiotVietInvoiceService } from './kiotviet-invoice.service.js';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator.js';
import { UpdateKiotVietOrderExportDto } from './dto/update-kiotviet-order-export.dto.js';
import { KiotVietOrderExportService } from './kiotviet-order-export.service.js';

@ApiTags('kiotviet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('kiotviet:view')
@Controller('kiotviet')
export class KiotVietController {
  constructor(
    private readonly service: KiotVietService,
    private readonly invoices: KiotVietInvoiceService,
    private readonly orderExports: KiotVietOrderExportService,
  ) {}

  @Get('connection/status')
  @ApiOperation({ summary: 'Trạng thái cấu hình KiotViet (chỉ đọc)' })
  status() {
    return this.service.getStatus();
  }

  @Get('connection/test')
  @ApiOperation({ summary: 'Kiểm tra token và chi nhánh KiotViet' })
  testConnection() {
    return this.service.testConnection();
  }

  @Get('branches')
  @ApiOperation({ summary: 'Đọc danh sách chi nhánh KiotViet' })
  branches(@Query() query: KiotVietPageQueryDto) {
    return this.service.getBranches(query);
  }

  @Get('products')
  @ApiOperation({ summary: 'Đọc danh sách sản phẩm KiotViet' })
  products(@Query() query: KiotVietProductsQueryDto) {
    return this.service.getProducts(query);
  }

  @Get('users')
  @ApiOperation({ summary: 'Danh sách nhân viên KiotViet để chọn người bán hóa đơn' })
  users(@Query() query: KiotVietPageQueryDto) {
    return this.invoices.listUsers(query.pageSize, query.currentItem);
  }

  @Patch('variants/:id/link')
  @RequirePermissions('kiotviet:sync')
  linkVariant(@Param('id', ParseIntPipe) id: number, @Body() body: { productCode: string }) {
    return this.service.linkVariant(id, body?.productCode);
  }

  @Delete('variants/:id/link')
  @RequirePermissions('kiotviet:sync')
  unlinkVariant(@Param('id', ParseIntPipe) id: number) {
    return this.service.unlinkVariant(id);
  }

  @Post('stock/sync')
  @HttpCode(202)
  @RequirePermissions('kiotviet:sync')
  syncStocks() {
    return this.service.requestStockSync('MANUAL');
  }

  @Get('stock/sync/:jobId')
  @RequirePermissions('kiotviet:sync')
  @ApiOperation({ summary: 'Theo dõi kết quả một lượt đồng bộ tồn kho KiotViet' })
  stockSyncJob(@Param('jobId') jobId: string) {
    return this.service.getStockSyncJob(jobId);
  }

  @Get('webhook/status')
  @RequirePermissions('kiotviet:sync')
  webhookStatus() {
    return this.service.webhookStatus();
  }

  @Post('webhook/register')
  @RequirePermissions('kiotviet:sync')
  registerWebhook() {
    return this.service.registerStockWebhook();
  }

  @Get('order-export/setting')
  @ApiOperation({ summary: 'Cấu hình tự động xuất order sang KiotViet' })
  orderExportSetting() {
    return this.orderExports.getSetting();
  }

  @Patch('order-export/setting')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Bật/tắt xuất order và chọn nhân viên KiotViet' })
  updateOrderExportSetting(
    @Body() dto: UpdateKiotVietOrderExportDto,
    @CurrentAdmin('id') adminId: string,
  ) {
    return this.orderExports.updateSetting(dto, adminId);
  }

  @Get('order-export/logs')
  @ApiOperation({ summary: 'Theo dõi vòng đời order tự động trên KiotViet' })
  orderExportLogs(@Query('orderId') orderId?: string) {
    return this.orderExports.listLogs(orderId ? Number(orderId) : undefined);
  }

  @Post('order-export/:orderId/retry')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Thử lại thao tác order bị KiotViet từ chối rõ ràng' })
  retryOrderExport(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderExports.retryFailed(orderId);
  }

  @Post('order-export/:orderId/resolve')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Đối chiếu thao tác tạo order chưa rõ kết quả' })
  resolveOrderExport(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body('externalOrderId', ParseIntPipe) externalOrderId: number,
  ) {
    return this.orderExports.resolveUncertain(orderId, externalOrderId);
  }

  @Get('invoice-outbox')
  @ApiOperation({ summary: 'Theo dõi hóa đơn KiotViet của đơn nội bộ đã giao' })
  invoiceOutbox(@Query('orderId') orderId?: string) {
    return this.invoices.listOutbox(orderId ? Number(orderId) : undefined);
  }

  @Get('invoice-outbox/missing')
  @ApiOperation({ summary: 'Đơn Paid chưa tạo được hóa đơn KiotViet' })
  missingInvoices() {
    return this.invoices.listMissingPaidOrders();
  }

  @Post('invoice-outbox/:id/resolve')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Đối chiếu hóa đơn KiotViet sau phản hồi không rõ' })
  resolveInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body('externalId', ParseIntPipe) externalId: number,
  ) {
    return this.invoices.resolveUncertain(id, externalId);
  }

  @Post('invoice-outbox/:id/retry')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Gửi lại hóa đơn đã bị từ chối rõ ràng' })
  retryInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.invoices.retryFailed(id);
  }

  @Post('invoice-outbox/:id/confirm')
  @RequirePermissions('kiotviet:write')
  @ApiOperation({ summary: 'Chọn nhân viên KiotViet và xác nhận gửi hóa đơn' })
  confirmInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body('soldById', ParseIntPipe) soldById: number,
    @CurrentAdmin('id') adminId: string,
  ) {
    return this.invoices.confirmSeller(id, soldById, adminId);
  }
}

@ApiTags('kiotviet-webhook')
@Public()
@Controller('kiotviet/webhook')
export class KiotVietWebhookController {
  constructor(private readonly service: KiotVietService) {}

  @Post('stock')
  @HttpCode(200)
  stock(
    @Headers('x-hub-signature') signature: string | undefined,
    @Req() request: { rawBody?: Buffer },
  ) {
    return this.service.handleStockWebhook(signature, request.rawBody);
  }
}
