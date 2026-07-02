import { Module } from '@nestjs/common';

import { SionHubModule } from '../integrations/sion-hub/sion-hub.module.js';
import { SocketModule } from '../socket/socket.module.js';
import { WebhookReceiverController } from './webhook-receiver.controller.js';
import { WebhookReceiverService } from './webhook-receiver.service.js';

@Module({
  imports: [SionHubModule, SocketModule],
  controllers: [WebhookReceiverController],
  providers: [WebhookReceiverService],
})
export class WebhookReceiverModule {}
