import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator.js';
import { WebhookSignatureGuard } from '../../common/guards/webhook-signature.guard.js';
import { WebhookReceiverService } from './webhook-receiver.service.js';
import type { SionHubWebhookPayload } from '../integrations/sion-hub/types.js';

@ApiTags('webhooks')
@Public()
@Controller('webhook')
export class WebhookReceiverController {
  constructor(private readonly webhookReceiver: WebhookReceiverService) {}

  @Post('from-provider')
  @HttpCode(HttpStatus.OK)
  @UseGuards(WebhookSignatureGuard)
  @ApiOperation({ summary: 'Nhận webhook callback từ SionHub' })
  handleProviderWebhook(@Body() payload: SionHubWebhookPayload): Promise<{ received: true }> {
    return this.webhookReceiver.handleSionHubEvent(payload);
  }
}
