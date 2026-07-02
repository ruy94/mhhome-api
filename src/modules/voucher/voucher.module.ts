import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service.js';
import { VoucherController } from './voucher.controller.js';
import { MiniappVoucherController } from './miniapp-voucher.controller.js';
import { WebsiteVoucherController } from './website-voucher.controller.js';

@Module({
  controllers: [VoucherController, MiniappVoucherController, WebsiteVoucherController],
  providers: [VoucherService],
})
export class VoucherModule {}
