import 'reflect-metadata';

import {
  DiscountType,
  PricingMode,
  VoucherScope,
  VoucherType,
} from '../../generated/prisma/enums.js';
jest.mock('../../prisma/prisma.service.js', () => ({ PrismaService: class PrismaService {} }));
jest.mock('./marketplace-catalog.service.js', () => ({
  MarketplaceCatalogService: class MarketplaceCatalogService {},
}));
import {
  MarketplaceQuoteMode,
  MarketplaceVoucherSelectionMode,
} from './dto/marketplace-commerce.dto.js';
import { MarketplaceCommerceService } from './marketplace-commerce.service.js';

describe('MarketplaceCommerceService', () => {
  const tx = {
    variant: { findMany: jest.fn() },
    voucher: { findMany: jest.fn() },
  };
  const prisma = {
    $transaction: jest.fn((callback: (client: typeof tx) => unknown) => callback(tx)),
  };
  const catalog = {
    resolveMedia: jest.fn((value: string | null | undefined) => value ?? null),
  };
  const service = new MarketplaceCommerceService(prisma as never, catalog as never);

  const variant = {
    id: 11,
    productId: 1,
    name: 'Variant',
    image: null,
    originalPrice: 100_000,
    wholesalePrice: 70_000,
    wholesaleMinQuantity: 1,
    stock: 10,
    packageWeightGrams: 300,
    packageLengthCm: 20,
    packageWidthCm: 10,
    packageHeightCm: 5,
    product: {
      id: 1,
      name: 'Product',
      image: [],
      wholesaleEnabled: true,
      wholesaleUsers: [{ userId: 7 }],
    },
    flashSaleItems: [
      {
        flashSaleId: 5,
        sold: 0,
        saleStock: 10,
        discountType: DiscountType.Percentage,
        discountPercent: 20,
        salePrice: null,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    tx.variant.findMany.mockResolvedValue([variant]);
    tx.voucher.findMany.mockResolvedValue([]);
  });

  it('always quotes cross-shop items at normal retail price', async () => {
    const result = await service.preview({
      context: {
        hostShopCode: 'shop-a',
        opaqueCustomerRef: 'opaque',
        mode: MarketplaceQuoteMode.CrossSource,
      },
      items: [{ sourceProductId: '1', sourceVariantId: '11', quantity: 1 }],
    });

    expect(result.items[0]).toMatchObject({
      unitPrice: 100_000,
      pricingMode: PricingMode.Retail,
      flashSaleId: null,
    });
  });

  it('treats a Decimal zero max discount as an uncapped percentage voucher', async () => {
    tx.voucher.findMany.mockResolvedValue([
      {
        id: 9,
        code: 'PUBLIC20',
        description: 'Giảm 20% không giới hạn',
        scope: VoucherScope.Order,
        type: VoucherType.Normal,
        discountType: DiscountType.Percentage,
        discountValue: 20,
        maxDiscount: { toString: () => '0' },
        minOrderValue: 150_000,
        usageLimit: null,
        usedCount: 0,
        voucherProducts: [],
      },
    ]);

    const result = await service.finalize({
      context: {
        hostShopCode: 'shop-a',
        opaqueCustomerRef: 'opaque',
        mode: MarketplaceQuoteMode.CrossSource,
      },
      items: [{ sourceProductId: '1', sourceVariantId: '11', quantity: 2 }],
      shippingFee: 20_000,
      voucherSelection: {
        mode: MarketplaceVoucherSelectionMode.Auto,
      },
    });

    expect(result.orderVoucherDiscount).toBe(40_000);
    expect(result.voucherSelection.orderVoucherId).toBe('9');
    expect(result.voucherCandidates.order[0]).toMatchObject({
      maxDiscount: null,
      eligible: true,
      disabledReason: null,
      discount: 40_000,
    });
  });

  it('does not auto-select a voucher that creates no discount', async () => {
    tx.voucher.findMany.mockResolvedValue([
      {
        id: 9,
        code: 'ZERO',
        description: 'Không tạo ưu đãi',
        scope: VoucherScope.Order,
        type: VoucherType.Normal,
        discountType: DiscountType.Fixed,
        discountValue: 0,
        maxDiscount: null,
        minOrderValue: 0,
        usageLimit: null,
        usedCount: 0,
        voucherProducts: [],
      },
    ]);

    const result = await service.finalize({
      context: {
        hostShopCode: 'shop-a',
        opaqueCustomerRef: 'opaque',
        mode: MarketplaceQuoteMode.CrossSource,
      },
      items: [{ sourceProductId: '1', sourceVariantId: '11', quantity: 1 }],
      shippingFee: 20_000,
      voucherSelection: {
        mode: MarketplaceVoucherSelectionMode.Auto,
      },
    });

    expect(result.orderVoucherDiscount).toBe(0);
    expect(result.voucherSelection.orderVoucherId).toBeNull();
    expect(result.voucherCandidates.order[0]).toMatchObject({
      eligible: false,
      disabledReason: 'Voucher không tạo được ưu đãi',
      discount: 0,
    });
  });

  it('keeps a manual empty voucher selection instead of reapplying the best voucher', async () => {
    tx.voucher.findMany.mockResolvedValue([
      {
        id: 9,
        code: 'PUBLIC10',
        description: 'Giảm 10%',
        scope: VoucherScope.Order,
        type: VoucherType.Normal,
        discountType: DiscountType.Percentage,
        discountValue: 10,
        maxDiscount: null,
        minOrderValue: 0,
        usageLimit: null,
        usedCount: 0,
        voucherProducts: [],
      },
    ]);

    const result = await service.finalize({
      context: {
        hostShopCode: 'shop-a',
        opaqueCustomerRef: 'opaque',
        mode: MarketplaceQuoteMode.CrossSource,
      },
      items: [{ sourceProductId: '1', sourceVariantId: '11', quantity: 1 }],
      shippingFee: 20_000,
      voucherSelection: {
        mode: MarketplaceVoucherSelectionMode.Manual,
        orderVoucherId: null,
        shippingVoucherId: null,
        itemVouchers: [],
      },
    });

    expect(result.orderVoucherDiscount).toBe(0);
    expect(result.voucherSelection).toMatchObject({
      mode: MarketplaceVoucherSelectionMode.Manual,
      orderVoucherId: null,
      shippingVoucherId: null,
    });
    expect(tx.voucher.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [{ type: { in: [VoucherType.Normal, VoucherType.Freeship] } }],
        }),
      }),
    );
  });
});
