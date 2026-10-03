import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import axios from 'axios';

import kiotvietConfig from '../../../config/kiotviet.config.js';

interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

@Injectable()
export class KiotVietAuthService {
  private token: string | null = null;
  private expiresAt = 0;
  private refreshing: Promise<string> | null = null;

  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
  ) {}

  async getToken(): Promise<string> {
    if (this.token && Date.now() < this.expiresAt) return this.token;
    if (!this.refreshing) {
      this.refreshing = this.fetchToken().finally(() => {
        this.refreshing = null;
      });
    }
    return this.refreshing;
  }

  invalidate(): void {
    this.token = null;
    this.expiresAt = 0;
  }

  private async fetchToken(): Promise<string> {
    const body = new URLSearchParams({
      scopes: 'PublicApi.Access',
      grant_type: 'client_credentials',
      client_id: this.cfg.clientId,
      client_secret: this.cfg.clientSecret,
    });

    try {
      const response = await axios.post<TokenResponse>(this.cfg.tokenUrl, body.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: this.cfg.requestTimeoutMs,
      });
      const data = response.data;
      if (
        !data ||
        typeof data.access_token !== 'string' ||
        !data.access_token ||
        data.token_type?.toLowerCase() !== 'bearer' ||
        !Number.isFinite(Number(data.expires_in)) ||
        Number(data.expires_in) <= 0
      ) {
        throw new Error('Invalid token response');
      }
      this.token = data.access_token;
      this.expiresAt = Date.now() + Math.max(1, Number(data.expires_in) - 300) * 1000;
      return this.token;
    } catch {
      throw new ServiceUnavailableException('Không thể xác thực với KiotViet');
    }
  }
}
