# mhhome-api — Backend API for MH Home  admin pages and Zalo mini-app.

## Project Overview

- Backend cho dự án MH Home : quản lý và bán thời trang, phụ kiện, giày dép cho giới trẻ.
- `mhhome-api` làm backend dùng chung cho `mhhome-admin` và `mhhome-app`.
- Các phần nền tảng đã có sẵn: `auth`, `admin`, `acl`, `health`, `common`, `config`, `prisma`, `redis`, logging, validation, Swagger, response/error format, SionHub provider client và webhook receiver.

## Architecture

```
mhhome-app   ─┐
                ├──> mhhome-api <── webhook/API ── sion-hub <──> Zalo
mhhome-admin ─┘
```

- `mhhome-app` là Zalo Mini App cho người dùng cuối, sẽ gọi nhóm endpoint public/app của `mhhome-api`.
- `mhhome-admin` là trang quản trị cho vận hành bán hàng, sẽ gọi nhóm endpoint admin của `mhhome-api`.
- `mhhome-api` là backend trung tâm, giữ business logic, auth/RBAC, database, cache, và API cho cả admin lẫn mini-app.
- `sion-hub` là integration/platform layer với Zalo. `mhhome-api` giao tiếp với `sion-hub` như một tenant, không quản trị tenant trực tiếp trong codebase này.
- Project tham khảo: `Documents/sion-hub`.

### mhhome-api boundary

- Các module nền tảng phải được giữ generic.
- `mhhome-api` sẽ được đăng ký như một **tenant** ở phía `sion-hub`.
- `mhhome-api` gọi sang `sion-hub` bằng `SionHubClientService`, header `x-api-key` lấy từ `ServiceCredential`/Redis cache/env bootstrap.
- `sion-hub` callback về `mhhome-api` qua `POST /webhook/from-provider`, ký bằng `x-sionhub-timestamp` + `x-sionhub-signature` (HMAC SHA-256).
- Không đưa module quản trị tenant của `sion-hub` vào `mhhome-api`; project này chỉ lưu credential của chính nó với tư cách tenant và cung cấp provider client/webhook receiver cho nghiệp vụ dùng lại.

## Tech Stack

- **Runtime**: Node.js >= 20.19.0 (bắt buộc bởi Prisma 7)
- **Package Manager**: **Yarn** (project dùng yarn, KHÔNG dùng npm — mọi lệnh cài/chạy đều qua `yarn`)
- **Framework**: NestJS (latest stable)
- **Language**: TypeScript (strict mode)
- **ORM**: Prisma 7 (PostgreSQL) — yêu cầu driver adapter `@prisma/adapter-pg`
- **Prisma Driver**: @prisma/adapter-pg + pg (bắt buộc từ Prisma 7)
- **Database**: PostgreSQL 16+
- **Cache**: Redis 7+ (standalone service, kết nối qua ioredis)
- **Queue**: BullMQ (backed by Redis) — xử lý async message processing
- **Reverse Proxy**: Nginx
- **Logger**: Winston (NestJS integration)
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger (@nestjs/swagger)
- **Testing**: Jest + Supertest

## CRITICAL: Prisma 7 Breaking Changes (so với v6)

Project này dùng **Prisma 7** — có nhiều thay đổi lớn so với v6. Claude Code PHẢI tuân thủ:

1. **Generator**: dùng `"prisma-client"` (KHÔNG phải `"prisma-client-js"`), PHẢI có `output` path
2. **datasource**: KHÔNG chứa `url` — URL được cấu hình trong `prisma.config.ts`
3. **prisma.config.ts**: file config BẮT BUỘC ở root project, chứa datasource URL và migration path
4. **Driver Adapter**: BẮT BUỘC dùng `@prisma/adapter-pg` + `pg` — PrismaClient không tự kết nối DB nữa
5. **Import path**: import từ `'../generated/prisma/client.js'` (KHÔNG phải `'@prisma/client'`)
6. **ESM**: package.json PHẢI có `"type": "module"` — Prisma 7 là ESM-only
7. **dotenv**: Prisma 7 KHÔNG tự load `.env` — phải `import 'dotenv/config'` trong prisma.config.ts
8. **CLI**: `prisma migrate dev` KHÔNG tự chạy `prisma generate` nữa — phải chạy thủ công
9. **Middleware**: đã bị xóa hoàn toàn — dùng Client Extensions thay thế
10. **TypeScript**: yêu cầu >= 5.4.0

