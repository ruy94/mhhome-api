import {
  Body,
  Controller,
  Get,
  Param,
  UseGuards,
  Patch,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto.js';
import { UpdateTrackingCodeOrderDto } from './dto/update-tracking-code.dto.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { OrderPageOptionsDto } from './dto/order-page-options.dto.js';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @RequirePermissions('order:view')
  async findAll(@Query() pageOptionsDto: OrderPageOptionsDto) {
    return await this.orderService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('order:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('order:update_status')
  async updateStatusOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusOrderDto,
  ) {
    return await this.orderService.updateStatusOrder(id, dto);
  }

  @Put(':orderId/tracking-code/reverse')
  @RequirePermissions('order:update_tracking')
  async reverseTrackingCode(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.orderService.reverseTrackingCode(orderId);
  }

  @Put(':orderId/tracking-code')
  @RequirePermissions('order:update_tracking')
  async updateTrackingCode(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateTrackingCodeOrderDto,
  ) {
    return await this.orderService.updateTrackingCode(orderId, dto);
  }
}
