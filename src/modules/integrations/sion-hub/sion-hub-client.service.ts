import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import sionHubConfig from '../../../config/sion-hub.config.js';
import { SionHubCredentialService } from './sion-hub-credential.service.js';
import type {
  CreateSionHubPaymentOrderDto,
  SendCampaignDto,
  SendZbsDto,
  SionHubWrappedResponse,
} from './types.js';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

@Injectable()
export class SionHubClientService {
  private readonly logger = new Logger(SionHubClientService.name);

  constructor(
    private readonly credentials: SionHubCredentialService,
    @Inject(sionHubConfig.KEY)
    private readonly cfg: ConfigType<typeof sionHubConfig>,
  ) {}

  getWalletBalance<T = { walletBalance: number }>(): Promise<T> {
    return this.request<T>('GET', '/tenant-billing/balance');
  }

  getServicePackages<T = unknown>(): Promise<T> {
    return this.request<T>('GET', '/tenant-billing/packages');
  }

  createPaymentOrder<T = unknown>(dto: CreateSionHubPaymentOrderDto): Promise<T> {
    return this.request<T>('POST', '/tenant-billing/create-order', { body: dto });
  }

  getApprovedZbsTemplates<T = unknown>(oaId: string): Promise<T> {
    return this.request<T>('GET', '/zbs-templates/approved', { query: { oaId } });
  }

  sendZbs<T = unknown>(dto: SendZbsDto): Promise<T> {
    return this.request<T>('POST', '/zalo-platform/send-zbs', { body: dto });
  }

  sendCampaign<T = unknown>(dto: SendCampaignDto): Promise<T> {
    return this.request<T>('POST', '/zalo-platform/send-campaign', { body: dto });
  }

  getCampaignLogs<T = unknown>(campaignId: string): Promise<T> {
    return this.request<T>('GET', `/zalo-platform/campaigns/${campaignId}/export-logs`);
  }

  async request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
    if (!this.cfg.url) {
      throw new InternalServerErrorException('HUB_URL chưa được cấu hình.');
    }

    const apiKey = await this.credentials.getApiKey();
    const url = this.buildUrl(path, options.query);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.cfg.timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      const payload = await this.readResponse(response);
      if (!response.ok) {
        const message = this.extractErrorMessage(payload, response.statusText);
        this.logger.warn(`SionHub ${method} ${path} failed: ${message}`);
        throw new BadRequestException(message);
      }

      return this.unwrap<T>(payload);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = error instanceof Error ? error.message : 'Unable to connect to SionHub';
      this.logger.error(`SionHub ${method} ${path} failed`, message);
      throw new BadRequestException('Unable to connect to SionHub');
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildUrl(path: string, query?: RequestOptions['query']): string {
    const base = this.cfg.url.endsWith('/') ? this.cfg.url : `${this.cfg.url}/`;
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const url = new URL(normalizedPath, base);

    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }

    return url.toString();
  }

  private async readResponse(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return null;

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  }

  private unwrap<T>(payload: unknown): T {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return (payload as SionHubWrappedResponse<T>).data as T;
    }

    return payload as T;
  }

  private extractErrorMessage(payload: unknown, fallback: string): string {
    if (payload && typeof payload === 'object' && 'message' in payload) {
      const message = (payload as { message?: unknown }).message;
      if (Array.isArray(message)) return message.join(', ');
      if (typeof message === 'string') return message;
    }

    return fallback || 'SionHub request failed';
  }
}
