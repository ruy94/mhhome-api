import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import saleworkConfig from '../../../config/salework.config.js';
import type {
  SaleworkAddressApiData,
  SaleworkAddressData,
  SaleworkBankingResponse,
  SaleworkInventoryTransactionsApiData,
  SaleworkInventoryTransactionsData,
  SaleworkLogisticsData,
  SaleworkMutationResult,
  SaleworkProductReportData,
  SaleworkProductsApiData,
  SaleworkProductsData,
  SaleworkStockV1Response,
  SaleworkStockV2Response,
} from './salework.types.js';

type RequestBase = 'stock' | 'banking';
type ResponseEnvelope = 'stockV1' | 'stockV2' | 'banking';

type RequestOptions = {
  base: RequestBase;
  path: string;
  method: 'GET' | 'POST';
  envelope: ResponseEnvelope;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
};

@Injectable()
export class SaleworkClientService {
  private readonly logger = new Logger(SaleworkClientService.name);

  constructor(
    @Inject(saleworkConfig.KEY)
    private readonly cfg: ConfigType<typeof saleworkConfig>,
  ) {}

  async getProducts(): Promise<SaleworkProductsData> {
    const payload = await this.request<SaleworkProductsApiData>({
      base: 'stock',
      path: '/v1/product/list',
      method: 'GET',
      envelope: 'stockV1',
    });

    return this.normalizeProductsResponse(payload);
  }

  createOrder(payload: unknown): Promise<SaleworkMutationResult> {
    return this.request<SaleworkMutationResult>({
      base: 'stock',
      path: '/v1/order/salework/create',
      method: 'POST',
      envelope: 'stockV1',
      body: payload,
    });
  }

  warehouseImport(payload: unknown): Promise<SaleworkMutationResult> {
    return this.request<SaleworkMutationResult>({
      base: 'stock',
      path: '/v1/warehouse/import',
      method: 'POST',
      envelope: 'stockV1',
      body: payload,
    });
  }

  warehouseExport(payload: unknown): Promise<SaleworkMutationResult> {
    return this.request<SaleworkMutationResult>({
      base: 'stock',
      path: '/v1/warehouse/export',
      method: 'POST',
      envelope: 'stockV1',
      body: payload,
    });
  }

  warehouseReturn(payload: unknown): Promise<SaleworkMutationResult> {
    return this.request<SaleworkMutationResult>({
      base: 'stock',
      path: '/v1/warehouse/return',
      method: 'POST',
      envelope: 'stockV1',
      body: payload,
    });
  }

  getProductReport(payload: unknown): Promise<SaleworkProductReportData> {
    return this.request<SaleworkProductReportData>({
      base: 'stock',
      path: '/v1/report/product',
      method: 'POST',
      envelope: 'stockV1',
      body: payload,
    });
  }

  async getAddressList(): Promise<SaleworkAddressData> {
    const payload = await this.request<SaleworkAddressApiData>({
      base: 'stock',
      path: '/v2',
      method: 'POST',
      envelope: 'stockV2',
      body: { method: 'getAddressList' },
    });

    const addresses = ('addresses' in payload ? payload.addresses : payload) as Partial<SaleworkAddressData> | undefined;
    return {
      provinces: addresses?.provinces ?? {},
      districts: addresses?.districts ?? {},
      wards: addresses?.wards ?? {},
      provinces_new: addresses?.provinces_new ?? {},
      wards_new: addresses?.wards_new ?? {},
    };
  }

  async getLogistics(): Promise<SaleworkLogisticsData> {
    const payload = await this.request<Partial<SaleworkLogisticsData>>({
      base: 'stock',
      path: '/v2',
      method: 'POST',
      envelope: 'stockV2',
      body: { method: 'getLogistics' },
    });

    return { logistics: Array.isArray(payload.logistics) ? payload.logistics : [] };
  }

  async getInventoryTransactions(params: unknown): Promise<SaleworkInventoryTransactionsData> {
    const payload = await this.request<SaleworkInventoryTransactionsApiData>({
      base: 'stock',
      path: '/v2',
      method: 'POST',
      envelope: 'stockV2',
      body: { method: 'getInventoryTransaction', params },
    });

    return {
      transactions: 'transactions' in payload ? payload.transactions ?? [] : payload.transaction ?? [],
      next_cursor: payload.next_cursor ?? 0,
    };
  }

