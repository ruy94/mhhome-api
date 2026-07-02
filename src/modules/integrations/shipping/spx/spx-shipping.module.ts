import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import shippingConfig from '../../../../config/shipping.config.js';
import { SpxShippingClientService } from './spx-shipping-client.service.js';
import { SpxShippingSignerService } from './spx-shipping-signer.service.js';

@Module({
  imports: [ConfigModule.forFeature(shippingConfig)],
  providers: [SpxShippingClientService, SpxShippingSignerService],
  exports: [SpxShippingClientService, SpxShippingSignerService],
})
export class SpxShippingModule {}
