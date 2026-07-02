import { Body, Controller, Get, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { CurrentWebsiteUser } from '../../common/decorators/current-website-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { WebsiteJwtAuthGuard } from '../../common/guards/website-jwt-auth.guard.js';
import { AuthService } from './auth.service.js';
import type { WebsiteAuthResponse } from './auth.service.js';
import { WebsiteLoginDto } from './dto/website-login.dto.js';
import { WebsiteRegisterDto } from './dto/website-register.dto.js';
import { UserService } from '../user/user.service.js';
import { UpdateWebsiteUserDto } from '../user/dto/update-website-user.dto.js';

const WEBSITE_COOKIE_NAME = 'website_refresh_token';

@ApiTags('website-auth')
@Public()
@Controller('website/auth')
export class WebsiteAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản khách hàng website' })
  @ResponseMessage('Register successful')
  async register(
    @Body() dto: WebsiteRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebsiteAuthResponse> {
    const result = await this.authService.registerWebsite(dto);
    this.setRefreshCookie(res, result.refresh_token);
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập khách hàng website' })
  @ResponseMessage('Login successful')
  async login(
    @Body() dto: WebsiteLoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebsiteAuthResponse> {
    const result = await this.authService.loginWebsite(dto);
    this.setRefreshCookie(res, result.refresh_token);
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token khách hàng website' })
  @ResponseMessage('Token refreshed')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<WebsiteAuthResponse> {
    const refreshToken = req.cookies?.[WEBSITE_COOKIE_NAME] as string | undefined;
    const result = await this.authService.refreshWebsiteToken(refreshToken);
    this.setRefreshCookie(res, result.refresh_token);
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất khách hàng website' })
  @ResponseMessage('Logged out successfully')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies?.[WEBSITE_COOKIE_NAME] as string | undefined;
    if (refreshToken) await this.authService.revokeRefreshToken(refreshToken);
    res.clearCookie(WEBSITE_COOKIE_NAME, this.refreshCookieOptions());
  }

  @UseGuards(WebsiteJwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin khách hàng website đang đăng nhập' })
  @ResponseMessage('Profile retrieved')
  async me(@CurrentWebsiteUser('id') userId: number) {
    return this.authService.getWebsiteMe(userId);
  }

  @UseGuards(WebsiteJwtAuthGuard)
  @Put('me')
  @ApiOperation({ summary: 'Cập nhật hồ sơ khách hàng website đang đăng nhập' })
  @ResponseMessage('Profile updated')
  async updateMe(
    @CurrentWebsiteUser('id') userId: number,
    @Body() dto: UpdateWebsiteUserDto,
  ) {
    return this.userService.updateWebsiteUser(userId, dto);
  }

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(WEBSITE_COOKIE_NAME, token, {
      ...this.refreshCookieOptions(),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private refreshCookieOptions() {
    const isProd = process.env['NODE_ENV'] === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    } as const;
  }
}
