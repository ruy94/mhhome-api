# ViettelPost Integration

## Phạm vi

VTP là carrier độc lập với SPX. `SPX_ENABLED` và `VTP_ENABLED` có thể bật
riêng hoặc đồng thời. Checkout Mini App/Website lấy danh sách carrier từ backend
và gửi `shippingProvider` xuyên suốt quote, prepare và tạo đơn.

Luồng địa chỉ người nhận không có form VTP riêng. Backend tái sử dụng snapshot
địa chỉ hiện tại và gọi các API NLP theo địa chỉ chi tiết:

- `/v2/order/getPriceAllNlp`
- `/v2/order/getPriceNlp`
- `/v2/order/createOrderNlp`

Dịch vụ có cước thấp nhất được chọn; nếu cùng cước thì ưu tiên KPI thấp hơn.

## Cấu hình

Các biến bắt buộc khi `VTP_ENABLED=true`:

- `VTP_USERNAME`, `VTP_PASSWORD`: tài khoản Partner. Backend gọi
  `/v2/user/Login` để lấy token ngắn hạn, sau đó gọi `/v2/user/ownerconnect`
  để đổi sang token dài hạn một năm. Chỉ token dài hạn được cache trong memory
  và Redis; token ngắn hạn không được lưu.
- `VTP_WEBHOOK_SECRET`: shared secret khớp trường `TOKEN` trong body webhook.
  Header `Authorization` do VTP quản lý vẫn bắt buộc phải có, nhưng backend
  không so sánh nó với một token tự cấu hình.
- `VTP_SENDER_NAME`, `VTP_SENDER_PHONE`, `VTP_SENDER_ADDRESS`.

Các biến tùy chọn: `VTP_ENV`, `VTP_BASE_URL`, `VTP_TIMEOUT_MS`,
`VTP_PRINT_BASE_URL`, `VTP_PRINT_LABEL_TYPE`,
`VTP_PRINT_SHOW_POSTAGE`, `VTP_PRINT_EXPIRY_SECONDS`.

Không đưa secret/token xuống Mini App, Website hoặc Admin.

## Vận hành đơn

- Tạo đơn bằng `createOrderNlp`; mã vận đơn trả về được coi là đã tiếp nhận, không gọi thêm TYPE 1.
- Sửa thông tin bằng `/v2/order/edit`, chỉ trước khi VTP nhận hàng.
- Hủy bằng TYPE 4, chỉ trước khi nhận hàng.
- TYPE 2 (duyệt hoàn) và TYPE 3 (phát tiếp) chỉ hợp lệ tại status code `505`.
- In nhãn dùng `/v2/order/printing-code`; URL in có thời hạn ngắn và được tạo
  phía backend.
- Không refresh VTP thủ công. Webhook là nguồn trạng thái chính thức.

Shop Admin dùng chung endpoint cho đơn local và mua chéo. Với đơn mua chéo,
Shop API chuyển tiếp thao tác sửa/hủy/TYPE 2/3 sang Marketplace bằng HMAC;
credential VTP trung tâm không xuất hiện tại Shop Admin.

## Webhook và tồn kho

Endpoint: `POST /api/v1/webhook/vtp`.

Handler bắt buộc header `Authorization` và xác thực body `TOKEN` bằng
`VTP_WEBHOOK_SECRET`, ghi inbox idempotent rồi trả HTTP 200; xử lý business chạy
bất đồng bộ và cron retry các event lỗi. Event trùng, thừa hoặc đến trễ vẫn được
lưu nhưng không ghi đè trạng thái mới hơn.

Mapping chính:

| VTP                                     | Trạng thái nội bộ      | Hoàn kho       |
| --------------------------------------- | ---------------------- | -------------- |
| 102/103/104                             | PendingPickup          | Không          |
| 200/202/300/400/500/506/507/508/509/550 | InTransit              | Không          |
| 505/515 hoặc `IS_RETURNING=true`        | Returning              | Không          |
| 501                                     | Delivered              | Không          |
| 504                                     | Returned               | Có, idempotent |
| 101/107                                 | Cancelled trước pickup | Có, idempotent |
| 201/503                                 | Failed/manual review   | Không          |

## Marketplace và khác biệt dự án

- Marketplace dùng token VTP riêng, sender snapshot của source và giữ nguyên
  reservation/outbox/compensation hiện tại.
- Không áp dụng wholesale, flash sale hoặc affiliate cho item mua chéo.
- Tích hợp shipping không thay đổi hành vi wholesale/voucher hiện tại của
  HPFashion.
- Tích hợp không thay đổi MinIO/media hay CI/CD riêng của ThuleSG.

## Checklist bật production

1. Chạy migration Prisma và deploy API trước frontend.
2. Mỗi tài khoản VTP chỉ cấu hình được một webhook URL. Không dùng chung một
   tài khoản production cho nhiều Shop API; token tạm dùng chung chỉ phù hợp
   test luân phiên.
3. Cấu hình URL webhook và secret body trên VTP; chạy kiểm tra kết nối phải nhận
   HTTP 200 trước khi lưu.
4. Test quote, tạo đơn, TYPE 1, in nhãn, webhook 200/501/504 và idempotency.
5. Bật `VTP_ENABLED=true`; có thể giữ SPX bật hoặc tắt độc lập.
