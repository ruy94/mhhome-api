import {
  Logger,
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';

import kiotvietConfig from '../../../config/kiotviet.config.js';
import { RedisService } from '../../../common/redis/redis.service.js';
import { InventoryProvider } from '../../../generated/prisma/enums.js';
import { KiotVietAuthService } from './kiotviet-auth.service.js';
export function encodeKiotVietWebhookSecret(rawSecret: string): string {
  return Buffer.from(rawSecret, 'utf8').toString('base64');
}

export interface KiotVietPage<T> {
  total: number;
  pageSize: number;
  data: T[];
}

export interface KiotVietBranch {
  id: number;
  branchName: string;
  branchCode?: string;
}

export interface KiotVietUser {
  id: number;
  userName: string;
  givenName: string;
}

export interface KiotVietCustomer {
  id: number;
  code: string;
  name: string;
  contactNumber?: string | null;
  address?: string | null;
}

export interface KiotVietCustomerWrite {
  code: string;
  name: string;
  contactNumber: string;
  address: string;
}

export interface KiotVietCustomerCreate extends KiotVietCustomerWrite {
  branchId: number;
}

const GET_BUDGET_PER_HOUR = 4000;

@Injectable()
export class KiotVietClientService {
  private readonly logger = new Logger(KiotVietClientService.name);
  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
    private readonly auth: KiotVietAuthService,
    private readonly redis: RedisService,
  ) {}

  async assertStockFresh(
    variants: Array<{
      inventoryProvider: InventoryProvider;
      kiotvietStockSyncedAt?: Date | null;
    }>,
  ): Promise<void> {
    const kiotVietVariants = variants.filter(
      (variant) => variant.inventoryProvider === InventoryProvider.KIOTVIET,
    );
    if (!kiotVietVariants.length) return;
    if (!this.cfg.enabled || !this.cfg.stockSyncEnabled) {
      throw new ServiceUnavailableException('Đồng bộ tồn KiotViet chưa sẵn sàng để nhận đơn');
    }
    const [lastSuccess, webhookActive] = await Promise.all([
      this.redis.getClient().get('kiotviet:last-successful-stock-sync'),
      this.redis.getClient().get('kiotviet:webhook:active'),
    ]);
    const lastSuccessMs = lastSuccess ? Date.parse(lastSuccess) : NaN;
    const deadline = Date.now() - this.cfg.stockStaleSeconds * 1000;
    const hasMissingProjection = kiotVietVariants.some((variant) => !variant.kiotvietStockSyncedAt);
    const hasStaleProjection = kiotVietVariants.some(
      (variant) =>
        !variant.kiotvietStockSyncedAt || variant.kiotvietStockSyncedAt.getTime() < deadline,
    );
    const webhookHasBaseline = webhookActive === '1' && Number.isFinite(lastSuccessMs);
    if (
      hasMissingProjection ||
      (!webhookHasBaseline &&
        (!Number.isFinite(lastSuccessMs) || lastSuccessMs < deadline || hasStaleProjection))
    ) {
      throw new ServiceUnavailableException(
        'Tồn KiotViet đã cũ; vui lòng đồng bộ lại trước khi đặt hàng',
      );
    }
  }

  getBranches(pageSize = 100, currentItem = 0): Promise<KiotVietPage<KiotVietBranch>> {
    return this.getPage<KiotVietBranch>('/branches', { pageSize, currentItem });
  }

  getUsers(pageSize = 100, currentItem = 0): Promise<KiotVietPage<KiotVietUser>> {
    return this.getPage<KiotVietUser>('/users', { pageSize, currentItem });
  }

  async getCustomerByCode(code: string): Promise<KiotVietCustomer | null> {
    const page = await this.getPage<KiotVietCustomer>('/customers', {
      code,
      pageSize: 100,
      currentItem: 0,
    });
    const exact = page.data.find((customer) => customer.code === code);
    if (exact) return exact;
    if (page.total > page.data.length)
      throw new ServiceUnavailableException('Không thể xác định khách hàng KiotViet theo mã');
    return null;
  }

  async createCustomer(payload: KiotVietCustomerCreate): Promise<KiotVietCustomer> {
    const token = await this.auth.getToken();
    const response = await axios.post<KiotVietCustomer>(
      new URL('customers', `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
      payload,
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
    return response.data;
  }

  async updateCustomer(id: number, payload: KiotVietCustomerWrite): Promise<KiotVietCustomer> {
    const token = await this.auth.getToken();
    const response = await axios.put<KiotVietCustomer>(
      new URL(`customers/${id}`, `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
      payload,
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
    return response.data;
  }

  getProducts(
    query: Record<string, string | number | boolean>,
  ): Promise<KiotVietPage<Record<string, unknown>>> {
    return this.getPage<Record<string, unknown>>('/products', query);
  }

  getProductByCode(code: string, operationId?: string): Promise<Record<string, unknown> | null> {
    return this.get(
      `/products/code/${encodeURIComponent(code)}`,
      {},
      operationId,
    ) as Promise<Record<string, unknown> | null>;
  }

  getWebhooks(pageSize = 100, currentItem = 0): Promise<KiotVietPage<Record<string, unknown>>> {
    return this.getPage<Record<string, unknown>>('/webhooks', { pageSize, currentItem });
  }

  async createStockWebhook(url: string, rawSecret: string): Promise<unknown> {
    const token = await this.auth.getToken();
    try {
      const response = await axios.post(
        new URL('webhooks', `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
        {
          Webhook: {
            Type: 'stock.update',
            Url: url,
            IsActive: true,
            Description: 'Stock sync',
            Secret: encodeKiotVietWebhookSecret(rawSecret),
          },
        },
        {
          headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
          timeout: this.cfg.requestTimeoutMs,
        },
      );
      return response.data;
    } catch {
      throw new ServiceUnavailableException('Không thể đăng ký webhook KiotViet');
    }
  }

  async deleteWebhook(id: number): Promise<void> {
    const token = await this.auth.getToken();
    try {
      await axios.delete(
        new URL(`webhooks/${id}`, `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
        {
          headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
          timeout: this.cfg.requestTimeoutMs,
        },
      );
    } catch {
      throw new ServiceUnavailableException('Không thể xóa webhook KiotViet đã ngừng hoạt động');
    }
  }

  getProductOnHands(
    query: Record<string, string | number | boolean>,
  ): Promise<KiotVietPage<Record<string, unknown>>> {
    return this.getPage<Record<string, unknown>>('/productOnHands', query);
  }

  getInvoice(id: number): Promise<Record<string, unknown>> {
    return this.get(`/invoices/${id}`, {}) as Promise<Record<string, unknown>>;
  }

  getOrder(id: number): Promise<Record<string, unknown> | null> {
    return this.get(`/orders/${id}`, {}) as Promise<Record<string, unknown> | null>;
  }

  async createOrder(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const token = await this.auth.getToken();
    const response = await axios.post<Record<string, unknown>>(
      new URL('orders', `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
      payload,
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
    return response.data;
  }

  async updateOrder(
    id: number,
    payload: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const token = await this.auth.getToken();
    const response = await axios.put<Record<string, unknown>>(
      new URL(`orders/${id}`, `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
      payload,
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
    return response.data;
  }

  async deleteOrder(id: number): Promise<void> {
    const token = await this.auth.getToken();
    await axios.delete(
      new URL(
        `orders/${id}?IsVoidPayment=true`,
        `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`,
      ).toString(),
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
  }

  async createInvoice(payload: Record<string, unknown>): Promise<Record<string, unknown>> {
    const token = await this.auth.getToken();
    const response = await axios.post<Record<string, unknown>>(
      new URL('invoices', `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`).toString(),
      payload,
      {
        headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
        timeout: this.cfg.requestTimeoutMs,
      },
    );
    return response.data;
  }

  private async getPage<T>(
    path: string,
    query: Record<string, string | number | boolean>,
  ): Promise<KiotVietPage<T>> {
    const result = await this.get(path, query);
    const page =
      result && typeof result === 'object' && !Array.isArray(result)
        ? (result as Record<string, unknown>)
        : null;

    // KiotViet omits `data` for an empty page instead of returning `data: []`.
    if (page?.total === 0 && page.data === undefined) {
      return {
        total: 0,
        pageSize: typeof page.pageSize === 'number' ? page.pageSize : 0,
        data: [],
      };
    }

    if (!page || !Array.isArray(page.data) || typeof page.total !== 'number') {
      throw new ServiceUnavailableException('KiotViet trả dữ liệu không hợp lệ');
    }
    return {
      total: page.total,
      pageSize: page.pageSize as number,
      data: page.data as T[],
    };
  }

  private async get(
    path: string,
    query: Record<string, string | number | boolean>,
    operationId?: string,
  ): Promise<unknown> {
    const url = new URL(path, `${this.cfg.apiBaseUrl.replace(/\/$/, '')}/`);
    for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value));

    for (let attempt = 0; attempt < 2; attempt++) {
      await this.consumeReadBudget();
      const token = await this.auth.getToken();
      const startedAt = Date.now();
      try {
        const response = await axios.get<unknown>(url.toString(), {
          headers: { Retailer: this.cfg.retailer, Authorization: `Bearer ${token}` },
          timeout: this.cfg.requestTimeoutMs,
        });
        return response.data;
      } catch (error) {
        const axiosError = axios.isAxiosError(error) ? error : undefined;
        this.logger.warn({
          event: 'kiotviet.read.failed',
          operationId,
          endpoint: path,
          durationMs: Date.now() - startedAt,
          timeoutMs: this.cfg.requestTimeoutMs,
          attempt: attempt + 1,
          httpStatus: axiosError?.response?.status,
          errorCode: axiosError?.code ?? 'UNKNOWN',
        });
        if (axios.isAxiosError(error) && error.response?.status === 401 && attempt === 0) {
          this.auth.invalidate();
          continue;
        }
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 420 &&
          path.startsWith('/products/code/')
        ) {
          const data = error.response.data as Record<string, unknown> | undefined;
          const remoteStatus = data?.responseStatus as Record<string, unknown> | undefined;
          if (remoteStatus?.errorCode === 'KvValidateProductException') return null;
        }
        if (axios.isAxiosError(error) && error.response?.status === 429) {
          throw new HttpException(
            'KiotViet đang giới hạn số lần đọc',
            HttpStatus.TOO_MANY_REQUESTS,
          );
        }
        if (axios.isAxiosError(error) && error.response) {
          const data = error.response.data as Record<string, unknown> | undefined;
          const remoteStatus = data?.responseStatus as Record<string, unknown> | undefined;
          const code = typeof remoteStatus?.errorCode === 'string' ? remoteStatus.errorCode : '';
          const message =
            typeof remoteStatus?.message === 'string'
              ? remoteStatus.message
              : typeof data?.message === 'string'
                ? data.message
                : '';
          throw new ServiceUnavailableException(
            `KiotViet GET ${path} HTTP ${error.response.status}${code ? ` ${code}` : ''}${message ? `: ${message}` : ''}`.slice(
              0,
              900,
            ),
          );
        }
        const timedOut = axiosError?.code === 'ECONNABORTED' || axiosError?.code === 'ETIMEDOUT';
        throw new ServiceUnavailableException(
          timedOut
            ? 'Hết thời gian chờ đọc dữ liệu KiotViet'
            : 'Không thể kết nối để đọc dữ liệu KiotViet',
        );
      }
    }
    throw new ServiceUnavailableException('Không thể xác thực yêu cầu đọc KiotViet');
  }

  private async consumeReadBudget(): Promise<void> {
    const hour = Math.floor(Date.now() / 3_600_000);
    const key = `kiotviet:gets:${this.cfg.retailer}:${hour}`;
    try {
      const count = await this.redis
        .getClient()
        .eval(
          'local n = redis.call("INCR", KEYS[1]); if n == 1 then redis.call("EXPIRE", KEYS[1], 7200) end; return n',
          1,
          key,
        );
      if (Number(count) > GET_BUDGET_PER_HOUR) {
        throw new HttpException(
          'Đã hết ngân sách đọc KiotViet trong giờ này',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new ServiceUnavailableException('Không thể kiểm tra hạn mức đọc KiotViet');
    }
  }
}
