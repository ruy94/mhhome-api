import { Body, Controller, Get, Post } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderService } from './order.service.js';

@Public()
@Controller('miniapp/shipping')
export class MiniappShippingController {
  constructor(private readonly orderService: OrderService) {}

  @Get('providers')
  providers() {
    return this.orderService.getShippingProviders();
  }

  @Post('estimate')
  async estimate(@Body() dto: CreateOrderDto) {
    return await this.orderService.estimateMiniappShipping(dto);
  }
}
