import { Module } from '@nestjs/common';
import { AddressService } from './address.service.js';
import { AddressController } from './address.controller.js';
import { WebsiteAddressController } from './website-address.controller.js';

@Module({
  controllers: [AddressController, WebsiteAddressController],
  providers: [AddressService],
})
export class AddressModule {}
