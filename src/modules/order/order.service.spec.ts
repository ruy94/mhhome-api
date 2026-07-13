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