  getMerchants(): Promise<unknown> {
    return this.request({
      base: 'banking',
      path: '/merchant/v1/list',
      method: 'GET',
      envelope: 'banking',
    });
  }

  createDebt(payload: unknown): Promise<unknown> {
    return this.request({
      base: 'banking',
      path: '/debt/v1/create',
      method: 'POST',
      envelope: 'banking',
      body: payload,
    });
  }

  generateQr(query: { merchantId: number; billRef: string }): Promise<unknown> {
    return this.request({
      base: 'banking',
      path: '/debt/v1/gen-qr',
      method: 'GET',
      envelope: 'banking',
      query,
    });
  }

  private async request<T = unknown>(options: RequestOptions): Promise<T> {
    this.assertConfigured();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.cfg.timeoutMs);
    const url = this.buildUrl(options.base, options.path, options.query);
    const body = options.body === undefined ? undefined : JSON.stringify(options.body);

    try {
      const response = await fetch(url, {
        method: options.method,
        headers: this.createHeaders(),
        body,
        signal: controller.signal,
      });
      const payload = await this.readResponse<unknown>(response);

      if (!response.ok) {
        throw new BadRequestException(
          this.getErrorMessage(payload) || response.statusText || 'Salework request failed',
        );
      }

      return this.unwrapResponse<T>(payload, options.envelope);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = error instanceof Error ? error.message : 'Unable to connect to Salework';
      this.logger.error(`Salework ${options.method} ${options.path} failed`, message);
      throw new BadRequestException('Không thể kết nối Salework');
    } finally {
      clearTimeout(timeout);
    }
  }

  private normalizeProductsResponse(payload: SaleworkProductsApiData): SaleworkProductsData {
    return {
      products: payload.products ?? {},
      warehouses: payload.warehouses ?? payload.warehouse ?? [],
    };
  }

  private unwrapResponse<T>(payload: unknown, envelope: ResponseEnvelope): T {
    if (!payload || typeof payload !== 'object') {
      throw new BadRequestException('Salework response missing data');
    }

    if (envelope === 'stockV1') {
      const response = payload as SaleworkStockV1Response<T>;
      if (response.status !== 'success') {
        throw new BadRequestException(
          response.message || response.error || 'Salework request failed',
        );
      }
      return response.data as T;
    }

    if (envelope === 'stockV2') {
      const response = payload as SaleworkStockV2Response<T>;
      if (response.success !== true) {
        throw new BadRequestException(
          response.message || response.error || 'Salework request failed',
        );
      }
      return response.data as T;
    }

    const response = payload as SaleworkBankingResponse<T>;
    if (response.error) {
      throw new BadRequestException(response.error);
    }
    if (response.data === undefined || response.data === null) {
      throw new BadRequestException(response.message || 'Salework response missing data');
    }
    return response.data;
  }

  private createHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'client-id': this.cfg.clientId,
      token: this.cfg.token,
    };
  }

  private buildUrl(
    base: RequestBase,
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ) {
    const baseUrl = base === 'stock' ? this.cfg.stockBaseUrl : this.cfg.bankingBaseUrl;
    const url = new URL(path.replace(/^\//, ''), this.normalizeBaseUrl(baseUrl));

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    return url;
  }

  private normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  private assertConfigured() {
    if (!this.cfg.enabled) throw new BadRequestException('Salework chưa được bật');
    if (!this.cfg.clientId || !this.cfg.token) {
      throw new BadRequestException('Thiếu cấu hình Salework');
    }
  }

  private getErrorMessage(payload: unknown) {
    if (!payload || typeof payload !== 'object') return undefined;
    const response = payload as { message?: unknown; error?: unknown };
    if (typeof response.message === 'string') return response.message;
    if (typeof response.error === 'string') return response.error;
    return undefined;
  }

  private async readResponse<T>(response: Response): Promise<T | null> {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  }
}

