import { BadRequestException } from '@nestjs/common';

import { VtpShippingClientService } from './vtp-shipping-client.service.js';
import type { ShippingOrderDraft } from '../../../shipping/shipping.types.js';

function createDraft(receiverPhone = '84364390394'): ShippingOrderDraft {
  return {
    orderId: 'ORDER-1',
    serviceType: 1,
    sender: {
      name: 'Shop',
      phone: '0364390394',
      detailAddress: '269 Nguyễn Khang',
      city: 'Phường Yên Hòa',
      state: 'Thành phố Hà Nội',
    },
    recipient: {
      name: 'Khách',
      phone: receiverPhone,
      detailAddress: '55 Ngọc Khánh',
      city: 'Phường Giảng Võ',
      state: 'Thành phố Hà Nội',
    },
    paymentRole: 1,
    codAmount: 630_000,
    collectType: 1,
    highValueProcessingCollection: 0,
    parcel: {
      weightGrams: 300,
      itemName: 'Hoa quả tươi',
      itemQuantity: 1,
      insuredValue: 700_000,
      items: [
        {
          name: 'Hoa quả tươi',
          price: 700_000,
          quantity: 1,
          weightGrams: 300,
        },
      ],
    },
  };
}

function createClient() {
  const config = {
    vtp: {
      baseUrl: 'https://partner.example.com',
      printBaseUrl: 'https://print.example.com',
      printExpirySeconds: 300,
      printLabelType: 1,
      printShowPostage: true,
      timeoutMs: 5_000,
      username: 'partner-user',
      password: 'partner-password',
    },
  };
  const redis = { getClient: () => ({}) };
  return new VtpShippingClientService(config as never, redis as never);
}

describe('VtpShippingClientService create payload', () => {
  it('normalizes Vietnamese country-code phones and matches the NLP contract', () => {
    const client = createClient();
    const payload = (
      client as unknown as {
        createPayload: (draft: ShippingOrderDraft, service: string) => Record<string, unknown>;
      }
    ).createPayload(createDraft(), 'VCN');

    expect(payload).toEqual(
      expect.objectContaining({
        SENDER_PHONE: '0364390394',
        RECEIVER_PHONE: '0364390394',
        ORDER_SERVICE_ADD: null,
        EXTRA_MONEY: 0,
        PICKUP_DATE: '',
        PICKUP_CODE: '',
        DELIVERY_CODE: '',
        CHECK_UNIQUE: true,
      }),
    );
  });

  it('rejects invalid receiver phones before calling ViettelPost', () => {
    const client = createClient();
    expect(() =>
      (
        client as unknown as {
          createPayload: (draft: ShippingOrderDraft, service: string) => unknown;
        }
      ).createPayload(createDraft('123'), 'VCN'),
    ).toThrow(BadRequestException);
  });

  it('returns the accepted tracking number without a separate approval step', async () => {
    const client = createClient();
    jest.spyOn(client, 'estimateFee').mockResolvedValue({
      provider: 'VTP',
      providerOrderId: 'ORDER-1',
      estimatedFee: 18_150,
      basicFee: 18_150,
      serviceCode: 'VCN',
      serviceName: 'Nhanh',
      raw: {},
    });
    jest.spyOn(client as never, 'request').mockResolvedValue({
      ORDER_NUMBER: 'VTP-TRACKING-1',
      MONEY_TOTAL: 18_150,
    } as never);
    const result = await client.createOrder(createDraft());

    expect(result.trackingNo).toBe('VTP-TRACKING-1');
  });

  it('keeps explicit UpdateOrder actions for return, redelivery, cancel and delete', async () => {
    const client = createClient();
    const request = jest
      .spyOn(client as never, 'request')
      .mockResolvedValue({ status: 200 } as never);

    for (const type of [2, 3, 4, 5] as const) {
      await client.updateStatus('VTP-TRACKING-1', type, 'Thao tác vận đơn');
      expect(request).toHaveBeenLastCalledWith(
        '/v2/order/UpdateOrder',
        { TYPE: type, ORDER_NUMBER: 'VTP-TRACKING-1', NOTE: 'Thao tác vận đơn' },
        true,
        'status',
      );
    }
  });
});

function jsonResponse(payload: unknown, status = 200, setCookie?: string): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(setCookie ? { 'set-cookie': setCookie } : undefined),
    json: jest.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

function createAuthClient(
  cachedToken: string | null = null,
  credentials: { username: string; password: string } = {
    username: 'partner-user',
    password: 'partner-password',
  },
) {
  const config = {
    vtp: {
      baseUrl: 'https://partner.example.com',
      printBaseUrl: 'https://print.example.com',
      printExpirySeconds: 300,
      printLabelType: 1,
      printShowPostage: true,
      timeoutMs: 5_000,
      ...credentials,
    },
  };
  const redisClient = {
    get: jest.fn().mockResolvedValue(cachedToken),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  };
  const redis = { getClient: () => redisClient };
  return {
    client: new VtpShippingClientService(config as never, redis as never),
    redisClient,
  };
}

