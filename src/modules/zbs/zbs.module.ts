import { Module } from '@nestjs/common';

import { ZbsController } from './zbs.controller.js';
import { ZbsService } from './zbs.service.js';

@Module({
  controllers: [ZbsController],
  providers: [ZbsService],
})
export class ZbsModule {}
