import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  minio: {
    endpoint: process.env.MINIO_ENDPOINT ?? '',
    region: process.env.MINIO_REGION ?? 'ap-southeast-1',
    accessKey: process.env.MINIO_ACCESS_KEY ?? '',
    secretKey: process.env.MINIO_SECRET_KEY ?? '',
    bucket: process.env.MINIO_MEDIA_BUCKET ?? '',
    forcePathStyle: process.env.MINIO_FORCE_PATH_STYLE !== 'false',
  },
}));
