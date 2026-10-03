import axios from 'axios';

import { KiotVietAuthService } from './kiotviet-auth.service.js';

jest.mock('axios');

const config = {
  clientId: 'client-id',
  clientSecret: 'client-secret',
  tokenUrl: 'https://id.kiotviet.vn/connect/token',
  requestTimeoutMs: 10000,
};

describe('KiotVietAuthService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('coalesces concurrent token requests and caches the token', async () => {
    jest.mocked(axios.post).mockResolvedValue({
      data: { access_token: 'access-token', token_type: 'Bearer', expires_in: 3600 },
    });
    const service = new KiotVietAuthService(config as never);

    expect(await Promise.all([service.getToken(), service.getToken()])).toEqual([
      'access-token',
      'access-token',
    ]);
    expect(await service.getToken()).toBe('access-token');
    expect(axios.post).toHaveBeenCalledTimes(1);
    const body = jest.mocked(axios.post).mock.calls[0][1];
    expect(body).toContain('grant_type=client_credentials');
    expect(body).toContain('client_id=client-id');
    expect(body).toContain('client_secret=client-secret');
  });

  it('does not expose token endpoint errors', async () => {
    jest.mocked(axios.post).mockRejectedValue(new Error('client-secret leaked here'));
    const service = new KiotVietAuthService(config as never);
    await expect(service.getToken()).rejects.toThrow('Không thể xác thực với KiotViet');
  });
});