function getAccessToken(client: VtpShippingClientService, force = false) {
  return (
    client as unknown as {
      getAccessToken: (refresh?: boolean) => Promise<string>;
    }
  ).getAccessToken(force);
}

function providerRequest(client: VtpShippingClientService) {
  return (
    client as unknown as {
      request: (
        path: string,
        body: Record<string, unknown>,
        retryAuth: boolean,
        stage: 'quote',
      ) => Promise<Record<string, unknown>>;
    }
  ).request('/v2/order/getPriceNlp', { PRODUCT_WEIGHT: 300 }, true, 'quote');
}

describe('VtpShippingClientService Partner authentication', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('exchanges credentials for short and one-year tokens before a provider request', async () => {
    const { client, redisClient } = createAuthClient();
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse(
          {
            status: 200,
            error: false,
            data: { token: 'short-token' },
          },
          200,
          'SERVERID=A; Path=/; HttpOnly',
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { token: 'long-token-without-exp' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { MONEY_TOTAL: 18_150 },
        }),
      );

    await expect(providerRequest(client)).resolves.toEqual({ MONEY_TOTAL: 18_150 });

    expect(String(fetchMock.mock.calls[0][0])).toBe('https://partner.example.com/v2/user/Login');
    expect(fetchMock.mock.calls[0][1]?.headers).toEqual(
      expect.not.objectContaining({ Token: expect.anything() }),
    );
    expect(JSON.parse(String(fetchMock.mock.calls[0][1]?.body))).toEqual({
      USERNAME: 'partner-user',
      PASSWORD: 'partner-password',
    });

    expect(String(fetchMock.mock.calls[1][0])).toBe(
      'https://partner.example.com/v2/user/ownerconnect',
    );
    expect(fetchMock.mock.calls[1][1]?.headers).toEqual(
      expect.objectContaining({ Token: 'short-token', Cookie: 'SERVERID=A' }),
    );
    expect(JSON.parse(String(fetchMock.mock.calls[1][1]?.body))).toEqual({
      USERNAME: 'partner-user',
      PASSWORD: 'partner-password',
    });
    expect(fetchMock.mock.calls[2][1]?.headers).toEqual(
      expect.objectContaining({ Token: 'long-token-without-exp' }),
    );

    expect(redisClient.set).toHaveBeenCalledTimes(1);
    const [cacheKey, cachedValue, mode, ttl] = redisClient.set.mock.calls[0] as [
      string,
      string,
      string,
      number,
    ];
    expect(cacheKey).toMatch(/^shipping:vtp:owner-token:v1:[a-f0-9]{16}$/);
    expect(JSON.parse(cachedValue)).toEqual(
      expect.objectContaining({ value: 'long-token-without-exp' }),
    );
    expect(mode).toBe('EX');
    expect(ttl).toBeGreaterThan(31_000_000);
  });

  it('reuses a valid cached owner token without authenticating again', async () => {
    const cached = JSON.stringify({
      value: 'cached-owner-token',
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    const { client, redisClient } = createAuthClient(cached);
    const fetchMock = jest.spyOn(global, 'fetch');

    await expect(getAccessToken(client)).resolves.toBe('cached-owner-token');

    expect(redisClient.get).toHaveBeenCalledWith(
      expect.stringMatching(/^shipping:vtp:owner-token:v1:/),
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shares one authentication flow between concurrent requests', async () => {
    const { client } = createAuthClient();
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { token: 'short-token' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { token: 'long-token' },
        }),
      );

    await expect(Promise.all([getAccessToken(client), getAccessToken(client)])).resolves.toEqual([
      'long-token',
      'long-token',
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('invalidates the cached token and retries once through both auth endpoints', async () => {
    const cached = JSON.stringify({
      value: 'expired-owner-token',
      expiresAt: Date.now() + 10 * 60 * 1000,
    });
    const { client, redisClient } = createAuthClient(cached);
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        jsonResponse(
          {
            status: 401,
            error: true,
            message: 'Token invalid',
          },
          401,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { token: 'new-short-token' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { token: 'new-owner-token' },
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          status: 200,
          error: false,
          data: { MONEY_TOTAL: 20_000 },
        }),
      );

    await expect(providerRequest(client)).resolves.toEqual({ MONEY_TOTAL: 20_000 });

    expect(redisClient.del).toHaveBeenCalledWith(
      expect.stringMatching(/^shipping:vtp:owner-token:v1:/),
    );
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(fetchMock.mock.calls[3][1]?.headers).toEqual(
      expect.objectContaining({ Token: 'new-owner-token' }),
    );
  });

  it('fails before network access when Partner credentials are missing', async () => {
    const { client } = createAuthClient(null, { username: '', password: '' });
    const fetchMock = jest.spyOn(global, 'fetch');

    await expect(getAccessToken(client)).rejects.toThrow(
      'Thiếu cấu hình VTP_USERNAME hoặc VTP_PASSWORD',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
