# Chuyển MH Home sang common-infra

Chạy trên **VPS của MH Home**, sau khi đã dừng mọi nguồn ghi của MH Home.
Các lệnh dưới đây không chuyển dữ liệu từ VPS cuahanggiadungmng. Ba repo nguồn và
common-infra không được sửa trong đợt này. Nghiệp vụ KiotViet chưa được đưa vào MH Home; seed có tên quyền như nguồn.

## 0. Đọc trước và chuẩn bị

- Runtime API mới: `/srv/commerce/mhhome-api`, container port 3000, host
  `127.0.0.1:50006`. Nginx vẫn ở host. Admin/website là static releases.
- PostgreSQL đích: `postgres-all`, DB `mhhome`. Redis đích: `redis-all`, DB 6,
  key prefix `mhhome:prod:`, queue prefix `mhhome-prod`. Bucket: `mhhome-media`.
- Bạn tự dựng common-infra tại `/opt/common-infra`. Xác nhận DB 6, DB `mhhome`,
  bucket và các tên trên chưa thuộc shop khác. Đảm bảo đủ dung lượng cho dữ liệu
  cũ + backup + dữ liệu mới; giữ nguyên dịch vụ cũ phục vụ các shop chưa chuyển.
- VPS hiện có PostgreSQL **14.23:5432** và Redis **6379** dùng chung cho nhiều
  dự án. Khi chuyển riêng MH Home, giữ hai dịch vụ này nguyên trạng; common-infra
  publish **5433/6380** trên loopback. Không dừng dịch vụ hoặc đổi mật khẩu cũ.
