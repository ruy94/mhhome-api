import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';

import { Public } from '../../common/decorators/public.decorator.js';
import { ShippingService } from './shipping.service.js';
import { VtpWebhookSignatureGuard } from './vtp-webhook-signature.guard.js';

@Public()
@Controller('webhook/vtp')
@UseGuards(VtpWebhookSignatureGuard)
export class VtpWebhookController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  handle(@Body() payload: unknown) {
    return this.shippingService.handleVtpWebhook(payload);
  }
}
