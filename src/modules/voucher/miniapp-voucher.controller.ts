import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { VoucherService } from './voucher.service.js';
import { SaveVoucherDto } from './dto/save-voucher.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { VoucherQueryDto } from './dto/voucher-query.dto.js';

@Public()
@Controller('miniapp/vouchers')
export class MiniappVoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('public')
  async getPublicVouchers(@Query() pageOptionsDto: VoucherQueryDto) {
    return await this.voucherService.getMiniappPublicVouchers(pageOptionsDto);
  }

  @Get('hidden/:voucherCode')
  async getHiddenVoucher(@Param('voucherCode') voucherCode: string) {
    return await this.voucherService.getMiniappHiddenVoucher(voucherCode);
  }

  @Get('users/:userId/wallet')
  async getWallet(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: VoucherQueryDto,
  ) {
    return await this.voucherService.getMiniappVoucherWallet(userId, pageOptionsDto);
  }

  @Post('save')
  async saveVoucher(@Body() dto: SaveVoucherDto) {
    return await this.voucherService.saveMiniappVoucher(dto.userId, dto.voucherId);
  }
}
