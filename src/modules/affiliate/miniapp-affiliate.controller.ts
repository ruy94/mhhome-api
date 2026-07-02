import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { AffiliateService } from './affiliate.service.js';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto.js';
import { RegisterAffiliateDto } from './dto/register-affiliate.dto.js';

@Public()
@Controller('miniapp/affiliates')
export class MiniappAffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Post('register')
  async register(@Body() dto: RegisterAffiliateDto) {
    return await this.affiliateService.register(dto);
  }

  @Get('users/:userId/profile')
  async getMyProfile(@Param('userId', ParseIntPipe) userId: number) {
    return await this.affiliateService.getMyProfile(userId);
  }

  @Get('users/:userId/commissions')
  async getMyCommissions(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.affiliateService.getMyCommissions(userId, pageOptionsDto);
  }

  @Post('withdrawals')
  async createWithdrawal(@Body() dto: CreateWithdrawalDto) {
    return await this.affiliateService.createWithdrawal(dto);
  }

  @Get('users/:userId/withdrawals')
  async getMyWithdrawals(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    return await this.affiliateService.getMyWithdrawals(userId, pageOptionsDto);
  }
}
