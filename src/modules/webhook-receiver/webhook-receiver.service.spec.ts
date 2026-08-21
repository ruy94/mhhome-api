jest.mock('../../generated/prisma/client.js', () => ({
  CampaignStatus: {
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
  },
}));
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../integrations/sion-hub/sion-hub-credential.service.js', () => ({
  SionHubCredentialService: class {},
}));
jest.mock('../socket/app/app.gateway.js', () => ({ AppGateway: class {} }));

import { CampaignStatus } from '../../generated/prisma/client.js';
import { SionHubWebhookEvent } from '../integrations/sion-hub/types.js';
import { WebhookReceiverService } from './webhook-receiver.service.js';

describe('WebhookReceiverService campaign.completed', () => {
  const prisma = {
    campaign: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  const credentials = { rotateApiKey: jest.fn() };
  const appGateway = {
    emitBalanceUpdate: jest.fn(),
    emitTenantNotification: jest.fn(),
  };

  let service: WebhookReceiverService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.campaign.findUnique.mockResolvedValue({
      total: 3684,
      sent: 0,
      success: 0,
      failed: 0,
      cost: 0,
      status: CampaignStatus.PROCESSING,
      providerCampaignId: 'provider-campaign-id',
    });
    prisma.campaign.update.mockResolvedValue({});
    service = new WebhookReceiverService(
      credentials as never,
      prisma as never,
      appGateway as never,
    );
  });

  it('applies the complete 3,684-message snapshot with actual cost', async () => {
    await service.handleSionHubEvent({
      event: SionHubWebhookEvent.CAMPAIGN_COMPLETED,
      timestamp: Date.now(),
      data: {
        localCampaignId: 123,
        providerCampaignId: 'provider-campaign-id',
        total: 3684,
        success: 2840,
        failed: 844,
        status: 'COMPLETED',
        finalCost: 852000,
        currentBalance: 295990,
        failReason: 'Thanh toán ZBS Account thất bại',
      },
    });

    expect(prisma.campaign.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        providerCampaignId: 'provider-campaign-id',
        success: 2840,
        failed: 844,
        sent: 3684,
        status: CampaignStatus.COMPLETED,
        cost: 852000,
        failReason: 'Thanh toán ZBS Account thất bại',
      },
    });
    expect(appGateway.emitBalanceUpdate).toHaveBeenCalledWith(295990);
  });

  it('ignores a premature provider snapshot and its intermediate balance', async () => {
    await service.handleSionHubEvent({
      event: SionHubWebhookEvent.CAMPAIGN_COMPLETED,
      timestamp: Date.now(),
      data: {
        localCampaignId: 123,
        providerCampaignId: 'provider-campaign-id',
        total: 3684,
        success: 2496,
        failed: 353,
        status: 'FAILED',
        finalCost: 0,
        currentBalance: 295690,
      },
    });

    expect(prisma.campaign.update).not.toHaveBeenCalled();
    expect(appGateway.emitBalanceUpdate).not.toHaveBeenCalled();
  });

  it('treats an identical completed snapshot as an idempotent duplicate', async () => {
    prisma.campaign.findUnique.mockResolvedValue({
      total: 3684,
      sent: 3684,
      success: 2840,
      failed: 844,
      cost: 852000,
      status: CampaignStatus.COMPLETED,
      providerCampaignId: 'provider-campaign-id',
    });

    await service.handleSionHubEvent({
      event: SionHubWebhookEvent.CAMPAIGN_COMPLETED,
      timestamp: Date.now(),
      data: {
        localCampaignId: 123,
        providerCampaignId: 'provider-campaign-id',
        total: 3684,
        success: 2840,
        failed: 844,
        status: 'COMPLETED',
        finalCost: 852000,
        currentBalance: 295990,
      },
    });

    expect(prisma.campaign.update).not.toHaveBeenCalled();
    expect(appGateway.emitBalanceUpdate).toHaveBeenCalledWith(295990);
  });
});
