import { registerAs } from '@nestjs/config';

export default registerAs('salework', () => ({
  enabled: process.env.SALEWORK_ENABLED === 'true',
  stockReconciliationEnabled: process.env.SALEWORK_STOCK_RECONCILIATION_ENABLED === 'true',
  stockReconciliationCron: process.env.SALEWORK_STOCK_RECONCILIATION_CRON ?? '0 */2 * * * *',
  stockReconciliationLockTtlSeconds: Number(
    process.env.SALEWORK_STOCK_RECONCILIATION_LOCK_TTL_SECONDS ?? 110,
  ),
  clientId: process.env.SALEWORK_CLIENT_ID ?? '',
  token: process.env.SALEWORK_TOKEN ?? '',
  timeoutMs: Number(process.env.SALEWORK_TIMEOUT_MS ?? 10000),
  stockBaseUrl: process.env.SALEWORK_STOCK_BASE_URL ?? 'https://salework.net/api/open/stock/',
  bankingBaseUrl:
    process.env.SALEWORK_BANKING_BASE_URL ?? 'https://banking.salework.net/api/open/',
}));
