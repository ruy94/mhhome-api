jest.mock('../../generated/prisma/client.js', () => ({
  OrderStatus: { Pending: 'Pending' },
  PaymentMethod: { COD: 'COD' },
  Prisma: {},
  ShippingManagedBy: { Local: 'Local' },
  ShippingOrderStatus: {
    Pending: 'Pending',
    Created: 'Created',
    Failed: 'Failed',
    Cancelled: 'Cancelled',
  },
  ShippingProvider: { SPX: 'SPX', VTP: 'VTP', JNT: 'JNT' },
}));
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../integrations/shipping/spx/spx-shipping-client.service.js', () => ({
  SpxShippingClientService: class {},
}));
jest.mock('../integrations/shipping/vtp/vtp-shipping-client.service.js', () => ({
  VtpShippingClientService: class {},
}));
jest.mock('../salework-sync/salework-stock-sync.service.js', () => ({
  SaleWorkStockSyncService: class {},
}));
jest.mock('../order-inventory/order-inventory.service.js', () => ({
  OrderInventoryService: class {},
}));
jest.mock('../marketplace/marketplace-client.service.js', () => ({
  MarketplaceClientService: class {},
}));

import {
  OrderStatus,
  PaymentMethod,
  ShippingOrderStatus,
  ShippingProvider,
} from '../../generated/prisma/client.js';
import { ShippingService } from './shipping.service.js';

describe('ShippingService VTP create and approval recovery', () => {
  function setup(trackingNo: string | null) {
    let storedShippingOrder = {
      id: 101,
      orderId: 1,
      batchId: null as number | null,
      provider: ShippingProvider.VTP,
      managedBy: 'Local',
      status: trackingNo ? ShippingOrderStatus.Failed : ShippingOrderStatus.Pending,
      providerOrderId: 'ORDER-1',
      trackingNo,
      responsePayload: trackingNo ? { create: { ORDER_NUMBER: trackingNo } } : null,
      errorMessage: trackingNo ? 'Duyệt thất bại trước đó' : null,
      createdAt: new Date('2026-08-28T08:00:00.000Z'),
    };
    let storedOrder = {
      id: 1,
      code: 'ORDER-1',
      shippingProvider: ShippingProvider.VTP,
      marketplaceSubOrderId: null,
      status: OrderStatus.Pending,
      trackingCode: trackingNo,
      addressId: 10,
      deliveryFee: 18_000,
      paymentMethod: PaymentMethod.COD,
      note: null,
      totalAmount: 250_000,
      shippingOrders: [storedShippingOrder],
      orderProducts: [
        {
          productId: 20,
          variantId: 30,
          quantity: 1,
          originalPrice: 250_000,
          finalPrice: 250_000,
          itemVoucherDiscount: 0,
          pricingMode: 'Retail',
          product: { id: 20, name: 'Sản phẩm test', image: ['https://example.com/a.jpg'] },
          variant: {
            id: 30,
            name: 'Mặc định',
            image: null,
            dimensions: null,
            stock: 10,
            packageWeightGrams: 500,
            packageLengthCm: 10,
            packageWidthCm: 10,
            packageHeightCm: 10,
          },
        },
      ],
    };
    const refreshOrderShippingRelation = () => {
      storedOrder = { ...storedOrder, shippingOrders: [storedShippingOrder] };
    };
    const prisma = {
      order: {
        findMany: jest.fn().mockImplementation(async () => {
          refreshOrderShippingRelation();
          return [storedOrder];
        }),
        update: jest.fn().mockImplementation(async ({ data }: { data: { trackingCode: string } }) => {
          storedOrder = { ...storedOrder, ...data };
          return storedOrder;
        }),
      },
      address: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 10,
            isDeleted: 0,
            cneeName: 'Buyer',
            cneePhone: '0900000002',
            city: 'Hà Nội',
            district: '',
            ward: 'Phường Cửa Nam',
            fullAddr: '1 Tràng Tiền',
          },
        ]),
      },
      shippingBatch: {
        create: jest.fn().mockResolvedValue({ id: 501 }),
        update: jest.fn().mockResolvedValue({ id: 501 }),
        findUnique: jest.fn().mockResolvedValue({ id: 501 }),
      },
      shippingOrder: {
        create: jest.fn(),
        update: jest.fn().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
          storedShippingOrder = { ...storedShippingOrder, ...data } as typeof storedShippingOrder;
          refreshOrderShippingRelation();
          return storedShippingOrder;
        }),
        findMany: jest.fn().mockImplementation(async () => [storedShippingOrder]),
      },
      shippingEvent: { create: jest.fn().mockResolvedValue({ id: 1 }) },
      $transaction: jest
        .fn()
        .mockImplementation(async (operations: Promise<unknown>[]) => Promise.all(operations)),
    };
    const redisClient = {
      set: jest.fn().mockResolvedValue('OK'),
      eval: jest.fn().mockResolvedValue(1),
    };
    const vtp = {
      createOrder: jest.fn(),
      getAwbByTrackingNos: jest.fn(),
      describeError: jest.fn().mockImplementation((error: Error, stage: string) => ({
        provider: 'VTP',
        stage,
        message: error.message,
        providerStatus: 400,
      })),
    };
    const config = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'shipping.vtp.enabled') return true;
        if (key === 'shipping.vtp.sender') {
          return { name: 'Source Shop', phone: '0900000001', address: '55 Ngọc Khánh' };
        }
        return undefined;
      }),
    };
    const redis = { getClient: jest.fn().mockReturnValue(redisClient) };
    const service = new ShippingService(
      prisma as never,
      config as never,
      redis as never,
      redis as never,
      {} as never,
      vtp as never,
      {} as never,
      {} as never,
      {} as never,
    );
    return { prisma, service, stored: () => ({ order: storedOrder, shippingOrder: storedShippingOrder }), vtp };
  }

  it('creates an accepted shipment and prints it without approval', async () => {
    const { prisma, service, stored, vtp } = setup(null);
    vtp.createOrder.mockResolvedValue({
      providerOrderId: 'ORDER-1',
      trackingNo: 'VTP-TRACK-1',
      serviceCode: 'VCN',
      serviceName: 'Nhanh',
      expectedDelivery: '2026-08-30',
      estimatedFee: 18_000,
      actualFee: 18_000,
      raw: { ORDER_NUMBER: 'VTP-TRACK-1' },
    });
    vtp.getAwbByTrackingNos.mockResolvedValue({
      awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-1',
      failures: [],
    });

    await expect(service.createVtpOrders([1])).resolves.toMatchObject({
      successCount: 1,
      failCount: 0,
      trackingNos: ['VTP-TRACK-1'],
      awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-1',
    });

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { trackingCode: 'VTP-TRACK-1' },
    });
    expect(stored().order.trackingCode).toBe('VTP-TRACK-1');
    expect(stored().shippingOrder).toMatchObject({
      trackingNo: 'VTP-TRACK-1',
      status: ShippingOrderStatus.Created,
      errorMessage: null,
    });
    expect(vtp.getAwbByTrackingNos).toHaveBeenCalledWith(['VTP-TRACK-1']);
    expect(prisma.shippingEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        providerEventId: 'create:VTP-TRACK-1',
        eventType: 'create_order',
        status: 'accepted',
        statusCode: '102',
      }),
    });
  });

  it('recovers an existing tracking number without creating another order', async () => {
    const { prisma, service, stored, vtp } = setup('VTP-TRACK-OLD');
    vtp.getAwbByTrackingNos.mockResolvedValue({
      awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-OLD',
      failures: [],
    });

    await expect(service.createVtpOrders([1])).resolves.toMatchObject({
      successCount: 1,
      failCount: 0,
      trackingNos: ['VTP-TRACK-OLD'],
      awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-OLD',
    });

    expect(vtp.createOrder).not.toHaveBeenCalled();
    expect(vtp.getAwbByTrackingNos).toHaveBeenCalledWith(['VTP-TRACK-OLD']);
    expect(stored().shippingOrder).toMatchObject({
      status: ShippingOrderStatus.Created,
      errorMessage: null,
    });
    expect(prisma.shippingEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        providerEventId: `create-recovered:VTP-TRACK-OLD`,
        eventType: 'create_order',
        status: 'accepted',
      }),
    });
  });
});

