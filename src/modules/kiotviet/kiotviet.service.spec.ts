import { createHmac } from 'node:crypto';
import axios from 'axios';
import { BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { KiotVietService } from './kiotviet.service.js';

jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../marketplace/marketplace-catalog.service.js', () => ({
  MarketplaceCatalogService: class {},
}));
jest.mock('./kiotviet-invoice.service.js', () => ({ KiotVietInvoiceService: class {} }));
jest.mock('./kiotviet-order-export.service.js', () => ({
  KiotVietOrderExportService: class {},
}));

describe('KiotVietService stock sync', () => {
  const cfg = {
    enabled: true,
    stockSyncEnabled: true,
    webhookEnabled: true,
    webhookRawSecret: 'local-test-secret',
    callbackUrl: 'https://example.com/api/v1/kiotviet/webhook/stock',
    requestTimeoutMs: 10_000,
  };
  const client = {
    getProductOnHands: jest.fn(),
    getProductByCode: jest.fn(),
    getWebhooks: jest.fn(),
    createStockWebhook: jest.fn(),
    deleteWebhook: jest.fn(),
    assertStockFresh: jest.fn().mockResolvedValue(undefined),
  };
  const branches = { resolve: jest.fn().mockResolvedValue({ id: 443199 }) };
  const tx = {
    kiotVietInventory: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    variant: {
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
  };
  const prisma = {
    variant: { findMany: jest.fn() },
    kiotVietInventory: { findMany: jest.fn() },
    marketplaceInventoryReservation: { groupBy: jest.fn() },
    orderProduct: { groupBy: jest.fn(), findMany: jest.fn() },
    $transaction: jest.fn(
      (callback: (transaction: { variant: { update: jest.Mock } }) => Promise<unknown>) =>
        callback(tx),
    ),
  };
  const catalog = { recordProductChanges: jest.fn().mockResolvedValue(undefined) };
  const redisClient = {
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue(null),
    del: jest.fn().mockResolvedValue(1),
    eval: jest.fn().mockResolvedValue(1),
  };
  const redis = { getClient: () => redisClient };
  const webhookQueue = {
    add: jest.fn().mockResolvedValue({ id: 'event-1' }),
    getJob: jest.fn(),
    getJobs: jest.fn().mockResolvedValue([]),
    getJobCounts: jest.fn().mockResolvedValue({ waiting: 0, active: 0, delayed: 0, failed: 0 }),
  };
  const orderExports = {
    setOnStockChanged: jest.fn(),
    remotelyReservedOrderIds: jest.fn().mockResolvedValue(new Set<number>()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.variant.findMany.mockResolvedValue([
      {
        id: 1,
        productId: 10,
        stock: 1,
        inventoryProvider: 'KIOTVIET',
        kiotvietProductCode: 'SKU-1',
      },
    ]);
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValue([
      { variantId: 1, _sum: { quantity: 2 } },
    ]);
    prisma.orderProduct.groupBy.mockResolvedValue([]);
    prisma.orderProduct.findMany.mockResolvedValue([]);
    client.getProductOnHands.mockResolvedValue({
      total: 1,
      pageSize: 100,
      data: [{ code: 'SKU-1', inventories: [{ branchId: 443199, onHand: 10, reserved: 3 }] }],
    });
    client.getProductByCode.mockResolvedValue({
      code: 'SKU-1',
      inventories: [{ branchId: 443199, onHand: 10, reserved: 3 }],
    });
    client.getWebhooks.mockResolvedValue({ total: 0, pageSize: 100, data: [] });
    client.createStockWebhook.mockResolvedValue({ id: 99 });
    client.deleteWebhook.mockResolvedValue(undefined);
    client.assertStockFresh.mockResolvedValue(undefined);
    redisClient.set.mockResolvedValue('OK');
    redisClient.get.mockResolvedValue(null);
    redisClient.del.mockResolvedValue(1);
    webhookQueue.add.mockResolvedValue({ id: 'event-1' });
    webhookQueue.getJob.mockResolvedValue(null);
    webhookQueue.getJobs.mockResolvedValue([]);
    tx.variant.updateMany.mockResolvedValue({ count: 1 });
    tx.kiotVietInventory.updateMany.mockResolvedValue({ count: 1 });
    prisma.kiotVietInventory.findMany.mockImplementation(
      ({ where }: { where: { productCode: { in: string[] } } }) =>
        Promise.resolve(
          where.productCode.in.map((productCode) => ({
            productCode,
            branchId: 443199,
            availableStock: 1,
          })),
        ),
    );
    orderExports.remotelyReservedOrderIds.mockResolvedValue(new Set<number>());
  });

  function service() {
    return new KiotVietService(
      cfg as never,
      client as never,
      branches as never,
      prisma as never,
      catalog as never,
      redis as never,
      webhookQueue as never,
      { enqueuePaidOrder: jest.fn() } as never,
      orderExports as never,
    );
  }

  it('queues a manual stock sync instead of running it in the HTTP request', async () => {
    const result = await service().requestStockSync('MANUAL');

    expect(result).toMatchObject({ state: 'QUEUED', accepted: true, started: true });
    expect(webhookQueue.add).toHaveBeenCalledWith(
      'stock-sync',
      expect.objectContaining({ source: 'MANUAL', codes: [] }),
      expect.objectContaining({ attempts: 8 }),
    );
  });

  it('joins an existing stock sync without returning a conflict', async () => {
    webhookQueue.getJobs.mockResolvedValueOnce([
      {
        id: 'running-sync',
        name: 'stock-sync',
        data: { source: 'POLL', codes: [], requestedAt: new Date().toISOString() },
        getState: jest.fn().mockResolvedValue('active'),
      },
    ]);

    await expect(service().requestStockSync('MANUAL')).resolves.toMatchObject({
      state: 'RUNNING',
      accepted: true,
      started: false,
      jobId: 'running-sync',
    });
    expect(webhookQueue.add).not.toHaveBeenCalled();
  });

  it('refreshes stale checkout stock before the order transaction starts', async () => {
    client.assertStockFresh
      .mockRejectedValueOnce(
        new ServiceUnavailableException(
          'Tồn KiotViet đã cũ; vui lòng đồng bộ lại trước khi đặt hàng',
        ),
      )
      .mockResolvedValueOnce(undefined);

    await expect(service().ensureCheckoutStockFresh([1])).resolves.toBeUndefined();
    expect(client.getProductByCode).toHaveBeenCalledWith('SKU-1');
    expect(prisma.variant.findMany).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: expect.objectContaining({ kiotvietProductCode: { in: ['SKU-1'] } }),
      }),
    );
    expect(client.assertStockFresh).toHaveBeenCalledTimes(2);
  });

  it('waits for the running stock sync instead of exposing its conflict to checkout', async () => {
    client.assertStockFresh
      .mockRejectedValueOnce(
        new ServiceUnavailableException(
          'Tồn KiotViet đã cũ; vui lòng đồng bộ lại trước khi đặt hàng',
        ),
      )
      .mockResolvedValueOnce(undefined);
    redisClient.set.mockResolvedValueOnce(null);

    await expect(service().ensureCheckoutStockFresh([1])).resolves.toBeUndefined();
    expect(client.assertStockFresh).toHaveBeenCalledTimes(2);
  });

  it('applies KiotViet on-hand minus KiotViet and Marketplace reservations', async () => {
    const result = await service().syncLinkedVariantStocks();
    expect(result).toMatchObject({ totalLinked: 1, updated: 1, skipped: 0 });
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: {
        isDeleted: 0,
        inventoryProvider: 'KIOTVIET',
        kiotvietProductCode: 'SKU-1',
        kiotvietBranchId: 443199,
      },
      data: expect.objectContaining({ stock: 5, kiotvietStockSyncedAt: expect.any(Date) }),
    });
    expect(catalog.recordProductChanges).toHaveBeenCalledWith(tx, [10]);
    expect(redisClient.eval).toHaveBeenCalled();
  });

  it('does not write local stock when the remote SKU is absent', async () => {
    client.getProductByCode.mockResolvedValueOnce(null);
    const result = await service().syncLinkedVariantStocks();
    expect(result).toMatchObject({ updated: 0, skipped: 1 });
    expect(tx.variant.updateMany).not.toHaveBeenCalled();
  });

  it('accepts the documented lowercase onhand field, including zero', async () => {
    client.getProductByCode.mockResolvedValueOnce({
      code: 'SKU-1',
      inventories: [{ branchId: 443199, onhand: 0, reserved: 0 }],
    });
    const result = await service().syncLinkedVariantStocks();
    expect(result).toMatchObject({ updated: 1, skipped: 0 });
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: {
        isDeleted: 0,
        inventoryProvider: 'KIOTVIET',
        kiotvietProductCode: 'SKU-1',
        kiotvietBranchId: 443199,
      },
      data: expect.objectContaining({ stock: 0 }),
    });
  });

  it('reads only linked KiotViet product codes instead of scanning productOnHands', async () => {
    prisma.variant.findMany.mockResolvedValueOnce([
      { id: 1, productId: 10, stock: 1, kiotvietProductCode: 'SKU-1' },
      { id: 2, productId: 11, stock: 2, kiotvietProductCode: 'SKU-2' },
    ]);
    client.getProductByCode.mockImplementation(async (code: string) => ({
      code,
      inventories: [{ branchId: 443199, onHand: code === 'SKU-1' ? 10 : 20, reserved: 0 }],
    }));
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValueOnce([]);
    prisma.orderProduct.groupBy.mockResolvedValueOnce([]);

    await service().syncLinkedVariantStocks();

    expect(client.getProductByCode).toHaveBeenCalledTimes(2);
    expect(client.getProductByCode).toHaveBeenCalledWith('SKU-1');
    expect(client.getProductByCode).toHaveBeenCalledWith('SKU-2');
    expect(client.getProductOnHands).not.toHaveBeenCalled();
  });

  it('limits KiotViet product reads to seven concurrent requests', async () => {
    const variants = Array.from({ length: 15 }, (_, index) => ({
      id: index + 1,
      productId: index + 100,
      stock: 0,
      kiotvietProductCode: `SKU-${index + 1}`,
    }));
    prisma.variant.findMany.mockResolvedValueOnce(variants);
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValueOnce([]);
    prisma.orderProduct.groupBy.mockResolvedValueOnce([]);
    let active = 0;
    let maxActive = 0;
    client.getProductByCode.mockImplementation(async (code: string) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return { code, inventories: [{ branchId: 443199, onHand: 1, reserved: 0 }] };
    });

    const result = await service().syncLinkedVariantStocks();

    expect(result).toMatchObject({ total: 15, succeeded: 15, failed: 0 });
    expect(maxActive).toBe(7);
  });

  it('keeps successful SKUs when another SKU fails after transient retries', async () => {
    prisma.variant.findMany.mockResolvedValueOnce([
      { id: 1, productId: 10, stock: 1, kiotvietProductCode: 'SKU-1' },
      { id: 2, productId: 11, stock: 9, kiotvietProductCode: 'SKU-2' },
    ]);
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValueOnce([]);
    prisma.orderProduct.groupBy.mockResolvedValueOnce([]);
    client.getProductByCode.mockImplementation(async (code: string) => {
      if (code === 'SKU-2') throw new ServiceUnavailableException('KiotViet tạm thời lỗi');
      return { code, inventories: [{ branchId: 443199, onHand: 10, reserved: 0 }] };
    });

    const result = await service().syncLinkedVariantStocks();

    expect(result).toMatchObject({ total: 2, succeeded: 1, failed: 1, updated: 1 });
    expect(result.failedItems).toEqual([expect.objectContaining({ variantId: 2, code: 'SKU-2' })]);
    expect(client.getProductByCode.mock.calls.filter(([code]) => code === 'SKU-2')).toHaveLength(3);
    expect(tx.variant.updateMany).toHaveBeenCalledTimes(1);
    expect(tx.variant.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ kiotvietProductCode: 'SKU-1' }),
      }),
    );
  });

  it('does not retry a non-transient invalid KiotViet response', async () => {
    client.getProductByCode.mockRejectedValueOnce(new BadRequestException('Mã SKU không hợp lệ'));

    const result = await service().syncLinkedVariantStocks();

    expect(result).toMatchObject({ succeeded: 0, failed: 1 });
    expect(client.getProductByCode).toHaveBeenCalledTimes(1);
    expect(tx.variant.updateMany).not.toHaveBeenCalled();
  });

  it('reports a completed job with failed SKUs as partial', async () => {
    webhookQueue.getJob.mockResolvedValueOnce({
      id: 'sync-1',
      name: 'stock-sync',
      data: { source: 'MANUAL', codes: [], requestedAt: '2026-09-26T00:00:00.000Z' },
      progress: { phase: 'SAVING', total: 2, processed: 2, succeeded: 1, failed: 1 },
      returnvalue: { total: 2, succeeded: 1, failed: 1 },
      failedReason: undefined,
      getState: jest.fn().mockResolvedValue('completed'),
    });

    await expect(service().getStockSyncJob('sync-1')).resolves.toMatchObject({
      jobId: 'sync-1',
      state: 'PARTIAL',
      result: { total: 2, succeeded: 1, failed: 1 },
    });
  });

  it('keeps unreflected Local orders reserved during reconciliation', async () => {
    prisma.orderProduct.findMany.mockResolvedValueOnce([{ orderId: 9, variantId: 1, quantity: 2 }]);
    await service().syncLinkedVariantStocks();
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: {
        isDeleted: 0,
        inventoryProvider: 'KIOTVIET',
        kiotvietProductCode: 'SKU-1',
        kiotvietBranchId: 443199,
      },
      data: expect.objectContaining({ stock: 3 }),
    });
  });

  it('subtracts successful Local orders from KiotViet source stock', async () => {
    prisma.variant.findMany.mockResolvedValueOnce([
      {
        id: 1,
        productId: 10,
        stock: 1,
        kiotvietProductCode: 'SKU-1',
        kiotvietLinkedAt: new Date('2026-09-01T00:00:00.000Z'),
      },
    ]);
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValueOnce([]);
    prisma.orderProduct.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        orderId: 9,
        variantId: 1,
        quantity: 2,
        order: { createdAt: new Date('2026-09-17T00:00:00.000Z'), kiotVietOutboxLogs: [] },
      },
    ]);

    const result = await service().syncLinkedVariantStocks();

    expect(result.items[0]).toMatchObject({
      kiotVietAvailableStock: 7,
      localHeldStock: 2,
      appliedStock: 5,
    });
    expect(tx.variant.updateMany).toHaveBeenCalledWith({
      where: {
        isDeleted: 0,
        inventoryProvider: 'KIOTVIET',
        kiotvietProductCode: 'SKU-1',
        kiotvietBranchId: 443199,
      },
      data: expect.objectContaining({ stock: 5 }),
    });
  });

  it('does not subtract an order after its KiotViet invoice succeeds', async () => {
    prisma.variant.findMany.mockResolvedValueOnce([
      {
        id: 1,
        productId: 10,
        stock: 1,
        kiotvietProductCode: 'SKU-1',
        kiotvietLinkedAt: new Date('2026-09-01T00:00:00.000Z'),
      },
    ]);
    prisma.marketplaceInventoryReservation.groupBy.mockResolvedValueOnce([]);
    prisma.orderProduct.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        orderId: 9,
        variantId: 1,
        quantity: 2,
        order: {
          createdAt: new Date('2026-09-17T00:00:00.000Z'),
          kiotVietOutboxLogs: [{ completedAt: new Date('2026-09-17T01:00:00.000Z') }],
        },
      },
    ]);

    const result = await service().syncLinkedVariantStocks();
    expect(result.items[0]).toMatchObject({
      kiotVietAvailableStock: 7,
      localHeldStock: 0,
      appliedStock: 7,
    });
  });

  it('checks raw-body HMAC and stores a webhook job before acknowledging it', async () => {
    const instance = service();
    const body = Buffer.from(
      '{"Id":"event-1","Notifications":[{"Data":[{"BranchId":443199,"ProductCode":"SKU-1"}]}]}',
    );
    const registeredSecret = Buffer.from(cfg.webhookRawSecret, 'utf8').toString('base64');
    const signature = createHmac('sha256', registeredSecret).update(body).digest('hex');
    await expect(instance.handleStockWebhook(signature, body)).resolves.toEqual({ received: true });
    await expect(instance.handleStockWebhook(signature.toUpperCase(), body)).resolves.toEqual({
      received: true,
    });
    expect(webhookQueue.add).toHaveBeenCalledWith(
      'stock-update',
      { eventId: 'event-1', branches: [443199], codes: ['SKU-1'] },
      expect.objectContaining({ attempts: 8 }),
    );
    const signatureWithRawSecret = createHmac('sha256', cfg.webhookRawSecret)
      .update(body)
      .digest('hex');
    await expect(instance.handleStockWebhook(signatureWithRawSecret, body)).rejects.toThrow();
    await expect(instance.handleStockWebhook('bad-signature', body)).rejects.toThrow();
    webhookQueue.add.mockRejectedValueOnce(new Error('redis unavailable'));
    await expect(instance.handleStockWebhook(signature, body)).rejects.toThrow();
  });

  it('registers stock.update automatically when the callback is ready and no registration exists', async () => {
    client.getWebhooks
      .mockResolvedValueOnce({ total: 0, pageSize: 100, data: [] })
      .mockResolvedValueOnce({
        total: 1,
        pageSize: 100,
        data: [{ id: 99, type: 'stock.update', url: cfg.callbackUrl, isActive: true }],
      });
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 401 });

    await expect(service().registerStockWebhook()).resolves.toMatchObject({
      registered: true,
      webhookId: 99,
    });
    expect(client.createStockWebhook).toHaveBeenCalledWith(cfg.callbackUrl, cfg.webhookRawSecret);
  });

  it('replaces an inactive matching webhook before registering again', async () => {
    client.getWebhooks
      .mockResolvedValueOnce({
        total: 1,
        pageSize: 100,
        data: [{ id: 88, type: 'stock.update', url: cfg.callbackUrl, isActive: false }],
      })
      .mockResolvedValueOnce({
        total: 1,
        pageSize: 100,
        data: [{ id: 99, type: 'stock.update', url: cfg.callbackUrl, isActive: true }],
      });
    jest.spyOn(axios, 'post').mockResolvedValue({ status: 401 });

    await expect(service().registerStockWebhook()).resolves.toMatchObject({
      registered: true,
      webhookId: 99,
      isActive: true,
    });
    expect(client.deleteWebhook).toHaveBeenCalledWith(88);
    expect(client.createStockWebhook).toHaveBeenCalledWith(cfg.callbackUrl, cfg.webhookRawSecret);
  });

  it('contains auto-registration failures and schedules a retry without rejecting', async () => {
    jest.useFakeTimers();
    const instance = service();
    jest
      .spyOn(instance, 'registerStockWebhook')
      .mockRejectedValue(new Error('KiotViet unavailable'));

    await expect(
      (
        instance as unknown as { reconcileWebhookRegistrationSafely(): Promise<void> }
      ).reconcileWebhookRegistrationSafely(),
    ).resolves.toBeUndefined();

    expect(instance.registerStockWebhook).toHaveBeenCalledTimes(1);
    instance.onModuleDestroy();
    jest.useRealTimers();
  });

  it('reports incomplete webhook configuration without contacting KiotViet', async () => {
    const instance = new KiotVietService(
      { ...cfg, callbackUrl: '', webhookRawSecret: '' } as never,
      client as never,
      branches as never,
      prisma as never,
      catalog as never,
      redis as never,
      webhookQueue as never,
      { enqueuePaidOrder: jest.fn() } as never,
      orderExports as never,
    );

    await expect(instance.webhookStatus()).resolves.toMatchObject({
      enabled: true,
      configured: false,
      registered: false,
    });
    expect(client.getWebhooks).not.toHaveBeenCalled();
  });
});

