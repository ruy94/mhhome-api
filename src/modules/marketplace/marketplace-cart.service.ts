import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import marketplaceConfig from '../../config/marketplace.config.js';
import { OrderPlatform, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { normalizeSpxAddress } from '../shipping/spx-address-normalizer.js';
import type {
  AddMarketplaceCartItemDto,
  MarketplaceCheckoutQuoteDto,
  MarketplaceCheckoutPrepareDto,
  UpdateMarketplaceCartItemDto,
} from './dto/marketplace-cart.dto.js';
import { MarketplaceVoucherSelectionMode } from './dto/marketplace-commerce.dto.js';
import { MarketplaceClientService } from './marketplace-client.service.js';

interface MarketplaceCatalogItem {
  listingId: string;
  sourceShop: { id: string; code: string; name: string };
  product: {
    sourceProductId: string;
    name: string;
    images: string[];
    tierVariations?: unknown;
    variants: Array<{
      sourceVariantId: string;
      name: string;
      image?: string | null;
      retailPrice: number;
      compareAtPrice?: number | null;
      stock: number;
    }>;
  };
}

@Injectable()
export class MarketplaceCartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly client: MarketplaceClientService,
    @Inject(marketplaceConfig.KEY)
    private readonly config: ConfigType<typeof marketplaceConfig>,
  ) {}

  async get(userId: number) {
    if (!this.config.enabled) return this.emptyCart();
    await this.assertUser(userId);
    return this.serialize(
      await this.prisma.marketplaceCartItem.findMany({
        where: { userId, platform: OrderPlatform.ZaloMiniApp },
        orderBy: { createdAt: 'asc' },
      }),
    );
  }

  async add(userId: number, dto: AddMarketplaceCartItemDto) {
    this.assertCheckoutEnabled();
    await this.assertUser(userId);
    const response = await this.client.getCatalogItem(dto.listingId);
    const listing = response.data as MarketplaceCatalogItem;
    const variant = listing.product.variants.find(
      (item) => item.sourceVariantId === dto.sourceVariantId,
    );
    if (!variant || variant.stock < dto.quantity || variant.retailPrice <= 0) {
      throw new BadRequestException('Biến thể liên kết không còn đủ điều kiện bán');
    }
    await this.prisma.marketplaceCartItem.upsert({
      where: {
        userId_listingId_sourceVariantId_platform: {
          userId,
          listingId: listing.listingId,
          sourceVariantId: variant.sourceVariantId,
          platform: OrderPlatform.ZaloMiniApp,
        },
      },
      create: {
        userId,
        listingId: listing.listingId,
        sourceShopId: listing.sourceShop.id,
        sourceShopCode: listing.sourceShop.code,
        sourceShopName: listing.sourceShop.name,
        sourceProductId: listing.product.sourceProductId,
        sourceVariantId: variant.sourceVariantId,
        quantity: dto.quantity,
        productSnapshot: this.json({
          name: listing.product.name,
          images: listing.product.images,
          tierVariations: listing.product.tierVariations ?? null,
          variants: listing.product.variants,
        }),
        variantSnapshot: this.json(variant),
      },
      update: {
        quantity: { increment: dto.quantity },
        sourceShopName: listing.sourceShop.name,
        productSnapshot: this.json({
          name: listing.product.name,
          images: listing.product.images,
          tierVariations: listing.product.tierVariations ?? null,
          variants: listing.product.variants,
        }),
        variantSnapshot: this.json(variant),
      },
    });
    const cart = await this.get(userId);
    const saved = cart.items.find(
      (item) => item.listingId === listing.listingId && item.sourceVariantId === variant.sourceVariantId,
    );
    if (saved && saved.quantity > variant.stock) {
      await this.prisma.marketplaceCartItem.update({
        where: { id: saved.id },
        data: { quantity: variant.stock },
      });
      return this.get(userId);
    }
    return cart;
  }

  async update(userId: number, itemId: string, dto: UpdateMarketplaceCartItemDto) {
    this.assertCheckoutEnabled();
    const item = await this.ownedItem(userId, itemId);
    const response = await this.client.getCatalogItem(item.listingId);
    const listing = response.data as MarketplaceCatalogItem;
    const sourceVariantId = dto.sourceVariantId ?? item.sourceVariantId;
    const variant = listing.product.variants.find(
      (candidate) => candidate.sourceVariantId === sourceVariantId,
    );
    if (!variant || variant.retailPrice <= 0) {
      throw new BadRequestException('Biến thể liên kết không còn đủ điều kiện bán');
    }

    const existing = sourceVariantId === item.sourceVariantId
      ? null
      : await this.prisma.marketplaceCartItem.findUnique({
          where: {
            userId_listingId_sourceVariantId_platform: {
              userId,
              listingId: item.listingId,
              sourceVariantId,
              platform: OrderPlatform.ZaloMiniApp,
            },
          },
        });
    const nextQuantity = existing ? existing.quantity + dto.quantity : dto.quantity;
    if (variant.stock < nextQuantity) {
      throw new BadRequestException('Số lượng vượt tồn kho hiện tại của sản phẩm');
    }

    const snapshot = {
      name: listing.product.name,
      images: listing.product.images,
      tierVariations: listing.product.tierVariations ?? null,
      variants: listing.product.variants,
    };
    await this.prisma.$transaction(async (tx) => {
      if (existing) {
        await tx.marketplaceCartItem.update({
          where: { id: existing.id },
          data: {
            quantity: nextQuantity,
            sourceShopName: listing.sourceShop.name,
            productSnapshot: this.json(snapshot),
            variantSnapshot: this.json(variant),
          },
        });
        await tx.marketplaceCartItem.delete({ where: { id: item.id } });
        return;
      }
      await tx.marketplaceCartItem.update({
        where: { id: item.id },
        data: {
          sourceVariantId,
          quantity: dto.quantity,
          sourceShopName: listing.sourceShop.name,
          productSnapshot: this.json(snapshot),
          variantSnapshot: this.json(variant),
        },
      });
    });
    return this.get(userId);
  }

  async remove(userId: number, itemId: string) {
    this.assertEnabled();
    const item = await this.ownedItem(userId, itemId);
    await this.prisma.marketplaceCartItem.delete({ where: { id: item.id } });
    return this.get(userId);
  }

  async clear(userId: number) {
    if (!this.config.enabled) return this.emptyCart();
    await this.assertUser(userId);
    await this.prisma.marketplaceCartItem.deleteMany({
      where: { userId, platform: OrderPlatform.ZaloMiniApp },
    });
    return this.get(userId);
  }

  async quote(dto: MarketplaceCheckoutQuoteDto) {
    this.assertCheckoutEnabled();
    const response = await this.client.quoteCheckout(await this.buildCheckoutPayload(dto));
    return response.data;
  }

  async prepare(dto: MarketplaceCheckoutPrepareDto) {
    this.assertCheckoutEnabled();
    const response = await this.client.prepareCheckout(
      await this.buildCheckoutPayload(dto),
      dto.checkoutAttemptId,
    );
    return response.data;
  }

  async getCheckoutSession(sessionId: string) {
    this.assertEnabled();
    return (await this.client.getCheckoutSession(sessionId)).data;
  }

  async confirmCheckout(sessionId: string) {
    this.assertEnabled();
    return (await this.client.confirmCheckout(sessionId)).data;
  }

  async releaseCheckout(sessionId: string) {
    this.assertEnabled();
    return (await this.client.releaseCheckout(sessionId)).data;
  }

  private async buildCheckoutPayload(
    dto: MarketplaceCheckoutQuoteDto | MarketplaceCheckoutPrepareDto,
  ) {
    const prepareDto = dto as Partial<MarketplaceCheckoutPrepareDto>;
    await this.assertUser(dto.userId);
    const crossItems = await this.prisma.marketplaceCartItem.findMany({
      where: {
        id: { in: dto.marketplaceCartItemIds },
        userId: dto.userId,
        platform: OrderPlatform.ZaloMiniApp,
      },
    });
    if (crossItems.length !== new Set(dto.marketplaceCartItemIds).size) {
      throw new BadRequestException('Một số sản phẩm liên kết không có trong giỏ hàng');
    }
    const identity = await this.prisma.marketplaceCustomerIdentity.upsert({
      where: { userId: dto.userId },
      create: { userId: dto.userId },
      update: {},
    });
    const address = dto.addressId
      ? await this.prisma.address.findFirst({
          where: { id: dto.addressId, userId: dto.userId, isDeleted: 0 },
        })
      : null;
    if (dto.addressId && !address) throw new BadRequestException('Địa chỉ giao hàng không hợp lệ');
    const normalized = address
      ? normalizeSpxAddress(address.city, address.district, address.ward)
      : null;
    if (address && !normalized) {
      throw new BadRequestException('Địa chỉ giao hàng đã cũ, vui lòng cập nhật lại');
    }
    const hostSelection = dto.hostVoucherSelection;
    const voucherSelections = [
      ...(dto.localItems?.length
        ? [
            {
              sourceShopCode: this.config.shopCode,
              mode: hostSelection?.mode ?? MarketplaceVoucherSelectionMode.Auto,
              orderVoucherId: this.optionalString(hostSelection?.orderVoucherId),
              shippingVoucherId: this.optionalString(hostSelection?.shippingVoucherId),
              itemVouchers: (hostSelection?.itemVouchers ?? []).map((item) => ({
                sourceProductId: String(item.productId),
                voucherId: String(item.voucherId),
              })),
            },
          ]
        : []),
      ...(dto.sourceVoucherSelections ?? []).map((selection) => ({
        sourceShopCode: selection.sourceShopCode,
        mode: selection.mode,
        orderVoucherId: selection.orderVoucherId,
        shippingVoucherId: selection.shippingVoucherId,
        itemVouchers: selection.itemVouchers,
      })),
    ];
    return {
      hostLocalUserId: dto.userId,
      opaqueCustomerRef: identity.id,
      ...(address && normalized
        ? {
            recipient: {
              name: address.cneeName ?? '',
              phone: address.cneePhone ?? '',
              state: normalized.state,
              city: normalized.city,
              district: normalized.district,
              detailAddress: address.fullAddr ?? '',
              addressVersion: normalized.addressVersion,
            },
          }
        : {}),
      items: [
        ...(dto.localItems ?? []).map((item) => ({
          kind: 'Local',
          sourceProductId: String(item.productId),
          sourceVariantId: String(item.variantId),
          quantity: item.quantity,
        })),
        ...crossItems.map((item) => ({
          kind: 'Cross',
          listingId: item.listingId,
          sourceVariantId: item.sourceVariantId,
          quantity: item.quantity,
        })),
      ],
      voucherSelections,
      sourceInputs: dto.sourceInputs ?? [],
      ...(prepareDto.checkoutAttemptId
        ? {
            note: prepareDto.note?.trim() || null,
            invoiceRequest: prepareDto.invoiceRequest ?? null,
          }
        : {}),
    };
  }

  private async assertUser(userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
  }

  private assertEnabled() {
    if (!this.config.enabled) throw new NotFoundException();
  }

  private assertCheckoutEnabled() {
    if (!this.config.enabled || !this.config.checkoutEnabled) throw new NotFoundException();
  }

  private emptyCart() {
    return { items: [], totalQuantity: 0, subtotal: 0 };
  }

  private async ownedItem(userId: number, itemId: string) {
    const item = await this.prisma.marketplaceCartItem.findFirst({
      where: { id: itemId, userId, platform: OrderPlatform.ZaloMiniApp },
    });
    if (!item) throw new NotFoundException('Marketplace cart item not found');
    return item;
  }

  private serialize(items: Awaited<ReturnType<MarketplaceCartService['cartItems']>>) {
    const serialized = items.map((item) => {
      const product = item.productSnapshot as Record<string, unknown>;
      const variant = item.variantSnapshot as Record<string, unknown>;
      return {
        id: item.id,
        listingId: item.listingId,
        sourceShopId: item.sourceShopId,
        sourceShopCode: item.sourceShopCode,
        sourceShopName: item.sourceShopName,
        sourceProductId: item.sourceProductId,
        sourceVariantId: item.sourceVariantId,
        quantity: item.quantity,
        product,
        variant,
        lineAmount: Number(variant.retailPrice ?? 0) * item.quantity,
        isAvailable: Number(variant.stock ?? 0) >= item.quantity,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });
    return {
      items: serialized,
      totalQuantity: serialized.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: serialized.reduce((sum, item) => sum + item.lineAmount, 0),
    };
  }

  private cartItems() {
    return this.prisma.marketplaceCartItem.findMany();
  }

  private json(value: unknown): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private optionalString(value?: number | null) {
    return value === undefined || value === null ? null : String(value);
  }
}
