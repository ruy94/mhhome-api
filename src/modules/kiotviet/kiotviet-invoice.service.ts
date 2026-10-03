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
import kiotvietConfig from '../../config/kiotviet.config.js';
import {
  InventoryProvider,
  KiotVietOutboxOperation,
  KiotVietOutboxStatus,
  OrderStatus,
  Prisma,
} from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { KiotVietBranchService } from '../integrations/kiotviet/kiotviet-branch.service.js';
import {
  KiotVietClientService,
  KiotVietCustomer,
  KiotVietUser,
} from '../integrations/kiotviet/kiotviet-client.service.js';

const MANUAL_INVOICE_BUSINESS_KEY_PREFIX = 'kiotviet:invoice:';

@Injectable()
export class KiotVietInvoiceService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KiotVietInvoiceService.name);
  private timer: NodeJS.Timeout | null = null;
  private onSucceeded: ((orderId: number) => Promise<void>) | null = null;

  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
    private readonly prisma: PrismaService,
    private readonly branches: KiotVietBranchService,
    private readonly client: KiotVietClientService,
  ) {}

  onModuleInit(): void {
    if (!this.writeEnabled()) return;
    this.timer = setInterval(() => void this.tick(), 30_000);
    this.timer.unref();
    void this.tick();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  setOnSucceeded(callback: (orderId: number) => Promise<void>): void {
    this.onSucceeded = callback;
  }

  private assertWriteEnabled(): void {
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled || !this.writeEnabled()) {
      throw new ServiceUnavailableException('Ghi hóa đơn KiotViet chưa được bật');
    }
  }

  private writeEnabled(): boolean {
    return (
      this.cfg.autoWriteFrom instanceof Date && Number.isFinite(this.cfg.autoWriteFrom.getTime())
    );
  }

  async listOutbox(orderId?: number) {
    return this.prisma.kiotVietOutboxLog.findMany({
      where: {
        businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
        ...(orderId ? { orderId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async listUsers(pageSize = 100, currentItem = 0) {
    if (!this.cfg.enabled) throw new ServiceUnavailableException('KiotViet chưa được bật');
    return this.client.getUsers(pageSize, currentItem);
  }

  async findSeller(soldById: number): Promise<KiotVietUser> {
    if (!Number.isSafeInteger(soldById) || soldById <= 0)
      throw new BadRequestException('ID nhân viên KiotViet không hợp lệ');
    let currentItem = 0;
    for (let pageNumber = 0; pageNumber < 100; pageNumber++) {
      const page = await this.client.getUsers(100, currentItem);
      const seller = page.data.find((user) => Number(user.id) === soldById);
      if (seller) return seller;
      currentItem += page.data.length;
      if (!page.data.length || currentItem >= page.total) break;
    }
    throw new BadRequestException('Không tìm thấy nhân viên KiotViet trong gian hàng');
  }

  private customerId(customer: KiotVietCustomer, expectedCode?: string): number {
    const id = Number(customer?.id);
    if (
      (expectedCode !== undefined && customer?.code !== expectedCode) ||
      !Number.isSafeInteger(id) ||
      id <= 0
    ) {
      throw new ServiceUnavailableException('KiotViet trả khách hàng không khớp mã user');
    }
    return id;
  }

  async ensureCustomer(
    userId: number | null,
    addressId: number,
    branchId: number,
  ): Promise<number> {
    if (!Number.isSafeInteger(branchId) || branchId <= 0)
      throw new BadRequestException('Chi nhánh KiotViet trên hóa đơn không hợp lệ');
    const code = `ZALO${userId ?? addressId}`;
    const existing = await this.client.getCustomerByCode(code);

    const [user, address] = await Promise.all([
      userId
        ? this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true },
          })
        : Promise.resolve(null),
      this.prisma.address.findUnique({
        where: { id: addressId },
        select: {
          userId: true,
          cneeName: true,
          cneePhone: true,
          fullAddr: true,
          ward: true,
          district: true,
          city: true,
        },
      }),
    ]);
    if (!address) throw new BadRequestException('Không tìm thấy địa chỉ của đơn nội bộ');
    if (userId && address.userId !== userId) {
      throw new BadRequestException('Địa chỉ của đơn không thuộc người đặt hàng');
    }
    const name = user?.name?.trim() || address.cneeName?.trim();
    if (!name)
      throw new BadRequestException('Đơn nội bộ thiếu tên khách hàng để tạo khách KiotViet');
    const contactNumber = address.cneePhone?.trim();
    if (!contactNumber)
      throw new BadRequestException(
        'Đơn nội bộ thiếu số điện thoại người nhận để tạo khách KiotViet',
      );
    const deliveryAddress =
      address.fullAddr?.trim() ||
      [address.ward, address.district, address.city]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(', ');
    if (!deliveryAddress)
      throw new BadRequestException('Đơn nội bộ thiếu địa chỉ người nhận để tạo khách KiotViet');
    const customerPayload = {
      code,
      name,
      contactNumber,
      address: deliveryAddress,
    };

    const completeExisting = async (customer: KiotVietCustomer): Promise<number> => {
      const id = this.customerId(customer, code);
      const matchesLocalCustomer =
        customer.name?.trim() === customerPayload.name &&
        customer.contactNumber?.trim() === customerPayload.contactNumber &&
        customer.address?.trim() === customerPayload.address;
      if (matchesLocalCustomer) return id;
      const updated = await this.client.updateCustomer(id, customerPayload);
      return this.customerId(updated);
    };
    if (existing) return completeExisting(existing);

    try {
      const created = await this.client.createCustomer({ ...customerPayload, branchId });
      return this.customerId(created);
    } catch (error) {
      // A concurrent confirmation or a timed-out POST may already have created this code.
      const concurrent = await this.client.getCustomerByCode(code);
      if (concurrent) return completeExisting(concurrent);
      throw error;
    }
  }

  private async assertInvoiceItemsStillLinked(
    orderId: number,
    payload: Record<string, unknown>,
    branchId: number,
  ): Promise<void> {
    const requested = Array.isArray(payload.invoiceDetails) ? payload.invoiceDetails : [];
    if (!requested.length) throw new ConflictException('Hóa đơn không có hàng KiotViet');
    const lines = await this.prisma.orderProduct.findMany({
      where: { orderId },
      select: {
        quantity: true,
        variant: {
          select: { inventoryProvider: true, kiotvietProductCode: true, kiotvietBranchId: true },
        },
      },
    });
    const totals = (values: Array<{ code: string; quantity: number }>) => {
      const result = new Map<string, number>();
      for (const value of values)
        result.set(value.code, (result.get(value.code) ?? 0) + value.quantity);
      return [...result].sort(([a], [b]) => a.localeCompare(b));
    };
    const current = lines.flatMap((line) =>
      line.variant?.inventoryProvider === InventoryProvider.KIOTVIET &&
      line.variant.kiotvietProductCode &&
      line.variant.kiotvietBranchId === branchId
        ? [{ code: line.variant.kiotvietProductCode, quantity: line.quantity }]
        : [],
    );
    const expected = requested.map((value) => {
      const item = value as Record<string, unknown>;
      return { code: String(item.productCode ?? ''), quantity: Number(item.quantity) };
    });
    if (
      expected.some(
        (item) => !item.code || !Number.isFinite(item.quantity) || item.quantity <= 0,
      ) ||
      JSON.stringify(totals(current)) !== JSON.stringify(totals(expected))
    )
      throw new ConflictException(
        'Liên kết SKU hoặc số lượng đơn đã thay đổi; cần kiểm tra hóa đơn trước khi gửi',
      );
    for (const value of requested) {
      const item = value as Record<string, unknown>;
      const remote = await this.client.getProductByCode(String(item.productCode));
      if (Number(remote?.id) !== Number(item.productId))
        throw new ConflictException(`SKU KiotViet ${String(item.productCode)} đã thay đổi ID hàng`);
    }
  }

  async listMissingPaidOrders() {
    if (!this.writeEnabled() || !this.cfg.autoWriteFrom) return [];
    return this.prisma.order.findMany({
      where: {
        status: OrderStatus.Paid,
        kiotvietPaidAt: { gte: this.cfg.autoWriteFrom },
        kiotVietOutboxLogs: { none: { operation: KiotVietOutboxOperation.CREATE_INVOICE } },
        orderProducts: { some: { variant: { inventoryProvider: InventoryProvider.KIOTVIET } } },
      },
      select: { id: true, code: true, kiotvietPaidAt: true },
      orderBy: { id: 'desc' },
      take: 100,
    });
  }

  /** Persist one invoice request for each delivered local order with KiotViet items. */
  async enqueuePaidOrder(orderId: number) {
    this.assertWriteEnabled();
    const businessKey = `kiotviet:invoice:${orderId}`;
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
    if (!order) throw new NotFoundException('Không tìm thấy đơn nội bộ');
    if (order.status !== OrderStatus.Paid) return null;
    if (
      this.cfg.autoWriteFrom &&
      (!order.kiotvietPaidAt || order.kiotvietPaidAt < this.cfg.autoWriteFrom)
    )
      return null;
    const linkedLines = order.orderProducts.filter(
      (item) =>
        item.variant?.inventoryProvider === InventoryProvider.KIOTVIET &&
        item.variant.kiotvietLinkedAt &&
        order.createdAt >= item.variant.kiotvietLinkedAt,
    );
    if (!linkedLines.length) return null;
    const branch = await this.branches.resolve();
    const items = [];
    for (const item of linkedLines) {
      const code = item.variant?.kiotvietProductCode;
      if (!code || item.variant?.kiotvietBranchId !== branch.id)
        throw new BadRequestException('SKU KiotViet hoặc chi nhánh không khớp');
      const remote = await this.client.getProductByCode(code);
      const productId = Number(remote?.id);
      if (!remote || !Number.isSafeInteger(productId) || productId <= 0 || remote.code !== code)
        throw new BadRequestException(`SKU KiotViet ${code} không còn hợp lệ`);
      const price =
        item.finalPrice.toNumber() - item.itemVoucherDiscount.toNumber() / item.quantity;
      if (!Number.isFinite(price) || price < 0)
        throw new BadRequestException('Giá hàng KiotViet không hợp lệ');
      items.push({
        productId,
        productCode: code,
        productName: String(remote.name ?? code),
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
    const kiotGoodsTotal = items.reduce((total, item) => total + item.quantity * item.price, 0);
    const discount =
      allGoodsTotal > 0
        ? Math.min(
            kiotGoodsTotal,
            Math.round((order.productDiscount.toNumber() * kiotGoodsTotal) / allGoodsTotal),
          )
        : 0;
    const payload = {
      branchId: branch.id,
      discount,
      totalPayment: 0,
      method: 'Cash',
      usingCod: false,
      invoiceDetails: items,
      description: `Local - ${order.code}`,
    };
    const payloadHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    try {
      const created = await this.prisma.$transaction(async (tx) => {
        const stillPaid = await tx.order.count({
          where: { id: order.id, status: OrderStatus.Paid },
        });
        if (!stillPaid) throw new ConflictException('Trạng thái đơn vừa thay đổi; hãy tải lại');
        return tx.kiotVietOutboxLog.create({
          data: {
            orderId: order.id,
            operation: KiotVietOutboxOperation.CREATE_INVOICE,
            businessKey,
            payloadHash,
            requestPayload: payload as Prisma.InputJsonValue,
            status: KiotVietOutboxStatus.WAITING_SELLER,
          },
        });
      });
      return created;
    } catch (error) {
      const concurrent = await this.prisma.kiotVietOutboxLog.findUnique({ where: { businessKey } });
      if (concurrent) return concurrent;
      throw error;
    }
  }

  async confirmSeller(id: number, soldById: number, adminId: string) {
    this.assertWriteEnabled();
    if (!adminId) throw new BadRequestException('Không xác định được quản trị viên');
    const row = await this.prisma.kiotVietOutboxLog.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy yêu cầu hóa đơn');
    if (!row.businessKey.startsWith(MANUAL_INVOICE_BUSINESS_KEY_PREFIX))
      throw new NotFoundException('Không tìm thấy yêu cầu hóa đơn');
    if (row.status !== KiotVietOutboxStatus.WAITING_SELLER)
      throw new ConflictException('Hóa đơn không còn ở trạng thái chờ chọn nhân viên');
    const order = await this.prisma.order.findUnique({
      where: { id: row.orderId },
      select: { status: true },
    });
    if (order?.status !== OrderStatus.Paid)
      throw new ConflictException('Đơn không còn ở trạng thái giao thành công');
    const branch = await this.branches.resolve();
    const original = row.requestPayload as Record<string, unknown>;
    if (Number(original.branchId) !== branch.id)
      throw new ConflictException('Chi nhánh KiotViet đã thay đổi; cần kiểm tra lại hóa đơn');
    await this.assertInvoiceItemsStillLinked(row.orderId, original, branch.id);
    await this.findSeller(soldById);
    const payload: Record<string, unknown> = { ...original, soldById };
    delete payload.purchaseDate;
    const payloadHash = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
    const changed = await this.prisma.kiotVietOutboxLog.updateMany({
      where: { id, status: KiotVietOutboxStatus.WAITING_SELLER },
      data: {
        status: KiotVietOutboxStatus.PENDING,
        soldById: String(soldById),
        selectedByAdminId: adminId,
        selectedAt: new Date(),
        requestPayload: payload as Prisma.InputJsonValue,
        payloadHash,
        errorMessage: null,
      },
    });
    if (!changed.count) throw new ConflictException('Hóa đơn đã được xác nhận bởi người khác');
    void this.processPending();
    return this.prisma.kiotVietOutboxLog.findUniqueOrThrow({ where: { id } });
  }

  private async tick(): Promise<void> {
    await this.recoverInterrupted();
    await this.reconcileKnownUncertain();
    await this.recoverPaidOrders();
    await this.processPending();
    await this.reconcileUnrefreshedStock();
  }

  private async reconcileUnrefreshedStock(): Promise<void> {
    if (!this.onSucceeded) return;
    try {
      const rows = await this.prisma.kiotVietOutboxLog.findMany({
        where: {
          businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
          status: KiotVietOutboxStatus.SUCCESS,
          stockRefreshedAt: null,
        },
        orderBy: { completedAt: 'asc' },
        take: 20,
      });
      for (const row of rows) {
        try {
          await this.onSucceeded(row.orderId);
        } catch (error) {
          this.logger.warn(
            `KiotViet stock refresh retry failed for order #${row.orderId}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `KiotViet stock refresh scan failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async markStockRefreshed(orderId: number): Promise<void> {
    await this.prisma.kiotVietOutboxLog.updateMany({
      where: {
        businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
        orderId,
        operation: KiotVietOutboxOperation.CREATE_INVOICE,
        status: KiotVietOutboxStatus.SUCCESS,
        stockRefreshedAt: null,
      },
      data: { stockRefreshedAt: new Date() },
    });
  }

  private async reconcileKnownUncertain(): Promise<void> {
    try {
      const rows = await this.prisma.kiotVietOutboxLog.findMany({
        where: {
          businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
          status: KiotVietOutboxStatus.UNCERTAIN,
          externalId: { not: null },
        },
        orderBy: { updatedAt: 'asc' },
        take: 20,
      });
      for (const row of rows) {
        const externalId = Number(row.externalId);
        if (!Number.isSafeInteger(externalId) || externalId <= 0) continue;
        try {
          await this.resolveUncertain(row.id, externalId);
        } catch (error) {
          this.logger.warn(
            `KiotViet invoice #${row.id} still needs reconciliation: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `KiotViet invoice reconciliation failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async recoverPaidOrders(): Promise<void> {
    try {
      const orders = await this.listMissingPaidOrders();
      for (const order of orders) {
        try {
          await this.enqueuePaidOrder(order.id);
        } catch (error) {
          this.logger.warn(
            `Cannot prepare KiotViet invoice for order #${order.id}: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        `KiotViet paid order recovery failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async processPending(): Promise<void> {
    if (!this.writeEnabled()) return;
    try {
      const rows = await this.prisma.kiotVietOutboxLog.findMany({
        where: {
          businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
          status: KiotVietOutboxStatus.PENDING,
          ...(this.cfg.autoWriteFrom ? { createdAt: { gte: this.cfg.autoWriteFrom } } : {}),
        },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      for (const row of rows) await this.dispatch(row.id);
    } catch (error) {
      this.logger.error(
        `KiotViet invoice outbox failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async recoverInterrupted(): Promise<void> {
    try {
      await this.prisma.kiotVietOutboxLog.updateMany({
        where: {
          businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
          status: KiotVietOutboxStatus.PROCESSING,
          lockedAt: { lt: new Date(Date.now() - 60_000) },
        },
        data: {
          status: KiotVietOutboxStatus.UNCERTAIN,
          errorMessage: 'Tiến trình dừng khi đang gửi; cần đối chiếu hóa đơn KiotViet',
        },
      });
    } catch (error) {
      this.logger.error(
        `KiotViet outbox recovery failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async dispatch(id: number) {
    this.assertWriteEnabled();
    const claimed = await this.prisma.kiotVietOutboxLog.updateMany({
      where: {
        id,
        businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.PENDING,
      },
      data: {
        status: KiotVietOutboxStatus.PROCESSING,
        lockedAt: new Date(),
        attemptCount: { increment: 1 },
      },
    });
    if (!claimed.count) return this.prisma.kiotVietOutboxLog.findUnique({ where: { id } });
    const row = await this.prisma.kiotVietOutboxLog.findUniqueOrThrow({ where: { id } });
    const payload = { ...(row.requestPayload as Record<string, unknown>) };
    if (!row.soldById || !row.selectedAt || Number(payload.soldById) !== Number(row.soldById)) {
      return this.prisma.kiotVietOutboxLog.update({
        where: { id },
        data: {
          status: KiotVietOutboxStatus.WAITING_SELLER,
          lockedAt: null,
          errorMessage: 'Cần chọn và xác nhận nhân viên KiotViet trước khi gửi',
        },
      });
    }
    let invoicePostAttempted = false;
    let postSucceeded = false;
    let knownExternalId: string | null = null;
    let knownExternalCode: string | null = null;
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: row.orderId },
        select: { status: true, userId: true, addressId: true },
      });
      if (order?.status !== OrderStatus.Paid) {
        return this.prisma.kiotVietOutboxLog.update({
          where: { id },
          data: {
            status: KiotVietOutboxStatus.FAILED,
            errorMessage: 'Đơn nội bộ không còn ở trạng thái giao thành công',
            lockedAt: null,
          },
        });
      }
      payload.customerId = await this.ensureCustomer(
        order.userId,
        order.addressId,
        Number(payload.branchId),
      );
      delete payload.purchaseDate;
      await this.prisma.kiotVietOutboxLog.update({
        where: { id },
        data: {
          requestPayload: payload as Prisma.InputJsonValue,
          payloadHash: createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
        },
      });
      invoicePostAttempted = true;
      const result = await this.client.createInvoice(payload);
      postSucceeded = true;
      const externalId = Number(result.id);
      if (Number.isSafeInteger(externalId) && externalId > 0) knownExternalId = String(externalId);
      if (typeof result.code === 'string') knownExternalCode = result.code;
      if (!Number.isSafeInteger(externalId) || externalId <= 0)
        throw new Error('Không có ID hóa đơn trong phản hồi KiotViet');
      const verified = await this.client.getInvoice(externalId);
      this.assertInvoiceMatches(verified, externalId, payload as Prisma.JsonValue);
      const completed = await this.prisma.kiotVietOutboxLog.update({
        where: { id },
        data: {
          status: KiotVietOutboxStatus.SUCCESS,
          externalId: String(externalId),
          externalCode: String(result.code ?? verified.code ?? ''),
          responsePayload: { id: externalId, code: result.code ?? verified.code ?? null },
          completedAt: new Date(),
          lockedAt: null,
          errorMessage: null,
        },
      });
      if (this.onSucceeded)
        void this.onSucceeded(row.orderId).catch((error) =>
          this.logger.warn(
            `KiotViet stock refresh after invoice failed for order #${row.orderId}: ${error instanceof Error ? error.message : String(error)}`,
          ),
        );
      return completed;
    } catch (error) {
      const responseData = axios.isAxiosError(error) ? error.response?.data : null;
      const responseStatus =
        responseData && typeof responseData === 'object' && !Array.isArray(responseData)
          ? (responseData as Record<string, unknown>).responseStatus
          : null;
      const errorCode =
        responseStatus && typeof responseStatus === 'object' && !Array.isArray(responseStatus)
          ? (responseStatus as Record<string, unknown>).errorCode
          : null;
      const knownValidationRejection =
        axios.isAxiosError(error) &&
        error.response?.status === 420 &&
        ['KvValidateInvoiceException', 'KvValidateUserException'].includes(String(errorCode));
      const rejectedBeforeCreation =
        !postSucceeded &&
        axios.isAxiosError(error) &&
        ([400, 401, 403, 404, 422].includes(error.response?.status ?? 0) ||
          knownValidationRejection);
      const status =
        !invoicePostAttempted || rejectedBeforeCreation
          ? KiotVietOutboxStatus.FAILED
          : KiotVietOutboxStatus.UNCERTAIN;
      return this.prisma.kiotVietOutboxLog.update({
        where: { id },
        data: {
          status,
          externalId: knownExternalId,
          externalCode: knownExternalCode,
          errorMessage: this.describeInvoiceError(error),
          lockedAt: null,
        },
      });
    }
  }

  private describeInvoiceError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
      const data: unknown = error.response.data;
      let detail: unknown = data;
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const response = data as Record<string, unknown>;
        detail =
          response.message ??
          response.Message ??
          response.errors ??
          response.Errors ??
          response.error ??
          response.Error ??
          data;
      }
      const message =
        typeof detail === 'string' ? detail : detail == null ? '' : JSON.stringify(detail);
      return `KiotViet HTTP ${error.response.status}${message ? `: ${message}` : ''}`.slice(0, 900);
    }
    return (error instanceof Error ? error.message : String(error)).slice(0, 900);
  }

  async resolveUncertain(id: number, externalId: number) {
    if (!Number.isSafeInteger(externalId) || externalId <= 0)
      throw new BadRequestException('ID hóa đơn KiotViet không hợp lệ');
    const row = await this.prisma.kiotVietOutboxLog.findUnique({ where: { id } });
    if (!row) throw new NotFoundException('Không tìm thấy thao tác KiotViet');
    if (!row.businessKey.startsWith(MANUAL_INVOICE_BUSINESS_KEY_PREFIX))
      throw new NotFoundException('Không tìm thấy thao tác KiotViet');
    if (row.status !== KiotVietOutboxStatus.UNCERTAIN)
      throw new ConflictException('Chỉ đối chiếu thao tác chưa rõ kết quả');
    const used = await this.prisma.kiotVietOutboxLog.findFirst({
      where: {
        externalId: String(externalId),
        status: KiotVietOutboxStatus.SUCCESS,
        id: { not: id },
      },
    });
    if (used) throw new ConflictException('Hóa đơn KiotViet đã được liên kết với đơn nội bộ khác');
    const invoice = await this.client.getInvoice(externalId);
    this.assertInvoiceMatches(invoice, externalId, row.requestPayload);
    try {
      const updated = await this.prisma.kiotVietOutboxLog.updateMany({
        where: { id, status: KiotVietOutboxStatus.UNCERTAIN },
        data: {
          status: KiotVietOutboxStatus.SUCCESS,
          externalId: String(externalId),
          externalCode: String(invoice.code ?? ''),
          responsePayload: { id: externalId, code: invoice.code ?? null },
          completedAt: new Date(),
          errorMessage: null,
        },
      });
      if (!updated.count)
        throw new ConflictException('Hóa đơn đã được đối chiếu bởi thao tác khác');
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002')
        throw new ConflictException('Hóa đơn KiotViet đã được liên kết với đơn nội bộ khác');
      throw error;
    }
    const completed = await this.prisma.kiotVietOutboxLog.findUniqueOrThrow({ where: { id } });
    if (this.onSucceeded)
      void this.onSucceeded(row.orderId).catch((error) =>
        this.logger.warn(
          `KiotViet stock refresh after reconciliation failed for order #${row.orderId}: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    return completed;
  }

  async retryFailed(id: number) {
    this.assertWriteEnabled();
    const updated = await this.prisma.kiotVietOutboxLog.updateMany({
      where: {
        id,
        businessKey: { startsWith: MANUAL_INVOICE_BUSINESS_KEY_PREFIX },
        status: KiotVietOutboxStatus.FAILED,
      },
      data: {
        status: KiotVietOutboxStatus.WAITING_SELLER,
        soldById: null,
        selectedByAdminId: null,
        selectedAt: null,
        errorMessage: null,
      },
    });
    if (!updated.count)
      throw new ConflictException('Chỉ có thể gửi lại hóa đơn bị KiotViet từ chối rõ ràng');
    return this.prisma.kiotVietOutboxLog.findUnique({ where: { id } });
  }

  private assertInvoiceMatches(
    invoice: Record<string, unknown>,
    externalId: number,
    requestPayload: Prisma.JsonValue,
  ): void {
    if (!invoice || Number(invoice.id) !== externalId)
      throw new BadRequestException('Hóa đơn KiotViet không khớp');
    if (Number(invoice.status) !== 1)
      throw new BadRequestException('Hóa đơn KiotViet chưa ở trạng thái hoàn thành');
    const payload = requestPayload as Record<string, unknown>;
    if (Number(invoice.branchId) !== Number(payload.branchId))
      throw new BadRequestException('Chi nhánh hóa đơn KiotViet không khớp');
    if (payload.soldById != null && Number(invoice.soldById) !== Number(payload.soldById))
      throw new BadRequestException('Nhân viên bán hàng trên hóa đơn KiotViet không khớp');
    if (payload.customerId != null && Number(invoice.customerId) !== Number(payload.customerId))
      throw new BadRequestException('Khách hàng trên hóa đơn KiotViet không khớp');
    if (
      invoice.totalPayment != null &&
      Number(invoice.totalPayment) !== Number(payload.totalPayment)
    )
      throw new BadRequestException('Số tiền thanh toán trên hóa đơn KiotViet không khớp');
    if (String(invoice.description ?? '') !== String(payload.description ?? ''))
      throw new BadRequestException('Mã đơn nội bộ trên hóa đơn KiotViet không khớp');
    const expectedLines = Array.isArray(payload.invoiceDetails) ? payload.invoiceDetails : [];
    const actualLines = Array.isArray(invoice.invoiceDetails) ? invoice.invoiceDetails : [];
    const quantities = (lines: unknown[]) => {
      const totals = new Map<string, number>();
      for (const value of lines) {
        if (!value || typeof value !== 'object') return null;
        const item = value as Record<string, unknown>;
        const key = String(item.productId ?? item.productCode ?? '');
        const quantity = Number(item.quantity);
        if (!key || !Number.isFinite(quantity) || quantity <= 0) return null;
        totals.set(key, (totals.get(key) ?? 0) + quantity);
      }
      return [...totals].sort(([left], [right]) => left.localeCompare(right));
    };
    const expected = quantities(expectedLines);
    const actual = quantities(actualLines);
    if (
      !expectedLines.length ||
      !expected ||
      !actual ||
      JSON.stringify(expected) !== JSON.stringify(actual)
    )
      throw new BadRequestException('Các dòng hàng hóa đơn KiotViet không khớp đơn nội bộ');
  }
}