- Chỉ sau khi mọi dự án đã chuyển, thực hiện [bước 9](#9-chuyển-port-common-infra-về-54326379-sau-khi-tất-cả-dự-án-đã-migrate).
  Được phép dừng runtime khi làm bước cuối; không yêu cầu chuyển không gián đoạn.
- Dùng Node 22, Yarn, Docker/Compose v2, `pg_dump`/`pg_restore`/`psql` **16**,
  tar, sha256sum. Nếu PostgreSQL nguồn mới hơn 16: dừng quy trình này, không
  restore xuống 16 một cách mù quáng. Client 16 đọc được server nguồn 14;
  kiểm tra cả `pg_dump --version`, `pg_restore --version`, `psql --version`
  trước khi chạy. Phiên bản server trong `SELECT version()` không xác nhận
  phiên bản các công cụ này.
- GitHub của cả ba repo cần secrets `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`.
  User deploy cần quyền Docker và quyền ghi thư mục runtime/static. API workflow
  push image lên GHCR với `GITHUB_TOKEN`; package private phải cấp quyền đúng repo.

### Hai giai đoạn và bảng theo dõi dự án

| Kết nối | Chuyển dần từng dự án | Sau khi chuyển hết |
|---|---|---|
| PostgreSQL cũ trên VPS | Giữ `5432` | Dừng, tắt tự khởi động |
| Redis cũ trên VPS | Giữ `6379` | Dừng, tắt tự khởi động |
| Host → postgres-all | `127.0.0.1:5433` | `127.0.0.1:5432` |
| Host → redis-all | `127.0.0.1:6380` | `127.0.0.1:6379` |
| API Docker → PostgreSQL | `postgres-all:5432` | Không đổi |
| API Docker → Redis | `redis-all:6379` | Không đổi |

Trước khi dựng common-infra, kiểm tra port tạm chưa có listener:

```bash
sudo ss -ltnp '( sport = :5433 or sport = :6380 )'
```

Nếu có listener, dừng để xác định chủ sở hữu, không kill hoặc đổi port dịch vụ đó.
Trong `/opt/common-infra/.env.production` đặt **trước khi chạy Compose**:

```dotenv
POSTGRES_HOST_PORT=5433
REDIS_HOST_PORT=6380
```

Không để shell export hai biến này với giá trị khác vì shell có thể ghi đè env-file.
Operator dump nguồn dùng `LEGACY_PGPORT=5432`; URL đích dùng `5433`. Công cụ Redis
chạy trên host dùng `6380` với password/DB đích; container API dùng template runtime.
Không dùng `localhost:5432` để kiểm tra DB mới trong giai đoạn này.

Lưu bảng sau ở hồ sơ vận hành ngoài Git, thêm đủ mọi dự án và worker/cron của nó.
Không ghi password trong bảng. Chỉ đánh dấu xong sau đối soát dữ liệu và chạy thử.

| Dự án | Runtime/worker/cron và cách dừng/mở | DB đích | Redis DB/prefix/queue | Bucket | Endpoint đang dùng | Đối soát/xong |
|---|---|---|---|---|---|---|
| MH Home | mhhome-api; worker trong API; ghi thêm cron thực tế | mhhome | 6 / mhhome:prod: / mhhome-prod | mhhome-media | Ghi nguồn cũ hoặc Docker mới | Chưa xác nhận |
| Từng dự án khác | Điền runtime thực tế | Điền | Điền | Điền | Điền | Chưa xác nhận |

Làm trên một checkout MH Home đã chứa thay đổi này, ví dụ:

```bash
cd /home/duy-zalo/mhhome-api
yarn install --frozen-lockfile --non-interactive --production=false
umask 077
export MHHOME_BACKUP="/opt/backups/mhhome-migration-$(date +%Y%m%d-%H%M%S)"
sudo install -d -m 700 -o "$(id -un)" -g "$(id -gn)" "$MHHOME_BACKUP"
cp ops/migration/operator.env.template "$MHHOME_BACKUP/operator.secrets"
chmod 600 "$MHHOME_BACKUP/operator.secrets"
nano "$MHHOME_BACKUP/operator.secrets"
set -a
. "$MHHOME_BACKUP/operator.secrets"
set +a
```

Thay mọi `REPLACE_*`, `OLD_*`, `NEW_*`, mật khẩu trong file operator. File này là
shell config do bạn chuẩn bị, **không phải `.env.production` của Nest/Vite**.
Không `source` trực tiếp dotenv cũ: các giá trị có khoảng trắng có thể không phải
shell syntax hợp lệ.
Không đưa file operator, dump hoặc báo cáo có dữ liệu riêng vào Git.

Giữ cửa sổ terminal này và biến `MHHOME_BACKUP` trong toàn bộ quy trình. Nếu mở
terminal khác, đặt lại đường dẫn backup cụ thể; không tạo lại backup root mới rồi
vô tình dùng nhầm dữ liệu.

Trước khi push thay đổi, vào GitHub Actions của cả ba repo MH Home và tạm
**Disable workflow** deploy, hủy các lượt deploy đang chờ. Workflow giống nguồn,
không có marker migration và không tự backup/chuyển dữ liệu cũ. Chỉ bật lại khi
DB/media/env đã sẵn sàng ở bước 6; không thay workflow của dự án khác.

## 1. Dừng ghi và lưu hệ thống cũ

Chặn traffic ghi và webhook tới MH Home ở Nginx/maintenance. Cho worker cũ hoàn
tất video đang xử lý, xác nhận video/thumbnail đã tồn tại trước khi dừng app và
chốt backup. Không chuyển queue Redis; job chưa hoàn tất sẽ không tự chạy lại.
Nếu không hoàn tất được, giữ file gốc trong backup và xử lý trước khi mở traffic.
Dừng đúng app
`mhhome-pm2`, worker khác của MH Home nếu có; giữ nguyên các shop khác:

```bash
pm2 stop mhhome-pm2
pm2 save
```

Ghi lại commit/image đang chạy, trạng thái PM2, cấu hình Nginx, env đang chạy của
API/admin/website. Sao lưu từ **runtime cũ thực tế**, không lấy một bản env local
không biết đã đồng bộ hay chưa. Ví dụ:

```bash
cp -p .env.production "$MHHOME_BACKUP/api.env.production"
git rev-parse HEAD > "$MHHOME_BACKUP/api-checkout-revision.txt"
pm2 describe mhhome-pm2 > "$MHHOME_BACKUP/pm2.txt"
sudo tar -C /etc -czf "$MHHOME_BACKUP/nginx-before.tar.gz" nginx
sudo tar -C /var/www -czf "$MHHOME_BACKUP/uploads-before.tar.gz" mhhome-uploads
```

Lưu cả output static cũ và commit/config của website container; checkout Git có
thể đã mới hơn code đang chạy nên cần ghi riêng phiên bản runtime. Bản PM2 config
cũ nằm trong Git trước commit migration. Không chạy `pm2 restart all`.

Kiểm tra phiên bản nguồn và dump chỉ DB MH Home (PGPASSWORD là giá trị chưa URL-encode):

```bash
PGHOST="$LEGACY_PGHOST" PGPORT="$LEGACY_PGPORT" PGUSER="$LEGACY_PGUSER" \
  PGPASSWORD="$LEGACY_PGPASSWORD" psql -d mhhome -Atc 'SHOW server_version;'
pg_dump --version
(
  set -C
  PGHOST="$LEGACY_PGHOST" PGPORT="$LEGACY_PGPORT" PGUSER="$LEGACY_PGUSER" \
    PGPASSWORD="$LEGACY_PGPASSWORD" pg_dump -d mhhome -Fc \
    > "$MHHOME_BACKUP/mhhome.dump"
)
pg_restore --list "$MHHOME_BACKUP/mhhome.dump" > "$MHHOME_BACKUP/dump-contents.txt"
sha256sum "$MHHOME_BACKUP/mhhome.dump" "$MHHOME_BACKUP/uploads-before.tar.gz" \
  > "$MHHOME_BACKUP/SHA256SUMS"
```

Chỉ tiếp tục khi từng lệnh thành công; file tồn tại không đồng nghĩa dump đầy đủ.
`set -C` ngăn ghi đè backup cùng tên. Nếu dump lỗi, giữ lại để chẩn đoán và tạo
backup mới có tên khác. Sao chép bản backup thành công ra storage ngoài VPS.

Kiểm kê chính xác DB và files khi toàn bộ writer đã dừng:

```bash
MIGRATION_DATABASE_URL="$LEGACY_DATABASE_URL" yarn node scripts/migration/database.mjs \
  snapshot --output "$MHHOME_BACKUP/db-before.json"
yarn node scripts/migration/media.mjs inventory \
  --root /var/www/mhhome-uploads --manifest "$MHHOME_BACKUP/media.json"
```

Các báo cáo được tạo với quyền 600 và không ghi đè file cũ. DB snapshot chứa count,
hash toàn bộ nội dung mỗi bảng và sequence, không chứa raw row.
`input-videos` được kiểm kê/backup nhưng không xuất bản thành media.

## 2. Provision MH Home trong common-infra

```bash
cp ops/migration/mhhome.env.template /opt/common-infra/projects/mhhome.env
chmod 600 /opt/common-infra/projects/mhhome.env
nano /opt/common-infra/projects/mhhome.env
cd /opt/common-infra
scripts/provision-project.sh projects/mhhome.env
```

`PROJECT_DB_PASSWORD` phải là password PostgreSQL common-infra đang dùng:
script provision có `ALTER ROLE`, không nhập password cũ tùy ý vào account dùng chung.
Các bước ứng dụng sau đây giả định account `postgres`, đúng mô hình common-infra hiện tại.
Nếu bạn dùng role riêng, provision/restore với đúng owner và privileges tương ứng.

MinIO CORS nằm ở `.env.production` của common-infra. **Bổ sung vào danh sách hiện có**
các origin `https://mhhome.shop`, `https://www.mhhome.shop`,
`https://admin.mhhome.shop`, `https://www.admin.mhhome.shop`,
`https://media.mhhome.shop`, `https://h5.zdn.vn`; không thay danh sách của shop khác.
Nếu có đổi CORS, áp dụng chỉ MinIO theo `common-infra/OPERATIONS.md`, không restart
PostgreSQL/Redis. Không chạy `mc cors set` trên image MinIO Community này.

## 3. Restore DB vào database trống

Kiểm tra đích là DB **mhhome trong container**, chưa có bảng ứng dụng:

```bash
cd /opt/common-infra
docker compose --env-file .env.production exec -T postgres-all \
  psql -U postgres -d mhhome -Atc \
  "SELECT count(*) FROM pg_tables WHERE schemaname = 'public';"
```

Kết quả phải là `0`. Nếu khác 0, dừng và xác định dữ liệu nào đang tồn tại;
không thêm `--clean`, không reset/migrate trước restore.

```bash
docker compose --env-file .env.production exec -T postgres-all \
  pg_restore -U postgres -d mhhome --no-owner --no-acl --exit-on-error \
  --single-transaction < "$MHHOME_BACKUP/mhhome.dump"
cd /home/duy-zalo/mhhome-api
MIGRATION_DATABASE_URL="$TARGET_DATABASE_URL" yarn node scripts/migration/database.mjs \
  snapshot --output "$MHHOME_BACKUP/db-restored.json"
yarn node scripts/migration/database.mjs compare \
  --before "$MHHOME_BACKUP/db-before.json" --after "$MHHOME_BACKUP/db-restored.json"
NODE_ENV=production DATABASE_URL="$TARGET_DATABASE_URL" yarn prisma migrate status
```

Phải khớp count, content hash, sequences, cả `_prisma_migrations`. 21 migration
và schema của MH Home được giữ nguyên trong đợt refactor; không có migration
KiotViet. Nếu status báo thiếu/failed migration hoặc drift từ dữ liệu thực tế,
dừng để đối chiếu lịch sử; không dùng `migrate reset`, `db push`, hay tùy tiện
`migrate resolve`. Kiểm tra thêm tổng tiền đơn, tồn kho và công nợ theo báo cáo đang dùng.

## 4. Chuyển uploads vào MinIO

Tool gửi file qua S3 API tới bucket `mhhome-media`. Service `minio-all` lưu object
vào `/data`, được mount từ named volume `minio_data_all` của common-infra trên
VPS MH Home (tên volume thực tế có thể có tiền tố Compose). Không copy file trực
tiếp vào cấu trúc nội bộ volume. Đây là cùng mô hình lưu trữ với cuahanggiadungmng.

```bash
yarn node scripts/migration/media.mjs copy \
  --root /var/www/mhhome-uploads --manifest "$MHHOME_BACKUP/media.json"
yarn node scripts/migration/media.mjs copy --apply \
  --root /var/www/mhhome-uploads --manifest "$MHHOME_BACKUP/media.json"
yarn node scripts/migration/media.mjs verify \
  --root /var/www/mhhome-uploads --manifest "$MHHOME_BACKUP/media.json"
```

Lệnh đầu là dry-run. Ảnh ở gốc → `images/`, `videos/` → `videos/`,
`thumbnails/` → `thumbnails/`. Đối chiếu lại **nội dung GET thực tế** với SHA-256,
không dùng ETag làm checksum. Content-Type được nhận diện từ file. Có thể chạy lại:
object giống nhau được bỏ qua, object khác nội dung/header sẽ báo lỗi và không ghi đè.
Tool không xóa file nguồn; thay đổi cây file sau inventory sẽ chặn copy.

File có Content-Type `application/octet-stream` cần kiểm tra thực tế trước khi mở
shop. Thư mục lạ/symlink bị chặn, không bị tự bỏ qua. File thiếu từ trước hoặc job
upload chưa hoàn tất phải được xử lý/đối soát; công cụ không tự tạo dữ liệu thay thế.

Đối chiếu media DB và xem những đường dẫn tương đối cần chuẩn hóa:

```bash
MIGRATION_DATABASE_URL="$TARGET_DATABASE_URL" yarn node scripts/migration/database.mjs \
  media --manifest "$MHHOME_BACKUP/media.json" --output "$MHHOME_BACKUP/media-db-preview.json"
```

Đọc report: phải không còn `missing`/`invalid`. Report cũng kiểm tra URL cũ nhúng
trong HTML/JSON; external URL ngoài domain MH Home được giữ nguyên và cần smoke-test
nếu shop phụ thuộc vào chúng. Nếu có `changes`, sau khi xem mapping trước/sau:

```bash
MIGRATION_DATABASE_URL="$TARGET_DATABASE_URL" yarn node scripts/migration/database.mjs \
  media --manifest "$MHHOME_BACKUP/media.json" \
  --output "$MHHOME_BACKUP/media-db-applied.json" --apply
```

Chỉ cập nhật trường media đã nhận diện, trong một transaction, và ghi mapping
trước khi thay đổi. Bare filename, URL tuyệt đối, HTML và JSON giữ nguyên. Không
replace domain hàng loạt. Chạy lại audit với report tên mới: `changes` phải là 0.
Sau normalization, hash các bảng đã đổi đường dẫn đương nhiên khác snapshot cũ;
đối chiếu đúng mapping, không bỏ qua chênh lệch ở các bảng không liên quan.

## 5. Redis khởi tạo mới

Không export/import Redis cũ, không chuyển cache, token blacklist hoặc BullMQ job.
Dùng DB 6/prefix `mhhome:prod:`/queue prefix `mhhome-prod` dành riêng cho MH Home.
Trước khi khởi động API, kiểm tra DB này trống bằng `DBSIZE` (đúng host, password
và DB 6). Nếu đã có dữ liệu, xác định chủ sở hữu trước; không tự flush để tiếp tục.
Không dùng `FLUSHALL` trên Redis dùng chung. Giữ dịch vụ Redis cũ cho rollback.
API/worker sẽ tự tạo dữ liệu mới; job cũ không được phục hồi từ database.

Notification realtime hiện giống nguồn: dùng kênh `admin:notifications` chung.
Redis DB/key prefix không cô lập Pub/Sub; các shop trên cùng instance có thể nhận
chung sự kiện. Đây là hạn chế đã biết của nguồn, không phải do thiếu migration Redis.

## 6. Runtime env, Nginx và deploy

Tạo thư mục với đúng user deploy (`duy-zalo` chỉ là ví dụ user hiện tại):

```bash
sudo install -d -o duy-zalo -g duy-zalo /srv/commerce/mhhome-api \
  /var/www/mhhome-admin/releases /var/www/mhhome-website/releases
cp "$MHHOME_BACKUP/api.env.production" /srv/commerce/mhhome-api/.env.production
chmod 600 /srv/commerce/mhhome-api/.env.production
nano /srv/commerce/mhhome-api/.env.production
cp docker-compose.prod.yml /srv/commerce/mhhome-api/docker-compose.prod.yml
```

Áp dụng các giá trị trong `runtime.env.template` vào bản env vừa copy. Dùng Docker
hostnames ở đây; giữ JWT, checkout key, credential tích hợp và feature flag của
MH Home. Điền Redis password nếu common-infra có cấu hình. Cập nhật các URL
`MARKETPLACE_MEDIA_*` thành MH Home: bản env local cũ đã có URL của shop khác,
không nên xem nó là nguồn đúng cho dữ liệu production.

Frontend `.env.production` trong hai repo đã dùng MinIO MH Home và giữ thương hiệu.
Các biến này là **build-time** với Vite/Nuxt static; đổi env trên VPS không thay
được bundle cũ. Rebuild frontend sau khi API hoạt động.

Nginx:

1. Cho `media.mhhome.shop` trỏ về VPS này; giữ API/admin/website ở VPS hiện tại.
2. Cấp certificate gồm `mhhome.shop`, `www.mhhome.shop`, `admin.mhhome.shop`,
   `www.admin.mhhome.shop`, `server.mhhome.shop`, `media.mhhome.shop`. Template dùng
   `/etc/letsencrypt/live/mhhome.shop/`; sửa đường dẫn nếu certificate của bạn tên khác.
3. Dùng `ops/nginx/mhhome.conf` làm cấu hình HTTPS mới. Template giữ đường dẫn media
   cũ ở API domain và chuyển đến MinIO; hỗ trợ Range request cho video.
4. Tắt block Nginx cũ trùng `server_name` trước khi bật block mới. Không xóa backup.
   Root static mới cần có release và symlink trước khi mở website/admin.
5. Chạy `sudo nginx -t`, rồi `sudo systemctl reload nginx`.

Không cài template HTTPS trước khi có certificate. Giữ maintenance của traffic
ghi trong thời gian kiểm tra; route media có thể kiểm tra độc lập API.

Sau khi DB/media đã đối soát và Redis mới sẵn sàng, bật lại workflow **API**.
Push code lên main hoặc rerun một workflow run của đúng commit cần triển khai.
Workflow build image, chạy `prisma migrate deploy`, **seed**, rồi `compose up -d`
giống nguồn. Không chờ health tự động; kiểm tra health/log thủ công trước khi mở.

Seed giữ `specialAdmins` MH Home. Tài khoản tồn tại không bị đổi password; seed
có thể tạo tài khoản mặc định còn thiếu, thêm quyền/liên kết role và xóa cache quyền.
Có cả quyền SaleWork và tên quyền KiotViet; không triển khai module KiotViet.
Đối chiếu snapshot restore **trước seed**, không so hash DB sau seed với DB cũ
rồi tự coi thay đổi quyền/tài khoản là mất dữ liệu.

```bash
cd /srv/commerce/mhhome-api
# Điền đúng image:commit từ build/run GitHub; workflow không ghi current-image.txt.
export API_IMAGE='ghcr.io/REPLACE_OWNER/mhhome-api:REPLACE_COMMIT_SHA'
docker compose --env-file .env.production -f docker-compose.prod.yml ps
curl --fail http://127.0.0.1:50006/health
docker compose --env-file .env.production -f docker-compose.prod.yml logs --tail=100 mhhome-api
docker inspect mhhome_api --format '{{.Config.Image}}'
```

Ghi lại image đã chạy vào hồ sơ triển khai/backup cho rollback. Chỉ sau khi API
đã kiểm tra, bật lại workflow admin/website và push/rerun đúng commit. Chờ release/
symlink tồn tại rồi áp dụng root Nginx mới. Lần đầu theo thứ tự API → admin/website.
Không có file marker nào cần tạo; việc bật workflow do người vận hành kiểm soát.

## 7. Kiểm tra trước khi mở sử dụng

- Count/hash/sequence và migration đã khớp **trước** normalization và seed.
- `media verify` thành công; audit DB không thiếu file/đường dẫn chưa hiểu.
- Cùng một ảnh có nội dung giống nhau qua URL cũ `/public/images/...` và URL mới
  `/mhhome-media/images/...`; video cũ/mới GET với `Range: bytes=0-15` trả 206.
- Kiểm tra admin, website và mini-app đang phát hành; ảnh trong mô tả HTML,
  variant/review/banner, video và thumbnail. Không cần đổi mini-app để URL cũ hoạt động.
- Đăng nhập bằng tài khoản có sẵn, quyền, giỏ hàng và nghiệp vụ giữ nguyên. Dùng
  dữ liệu test cô lập cho thao tác tạo/sửa/xóa, không gửi đơn thử ra hãng vận chuyển
  hoặc provider thật. Kiểm tra notification hoạt động; không tuyên bố kênh đã cô lập giữa các shop.
- `/health` chỉ xác nhận DB/Redis; upload ảnh/video thử và quan sát job là bước
  riêng để kiểm tra MinIO/BullMQ thực sự. Chưa xem health là bằng chứng media tốt.

Dùng video dài hơn 3 giây cho smoke test upload/nén/thumbnail/xóa. Bản nguồn
lấy frame tại giây 3, clip ngắn có thể lỗi upload hoặc stream khi thiếu thumbnail.
Hai file media giữ nguyên nguồn theo yêu cầu; lỗi này còn tồn tại, không tính pass.
Ảnh/video cũ đã có file và thumbnail vẫn được chuyển/kiểm tra checksum bình thường.
Giữ toàn bộ backup DB/uploads, bao gồm input-videos, trong suốt quá trình xác minh.

Mở traffic khi kiểm tra hoàn tất. Bổ sung backup thường kỳ bằng script hiện có
`common-infra/scripts/backup-project.sh projects/mhhome.env`; thêm lịch riêng cho
MH Home mà không ghi đè cron shop khác. Giữ bản migration gốc ngoài retention
tự động và đồng bộ ra nơi lưu ngoài VPS.

Sau khi Nginx đã phục vụ website từ release mới, dừng container website cũ và
tắt auto-restart của đúng container đó, giữ lại để rollback:

```bash
docker update --restart=no mhhome_website
docker stop mhhome_website
```

Nếu tên container thực tế khác, dùng tên đã ghi ở bước 1. Không dừng container
PostgreSQL/Redis của các shop cũ khác.

## 8. Rollback

**Trước khi nhận ghi mới:** dừng container API mới, pause traffic, trả Nginx/root
static về bản đã sao lưu, khởi động đúng phiên bản PM2 cũ với DB/Redis/uploads cũ.
Kiểm tra rồi mở lại. Không xóa volume hoặc dữ liệu đích để rollback.

**Sau khi nhận ghi mới:** trước hết dừng ghi và backup DB/MinIO/Redis mới. Không
trỏ về snapshot cũ vì sẽ bỏ mất phần phát sinh. Ưu tiên rollback code tương thích
trên cùng DB mới; việc quay về filesystem cũ cần xuất lại toàn bộ media mới và
đối soát DB/queue theo trạng thái hiện tại.

Static release rollback dùng symlink tạm rồi `mv -Tf` như workflow; giữ current
và previous release. API rollback dùng image commit trước, export `API_IMAGE`
đúng tag rồi `compose up --wait`. Chỉ rollback code sau khi xác nhận schema tương
thích. Không dùng `docker compose down -v`, `volume rm`, `system prune --volumes`.

## Kiểm thử tooling tại máy phát triển

```bash
yarn node --test scripts/migration/*.test.mjs
RUN_MIGRATION_INTEGRATION=1 yarn node --test scripts/migration/*.test.mjs
```

Dòng thứ hai dùng Docker dựng các container riêng tên `mhhome-migration-test-*`,
port ngẫu nhiên trên loopback, dữ liệu giả; tự dọn đúng container đã tạo. Không
đọc env production và không kết nối common-infra thật. Chạy thủ công, không nằm
trong workflow deploy: MinIO copy/checksum/collision, PostgreSQL
nguồn **14.23** → đích **16** bằng `pg_dump`/`pg_restore` **16**, restore toàn
bộ 21 migrations. Đối chiếu số dòng/hash tất cả bảng, giá trị/trạng thái sequence,
index/constraint, Prisma migration status và xác nhận nguồn không đổi; sau đó
kiểm tra normalization/rollback transaction. Image API nếu được chỉ định sẽ
chạy trên chính database 16 đã restore.

Bài test dùng PostgreSQL Alpine và dữ liệu giả, không mô phỏng toàn bộ dữ liệu,
extension hay locale Ubuntu trên VPS. Khi chuyển thật vẫn phải restore vào DB
trống và đối chiếu snapshot nguồn/đích trước khi mở ghi theo hướng dẫn trên.

Để kiểm tra thêm image API thật với login/upload/nén/xóa video trên dữ liệu giả:

```bash
docker build -t mhhome-api:migration-review .
RUN_MIGRATION_INTEGRATION=1 MIGRATION_API_TEST_IMAGE=mhhome-api:migration-review \
  yarn node --test scripts/migration/*.test.mjs
```

Test Nginx dùng certificate tự ký chỉ trong container test để xác nhận URL cũ/mới
và HTTP Range. Test API seed lặp lại trên **database test cô lập**, kiểm tra password và cache quyền
với Redis mới. Smoke video dùng clip 5 giây; ca clip 1 giây được ghi TODO vì lỗi nguồn.

## 9. Chuyển port common-infra về 5432/6379 sau khi tất cả dự án đã migrate

**Không chạy bước này khi mới chuyển riêng MH Home.** Đây là đổi port publish
của common-infra đang chứa dữ liệu mới, không phải migrate/restore lại dữ liệu.
Giữ nguyên port nội bộ Docker, password, DB, Redis DB/prefix và MinIO.

### 9.1. Chốt danh sách và dừng runtime

- Mọi dòng trong bảng dự án phải hoàn tất. Kiểm tra env của API/worker, cron,
  systemd timer, PM2, script backup, công cụ quản trị và SSH tunnel. Ghi lại client
  nào đang dùng host `5433/6380` để đổi ở bước 9.5. Không xuất toàn bộ env chứa secret.
- Kiểm tra `pg_stat_activity` trên PostgreSQL cũ và `CLIENT LIST` trên Redis cũ,
  dùng đúng account/password hiện có. Kết hợp kiểm tra cấu hình/lịch chạy: không
  có kết nối tại một thời điểm chưa chứng minh cron hoặc app đã rời dịch vụ cũ.
- Chặn traffic/webhook, tạm dừng workflow deploy, cron/timer và cơ chế tự restart
  của các runtime trong danh sách. Dừng đúng từng API/worker sau khi xử lý job
  đang chạy; ghi lại lệnh mở lại. Không dùng `pm2 stop all` theo thói quen.
- Cho phép downtime cho tất cả runtime đã liệt kê. Nếu còn dự án chưa chuyển,
  quay lại giai đoạn 1, không dừng PostgreSQL/Redis cũ.

### 9.2. Backup và giữ đúng project, image, volume

Dùng cùng terminal trong toàn bộ bước 9. Tạo hồ sơ mới ngoài Git:

```bash
cd /opt/common-infra
umask 077
export PORT_BACKUP="/opt/backups/common-infra-ports-$(date +%Y%m%d-%H%M%S)"
sudo install -d -m 700 -o "$(id -un)" -g "$(id -gn)" "$PORT_BACKUP"
cp -p .env.production "$PORT_BACKUP/env-before"
cp -p docker-compose.yml "$PORT_BACKUP/compose-before.yml"
export PORT_PROJECT="$(docker inspect postgres_all --format '{{index .Config.Labels "com.docker.compose.project"}}')"
test -n "$PORT_PROJECT"
test "$PORT_PROJECT" = "$(docker inspect redis_all --format '{{index .Config.Labels "com.docker.compose.project"}}')"
printf '%s\n' "$PORT_PROJECT" > "$PORT_BACKUP/project-name.txt"
```

Xác nhận project vừa đọc là stack tại `/opt/common-infra`. Ghi image ID và mounts,
tạo override giữ đúng image đang chạy, tránh vô tình dùng image tag đã được cập nhật:

```bash
python3 - "$PORT_BACKUP" <<'PY'
import json, pathlib, subprocess, sys
out = pathlib.Path(sys.argv[1])
state = {}
for name in ('postgres_all', 'redis_all', 'minio_all'):
    c = json.loads(subprocess.check_output(['docker', 'inspect', name]))[0]
    state[name] = {'image': c['Image'], 'mounts': c['Mounts'], 'id': c['Id']}
(out / 'containers-before.json').write_text(json.dumps(state, indent=2))
override = {'services': {
    'postgres-all': {'image': state['postgres_all']['image']},
    'redis-all': {'image': state['redis_all']['image']},
}}
(out / 'images.json').write_text(json.dumps(override, indent=2))
PY
port_compose() {
  docker compose -p "$PORT_PROJECT" --env-file /opt/common-infra/.env.production \
    -f /opt/common-infra/docker-compose.yml -f "$PORT_BACKUP/images.json" "$@"
}
port_compose config --quiet
```

Nếu mở terminal mới: đặt lại `PORT_BACKUP` tới hồ sơ cũ, đọc `PORT_PROJECT` từ
`project-name.txt` rồi khai báo lại hàm; không tạo hồ sơ mới giữa chừng.

Backup **từng dự án đã chuyển**, ví dụ dưới đây chỉ là MH Home, lặp lại đúng file
project env của từng dòng trong bảng. Lưu bản backup thành công ngoài VPS và ngoài
retention tự động; script hiện tại có thể dọn các backup cũ theo cấu hình retention.

```bash
scripts/backup-project.sh projects/mhhome.env
```

Script này backup PostgreSQL/MinIO, **không backup Redis**. Redis mới đã có dữ liệu
của các dự án: sau khi dừng toàn bộ writer, chạy snapshot có xác thực, chờ hoàn tất
rồi lưu toàn bộ `/data` (gồm RDB/AOF) từ container đã dừng:

```bash
port_compose exec -T redis-all sh -ec '
  export REDISCLI_AUTH="$REDIS_PASSWORD"
  redis-cli SAVE
  redis-cli INFO persistence
'
port_compose stop redis-all
docker cp redis_all:/data "$PORT_BACKUP/redis-data"
```

Chỉ tiếp tục nếu SAVE thành công và bản copy hoàn tất; không FLUSHDB/FLUSHALL,
không reset Redis như lúc mới chuyển MH Home. Lưu số DB/bảng nghiệp vụ cần kiểm
tra và trạng thái key Redis trước đổi port; TTL vẫn trôi khi dừng, nên không yêu
cầu số key có TTL phải bằng tuyệt đối sau khi bật lại.

### 9.3. Dừng đúng dịch vụ cũ và giải phóng port

Xác định service từ listener/PID và unit thực tế, không đoán tên cluster:

```bash
sudo ss -ltnp '( sport = :5432 or sport = :6379 )'
pg_lsclusters
systemctl list-units --all 'postgresql*' 'redis*'
systemctl list-unit-files 'postgresql*' 'redis*'
```

Với từng PID listener, dùng `systemctl status <PID>` và `systemctl cat <UNIT>` để
xác nhận cấu hình. Ghi unit, cluster, trạng thái enabled và đường dẫn dữ liệu cũ
vào hồ sơ. Ví dụ **chỉ khi xác nhận PostgreSQL là cluster 14/main và Redis là
redis-server.service**:

```bash
sudo cp -p /etc/postgresql/14/main/start.conf "$PORT_BACKUP/pg14-main-start.conf"
sudo pg_ctlcluster 14 main stop
sudo systemctl disable postgresql@14-main.service
sudoedit /etc/postgresql/14/main/start.conf
# Trong start.conf: thay dòng auto bằng manual, giữ các comment.
sudo systemctl daemon-reload
sudo systemctl disable --now redis-server.service
```

Nếu tên khác, dùng đúng tên đã xác minh. `start.conf=manual` ngăn Ubuntu tự bật
cluster thông qua PostgreSQL generator sau reboot; chỉ disable unit có thể chưa
đủ. Nếu Redis có socket/timer/custom supervisor kích hoạt lại, dừng và disable
đúng thành phần đó sau khi xác nhận. Không disable cluster khác vẫn cần sử dụng.
Không uninstall PostgreSQL/Redis, không xóa data directory hoặc bản backup cũ.

```bash
sudo ss -ltnp '( sport = :5432 or sport = :6379 )'
```

Kết quả phải không còn listener. Nếu vẫn có, xác định lại chủ sở hữu; không kill
PID tùy ý và không tiếp tục đổi port khi chưa giải phóng được.

### 9.4. Đổi port và tạo lại đúng hai container

Trong `/opt/common-infra/.env.production`, chỉ đổi:

```dotenv
POSTGRES_HOST_PORT=5432
REDIS_HOST_PORT=6379
```

Không đổi tên project, volume, network, credential hoặc service. Xóa override
hai biến port trong shell rồi kiểm tra cấu hình mà không in secrets:

```bash
unset POSTGRES_HOST_PORT REDIS_HOST_PORT
port_compose config --quiet
port_compose config --format json | python3 -c '
import json, sys
s = json.load(sys.stdin)["services"]
for name, expected in (("postgres-all", 5432), ("redis-all", 6379)):
    ports = s[name]["ports"]
    assert len(ports) == 1
    p = ports[0]
    assert p["host_ip"] == "127.0.0.1"
    assert int(p["published"]) == expected and int(p["target"]) == expected
    print(name, p["host_ip"], p["published"], "->", p["target"])
'
port_compose up -d --no-deps --force-recreate --pull never --wait --wait-timeout 120 postgres-all redis-all
```

Không dùng `restart` để áp dụng port mới vì restart không thay cấu hình container.
Không chạy `down`, `down -v`, `volume rm`, `system prune --volumes`; không recreate
MinIO. Compose tạo lại container nhưng giữ mounted volumes:
[Docker Compose up](https://docs.docker.com/reference/cli/docker/compose/up/).

### 9.5. Đối chiếu và mở runtime

```bash
port_compose ps
port_compose port postgres-all 5432
port_compose port redis-all 6379
port_compose exec -T postgres-all sh -ec 'pg_isready -U "$POSTGRES_USER"'
port_compose exec -T postgres-all sh -ec 'psql -U "$POSTGRES_USER" -d postgres -c "SHOW server_version;" -c "SELECT datname FROM pg_database ORDER BY datname;"'
port_compose exec -T redis-all sh -ec 'export REDISCLI_AUTH="$REDIS_PASSWORD"; redis-cli PING; redis-cli INFO keyspace'
python3 - "$PORT_BACKUP" <<'PY'
import json, pathlib, subprocess, sys
before = json.loads((pathlib.Path(sys.argv[1]) / 'containers-before.json').read_text())
for name, old in before.items():
    c = json.loads(subprocess.check_output(['docker', 'inspect', name]))[0]
    assert c['Image'] == old['image'], (name, 'image changed')
    assert c['Mounts'] == old['mounts'], (name, 'mounts changed')
    if name == 'minio_all':
        assert c['Id'] == old['id'], 'MinIO was recreated unexpectedly'
    print(name, 'image/volume verified')
PY
```

- Đối chiếu DB/bảng, số liệu nghiệp vụ và key Redis bền vững đã ghi trước đó;
  kiểm tra log lỗi. Port và health đúng chưa đủ xác nhận dữ liệu.
- Từ host, dùng `psql` 16 với `-h 127.0.0.1 -p 5432` và account/DB đích; dùng
  `redis-cli -h 127.0.0.1 -p 6379 -n <DB>` với `REDISCLI_AUTH` để PING/kiểm tra
  dữ liệu. Không để password trong tham số CLI hoặc log.
- Đổi endpoint của các client host, cron, monitor, SSH tunnel và công cụ quản trị
  từ `5433/6380` về `5432/6379`. Script dùng `docker compose exec` hoặc Docker DNS
  như backup-project không cần đổi port. Lưu hồ sơ operator migration cũ và ngừng
  sử dụng: `LEGACY_DATABASE_URL` trỏ `5432` lúc này sẽ chạm **DB mới**, không còn DB cũ.
- Mở lần lượt API/worker theo danh sách, giữ `postgres-all:5432`, `redis-all:6379`
  trong runtime env. Kiểm tra từ app container qua health/log và thao tác thật:
  đăng nhập, đọc DB, queue, media; sau đó bật lại traffic, cron và deploy.
- Giữ image override/hồ sơ để rollback. Không nâng image trong cùng đợt đổi port;
  các lần nâng cấp image sau là một thao tác riêng.

### 9.6. Rollback riêng thao tác đổi port

Nếu bất kỳ bước kiểm tra nào thất bại, giữ/dừng lại runtime, traffic, cron và deploy.
Chỉ trả hai biến host port trong env về `5433` và `6380`; giữ nguyên mọi credential
và cấu hình khác. Xác nhận hai port tạm còn trống rồi chạy:

```bash
unset POSTGRES_HOST_PORT REDIS_HOST_PORT
port_compose config --quiet
port_compose up -d --no-deps --force-recreate --pull never --wait --wait-timeout 120 postgres-all redis-all
port_compose port postgres-all 5432
port_compose port redis-all 6379
```

Lặp lại kiểm tra image/volume, DB/Redis và app của bước 9.5; kết quả port lần này
phải là `127.0.0.1:5433` và `127.0.0.1:6380`. Trả các client host về port tạm rồi
mở runtime sau khi kiểm tra. Docker hostname/port nội bộ vẫn không đổi.

**Không khởi động DB/Redis cũ để cho ứng dụng chạy lại và không restore snapshot
cũ vào common-infra** khi rollback port: dữ liệu mới vẫn nằm trong volume hiện tại.
Nếu container báo volume/image khác, dừng để xác minh hồ sơ, không tự provision DB
trống hoặc chạy seed để làm app khởi động được. Chỉ xử lý phục hồi backup khi đã
xác nhận sự cố dữ liệu riêng, không coi đó là một phần của đổi port.
