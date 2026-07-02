import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentWebsiteUser } from '../../common/decorators/current-website-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { WebsiteJwtAuthGuard } from '../../common/guards/website-jwt-auth.guard.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto.js';
import { OrderService } from './order.service.js';

@Public()
@Controller('website/orders')
export class WebsiteOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('quote')
  async quote(@Body() dto: CreateOrderDto) {
    return await this.orderService.quoteWebsiteOrder(dto);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return await this.orderService.createWebsiteOrder(dto);
  }

  @UseGuards(WebsiteJwtAuthGuard)
  @Get('me')
  async getMyOrders(
    @CurrentWebsiteUser('id') userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.orderService.getWebsiteOrdersByUser(userId, pageOptionsDto);
  }

  @UseGuards(WebsiteJwtAuthGuard)
  @Get('me/:id')
  async getMyOrder(
    @CurrentWebsiteUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.orderService.findWebsiteOrderForUser(userId, id);
  }

  @Get('users/:userId')
  async getOrdersByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.orderService.getWebsiteOrdersByUser(userId, pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findWebsiteOrder(id);
  }

  @Patch(':id')
  async updateStatusOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusOrderDto,
  ) {
    return await this.orderService.updateWebsiteStatusOrder(id, dto);
  }
}
