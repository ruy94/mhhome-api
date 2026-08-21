import { BadGatewayException, BadRequestException, PayloadTooLargeException } from '@nestjs/common';

jest.mock('./sion-hub-credential.service.js', () => ({
  SionHubCredentialService: class {},
}));

import { SionHubClientService } from './sion-hub-client.service.js';

describe('SionHubClientService error mapping', () => {
  const credentials = {
    getApiKey: jest.fn().mockResolvedValue('api-key'),
  };

  const createService = () =>
    new SionHubClientService(credentials as never, {
      url: 'https://sion-hub.example/api',
      serviceName: 'sion-hub',
      apiKey: '',
      webhookSecret: '',
      timeoutMs: 1000,
    });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    [400, BadRequestException],
    [413, PayloadTooLargeException],
    [500, BadGatewayException],
  ])('maps upstream HTTP %i to %p', async (status, ExceptionClass) => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ message: 'provider error' }), { status }));

    await expect(createService().sendCampaign({} as never)).rejects.toBeInstanceOf(ExceptionClass);
  });

  it('maps network failures to HTTP 502', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('ECONNREFUSED'));

    await expect(createService().sendCampaign({} as never)).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
