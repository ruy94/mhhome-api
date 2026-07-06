import { Module } from '@nestjs/common';

import { SaleworkIntegrationModule } from '../integrations/salework/salework.module.js';
import { SaleworkController } from './salework.controller.js';
import { SaleworkService } from './salework.service.js';

@Module({
  imports: [SaleworkIntegrationModule],
  controllers: [SaleworkController],
  providers: [SaleworkService],
})
export class SaleworkModule {}