## Project Structure

```
prisma.config.ts              # Prisma 7: config file (datasource URL, migrations path)
src/
├── app.module.ts
├── main.ts
├── common/
│   ├── decorators/
│   │   └── current-admin.decorator.ts         # @CurrentAdmin() param decorator
│   ├── guards/
│   │   └── webhook-signature.guard.ts     # Verify webhook-signature tới sion-hub
│   ├── interceptors/
│   │   └── logging.interceptor.ts       # Log request/response time
│   ├── filters/
│   │   └── global-exception.filter.ts
│   └── utils/              # All utils will place in here
│
├── modules/
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts         # Health check endpoint cho Nginx/uptime monitor
│
├── config/
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── env.validation.ts
│   └── redis.config.ts
│
├── generated/
│   └── prisma/                          # Prisma 7: auto-generated client (output path trong generator)
│       └── client.js                    # KHÔNG chỉnh sửa thủ công — chạy `yarn prisma:generate`
│
├── prisma/
│   └── prisma.service.ts               # PrismaClient wrapper với adapter (xem mẫu bên dưới)
│
└── prisma/                              # (root level)
    ├── schema.prisma
    └── migrations/
```

## Database Schema (Prisma)

```prisma
// prisma/schema.prisma
// Prisma 7: generator dùng "prisma-client" (không phải "prisma-client-js")
// Prisma 7: datasource KHÔNG chứa url — url được cấu hình trong prisma.config.ts

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}
```

### Prisma 7: prisma.config.ts (BẮT BUỘC — đặt ở root project)

```typescript
// prisma.config.ts
// Prisma 7: file config mới thay thế url trong datasource block
// Prisma 7: KHÔNG tự load .env — phải import dotenv thủ công

import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
});
```

### Prisma 7: PrismaClient instantiation (BẮT BUỘC dùng driver adapter)

```typescript
// src/prisma/prisma.service.ts
// Prisma 7: PHẢI tạo adapter trước, truyền vào PrismaClient
// Prisma 7: import từ output path đã khai báo trong generator, KHÔNG phải '@prisma/client'

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### Prisma 7: package.json — ESM required

```jsonc
{
  "type": "module", // Prisma 7 yêu cầu ESM
  "dependencies": {
    "@prisma/client": "^7.7.0",
    "@prisma/adapter-pg": "^7.7.0", // BẮT BUỘC từ Prisma 7
    "pg": "^8.16.0", // Driver PostgreSQL gốc
    "dotenv": "^16.0.0", // Prisma 7 không tự load .env
  },
  "devDependencies": {
    "prisma": "^7.7.0",
    "@types/pg": "^8.16.0",
  },
}
```

### Prisma 7: CLI Commands thay đổi

Project dùng **yarn** (không dùng npm). Các script đã được wrap trong `package.json`:

```bash
# Generate client (PHẢI chạy thủ công — Prisma 7 bỏ auto-generate sau migrate)
yarn prisma:generate

# Migrate (đọc URL từ prisma.config.ts, KHÔNG từ schema.prisma)
yarn prisma:migrate:dev --name init

# Seed (PHẢI chạy thủ công — Prisma 7 bỏ auto-seed sau migrate)
yarn db:seed

# Studio
yarn prisma:studio
```

Nếu cần gọi trực tiếp CLI: dùng `yarn prisma <args>` (tương đương `npx prisma`).

### Env files

- `.env.development` — dev local (mặc định khi `NODE_ENV=development` hoặc không set)
- `.env.production` — prod (điền các giá trị `REPLACE_*` khi deploy)
- File được load tự động theo `NODE_ENV` bởi `main.ts`, `prisma.config.ts`, `prisma/seed.ts`
- KHÔNG có `.env.example` — dev/prod đã tách sẵn

## Environment Variables (.env)

```bash
# Prisma 7: file .env KHÔNG được tự động load
# Phải import 'dotenv/config' trong prisma.config.ts và main.ts

