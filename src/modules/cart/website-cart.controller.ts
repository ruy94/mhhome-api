import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentWebsiteUser } from '../../common/decorators/current-website-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { WebsiteJwtAuthGuard } from '../../common/guards/website-jwt-auth.guard.js';
import { CartService } from './cart.service.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { SyncCartDto } from './dto/sync-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';

@ApiTags('website-cart')
@Public()
@UseGuards(WebsiteJwtAuthGuard)
@Controller('website/cart')
export class WebsiteCartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy giỏ hàng website của khách hàng đang đăng nhập' })
  findAll(@CurrentWebsiteUser('id') userId: number) {
    return this.cartService.getWebsiteCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng website' })
  addItem(@CurrentWebsiteUser('id') userId: number, @Body() dto: AddCartItemDto) {
    return this.cartService.addWebsiteItem(userId, dto);
  }

  @Put('items/:id')
  @ApiOperation({ summary: 'Cập nhật số lượng sản phẩm trong giỏ hàng website' })
  updateItem(
    @CurrentWebsiteUser('id') userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateWebsiteItem(userId, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Xóa một sản phẩm khỏi giỏ hàng website' })
  removeItem(@CurrentWebsiteUser('id') userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.cartService.removeWebsiteItem(userId, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng website' })
  clear(@CurrentWebsiteUser('id') userId: number) {
    return this.cartService.clearWebsiteCart(userId);
  }

  @Post('sync')
  @ApiOperation({ summary: 'Đồng bộ giỏ hàng local storage lên server cho website' })
  sync(@CurrentWebsiteUser('id') userId: number, @Body() dto: SyncCartDto) {
    return this.cartService.syncWebsiteCart(userId, dto);
  }
}
