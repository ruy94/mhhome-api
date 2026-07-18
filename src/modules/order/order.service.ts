import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto, WebsiteShippingEstimateDto } from './dto/create-order.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { createHash, randomInt } from 'node:crypto';
import { ConfigService } from '@nestjs/config';
import { UpdateStatusOrderDto } from './dto/update-status-order.dto.js';
import { UpdateTrackingCodeOrderDto } from './dto/update-tracking-code.dto.js';
import {
  ConditionType,
  DiscountType,
  FlashSaleItem,
  OrderPlatform,
  OrderStatus,
  PricingMode,
  Prisma,
  ShippingProvider,
  UserPlatform,
  Voucher,
  VoucherScope,
  VoucherType,
} from '../../generated/prisma/client.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { OrderPageOptionsDto } from './dto/order-page-options.dto.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { AffiliateService } from '../affiliate/affiliate.service.js';
import { ShippingService } from '../shipping/shipping.service.js';
import type { ShippingEstimateResult } from '../shipping/shipping.types.js';
import { SaleWorkStockSyncService } from '../salework-sync/salework-stock-sync.service.js';
import { OrderInventoryService } from '../order-inventory/order-inventory.service.js';

const ORDER_VOUCHER_TYPES: VoucherType[] = [
  VoucherType.Normal,
  VoucherType.Secret,
  VoucherType.Hidden,
];

// Định nghĩa lại interface cho tính toán nội bộ
export interface CalculatedOrderItem {
  productId: number;
  variantId: number;
  quantity: number;
  originalPrice: number;
  finalPrice: number;
  flashSaleId?: number;
  flashSaleType?: DiscountType;
  flashSaleValue?: number;
  itemVoucherId?: number;
  itemVoucherType?: DiscountType;
  itemVoucherValue?: number;
  itemVoucherDiscount: number;
  pricingMode: PricingMode;
}

export interface QuotedOrderItem extends CalculatedOrderItem {
  lineAmount: number;
  product: {
    id: number;
    name: string;
    image: string[];
  };
  variant: {
    id: number;
    name: string;
    image?: string | null;
    dimensions?: Prisma.JsonValue | null;
    stock: number;
    pricingMode: PricingMode;
    minOrderQuantity: number;
    packageWeightGrams: number;
    packageLengthCm?: number | null;
    packageWidthCm?: number | null;
    packageHeightCm?: number | null;
  };
}

export interface QuoteVoucher {
  id: number;
  code: string;
  description: string;
  type: VoucherType;
  scope: VoucherScope;
  discountType: DiscountType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  conditionType: ConditionType;
  productIds: number[];
}

export interface AppliedVoucher {
  voucherId?: number;
  discount: number;
  voucher?: QuoteVoucher;
}

export interface PublicShippingEstimate {
  provider: ShippingProvider;
  label: string;
  fee: number;
  available: boolean;
  message?: string;
  shippingQuote?: ShippingEstimateResult | null;
}

