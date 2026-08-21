import { MarketplaceHmacService } from './marketplace-hmac.service.js';

describe('MarketplaceHmacService', () => {
  const service = new MarketplaceHmacService();

  it('builds a stable canonical payload and verifies its signature', () => {
    const canonical = service.canonical({
      method: 'post',
      pathWithQuery: '/api/v1/marketplace/catalog/events',
      timestamp: '1785312000',
      nonce: 'nonce-1',
      idempotencyKey: 'cmddv5t5n0001v8u0fmx2n8zq',
      bodyHash: service.hashBody('{"sequence":1}'),
    });
    const signature = service.sign('secret', canonical);

    expect(canonical.split('\n')).toHaveLength(6);
    expect(service.verify(signature, signature)).toBe(true);
    expect(service.verify(signature, '00')).toBe(false);
  });
});
