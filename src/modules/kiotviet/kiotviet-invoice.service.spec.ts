import { KiotVietOutboxStatus } from '../../generated/prisma/client.js';
import { KiotVietInvoiceService } from './kiotviet-invoice.service.js';

jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class {} }));
jest.mock('../../generated/prisma/client.js', () => ({
  KiotVietOutboxStatus: {
    WAITING_SELLER: 'WAITING_SELLER',
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    UNCERTAIN: 'UNCERTAIN',
  },
  KiotVietOutboxOperation: { CREATE_INVOICE: 'CREATE_INVOICE' },
  InventoryProvider: { KIOTVIET: 'KIOTVIET' },
  OrderStatus: { Paid: 'Paid', Prepare: 'Prepare', Delivering: 'Delivering' },
}));

describe('KiotVietInvoiceService outbox', () => {
  const config = {
    enabled: true,
    stockSyncEnabled: true,
    autoWriteFrom: new Date('2026-09-17T00:00:00.000Z'),
  };
  const row = {
    id: 7,
    orderId: 9,
    businessKey: 'kiotviet:invoice:9',
    soldById: '301',
    selectedAt: new Date(),
    requestPayload: {
      branchId: 443199,
      soldById: 301,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, productCode: 'SKU-1', quantity: 1 }],
    },
  };
  const prisma = {
    order: {
      findUnique: jest.fn().mockResolvedValue({ status: 'Paid', userId: null, addressId: 1 }),
    },
    address: {
      findUnique: jest.fn().mockResolvedValue({
        cneeName: 'Lan',
        cneePhone: '0900000000',
        fullAddr: '12 Test Street',
      }),
    },
    user: { findUnique: jest.fn().mockResolvedValue({ name: 'Account Name' }) },
    kiotVietOutboxLog: {
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findUniqueOrThrow: jest.fn().mockResolvedValue(row),
      findUnique: jest.fn().mockResolvedValue(row),
      update: jest.fn().mockImplementation(({ data }: { data: unknown }) => Promise.resolve(data)),
    },
  };
  const client = {
    createInvoice: jest.fn(),
    getInvoice: jest.fn(),
    getCustomerByCode: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
  };
  const service = new KiotVietInvoiceService(
    config as never,
    prisma as never,
    {} as never,
    client as never,
  );

  beforeEach(() => {
    jest.clearAllMocks();
    prisma.kiotVietOutboxLog.updateMany.mockResolvedValue({ count: 1 });
    prisma.kiotVietOutboxLog.findUniqueOrThrow.mockResolvedValue(row);
    prisma.order.findUnique.mockResolvedValue({ status: 'Paid', userId: null, addressId: 1 });
    prisma.address.findUnique.mockResolvedValue({
      cneeName: 'Lan',
      cneePhone: '0900000000',
      fullAddr: '12 Test Street',
    });
    client.getCustomerByCode.mockResolvedValue({
      id: 42,
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
  });

  afterEach(() => jest.useRealTimers());

  it('verifies a created invoice before marking the operation successful', async () => {
    client.createInvoice.mockResolvedValue({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValue({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 42,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });
    await service.dispatch(7);
    expect(client.createInvoice).toHaveBeenCalledTimes(1);
    expect(client.getCustomerByCode).toHaveBeenCalledWith('ZALO1');
    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 42 }));
    expect(client.getInvoice).toHaveBeenCalledWith(123);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({ status: KiotVietOutboxStatus.SUCCESS, externalId: '123' }),
      }),
    );
  });

  it('removes purchaseDate from a previously queued invoice before posting it', async () => {
    prisma.kiotVietOutboxLog.findUniqueOrThrow.mockResolvedValueOnce({
      ...row,
      requestPayload: { ...row.requestPayload, purchaseDate: '2026-09-18T14:37:01.852' },
    });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 42,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });
    await service.dispatch(7);
    expect(client.createInvoice).toHaveBeenCalledWith(
      expect.not.objectContaining({ purchaseDate: expect.anything() }),
    );
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7 },
        data: expect.objectContaining({
          requestPayload: expect.not.objectContaining({ purchaseDate: expect.anything() }),
        }),
      }),
    );
  });

  it('creates a missing KiotViet customer using the ordering user identity', async () => {
    prisma.order.findUnique.mockResolvedValueOnce({ status: 'Paid', userId: 17, addressId: 1 });
    prisma.address.findUnique.mockResolvedValueOnce({
      userId: 17,
      cneeName: 'Lan',
      cneePhone: '0900000000',
      fullAddr: '12 Test Street',
    });
    client.getCustomerByCode.mockResolvedValueOnce(null);
    client.createCustomer.mockResolvedValueOnce({
      id: 84,
      code: 'KH000084',
      name: 'Account Name',
    });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 84,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });

    await service.dispatch(7);

    expect(client.getCustomerByCode).toHaveBeenCalledWith('ZALO17');
    expect(client.createCustomer).toHaveBeenCalledWith({
      code: 'ZALO17',
      name: 'Account Name',
      contactNumber: '0900000000',
      address: '12 Test Street',
      branchId: 443199,
    });
    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 84 }));
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.SUCCESS }),
      }),
    );
  });

  it('corrects an existing KiotViet customer when its name does not match the ordering user', async () => {
    prisma.order.findUnique.mockResolvedValueOnce({ status: 'Paid', userId: 17, addressId: 1 });
    prisma.address.findUnique.mockResolvedValueOnce({
      userId: 17,
      cneeName: 'Lan',
      cneePhone: '0900000000',
      fullAddr: '12 Test Street',
    });
    client.getCustomerByCode.mockResolvedValueOnce({
      id: 84,
      code: 'ZALO17',
      name: 'Wrong Name',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    client.updateCustomer.mockResolvedValueOnce({
      id: 84,
      code: 'ZALO17',
      name: 'Account Name',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 84,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });

    await service.dispatch(7);

    expect(client.updateCustomer).toHaveBeenCalledWith(84, {
      code: 'ZALO17',
      name: 'Account Name',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 84 }));
  });

  it('uses the order recipient for a guest customer', async () => {
    client.getCustomerByCode.mockResolvedValueOnce(null);
    client.createCustomer.mockResolvedValueOnce({ id: 85, code: 'ZALO1', name: 'Lan' });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 85,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });

    await service.dispatch(7);

    expect(client.createCustomer).toHaveBeenCalledWith({
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
      branchId: 443199,
    });
    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 85 }));
  });

  it('fills missing contact details on an existing KiotViet customer before posting', async () => {
    client.getCustomerByCode.mockResolvedValueOnce({
      id: 42,
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: null,
      address: null,
    });
    client.updateCustomer.mockResolvedValueOnce({
      id: 42,
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 42,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });

    await service.dispatch(7);

    expect(client.updateCustomer).toHaveBeenCalledWith(42, {
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 42 }));
  });

  it('does not post an invoice when the recipient phone is missing', async () => {
    client.getCustomerByCode.mockResolvedValueOnce(null);
    prisma.address.findUnique.mockResolvedValueOnce({
      cneeName: 'Lan',
      cneePhone: null,
      fullAddr: '12 Test Street',
    });

    await service.dispatch(7);

    expect(client.createCustomer).not.toHaveBeenCalled();
    expect(client.createInvoice).not.toHaveBeenCalled();
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.FAILED }),
      }),
    );
  });

  it('does not post an invoice when KiotViet customer creation fails', async () => {
    client.getCustomerByCode.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    client.createCustomer.mockRejectedValueOnce(new Error('Customer create failed'));

    await service.dispatch(7);

    expect(client.createInvoice).not.toHaveBeenCalled();
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.FAILED }),
      }),
    );
  });

  it('reuses a customer created concurrently under the same code', async () => {
    client.getCustomerByCode.mockResolvedValueOnce(null).mockResolvedValueOnce({
      id: 84,
      code: 'ZALO1',
      name: 'Lan',
      contactNumber: '0900000000',
      address: '12 Test Street',
    });
    client.createCustomer.mockRejectedValueOnce(new Error('duplicate customer code'));
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      code: 'HD001',
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 84,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });

    await service.dispatch(7);

    expect(client.createInvoice).toHaveBeenCalledWith(expect.objectContaining({ customerId: 84 }));
  });

  it('accepts KiotViet combining repeated product lines with the same total quantity', async () => {
    prisma.kiotVietOutboxLog.findUniqueOrThrow.mockResolvedValueOnce({
      ...row,
      requestPayload: {
        ...row.requestPayload,
        invoiceDetails: [
          { productId: 20, quantity: 1 },
          { productId: 20, quantity: 1 },
        ],
      },
    });
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 42,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 2 }],
    });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.SUCCESS }),
      }),
    );
  });

  it('never automatically reposts an uncertain result', async () => {
    client.createInvoice.mockRejectedValue(new Error('socket closed after POST'));
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.UNCERTAIN }),
      }),
    );
    prisma.kiotVietOutboxLog.updateMany.mockResolvedValueOnce({ count: 0 });
    await service.dispatch(7);
    expect(client.createInvoice).toHaveBeenCalledTimes(1);
  });

  it('keeps KiotViet response detail for an unrecognized HTTP rejection', async () => {
    client.createInvoice.mockRejectedValueOnce({
      isAxiosError: true,
      response: { status: 420, data: { message: 'Thông tin hóa đơn không hợp lệ' } },
    });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: KiotVietOutboxStatus.UNCERTAIN,
          errorMessage: 'KiotViet HTTP 420: Thông tin hóa đơn không hợp lệ',
        }),
      }),
    );
  });

  it('marks a definitive KiotViet HTTP 420 validation rejection as failed', async () => {
    client.createInvoice.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        status: 420,
        data: {
          responseStatus: {
            errorCode: 'KvValidateInvoiceException',
            message: 'Thiết lập không được bật',
          },
        },
      },
    });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.FAILED }),
      }),
    );
  });

  it('keeps a successful POST uncertain when verification cannot read the invoice', async () => {
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockRejectedValueOnce({ isAxiosError: true, response: { status: 401 } });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.UNCERTAIN }),
      }),
    );
  });

  it('does not send an invoice if the delivered order was reversed before dispatch', async () => {
    prisma.order.findUnique.mockResolvedValueOnce({ status: 'Return' });
    await service.dispatch(7);
    expect(client.createInvoice).not.toHaveBeenCalled();
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.FAILED }),
      }),
    );
  });

  it('does not POST a legacy pending invoice without a selected seller', async () => {
    prisma.kiotVietOutboxLog.findUniqueOrThrow.mockResolvedValueOnce({
      ...row,
      soldById: null,
      selectedAt: null,
      requestPayload: { ...row.requestPayload, soldById: undefined },
    });
    await service.dispatch(7);
    expect(client.createInvoice).not.toHaveBeenCalled();
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: KiotVietOutboxStatus.WAITING_SELLER }),
      }),
    );
  });

  it('requires a valid seller and atomically queues one confirmed invoice', async () => {
    const store = {
      kiotVietOutboxLog: {
        findUnique: jest.fn().mockResolvedValue({
          ...row,
          status: 'WAITING_SELLER',
          requestPayload: { ...row.requestPayload, purchaseDate: '2026-09-18T14:37:01.852' },
        }),
        findUniqueOrThrow: jest.fn().mockResolvedValue({ ...row, status: 'PENDING' }),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      order: { findUnique: jest.fn().mockResolvedValue({ status: 'Paid' }) },
      orderProduct: {
        findMany: jest.fn().mockResolvedValue([
          {
            quantity: 1,
            variant: {
              inventoryProvider: 'KIOTVIET',
              kiotvietProductCode: 'SKU-1',
              kiotvietBranchId: 443199,
            },
          },
        ]),
      },
    };
    const users = {
      getUsers: jest.fn().mockResolvedValue({
        total: 1,
        data: [{ id: 301, userName: 'seller', givenName: 'Seller' }],
      }),
      getProductByCode: jest.fn().mockResolvedValue({ id: 20, code: 'SKU-1' }),
    };
    const invoice = new KiotVietInvoiceService(
      config as never,
      store as never,
      { resolve: jest.fn().mockResolvedValue({ id: 443199 }) } as never,
      users as never,
    );
    jest.spyOn(invoice, 'processPending').mockResolvedValue(undefined);
    await invoice.confirmSeller(7, 301, 'admin-1');
    expect(store.kiotVietOutboxLog.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 7, status: 'WAITING_SELLER' },
        data: expect.objectContaining({
          status: 'PENDING',
          soldById: '301',
          selectedByAdminId: 'admin-1',
          requestPayload: expect.objectContaining({ soldById: 301 }),
        }),
      }),
    );
    expect(
      store.kiotVietOutboxLog.updateMany.mock.calls[0][0].data.requestPayload,
    ).not.toHaveProperty('purchaseDate');
    store.kiotVietOutboxLog.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(invoice.confirmSeller(7, 301, 'admin-2')).rejects.toThrow('đã được xác nhận');
    store.orderProduct.findMany.mockResolvedValueOnce([]);
    await expect(invoice.confirmSeller(7, 301, 'admin-3')).rejects.toThrow('Liên kết SKU');
  });

  it('rejects invoice verification when KiotViet records a different seller', async () => {
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      status: 1,
      branchId: 443199,
      soldById: 999,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: KiotVietOutboxStatus.UNCERTAIN,
          externalId: '123',
        }),
      }),
    );
  });

  it('keeps a created invoice for reconciliation when KiotViet records a different customer', async () => {
    client.createInvoice.mockResolvedValueOnce({ id: 123, code: 'HD001' });
    client.getInvoice.mockResolvedValueOnce({
      id: 123,
      status: 1,
      branchId: 443199,
      soldById: 301,
      customerId: 999,
      description: 'Local TEST-9',
      invoiceDetails: [{ productId: 20, quantity: 1 }],
    });
    await service.dispatch(7);
    expect(prisma.kiotVietOutboxLog.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: KiotVietOutboxStatus.UNCERTAIN,
          externalId: '123',
        }),
      }),
    );
  });

  it('queues one unpaid invoice after a KiotViet linked order is delivered', async () => {
    const queuedClient = {
      getProductByCode: jest.fn().mockResolvedValue({ id: 20, code: 'SKU-1', name: 'Product' }),
      createInvoice: jest.fn(),
    };
    const invoice = new KiotVietInvoiceService(
      config as never,
      {
        kiotVietOutboxLog: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
        order: {
          findUnique: jest.fn().mockResolvedValue({
            id: 9,
            code: 'Local-9',
            status: 'Paid',
            createdAt: new Date('2026-09-17T01:00:00.000Z'),
            kiotvietPaidAt: new Date('2026-09-17T01:30:00.000Z'),
            productDiscount: { toNumber: () => 10 },
            orderProducts: [
              {
                quantity: 2,
                finalPrice: { toNumber: () => 100 },
                itemVoucherDiscount: { toNumber: () => 20 },
                variant: {
                  inventoryProvider: 'KIOTVIET',
                  kiotvietProductCode: 'SKU-1',
                  kiotvietBranchId: 443199,
                  kiotvietLinkedAt: new Date('2026-09-16T01:00:00.000Z'),
                },
              },
            ],
          }),
        },
        $transaction: jest.fn(async (callback: (tx: unknown) => Promise<unknown>) =>
          callback({
            order: { count: jest.fn().mockResolvedValue(1) },
            kiotVietOutboxLog: {
              create: jest
                .fn()
                .mockImplementation(({ data }: { data: unknown }) => Promise.resolve(data)),
            },
          }),
        ),
      } as never,
      {
        resolve: jest.fn().mockResolvedValue({ id: 443199 }),
      } as never,
      queuedClient as never,
    );
    jest.spyOn(invoice, 'processPending').mockResolvedValue(undefined);

    const queued = await invoice.enqueuePaidOrder(9);
    expect(queued).toMatchObject({
      businessKey: 'kiotviet:invoice:9',
      status: 'WAITING_SELLER',
      requestPayload: {
        branchId: 443199,
        discount: 10,
        totalPayment: 0,
        invoiceDetails: [{ productId: 20, productCode: 'SKU-1', quantity: 2, price: 90 }],
      },
    });
    expect(queued?.requestPayload).not.toHaveProperty('purchaseDate');
    expect(queued?.requestPayload).not.toHaveProperty('soldById');
    expect(queuedClient.createInvoice).not.toHaveBeenCalled();
  });
});
