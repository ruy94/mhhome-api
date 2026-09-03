import { BadGatewayException } from '@nestjs/common';

import { MarketplaceClientService } from './marketplace-client.service.js';

describe('MarketplaceClientService', () => {
  const originalFetch = global.fetch;
  const hmac = {
    canonical: jest.fn().mockReturnValue('canonical'),
    hashBody: jest.fn().mockReturnValue('body-hash'),
    sign: jest.fn().mockReturnValue('signature'),
  };
  const config = {
    enabled: true,
    checkoutEnabled: true,
    baseUrl: 'https://marketplace.test',
    shopCode: 'SHOP',
    keyId: 'key-id',
    hmacSecret: 'secret',
    requestTimeoutMs: 1_000,
  };

  afterEach(() => {
    global.fetch = originalFetch;
    jest.clearAllMocks();
  });

  it('preserves structured Marketplace shipping failure details', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 502,
          message: 'Không thể tạo vận đơn ViettelPost',
          code: 'VTP_SHIPPING_FAILED',
          details: {
            failCount: 1,
            failures: [
              {
                subOrderId: 'sub-1',
                provider: 'VTP',
                stage: 'create',
                message: 'System error',
                trackingNo: 'VTP123',
              },
            ],
          },
        }),
        { status: 502, headers: { 'content-type': 'application/json' } },
      ),
    ) as typeof fetch;

    const service = new MarketplaceClientService(hmac as never, config as never);
    let caught: unknown;
    try {
      await service.createSourceShipments(['sub-1'], 'request-1');
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeInstanceOf(BadGatewayException);
    expect((caught as BadGatewayException).getResponse()).toEqual({
      message: 'Không thể tạo vận đơn ViettelPost',
      error: 'Bad Gateway',
      code: 'VTP_SHIPPING_FAILED',
      details: {
        failCount: 1,
        failures: [
          {
            subOrderId: 'sub-1',
            provider: 'VTP',
            stage: 'create',
            message: 'System error',
            trackingNo: 'VTP123',
          },
        ],
      },
    });
  });
});
