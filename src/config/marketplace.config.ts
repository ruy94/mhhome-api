import { registerAs } from '@nestjs/config';

export default registerAs('marketplace', () => ({
  enabled: process.env.MARKETPLACE_ENABLED === 'true',
  checkoutEnabled: process.env.MARKETPLACE_CHECKOUT_ENABLED === 'true',
  baseUrl: process.env.MARKETPLACE_BASE_URL ?? '',
  shopCode: process.env.MARKETPLACE_SHOP_CODE ?? '',
  keyId: process.env.MARKETPLACE_KEY_ID ?? '',
  hmacSecret: process.env.MARKETPLACE_HMAC_SECRET ?? '',
  requestTimeoutMs: Number(process.env.MARKETPLACE_REQUEST_TIMEOUT_MS ?? 10000),
  hmacMaxSkewSeconds: Number(process.env.MARKETPLACE_HMAC_MAX_SKEW_SECONDS ?? 300),
  nonceTtlSeconds: Number(process.env.MARKETPLACE_NONCE_TTL_SECONDS ?? 600),
  reservationTtlSeconds: Number(process.env.MARKETPLACE_RESERVATION_TTL_SECONDS ?? 300),
  media: {
    imageBaseUrl: process.env.MARKETPLACE_MEDIA_IMAGE_BASE_URL ?? '',
    videoBaseUrl: process.env.MARKETPLACE_MEDIA_VIDEO_BASE_URL ?? '',
    thumbnailBaseUrl: process.env.MARKETPLACE_MEDIA_THUMBNAIL_BASE_URL ?? '',
  },
}));
