const DiscountType = { Fixed: 'Fixed', Percentage: 'Percentage' } as const;
const VoucherScope = { Order: 'Order', Product: 'Product', Shipping: 'Shipping' } as const;
const VoucherType = {
  Normal: 'Normal',
  Freeship: 'Freeship',
  Secret: 'Secret',
  Hidden: 'Hidden',
} as const;

jest.mock('../../generated/prisma/client.js', () => ({
  ConditionType: { ZaloMiniApp: 'ZaloMiniApp', Website: 'Website' },
  DiscountType,
  OrderPlatform: { ZaloMiniApp: 'ZaloMiniApp', Website: 'Website' },
  OrderStatus: { Paid: 'Paid', Refund: 'Refund', Cancel: 'Cancel', Return: 'Return' },
  PricingMode: { Retail: 'Retail', Wholesale: 'Wholesale' },
  PaymentMethod: { COD: 'COD', ZaloPay: 'ZaloPay' },
  ShippingProvider: { SPX: 'SPX', JNT: 'JNT' },
  SaleWorkOutboxOperation: { Export: 'Export', Return: 'Return' },
  SaleWorkOutboxStatus: { Pending: 'Pending', Success: 'Success', Failed: 'Failed' },
  Prisma: {},
  PrismaClient: class {},
  UserPlatform: { Website: 'Website', ZaloMiniApp: 'ZaloMiniApp' },
  VoucherScope,
  VoucherType,
}));

import { OrderService } from './order.service.js';

describe('OrderService product item vouchers', () => {
  const createService = () =>
    new OrderService(
      {} as never,
      {} as never,
      {} as never,
      { estimateCheckoutDeliveryFee: jest.fn().mockResolvedValue({ deliveryFee: 0, shippingQuote: null }) } as never,
      {} as never,
      {} as never,
    );

  const createTx = (variants: unknown[], voucher: unknown) =>
    ({
      variant: { findMany: jest.fn().mockResolvedValue(variants) },
      voucher: { findFirst: jest.fn().mockResolvedValue(voucher) },
    }) as never;

  const createProductVoucher = (overrides: Record<string, unknown> = {}) => ({
    id: 9,
    code: 'ITEM30',
    description: 'Item voucher',
    type: VoucherType.Normal,
    scope: VoucherScope.Product,
    discountType: DiscountType.Fixed,
    discountValue: 30000,
    maxDiscount: null,
    minOrderValue: 0,
    usageLimit: null,
    usedCount: 0,
    conditionType: 'ZaloMiniApp',
    voucherProducts: [{ productId: 1 }],
    ...overrides,
  });

  it('applies one product voucher once across all non-flash variants of the product', async () => {
    const service = createService();
    const tx = createTx(
      [
        {
          id: 101,
          productId: 1,
          name: 'Red / M',
          image: null,
          dimensions: null,
          stock: 5,
          originalPrice: 100000,
          product: { id: 1, name: 'Dress', image: [] },
          flashSaleItems: [],
        },
        {
          id: 102,
          productId: 1,
          name: 'Blue / M',
          image: null,
          dimensions: null,
          stock: 5,
          originalPrice: 50000,
          product: { id: 1, name: 'Dress', image: [] },
          flashSaleItems: [],
        },
      ],
      createProductVoucher(),
    );

    const quote = await (service as any).calculateOrderQuote(
      tx,
      {
        userId: 1,
        addressId: 1,
        deliveryFee: 0,
        items: [
          { productId: 1, variantId: 101, quantity: 1 },
          { productId: 1, variantId: 102, quantity: 2 },
        ],
        itemVouchers: [{ productId: 1, voucherId: 9 }],
      },
      'ZaloMiniApp',
    );

    expect(quote.itemVoucherDiscount).toBe(30000);
    expect(quote.estAmount).toBe(170000);
    expect(quote.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ variantId: 101, finalPrice: 100000, itemVoucherId: 9 }),
        expect.objectContaining({ variantId: 102, finalPrice: 50000, itemVoucherId: 9 }),
      ]),
    );
  });

  it('does not apply product voucher to flash-sale variants of the same product', async () => {
    const service = createService();
    const tx = createTx(
      [
        {
          id: 101,
          productId: 1,
          name: 'Red / M',
          image: null,
          dimensions: null,
          stock: 5,
          originalPrice: 100000,
          product: { id: 1, name: 'Dress', image: [] },
          flashSaleItems: [
            {
              id: 1,
              flashSaleId: 2,
              discountType: DiscountType.Fixed,
              discountPercent: null,
              salePrice: 80000,
              saleStock: 5,
              sold: 0,
            },
          ],
        },
        {
          id: 102,
          productId: 1,
          name: 'Blue / M',
          image: null,
          dimensions: null,
          stock: 5,
          originalPrice: 100000,
          product: { id: 1, name: 'Dress', image: [] },
          flashSaleItems: [],
        },
      ],
      createProductVoucher({
        discountType: DiscountType.Percentage,
        discountValue: 10,
      }),
    );

    const quote = await (service as any).calculateOrderQuote(
      tx,
      {
        userId: 1,
        addressId: 1,
        deliveryFee: 0,
        items: [
          { productId: 1, variantId: 101, quantity: 1 },
          { productId: 1, variantId: 102, quantity: 1 },
        ],
        itemVouchers: [{ productId: 1, voucherId: 9 }],
      },
      'ZaloMiniApp',
    );

    expect(quote.itemVoucherDiscount).toBe(10000);
    expect(quote.estAmount).toBe(170000);
    const flashSaleItem = quote.items.find((item: any) => item.variantId === 101);
    const voucherItem = quote.items.find((item: any) => item.variantId === 102);

    expect(flashSaleItem).toEqual(expect.objectContaining({ variantId: 101, flashSaleId: 2 }));
    expect(flashSaleItem?.itemVoucherId).toBeUndefined();
    expect(voucherItem).toEqual(
      expect.objectContaining({ variantId: 102, itemVoucherId: 9, itemVoucherDiscount: 10000 }),
    );
  });


  it('applies an order voucher to a retail flash-sale line', async () => {
    const service = createService();
    const tx = createTx(
      [
        {
          id: 101,
          productId: 1,
          name: 'Red / M',
          image: null,
          dimensions: null,
          stock: 5,
          originalPrice: 100000,
          product: {
            id: 1,
            name: 'Dress',
            image: [],
            wholesaleEnabled: false,
            wholesaleUsers: [],
          },
          flashSaleItems: [
            {
              id: 1,
              flashSaleId: 2,
              discountType: DiscountType.Fixed,
              discountPercent: null,
              salePrice: 80000,
              saleStock: 5,
              sold: 0,
            },
          ],
        },
      ],
      createProductVoucher({
        code: 'ORDER10',
        scope: VoucherScope.Order,
        discountType: DiscountType.Fixed,
        discountValue: 10000,
        voucherProducts: [],
      }),
    );

    const quote = await (service as any).calculateOrderQuote(
      tx,
      {
        userId: 1,
        addressId: 1,
        deliveryFee: 0,
        orderVoucherId: 9,
        items: [{ productId: 1, variantId: 101, quantity: 1 }],
      },
      'ZaloMiniApp',
    );

    expect(quote.items[0]).toEqual(
      expect.objectContaining({
        pricingMode: 'Retail',
        flashSaleId: 2,
        finalPrice: 80000,
      }),
    );
    expect(quote.productDiscount).toBe(10000);
    expect(quote.totalAmount).toBe(70000);
  });

  it('rejects order voucher when retail eligible amount produces no discount', async () => {
    const service = createService();
    const tx = {
      voucher: {
        findFirst: jest.fn().mockResolvedValue(
          createProductVoucher({
            scope: VoucherScope.Order,
            minOrderValue: 0,
          }),
        ),
      },
    } as never;

    await expect(
      (service as any).applyProductVoucher(tx, 9, 0, 'ZaloMiniApp'),
    ).rejects.toThrow('Voucher toàn đơn không áp dụng cho sản phẩm bán sỉ');
  });

});