describe('KiotVietService link variant', () => {
  function setup(inventories: unknown = [{ branchId: 443199, onHand: 10, reserved: 3 }]) {
    const variant = { id: 4, productId: 10 };
    const client = {
      getProductByCode: jest.fn().mockResolvedValue({ code: '0333596825 69', inventories }),
      getProductOnHands: jest.fn(),
    };
    const tx = {
      kiotVietInventory: {
        upsert: jest.fn().mockImplementation(async ({ create }) => ({ ...create })),
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
      variant: {
        update: jest.fn().mockImplementation(async ({ data }) => ({ ...variant, ...data })),
        count: jest.fn().mockResolvedValue(0),
      },
    };
    const prisma = {
      variant: { findFirst: jest.fn().mockResolvedValueOnce(variant).mockResolvedValue(null) },
      orderProduct: {
        count: jest.fn().mockResolvedValue(0),
        groupBy: jest.fn().mockResolvedValue([]),
        findMany: jest.fn().mockResolvedValue([]),
      },
      marketplaceInventoryReservation: {
        count: jest.fn().mockResolvedValue(0),
        groupBy: jest.fn().mockResolvedValue([{ variantId: 4, _sum: { quantity: 2 } }]),
      },
      $transaction: jest.fn().mockImplementation(async (fn) => fn(tx)),
    };
    const catalog = { recordProductChanges: jest.fn().mockResolvedValue(undefined) };
    const service = new KiotVietService(
      { enabled: true, stockSyncEnabled: true, safetyStock: 1 } as never,
      client as never,
      { resolve: jest.fn().mockResolvedValue({ id: 443199 }) } as never,
      prisma as never,
      catalog as never,
      {} as never,
      {} as never,
      {} as never,
      {
        setOnStockChanged: jest.fn(),
        remotelyReservedOrderIds: jest.fn().mockResolvedValue(new Set<number>()),
      } as never,
    );
    return { service, client, prisma, tx, catalog };
  }

  it('links a spaced code using only product detail and commits calculated stock', async () => {
    const { service, client, tx, catalog } = setup([
      { branchId: 999, onHand: 100 },
      { branchId: 443199, onHand: 10, reserved: 3 },
    ]);
    await expect(service.linkVariant(4, ' 0333596825 69 ')).resolves.toMatchObject({
      kiotvietProductCode: '0333596825 69',
      kiotvietBranchId: 443199,
      inventoryProvider: 'KIOTVIET',
      stock: 6,
      kiotvietLinkedAt: expect.any(Date),
      kiotvietStockSyncedAt: expect.any(Date),
    });
    expect(client.getProductByCode).toHaveBeenCalledTimes(1);
    expect(client.getProductByCode).toHaveBeenCalledWith('0333596825 69', expect.any(String));
    expect(client.getProductOnHands).not.toHaveBeenCalled();
    expect(catalog.recordProductChanges).toHaveBeenCalledWith(tx, [10]);
  });

  it.each(['onHand', 'onhand'])('accepts zero %s', async (field) => {
    const { service } = setup([{ branchId: 443199, [field]: 0, reserved: 0 }]);
    await expect(service.linkVariant(4, '0333596825 69')).resolves.toMatchObject({ stock: 0 });
  });

  it.each([
    undefined,
    [],
    [{ branchId: 999, onHand: 10 }],
    [{ branchId: 443199, onHand: 'invalid' }],
  ])('rejects missing or invalid branch stock without scanning or writing', async (inventories) => {
    const { service, client, prisma } = setup(null);
    client.getProductByCode.mockResolvedValue({ code: '0333596825 69', inventories });
    await expect(service.linkVariant(4, '0333596825 69')).rejects.toThrow('Không tìm thấy tồn SKU');
    expect(client.getProductOnHands).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it.each([
    null,
    { code: 'different' },
    { code: '0333596825 69', allowsSale: false },
    { code: '0333596825 69', isActive: false },
  ])('rejects unavailable products before writing', async (remote) => {
    const { service, client, prisma } = setup();
    client.getProductByCode.mockResolvedValue(remote);
    await expect(service.linkVariant(4, '0333596825 69')).rejects.toThrow(
      'không tồn tại hoặc không được bán',
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it.each(['holds', 'salework'])('preserves the %s guard', async (kind) => {
    const { service, client, prisma } = setup();
    if (kind === 'holds') prisma.orderProduct.count.mockResolvedValue(1);
    if (kind === 'salework')
      prisma.variant.findFirst.mockReset().mockResolvedValue({ id: 4, saleworkProductCode: 'SW' });
    await expect(service.linkVariant(4, '0333596825 69')).rejects.toThrow();
    expect(client.getProductByCode).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('reuses shared inventory when another local SKU already uses the product code', async () => {
    const { service, tx } = setup();
    tx.kiotVietInventory.upsert.mockResolvedValueOnce({
      productCode: '0333596825 69',
      branchId: 443199,
      remoteAvailableStock: 7,
      availableStock: 4,
      stockSyncedAt: new Date('2026-09-29T00:00:00.000Z'),
    });

    await expect(service.linkVariant(4, '0333596825 69')).resolves.toMatchObject({
      stock: 4,
      kiotvietProductCode: '0333596825 69',
    });
  });

  it('does not write when the product read fails', async () => {
    const { service, client, prisma } = setup();
    client.getProductByCode.mockRejectedValue(new Error('upstream timeout'));
    await expect(service.linkVariant(4, '0333596825 69')).rejects.toThrow('upstream timeout');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