describe('ShippingService mixed-provider AWB contract', () => {
  it('labels SPX and VTP results so Admin can open every print tab', async () => {
    const prisma = {
      shippingOrder: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, provider: ShippingProvider.SPX, trackingNo: 'SPX-TRACK-1' },
          { id: 2, provider: ShippingProvider.VTP, trackingNo: 'VTP-TRACK-1' },
        ]),
      },
    };
    const spx = {
      getAwbByTrackingNos: jest.fn().mockResolvedValue({
        awbLink: 'https://spx.vn/awb/SPX-TRACK-1',
        failures: [],
      }),
    };
    const vtp = {
      getAwbByTrackingNos: jest.fn().mockResolvedValue({
        awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-1',
        failures: [],
      }),
    };
    const config = {
      get: jest.fn().mockImplementation((key: string) =>
        key === 'shipping.spx.enabled' || key === 'shipping.vtp.enabled' ? true : undefined,
      ),
    };
    const service = new ShippingService(
      prisma as never,
      config as never,
      spx as never,
      {} as never,
      spx as never,
      vtp as never,
      {} as never,
      {} as never,
      {} as never,
    );

    await expect(service.getAwbForOrders({ orderIds: [1, 2] })).resolves.toEqual({
      providers: [
        {
          provider: ShippingProvider.SPX,
          result: { awbLink: 'https://spx.vn/awb/SPX-TRACK-1', failures: [] },
        },
        {
          provider: ShippingProvider.VTP,
          result: { awbLink: 'https://viettelpost.vn/awb/VTP-TRACK-1', failures: [] },
        },
      ],
    });
    expect(spx.getAwbByTrackingNos).toHaveBeenCalledWith(['SPX-TRACK-1']);
    expect(vtp.getAwbByTrackingNos).toHaveBeenCalledWith(['VTP-TRACK-1']);
  });
});