describe('OrderService admin order search', () => {
  const createService = (prisma: Record<string, unknown>) =>
    new OrderService(
      prisma as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
    );

  const createOrder = () => ({
    id: 10,
    code: 'ORD001',
    userId: 1,
    addressId: 20,
    createdAt: new Date('2026-07-14T00:00:00.000Z'),
    estAmount: 100000,
    itemVoucherDiscount: 0,
    productDiscount: 0,
    deliveryFee: 20000,
    deliveryDiscount: 0,
    deliveryAmount: 20000,
    totalAmount: 120000,
    shippingOrders: [],
    orderProducts: [],
  });

  it('filters admin orders by receiver name or phone instead of internal order code', async () => {
    const order = createOrder();
    const prisma = {
      address: {
        findMany: jest
          .fn()
          .mockResolvedValueOnce([{ id: 20 }])
          .mockResolvedValueOnce([{ id: 20, cneeName: 'Nguyen Lan', cneePhone: '0901 222 333' }]),
      },
      order: {
        findMany: jest.fn().mockResolvedValue([order]),
        count: jest.fn().mockResolvedValue(1),
      },
      user: { findMany: jest.fn().mockResolvedValue([{ id: 1, name: 'Lan' }]) },
      $transaction: jest.fn((queries) => Promise.all(queries as Promise<unknown>[])),
    };
    const service = createService(prisma);

    const result = await service.findAll({ q: '0901-222', status: 'Paid', page: 1, limit: 20, order: 'desc' } as never);

    expect(prisma.address.findMany).toHaveBeenNthCalledWith(1, {
      where: {
        OR: [
          { cneeName: { contains: '0901-222', mode: 'insensitive' } },
          { cneePhone: { contains: '0901-222', mode: 'insensitive' } },
          { cneePhone: { contains: '0901222', mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });
    expect(prisma.order.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'Paid', addressId: { in: [20] } },
      }),
    );
    expect(result.items[0]).toEqual(expect.objectContaining({ id: 10, address: expect.objectContaining({ id: 20 }) }));
    expect(result.meta.total).toBe(1);
  });

  it('returns an empty admin order page when no receiver matches the search', async () => {
    const prisma = {
      address: { findMany: jest.fn().mockResolvedValue([]) },
      order: { findMany: jest.fn(), count: jest.fn() },
      user: { findMany: jest.fn() },
      $transaction: jest.fn(),
    };
    const service = createService(prisma);

    const result = await service.findAll({ q: 'khong ton tai', page: 1, limit: 20, order: 'desc' } as never);

    expect(result.items).toEqual([]);
    expect(result.meta.total).toBe(0);
    expect(prisma.order.findMany).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
