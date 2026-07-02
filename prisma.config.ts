// Prisma 7: file config mới thay thế `url` trong datasource block của schema.prisma
// Prisma 7: KHÔNG tự load .env — phải import dotenv thủ công

import { config as loadEnv } from 'dotenv';
import { defineConfig, env } from 'prisma/config';

// Prisma 7 không tự load .env — load theo NODE_ENV (mặc định: development)
loadEnv({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
