import { BadRequestException } from '@nestjs/common';
import { KiotVietOrderExportService } from './kiotviet-order-export.service.js';

jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../../generated/prisma/client.js', () => ({
  InventoryProvider: { KIOTVIET: 'KIOTVIET' },
  KiotVietOutboxOperation: { CREATE_INVOICE: 'CREATE_INVOICE' },
  KiotVietOutboxStatus: {
    WAITING_SELLER: 'WAITING_SELLER',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    UNCERTAIN: 'UNCERTAIN',
  },
  OrderPlatform: {
    ZaloMiniApp: 'ZaloMiniApp',
    Website: 'Website',
    Marketplace: 'Marketplace',
  },
  OrderStatus: {
    Pending: 'Pending',
    Prepare: 'Prepare',
    Delivering: 'Delivering',
    Paid: 'Paid',
    Refund: 'Refund',
    Cancel: 'Cancel',
    SoftCancel: 'SoftCancel',
    Return: 'Return',
  },
  Prisma: {},
}));

describe('KiotVietOrderExportService', () => {
  const branch = { id: 443199 };
  const setting = {
    enabled: true,
    branchId: branch.id,
    soldById: 301,
    soldByName: 'Nhân viên A',
    updatedByAdminId: 'admin-1',
    updatedAt: '2026-09-28T07:00:00.000Z',
  };
  const redisClient = {
    get: jest.fn(),
    set: jest.fn().mockResolvedValue('OK'),
  };
  const decimal = (value: number) => ({ toNumber: () => value });
  const order = {
    id: 9,
    code: 'ORD-9',
    platform: 'Website',
    status: 'Pending',
    userId: 12,
    addressId: 34,
    createdAt: new Date('2026-09-28T07:01:00.000Z'),
    productDiscount: decimal(0),
    orderProducts: [
      {
        quantity: 2,
        finalPrice: decimal(50_000),
        itemVoucherDiscount: decimal(0),
        variant: {
          inventoryProvider: 'KIOTVIET',
          kiotvietProductCode: 'SKU-1',
          kiotvietBranchId: branch.id,
          kiotvietLinkedAt: new Date('2026-09-27T00:00:00.000Z'),
        },
      },
    ],
  };
  let createdRow: Record<string, any>;
  const prisma = {
    order: { findUnique: jest.fn() },
    kiotVietOutboxLog: {
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  const branches = { resolve: jest.fn().mockResolvedValue(branch) };
  const client = {
    getProductByCode: jest.fn(),
    createOrder: jest.fn(),
    getOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
  };
  const invoices = {
    findSeller: jest.fn(),
    ensureCustomer: jest.fn(),
  };

  const service = () =>
    new KiotVietOrderExportService(
      { enabled: true, stockSyncEnabled: true } as never,
      prisma as never,
      { getClient: () => redisClient } as never,
      branches as never,
      client as never,
      invoices as never,
    );

  beforeEach(() => {
    jest.clearAllMocks();
    redisClient.get.mockResolvedValue(JSON.stringify(setting));
    redisClient.set.mockResolvedValue('OK');
    branches.resolve.mockResolvedValue(branch);
    invoices.findSeller.mockResolvedValue({
      id: 301,
      userName: 'seller-a',
      givenName: 'Nhân viên A',
    });
    invoices.ensureCustomer.mockResolvedValue(84);
    client.getProductByCode.mockResolvedValue({ id: 20, code: 'SKU-1', name: 'Sản phẩm 1' });
    client.createOrder.mockResolvedValue({ id: 7001, code: 'DH0001' });
    client.getOrder.mockResolvedValue({
      id: 7001,
      code: 'DH0001',
      branchId: branch.id,
      description: 'LOCAL_ORDER:ORD-9',
      orderDetails: [{ productCode: 'SKU-1', quantity: 2 }],
    });
    prisma.order.findUnique
      .mockResolvedValueOnce(order)
      .mockResolvedValueOnce({ status: 'Pending', userId: 12, addressId: 34 })
      .mockResolvedValueOnce({ status: 'Pending' });
    prisma.kiotVietOutboxLog.findUnique
      .mockResolvedValueOnce(null)
      .mockImplementation(({ where }: { where: { id?: number } }) =>
        Promise.resolve(where.id ? createdRow : null),
      );
    prisma.kiotVietOutboxLog.create.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) => {
        createdRow = { id: 77, ...data };
        return Promise.resolve(createdRow);
      },
    );
    prisma.kiotVietOutboxLog.findUniqueOrThrow.mockImplementation(() =>
      Promise.resolve(createdRow),
    );
    prisma.kiotVietOutboxLog.updateMany.mockResolvedValue({ count: 1 });
    prisma.kiotVietOutboxLog.update.mockResolvedValue({});
  });

  it('does not allow auto export without a selected KiotViet seller', async () => {
    redisClient.get.mockResolvedValueOnce(null);

    await expect(service().updateSetting({ enabled: true }, 'admin-1')).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(redisClient.set).not.toHaveBeenCalled();
  });

  it('validates and stores the selected seller when auto export is enabled', async () => {
    redisClient.get.mockResolvedValueOnce(null);

    await expect(
      service().updateSetting({ enabled: true, soldById: 301 }, 'admin-1'),
    ).resolves.toMatchObject({ enabled: true, soldById: 301, soldByName: 'Nhân viên A' });
    expect(invoices.findSeller).toHaveBeenCalledWith(301);
    expect(redisClient.set).toHaveBeenCalledWith(
      'kiotviet:order-export:setting:443199',
      expect.stringContaining('"soldById":301'),
    );
  });

  it('creates one non-invoiced KiotViet order and records the reserved stage', async () => {
    const instance = service();
    await instance.enqueueCreatedOrder(order.id);

    expect(prisma.kiotVietOutboxLog.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        orderId: 9,
        businessKey: 'kiotviet:auto-order:9',
        status: 'PENDING',
        soldById: '301',
      }),
    });
    expect(client.createOrder).not.toHaveBeenCalled();

    await (instance as unknown as { dispatch(id: number): Promise<void> }).dispatch(77);

    expect(client.createOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        branchId: 443199,
        soldById: 301,
        makeInvoice: false,
        customer: { id: 84 },
        orderDetails: [
          expect.objectContaining({ productId: 20, productCode: 'SKU-1', quantity: 2 }),
        ],
      }),
    );
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith({
      where: { id: 77 },
      data: expect.objectContaining({
        status: 'SUCCESS',
        requestPayload: expect.objectContaining({ stage: 'RESERVED' }),
        responsePayload: expect.objectContaining({ remoteOrder: { id: 7001, code: 'DH0001' } }),
      }),
    });
  });

  it('moves a reserved automatic order to completion instead of manual invoice fallback', async () => {
    prisma.kiotVietOutboxLog.findUnique.mockReset().mockResolvedValue({
      id: 77,
      orderId: 9,
      status: 'SUCCESS',
      requestPayload: {
        flow: 'AUTO_ORDER',
        stage: 'RESERVED',
        branchId: 443199,
        soldById: 301,
        localOrderCode: 'ORD-9',
        description: 'LOCAL_ORDER:ORD-9',
        orderDetails: [],
      },
    });

    await expect(
      service().onOrderStatusChanged(9, 'Delivering' as never, 'Paid' as never),
    ).resolves.toBe(true);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith({
      where: { id: 77 },
      data: expect.objectContaining({
        status: 'PENDING',
        requestPayload: expect.objectContaining({ stage: 'COMPLETE_ORDER' }),
      }),
    });
  });
});
