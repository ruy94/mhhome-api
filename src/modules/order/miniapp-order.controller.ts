import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { OrderService } from './order.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto.js';

@Public()
@Controller('miniapp/orders')
export class MiniappOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('quote')
  async quote(@Body() dto: CreateOrderDto) {
    return await this.orderService.quoteMiniappOrder(dto);
  }

  @Post()
  async create(@Body() dto: CreateOrderDto) {
    return await this.orderService.createMiniappOrder(dto);
  }

  @Get('users/:userId')
  async getOrdersByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.orderService.getMiniappOrdersByUser(userId, pageOptionsDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.orderService.findMiniappOrder(id);
  }

  @Patch(':id')
  async updateStatusOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusOrderDto,
  ) {
    return await this.orderService.updateMiniappStatusOrder(id, dto);
  }
}
