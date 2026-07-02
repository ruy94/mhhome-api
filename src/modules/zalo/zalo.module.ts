import { Module } from '@nestjs/common';
import { ZaloService } from './zalo.service.js';
import { ZaloController } from './zalo.controller.js';

@Module({
  controllers: [ZaloController],
  providers: [ZaloService],
})
export class ZaloModule {}
