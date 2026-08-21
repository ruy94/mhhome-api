import 'reflect-metadata';

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { CreateCampaignDto, MAX_CAMPAIGN_RECEIVERS } from './create-campaign.dto.js';

function makeDto(receiverCount: number): CreateCampaignDto {
  return plainToInstance(CreateCampaignDto, {
    campaignName: 'Campaign test',
    oaId: 'oa-id',
    tenantTemplateId: 'template-id',
    receivers: Array.from({ length: receiverCount }, (_, index) => ({
      phone: `090${String(index).padStart(7, '0')}`,
      templateData: {},
    })),
  });
}

describe('CreateCampaignDto', () => {
  it('accepts exactly 4,000 receivers', async () => {
    await expect(validate(makeDto(MAX_CAMPAIGN_RECEIVERS))).resolves.toHaveLength(0);
  });

  it('rejects more than 4,000 receivers with a friendly message', async () => {
    const errors = await validate(makeDto(MAX_CAMPAIGN_RECEIVERS + 1));
    const receiversError = errors.find((error) => error.property === 'receivers');

    expect(receiversError?.constraints?.arrayMaxSize).toBe(
      'Mỗi chiến dịch tối đa 4.000 người nhận',
    );
  });
});
