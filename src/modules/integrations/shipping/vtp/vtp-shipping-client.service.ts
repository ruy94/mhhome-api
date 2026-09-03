import { createHash } from 'node:crypto';

import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import shippingConfig from '../../../../config/shipping.config.js';
import { RedisService } from '../../../../common/redis/redis.service.js';
import type { ShippingOrderDraft } from '../../../shipping/shipping.types.js';
import type {
  VtpCreateData,
  VtpCreateResult,
  VtpEditInput,
  VtpFailureDetails,
  VtpFailureStage,
  VtpLoginData,
  VtpPriceData,
  VtpQuoteResult,
  VtpService,
  VtpServiceByDetailResponse,
  VtpWrappedResponse,
} from './vtp-shipping.types.js';
const VTP_PRINT_RETRY_DELAYS_MS = [0, 1_000, 2_000] as const;
const VTP_LONG_LIVED_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;
const VTP_TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const VTP_TOKEN_VALIDITY_BUFFER_MS = 60 * 1000;

class VtpProviderException extends BadGatewayException {
  constructor(readonly details: VtpFailureDetails) {
    super(details.message);
  }
}

@Injectable()
export class VtpShippingClientService {
  private readonly logger = new Logger(VtpShippingClientService.name);
  private accessToken?: { value: string; expiresAt: number };
  private refreshingToken?: Promise<string>;

  constructor(
    @Inject(shippingConfig.KEY)
    private readonly cfg: ConfigType<typeof shippingConfig>,
    private readonly redis: RedisService,
  ) {}

  /** Estimate the cheapest available VTP service for a parcel. */
  async estimateFee(draft: ShippingOrderDraft): Promise<VtpQuoteResult> {
    const common = this.pricePayload(draft);
    const serviceResponse = await this.request<VtpServiceByDetailResponse>(
      '/v2/order/getPriceAllNlp',
      { ...common, TYPE: 1 },
      true,
      'quote',
    );
    const services = this.servicesFrom(serviceResponse);
    if (!services.length) {
      throw new BadRequestException('ViettelPost không có dịch vụ phù hợp cho tuyến giao hàng');
    }

    const selected = [...services].sort((left, right) => {
      const byFee = Number(left.GIA_CUOC) - Number(right.GIA_CUOC);
      if (byFee !== 0) return byFee;
      const byKpi = this.kpiHours(left.THOI_GIAN) - this.kpiHours(right.THOI_GIAN);
      return byKpi !== 0 ? byKpi : left.MA_DV_CHINH.localeCompare(right.MA_DV_CHINH);
    })[0];

    const price = await this.request<VtpPriceData>(
      '/v2/order/getPriceNlp',
      {
        ...common,
        NATIONAL_TYPE: 1,
        ORDER_SERVICE: selected.MA_DV_CHINH,
        ORDER_SERVICE_ADD: '',
      },
      true,
      'quote',
    );

    return {
      provider: 'VTP',
      providerOrderId: draft.orderId,
      estimatedFee: Math.round(Number(price.MONEY_TOTAL ?? selected.GIA_CUOC ?? 0)),
      basicFee: Math.round(Number(price.MONEY_TOTAL_FEE ?? selected.GIA_CUOC ?? 0)),
      serviceCode: selected.MA_DV_CHINH,
      serviceName: selected.TEN_DICHVU,
      expectedDelivery: selected.THOI_GIAN,
      senderAddress: serviceResponse.SENDER_ADDRESS,
      recipientAddress: serviceResponse.RECEIVER_ADDRESS,
      raw: { services: serviceResponse, selected, price },
    };
  }

  /** Create one VTP order using the detail-address contract. */
  async createOrder(draft: ShippingOrderDraft): Promise<VtpCreateResult> {
    const quote = await this.estimateFee(draft);
    const response = await this.request<VtpCreateData>(
      '/v2/order/createOrderNlp',
      this.createPayload(draft, quote.serviceCode),
      true,
      'create',
    );
    if (!response.ORDER_NUMBER) {
      throw new BadGatewayException('ViettelPost không trả về mã vận đơn');
    }

    return {
      provider: 'VTP',
      providerOrderId: draft.orderId,
      trackingNo: response.ORDER_NUMBER,
      estimatedFee: quote.estimatedFee,
      actualFee: Math.round(Number(response.MONEY_TOTAL ?? quote.estimatedFee)),
      serviceCode: quote.serviceCode,
      serviceName: quote.serviceName,
      expectedDelivery: quote.expectedDelivery,
      raw: { quote: quote.raw, create: response },
    };
  }

