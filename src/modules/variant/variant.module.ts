import { Module } from '@nestjs/common';
import { VariantService } from './variant.service.js';
import { VariantController } from './variant.controller.js';
import { UploadModule } from '../upload/upload.module.js';
import { SaleworkIntegrationModule } from '../integrations/salework/salework.module.js';

@Module({
  imports: [UploadModule, SaleworkIntegrationModule],
  controllers: [VariantController],
  providers: [VariantService],
})
export class VariantModule {}
