import { BadGatewayException } from '@nestjs/common';

jest.mock('../../generated/prisma/client.js', () => ({
  CampaignStatus: {
    PROCESSING: 'PROCESSING',
    FAILED: 'FAILED',
  },
}));
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../integrations/sion-hub/sion-hub-client.service.js', () => ({
  SionHubClientService: class {},
}));

import { CampaignStatus } from '../../generated/prisma/client.js';
import { ZbsService } from './zbs.service.js';
import type { CreateCampaignDto } from './dto/create-campaign.dto.js';

function makeReceivers(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    phone: `090${String(index).padStart(7, '0')}`,
    templateData: { customer_name: `Customer ${index}` },
  }));
}

describe('ZbsService.createCampaign', () => {
  const prisma = {
    campaign: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };
  const sionHub = {
    sendCampaign: jest.fn(),
  };
  const zbsCache = {
    getQuotas: jest.fn(),
    incrementQuotas: jest.fn(),
  };
  const configService = {
    get: jest.fn(),
  };

  let service: ZbsService;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.campaign.create.mockResolvedValue({ id: 123 });
    prisma.campaign.update.mockResolvedValue({});
    zbsCache.getQuotas.mockResolvedValue(new Map());
    zbsCache.incrementQuotas.mockResolvedValue(undefined);
    service = new ZbsService(
      configService as never,
      prisma as never,
      sionHub as never,
      zbsCache as never,
    );
  });

  it('sends 3,684 receivers in one provider campaign and increments their quotas', async () => {
    const receivers = makeReceivers(3684);
    const dto: CreateCampaignDto = {
      campaignName: 'Campaign 3684',
      oaId: 'oa-id',
      tenantTemplateId: 'template-id',
      receivers,
    };
    sionHub.sendCampaign.mockResolvedValue({
      campaignId: 'provider-campaign-id',
      totalMessages: receivers.length,
      estimatedCost: 736800,
    });

    const result = await service.createCampaign(dto, 'admin-id');

    expect(sionHub.sendCampaign).toHaveBeenCalledTimes(1);
    expect(sionHub.sendCampaign.mock.calls[0]?.[0].receivers).toHaveLength(3684);
    expect(zbsCache.incrementQuotas).toHaveBeenCalledTimes(1);
    expect(zbsCache.incrementQuotas.mock.calls[0]?.[0]).toBe('template-id');
    expect(zbsCache.incrementQuotas.mock.calls[0]?.[1]).toHaveLength(3684);
    expect(prisma.campaign.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        providerCampaignId: 'provider-campaign-id',
        status: CampaignStatus.PROCESSING,
        failReason: null,
      },
    });
    expect(result).toEqual(
      expect.objectContaining({
        localCampaignId: 123,
        totalChunks: 1,
        totalValid: 3684,
      }),
    );
  });

  it('marks the local campaign failed and does not increment quota when SionHub rejects it', async () => {
    const dto: CreateCampaignDto = {
      campaignName: 'Failed campaign',
      oaId: 'oa-id',
      tenantTemplateId: 'template-id',
      receivers: makeReceivers(1),
    };
    sionHub.sendCampaign.mockRejectedValue(new BadGatewayException('SionHub unavailable'));

    await expect(service.createCampaign(dto, 'admin-id')).rejects.toBeInstanceOf(
      BadGatewayException,
    );

    expect(prisma.campaign.update).toHaveBeenCalledWith({
      where: { id: 123 },
      data: {
        status: CampaignStatus.FAILED,
        failReason: 'SionHub unavailable',
      },
    });
    expect(zbsCache.incrementQuotas).not.toHaveBeenCalled();
  });
});
