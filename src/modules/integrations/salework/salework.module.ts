import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import saleworkConfig from '../../../config/salework.config.js';
import { SaleworkClientService } from './salework-client.service.js';

@Module({
  imports: [ConfigModule.forFeature(saleworkConfig)],
  providers: [SaleworkClientService],
  exports: [SaleworkClientService],
})
export class SaleworkIntegrationModule {}
