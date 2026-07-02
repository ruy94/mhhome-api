import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { Public } from '../../common/decorators/public.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import type { AuthenticatedAdmin } from '../../common/types.js';

const COOKIE_NAME = 'refresh_token';

@ApiTags('auth')
@UseGuards(JwtAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập — trả về access token (JWT) và set refresh token cookie' })
  @ResponseMessage('Login successful')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const tokens = await this.authService.login(dto);
    this.setRefreshCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới access token bằng refresh token trong cookie' })
  @ResponseMessage('Token refreshed')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ access_token: string }> {
    const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (!refreshToken) throw new Error('No refresh token');

    const tokens = await this.authService.refreshToken(refreshToken);
    this.setRefreshCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất — xóa refresh token cookie' })
  @ResponseMessage('Logged out successfully')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const refreshToken = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (refreshToken) await this.authService.revokeRefreshToken(refreshToken);
    res.clearCookie(COOKIE_NAME);
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy thông tin admin đang đăng nhập' })
  @ResponseMessage('Profile retrieved')
  getMe(@CurrentAdmin() admin: AuthenticatedAdmin): AuthenticatedAdmin {
    return admin;
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu admin đang đăng nhập' })
  @ResponseMessage('Password changed successfully')
  async changePassword(
    @Body() dto: ChangePasswordDto,
    @CurrentAdmin('id') adminId: string,
  ): Promise<void> {
    await this.authService.changePassword(dto, adminId);
  }

  private setRefreshCookie(res: Response, token: string): void {
    const isProd = process.env['NODE_ENV'] === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });
  }
}
