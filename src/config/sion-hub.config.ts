import { registerAs } from '@nestjs/config';

export default registerAs('sionHub', () => ({
  url: process.env.SION_HUB_URL ?? process.env.PROVIDER_URL ?? '',
  serviceName: process.env.SION_HUB_SERVICE_NAME ?? 'sion-hub',
  apiKey: process.env.SION_HUB_API_KEY ?? process.env.PROVIDER_API_KEY ?? '',
  webhookSecret: process.env.SION_HUB_WEBHOOK_SECRET ?? process.env.WEBHOOK_SECRET ?? '',
  timeoutMs: parseInt(process.env.SION_HUB_TIMEOUT_MS ?? '10000', 10),
}));
