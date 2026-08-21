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

    let shouldEmitBalance = true;

    switch (payload.event) {
      case SionHubWebhookEvent.CREDENTIAL_ROTATED:
        await this.handleCredentialRotated(payload.data);
        break;
      case SionHubWebhookEvent.CAMPAIGN_COMPLETED:
        shouldEmitBalance = await this.handleCampaignCompleted(payload.data);
        break;
      case SionHubWebhookEvent.ORDER_PAID:
      case SionHubWebhookEvent.SUBSCRIPTION_RENEWED:
        this.handleBillingEvent(payload.data);
        break;
      default:
        this.logger.debug(`No scaffold handler registered for ${payload.event}`);
        break;
    }

    if (shouldEmitBalance) this.emitBalanceIfPresent(payload.data);
    return { received: true };
  }

  private async handleCredentialRotated(data: Record<string, unknown>): Promise<void> {
    if (typeof data['apiKey'] !== 'string' || !data['apiKey']) {
      this.logger.warn('credential.rotated webhook ignored because apiKey is missing');
      return;
    }

    await this.sionHubCredentials.rotateApiKey(data['apiKey']);
  }

  private async handleCampaignCompleted(data: Record<string, unknown>): Promise<boolean> {
    const localCampaignId = this.getNumber(
      data['localCampaignId'] ??
        data['refId'] ??
        (this.isRecord(data['metadata'])
          ? (data['metadata']['localCampaignId'] ?? data['metadata']['refId'])
          : undefined),
    );

    if (!localCampaignId || !Number.isInteger(localCampaignId) || localCampaignId < 1) {
      this.logger.warn('campaign.completed webhook ignored because localCampaignId is missing');
      return false;
    }

    const success = this.getNonNegativeInteger(data['success']);
    const failed = this.getNonNegativeInteger(data['failed']);
    const payloadTotal = this.getNonNegativeInteger(data['total']);
    const providerCampaignId = this.getString(data['providerCampaignId']);
    const finalCost = this.getNonNegativeNumber(data['finalCost'] ?? data['cost']);
    const failReason = this.getString(data['failReason']);

    if (
      success === undefined ||
      failed === undefined ||
      payloadTotal === undefined ||
      finalCost === undefined ||
      !providerCampaignId
    ) {
      this.logger.warn(
        `campaign.completed webhook for campaign #${localCampaignId} ignored because its final snapshot is incomplete`,
      );
      return false;
    }

    const campaign = await this.prisma.campaign.findUnique({
      where: { id: localCampaignId },
      select: {
        total: true,
        sent: true,
        success: true,
        failed: true,
        cost: true,
        status: true,
        providerCampaignId: true,
      },
    });

    if (!campaign) {
      this.logger.warn(
        `campaign.completed webhook ignored: campaign #${localCampaignId} not found`,
      );
      return false;
    }

    const processed = success + failed;
    if (payloadTotal !== campaign.total || processed !== campaign.total) {
      this.logger.warn(
        `Incomplete campaign.completed snapshot ignored for campaign #${localCampaignId}: ${processed}/${campaign.total}`,
      );
      return false;
    }

    if (campaign.providerCampaignId && campaign.providerCampaignId !== providerCampaignId) {
      this.logger.warn(
        `campaign.completed webhook ignored for campaign #${localCampaignId}: provider campaign ID mismatch`,
      );
      return false;
    }

    if (campaign.status === CampaignStatus.COMPLETED) {
      const isSameSnapshot =
        campaign.sent === processed &&
        campaign.success === success &&
        campaign.failed === failed &&
        Number(campaign.cost) === finalCost;

      if (!isSameSnapshot) {
        this.logger.warn(`Conflicting completed snapshot ignored for campaign #${localCampaignId}`);
      }
      return isSameSnapshot;
    }

    await this.prisma.campaign.update({
      where: { id: localCampaignId },
      data: {
        ...(providerCampaignId && { providerCampaignId }),
        success,
        failed,
        sent: processed,
        status: CampaignStatus.COMPLETED,
        cost: finalCost,
        failReason,
      },
    });

    this.logger.log(`Updated campaign #${localCampaignId} from SionHub webhook`);
    return true;
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

  private getNumber(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string' && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return undefined;
  }

  private getNonNegativeInteger(value: unknown): number | undefined {
    const parsed = this.getNumber(value);
    return parsed !== undefined && Number.isInteger(parsed) && parsed >= 0 ? parsed : undefined;
  }

  private getNonNegativeNumber(value: unknown): number | undefined {
    const parsed = this.getNumber(value);
    return parsed !== undefined && parsed >= 0 ? parsed : undefined;
  }

  private getString(value: unknown): string | undefined {
    return typeof value === 'string' && value ? value : undefined;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
