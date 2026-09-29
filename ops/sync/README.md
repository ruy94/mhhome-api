# Đồng bộ code từ cuahanggiadungmng sang MH Home

## Mốc của đợt chuyển hạ tầng

| Repo | Nguồn tham chiếu | Phần được áp dụng |
|---|---|---|
| API | `a95a9948b18a6331cd62b1d57435b0b096b1d537` | Storage/MinIO, upload, media cleanup, Redis prefix, CORS, Docker/CI |
| Admin | `0a815b0` | Upload service, media helpers, form media, static release CI |
| Website | `37d031bb9e89a2b11fddf1c23304758e453a55e5` | Media helpers/product media, static release CI |

Các commit này là **mốc của các phần đã áp dụng**, không phải xác nhận mọi file
MH Home đã bằng nguồn. KiotViet, thay đổi SaleWork/shipping/order ngoài phạm vi
media được giữ ở phiên bản MH Home. Schema và 21 migrations MH Home không đổi. Seed được đồng bộ theo nguồn, giữ specialAdmins MH Home.
Không checkout/chỉnh sửa repo cuahanggiadungmng khi làm việc này.

## Phần dùng chung và phần giữ riêng

Phần media dùng chung: storage service/config, upload controller/service/module,
worker nén video/dọn media, cleanup trong product/variant/category/banner/review/
Zalo video, các form tương ứng và helper URL frontend. Package/lockfile có thêm
AWS S3 SDK và file-type theo nguồn. Khi đổi dependency, xem package và lockfile
cùng nhau, không copy một bên rồi tự bỏ qua bên còn lại.

Khác biệt cố định có chủ ý:

- Env, tên service/port/path trong Compose/workflow; frontend build public env.
- Seed giữ specialAdmins MH Home; phần còn lại giống nguồn, chạy mỗi lần deploy.
- Logo/story, admin title, website SEO và thương hiệu.
- Upload temp default `/tmp/mhhome-api/uploads`; runtime có thể override bằng env.
- Tooling/runbook/sync filters trong `ops/`, `scripts/`; Docker context loại env/artifact.

`api.exclude`, `admin.exclude`, `website.exclude` chứa các ngoại lệ cố định và
các ngoại lệ **tạm thời** do KiotViet/business chưa đồng bộ. Không tự xóa phần tạm
thời chỉ vì một file mới đã build được: phải đồng bộ trọn dependency/module/schema.

## Copy một tính năng bằng rsync

1. Commit/tag trạng thái MH Home hiện tại. Xem diff nguồn của tính năng và lập
   danh sách **đầy đủ** file cần copy, mỗi dòng một file tương đối từ root repo.
   Xem cả dependency, API contract, test, rename/delete và migration. Không dùng
   danh sách generated files, `node_modules`, hoặc toàn bộ thư mục source tùy ý.
2. Chọn đúng component, chạy preview với filter. Ví dụ API:

```bash
SOURCE=/home/duy/Documents/cuahanggiadungmng-api
TARGET=/home/duy/Documents/mhhome-api
FILES=/tmp/mhhome-api-feature-files.txt
FILTER=/home/duy/Documents/mhhome-api/ops/sync/api.exclude

rsync -avnic --debug=FILTER --files-from="$FILES" --exclude-from="$FILTER" \
  "$SOURCE/" "$TARGET/"
```

`-n` là dry-run, `-i` in thay đổi, `-c` so nội dung. `--debug=FILTER` cho biết
file bị filter chặn; **file bị chặn không đồng nghĩa tính năng đã được đồng bộ**.
Danh sách phải là file, không dùng dòng thư mục để vô tình mở rộng phạm vi.

3. Review preview và file bị chặn; merge thủ công các thay đổi thật sự cần ở file
   cấu hình dùng chung với thông tin riêng MH Home. Sau đó chạy cùng lệnh bỏ `n`:

```bash
rsync -avic --files-from="$FILES" --exclude-from="$FILTER" "$SOURCE/" "$TARGET/"
git -C "$TARGET" diff --check
git -C "$TARGET" diff --stat
```

Với admin/website, thay SOURCE/TARGET và dùng filter tương ứng từ thư mục này.
Không dùng `--delete` hay `--delete-excluded` trên toàn repo. File bị xóa/rename
được review và xử lý riêng trong Git; rsync không làm thay bước đó.

4. Chạy API `yarn prisma:generate`, `yarn test --runInBand`, `yarn build`; admin
   `yarn build`; website `yarn typecheck` và `yarn generate`. Tool migration thay
   đổi thì chạy `RUN_MIGRATION_INTEGRATION=1 yarn node --test scripts/migration/*.test.mjs`.
5. Commit ở MH Home và ghi commit nguồn/file đã áp dụng vào commit message.
   Deploy API trước nếu frontend phụ thuộc contract mới.

## Sau khi tự đồng bộ KiotViet

- Đồng bộ cả backend/admin, schema, migration, dependency và test liên quan.
  Dùng lại **nguyên nội dung** migration nguồn, không sửa 21 migration lịch sử
  đã chạy. Kiểm tra trên bản restore trước khi `migrate deploy` production.
- Xem riêng migration `20260916080433`: đây là chỉnh default/index có trước phần
  KiotViet trong HEAD nguồn, không được tự coi nó là migration đã chạy ở MH Home.
- Gỡ các dòng tạm thời trong filters sau khi đối chiếu; giữ nguyên phần nhận diện
  shop, secrets, specialAdmins trong seed và deployment.
- Khi nguồn thêm chức năng thay schema, copy code chưa đủ: cần migration tương
  ứng. Không tạo migration mới chỉ để làm lịch sử trông giống nhau.

Với yêu cầu giữ nguyên nguồn, một số file cấu hình vẫn khác cố định. Bộ lọc biến
những khác biệt này thành quy tắc rõ ràng; nó không chứng minh mọi tính năng mới
có thể copy độc lập mà không xem dependency.

## Các file đã đồng bộ nguyên bản theo yêu cầu

`storage.service.ts`, `video.utils.ts`, `admin-notification-realtime.service.ts`
và test notification giống nguồn; không còn bị filter rsync chặn. Deploy workflows
giống nguồn sau khi thay định danh cuahanggiadungmng thành mhhome: không marker,
không test migration, API vẫn migrate và seed. Seed chỉ khác specialAdmins.
SaleWork permissions đã có đủ; ba tên quyền KiotViet và invalidation cache quyền
được giữ như nguồn, chưa triển khai nghiệp vụ/schema KiotViet.

Hạn chế được giữ từ nguồn: thumbnail giây thứ 3 lỗi với clip ngắn; storage chưa
có bản sửa kiểm tra file/đóng stream; Pub/Sub dùng kênh chung giữa các shop trên
cùng Redis instance. Xóa dữ liệu Redis không sửa được các hạn chế này. Người dùng
sẽ sửa media ở cả hai dự án sau. Migration chỉ chuyển DB/media; Redis khởi tạo mới.
