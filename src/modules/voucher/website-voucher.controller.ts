import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentWebsiteUser } from '../../common/decorators/current-website-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { WebsiteJwtAuthGuard } from '../../common/guards/website-jwt-auth.guard.js';
import { VoucherQueryDto } from './dto/voucher-query.dto.js';
import { SaveVoucherDto } from './dto/save-voucher.dto.js';
import { VoucherService } from './voucher.service.js';

@Public()
@Controller('website/vouchers')
export class WebsiteVoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('public')
  async getPublicVouchers(@Query() pageOptionsDto: VoucherQueryDto) {
    return await this.voucherService.getWebsitePublicVouchers(pageOptionsDto);
  }

  @Get('hidden/:voucherCode')
  async getHiddenVoucher(@Param('voucherCode') voucherCode: string) {
    return await this.voucherService.getWebsiteHiddenVoucher(voucherCode);
  }

  @Get('users/:userId/wallet')
  async getWallet(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: VoucherQueryDto,
  ) {
    return await this.voucherService.getWebsiteVoucherWallet(userId, pageOptionsDto);
  }

  @UseGuards(WebsiteJwtAuthGuard)
  @Get('me/wallet')
  async getMyWallet(
    @CurrentWebsiteUser('id') userId: number,
    @Query() pageOptionsDto: VoucherQueryDto,
  ) {
    return await this.voucherService.getWebsiteVoucherWallet(userId, pageOptionsDto);
  }

  @Post('save')
  async saveVoucher(@Body() dto: SaveVoucherDto) {
    return await this.voucherService.saveWebsiteVoucher(dto.userId, dto.voucherId);
  }
}