  /** Update mutable shipping information before VTP has picked up the parcel. */
  async editOrder(
    trackingNo: string,
    draft: ShippingOrderDraft,
    input: VtpEditInput,
    serviceCode: string,
  ) {
    const recipient = {
      ...draft.recipient,
      name: input.recipient?.name ?? draft.recipient.name,
      phone: input.recipient?.phone ?? draft.recipient.phone,
      detailAddress: input.recipient?.address ?? draft.recipient.detailAddress,
    };
    const parcel = {
      ...draft.parcel,
      weightGrams: input.weightGrams ?? draft.parcel.weightGrams,
      lengthCm: input.lengthCm ?? draft.parcel.lengthCm,
      widthCm: input.widthCm ?? draft.parcel.widthCm,
      heightCm: input.heightCm ?? draft.parcel.heightCm,
    };
    const editedDraft: ShippingOrderDraft = {
      ...draft,
      recipient,
      parcel,
      note: input.note ?? draft.note,
    };

    return this.request<VtpCreateData>(
      '/v2/order/edit',
      {
        ...this.createPayload(editedDraft, serviceCode),
        ORDER_NUMBER: trackingNo,
        PICKUP_DATE: input.pickupDate ?? '',
        PICKUP_CODE: input.pickupCode ?? '',
        DELIVERY_CODE: input.deliveryCode ?? '',
        LIST_ITEM: parcel.items.map((item) => ({
          PRODUCT_NAME: this.truncateUtf8(item.name, 150),
          PRODUCT_QUANTITY: item.quantity,
          PRODUCT_PRICE: Math.round(item.price),
          PRODUCT_WEIGHT: Math.round(item.weightGrams),
        })),
      },
      true,
      'edit',
    );
  }

  /** Run an explicit VTP shipment status action. */
  async updateStatus(
    trackingNo: string,
    type: 2 | 3 | 4 | 5,
    note?: string,
    stage: VtpFailureStage = 'status',
  ): Promise<unknown> {
    return this.request(
      '/v2/order/UpdateOrder',
      {
        TYPE: type,
        ORDER_NUMBER: trackingNo,
        NOTE: this.truncateUtf8(note ?? '', 150),
      },
      true,
      stage,
    );
  }

  /** Convert any VTP error to safe, persistable diagnostics. */
  describeError(error: unknown, fallbackStage: VtpFailureStage): VtpFailureDetails {
    if (error instanceof VtpProviderException) return error.details;
    return {
      stage: fallbackStage,
      message: error instanceof Error ? error.message : 'ViettelPost request failed',
    };
  }

  /** Generate a short-lived VTP printing URL for up to 100 tracking numbers. */
  async getAwbByTrackingNos(trackingNos: string[]) {
    if (!trackingNos.length || trackingNos.length > 100) {
      throw new BadRequestException('ViettelPost hỗ trợ in từ 1 đến 100 vận đơn mỗi lần');
    }

    let lastError: unknown;
    for (const [attempt, delayMs] of VTP_PRINT_RETRY_DELAYS_MS.entries()) {
      if (delayMs) await this.wait(delayMs);
      try {
        return await this.createAwbLink(trackingNos);
      } catch (error) {
        lastError = error;
        const message = error instanceof Error ? error.message : 'unknown error';
        this.logger.warn(
          `VTP printing-code attempt ${attempt + 1}/${VTP_PRINT_RETRY_DELAYS_MS.length} failed for ${trackingNos.length} shipment(s): ${message}`,
        );
      }
    }

    if (lastError instanceof Error) throw lastError;
    throw new BadGatewayException('Không thể lấy mã in vận đơn ViettelPost');
  }

  private async createAwbLink(trackingNos: string[]) {
    const response = await this.request<Record<string, unknown>>(
      '/v2/order/printing-code',
      {
        EXPIRY_TIME: Date.now() + this.cfg.vtp.printExpirySeconds * 1000,
        ORDER_ARRAY: trackingNos,
      },
      true,
      'print',
    );
    const code = this.string(response.message) ?? this.string(response.data);
    if (!code) throw new BadGatewayException('ViettelPost không trả về mã in vận đơn');

    const url = new URL('/DigitalizePrint/report.do', this.cfg.vtp.printBaseUrl);
    url.searchParams.set('type', this.cfg.vtp.printLabelType);
    url.searchParams.set('bill', code);
    url.searchParams.set('showPostage', this.cfg.vtp.printShowPostage ? '1' : '0');
    return {
      provider: 'VTP' as const,
      awbLink: url.toString(),
      trackingNos,
      failures: [],
      raw: response,
    };
  }

