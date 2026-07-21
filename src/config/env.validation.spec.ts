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

const booleanKeys = ['ELECTRONIC_INVOICE_ENABLED', 'SPX_ENABLED', 'SALEWORK_ENABLED'] as const;

describe('validateEnv boolean flags', () => {
  it.each(booleanKeys)('parses %s=false as boolean false', (key) => {
    const validated = validateEnv({ ...requiredEnv, [key]: 'false' });

    expect(validated[key]).toBe(false);
  });

  it.each(booleanKeys)('parses %s=true as boolean true', (key) => {
    const validated = validateEnv({ ...requiredEnv, [key]: ' TRUE ' });

    expect(validated[key]).toBe(true);
  });

  it('keeps optional boolean flags undefined when omitted', () => {
    const validated = validateEnv(requiredEnv);

    expect(validated.ELECTRONIC_INVOICE_ENABLED).toBeUndefined();
    expect(validated.SPX_ENABLED).toBeUndefined();
    expect(validated.SALEWORK_ENABLED).toBeUndefined();
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
});
