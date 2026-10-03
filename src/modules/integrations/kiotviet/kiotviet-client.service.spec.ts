import axios from 'axios';
import { Logger } from '@nestjs/common';

import { KiotVietClientService } from './kiotviet-client.service.js';

jest.mock('axios');

const config = {
  enabled: true,
  stockSyncEnabled: true,
  stockStaleSeconds: 300,
  apiBaseUrl: 'https://public.kiotapi.com',
  retailer: 'shop-test',
  requestTimeoutMs: 10000,
};

describe('KiotVietClientService', () => {
  const auth = { getToken: jest.fn().mockResolvedValue('token'), invalidate: jest.fn() };
  const redisClient = {
    eval: jest.fn().mockResolvedValue(1),
    get: jest.fn(),
  };
  const redis = { getClient: () => redisClient };

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(axios.isAxiosError)
      .mockImplementation((error): error is never =>
        Boolean((error as { isAxiosError?: boolean })?.isAxiosError),
      );
    auth.getToken.mockResolvedValue('token');
    redisClient.get.mockResolvedValue(new Date().toISOString());
    jest
      .mocked(axios.get)
      .mockResolvedValue({ data: { total: 1, pageSize: 20, data: [{ code: 'SKU-1' }] } });
  });

  it('Base64-encodes the raw random secret exactly once when registering a webhook', async () => {
    jest.mocked(axios.post).mockResolvedValueOnce({ data: { id: 99 } });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await client.createStockWebhook(
      'https://example.com/api/v1/kiotviet/webhook/stock',
      'raw-random',
    );

    expect(jest.mocked(axios.post).mock.calls[0]).toEqual([
      'https://public.kiotapi.com/webhooks',
      {
        Webhook: {
          Type: 'stock.update',
          Url: 'https://example.com/api/v1/kiotviet/webhook/stock',
          IsActive: true,
          Description: 'Stock sync',
          Secret: 'cmF3LXJhbmRvbQ==',
        },
      },
      expect.objectContaining({
        headers: { Retailer: 'shop-test', Authorization: 'Bearer token' },
      }),
    ]);
  });

  it('normalizes an empty KiotViet page when data is omitted', async () => {
    jest.mocked(axios.get).mockResolvedValueOnce({
      data: { total: 0, pageSize: 100, timestamp: '2026-09-26T10:58:25+07:00' },
    });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.getWebhooks(100, 0)).resolves.toEqual({
      total: 0,
      pageSize: 100,
      data: [],
    });
  });

  it('deletes an inactive webhook with the KiotViet credentials', async () => {
    jest.mocked(axios.delete).mockResolvedValueOnce({ data: { message: 'ok' } });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.deleteWebhook(88)).resolves.toBeUndefined();
    expect(jest.mocked(axios.delete)).toHaveBeenCalledWith(
      'https://public.kiotapi.com/webhooks/88',
      expect.objectContaining({
        headers: { Retailer: 'shop-test', Authorization: 'Bearer token' },
      }),
    );
  });

  it('rejects checkout when one KiotViet SKU was not refreshed recently', async () => {
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(
      client.assertStockFresh([
        {
          inventoryProvider: 'KIOTVIET' as never,
          kiotvietStockSyncedAt: new Date(Date.now() - 600_000),
        },
      ]),
    ).rejects.toThrow('Tồn KiotViet đã cũ');
  });

  it('accepts a recently refreshed KiotViet stock projection', async () => {
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(
      client.assertStockFresh([
        { inventoryProvider: 'KIOTVIET' as never, kiotvietStockSyncedAt: new Date() },
      ]),
    ).resolves.toBeUndefined();
  });

  it('accepts an unchanged older SKU when an active webhook has a full-sync baseline', async () => {
    redisClient.get
      .mockResolvedValueOnce(new Date(Date.now() - 3_600_000).toISOString())
      .mockResolvedValueOnce('1');
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(
      client.assertStockFresh([
        {
          inventoryProvider: 'KIOTVIET' as never,
          kiotvietStockSyncedAt: new Date(Date.now() - 3_600_000),
        },
      ]),
    ).resolves.toBeUndefined();
  });

  it('requires a full-sync baseline even when webhook registration is active', async () => {
    redisClient.get.mockResolvedValueOnce(null).mockResolvedValueOnce('1');
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(
      client.assertStockFresh([
        { inventoryProvider: 'KIOTVIET' as never, kiotvietStockSyncedAt: new Date() },
      ]),
    ).rejects.toThrow('Tồn KiotViet đã cũ');
  });

  it('sends Retailer and Bearer headers with a bounded product query', async () => {
    const client = new KiotVietClientService(config as never, auth as never, redis as never);
    const page = await client.getProducts({ pageSize: 20, currentItem: 0, name: 'Test' });

    expect(page.data).toEqual([{ code: 'SKU-1' }]);
    const [url, options] = jest.mocked(axios.get).mock.calls[0];
    expect(url).toContain('/products?pageSize=20&currentItem=0&name=Test');
    expect(options?.headers).toMatchObject({
      Retailer: 'shop-test',
      Authorization: 'Bearer token',
    });
  });

  it('refreshes once after a 401 and retries the GET', async () => {
    jest
      .mocked(axios.get)
      .mockRejectedValueOnce({ isAxiosError: true, response: { status: 401 } })
      .mockResolvedValueOnce({ data: { total: 0, pageSize: 20, data: [] } });
    jest
      .spyOn(axios, 'isAxiosError')
      .mockImplementation((error): error is never =>
        Boolean((error as { isAxiosError?: boolean }).isAxiosError),
      );
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.getProducts({ pageSize: 20, currentItem: 0 })).resolves.toMatchObject({
      total: 0,
    });
    expect(auth.invalidate).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledTimes(2);
  });

  it('looks up a customer by code and creates one with the same retailer credentials', async () => {
    const customer = { id: 84, code: 'Local-A-1', name: 'Lan' };
    const payload = {
      code: customer.code,
      name: customer.name,
      contactNumber: '0900000000',
      address: '12 Test Street',
      branchId: 443199,
    };
    jest
      .mocked(axios.get)
      .mockResolvedValueOnce({ data: { total: 1, pageSize: 100, data: [customer] } });
    jest.mocked(axios.post).mockResolvedValueOnce({ data: customer });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.getCustomerByCode(customer.code)).resolves.toEqual(customer);
    await expect(client.createCustomer(payload)).resolves.toEqual(customer);
    expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
      'https://public.kiotapi.com/customers?code=Local-A-1&pageSize=100&currentItem=0',
    );
    expect(jest.mocked(axios.post).mock.calls[0]).toEqual([
      'https://public.kiotapi.com/customers',
      payload,
      expect.objectContaining({
        headers: { Retailer: 'shop-test', Authorization: 'Bearer token' },
      }),
    ]);
  });

  it('updates a known customer with recipient contact details', async () => {
    const payload = {
      code: 'Local-A-1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
    };
    jest.mocked(axios.put).mockResolvedValueOnce({ data: { id: 84, ...payload } });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.updateCustomer(84, payload)).resolves.toMatchObject({ id: 84, ...payload });
    expect(jest.mocked(axios.put).mock.calls[0]).toEqual([
      'https://public.kiotapi.com/customers/84',
      payload,
      expect.objectContaining({
        headers: { Retailer: 'shop-test', Authorization: 'Bearer token' },
      }),
    ]);
  });

  it('creates, completes and cancels a KiotViet order with retailer credentials', async () => {
    const payload = { branchId: 443199, soldById: 301, makeInvoice: false };
    jest.mocked(axios.post).mockResolvedValueOnce({ data: { id: 7001 } });
    jest.mocked(axios.put).mockResolvedValueOnce({ data: { id: 7001, makeInvoice: true } });
    jest.mocked(axios.delete).mockResolvedValueOnce({ data: true });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.createOrder(payload)).resolves.toEqual({ id: 7001 });
    await expect(
      client.updateOrder(7001, { ...payload, makeInvoice: true }),
    ).resolves.toMatchObject({
      id: 7001,
      makeInvoice: true,
    });
    await expect(client.deleteOrder(7001)).resolves.toBeUndefined();
    const requestConfig = expect.objectContaining({
      headers: { Retailer: 'shop-test', Authorization: 'Bearer token' },
    });
    expect(jest.mocked(axios.post)).toHaveBeenCalledWith(
      'https://public.kiotapi.com/orders',
      payload,
      requestConfig,
    );
    expect(jest.mocked(axios.put)).toHaveBeenCalledWith(
      'https://public.kiotapi.com/orders/7001',
      { ...payload, makeInvoice: true },
      requestConfig,
    );
    expect(jest.mocked(axios.delete)).toHaveBeenCalledWith(
      'https://public.kiotapi.com/orders/7001?IsVoidPayment=true',
      requestConfig,
    );
  });

  it('treats an empty customer code search as a missing customer', async () => {
    jest.mocked(axios.get).mockResolvedValueOnce({ data: { total: 0, pageSize: 100, data: [] } });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);
    await expect(client.getCustomerByCode('Local-A-4')).resolves.toBeNull();
  });

  it('preserves the KiotViet HTTP status and message for a customer read failure', async () => {
    jest.mocked(axios.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 420,
        data: {
          responseStatus: { errorCode: 'KvException', message: 'Không có quyền đọc khách hàng' },
        },
      },
    });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);
    await expect(client.getCustomerByCode('Local-A-4')).rejects.toThrow(
      'HTTP 420 KvException: Không có quyền đọc khách hàng',
    );
  });

  it('stops before the HTTP request when the read budget is exhausted', async () => {
    const exhaustedRedis = { getClient: () => ({ eval: jest.fn().mockResolvedValue(4001) }) };
    const client = new KiotVietClientService(
      config as never,
      auth as never,
      exhaustedRedis as never,
    );

    await expect(client.getBranches()).rejects.toMatchObject({ status: 429 });
    expect(axios.get).not.toHaveBeenCalled();
  });
  it('encodes spaces in product codes and returns missing products as null', async () => {
    const client = new KiotVietClientService(config as never, auth as never, redis as never);
    jest.mocked(axios.get).mockRejectedValueOnce({ isAxiosError: true, response: { status: 404 } });
    await expect(client.getProductByCode('0333596825 69')).resolves.toBeNull();
    expect(jest.mocked(axios.get).mock.calls[0][0]).toBe(
      'https://public.kiotapi.com/products/code/0333596825%2069',
    );
  });

  it('treats the KiotViet 420 missing-product validation as an empty lookup', async () => {
    jest.mocked(axios.get).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 420,
        data: {
          responseStatus: {
            errorCode: 'KvValidateProductException',
            message: 'Hàng hóa được chọn không tồn tại hoặc đã bị xóa',
          },
        },
      },
    });
    const client = new KiotVietClientService(config as never, auth as never, redis as never);

    await expect(client.getProductByCode('O799991184')).resolves.toBeNull();
  });

  it.each(['ECONNABORTED', 'ETIMEDOUT', 'ECONNRESET'])(
    'logs safe diagnostics for %s',
    async (code) => {
      const warn = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
      try {
        jest
          .mocked(axios.isAxiosError)
          .mockImplementation((error): error is never =>
            Boolean((error as { isAxiosError?: boolean }).isAxiosError),
          );
        jest.mocked(axios.get).mockRejectedValueOnce({
          isAxiosError: true,
          code,
          config: { headers: { Authorization: 'secret-token' } },
        });
        const client = new KiotVietClientService(config as never, auth as never, redis as never);
        await expect(client.getProductByCode('SKU-1', 'link-test')).rejects.toMatchObject({
          status: 503,
          message:
            code === 'ECONNRESET'
              ? 'Không thể kết nối để đọc dữ liệu KiotViet'
              : 'Hết thời gian chờ đọc dữ liệu KiotViet',
        });
        expect(warn).toHaveBeenCalledWith(
          expect.objectContaining({
            event: 'kiotviet.read.failed',
            operationId: 'link-test',
            endpoint: '/products/code/SKU-1',
            timeoutMs: 10000,
            attempt: 1,
            errorCode: code,
            durationMs: expect.any(Number),
          }),
        );
        expect(JSON.stringify(warn.mock.calls)).not.toContain('secret-token');
        expect(axios.get).toHaveBeenCalledTimes(1);
      } finally {
        warn.mockRestore();
      }
    },
  );
});
