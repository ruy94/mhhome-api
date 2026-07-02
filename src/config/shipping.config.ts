import { registerAs } from '@nestjs/config';

const resolveSpxBaseUrl = () => {
  if (process.env.SPX_BASE_URL) return process.env.SPX_BASE_URL;
  return process.env.SPX_ENV === 'live' ? 'https://spx.vn/' : 'https://test-stable.spx.vn/';
};

export default registerAs('shipping', () => ({
  spx: {
    enabled: process.env.SPX_ENABLED === 'true',
    baseUrl: resolveSpxBaseUrl(),
    appId: process.env.SPX_APP_ID ? Number(process.env.SPX_APP_ID) : 0,
    secretKey: process.env.SPX_SECRET_KEY ?? '',
    userId: process.env.SPX_USER_ID ? Number(process.env.SPX_USER_ID) : 0,
    userSecret: process.env.SPX_USER_SECRET ?? '',
    timeoutMs: Number(process.env.SPX_TIMEOUT_MS ?? 10000),
    addressVersion: Number(process.env.SPX_ADDRESS_VERSION ?? 0),
    serviceType: Number(process.env.SPX_SERVICE_TYPE ?? 1),
    collectType: Number(process.env.SPX_COLLECT_TYPE ?? 2),
    pickupTime: process.env.SPX_PICKUP_TIME ? Number(process.env.SPX_PICKUP_TIME) : undefined,
    pickupTimeRangeId: process.env.SPX_PICKUP_TIME_RANGE_ID ? Number(process.env.SPX_PICKUP_TIME_RANGE_ID) : undefined,
    pickupTimeRange: process.env.SPX_PICKUP_TIME_RANGE ?? '',
    paymentRole: Number(process.env.SPX_PAYMENT_ROLE ?? 1),
    highValueProcessingCollection: Number(process.env.SPX_HIGH_VALUE_PROCESSING_COLLECTION ?? 1),
    sender: {
      name: process.env.SPX_SENDER_NAME ?? '',
      phone: process.env.SPX_SENDER_PHONE ?? '',
      state: process.env.SPX_SENDER_STATE ?? '',
      city: process.env.SPX_SENDER_CITY ?? '',
      district: process.env.SPX_SENDER_DISTRICT ?? '',
      detailAddress: process.env.SPX_SENDER_DETAIL_ADDRESS ?? '',
      longitude: process.env.SPX_SENDER_LONGITUDE ?? '',
      latitude: process.env.SPX_SENDER_LATITUDE ?? '',
    },
  },
}));
