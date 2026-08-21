import { BadRequestException, Injectable } from '@nestjs/common';

import {
  ConditionType,
  DiscountType,
  FlashSaleStatus,
  PricingMode,
  VoucherScope,
  VoucherType,
} from '../../generated/prisma/enums.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  MarketplaceQuoteMode,
  MarketplaceVoucherSelectionMode,
  type MarketplaceSourceQuoteFinalizeDto,
  type MarketplaceSourceQuotePreviewDto,
} from './dto/marketplace-commerce.dto.js';
import { MarketplaceCatalogService } from './marketplace-catalog.service.js';

type VoucherRecord = Prisma.VoucherGetPayload<{
  include: { voucherProducts: { select: { productId: true } } };
}>;

@Injectable()
export class MarketplaceCommerceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: MarketplaceCatalogService,
  ) {}

  preview(dto: MarketplaceSourceQuotePreviewDto) {
    return this.prisma.$transaction((tx) => this.buildPreview(tx, dto));
  }

  finalize(dto: MarketplaceSourceQuoteFinalizeDto) {
    return this.prisma.$transaction((tx) => this.finalizeWithTransaction(tx, dto));
  }

  async finalizeWithTransaction(
    tx: Prisma.TransactionClient,
    dto: MarketplaceSourceQuoteFinalizeDto,
  ) {
      const preview = await this.buildPreview(tx, dto);
      const manuallySelectedIds = [
        dto.voucherSelection.orderVoucherId,
        dto.voucherSelection.shippingVoucherId,
        ...(dto.voucherSelection.itemVouchers ?? []).map((item) => item.voucherId),
      ]
        .filter((value): value is string => Boolean(value))
        .map((value) => this.positiveInt(value, 'voucher'));
      const publicVouchers = await tx.voucher.findMany({
        where: {
          conditionType: ConditionType.ZaloMiniApp,
          OR: [
            { type: { in: [VoucherType.Normal, VoucherType.Freeship] } },
            ...(dto.context.mode === MarketplaceQuoteMode.LocalHost && manuallySelectedIds.length
              ? [{ id: { in: manuallySelectedIds } }]
              : []),
          ],
          isActive: true,
          isDeleted: 0,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
        include: { voucherProducts: { select: { productId: true } } },
      });
      const merchandiseSubtotal = preview.merchandiseSubtotal;
      const itemCandidates = this.itemCandidates(publicVouchers, preview.items);
      const selectedItems =
        dto.voucherSelection.mode === MarketplaceVoucherSelectionMode.Auto
          ? this.pickBestItemVouchers(itemCandidates)
          : this.validateManualItemVouchers(dto.voucherSelection.itemVouchers ?? [], itemCandidates);
      const itemVoucherDiscount = selectedItems.reduce((sum, item) => sum + item.discount, 0);
      const orderBase = Math.max(
        preview.items
          .filter((item) => item.pricingMode !== PricingMode.Wholesale)
          .reduce((sum, item) => sum + item.lineAmount, 0) - itemVoucherDiscount,
        0,
      );
      const orderCandidates = this.scopeCandidates(
        publicVouchers,
        VoucherScope.Order,
        orderBase,
        merchandiseSubtotal,
      );
      const shippingCandidates = this.scopeCandidates(
        publicVouchers,
        VoucherScope.Shipping,
        dto.shippingFee,
        merchandiseSubtotal,
      );
      const selectedOrder = this.selectScopeVoucher(
        dto.voucherSelection.mode,
        dto.voucherSelection.orderVoucherId,
        orderCandidates,
      );
      const selectedShipping = this.selectScopeVoucher(
        dto.voucherSelection.mode,
        dto.voucherSelection.shippingVoucherId,
        shippingCandidates,
      );
      const orderVoucherDiscount = selectedOrder?.discount ?? 0;
      const shippingVoucherDiscount = selectedShipping?.discount ?? 0;
      const shippingAmount = Math.max(dto.shippingFee - shippingVoucherDiscount, 0);

      return {
        ...preview,
        itemVoucherDiscount,
        orderVoucherDiscount,
        shippingFee: dto.shippingFee,
        shippingVoucherDiscount,
        shippingAmount,
        totalAmount: Math.max(
          merchandiseSubtotal - itemVoucherDiscount - orderVoucherDiscount + shippingAmount,
          0,
        ),
        voucherSelection: {
          mode: dto.voucherSelection.mode,
          orderVoucherId: selectedOrder?.id ?? null,
          shippingVoucherId: selectedShipping?.id ?? null,
          itemVouchers: selectedItems.map((item) => ({
            sourceProductId: item.sourceProductId,
            voucherId: item.id,
          })),
        },
        voucherCandidates: {
          order: orderCandidates,
          shipping: shippingCandidates,
          items: itemCandidates,
        },
      };
  }

  private async buildPreview(
    tx: Prisma.TransactionClient,
    dto: MarketplaceSourceQuotePreviewDto,
  ) {
    if (dto.context.mode === MarketplaceQuoteMode.LocalHost && !dto.context.hostLocalUserId) {
      throw new BadRequestException('Thiếu user local của host shop');
    }
    const productIds = dto.items.map((item) => this.positiveInt(item.sourceProductId, 'product'));
    const variantIds = dto.items.map((item) => this.positiveInt(item.sourceVariantId, 'variant'));
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
              where: { userId: dto.context.hostLocalUserId ?? 0 },
              select: { userId: true },
            },
          },
        },
        flashSaleItems: {
          where: {
            flashSale: {
              status: FlashSaleStatus.Active,
              startTime: { lte: new Date() },
              endTime: { gte: new Date() },
              isDeleted: 0,
            },
          },
          orderBy: { id: 'asc' },
        },
      },
    });
    if (variants.length !== new Set(variantIds).size) {
      throw new BadRequestException('Một số biến thể không còn khả dụng');
    }

    const items = dto.items.map((input, index) => {
      const variantId = variantIds[index];
      const productId = productIds[index];
      const variant = variants.find((item) => item.id === variantId)!;
      if (variant.productId !== productId) {
        throw new BadRequestException('Sản phẩm và biến thể nguồn không khớp');
      }
      if (variant.stock < input.quantity) {
        throw new BadRequestException(`Sản phẩm ${variant.name} không đủ tồn kho`);
      }
      let pricingMode: PricingMode = PricingMode.Retail;
      let unitPrice = Number(variant.originalPrice);
      let flashSaleId: number | null = null;
      let flashSaleItemId: number | null = null;
      let flashSaleType: DiscountType | null = null;
      let flashSaleValue: number | null = null;
      if (
        dto.context.mode === MarketplaceQuoteMode.LocalHost &&
        variant.product.wholesaleEnabled &&
        variant.product.wholesaleUsers.length
      ) {
        pricingMode = PricingMode.Wholesale;
        unitPrice = Number(variant.wholesalePrice ?? 0);
        if (unitPrice <= 0) throw new BadRequestException('Giá sỉ của sản phẩm chưa hợp lệ');
        const minimum = variant.wholesaleMinQuantity ?? 1;
        if (input.quantity < minimum) {
          throw new BadRequestException(`Sản phẩm ${variant.name} cần mua tối thiểu ${minimum}`);
        }
      } else if (dto.context.mode === MarketplaceQuoteMode.LocalHost) {
        const flash = variant.flashSaleItems.find(
          (item) => item.sold + input.quantity <= item.saleStock,
        );
        if (flash) {
          flashSaleId = flash.flashSaleId;
          flashSaleItemId = flash.id;
          flashSaleType = flash.discountType;
          flashSaleValue =
            flash.discountType === DiscountType.Percentage
              ? Number(flash.discountPercent ?? 0)
              : Number(flash.salePrice ?? 0);
          unitPrice =
            flash.discountType === DiscountType.Percentage
              ? Math.floor(unitPrice * (1 - Number(flash.discountPercent ?? 0) / 100))
              : Number(flash.salePrice ?? unitPrice);
        }
      }
      if (unitPrice <= 0) throw new BadRequestException('Giá bán của sản phẩm chưa hợp lệ');
      return {
        sourceProductId: String(variant.productId),
        sourceVariantId: String(variant.id),
        quantity: input.quantity,
        productName: variant.product.name,
        variantName: variant.name,
        sku: variant.saleworkProductCode,
        image: this.catalog.resolveMedia(
          variant.image ?? variant.product.image[0] ?? null,
          'image',
        ),
        originalPrice: Number(variant.originalPrice),
        unitPrice,
        lineAmount: unitPrice * input.quantity,
        stock: variant.stock,
        pricingMode,
        flashSaleId,
        flashSaleItemId,
        flashSaleType,
        flashSaleValue,
        packageWeightGrams: variant.packageWeightGrams,
        packageLengthCm: variant.packageLengthCm ? Number(variant.packageLengthCm) : null,
        packageWidthCm: variant.packageWidthCm ? Number(variant.packageWidthCm) : null,
        packageHeightCm: variant.packageHeightCm ? Number(variant.packageHeightCm) : null,
      };
    });
    const maxDimension = (field: 'packageLengthCm' | 'packageWidthCm' | 'packageHeightCm') => {
      const values = items.map((item) => item[field]).filter((value): value is number => Boolean(value));
      return values.length ? Math.max(...values) : null;
    };
    return {
      items,
      merchandiseSubtotal: items.reduce((sum, item) => sum + item.lineAmount, 0),
      parcel: {
        weightGrams: items.reduce(
          (sum, item) => sum + item.packageWeightGrams * item.quantity,
          0,
        ),
        lengthCm: maxDimension('packageLengthCm'),
        widthCm: maxDimension('packageWidthCm'),
        heightCm: maxDimension('packageHeightCm'),
      },
    };
  }

  private itemCandidates(
    vouchers: VoucherRecord[],
    items: Array<{
      sourceProductId: string;
      pricingMode: PricingMode;
      flashSaleId: number | null;
      lineAmount: number;
    }>,
  ) {
    return vouchers
      .filter((voucher) => voucher.scope === VoucherScope.Product && voucher.type !== VoucherType.Freeship)
      .flatMap((voucher) =>
        voucher.voucherProducts.map(({ productId }) => {
          const amount = items
            .filter(
              (item) =>
                item.sourceProductId === String(productId) &&
                item.pricingMode !== PricingMode.Wholesale &&
                !item.flashSaleId,
            )
            .reduce((sum, item) => sum + item.lineAmount, 0);
          return this.candidate(voucher, amount, amount, String(productId));
        }),
      );
  }

  private scopeCandidates(
    vouchers: VoucherRecord[],
    scope: VoucherScope,
    discountBase: number,
    conditionBase: number,
  ) {
    return vouchers
      .filter((voucher) => voucher.scope === scope)
      .map((voucher) => this.candidate(voucher, discountBase, conditionBase));
  }

  private candidate(
    voucher: VoucherRecord,
    discountBase: number,
    conditionBase: number,
    sourceProductId?: string,
  ) {
    const maxDiscountValue = Number(voucher.maxDiscount ?? 0);
    const maxDiscount =
      Number.isFinite(maxDiscountValue) && maxDiscountValue > 0 ? maxDiscountValue : null;
    const reason =
      voucher.usageLimit !== null &&
      voucher.usedCount + voucher.reservedCount >= voucher.usageLimit
        ? 'Voucher đã hết lượt sử dụng'
        : conditionBase < Number(voucher.minOrderValue)
          ? 'Chưa đạt giá trị tối thiểu'
          : discountBase <= 0
            ? 'Không có giá trị đủ điều kiện'
            : null;
    const discount = reason ? 0 : this.discount(voucher, discountBase);
    const disabledReason =
      reason ?? (discount <= 0 ? 'Voucher không tạo được ưu đãi' : null);
    return {
      id: String(voucher.id),
      code: voucher.code,
      description: voucher.description,
      scope: voucher.scope,
      type: voucher.type,
      discountType: voucher.discountType,
      discountValue: Number(voucher.discountValue),
      maxDiscount,
      minOrderValue: Number(voucher.minOrderValue),
      sourceProductId,
      eligible: !disabledReason,
      disabledReason,
      discount: disabledReason ? 0 : discount,
    };
  }

  private pickBestItemVouchers(candidates: ReturnType<MarketplaceCommerceService['itemCandidates']>) {
    const selected: typeof candidates = [];
    const used = new Set<string>();
    for (const productId of new Set(candidates.map((candidate) => candidate.sourceProductId))) {
      const best = candidates
        .filter(
          (candidate) =>
            candidate.sourceProductId === productId && candidate.eligible && !used.has(candidate.id),
        )
        .sort((left, right) => right.discount - left.discount)[0];
      if (best?.discount) {
        selected.push(best);
        used.add(best.id);
      }
    }
    return selected;
  }

  private validateManualItemVouchers(
    selections: Array<{ sourceProductId: string; voucherId: string }>,
    candidates: ReturnType<MarketplaceCommerceService['itemCandidates']>,
  ) {
    const used = new Set<string>();
    return selections.map((selection) => {
      const candidate = candidates.find(
        (item) =>
          item.id === selection.voucherId && item.sourceProductId === selection.sourceProductId,
      );
      if (!candidate?.eligible || used.has(selection.voucherId)) {
        throw new BadRequestException('Voucher sản phẩm được chọn không hợp lệ');
      }
      used.add(selection.voucherId);
      return candidate;
    });
  }

  private selectScopeVoucher<T extends { id: string; eligible: boolean; discount: number }>(
    mode: MarketplaceVoucherSelectionMode,
    selectedId: string | null | undefined,
    candidates: T[],
  ) {
    if (mode === MarketplaceVoucherSelectionMode.Auto) {
      return candidates
        .filter((candidate) => candidate.eligible)
        .sort((left, right) => right.discount - left.discount)[0];
    }
    if (!selectedId) return undefined;
    const selected = candidates.find((candidate) => candidate.id === selectedId);
    if (!selected?.eligible) throw new BadRequestException('Voucher được chọn không hợp lệ');
    return selected;
  }

  private discount(voucher: VoucherRecord, amount: number) {
    if (voucher.discountType === DiscountType.Percentage) {
      const value = Math.floor((amount * Number(voucher.discountValue)) / 100);
      const maxDiscount = Number(voucher.maxDiscount ?? 0);
      return Number.isFinite(maxDiscount) && maxDiscount > 0
        ? Math.min(value, maxDiscount)
        : value;
    }
    return Math.min(Number(voucher.discountValue), amount);
  }

  private positiveInt(value: string, label: string) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 1) {
      throw new BadRequestException(`Mã ${label} nguồn không hợp lệ`);
    }
    return parsed;
  }
}
