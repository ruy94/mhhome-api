import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { FlashSaleStatus, OrderPlatform, PricingMode, Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { SyncCartDto, SyncCartMode } from './dto/sync-cart.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { mapActiveFlashSale } from '../flash-sale/active-flash-sale.util.js';

type CartTx = Prisma.TransactionClient;

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getMiniappCart(userId: number) {
    return this.getCart(userId, OrderPlatform.ZaloMiniApp);
  }

  async getWebsiteCart(userId: number) {
    return this.getCart(userId, OrderPlatform.Website);
  }

  async addMiniappItem(userId: number, dto: AddCartItemDto) {
    return this.addItem(userId, OrderPlatform.ZaloMiniApp, dto);
  }

  async addWebsiteItem(userId: number, dto: AddCartItemDto) {
    return this.addItem(userId, OrderPlatform.Website, dto);
  }

  async updateMiniappItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    return this.updateItem(userId, OrderPlatform.ZaloMiniApp, itemId, dto);
  }

  async updateWebsiteItem(userId: number, itemId: number, dto: UpdateCartItemDto) {
    return this.updateItem(userId, OrderPlatform.Website, itemId, dto);
  }

  async removeMiniappItem(userId: number, itemId: number) {
    return this.removeItem(userId, OrderPlatform.ZaloMiniApp, itemId);
  }

  async removeWebsiteItem(userId: number, itemId: number) {
    return this.removeItem(userId, OrderPlatform.Website, itemId);
  }

  async clearMiniappCart(userId: number) {
    return this.clearCart(userId, OrderPlatform.ZaloMiniApp);
  }

  async clearWebsiteCart(userId: number) {
    return this.clearCart(userId, OrderPlatform.Website);
  }

  async syncMiniappCart(userId: number, dto: SyncCartDto) {
    return this.syncCart(userId, OrderPlatform.ZaloMiniApp, dto);
  }

  async syncWebsiteCart(userId: number, dto: SyncCartDto) {
    return this.syncCart(userId, OrderPlatform.Website, dto);
  }

  private async getCart(userId: number, platform: OrderPlatform) {
    await this.assertUserExists(userId);

    const items = await this.prisma.cartItem.findMany({
      where: { userId, platform },
      orderBy: { updatedAt: 'desc' },
      include: this.cartItemInclude(),
    });

    return this.serializeCart(items);
  }

  private async addItem(userId: number, platform: OrderPlatform, dto: AddCartItemDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.assertUserExists(userId, tx);
      const variant = await this.assertVariantAvailable(tx, dto.productId, dto.variantId, userId);
      const pricingMode = this.resolvePricingMode(variant, userId);

      const existing = await tx.cartItem.findUnique({
        where: {
          userId_variantId_platform: {
            userId,
            variantId: dto.variantId,
            platform,
          },
        },
      });

      const nextQuantity = (existing?.quantity ?? 0) + dto.quantity;
      this.assertQuantityAvailable(variant.stock, nextQuantity, variant.name, this.minQuantityForMode(variant, pricingMode));

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: nextQuantity, pricingMode },
        });
      } else {
        await tx.cartItem.create({
          data: {
            userId,
            productId: dto.productId,
            variantId: dto.variantId,
            quantity: dto.quantity,
            pricingMode,
            platform,
          },
        });
      }

      return this.getCartInTx(tx, userId, platform);
    });
  }

  private async updateItem(
    userId: number,
    platform: OrderPlatform,
    itemId: number,
    dto: UpdateCartItemDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const item = await this.findOwnedItem(tx, userId, platform, itemId);
      const variant = await this.assertVariantAvailable(tx, item.productId, item.variantId, userId);
      const pricingMode = this.resolvePricingMode(variant, userId);
      this.assertQuantityAvailable(variant.stock, dto.quantity, variant.name, this.minQuantityForMode(variant, pricingMode));

      await tx.cartItem.update({
        where: { id: item.id },
        data: { quantity: dto.quantity, pricingMode },
      });

      return this.getCartInTx(tx, userId, platform);
    });
  }

  private async removeItem(userId: number, platform: OrderPlatform, itemId: number) {
    return this.prisma.$transaction(async (tx) => {
      const item = await this.findOwnedItem(tx, userId, platform, itemId);
      await tx.cartItem.delete({ where: { id: item.id } });

      return this.getCartInTx(tx, userId, platform);
    });
  }

  private async clearCart(userId: number, platform: OrderPlatform) {
    await this.prisma.cartItem.deleteMany({
      where: { userId, platform },
    });

    return this.getCart(userId, platform);
  }

  private async syncCart(userId: number, platform: OrderPlatform, dto: SyncCartDto) {
    return this.prisma.$transaction(async (tx) => {
      await this.assertUserExists(userId, tx);

      if (dto.mode === SyncCartMode.Replace) {
        await tx.cartItem.deleteMany({ where: { userId, platform } });
      }

      for (const item of dto.items) {
        const variant = await this.assertVariantAvailable(tx, item.productId, item.variantId, userId);
        const pricingMode = this.resolvePricingMode(variant, userId);
        const existing = await tx.cartItem.findUnique({
          where: {
            userId_variantId_platform: {
              userId,
              variantId: item.variantId,
              platform,
            },
          },
        });

        const nextQuantity =
          dto.mode === SyncCartMode.Merge
            ? (existing?.quantity ?? 0) + item.quantity
            : item.quantity;
        this.assertQuantityAvailable(variant.stock, nextQuantity, variant.name, this.minQuantityForMode(variant, pricingMode));

        if (existing) {
          await tx.cartItem.update({
            where: { id: existing.id },
            data: { quantity: nextQuantity, productId: item.productId, pricingMode },
          });
        } else {
          await tx.cartItem.create({
            data: {
              userId,
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              pricingMode,
              platform,
            },
          });
        }
      }

      return this.getCartInTx(tx, userId, platform);
    });
  }

  private async getCartInTx(tx: CartTx, userId: number, platform: OrderPlatform) {
    const items = await tx.cartItem.findMany({
      where: { userId, platform },
      orderBy: { updatedAt: 'desc' },
      include: this.cartItemInclude(),
    });

    return this.serializeCart(items);
  }

  private async assertUserExists(userId: number, tx: CartTx | PrismaService = this.prisma) {
    if (!userId) throw new BadRequestException('User ID required');

    const user = await tx.user.findFirst({
      where: {
        id: userId,
        isActive: true,
      },
      select: { id: true },
    });

    if (!user) throw new NotFoundException('User not found');
  }

  private async assertVariantAvailable(
    tx: CartTx,
    productId: number,
    variantId: number,
    userId: number,
  ) {
    const variant = await tx.variant.findFirst({
      where: {
        id: variantId,
        productId,
        isDeleted: 0,
        product: { isDeleted: 0 },
      },
      select: {
        id: true,
        name: true,
        stock: true,
        productId: true,
        wholesaleBasePrice: true,
        wholesalePrice: true,
        wholesaleMinQuantity: true,
        product: {
          select: {
            wholesaleEnabled: true,
            wholesaleUsers: {
              where: { userId },
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!variant) throw new NotFoundException('Product variant not found');
    if (variant.stock <= 0) throw new BadRequestException(`Sản phẩm ${variant.name} đã hết hàng`);

    return variant;
  }

  private resolvePricingMode(
    variant: Awaited<ReturnType<CartService['assertVariantAvailable']>>,
    userId: number,
  ) {
    return variant.product.wholesaleEnabled && variant.product.wholesaleUsers.some((item) => item.userId === userId)
      ? PricingMode.Wholesale
      : PricingMode.Retail;
  }

  private minQuantityForMode(
    variant: Awaited<ReturnType<CartService['assertVariantAvailable']>>,
    pricingMode: PricingMode,
  ) {
    return pricingMode === PricingMode.Wholesale ? variant.wholesaleMinQuantity ?? 1 : 1;
  }

  private assertQuantityAvailable(
    stock: number,
    quantity: number,
    variantName: string,
    minQuantity = 1,
  ) {
    if (quantity < minQuantity) {
      throw new BadRequestException(`Sản phẩm ${variantName} cần mua tối thiểu ${minQuantity} sản phẩm`);
    }
    if (quantity > stock) {
      throw new BadRequestException(`Sản phẩm ${variantName} chỉ còn ${stock} sản phẩm`);
    }
  }

  private async findOwnedItem(tx: CartTx, userId: number, platform: OrderPlatform, itemId: number) {
    const item = await tx.cartItem.findFirst({
      where: {
        id: itemId,
        userId,
        platform,
      },
    });

    if (!item) throw new NotFoundException('Cart item not found');
    return item;
  }

  private cartItemInclude() {
    return {
      product: {
        select: {
          id: true,
          name: true,
          image: true,
          isDeleted: true,
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          image: true,
          basePrice: true,
          originalPrice: true,
          wholesaleBasePrice: true,
          wholesalePrice: true,
          wholesaleMinQuantity: true,
          stock: true,
          dimensions: true,
          isDeleted: true,
          flashSaleItems: {
            where: {
              flashSale: {
                status: FlashSaleStatus.Active,
                startTime: { lte: new Date() },
                endTime: { gte: new Date() },
                isDeleted: 0,
              },
            },
            include: { flashSale: true },
            orderBy: { id: 'asc' as const },
          },
        },
      },
    } as const;
  }

  private serializeCart(items: Awaited<ReturnType<CartService['getCartItemsForSerialize']>>) {
    const serializedItems = items.map((item) => {
      const isWholesale = item.pricingMode === PricingMode.Wholesale;
      const originalPrice = isWholesale
        ? Number(item.variant.wholesalePrice || 0)
        : Number(item.variant.originalPrice);
      const basePrice = isWholesale
        ? item.variant.wholesaleBasePrice
          ? Number(item.variant.wholesaleBasePrice)
          : null
        : item.variant.basePrice
          ? Number(item.variant.basePrice)
          : null;
      const minOrderQuantity = isWholesale ? item.variant.wholesaleMinQuantity ?? 1 : 1;
      const activeFlashSale = isWholesale ? null : mapActiveFlashSale(item.variant, item.quantity);
      const unitPrice = activeFlashSale?.finalPrice ?? originalPrice;
      const lineAmount = unitPrice * item.quantity;
      const isAvailable =
        item.product.isDeleted === 0 &&
        item.variant.isDeleted === 0 &&
        item.variant.stock > 0 &&
        originalPrice > 0 &&
        item.quantity >= minOrderQuantity;
      const {
        flashSaleItems: _flashSaleItems,
        wholesaleBasePrice: _wholesaleBasePrice,
        wholesalePrice: _wholesalePrice,
        wholesaleMinQuantity: _wholesaleMinQuantity,
        ...variantData
      } = item.variant;

      return {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        pricingMode: item.pricingMode,
        minOrderQuantity,
        platform: item.platform,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        product: item.product,
        variant: {
          ...variantData,
          basePrice,
          originalPrice,
          pricingMode: item.pricingMode,
          minOrderQuantity,
          activeFlashSale,
        },
        lineAmount,
        isAvailable,
      };
    });

    return {
      items: serializedItems,
      totalQuantity: serializedItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: serializedItems.reduce((sum, item) => sum + item.lineAmount, 0),
    };
  }

  private async getCartItemsForSerialize() {
    return this.prisma.cartItem.findMany({
      include: this.cartItemInclude(),
    });
  }
}
