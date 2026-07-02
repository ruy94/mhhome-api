import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { SyncCartDto } from './dto/sync-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { CartService } from './cart.service.js';

@ApiTags('miniapp-cart')
@Public()
@Controller('miniapp/users/:userId/cart')
export class MiniappCartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng Zalo Mini App của user' })
  findAll(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getMiniappCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng Zalo Mini App' })
  addItem(@Param('userId', ParseIntPipe) userId: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addMiniappItem(userId, dto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng Zalo Mini App' })
  updateItem(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateMiniappItem(userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Xóa một sản phẩm khỏi giỏ hàng Zalo Mini App' })
  removeItem(@Param('userId', ParseIntPipe) userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeMiniappItem(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng Zalo Mini App' })
  clear(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.clearMiniappCart(userId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Đồng bộ giỏ hàng storage device lên server cho Zalo Mini App' })
  sync(@Param('userId', ParseIntPipe) userId: number, @Body() dto: SyncCartDto) {
    return this.cartService.syncMiniappCart(userId, dto);
  }
}
