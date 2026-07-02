import { registerAs } from '@nestjs/config';

export default registerAs('zalo', () => ({
  oaID: process.env.ZALO_OA_ID ?? '',
  appSecretKey: process.env.ZALO_APP_SECRET_KEY ?? '',
  checkoutSecretKey: process.env.CHECKOUT_SECRET_KEY ?? '',
  openapisKey: process.env.ZALO_OPENAPIS_KEY ?? '',
}));