# App
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:@Genesis1:1@localhost:5432/mhhome?schema=public

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging
LOG_LEVEL=info
```

## API Contract

- Global response format đi qua `TransformInterceptor`: non-list trả `{ statusCode, message, data }`; list trả `{ statusCode, message, data, meta }`.
- Admin endpoints dùng resource plural/kebab-case, ví dụ `users`, `products`, `flash-sales`, `zalo-videos`.
- Miniapp endpoints phải nằm dưới `miniapp/<plural-resource>` hoặc route lồng resource rõ ràng, ví dụ `miniapp/users/:userId/addresses`.
- Không dùng camelCase hoặc route có verb kiểu `getOrdersByUser`, `decodePhoneZalo`, `createMac`; dùng kebab-case/resource path như `users/:userId`, `decode-phone-zalo`, `create-mac`.
- Các endpoint trả danh sách phải nhận `PageOptionsDto` hoặc DTO extend từ `PageOptionsDto`, service trả `PageDto`/`PageMetaDto`. Nếu không truyền `limit`, trả tất cả records và `meta.limit = null`.
- Mọi endpoint admin cần quyền phải có `@RequirePermissions(...)`; mỗi permission mới phải được seed trong `prisma/seed.ts`.
- ZBS/Campaign/Billing giao tiếp SionHub qua `SionHubClientService`; không dùng lại `provider-client` cũ.

## Coding Conventions

- Tất cả code viết bằng TypeScript strict mode
- **ESM module** (package.json `"type": "module"`) — bắt buộc bởi Prisma 7
- Dùng NestJS decorators, dependency injection đúng chuẩn
- Mỗi module có folder riêng, không import chéo giữa các module (dùng NestJS module exports)
- **Prisma 7**: import PrismaClient từ `../generated/prisma/client.js` (KHÔNG từ `@prisma/client`)
- **Prisma 7**: luôn dùng driver adapter `PrismaPg` khi khởi tạo PrismaClient
- **Prisma 7 JSON fields**: `Record<string, unknown>` không gán trực tiếp được vào `InputJsonValue` — phải double-cast: `dto.metadata as unknown as Prisma.InputJsonObject | undefined`. Import `Prisma` từ `'../generated/prisma/client.js'`
- **Prisma IDs**: nếu model dùng `String` primary key thì mặc định dùng `@default(cuid())`, KHÔNG tự thêm `uuid()` trừ khi có yêu cầu tích hợp bên ngoài bắt buộc UUID.
- **Prisma mapping**: field camelCase phải map sang snake_case bằng `@map`, model phải có `@@map` tên bảng dạng snake_case số nhiều.
- **API route naming**: controller path cho resource CRUD phải dùng danh từ số nhiều, áp dụng cho cả admin side và miniapp side. Ví dụ: `users`, `products`, `miniapp/users`, `miniapp/products`.
- **API path style**: path segment phải dùng kebab-case/resource-style, không dùng camelCase hoặc verb route kiểu `getSomething`.
- **ACL seed**: mọi permission dùng trong `@RequirePermissions` phải có trong `prisma/seed.ts`; sau khi thêm module admin mới phải bổ sung permission seed tương ứng.
- **Pagination**: các endpoint `findAll` phải dùng `PageDto` và `PageMetaDto`, không tự build `meta` thủ công trong service. Response trả `{ items, meta }` với `meta: { total, page, limit, totalPages }`. Nếu client không truyền `limit`, không set `take/skip` cho Prisma để trả về toàn bộ records; khi đó `meta.limit = null` và `meta.totalPages = 1`.
- DTO validation bằng class-validator
- Error handling thống nhất qua global exception filter
- Async/await everywhere, không dùng callback
- Tên biến, hàm: camelCase. Tên class: PascalCase. Tên file: kebab-case
- Mỗi service method có JSDoc comment mô tả ngắn
- Environment variables truy cập qua ConfigService, không đọc process.env trực tiếp
- Test: mỗi service có unit test, mỗi controller có e2e test

## Implementation Priority

- Scaffold NestJS project, setup Prisma 7 + PostgreSQL + Redis + BullMQ
- Auth, Admin RBAC (JWT + HTTP cookie), ACL role permission
- Health check (DB + Redis + BullMQ) + Winston logging
- Swagger API docs hoàn chỉnh (`http://localhost:3000/docs`)

```

```
