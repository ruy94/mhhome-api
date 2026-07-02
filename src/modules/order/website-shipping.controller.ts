import { Body, Controller, Post } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator.js';
import { WebsiteShippingEstimateDto } from './dto/create-order.dto.js';
import { OrderService } from './order.service.js';

@Public()
@Controller('website/shipping')
export class WebsiteShippingController {
  constructor(private readonly orderService: OrderService) {}

  @Post('estimate')
  async estimate(@Body() dto: WebsiteShippingEstimateDto) {
    return await this.orderService.estimateWebsiteShipping(dto);
  }
}
