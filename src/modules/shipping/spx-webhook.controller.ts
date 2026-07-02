import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { Public } from '../../common/decorators/public.decorator.js';
import { ShippingService } from './shipping.service.js';
import { SpxWebhookSignatureGuard } from './spx-webhook-signature.guard.js';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

@Public()
@Controller('webhook/spx')
@UseGuards(SpxWebhookSignatureGuard)
export class SpxWebhookController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  handleDefault(@Body() payload: unknown, @Req() request: RequestWithRawBody) {
    return this.shippingService.handleSpxWebhook('spx', payload, request.rawBody);
  }

  @Post(':eventType')
  @HttpCode(HttpStatus.OK)
  handleTyped(
    @Param('eventType') eventType: string,
    @Body() payload: unknown,
    @Req() request: RequestWithRawBody,
  ) {
    return this.shippingService.handleSpxWebhook(eventType, payload, request.rawBody);
  }
}
