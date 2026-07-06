import { BadRequestException } from '@nestjs/common';

import { SaleworkClientService } from './salework-client.service.js';

const createService = (overrides: Partial<ConstructorParameters<typeof SaleworkClientService>[0]> = {}) =>
  new SaleworkClientService({
    enabled: true,
    clientId: 'client-id',
    token: 'token',
    timeoutMs: 1000,
    stockBaseUrl: 'https://salework.net/api/open/stock',
    bankingBaseUrl: 'https://banking.salework.net/api/open',
    ...overrides,
  });

describe('SaleworkClientService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends Salework credentials in request headers', async () => {
    const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: { products: [], warehouse: [] },
        }),
      ),
    );
    const service = createService();

    await service.getProducts();

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://salework.net/api/open/stock/v1/product/list'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'client-id': 'client-id',
          token: 'token',
          'Content-Type': 'application/json',
        }),
      }),
    );
  });

  it('normalizes product list warehouses field', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: {
            products: {
              bikini05_DAY1CM: {
                _id: '6350397b11e8704253456791',
                code: 'bikini05_DAY1CM',
                retailPrice: 9000,
                cost: 2000,
                name: 'A DAY1CM',
                image: 'https://cf.shopee.vn/file/0e5c7537f2a8f35b68e76ff0f4fe4a33',
                wholesalePrice: 5500,
                barcode: '4545413150',
                stocks: [{ wid: 'SaleworkWarehouse', value: 1815 }],
              },
            },
            warehouse: [
              {
                _id: '626d822279616829c128be0e',
                name: 'Kho Mặc Định',
                wid: 'SaleworkWarehouse',
                createdAt: '2022-04-30T18:38:26.164Z',
                updatedAt: '2022-10-19T17:52:59.439Z',
                address: '',
                bins: [],
              },
            ],
          },
        }),
      ),
    );
    const service = createService();

    await expect(service.getProducts()).resolves.toEqual({
      products: expect.objectContaining({
        bikini05_DAY1CM: expect.objectContaining({ code: 'bikini05_DAY1CM' }),
      }),
      warehouses: [expect.objectContaining({ wid: 'SaleworkWarehouse' })],
    });
  });

  it('normalizes address list responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            addresses: {
              provinces: { '79': { name: 'Thành phố Hồ Chí Minh', children: ['760'] } },
              districts: { '760': { name: 'Quận 1', parent: '79', children: ['26734'] } },
              wards: { '26734': { name: 'Phường Tân Định', parent: '760' } },
              provinces_new: { '79': { name: 'Thành phố Hồ Chí Minh', children: ['26734'] } },
              wards_new: { '26734': { name: 'Phường Tân Định', parent: '79' } },
            },
          },
        }),
      ),
    );
    const service = createService();

    await expect(service.getAddressList()).resolves.toEqual({
      provinces: expect.objectContaining({ '79': expect.objectContaining({ name: 'Thành phố Hồ Chí Minh' }) }),
      districts: expect.any(Object),
      wards: expect.any(Object),
      provinces_new: expect.any(Object),
      wards_new: expect.any(Object),
    });
  });

  it('normalizes logistics list responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { logistics: [{ id: 'JNT', name: 'J&T Express', price: '', selected: false, image: 'https://example.test/jnt.png' }] },
        }),
      ),
    );
    const service = createService();

    await expect(service.getLogistics()).resolves.toEqual({
      logistics: [expect.objectContaining({ id: 'JNT', name: 'J&T Express' })],
    });
  });

  it('passes through product report channel data', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          status: 'success',
          data: {
            product_report: {
              Shopee: [{ shopId: 200296438, products: [{ code: 'VD284_DEN', amount: 15, revenue: 0, name: 'VÁY DEN', image: 'https://example.test/product.png' }] }],
            },
          },
        }),
      ),
    );
    const service = createService();

    await expect(service.getProductReport({ time_start: 1, time_end: 2 })).resolves.toEqual({
      product_report: { Shopee: [expect.objectContaining({ shopId: 200296438 })] },
    });
  });

  it('normalizes inventory transaction responses', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: {
            transactions: [
              {
                code: 'IM14567640',
                type: 'Nhập hàng hoàn',
                state: 'HOÀN THÀNH',
                items: [{ productCode: 'bikini05_DAY1CM', amount: 1, bin: '', order: '583034204305851794' }],
                sourceWarehouse: 'SaleworkWarehouse',
                updatedAt: '2026-03-14T17:54:19.160Z',
              },
            ],
            next_cursor: 31,
          },
        }),
      ),
    );
    const service = createService();

    await expect(service.getInventoryTransactions({ next_cursor: 0 })).resolves.toEqual({
      transactions: [expect.objectContaining({ code: 'IM14567640' })],
      next_cursor: 31,
    });
  });

  it('rejects requests when Salework is disabled', async () => {
    const service = createService({ enabled: false });

    await expect(service.getProducts()).rejects.toBeInstanceOf(BadRequestException);
  });
});
