# mhhome-api — Backend API for mhhome-admin pages and Zalo mini-app mhhome-app.

Backend dùng cho `mhhome-admin` và `mhhome-app`.

Chi tiết kiến trúc, flow, schema xem [`AGENTS.md`](./AGENTS.md).

## Yêu cầu

- Node.js >= 20.19.0 (Prisma 7 yêu cầu)
- **Yarn** (package manager dùng trong project này — KHÔNG dùng npm)
- Docker + Docker Compose (cho PostgreSQL + Redis)

## Stack

- NestJS 11 + TypeScript (ESM, strict mode)
- Prisma 7 + `@prisma/adapter-pg` (driver adapter bắt buộc)
- Redis 7 (ioredis + BullMQ)

## Môi trường (.env)

Project dùng 2 file env phân biệt theo `NODE_ENV`:

- `.env.development` — dev local (đã có sẵn, commit được)
- `.env.production` — prod (cần điền lại các giá trị `REPLACE_*` khi deploy)

File được load tự động dựa trên `NODE_ENV`:

- `yarn start:dev` → `NODE_ENV=development` → `.env.development`
- `yarn start:prod` → `NODE_ENV=production` → `.env.production`

Prisma CLI cũng đọc cùng cơ chế (`.env.$NODE_ENV`), nên khi chạy migrate/seed có thể prefix `NODE_ENV` để chọn env.

Feature flag theo từng dự án:

- `ELECTRONIC_INVOICE_ENABLED` — bật/tắt yêu cầu hóa đơn điện tử đồng thời cho app, website và admin; mặc định `false`.

Các biến SionHub dùng khi project này được đăng ký như một tenant ở `sion-hub`:

- `SION_HUB_URL` — base URL của SionHub, ví dụ `https://sion.example.com/api/v1`
- `SION_HUB_API_KEY` — tenant API key do SionHub cấp, gửi qua header `x-api-key`
- `SION_HUB_WEBHOOK_SECRET` — secret để verify webhook callback từ SionHub
- `SION_HUB_SERVICE_NAME` — tên record credential, mặc định `sion-hub`
- `SION_HUB_TIMEOUT_MS` — timeout khi gọi SionHub, mặc định `10000`

## Cài đặt lần đầu

```bash
# 1. Cài dependencies (dùng yarn, KHÔNG npm)
yarn install

# 2. Chạy PostgreSQL + Redis
docker compose up -d

# 3. Generate Prisma client (Prisma 7: phải chạy thủ công)
yarn prisma:generate

# 4. Apply schema migration
yarn prisma:migrate:dev --name init

# 5. Seed dữ liệu demo (tùy chọn)
yarn db:seed
```

## Chạy dev

```bash
yarn start:dev
```

- API: http://localhost:3000/api/v1
- Health check: http://localhost:3000/health
- Swagger docs: http://localhost:3000/docs (chỉ bật khi `NODE_ENV !== 'production'`)

## Lệnh thường dùng

```bash
yarn start:dev           # Dev server với watch
yarn build               # Build production
yarn start:prod          # Chạy bản build (NODE_ENV=production)
yarn lint                # ESLint fix
yarn test                # Jest unit test
yarn prisma:studio       # Mở Prisma Studio
yarn prisma:migrate:dev  # Tạo migration mới
yarn prisma:generate     # Regenerate client sau khi sửa schema
yarn db:seed             # Seed dữ liệu demo
```
