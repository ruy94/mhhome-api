import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import { SionHubCredentialService } from '../integrations/sion-hub/sion-hub-credential.service.js';
import { SionHubWebhookEvent, type SionHubWebhookPayload } from '../integrations/sion-hub/types.js';
import { AppGateway } from '../socket/app/app.gateway.js';
import { CampaignStatus } from '../../generated/prisma/client.js';

@Injectable()
export class WebhookReceiverService {
  private readonly logger = new Logger(WebhookReceiverService.name);

  constructor(
    private readonly sionHubCredentials: SionHubCredentialService,
    private readonly prisma: PrismaService,
    private readonly appGateway: AppGateway,
  ) {}

  async handleSionHubEvent(payload: SionHubWebhookPayload): Promise<{ received: true }> {
    this.logger.log(`Received SionHub webhook: ${payload.event}`);

    switch (payload.event) {
      case SionHubWebhookEvent.CREDENTIAL_ROTATED:
        await this.handleCredentialRotated(payload.data);
        break;
      case SionHubWebhookEvent.CAMPAIGN_COMPLETED:
        await this.handleCampaignCompleted(payload.data);
        break;
      case SionHubWebhookEvent.ORDER_PAID:
      case SionHubWebhookEvent.SUBSCRIPTION_RENEWED:
        this.handleBillingEvent(payload.data);
        break;
      default:
        this.logger.debug(`No scaffold handler registered for ${payload.event}`);
        break;
    }

    this.emitBalanceIfPresent(payload.data);
    return { received: true };
  }

  private async handleCredentialRotated(data: Record<string, unknown>): Promise<void> {
    if (typeof data['apiKey'] !== 'string' || !data['apiKey']) {
      this.logger.warn('credential.rotated webhook ignored because apiKey is missing');
      return;
    }

    await this.sionHubCredentials.rotateApiKey(data['apiKey']);
  }

  private async handleCampaignCompleted(data: Record<string, unknown>): Promise<void> {
    const localCampaignId = this.getNumber(
      data['localCampaignId'] ??
        data['refId'] ??
        (this.isRecord(data['metadata'])
          ? (data['metadata']['localCampaignId'] ?? data['metadata']['refId'])
          : undefined),
    );

    if (!localCampaignId) {
      this.logger.warn('campaign.completed webhook ignored because localCampaignId is missing');
      return;
    }

    const success = this.getNumber(data['success']) ?? 0;
    const failed = this.getNumber(data['failed']) ?? 0;
    const providerCampaignId = this.getString(data['providerCampaignId']);
    const finalCost = this.getNumber(data['finalCost'] ?? data['cost']) ?? 0;
    const failReason = this.getString(data['failReason']);
    const status = this.toCampaignStatus(data['status']);

    await this.prisma.campaign.update({
      where: { id: localCampaignId },
      data: {
        ...(providerCampaignId && { providerCampaignId }),
        success,
        failed,
        sent: success + failed,
        status,
        cost: finalCost,
        failReason,
      },
    });

    this.logger.log(`Updated campaign #${localCampaignId} from SionHub webhook`);
  }

  private handleBillingEvent(data: Record<string, unknown>): void {
    if (typeof data['message'] === 'string') {
      this.appGateway.emitTenantNotification(data['message']);
    }
  }

  private emitBalanceIfPresent(data: Record<string, unknown>): void {
    const balance = this.getNumber(data['currentBalance']);
    if (balance !== undefined) {
      this.appGateway.emitBalanceUpdate(balance);
    }
  }

  private toCampaignStatus(value: unknown): CampaignStatus {
    if (value === CampaignStatus.FAILED) return CampaignStatus.FAILED;
    if (value === CampaignStatus.PROCESSING) return CampaignStatus.PROCESSING;
    return CampaignStatus.COMPLETED;
  }

  private getNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
  }

  private getString(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
