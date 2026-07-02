import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import appConfig from '../../config/app.config.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtStrategy } from './jwt.strategy.js';
import { WebsiteAuthController } from './website-auth.controller.js';
import { WebsiteJwtStrategy } from './website-jwt.strategy.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule mà không có secret cứng — strategy tự inject config và sign với secret riêng
    JwtModule.register({}),
    UserModule,
  ],
  controllers: [AuthController, WebsiteAuthController],
  providers: [AuthService, JwtStrategy, WebsiteJwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
