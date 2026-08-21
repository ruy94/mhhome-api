import 'reflect-metadata';
import { validateEnv } from './env.validation.js';

const requiredEnv = {
  NODE_ENV: 'test',
  PORT: '3000',
  DATABASE_URL: 'postgresql://localhost/test',
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  ZALO_OA_ID: 'oa-id',
  ZALO_APP_SECRET_KEY: 'app-secret',
  CHECKOUT_SECRET_KEY: 'checkout-secret',
  ZALO_OPENAPIS_KEY: 'openapis-key',
};

const marketplaceEnv = {
  MARKETPLACE_BASE_URL: 'https://marketplace.example.com',
  MARKETPLACE_SHOP_CODE: 'shop-test',
  MARKETPLACE_KEY_ID: '37abf7a5-f24d-4ba7-9331-8bf0456ad528',
  MARKETPLACE_HMAC_SECRET: 'secret',
  MARKETPLACE_MEDIA_IMAGE_BASE_URL: 'https://media.example.com/images',
  MARKETPLACE_MEDIA_VIDEO_BASE_URL: 'https://media.example.com/videos',
  MARKETPLACE_MEDIA_THUMBNAIL_BASE_URL: 'https://media.example.com/thumbnails',
  SPX_SENDER_NAME: 'Shop Test',
  SPX_SENDER_PHONE: '0900000000',
  SPX_SENDER_STATE: 'Hồ Chí Minh',
  SPX_SENDER_CITY: 'Hồ Chí Minh',
  SPX_SENDER_DETAIL_ADDRESS: '123 Đường A',
};

const booleanKeys = [
  'ELECTRONIC_INVOICE_ENABLED',
  'SPX_ENABLED',
  'SALEWORK_ENABLED',
  'MARKETPLACE_ENABLED',
  'MARKETPLACE_CHECKOUT_ENABLED',
] as const;

describe('validateEnv boolean flags', () => {
  it.each(booleanKeys)('parses %s=false as boolean false', (key) => {
    const validated = validateEnv({ ...requiredEnv, [key]: 'false' });

    expect(validated[key]).toBe(false);
  });

  it.each(booleanKeys)('parses %s=true as boolean true', (key) => {
    const validated = validateEnv({
      ...requiredEnv,
      ...(key === 'MARKETPLACE_ENABLED' || key === 'MARKETPLACE_CHECKOUT_ENABLED'
        ? { ...marketplaceEnv, MARKETPLACE_ENABLED: 'true' }
        : {}),
      [key]: ' TRUE ',
    });

    expect(validated[key]).toBe(true);
  });

  it('keeps optional boolean flags undefined when omitted', () => {
    const validated = validateEnv(requiredEnv);

    expect(validated.ELECTRONIC_INVOICE_ENABLED).toBeUndefined();
    expect(validated.SPX_ENABLED).toBeUndefined();
    expect(validated.SALEWORK_ENABLED).toBeUndefined();
    expect(validated.MARKETPLACE_ENABLED).toBeUndefined();
    expect(validated.MARKETPLACE_CHECKOUT_ENABLED).toBeUndefined();
  });

  it('does not require MinIO for the local filesystem upload implementation', () => {
    expect(() => validateEnv(requiredEnv)).not.toThrow();
  });

  it.each(booleanKeys)('rejects an invalid %s value', (key) => {
    expect(() => validateEnv({ ...requiredEnv, [key]: 'enabled' })).toThrow(
      `${key} must be either "true" or "false"`,
    );
  });

  it.each(booleanKeys)('rejects an empty %s value', (key) => {
    expect(() => validateEnv({ ...requiredEnv, [key]: '' })).toThrow(
      `${key} must be either "true" or "false"`,
    );
  });

  it('requires Marketplace credentials and media URLs when enabled', () => {
    expect(() => validateEnv({ ...requiredEnv, MARKETPLACE_ENABLED: 'true' })).toThrow(
      'Missing Marketplace configuration',
    );
  });

  it('rejects Marketplace checkout when Marketplace is disabled', () => {
    expect(() =>
      validateEnv({
        ...requiredEnv,
        MARKETPLACE_ENABLED: 'false',
        MARKETPLACE_CHECKOUT_ENABLED: 'true',
      }),
    ).toThrow('MARKETPLACE_CHECKOUT_ENABLED requires MARKETPLACE_ENABLED=true');
  });
});
