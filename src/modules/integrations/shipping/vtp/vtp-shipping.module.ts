import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import shippingConfig from '../../../../config/shipping.config.js';
import { VtpShippingClientService } from './vtp-shipping-client.service.js';

@Module({
  imports: [ConfigModule.forFeature(shippingConfig)],
  providers: [VtpShippingClientService],
  exports: [VtpShippingClientService],
})
export class VtpShippingModule {}
