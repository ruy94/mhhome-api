import { Body, Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { ShippingService } from './shipping.service.js';
import { ConfirmSpxOrderDto } from './dto/confirm-spx-order.dto.js';
import { BatchSpxOrdersDto } from './dto/batch-spx-orders.dto.js';
import { GetShippingAwbDto } from './dto/get-shipping-awb.dto.js';

@Controller('shipping')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('spx/orders/batch')
  @RequirePermissions('order:update_tracking')
  createSpxOrders(@Body() dto: BatchSpxOrdersDto) {
    return this.shippingService.createSpxOrders(dto.orderIds);
  }

  @Post('spx/orders/:orderId')
  @RequirePermissions('order:update_tracking')
  createSpxOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.shippingService.createSpxOrder(orderId);
  }

  @Post('orders/awb')
  @RequirePermissions('order:update_tracking')
  getAwb(@Body() dto: GetShippingAwbDto) {
    return this.shippingService.getAwbForOrders(dto);
  }

  @Post('orders/:orderId/cancel')
  @RequirePermissions('order:update_tracking')
  cancelShippingOrder(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.shippingService.cancelShippingOrder(orderId);
  }

  @Post('batches/:id/refresh')
  @RequirePermissions('order:update_tracking')
  refreshBatch(@Param('id', ParseIntPipe) id: number) {
    return this.shippingService.refreshBatch(id);
  }

  @Post('orders/:orderId/actual-fee/refresh')
  @RequirePermissions('order:view')
  refreshActualFee(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.shippingService.refreshActualFee(orderId);
  }

  @Post('orders/:orderId/tracking/refresh')
  @RequirePermissions('order:view')
  refreshTracking(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.shippingService.refreshTracking(orderId);
  }

  @Post('orders/:orderId/confirm')
  @RequirePermissions('order:update_tracking')
  confirmSpxOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: ConfirmSpxOrderDto,
  ) {
    return this.shippingService.confirmSpxOrder(orderId, dto.operation);
  }

  @Post('spx/pickup-timeslots')
  @RequirePermissions('order:update_tracking')
  getPickupTimeslots() {
    return this.shippingService.getPickupTimeslots();
  }
}
