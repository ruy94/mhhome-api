import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';
import { createHash } from 'node:crypto';

import { RedisService } from '../../common/redis/redis.service.js';
import kiotvietConfig from '../../config/kiotviet.config.js';
import {
  InventoryProvider,
  KiotVietOutboxOperation,
  KiotVietOutboxStatus,
  OrderPlatform,
  OrderStatus,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { KiotVietBranchService } from '../integrations/kiotviet/kiotviet-branch.service.js';
import { KiotVietClientService } from '../integrations/kiotviet/kiotviet-client.service.js';
import { UpdateKiotVietOrderExportDto } from './dto/update-kiotviet-order-export.dto.js';
import { KiotVietInvoiceService } from './kiotviet-invoice.service.js';

const AUTO_ORDER_BUSINESS_KEY_PREFIX = 'kiotviet:auto-order:';
const AUTO_ORDER_SETTING_KEY_PREFIX = 'kiotviet:order-export:setting:';
const WORKER_INTERVAL_MS = 10_000;
const INTERRUPTED_AFTER_MS = 60_000;

type AutoOrderStage =
  | 'CREATE_ORDER'
  | 'RESERVED'
  | 'COMPLETE_ORDER'
  | 'COMPLETED'
  | 'CANCEL_ORDER'
  | 'CANCELLED';

type AutoOrderSetting = {
  enabled: boolean;
  branchId: number;
  soldById: number | null;
  soldByName: string | null;
  updatedByAdminId: string | null;
  updatedAt: string;
};

type AutoOrderRequest = Record<string, unknown> & {
  flow: 'AUTO_ORDER';
  stage: AutoOrderStage;
  branchId: number;
  soldById: number;
  localOrderCode: string;
  description: string;
  orderDetails: Array<Record<string, unknown>>;
};

type AutoOrderResponse = Record<string, unknown> & {
  remoteOrder?: { id: number; code: string | null };
  remoteInvoice?: { id: number | null; code: string | null };
  history?: Array<{ stage: AutoOrderStage; at: string }>;
};

const FINAL_CANCELLED_STATUSES: OrderStatus[] = [
  OrderStatus.Cancel,
  OrderStatus.Refund,
  OrderStatus.Return,
];

@Injectable()
export class KiotVietOrderExportService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KiotVietOrderExportService.name);
  private timer: NodeJS.Timeout | null = null;
  private processing = false;
  private onStockChanged:
    | ((
        source: 'ORDER_RESERVED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED',
        codes: string[],
        orderId: number,
      ) => Promise<void>)
    | null = null;

  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly branches: KiotVietBranchService,
    private readonly client: KiotVietClientService,
    private readonly invoices: KiotVietInvoiceService,
  ) {}

  onModuleInit(): void {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled) return;
    this.timer = setInterval(() => void this.tick(), WORKER_INTERVAL_MS);
    this.timer.unref();
    void this.tick();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  setOnStockChanged(
    callback: (
      source: 'ORDER_RESERVED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED',
      codes: string[],
      orderId: number,
    ) => Promise<void>,
  ): void {
    this.onStockChanged = callback;
  }

  private assertAvailable(): void {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled)
      throw new ServiceUnavailableException('Xuất order KiotViet chưa sẵn sàng');
  }

  private settingKey(branchId: number): string {
    return `${AUTO_ORDER_SETTING_KEY_PREFIX}${branchId}`;
  }

  private businessKey(orderId: number): string {
    return `${AUTO_ORDER_BUSINESS_KEY_PREFIX}${orderId}`;
  }

  async getSetting(): Promise<AutoOrderSetting> {
    this.assertAvailable();
    const branch = await this.branches.resolve();
    const raw = await this.redis.getClient().get(this.settingKey(branch.id));
    if (!raw)
      return {
        enabled: false,
        branchId: branch.id,
        soldById: null,
        soldByName: null,
        updatedByAdminId: null,
        updatedAt: new Date(0).toISOString(),
      };
    try {
      const parsed = JSON.parse(raw) as Partial<AutoOrderSetting>;
      const soldById = Number(parsed.soldById);
      return {
        enabled: parsed.enabled === true && Number.isSafeInteger(soldById) && soldById > 0,
        branchId: branch.id,
        soldById: Number.isSafeInteger(soldById) && soldById > 0 ? soldById : null,
        soldByName: typeof parsed.soldByName === 'string' ? parsed.soldByName : null,
        updatedByAdminId:
          typeof parsed.updatedByAdminId === 'string' ? parsed.updatedByAdminId : null,
        updatedAt:
          typeof parsed.updatedAt === 'string' && Number.isFinite(Date.parse(parsed.updatedAt))
            ? parsed.updatedAt
            : new Date(0).toISOString(),
      };
    } catch {
      this.logger.warn(`Invalid KiotViet order export setting for branch #${branch.id}`);
      return {
        enabled: false,
        branchId: branch.id,
        soldById: null,
        soldByName: null,
        updatedByAdminId: null,
        updatedAt: new Date(0).toISOString(),
      };
    }
  }

  async updateSetting(
    dto: UpdateKiotVietOrderExportDto,
    adminId: string,
  ): Promise<AutoOrderSetting> {
    this.assertAvailable();
    if (!adminId) throw new BadRequestException('Không xác định được quản trị viên');
    const branch = await this.branches.resolve();
    const current = await this.getSetting();
    const soldById = dto.soldById ?? current.soldById;
    if (dto.enabled && !soldById)
      throw new BadRequestException('Phải chọn nhân viên KiotViet trước khi bật xuất order');

    let soldByName = current.soldByName;
    if (soldById) {
      const seller = await this.invoices.findSeller(soldById);
      soldByName = seller.givenName?.trim() || seller.userName?.trim() || String(seller.id);
    }
    const setting: AutoOrderSetting = {
      enabled: dto.enabled,
      branchId: branch.id,
      soldById: soldById ?? null,
      soldByName,
      updatedByAdminId: adminId,
      updatedAt: new Date().toISOString(),
    };
    await this.redis.getClient().set(this.settingKey(branch.id), JSON.stringify(setting));
    return setting;
  }

  async listLogs(orderId?: number) {
    return this.prisma.kiotVietOutboxLog.findMany({
      where: {
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
        ...(orderId ? { orderId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async onOrderCreated(orderId: number): Promise<void> {
    try {
      await this.enqueueCreatedOrder(orderId);
    } catch (error) {
      this.logger.error(
        `Cannot export new order #${orderId} to KiotViet: ${this.errorMessage(error)}`,
      );
    }
  }

  async onOrderStatusChanged(
    orderId: number,
    previousStatus: OrderStatus,
    nextStatus: OrderStatus,
  ): Promise<boolean> {
    try {
      const row = await this.prisma.kiotVietOutboxLog.findUnique({
        where: { businessKey: this.businessKey(orderId) },
      });
      if (!row) return false;
      if (previousStatus === nextStatus) return true;
      const request = this.requestPayload(row.requestPayload);
      if (nextStatus === OrderStatus.Paid) {
        if (request.stage === 'RESERVED') await this.queueStage(row.id, request, 'COMPLETE_ORDER');
      } else if (FINAL_CANCELLED_STATUSES.includes(nextStatus)) {
        if (request.stage === 'RESERVED') await this.queueStage(row.id, request, 'CANCEL_ORDER');
        else if (
          request.stage === 'CREATE_ORDER' &&
          row.status !== KiotVietOutboxStatus.PROCESSING &&
          row.status !== KiotVietOutboxStatus.UNCERTAIN
        ) {
          await this.finishWithoutRemote(row.id, orderId, request, 'CANCELLED');
        }
      }
      void this.processPending();
      return true;
    } catch (error) {
      // Conservatively report that the automatic lifecycle owns this order. This prevents
      // the manual invoice flow from creating a second KiotViet document after a DB hiccup.
      this.logger.error(
        `Cannot advance KiotViet order lifecycle for #${orderId}: ${this.errorMessage(error)}`,
      );
      return true;
    }
  }

  async enqueueCreatedOrder(orderId: number) {
    this.assertAvailable();
    const setting = await this.getSetting();
    if (!setting.enabled || !setting.soldById) return null;
    const businessKey = this.businessKey(orderId);
    const existing = await this.prisma.kiotVietOutboxLog.findUnique({ where: { businessKey } });
    if (existing) return existing;

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: {
          include: {
            variant: {
              select: {
                inventoryProvider: true,
                kiotvietProductCode: true,
                kiotvietBranchId: true,
                kiotvietLinkedAt: true,
              },
            },
          },
        },
      },
    });
    if (!order || order.platform === OrderPlatform.Marketplace) return null;
    const linkedLines = order.orderProducts.filter(
      (item) =>
        item.variant?.inventoryProvider === InventoryProvider.KIOTVIET &&
        item.variant.kiotvietLinkedAt &&
        order.createdAt >= item.variant.kiotvietLinkedAt,
    );
    if (!linkedLines.length) return null;

    const orderDetails: Array<Record<string, unknown>> = [];
    for (const item of linkedLines) {
      const code = item.variant?.kiotvietProductCode;
      if (!code || item.variant?.kiotvietBranchId !== setting.branchId)
        throw new BadRequestException('SKU KiotViet hoặc chi nhánh không khớp');
      const price =
        item.finalPrice.toNumber() - item.itemVoucherDiscount.toNumber() / item.quantity;
      if (!Number.isFinite(price) || price < 0)
        throw new BadRequestException(`Giá SKU KiotViet ${code} không hợp lệ`);
      orderDetails.push({
        // The worker resolves the remote ID. Keeping external reads out of the checkout
        // request prevents a slow KiotViet API from delaying the customer's order.
        productId: 0,
        productCode: code,
        productName: code,
        quantity: item.quantity,
        price,
        discount: 0,
        note: order.code,
      });
    }
    const allGoodsTotal = order.orderProducts.reduce(
      (total, item) =>
        total + item.quantity * item.finalPrice.toNumber() - item.itemVoucherDiscount.toNumber(),
      0,
    );
    const kiotGoodsTotal = orderDetails.reduce(
      (total, item) => total + Number(item.quantity) * Number(item.price),
      0,
    );
    const discount =
      allGoodsTotal > 0
        ? Math.min(
            kiotGoodsTotal,
            Math.round((order.productDiscount.toNumber() * kiotGoodsTotal) / allGoodsTotal),
          )
        : 0;
    const request: AutoOrderRequest = {
      flow: 'AUTO_ORDER',
      stage: 'CREATE_ORDER',
      branchId: setting.branchId,
      soldById: setting.soldById,
      localOrderCode: order.code,
      description: `LOCAL_ORDER:${order.code}`,
      discount,
      totalPayment: 0,
      method: 'Cash',
      makeInvoice: false,
      orderDetails,
    };
    const payloadHash = this.hash(request);
    try {
      const created = await this.prisma.kiotVietOutboxLog.create({
        data: {
          orderId,
          operation: KiotVietOutboxOperation.CREATE_INVOICE,
          businessKey,
          payloadHash,
          status: KiotVietOutboxStatus.PENDING,
          requestPayload: request as Prisma.InputJsonValue,
          responsePayload: { history: [] },
          soldById: String(setting.soldById),
          selectedByAdminId: setting.updatedByAdminId,
          selectedAt: new Date(setting.updatedAt),
        },
      });
      void this.processPending();
      return created;
    } catch (error) {
      const concurrent = await this.prisma.kiotVietOutboxLog.findUnique({ where: { businessKey } });
      if (concurrent) return concurrent;
      throw error;
    }
  }

  async retryFailed(orderId: number) {
    const businessKey = this.businessKey(orderId);
    const changed = await this.prisma.kiotVietOutboxLog.updateMany({
      where: { businessKey, status: KiotVietOutboxStatus.FAILED },
      data: {
        status: KiotVietOutboxStatus.PENDING,
        lockedAt: null,
        errorMessage: null,
      },
    });
    if (!changed.count)
      throw new ConflictException('Chỉ có thể thử lại order bị KiotViet từ chối rõ ràng');
    void this.processPending();
    return this.prisma.kiotVietOutboxLog.findUnique({ where: { businessKey } });
  }

  async resolveUncertain(orderId: number, remoteOrderId: number) {
    if (!Number.isSafeInteger(remoteOrderId) || remoteOrderId <= 0)
      throw new BadRequestException('ID order KiotViet không hợp lệ');
    const businessKey = this.businessKey(orderId);
    const row = await this.prisma.kiotVietOutboxLog.findUnique({ where: { businessKey } });
    if (!row) throw new NotFoundException('Không tìm thấy thao tác xuất order KiotViet');
    if (row.status !== KiotVietOutboxStatus.UNCERTAIN)
      throw new ConflictException('Chỉ đối chiếu thao tác chưa rõ kết quả');
    const request = this.requestPayload(row.requestPayload);
    if (request.stage !== 'CREATE_ORDER')
      throw new ConflictException('Chỉ nhập ID order khi bước tạo order chưa rõ kết quả');

    const rows = await this.prisma.kiotVietOutboxLog.findMany({
      where: { businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX }, id: { not: row.id } },
      select: { responsePayload: true },
      take: 1000,
    });
    if (rows.some((item) => this.remoteOrderId(item.responsePayload) === remoteOrderId))
      throw new ConflictException('Order KiotViet đã được liên kết với đơn nội bộ khác');
    const remote = await this.client.getOrder(remoteOrderId);
    this.assertRemoteOrder(remote, remoteOrderId, request);
    const response = this.appendHistory(row.responsePayload, 'RESERVED', {
      remoteOrder: { id: remoteOrderId, code: this.stringOrNull(remote?.code) },
    });
    await this.advanceAfterReservation(row.id, row.orderId, request, response);
    void this.processPending();
    return this.prisma.kiotVietOutboxLog.findUnique({ where: { id: row.id } });
  }

  async remotelyReservedOrderIds(orderIds: number[]): Promise<Set<number>> {
    if (!orderIds.length) return new Set();
    const rows = await this.prisma.kiotVietOutboxLog.findMany({
      where: {
        orderId: { in: orderIds },
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
      },
      select: { orderId: true, requestPayload: true, responsePayload: true },
    });
    return new Set(
      rows.flatMap((row) => {
        const stage = this.stage(row.requestPayload);
        return this.remoteOrderId(row.responsePayload) && stage !== 'CANCELLED'
          ? [row.orderId]
          : [];
      }),
    );
  }

  private async tick(): Promise<void> {
    if (this.processing) return;
    this.processing = true;
    try {
      await this.recoverInterrupted();
      await this.reconcileKnownUncertain();
      await this.processPending();
    } catch (error) {
      this.logger.error(`KiotViet automatic order worker failed: ${this.errorMessage(error)}`);
    } finally {
      this.processing = false;
    }
  }

  private async recoverInterrupted(): Promise<void> {
    await this.prisma.kiotVietOutboxLog.updateMany({
      where: {
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.PROCESSING,
        lockedAt: { lt: new Date(Date.now() - INTERRUPTED_AFTER_MS) },
      },
      data: {
        status: KiotVietOutboxStatus.UNCERTAIN,
        lockedAt: null,
        errorMessage: 'Tiến trình dừng khi đang gửi; cần đối chiếu order KiotViet',
      },
    });
  }

  private async reconcileKnownUncertain(): Promise<void> {
    const rows = await this.prisma.kiotVietOutboxLog.findMany({
      where: {
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.UNCERTAIN,
      },
      orderBy: { updatedAt: 'asc' },
      take: 20,
    });
    for (const row of rows) {
      const request = this.requestPayload(row.requestPayload);
      const remoteOrderId = this.remoteOrderId(row.responsePayload);
      if (request.stage !== 'CREATE_ORDER' || !remoteOrderId) continue;
      try {
        const remote = await this.client.getOrder(remoteOrderId);
        this.assertRemoteOrder(remote, remoteOrderId, request);
        const response = this.appendHistory(row.responsePayload, 'RESERVED');
        await this.advanceAfterReservation(row.id, row.orderId, request, response);
      } catch (error) {
        this.logger.warn(
          `KiotViet order #${row.orderId} still needs reconciliation: ${this.errorMessage(error)}`,
        );
      }
    }
  }

  private async processPending(): Promise<void> {
    const rows = await this.prisma.kiotVietOutboxLog.findMany({
      where: {
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.PENDING,
      },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });
    for (const row of rows) await this.dispatch(row.id);
  }

  private async dispatch(id: number) {
    const claimed = await this.prisma.kiotVietOutboxLog.updateMany({
      where: {
        id,
        businessKey: { startsWith: AUTO_ORDER_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.PENDING,
      },
      data: {
        status: KiotVietOutboxStatus.PROCESSING,
        lockedAt: new Date(),
        attemptCount: { increment: 1 },
      },
    });
    if (!claimed.count) return;
    const row = await this.prisma.kiotVietOutboxLog.findUniqueOrThrow({ where: { id } });
    const request = this.requestPayload(row.requestPayload);
    if (request.stage === 'CREATE_ORDER') return this.dispatchCreate(row.id, row.orderId, request);
    if (request.stage === 'COMPLETE_ORDER')
      return this.dispatchComplete(row.id, row.orderId, request, row.responsePayload);
    if (request.stage === 'CANCEL_ORDER')
      return this.dispatchCancel(row.id, row.orderId, request, row.responsePayload);
    return this.prisma.kiotVietOutboxLog.update({
      where: { id },
      data: {
        status: KiotVietOutboxStatus.FAILED,
        lockedAt: null,
        errorMessage: `Giai đoạn auto order không hợp lệ: ${request.stage}`,
      },
    });
  }

  private async dispatchCreate(id: number, orderId: number, request: AutoOrderRequest) {
    let postAttempted = false;
    let knownRemote: { id: number; code: string | null } | undefined;
    let effectiveRequest = request;
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, userId: true, addressId: true },
      });
      if (!order) throw new NotFoundException('Không tìm thấy đơn nội bộ');
      if (FINAL_CANCELLED_STATUSES.includes(order.status))
        return this.finishWithoutRemote(id, orderId, request, 'CANCELLED');
      await this.invoices.findSeller(request.soldById);
      effectiveRequest = await this.hydrateOrderProducts(request);
      const customerId = await this.invoices.ensureCustomer(
        order.userId,
        order.addressId,
        effectiveRequest.branchId,
      );
      const payload = this.remotePayload(effectiveRequest, false, customerId);
      postAttempted = true;
      const result = await this.client.createOrder(payload);
      const remoteOrderId = Number(result.id);
      if (!Number.isSafeInteger(remoteOrderId) || remoteOrderId <= 0)
        throw new Error('Không có ID order trong phản hồi KiotViet');
      knownRemote = { id: remoteOrderId, code: this.stringOrNull(result.code) };
      const remote = await this.client.getOrder(remoteOrderId);
      this.assertRemoteOrder(remote, remoteOrderId, effectiveRequest);
      const response = this.appendHistory(undefined, 'RESERVED', { remoteOrder: knownRemote });
      await this.advanceAfterReservation(id, orderId, effectiveRequest, response);
      await this.notifyStockChanged('ORDER_RESERVED', effectiveRequest, orderId);
    } catch (error) {
      await this.failDispatch(id, effectiveRequest, error, postAttempted, knownRemote);
    }
  }

  private async hydrateOrderProducts(request: AutoOrderRequest): Promise<AutoOrderRequest> {
    const reads = new Map<string, ReturnType<KiotVietClientService['getProductByCode']>>();
    const orderDetails = await Promise.all(
      request.orderDetails.map(async (item) => {
        const code = typeof item.productCode === 'string' ? item.productCode.trim() : '';
        if (!code) throw new BadRequestException('Order thiếu mã SKU KiotViet');
        let read = reads.get(code);
        if (!read) {
          read = this.client.getProductByCode(code);
          reads.set(code, read);
        }
        const remote = await read;
        const productId = Number(remote?.id);
        if (!remote || remote.code !== code || !Number.isSafeInteger(productId) || productId <= 0)
          throw new BadRequestException(`SKU KiotViet ${code} không còn hợp lệ`);
        return {
          ...item,
          productId,
          productName: String(remote.name ?? code),
        };
      }),
    );
    return { ...request, orderDetails };
  }

  private async dispatchComplete(
    id: number,
    orderId: number,
    request: AutoOrderRequest,
    responsePayload: Prisma.JsonValue | null,
  ) {
    let writeAttempted = false;
    try {
      const remoteOrderId = this.remoteOrderId(responsePayload);
      if (!remoteOrderId) throw new ConflictException('Thiếu ID order KiotViet đã giữ hàng');
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        select: { status: true, userId: true, addressId: true },
      });
      if (order?.status !== OrderStatus.Paid)
        throw new ConflictException('Đơn nội bộ chưa ở trạng thái hoàn thành');
      const customerId = await this.invoices.ensureCustomer(
        order.userId,
        order.addressId,
        request.branchId,
      );
      writeAttempted = true;
      const result = await this.client.updateOrder(
        remoteOrderId,
        this.remotePayload(request, true, customerId),
      );
      const verified = await this.client.getOrder(remoteOrderId);
      const invoiceId = this.positiveInteger(result.invoiceId ?? verified?.invoiceId);
      const invoiceCode = this.stringOrNull(result.invoiceCode ?? verified?.invoiceCode);
      const response = this.appendHistory(responsePayload, 'COMPLETED', {
        remoteInvoice: { id: invoiceId, code: invoiceCode },
      });
      await this.finishStage(id, request, 'COMPLETED', response);
      await this.notifyStockChanged('ORDER_COMPLETED', request, orderId);
    } catch (error) {
      await this.failDispatch(id, request, error, writeAttempted);
    }
  }

  private async dispatchCancel(
    id: number,
    orderId: number,
    request: AutoOrderRequest,
    responsePayload: Prisma.JsonValue | null,
  ) {
    let writeAttempted = false;
    try {
      const remoteOrderId = this.remoteOrderId(responsePayload);
      if (!remoteOrderId) return this.finishWithoutRemote(id, orderId, request, 'CANCELLED');
      writeAttempted = true;
      try {
        await this.client.deleteOrder(remoteOrderId);
      } catch (error) {
        if (!(axios.isAxiosError(error) && error.response?.status === 404)) throw error;
      }
      const response = this.appendHistory(responsePayload, 'CANCELLED');
      await this.finishStage(id, request, 'CANCELLED', response);
      await this.notifyStockChanged('ORDER_CANCELLED', request, orderId);
    } catch (error) {
      await this.failDispatch(id, request, error, writeAttempted);
    }
  }

  private async advanceAfterReservation(
    id: number,
    orderId: number,
    request: AutoOrderRequest,
    response: AutoOrderResponse,
  ): Promise<void> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { status: true },
    });
    if (order?.status === OrderStatus.Paid) {
      await this.queueStage(id, request, 'COMPLETE_ORDER', response);
      return;
    }
    if (order && FINAL_CANCELLED_STATUSES.includes(order.status)) {
      await this.queueStage(id, request, 'CANCEL_ORDER', response);
      return;
    }
    await this.finishStage(id, request, 'RESERVED', response);
  }

  private async queueStage(
    id: number,
    request: AutoOrderRequest,
    stage: 'COMPLETE_ORDER' | 'CANCEL_ORDER',
    responsePayload?: AutoOrderResponse,
  ): Promise<void> {
    const next = { ...request, stage };
    await this.prisma.kiotVietOutboxLog.update({
      where: { id },
      data: {
        status: KiotVietOutboxStatus.PENDING,
        requestPayload: next as Prisma.InputJsonValue,
        payloadHash: this.hash(next),
        ...(responsePayload ? { responsePayload: responsePayload as Prisma.InputJsonValue } : {}),
        lockedAt: null,
        completedAt: null,
        errorMessage: null,
      },
    });
  }

  private async finishStage(
    id: number,
    request: AutoOrderRequest,
    stage: 'RESERVED' | 'COMPLETED' | 'CANCELLED',
    responsePayload: AutoOrderResponse,
  ): Promise<void> {
    const next = { ...request, stage };
    await this.prisma.kiotVietOutboxLog.update({
      where: { id },
      data: {
        status: KiotVietOutboxStatus.SUCCESS,
        requestPayload: next as Prisma.InputJsonValue,
        responsePayload: responsePayload as Prisma.InputJsonValue,
        payloadHash: this.hash(next),
        completedAt: new Date(),
        lockedAt: null,
        errorMessage: null,
      },
    });
  }

  private async finishWithoutRemote(
    id: number,
    orderId: number,
    request: AutoOrderRequest,
    stage: 'CANCELLED',
  ) {
    await this.finishStage(id, request, stage, this.appendHistory(undefined, stage));
    await this.notifyStockChanged('ORDER_CANCELLED', request, orderId);
  }

  private async failDispatch(
    id: number,
    request: AutoOrderRequest,
    error: unknown,
    writeAttempted: boolean,
    knownRemote?: { id: number; code: string | null },
  ): Promise<void> {
    const rejectedClearly =
      axios.isAxiosError(error) &&
      Boolean(error.response) &&
      [400, 401, 403, 404, 420, 422].includes(error.response?.status ?? 0);
    const status =
      !writeAttempted || rejectedClearly
        ? KiotVietOutboxStatus.FAILED
        : KiotVietOutboxStatus.UNCERTAIN;
    const response = knownRemote
      ? this.appendHistory(undefined, 'CREATE_ORDER', { remoteOrder: knownRemote })
      : undefined;
    await this.prisma.kiotVietOutboxLog.update({
      where: { id },
      data: {
        status,
        requestPayload: request as Prisma.InputJsonValue,
        ...(response ? { responsePayload: response as Prisma.InputJsonValue } : {}),
        lockedAt: null,
        errorMessage: this.errorMessage(error),
      },
    });
  }

  private remotePayload(
    request: AutoOrderRequest,
    makeInvoice: boolean,
    customerId: number,
  ): Record<string, unknown> {
    return {
      branchId: request.branchId,
      soldById: request.soldById,
      discount: Number(request.discount ?? 0),
      description: request.description,
      method: String(request.method ?? 'Cash'),
      totalPayment: Number(request.totalPayment ?? 0),
      makeInvoice,
      orderDetails: request.orderDetails,
      customer: { id: customerId },
    };
  }

  private assertRemoteOrder(
    remote: Record<string, unknown> | null,
    remoteOrderId: number,
    request: AutoOrderRequest,
  ): void {
    if (!remote || Number(remote.id) !== remoteOrderId)
      throw new BadRequestException('Order KiotViet không khớp ID');
    if (Number(remote.branchId) !== request.branchId)
      throw new BadRequestException('Order KiotViet không khớp chi nhánh');
    if (String(remote.description ?? '') !== request.description)
      throw new BadRequestException('Order KiotViet không khớp mã đơn nội bộ');
    const actual = Array.isArray(remote.orderDetails) ? remote.orderDetails : [];
    const totals = (items: unknown[], codeKey: string) => {
      const map = new Map<string, number>();
      for (const value of items) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const item = value as Record<string, unknown>;
        const code = String(item[codeKey] ?? '');
        const quantity = Number(item.quantity);
        if (code && Number.isFinite(quantity)) map.set(code, (map.get(code) ?? 0) + quantity);
      }
      return [...map].sort(([a], [b]) => a.localeCompare(b));
    };
    if (
      JSON.stringify(totals(actual, 'productCode')) !==
      JSON.stringify(totals(request.orderDetails, 'productCode'))
    )
      throw new BadRequestException('Order KiotViet không khớp danh sách sản phẩm');
  }

  private requestPayload(value: Prisma.JsonValue): AutoOrderRequest {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new ConflictException('Payload auto order không hợp lệ');
    const request = value as Record<string, unknown>;
    if (
      request.flow !== 'AUTO_ORDER' ||
      !this.isStage(request.stage) ||
      !Number.isSafeInteger(Number(request.branchId)) ||
      !Number.isSafeInteger(Number(request.soldById)) ||
      !Array.isArray(request.orderDetails)
    )
      throw new ConflictException('Payload auto order không hợp lệ');
    return request as AutoOrderRequest;
  }

  private stage(value: Prisma.JsonValue): AutoOrderStage | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const stage = (value as Record<string, unknown>).stage;
    return this.isStage(stage) ? stage : null;
  }

  private isStage(value: unknown): value is AutoOrderStage {
    return [
      'CREATE_ORDER',
      'RESERVED',
      'COMPLETE_ORDER',
      'COMPLETED',
      'CANCEL_ORDER',
      'CANCELLED',
    ].includes(String(value));
  }

  private remoteOrderId(value: Prisma.JsonValue | null): number | null {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const remote = (value as Record<string, unknown>).remoteOrder;
    if (!remote || typeof remote !== 'object' || Array.isArray(remote)) return null;
    return this.positiveInteger((remote as Record<string, unknown>).id);
  }

  private appendHistory(
    value: Prisma.JsonValue | null | undefined,
    stage: AutoOrderStage,
    extra: Partial<AutoOrderResponse> = {},
  ): AutoOrderResponse {
    const current =
      value && typeof value === 'object' && !Array.isArray(value)
        ? ({ ...value } as AutoOrderResponse)
        : ({} as AutoOrderResponse);
    const history = Array.isArray(current.history) ? current.history : [];
    return { ...current, ...extra, history: [...history, { stage, at: new Date().toISOString() }] };
  }

  private async notifyStockChanged(
    source: 'ORDER_RESERVED' | 'ORDER_COMPLETED' | 'ORDER_CANCELLED',
    request: AutoOrderRequest,
    orderId: number,
  ): Promise<void> {
    if (!this.onStockChanged) return;
    const codes = [
      ...new Set(
        request.orderDetails.flatMap((item) => {
          const code = item.productCode;
          return typeof code === 'string' && code.trim() ? [code.trim()] : [];
        }),
      ),
    ];
    if (!codes.length) return;
    try {
      await this.onStockChanged(source, codes, orderId);
    } catch (error) {
      this.logger.warn(
        `Cannot queue stock refresh after ${source} for order #${orderId}: ${this.errorMessage(error)}`,
      );
    }
  }

  private hash(value: unknown): string {
    return createHash('sha256').update(JSON.stringify(value)).digest('hex');
  }

  private positiveInteger(value: unknown): number | null {
    const number = Number(value);
    return Number.isSafeInteger(number) && number > 0 ? number : null;
  }

  private stringOrNull(value: unknown): string | null {
    return typeof value === 'string' && value.trim() ? value.trim() : null;
  }

  private errorMessage(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
      const data = error.response.data;
      const detail =
        data && typeof data === 'object' && !Array.isArray(data)
          ? ((data as Record<string, unknown>).message ??
            (data as Record<string, unknown>).responseStatus ??
            data)
          : data;
      const message = typeof detail === 'string' ? detail : JSON.stringify(detail ?? '');
      return `KiotViet HTTP ${error.response.status}${message ? `: ${message}` : ''}`.slice(0, 900);
    }
    return (error instanceof Error ? error.message : String(error)).slice(0, 900);
  }
}
