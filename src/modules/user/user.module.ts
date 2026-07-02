import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { MiniappUserController } from './miniapp-user.controller.js';
import { WebsiteUserController } from './website-user.controller.js';
import { UserController } from './user.controller.js';
import { UserService } from './user.service.js';

@Module({
  imports: [HttpModule],
  controllers: [UserController, MiniappUserController, WebsiteUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
