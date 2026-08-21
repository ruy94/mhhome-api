import { BadGatewayException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { randomUUID } from 'node:crypto';

import marketplaceConfig from '../../config/marketplace.config.js';
import { MarketplaceHmacService } from './marketplace-hmac.service.js';

interface MarketplaceResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number | null;
    totalPages: number;
  };
}

@Injectable()
export class MarketplaceClientService {
  constructor(
    private readonly hmac: MarketplaceHmacService,
    @Inject(marketplaceConfig.KEY)
    private readonly config: ConfigType<typeof marketplaceConfig>,
  ) {}

  getCatalog(query: { page: number; limit: number; q?: string }) {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
    });
    if (query.q?.trim()) params.set('q', query.q.trim());
    return this.request<unknown[]>(`/api/v1/marketplace/catalog?${params.toString()}`);
  }

  getCatalogItem(listingId: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/catalog/${encodeURIComponent(listingId)}`,
    );
  }

  quoteCheckout(payload: unknown) {
    return this.request<unknown>('/api/v1/marketplace/checkout/quote', {
      method: 'POST',
      body: payload,
      idempotencyKey: randomUUID(),
    });
  }

  prepareCheckout(payload: unknown, idempotencyKey: string) {
    this.assertCheckoutEnabled();
    return this.request<unknown>('/api/v1/marketplace/checkout/prepare', {
      method: 'POST',
      body: payload,
      idempotencyKey,
    });
  }

  getCheckoutSession(sessionId: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/checkout/${encodeURIComponent(sessionId)}`,
    );
  }

  confirmCheckout(sessionId: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/checkout/${encodeURIComponent(sessionId)}/confirm`,
      { method: 'POST', body: {}, idempotencyKey: `${sessionId}:confirm` },
    );
  }

  releaseCheckout(sessionId: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/checkout/${encodeURIComponent(sessionId)}/release`,
      { method: 'POST', body: {}, idempotencyKey: `${sessionId}:release` },
    );
  }

  getOrders(userId: number, query: { page: number; limit: number; q?: string }) {
    const params = new URLSearchParams({
      hostLocalUserId: String(userId),
      page: String(query.page),
      limit: String(query.limit),
    });
    if (query.q?.trim()) params.set('q', query.q.trim());
    return this.request<unknown[]>(`/api/v1/marketplace/orders?${params.toString()}`);
  }

  getOrder(userId: number, orderId: string) {
    const params = new URLSearchParams({ hostLocalUserId: String(userId) });
    return this.request<unknown>(
      `/api/v1/marketplace/orders/${encodeURIComponent(orderId)}?${params.toString()}`,
    );
  }

  cancelOrder(userId: number, orderId: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/orders/${encodeURIComponent(orderId)}/cancel`,
      {
        method: 'POST',
        body: { hostLocalUserId: userId },
        idempotencyKey: `${orderId}:${userId}:cancel`,
      },
    );
  }

  sendCatalogEvent(eventId: string, payload: unknown) {
    return this.request<unknown>('/api/v1/marketplace/catalog/events', {
      method: 'POST',
      body: payload,
      idempotencyKey: eventId,
    });
  }

  createSourceShipments(subOrderIds: string[], idempotencyKey: string) {
    return this.request<unknown>('/api/v1/marketplace/source-fulfillment/shipments', {
      method: 'POST',
      body: { subOrderIds },
      idempotencyKey,
    });
  }

  getSourceAwb(subOrderIds: string[], idempotencyKey: string) {
    return this.request<unknown>('/api/v1/marketplace/source-fulfillment/awb', {
      method: 'POST',
      body: { subOrderIds },
      idempotencyKey,
    });
  }

  refreshSourceShipments(subOrderIds: string[], idempotencyKey: string) {
    return this.request<unknown>('/api/v1/marketplace/source-fulfillment/tracking/refresh', {
      method: 'POST',
      body: { subOrderIds },
      idempotencyKey,
    });
  }

  cancelSourceShipment(subOrderId: string, idempotencyKey: string) {
    return this.request<unknown>(
      `/api/v1/marketplace/source-fulfillment/shipments/${encodeURIComponent(subOrderId)}/cancel`,
      { method: 'POST', body: {}, idempotencyKey },
    );
  }

  private async request<T>(
    pathWithQuery: string,
    options?: { method: 'POST'; body: unknown; idempotencyKey: string },
  ): Promise<MarketplaceResponse<T>> {
    if (!this.config.enabled) throw new NotFoundException();

    const method = options?.method ?? 'GET';
    const body = options ? JSON.stringify(options.body) : undefined;
    const timestamp = String(Math.floor(Date.now() / 1000));
    const nonce = randomUUID();
    const canonical = this.hmac.canonical({
      method,
      pathWithQuery,
      timestamp,
      nonce,
      idempotencyKey: options?.idempotencyKey,
      bodyHash: this.hmac.hashBody(body),
    });
    const signature = this.hmac.sign(this.config.hmacSecret, canonical);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.requestTimeoutMs);

    try {
      const response = await fetch(new URL(pathWithQuery, this.withTrailingSlash(this.config.baseUrl)), {
        method,
        body,
        headers: {
          'content-type': 'application/json',
          'x-marketplace-shop-code': this.config.shopCode,
          'x-marketplace-key-id': this.config.keyId,
          'x-marketplace-timestamp': timestamp,
          'x-marketplace-nonce': nonce,
          'x-marketplace-signature': signature,
          ...(options?.idempotencyKey
            ? { 'x-idempotency-key': options.idempotencyKey }
            : {}),
        },
        signal: controller.signal,
      });
      if (!response.ok) {
        const responseText = await response.text();
        throw new BadGatewayException(
          `Marketplace returned HTTP ${response.status}${responseText ? `: ${responseText}` : ''}`,
        );
      }
      return (await response.json()) as MarketplaceResponse<T>;
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown Marketplace error';
      throw new BadGatewayException(`Cannot reach Marketplace: ${message}`);
    } finally {
      clearTimeout(timeout);
    }
  }

  private withTrailingSlash(value: string): string {
    return value.endsWith('/') ? value : `${value}/`;
  }

  private assertCheckoutEnabled() {
    if (!this.config.enabled || !this.config.checkoutEnabled) throw new NotFoundException();
  }
}
