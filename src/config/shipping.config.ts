import { registerAs } from '@nestjs/config';

const resolveSpxBaseUrl = () => {
  if (process.env.SPX_BASE_URL) return process.env.SPX_BASE_URL;
  return process.env.SPX_ENV === 'live' ? 'https://spx.vn/' : 'https://test-stable.spx.vn/';
};

const resolveVtpBaseUrl = () => {
  if (process.env.VTP_BASE_URL) return process.env.VTP_BASE_URL;
  return process.env.VTP_ENV === 'live'
    ? 'https://partner.viettelpost.vn/'
    : 'https://partnerdev.viettelpost.vn/';
};

const resolveVtpPrintBaseUrl = () => {
  if (process.env.VTP_PRINT_BASE_URL) return process.env.VTP_PRINT_BASE_URL;
  return process.env.VTP_ENV === 'live'
    ? 'https://digitalize.viettelpost.vn/'
    : 'https://dev-release-print.viettelpost.vn/';
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
    pickupTimeRangeId: process.env.SPX_PICKUP_TIME_RANGE_ID
      ? Number(process.env.SPX_PICKUP_TIME_RANGE_ID)
      : undefined,
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
  vtp: {
    enabled: process.env.VTP_ENABLED === 'true',
    baseUrl: resolveVtpBaseUrl(),
    username: process.env.VTP_USERNAME ?? '',
    password: process.env.VTP_PASSWORD ?? '',
    timeoutMs: Number(process.env.VTP_TIMEOUT_MS ?? 10000),
    webhookSecret: process.env.VTP_WEBHOOK_SECRET ?? '',
    printBaseUrl: resolveVtpPrintBaseUrl(),
    printLabelType: process.env.VTP_PRINT_LABEL_TYPE ?? 'a6_1',
    printShowPostage: process.env.VTP_PRINT_SHOW_POSTAGE === 'true',
    printExpirySeconds: Number(process.env.VTP_PRINT_EXPIRY_SECONDS ?? 900),
    sender: {
      name: process.env.VTP_SENDER_NAME ?? '',
      phone: process.env.VTP_SENDER_PHONE ?? '',
      address: process.env.VTP_SENDER_ADDRESS ?? '',
    },
  },
}));
