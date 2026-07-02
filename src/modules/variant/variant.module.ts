import { Module } from '@nestjs/common';
import { VariantService } from './variant.service.js';
import { VariantController } from './variant.controller.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
  imports: [UploadModule],
  controllers: [VariantController],
  providers: [VariantService],
})
export class VariantModule {}
