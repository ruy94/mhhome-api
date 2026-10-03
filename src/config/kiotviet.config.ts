import { registerAs } from '@nestjs/config';

export default registerAs('kiotviet', () => ({
  enabled: process.env.KIOTVIET_ENABLED === 'true',
  retailer: process.env.KIOTVIET_RETAILER?.trim() ?? '',
  clientId: process.env.KIOTVIET_CLIENT_ID?.trim() ?? '',
  clientSecret: process.env.KIOTVIET_CLIENT_SECRET ?? '',
  branchId: process.env.KIOTVIET_BRANCH_ID ? Number(process.env.KIOTVIET_BRANCH_ID) : null,
  apiBaseUrl: process.env.KIOTVIET_API_BASE_URL ?? 'https://public.kiotapi.com',
  tokenUrl: process.env.KIOTVIET_TOKEN_URL ?? 'https://id.kiotviet.vn/connect/token',
  requestTimeoutMs: Number(process.env.KIOTVIET_REQUEST_TIMEOUT_MS ?? 10000),
  stockSyncEnabled: process.env.KIOTVIET_STOCK_SYNC_ENABLED === 'true',
  stockPollSeconds: Number(process.env.KIOTVIET_STOCK_POLL_SECONDS ?? 120),
  stockStaleSeconds: Number(process.env.KIOTVIET_STOCK_STALE_SECONDS ?? 300),
  safetyStock: Number(process.env.KIOTVIET_SAFETY_STOCK ?? 0),
  autoWriteFrom: process.env.KIOTVIET_AUTO_WRITE_FROM
    ? new Date(process.env.KIOTVIET_AUTO_WRITE_FROM)
    : null,
  webhookEnabled: process.env.KIOTVIET_WEBHOOK_ENABLED === 'true',
  callbackUrl: process.env.KIOTVIET_CALLBACK_URL?.trim() ?? '',
  webhookRawSecret: process.env.KIOTVIET_WEBHOOK_SECRET?.trim() ?? '',
}));