export interface OrderQuote {
  items: QuotedOrderItem[];
  estAmount: number;
  itemVoucherDiscount: number;
  productDiscount: number;
  deliveryFee: number;
  deliveryDiscount: number;
  deliveryAmount: number;
  totalAmount: number;
  shippingQuote?: ShippingEstimateResult | null;
  productVoucher: AppliedVoucher;
  deliveryVoucher: AppliedVoucher;
  itemVouchers: AppliedVoucher[];
}

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private affiliateService: AffiliateService,
    private shippingService: ShippingService,
    private saleWorkStockSync: SaleWorkStockSyncService,
    private orderInventory: OrderInventoryService,
  ) {}

  generateOrderCode(): string {
    const seed = `${Date.now()}-${process.hrtime.bigint().toString()}-${randomInt(1, 1_000_000_000)}`;
    const hash = createHash('sha256').update(seed).digest('hex');
    let digits = hash.replace(/\D/g, '');
    if (digits.length < 10) {
      digits += Date.now().toString();
    }
    let firstDigit = digits[0];
    if (firstDigit === '0') {
      firstDigit = Math.floor(Math.random() * 9 + 1).toString();
    }
    return firstDigit + digits.substring(1, 10);
  }

  async create(dto: CreateOrderDto) {
    return this.createForPlatform(dto, OrderPlatform.ZaloMiniApp, ConditionType.ZaloMiniApp);
  }

  async createMiniappOrder(dto: CreateOrderDto) {
    return this.createForPlatform(dto, OrderPlatform.ZaloMiniApp, ConditionType.ZaloMiniApp);
  }

  async createWebsiteOrder(dto: CreateOrderDto) {
    const order = await this.prisma.$transaction(async (tx) => {
      const checkoutDto = await this.resolveWebsiteCheckoutDto(tx, dto);
      return this.createForPlatformTx(
        tx,
        checkoutDto,
        OrderPlatform.Website,
        ConditionType.Website,
      );
    });
    await this.saleWorkStockSync.exportOrderStock(order.id);
    return order;
  }

  async quoteMiniappOrder(dto: CreateOrderDto) {
    return this.quoteForPlatform(dto, ConditionType.ZaloMiniApp);
  }

  async quoteWebsiteOrder(dto: CreateOrderDto) {
    return this.quoteForPlatform(dto, ConditionType.Website);
  }

  async estimateMiniappShipping(dto: CreateOrderDto): Promise<PublicShippingEstimate> {
    return this.estimateShippingForPlatform(dto, ConditionType.ZaloMiniApp);
  }

  async estimateWebsiteShipping(dto: WebsiteShippingEstimateDto): Promise<PublicShippingEstimate> {
    return this.estimateShippingForPlatform(
      this.buildWebsiteShippingEstimateOrderDto(dto),
      ConditionType.Website,
    );
  }

  private buildWebsiteShippingEstimateOrderDto(dto: WebsiteShippingEstimateDto): CreateOrderDto {
    const city = dto.city.trim();
    const ward = dto.ward.trim();

    return {
      userId: dto.userId,
      orderVoucherId: dto.orderVoucherId,
      productVoucherId: dto.productVoucherId,
      deliveryVoucherId: dto.deliveryVoucherId,
      itemVouchers: dto.itemVouchers,
      deliveryFee: 0,
      shippingProvider: dto.shippingProvider,
      paymentMethod: dto.paymentMethod,
      items: dto.items,
      affiliateCode: dto.affiliateCode,
      affiliateProductId: dto.affiliateProductId,
      address: {
        cneeName: 'Khách website',
        cneePhone: '',
        idCity: dto.idCity,
        idDistrict: '',
        idWard: dto.idWard,
        city,
        district: '',
        ward,
        fullAddr: `${ward}, ${city}`,
      },
    };
  }

  private async estimateShippingForPlatform(
    dto: CreateOrderDto,
    voucherConditionType: ConditionType,
  ): Promise<PublicShippingEstimate> {
    const provider = dto.shippingProvider ?? ShippingProvider.SPX;
    if (provider === ShippingProvider.JNT) {
      return {
        provider,
        label: 'J&T Express',
        fee: 0,
        available: false,
        message: 'J&T Express chưa được hỗ trợ',
      };
    }
    if (provider !== ShippingProvider.SPX) {
      throw new BadRequestException('Phương thức vận chuyển không hợp lệ');
    }

    const quote = await this.quoteForPlatform(
      { ...dto, shippingProvider: ShippingProvider.SPX },
      voucherConditionType,
    );
    return {
      provider: ShippingProvider.SPX,
      label: 'SPX Express',
      fee: quote.deliveryFee,
      available: true,
      shippingQuote: quote.shippingQuote ?? null,
    };
  }

  private async quoteForPlatform(dto: CreateOrderDto, voucherConditionType: ConditionType) {
    return this.prisma.$transaction((tx) =>
      this.calculateOrderQuote(tx, dto, voucherConditionType),
    );
  }

  private async createForPlatform(
    dto: CreateOrderDto,
    platform: OrderPlatform,
    voucherConditionType: ConditionType,
  ) {
    const order = await this.prisma.$transaction((tx) =>
      this.createForPlatformTx(tx, dto, platform, voucherConditionType),
    );
    await this.saleWorkStockSync.exportOrderStock(order.id);
    return order;
  }

  private async createForPlatformTx(
    tx: Prisma.TransactionClient,
    dto: CreateOrderDto,
    platform: OrderPlatform,
    voucherConditionType: ConditionType,
  ) {
    if (!dto.userId || !dto.addressId) {
      throw new BadRequestException('Thiếu thông tin khách hàng hoặc địa chỉ giao hàng');
    }

    const userId = dto.userId;
    const addressId = dto.addressId;

    const quote = await this.calculateOrderQuote(tx, dto, voucherConditionType);
    const orderItems = quote.items;

    // Generate Unique Code
    let isUnique = false;
    let uniqueCode = '';
    while (!isUnique) {
      uniqueCode = this.generateOrderCode();
      const existingOrder = await tx.order.findUnique({
        // Dùng tx để check trong transaction
        where: { code: uniqueCode },
      });
      if (!existingOrder) isUnique = true;
    }

    // 4. Create Order
    const order = await tx.order.create({
      data: {
        code: uniqueCode,
        userId,
        addressId,
        productVoucherId: quote.productVoucher.voucherId,
        deliveryVoucherId: quote.deliveryVoucher.voucherId,
        estAmount: quote.estAmount,
        itemVoucherDiscount: quote.itemVoucherDiscount,
        productDiscount: quote.productDiscount,
        deliveryFee: quote.deliveryFee,
        deliveryDiscount: quote.deliveryDiscount,
        deliveryAmount: quote.deliveryAmount,
        totalAmount: quote.totalAmount,
        paymentMethod: dto.paymentMethod,
        note: dto.note?.trim() || null,
        platform,
        affiliateCode: dto.affiliateCode,
        affiliateProductId: dto.affiliateProductId,
        orderProducts: {
          create: orderItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            originalPrice: i.originalPrice,
            finalPrice: i.finalPrice,
            quantity: i.quantity,
            pricingMode: i.pricingMode,
            flashSaleId: i.flashSaleId,
            flashSaleType: i.flashSaleType,
            flashSaleValue: i.flashSaleValue,
            itemVoucherId: i.itemVoucherId,
            itemVoucherType: i.itemVoucherType,
            itemVoucherValue: i.itemVoucherValue,
            itemVoucherDiscount: i.itemVoucherDiscount,
          })),
        },
      },
    });

    // 5. Update Stock & Usage
    for (const item of orderItems) {
      // Trừ kho Variant
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });

      // Tăng số lượng đã bán Flash Sale (nếu có)
      if (item.flashSaleId) {
        await tx.flashSaleItem.updateMany({
          where: {
            flashSaleId: item.flashSaleId,
            variantId: item.variantId,
          },
          data: { sold: { increment: item.quantity } },
        });
      }
    }

    const voucherIdsToConsume = [
      ...quote.itemVouchers.map((item) => item.voucherId),
      quote.productVoucher.voucherId,
      quote.deliveryVoucher.voucherId,
    ].filter((id): id is number => Boolean(id));

    for (const voucherId of [...new Set(voucherIdsToConsume)]) {
      await this.consumeVoucherUsage(tx, userId, voucherId);
    }

    return order;
  }

  private async resolveWebsiteCheckoutDto(
    tx: Prisma.TransactionClient,
    dto: CreateOrderDto,
  ): Promise<CreateOrderDto> {
    if (dto.userId && dto.addressId) return dto;

    if (!dto.customer || !dto.address) {
      throw new BadRequestException('Thiếu thông tin khách hàng hoặc địa chỉ giao hàng');
    }

    const user = dto.userId
      ? await tx.user.findUnique({ where: { id: dto.userId } })
      : await this.findOrCreateWebsiteGuestUser(tx, dto.customer);

    if (!user) {
      throw new BadRequestException('Không tìm thấy khách hàng website');
    }

    const address = dto.addressId
      ? await tx.address.findFirst({
          where: { id: dto.addressId, userId: user.id, isDeleted: 0 },
        })
      : await tx.address.create({
          data: {
            userId: user.id,
            cneeName: dto.address.cneeName,
            cneePhone: dto.address.cneePhone,
            idCity: dto.address.idCity,
            city: dto.address.city,
            idDistrict: dto.address.idDistrict,
            district: dto.address.district,
            idWard: dto.address.idWard,
            ward: dto.address.ward,
            fullAddr: dto.address.fullAddr,
          },
        });

    if (!address) {
      throw new BadRequestException('Không tìm thấy địa chỉ giao hàng');
    }

    return {
      ...dto,
      userId: user.id,
      addressId: address.id,
    };
  }

  private async findOrCreateWebsiteGuestUser(
    tx: Prisma.TransactionClient,
    customer: NonNullable<CreateOrderDto['customer']>,
  ) {
    const email = this.normalizeEmail(customer.email);
    const phone = customer.phone.trim();
    const phoneNormalized = this.normalizePhone(phone);

    let user = email
      ? await tx.user.findFirst({
          where: { email, registeredFrom: UserPlatform.Website },
        })
      : null;

    if (!user && phoneNormalized) {
      user = await tx.user.findFirst({
        where: {
          phoneNormalized,
          registeredFrom: UserPlatform.Website,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const userData = this.compactUndefined({
      email,
      name: customer.name.trim(),
      phone,
      phoneNormalized,
      lastLoginFrom: UserPlatform.Website,
    });

    if (user) {
      return tx.user.update({
        where: { id: user.id },
        data: user.isGuest
          ? userData
          : this.compactUndefined({
              lastLoginFrom: UserPlatform.Website,
            }),
      });
    }

    return tx.user.create({
      data: {
        ...userData,
        registeredFrom: UserPlatform.Website,
        isGuest: true,
      },
    });
  }

  private normalizeEmail(email?: string | null) {
    return email?.trim().toLowerCase() || undefined;
  }

  private normalizePhone(phone?: string | null) {
    if (!phone) return undefined;

    const digits = phone.replace(/\D/g, '');
    if (!digits) return undefined;
    if (digits.startsWith('84')) return `0${digits.slice(2)}`;
    return digits;
  }

  private compactUndefined<T extends Record<string, unknown>>(data: T) {
    return Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined),
    ) as Partial<T>;
  }

  private async calculateOrderQuote(
    tx: Prisma.TransactionClient,
    dto: CreateOrderDto,
    voucherConditionType: ConditionType,
  ): Promise<OrderQuote> {
    const itemVoucherMap = this.buildItemVoucherMap(dto.itemVouchers);
    const variantIds = dto.items.map((i) => i.variantId);
    const now = new Date();

    const variants = await tx.variant.findMany({
      where: { id: { in: variantIds }, isDeleted: 0 },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            wholesaleEnabled: true,
            wholesaleUsers: {
              where: { userId: dto.userId ?? 0 },
              select: { userId: true },
            },
          },
        },
        flashSaleItems: {
          where: {
            flashSale: {
              status: 'Active',
              startTime: { lte: now },
              endTime: { gte: now },
            },
          },
        },
      },
    });

    if (variants.length !== dto.items.length) {
      throw new BadRequestException('Một số sản phẩm không hợp lệ hoặc đã hết hàng');
    }

    const quoteItems: QuotedOrderItem[] = [];

    for (const item of dto.items) {
      const variant = variants.find((v) => v.id === item.variantId)!;

      if (variant.productId !== item.productId) {
        throw new BadRequestException(`Sản phẩm ${variant.name} không khớp với biến thể`);
      }

      if (variant.stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${variant.name} không đủ tồn kho`);
      }

      const pricingMode = this.resolveOrderPricingMode(variant, dto.userId);
      const minOrderQuantity = pricingMode === PricingMode.Wholesale
        ? variant.wholesaleMinQuantity ?? 1
        : 1;

      if (item.quantity < minOrderQuantity) {
        throw new BadRequestException(
          `Sản phẩm ${variant.name} cần mua tối thiểu ${minOrderQuantity} sản phẩm`,
        );
      }

      let originalPrice = Number(variant.originalPrice);
      let finalPrice = originalPrice;
      let flashSaleSnapshot: FlashSaleItem | null = null;

      if (pricingMode === PricingMode.Wholesale) {
        originalPrice = Number(variant.wholesalePrice ?? 0);
        if (originalPrice <= 0) {
          throw new BadRequestException(`Sản phẩm ${variant.name} chưa có giá sỉ hợp lệ`);
        }
        finalPrice = originalPrice;
      } else {
        const flashItem = variant.flashSaleItems[0];

        if (flashItem && flashItem.sold + item.quantity <= flashItem.saleStock) {
          flashSaleSnapshot = flashItem;

          if (flashItem.discountType === DiscountType.Percentage) {
            finalPrice = Math.floor(finalPrice * (1 - (flashItem.discountPercent ?? 0) / 100));
          } else {
            finalPrice = Number(flashItem.salePrice ?? 0);
          }
        }
      }

      const lineAmount = finalPrice * item.quantity;

      quoteItems.push({
        productId: variant.productId,
        variantId: variant.id,
        quantity: item.quantity,
        originalPrice,
        finalPrice,
        pricingMode,
        lineAmount,
        flashSaleId: flashSaleSnapshot?.flashSaleId,
        flashSaleType: flashSaleSnapshot?.discountType,
        flashSaleValue: flashSaleSnapshot
          ? flashSaleSnapshot.discountType === DiscountType.Percentage
            ? Number(flashSaleSnapshot.discountPercent)
            : Number(flashSaleSnapshot.salePrice)
          : undefined,
        itemVoucherDiscount: 0,
        product: {
          id: variant.product.id,
          name: variant.product.name,
          image: variant.product.image,
        },
        variant: {
          id: variant.id,
          name: variant.name,
          image: variant.image,
          dimensions: variant.dimensions,
          stock: variant.stock,
          pricingMode,
          minOrderQuantity,
          packageWeightGrams: variant.packageWeightGrams,
          packageLengthCm: variant.packageLengthCm ? Number(variant.packageLengthCm) : null,
          packageWidthCm: variant.packageWidthCm ? Number(variant.packageWidthCm) : null,
          packageHeightCm: variant.packageHeightCm ? Number(variant.packageHeightCm) : null,
        },
      });
    }

    const itemVouchers = await this.applyItemVouchers(
      tx,
      quoteItems,
      itemVoucherMap,
      voucherConditionType,
    );
    const itemVoucherDiscount = itemVouchers.reduce((sum, item) => sum + item.discount, 0);
    const estAmount = quoteItems.reduce((sum, item) => sum + item.lineAmount, 0);
    const orderVoucherEligibleAmount = quoteItems
      .filter((item) => item.pricingMode !== PricingMode.Wholesale)
      .reduce((sum, item) => sum + item.lineAmount, 0);
    const orderVoucherId = dto.orderVoucherId ?? dto.productVoucherId;

    const productVoucher = await this.applyProductVoucher(
      tx,
      orderVoucherId,
      orderVoucherEligibleAmount,
      voucherConditionType,
    );

    const productDiscount = productVoucher.discount;
    const payableAmountBeforeDelivery = Math.max(estAmount - productDiscount, 0);
    const { deliveryFee, shippingQuote } = await this.shippingService.estimateCheckoutDeliveryFee(
      tx,
      dto,
      quoteItems,
      payableAmountBeforeDelivery,
    );

    const deliveryVoucher = await this.applyDeliveryVoucher(
      tx,
      dto.deliveryVoucherId,
      deliveryFee,
      estAmount,
      voucherConditionType,
    );

    const deliveryDiscount = deliveryVoucher.discount;
    const deliveryAmount = Math.max(deliveryFee - deliveryDiscount, 0);
    const totalAmount = estAmount - productDiscount + deliveryAmount;

    return {
      items: quoteItems,
      estAmount,
      itemVoucherDiscount,
      productDiscount,
      deliveryFee,
      deliveryDiscount,
      deliveryAmount,
      totalAmount,
      shippingQuote,
      productVoucher,
      deliveryVoucher,
      itemVouchers,
    };
  }


  private resolveOrderPricingMode(
    variant: Prisma.VariantGetPayload<{
      include: {
        product: {
          select: {
            wholesaleEnabled: true;
            wholesaleUsers: { select: { userId: true } };
          };
        };
      };
    }>,
    userId?: number,
  ) {
    return variant.product.wholesaleEnabled &&
      userId &&
      variant.product.wholesaleUsers.some((item) => item.userId === userId)
      ? PricingMode.Wholesale
      : PricingMode.Retail;
  }

  private buildItemVoucherMap(itemVouchers: CreateOrderDto['itemVouchers']) {
    const productVoucherMap = new Map<number, number>();
    const voucherIds = new Set<number>();

    for (const itemVoucher of itemVouchers ?? []) {
      if (productVoucherMap.has(itemVoucher.productId)) {
        throw new BadRequestException('Mỗi sản phẩm chỉ được áp dụng một voucher riêng');
      }
      if (voucherIds.has(itemVoucher.voucherId)) {
        throw new BadRequestException('Mỗi voucher riêng chỉ được dùng một lần trong đơn hàng');
      }

      productVoucherMap.set(itemVoucher.productId, itemVoucher.voucherId);
      voucherIds.add(itemVoucher.voucherId);
    }

    return productVoucherMap;
  }

  private async applyItemVouchers(
    tx: Prisma.TransactionClient,
    quoteItems: QuotedOrderItem[],
    itemVoucherMap: Map<number, number>,
    conditionType: ConditionType,
  ): Promise<AppliedVoucher[]> {
    const appliedVouchers: AppliedVoucher[] = [];

    for (const [productId, voucherId] of itemVoucherMap.entries()) {
      const productItems = quoteItems.filter((item) => item.productId === productId);
      if (productItems.length === 0) {
        throw new BadRequestException('Voucher riêng không khớp với sản phẩm trong đơn hàng');
      }

      const eligibleItems = productItems.filter(
        (item) => !item.flashSaleId && item.pricingMode !== PricingMode.Wholesale,
      );
      if (eligibleItems.length === 0) {
        throw new BadRequestException('Voucher riêng không áp dụng cho sản phẩm đang flash sale hoặc bán sỉ');
      }

      const eligibleAmount = eligibleItems.reduce(
        (sum, item) => sum + item.finalPrice * item.quantity,
        0,
      );
      const appliedVoucher = await this.applyItemVoucher(
        tx,
        voucherId,
        productId,
        eligibleAmount,
        conditionType,
      );

      if (!appliedVoucher.voucherId || !appliedVoucher.voucher) continue;

      const allocations = this.allocateDiscount(
        appliedVoucher.discount,
        eligibleItems.map((item) => item.finalPrice * item.quantity),
      );

      eligibleItems.forEach((item, index) => {
        const discount = allocations[index];
        item.itemVoucherId = appliedVoucher.voucherId;
        item.itemVoucherType = appliedVoucher.voucher?.discountType;
        item.itemVoucherValue = appliedVoucher.voucher?.discountValue;
        item.itemVoucherDiscount = discount;
        item.lineAmount = item.finalPrice * item.quantity - discount;
      });

      appliedVouchers.push(appliedVoucher);
    }

    return appliedVouchers;
  }

  private async applyItemVoucher(
    tx: Prisma.TransactionClient,
    id: number,
    productId: number,
    eligibleAmount: number,
    conditionType: ConditionType,
  ): Promise<AppliedVoucher> {
    const voucher = await tx.voucher.findFirst({
      where: {
        id,
        conditionType,
        scope: VoucherScope.Product,
        type: { in: ORDER_VOUCHER_TYPES },
        voucherProducts: { some: { productId } },
        isActive: true,
        isDeleted: 0,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
      include: { voucherProducts: { select: { productId: true } } },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher riêng cho sản phẩm không hợp lệ cho nền tảng này');
    }

    const minOrder = Number(voucher.minOrderValue);
    if (eligibleAmount < minOrder) {
      throw new BadRequestException('Sản phẩm chưa đủ điều kiện áp dụng voucher riêng');
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher riêng cho sản phẩm đã hết lượt sử dụng');
    }

    return {
      voucherId: voucher.id,
      discount: this.calculateVoucherDiscount(voucher, eligibleAmount),
      voucher: this.serializeVoucher(voucher),
    };
  }

  private calculateVoucherDiscount(voucher: Voucher, amount: number) {
    const discountValue = Number(voucher.discountValue);

    if (voucher.discountType === DiscountType.Percentage) {
      let discount = amount * (discountValue / 100);
      if (voucher.maxDiscount) {
        discount = Math.min(discount, Number(voucher.maxDiscount));
      }
      return Math.floor(discount);
    }

    if (voucher.discountType === DiscountType.Fixed) {
      return Math.min(discountValue, amount);
    }

    return 0;
  }

  private allocateDiscount(discount: number, amounts: number[]) {
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, 0);
    if (discount <= 0 || totalAmount <= 0) return amounts.map(() => 0);

    let allocated = 0;
    return amounts.map((amount, index) => {
      if (index === amounts.length - 1) return discount - allocated;
      const share = Math.floor((discount * amount) / totalAmount);
      allocated += share;
      return share;
    });
  }

  private async consumeVoucherUsage(
    tx: Prisma.TransactionClient,
    userId: number,
    voucherId: number,
  ) {
    const ownership = await tx.userVoucher.findFirst({
      where: { userId, voucherId, usedAt: null },
    });

    if (ownership) {
      await tx.userVoucher.update({
        where: { id: ownership.id },
        data: { usedAt: new Date() },
      });
    } else {
      await tx.userVoucher.create({
        data: { userId, voucherId, usedAt: new Date() },
      });
    }

    await tx.voucher.update({
      where: { id: voucherId },
      data: { usedCount: { increment: 1 } },
    });
  }

  async applyProductVoucher(
    tx: Prisma.TransactionClient,
    id: number | undefined,
    estAmount: number,
    conditionType: ConditionType,
  ): Promise<AppliedVoucher> {
    if (!id) return { discount: 0 };

    const voucher = await tx.voucher.findFirst({
      where: {
        id,
        conditionType,
        scope: VoucherScope.Order,
        type: { in: ORDER_VOUCHER_TYPES },
        isActive: true,
        isDeleted: 0,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher toàn đơn không hợp lệ cho nền tảng này');
    }

    const minOrder = Number(voucher.minOrderValue);
    if (estAmount < minOrder) {
      throw new BadRequestException('Đơn hàng chưa đủ điều kiện áp dụng voucher toàn đơn');
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher toàn đơn đã hết lượt sử dụng');
    }

    const discount = this.calculateVoucherDiscount(voucher, estAmount);
    if (discount <= 0) {
      throw new BadRequestException('Voucher toàn đơn không áp dụng cho sản phẩm bán sỉ');
    }

    return {
      voucherId: voucher.id,
      discount,
      voucher: this.serializeVoucher(voucher),
    };
  }

  async applyDeliveryVoucher(
    tx: Prisma.TransactionClient,
    id: number | undefined,
    deliveryFee: number,
    estAmount: number,
    conditionType: ConditionType,
  ): Promise<AppliedVoucher> {
    if (!id) return { discount: 0 };

    const voucher = await tx.voucher.findFirst({
      where: {
        id,
        conditionType,
        scope: VoucherScope.Shipping,
        type: VoucherType.Freeship,
        isActive: true,
        isDeleted: 0,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });

    if (!voucher) {
      throw new BadRequestException('Voucher vận chuyển không hợp lệ cho nền tảng này');
    }

    const minOrder = Number(voucher.minOrderValue);
    if (estAmount < minOrder) {
      throw new BadRequestException('Đơn hàng chưa đủ điều kiện áp dụng voucher vận chuyển');
    }

    if (voucher.usageLimit && voucher.usedCount >= voucher.usageLimit) {
      throw new BadRequestException('Voucher vận chuyển đã hết lượt sử dụng');
    }

    return {
      voucherId: voucher.id,
      discount: this.calculateVoucherDiscount(voucher, deliveryFee),
      voucher: this.serializeVoucher(voucher),
    };
  }

  private serializeVoucher(
    voucher: Voucher & { voucherProducts?: { productId: number }[] },
  ): QuoteVoucher {
    return {
      id: voucher.id,
      code: voucher.code,
      description: voucher.description,
      type: voucher.type,
      scope: voucher.scope,
      discountType: voucher.discountType,
      discountValue: Number(voucher.discountValue),
      maxDiscount: voucher.maxDiscount ? Number(voucher.maxDiscount) : null,
      minOrderValue: Number(voucher.minOrderValue),
      conditionType: voucher.conditionType,
      productIds: voucher.voucherProducts?.map((item) => item.productId) ?? [],
    };
  }

  private serializeShippingOrders<
    T extends {
      estimatedFee: Prisma.Decimal | null;
      actualFee: Prisma.Decimal | null;
      latestChargeableWeight?: Prisma.Decimal | null;
      latestActualWeight?: Prisma.Decimal | null;
      latestChargeableParcelLength?: Prisma.Decimal | null;
      latestChargeableParcelWidth?: Prisma.Decimal | null;
      latestChargeableParcelHeight?: Prisma.Decimal | null;
      events?: unknown[];
    },
  >(shippingOrders: T[]) {
    return shippingOrders.map((shippingOrder) => ({
      ...shippingOrder,
      estimatedFee: shippingOrder.estimatedFee ? Number(shippingOrder.estimatedFee) : null,
      actualFee: shippingOrder.actualFee ? Number(shippingOrder.actualFee) : null,
      latestChargeableWeight: shippingOrder.latestChargeableWeight
        ? Number(shippingOrder.latestChargeableWeight)
        : null,
      latestActualWeight: shippingOrder.latestActualWeight
        ? Number(shippingOrder.latestActualWeight)
        : null,
      latestChargeableParcelLength: shippingOrder.latestChargeableParcelLength
        ? Number(shippingOrder.latestChargeableParcelLength)
        : null,
      latestChargeableParcelWidth: shippingOrder.latestChargeableParcelWidth
        ? Number(shippingOrder.latestChargeableParcelWidth)
        : null,
      latestChargeableParcelHeight: shippingOrder.latestChargeableParcelHeight
        ? Number(shippingOrder.latestChargeableParcelHeight)
        : null,
    }));
  }

  async getMiniappOrdersByUser(userId: number, pageOptionsDto: PageOptionsDto) {
    return this.getOrdersByUser(userId, pageOptionsDto, OrderPlatform.ZaloMiniApp);
  }

  async getWebsiteOrdersByUser(userId: number, pageOptionsDto: PageOptionsDto) {
    return this.getOrdersByUser(userId, pageOptionsDto, OrderPlatform.Website);
  }

  async getOrdersByUser(userId: number, pageOptionsDto: PageOptionsDto, platform?: OrderPlatform) {
    const where: Prisma.OrderWhereInput = {
      userId,
      ...(platform ? { platform } : {}),
    };
    const [orders, itemCount] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        include: {
          shippingOrders: true,
          orderProducts: {
            include: {
              product: { select: { name: true, image: true } },
              variant: {
                select: { id: true, name: true, image: true, dimensions: true },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    const items = orders.map((order) => ({
      ...order,
      estAmount: Number(order.estAmount),
      itemVoucherDiscount: Number(order.itemVoucherDiscount),
      productDiscount: Number(order.productDiscount),
      deliveryFee: Number(order.deliveryFee),
      deliveryDiscount: Number(order.deliveryDiscount),
      deliveryAmount: Number(order.deliveryAmount),
      totalAmount: Number(order.totalAmount),
      shippingOrders: this.serializeShippingOrders(order.shippingOrders),
      orderProducts: order.orderProducts.map((item) => ({
        ...item,
        originalPrice: Number(item.originalPrice),
        finalPrice: Number(item.finalPrice),
        flashSaleValue: item.flashSaleValue ? Number(item.flashSaleValue) : 0,
        itemVoucherValue: item.itemVoucherValue ? Number(item.itemVoucherValue) : 0,
        itemVoucherDiscount: Number(item.itemVoucherDiscount),
      })),
    }));

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findAll(pageOptionsDto: OrderPageOptionsDto) {
    const keyword = pageOptionsDto.q?.trim();
    const where: Prisma.OrderWhereInput = {
      ...(pageOptionsDto.status ? { status: pageOptionsDto.status } : {}),
      ...(pageOptionsDto.paymentMethod ? { paymentMethod: pageOptionsDto.paymentMethod } : {}),
      ...(pageOptionsDto.platform ? { platform: pageOptionsDto.platform } : {}),
    };

    if (pageOptionsDto.createdFrom || pageOptionsDto.createdTo) {
      where.createdAt = {
        ...(pageOptionsDto.createdFrom ? { gte: new Date(pageOptionsDto.createdFrom) } : {}),
        ...(pageOptionsDto.createdTo ? { lte: new Date(pageOptionsDto.createdTo) } : {}),
      };
    }

    if (keyword) {
      const digits = keyword.replace(/\D/g, '');
      const addressFilters: Prisma.AddressWhereInput[] = [
        { cneeName: { contains: keyword, mode: 'insensitive' } },
        { cneePhone: { contains: keyword, mode: 'insensitive' } },
      ];

      if (digits && digits !== keyword) {
        addressFilters.push({ cneePhone: { contains: digits, mode: 'insensitive' } });
      }

      const matchedAddresses = await this.prisma.address.findMany({
        where: { OR: addressFilters },
        select: { id: true },
      });
      const addressIds = matchedAddresses.map((address) => address.id);

      if (addressIds.length === 0) {
        return new PageDto([], new PageMetaDto({ itemCount: 0, pageOptionsDto }));
      }

      where.addressId = { in: addressIds };
    }

    if (pageOptionsDto.shippingStage === 'processing') {
      where.status = OrderStatus.Pending;
      where.trackingCode = null;
    }

    if (pageOptionsDto.shippingStage === 'waiting_pickup') {
      where.status = { in: [OrderStatus.Pending, OrderStatus.SoftCancel] };
      where.trackingCode = { not: null };
    }

    const [orders, itemCount] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: pageOptionsDto.order },
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        include: {
          shippingOrders: pageOptionsDto.includeShippingEvents
            ? { include: { events: { orderBy: [{ happenedAt: 'asc' }, { createdAt: 'asc' }] } } }
            : true,
          orderProducts: {
            include: {
              product: { select: { id: true, name: true, image: true } },
              variant: {
                select: { id: true, name: true, image: true, dimensions: true },
              },
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    if (orders.length === 0) {
      return new PageDto([], new PageMetaDto({ itemCount: 0, pageOptionsDto }));
    }

    const userIds = [...new Set(orders.map((o) => o.userId))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
    });
    const addrIds = [...new Set(orders.map((o) => o.addressId))];
    const addresses = await this.prisma.address.findMany({
      where: { id: { in: addrIds } },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));
    const addressMap = new Map(addresses.map((a) => [a.id, a]));

    const items = orders.map((order) => ({
      ...order,
      user: userMap.get(order.userId) || null,
      address: addressMap.get(order.addressId) || null,
      estAmount: Number(order.estAmount),
      itemVoucherDiscount: Number(order.itemVoucherDiscount),
      productDiscount: Number(order.productDiscount),
      deliveryFee: Number(order.deliveryFee),
      deliveryDiscount: Number(order.deliveryDiscount),
      deliveryAmount: Number(order.deliveryAmount),
      totalAmount: Number(order.totalAmount),
      shippingOrders: this.serializeShippingOrders(order.shippingOrders),
      orderProducts: order.orderProducts.map((p) => ({
        ...p,
        originalPrice: Number(p.originalPrice),
        finalPrice: Number(p.finalPrice),
        flashSaleValue: p.flashSaleValue ? Number(p.flashSaleValue) : 0,
        itemVoucherValue: p.itemVoucherValue ? Number(p.itemVoucherValue) : 0,
        itemVoucherDiscount: Number(p.itemVoucherDiscount),
      })),
    }));

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findMiniappOrder(id: number) {
    return this.findOneByPlatform(id, OrderPlatform.ZaloMiniApp);
  }

  async findWebsiteOrder(id: number) {
    return this.findOneByPlatform(id, OrderPlatform.Website);
  }

  async findWebsiteOrderForUser(userId: number, id: number) {
    return this.findOneByPlatform(id, OrderPlatform.Website, userId);
  }

  async findOne(id: number) {
    return this.findOneByPlatform(id);
  }

  private async findOneByPlatform(id: number, platform?: OrderPlatform, userId?: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, ...(platform ? { platform } : {}), ...(userId ? { userId } : {}) },
      include: {
        shippingOrders: {
          include: {
            events: {
              orderBy: [{ happenedAt: 'asc' }, { createdAt: 'asc' }],
            },
          },
        },
        orderProducts: {
          include: { product: true, variant: true },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const [user, addressInOrder] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: order.userId } }),
      this.prisma.address.findFirst({
        where: {
          id: order.addressId,
        },
      }),
    ]);

    // Map response chuẩn (convert Decimal)
    return {
      ...order,
      estAmount: Number(order.estAmount),
      itemVoucherDiscount: Number(order.itemVoucherDiscount),
      productDiscount: Number(order.productDiscount),
      deliveryFee: Number(order.deliveryFee),
      deliveryDiscount: Number(order.deliveryDiscount),
      deliveryAmount: Number(order.deliveryAmount),
      totalAmount: Number(order.totalAmount),
      shippingOrders: this.serializeShippingOrders(order.shippingOrders),
      orderProducts: order.orderProducts.map((p) => ({
        ...p,
        originalPrice: Number(p.originalPrice),
        finalPrice: Number(p.finalPrice),
        flashSaleValue: p.flashSaleValue ? Number(p.flashSaleValue) : 0,
        itemVoucherValue: p.itemVoucherValue ? Number(p.itemVoucherValue) : 0,
        itemVoucherDiscount: Number(p.itemVoucherDiscount),
      })),
      user,
      address: addressInOrder,
      addressInOrder,
    };
  }

  async updateMiniappStatusOrder(id: number, dto: UpdateStatusOrderDto) {
    return this.updateStatusOrder(id, dto, OrderPlatform.ZaloMiniApp);
  }

  async updateWebsiteStatusOrder(id: number, dto: UpdateStatusOrderDto) {
    return this.updateStatusOrder(id, dto, OrderPlatform.Website);
  }

  async updateStatusOrder(id: number, dto: UpdateStatusOrderDto, platform?: OrderPlatform) {
    const order = await this.prisma.order.findFirst({
      where: { id, ...(platform ? { platform } : {}) },
      include: {
        orderProducts: {
          select: { productId: true, finalPrice: true, quantity: true, itemVoucherDiscount: true },
        },
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const nextStatus =
      dto.status === OrderStatus.Cancel && order.trackingCode
        ? OrderStatus.SoftCancel
        : dto.status;

    const updated = await this.prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: nextStatus },
      });
      await this.orderInventory.restoreIfFinalCancelled(order.id, order.status, nextStatus, tx);
      return updatedOrder;
    });

    // Tạo commission khi đơn hàng hoàn thành
    if (nextStatus === OrderStatus.Paid && order.affiliateCode && order.affiliateProductId) {
      await this.affiliateService.createCommission({
        affiliateCode: order.affiliateCode,
        orderId: order.id,
        orderUserId: order.userId,
        affiliateProductId: order.affiliateProductId,
        orderProducts: order.orderProducts.map((p) => ({
          productId: p.productId,
          finalPrice: Number(p.finalPrice),
          quantity: p.quantity,
          itemVoucherDiscount: Number(p.itemVoucherDiscount),
        })),
      });
    }

    // Từ chối commission khi đơn hàng bị hoàn hoặc huỷ
    if (
      (nextStatus === OrderStatus.Refund || nextStatus === OrderStatus.Cancel || nextStatus === OrderStatus.Return) &&
      order.affiliateCode
    ) {
      await this.affiliateService.rejectCommissionByOrder(order.id);
    }

    await this.saleWorkStockSync.returnOrderStockIfFinalCancelled(order.id, order.status, nextStatus);

    return updated;
  }

  async reverseTrackingCode(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        trackingCode: null,
        status: OrderStatus.Pending,
      },
    });
  }

  async updateTrackingCode(orderId: number, dto: UpdateTrackingCodeOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    if (!order) throw new NotFoundException('Order not found');

    return await this.prisma.order.update({
      where: { id: orderId },
      data: {
        trackingCode: dto.trackingCode,
        status: OrderStatus.Prepare,
      },
    });
  }
}