  private wait(delayMs: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, delayMs));
  }

  private createPayload(draft: ShippingOrderDraft, serviceCode: string) {
    return {
      ORDER_NUMBER: draft.orderId,
      CHECK_UNIQUE: true,
      SENDER_FULLNAME: this.truncateUtf8(draft.sender.name ?? '', 150),
      SENDER_PHONE: this.normalizePhone(draft.sender.phone, 'người gửi'),
      SENDER_ADDRESS: this.composeAddress(draft.sender),
      PICKUP_DATE: '',
      PICKUP_CODE: '',
      RECEIVER_FULLNAME: this.truncateUtf8(draft.recipient.name ?? '', 150),
      RECEIVER_PHONE: this.normalizePhone(draft.recipient.phone, 'người nhận'),
      RECEIVER_ADDRESS: this.composeAddress(draft.recipient),
      DELIVERY_CODE: '',
      PRODUCT_NAME: this.truncateUtf8(draft.parcel.itemName, 150),
      PRODUCT_TYPE: 'HH',
      PRODUCT_QUANTITY: draft.parcel.itemQuantity,
      PRODUCT_PRICE: Math.round(draft.parcel.insuredValue),
      PRODUCT_WEIGHT: Math.round(draft.parcel.weightGrams),
      PRODUCT_LENGTH: Math.round(draft.parcel.lengthCm ?? 0),
      PRODUCT_WIDTH: Math.round(draft.parcel.widthCm ?? 0),
      PRODUCT_HEIGHT: Math.round(draft.parcel.heightCm ?? 0),
      ORDER_PAYMENT: draft.codAmount > 0 ? 3 : 1,
      MONEY_COLLECTION: Math.round(draft.codAmount),
      ORDER_SERVICE: serviceCode,
      ORDER_SERVICE_ADD: null,
      ORDER_NOTE: this.truncateUtf8(draft.note ?? '', 150),
      EXTRA_MONEY: 0,
      PRODUCT_DETAIL: draft.parcel.items.map((item) => ({
        PRODUCT_NAME: this.truncateUtf8(item.name, 150),
        PRODUCT_QUANTITY: item.quantity,
        PRODUCT_PRICE: Math.round(item.price),
        PRODUCT_WEIGHT: Math.round(item.weightGrams),
      })),
      ENABLE_SORT_CODE: false,
    };
  }

  private pricePayload(draft: ShippingOrderDraft) {
    return {
      SENDER_ADDRESS: this.composeAddress(draft.sender),
      RECEIVER_ADDRESS: this.composeAddress(draft.recipient),
      PRODUCT_TYPE: 'HH',
      PRODUCT_WEIGHT: Math.round(draft.parcel.weightGrams),
      PRODUCT_PRICE: Math.round(draft.parcel.insuredValue),
      MONEY_COLLECTION: Math.round(draft.codAmount),
      PRODUCT_LENGTH: Math.round(draft.parcel.lengthCm ?? 0),
      PRODUCT_WIDTH: Math.round(draft.parcel.widthCm ?? 0),
      PRODUCT_HEIGHT: Math.round(draft.parcel.heightCm ?? 0),
    };
  }

  private normalizePhone(phone: string | undefined, label: string) {
    const digits = (phone ?? '').replace(/\D/g, '');
    const normalized = digits.startsWith('0084')
      ? `0${digits.slice(4)}`
      : digits.startsWith('84')
        ? `0${digits.slice(2)}`
        : digits;
    if (!/^0\d{9,10}$/.test(normalized)) {
      throw new BadRequestException(`Số điện thoại ${label} không hợp lệ cho ViettelPost`);
    }
    return normalized;
  }

  private composeAddress(party: ShippingOrderDraft['sender']) {
    const values = [party.detailAddress, party.district, party.city, party.state]
      .map((value) => value?.trim())
      .filter((value): value is string => Boolean(value));
    const parts: string[] = [];
    for (const value of values) {
      const normalized = this.normalizeAddressPart(value);
      if (parts.some((part) => this.normalizeAddressPart(part).includes(normalized))) continue;
      parts.push(value);
    }
    const address = parts.join(', ');
    if (!address) throw new BadRequestException('Thiếu địa chỉ ViettelPost');
    return this.truncateUtf8(address, 150);
  }

  private servicesFrom(response: VtpServiceByDetailResponse | VtpService[]) {
    if (Array.isArray(response)) return response;
    return Array.isArray(response.RESULT) ? response.RESULT : [];
  }

  private kpiHours(value?: string) {
    const matched = value?.match(/\d+(?:[.,]\d+)?/);
    return matched ? Number(matched[0].replace(',', '.')) : Number.MAX_SAFE_INTEGER;
  }

  private normalizeAddressPart(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  }

  private truncateUtf8(value: string, maxBytes: number) {
    let result = value.trim();
    while (Buffer.byteLength(result, 'utf8') > maxBytes) result = result.slice(0, -1);
    return result;
  }

  private async request<T>(
    path: string,
    body: Record<string, unknown>,
    retryAuth = true,
    stage: VtpFailureStage = 'status',
  ): Promise<T> {
    const token = await this.getAccessToken();
    try {
      const response = await this.fetchJson(path, body, token, stage);
      if (this.isTokenError(response) && retryAuth) {
        return this.retryWithFreshToken<T>(path, body, stage);
      }
      return this.unwrap<T>(response, path, stage);
    } catch (error) {
      if (this.isTokenError(error) && retryAuth) {
        return this.retryWithFreshToken<T>(path, body, stage);
      }
      throw error;
    }
  }

  private async retryWithFreshToken<T>(
    path: string,
    body: Record<string, unknown>,
    stage: VtpFailureStage,
  ) {
    const refreshed = await this.getAccessToken(true);
    return this.unwrap<T>(await this.fetchJson(path, body, refreshed, stage), path, stage);
  }

  private async fetchJson(
    path: string,
    body: Record<string, unknown>,
    token?: string,
    stage: VtpFailureStage = 'status',
    cookie?: string,
  ) {
    return (await this.fetchJsonResponse(path, body, token, stage, cookie)).payload;
  }

  private async fetchJsonResponse(
    path: string,
    body: Record<string, unknown>,
    token?: string,
    stage: VtpFailureStage = 'status',
    cookie?: string,
  ) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.cfg.vtp.timeoutMs);
    try {
      const response = await fetch(new URL(path, this.withTrailingSlash(this.cfg.vtp.baseUrl)), {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
          ...(token ? { Token: token } : {}),
          ...(cookie ? { Cookie: cookie } : {}),
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => ({}))) as unknown;
      if (!response.ok) {
        const wrapped = this.record(payload);
        throw new VtpProviderException({
          stage,
          path,
          httpStatus: response.status,
          providerStatus: this.number(wrapped.status),
          message: this.string(wrapped.message) ?? 'ViettelPost returned HTTP ' + response.status,
          providerPayload: payload,
        });
      }
      return { payload, cookie: this.responseCookie(response.headers) };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof BadGatewayException) throw error;
      const message = error instanceof Error ? error.message : 'Unknown ViettelPost error';
      throw new VtpProviderException({
        stage,
        path,
        message: 'Không thể kết nối ViettelPost: ' + message,
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  private unwrap<T>(payload: unknown, path: string, stage: VtpFailureStage): T {
    const wrapped = this.record(payload) as VtpWrappedResponse<T>;
    if (wrapped.error === true || (wrapped.status !== undefined && wrapped.status >= 400)) {
      throw new VtpProviderException({
        stage,
        path,
        providerStatus: wrapped.status,
        message: wrapped.message || 'ViettelPost từ chối yêu cầu',
        providerPayload: payload,
      });
    }
    if (wrapped.data !== undefined && wrapped.data !== null) return wrapped.data;
    return payload as T;
  }

  private isTokenError(value: unknown) {
    const details = value instanceof VtpProviderException ? value.details : undefined;
    const payload = this.record(details?.providerPayload ?? value);
    const statuses = [
      details?.httpStatus,
      details?.providerStatus,
      this.number(payload.status),
    ].filter((status): status is number => status !== undefined);
    if (statuses.some((status) => status === 401 || status === 403)) return true;

    const message = [details?.message, this.string(payload.message)]
      .filter((entry): entry is string => Boolean(entry))
      .join(' ')
      .toLowerCase();
    return [
      'token invalid',
      'token is required',
      'token expired',
      'token is expired',
      'token hết hạn',
      'unauthorized',
      'unauthenticated',
    ].some((pattern) => message.includes(pattern));
  }

  private async getAccessToken(force = false): Promise<string> {
    const credentials = this.partnerCredentials();
    const tokenCacheKey = this.tokenCacheKey(credentials.USERNAME);
    const now = Date.now();

    if (force) {
      this.accessToken = undefined;
      try {
        await this.redis.getClient().del(tokenCacheKey);
      } catch {
        // Redis cache is an optimization; authentication still works without it.
      }
    } else if (
      this.accessToken &&
      this.accessToken.expiresAt > now + VTP_TOKEN_VALIDITY_BUFFER_MS
    ) {
      return this.accessToken.value;
    }

    if (!force) {
      try {
        const cached = this.parseCachedToken(await this.redis.getClient().get(tokenCacheKey));
        if (cached && cached.expiresAt > now + VTP_TOKEN_VALIDITY_BUFFER_MS) {
          this.accessToken = cached;
          return cached.value;
        }
      } catch {
        // Redis cache is an optimization; authentication still works without it.
      }
    }

    if (!this.refreshingToken) {
      this.refreshingToken = this.login(credentials, tokenCacheKey).finally(() => {
        this.refreshingToken = undefined;
      });
    }
    return this.refreshingToken;
  }

  private async login(credentials: { USERNAME: string; PASSWORD: string }, tokenCacheKey: string) {
    const loginPath = '/v2/user/Login';
    const loginResponse = await this.fetchJsonResponse(loginPath, credentials, undefined, 'auth');
    const shortLived = this.unwrap<VtpLoginData>(loginResponse.payload, loginPath, 'auth');
    if (!shortLived.token) {
      throw new BadGatewayException('ViettelPost không trả về token ngắn hạn');
    }

    const ownerConnectPath = '/v2/user/ownerconnect';
    const ownerPayload = await this.fetchJson(
      ownerConnectPath,
      credentials,
      shortLived.token,
      'auth',
      loginResponse.cookie,
    );
    const longLived = this.unwrap<VtpLoginData>(ownerPayload, ownerConnectPath, 'auth');
    if (!longLived.token) {
      throw new BadGatewayException('ViettelPost không trả về token dài hạn');
    }

    const expiresAt = Math.max(
      this.tokenExpiry(longLived.token) - VTP_TOKEN_REFRESH_BUFFER_MS,
      Date.now() + VTP_TOKEN_VALIDITY_BUFFER_MS,
    );
    this.accessToken = { value: longLived.token, expiresAt };
    const ttlSeconds = Math.max(Math.floor((expiresAt - Date.now()) / 1000), 60);
    try {
      await this.redis
        .getClient()
        .set(tokenCacheKey, JSON.stringify(this.accessToken), 'EX', ttlSeconds);
    } catch (error) {
      this.logger.warn(
        'Không thể cache VTP token dài hạn: ' +
          (error instanceof Error ? error.message : 'unknown'),
      );
    }
    return longLived.token;
  }

  private partnerCredentials() {
    const username = this.cfg.vtp.username;
    const password = this.cfg.vtp.password;
    if (!username?.trim() || !password?.trim()) {
      throw new BadRequestException('Thiếu cấu hình VTP_USERNAME hoặc VTP_PASSWORD');
    }
    return { USERNAME: username, PASSWORD: password };
  }

  private tokenCacheKey(username: string) {
    const fingerprint = createHash('sha256')
      .update(username.trim().toLowerCase())
      .digest('hex')
      .slice(0, 16);
    return 'shipping:vtp:owner-token:v1:' + fingerprint;
  }

  private parseCachedToken(value: string | null) {
    if (!value) return undefined;
    try {
      const parsed = JSON.parse(value) as { value?: unknown; expiresAt?: unknown };
      const token = this.string(parsed.value);
      const expiresAt = Number(parsed.expiresAt);
      if (!token || !Number.isFinite(expiresAt)) return undefined;
      return { value: token, expiresAt };
    } catch {
      return undefined;
    }
  }

  private tokenExpiry(token: string) {
    try {
      const payload = JSON.parse(Buffer.from(token.split('.')[1] ?? '', 'base64url').toString());
      const exp = Number(payload.exp);
      if (Number.isFinite(exp) && exp > 0) return exp * 1000;
    } catch {
      // VTP ownerconnect tokens may not expose a JWT exp claim.
    }
    return Date.now() + VTP_LONG_LIVED_TOKEN_TTL_MS;
  }

  private record(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  }

  private string(value: unknown) {
    return value === undefined || value === null || value === '' ? undefined : String(value);
  }

  private number(value: unknown) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  private responseCookie(headers: Headers) {
    const extendedHeaders = headers as Headers & { getSetCookie?: () => string[] };
    const values = extendedHeaders.getSetCookie?.call(headers) ?? [headers.get('set-cookie') ?? ''];
    const cookies = values
      .flatMap((value) => value.match(/(?:^|,\s*)([^=;,\s]+=[^;,]+)/g) ?? [])
      .map((value) => value.replace(/^,\s*/, '').trim())
      .filter(Boolean);
    return cookies.length ? cookies.join('; ') : undefined;
  }

  private withTrailingSlash(value: string) {
    return value.endsWith('/') ? value : `${value}/`;
  }
}
