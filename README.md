# mhhome-api — Backend API for mhhome-admin pages and Zalo mini-app mhhome-app.

Backend dùng cho `mhhome-admin` và `mhhome-app`.

Chi tiết kiến trúc, flow, schema xem [`AGENTS.md`](./AGENTS.md).

**Chuyển dữ liệu VPS:** làm theo [runbook migration](ops/migration/README.md).
**Copy tính năng từ cuahanggiadungmng:** xem [quy tắc rsync và ngoại lệ](ops/sync/README.md).
Production dùng common-infra (PostgreSQL/Redis/MinIO), API image trên GHCR;
admin/website là các static release. KiotViet chưa nằm trong đợt chuyển này.

## Yêu cầu

- Node.js >= 20.19.0 (Prisma 7 yêu cầu)
- **Yarn** (package manager dùng trong project này — KHÔNG dùng npm)
- Docker + Docker Compose (cho PostgreSQL + Redis + MinIO); CI/image dùng Node 22

## Stack

- NestJS 11 + TypeScript (ESM, strict mode)
- Prisma 7 + `@prisma/adapter-pg` (driver adapter bắt buộc)
- Redis 7 (ioredis + BullMQ)

## Môi trường (.env)

Project dùng 2 file env phân biệt theo `NODE_ENV`:

- `.env.development` — dev local, không commit
- `.env.production` — runtime production, không commit; giữ secrets riêng của MH Home

File được load tự động dựa trên `NODE_ENV`:

- `yarn start:dev` → `NODE_ENV=development` → `.env.development`
- `NODE_ENV=production yarn start:prod` → `.env.production` (image đã đặt NODE_ENV)

Prisma CLI cũng đọc cùng cơ chế (`.env.$NODE_ENV`), nên khi chạy migrate/seed có thể prefix `NODE_ENV` để chọn env.

Feature flag theo từng dự án:

- `ELECTRONIC_INVOICE_ENABLED` — bật/tắt yêu cầu hóa đơn điện tử đồng thời cho app, website và admin; mặc định `false`.

Upload hiện dùng MinIO ở cả dev và production: cấu hình `MINIO_ENDPOINT`,
`MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_MEDIA_BUCKET`, region và path style.
Dev chạy từ host dùng endpoint/port host; container production dùng `minio-all:9000`.
Tham khảo `ops/migration/runtime.env.template`, nhưng dùng DB/bucket/prefix **dev riêng**,
không trỏ môi trường phát triển vào dữ liệu production hoặc env còn sót từ shop khác.
Media chỉ tạm nằm trong `UPLOAD_TEMP_DIR`, mặc định `/tmp/mhhome-api/uploads`.

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

# 2. Khởi tạo PostgreSQL/Redis/MinIO dev và điền .env.development riêng.
# Hạ tầng thuộc repo common-infra; repo API không tạo container DB.

# 3. Generate Prisma client (Prisma 7: phải chạy thủ công)
yarn prisma:generate

# 4. Chỉ với DB dev trống: apply lịch sử migration đã có
yarn prisma:migrate:deploy

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
NODE_ENV=production yarn start:prod # Chạy bản build production
yarn lint                # ESLint fix
yarn test                # Jest unit test
yarn prisma:studio       # Mở Prisma Studio
yarn prisma:migrate:dev  # Tạo migration mới
yarn prisma:generate     # Regenerate client sau khi sửa schema
yarn db:seed             # Seed dữ liệu demo
```
