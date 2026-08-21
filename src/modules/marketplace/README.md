# Tích Hợp Marketplace Mua Chéo

## Đọc Trước

Module này là phía shop của nghiệp vụ mua chéo. Shop có thể đồng thời là:

- **Host shop**: sở hữu Mini App nơi khách đang mua hàng.
- **Source shop**: sở hữu sản phẩm, giá, tồn kho, voucher và xử lý đóng gói.

Một host có thể nhận sản phẩm từ nhiều source độc lập. Mini App và Shop Admin
chỉ gọi Shop API; HMAC secret và SPX credential Marketplace không được đưa
xuống frontend.

Luồng pure-local phải tiếp tục hoạt động khi Marketplace bị tắt hoặc gặp lỗi.

## Ranh Giới Dữ Liệu

- Shop API là nguồn dữ liệu chính xác của product, variant, retail price, stock,
  voucher, order nguồn, hóa đơn, SaleWork và nghiệp vụ hoàn kho.
- Marketplace chỉ giữ catalog projection, listing, checkout saga, parent order,
  sub-order, shipment, COD và ledger.
- Catalog projection chỉ phục vụ hiển thị. Giá, tồn kho và voucher luôn được
  source shop kiểm tra lại trong quote/reservation trước khi confirm.
- Không truyền Zalo ID/token hoặc local user ID của host sang source khác.
  Source nhận `opaqueCustomerRef` và snapshot người nhận; order nguồn có thể có
  `userId = null`.

## Cấu Hình

```env
MARKETPLACE_ENABLED=false
MARKETPLACE_CHECKOUT_ENABLED=false
MARKETPLACE_BASE_URL=https://server.marketplace.example.com
MARKETPLACE_SHOP_CODE=shop-code
MARKETPLACE_KEY_ID=credential-key-id
MARKETPLACE_HMAC_SECRET=credential-secret
MARKETPLACE_REQUEST_TIMEOUT_MS=10000
MARKETPLACE_HMAC_MAX_SKEW_SECONDS=300
MARKETPLACE_NONCE_TTL_SECONDS=600
MARKETPLACE_RESERVATION_TTL_SECONDS=300
MARKETPLACE_MEDIA_IMAGE_BASE_URL=https://media.shop.example.com/images
MARKETPLACE_MEDIA_VIDEO_BASE_URL=https://media.shop.example.com/videos
MARKETPLACE_MEDIA_THUMBNAIL_BASE_URL=https://media.shop.example.com/thumbnails
```

- `MARKETPLACE_ENABLED=false` tắt catalog và toàn bộ facade Marketplace.
- Khi chỉ `MARKETPLACE_CHECKOUT_ENABLED=false`, catalog, giỏ/đơn cũ và thao tác
  xóa giỏ vẫn dùng được; add/update, quote và prepare mới bị chặn. Session đang
  tồn tại vẫn được get/confirm/release để không bỏ dở reservation.
- Khi bật checkout, sender profile SPX của shop phải đầy đủ. Marketplace dùng
  sender snapshot này cho parcel của shop nhưng dùng SPX account trung tâm.
- Ba media base URL là bắt buộc khi Marketplace bật. Shop API phải chuyển mọi
  filename/path tương đối thành URL tuyệt đối trước khi phát catalog. URL đã
  tuyệt đối được giữ nguyên.

## Contract Shop Với Marketplace

Marketplace gọi source shop qua HMAC:

- `GET /api/v1/marketplace/sender-profile`
- `GET /api/v1/marketplace/catalog/snapshot`
- `POST /api/v1/marketplace/commerce/quote-preview`
- `POST /api/v1/marketplace/commerce/quote-finalize`
- `POST /api/v1/marketplace/commerce/reservations`
- `POST /api/v1/marketplace/commerce/reservations/:id/confirm`
- `POST /api/v1/marketplace/commerce/reservations/:id/release`
- `POST /api/v1/marketplace/commerce/reservations/:id/compensate`
- `POST /api/v1/marketplace/commerce/orders/:subOrderId/shipment-events`
- `POST /api/v1/marketplace/commerce/orders/:subOrderId/refund`

Mọi mutation server-to-server phải có idempotency key. HMAC gồm method, path và
query, timestamp, nonce, idempotency key và SHA-256 body. Nonce được giữ trong
Redis để chống replay.

## Facade Mini App

Mini App host dùng các endpoint:

- Catalog: `GET /api/v1/miniapp/marketplace/products` và `/:listingId`.
- Cart: get/add/update/delete item và clear dưới
  `/api/v1/miniapp/marketplace/users/:userId/cart`.
- Checkout: quote, prepare, get session, confirm và release dưới
  `/api/v1/miniapp/marketplace/checkout`.
- Lịch sử: list/detail/cancel dưới
  `/api/v1/miniapp/marketplace/users/:userId/orders`.

`CartItem` local và `MarketplaceCartItem` là hai nguồn state riêng. Response
Marketplace cart phải trả `totalQuantity`; frontend dùng tổng local + Marketplace
để hiển thị badge. Sau confirm phải xóa đúng local line và Marketplace item đã
checkout, không giữ item cũ ở trang thanh toán.

## Giá Và Voucher

- Hàng local host giữ nguyên flash sale, wholesale, affiliate và voucher local.
- Hàng chéo chỉ dùng retail price và voucher public `Normal`/`Freeship` của
  source; không dùng flash sale, wholesale hoặc affiliate chéo.
- Voucher chỉ tính trên merchandise/shipping của đúng source. Hàng source khác
  không được cộng vào `minOrderValue`.
- Source shop là nơi quote, reserve, consume, release và kiểm tra usage limit.
- Selection có mode `Auto` hoặc `Manual`. `Manual` với ID rỗng nghĩa là khách
  chủ động bỏ voucher và hệ thống không được tự áp lại.
- Giảm theo phần trăm không có `maxDiscount` phải tính trên toàn bộ base hợp lệ;
  không được mặc định mức giảm về 0.
- Note và electronic invoice được gửi riêng theo source. Invoice chỉ được nhận
  khi `sender-profile.features.electronicInvoiceEnabled=true`.

## Checkout Và Zalo SDK

### Pure Local

Không gọi Marketplace. Shop dùng SPX credential, sender, checkout, stock và
voucher local như trước.

### Mixed Hoặc Cross-only

1. Shop API gửi toàn bộ local item và Marketplace cart item để quote/prepare.
2. Marketplace gọi từng source, reserve stock/voucher trong 5 phút và trả tổng
   theo source.
3. Shop API confirm session; Marketplace confirm source order và tạo parent/sub-
   order trước khi Mini App gọi SDK.
4. Mini App dựng `Payment.createOrder` từ parent order đã confirm. Payload hiện
   chứa item của **tất cả host/source sub-order** và
   `amount = parent.totalAmount`.
5. SDK lỗi, bị đóng hoặc không trả order ID không được rollback đơn backend,
   stock hay voucher. Mini App thông báo đơn đã được tạo và hoàn tất dọn cart.

Checkout Marketplace hiện chỉ hỗ trợ COD. `checkoutAttemptId`, prepare payload
và session ID phải được lưu để resume idempotent sau reload/mất mạng. `Reserved`
được confirm lại, `Confirming` poll có giới hạn và `Confirmed` trả lại cùng
order.

## Order Và Source-driven Fulfillment

Khi source confirm reservation, Shop API tạo order local với
`OrderPlatform.Marketplace`, `marketplaceParentId`, `marketplaceSubOrderId`,
`hostShopCode`, opaque customer và các snapshot giá/địa chỉ/note/invoice.

Order mua chéo không nằm chung màn vận hành với order local:

- Shop Admin dùng `/marketplace-orders` và chỉ thấy sub-order có sản phẩm thuộc
  shop hiện tại.
- Order bắt đầu ở `Chờ xử lý`; Marketplace chỉ khởi tạo shipment `Pending`,
  không tự động gửi SPX ngay sau checkout.
- Source operator chọn đơn và gọi
  `POST /api/v1/shipping/marketplace/orders/batch`.
- Shop API chuyển sub-order ID tới Marketplace. Marketplace dùng
  `SPX_USER_ID/SPX_USER_SECRET` trung tâm và sender snapshot của source để tạo
  SPX parcel, rồi trả tracking/AWB về Shop Admin.
- In hoặc in lại dùng `POST /api/v1/shipping/marketplace/orders/awb`.
- Refresh tracking và cancel dùng các endpoint
  `/api/v1/shipping/marketplace/orders/...` tương ứng.

Marketplace nhận SPX webhook và callback trạng thái về source. Detail/list API
phải trả shipping events để Admin và Mini App hiển thị hành trình mới nhất.

## Trạng Thái Và Hoàn Kho

- Shipment: `Pending`, `Creating`, `PendingPickup`, `InTransit`,
  `Delivered`, `Returning`, `Returned`, `Cancelled`, `Failed`.
- Parent fulfillment có thêm `PartiallyDelivered` và `PartiallyReturned`.
- SPX `6001/Returning` chỉ là đang hoàn và không được hoàn kho.
- Chỉ `6003/Returned` xác nhận hàng đã về sender và được phép gọi nghiệp vụ
  Return tại source.
- Cancel, Refund và Return phải idempotently hoàn variant stock, flash-sale sold,
  voucher và tạo SaleWork recovery khi có liên kết. Lỗi SaleWork không rollback
  order/local stock; outbox chuyển Failed để retry.

## Catalog Outbox

`MarketplaceOutboxLog.id` là CUID và đồng thời là external `eventId`; sequence
là Prisma `Int`. Tăng sequence và tạo log phải cùng transaction với thay đổi
local. Worker retry tối đa 3 lần với exponential backoff. Lỗi Marketplace chỉ
chuyển log sang `Failed`, không rollback product, order hoặc stock local.

Event được phát khi product/variant/stock thay đổi, gồm cả tạo order, hoàn
Cancel/Refund/Return, liên kết hoặc đồng bộ SaleWork. Payload chỉ dùng retail
catalog; không phát flash sale, wholesale, voucher hoặc affiliate.

## Kiểm Tra Bắt Buộc

- Pure-local không phụ thuộc Marketplace.
- HMAC/replay/idempotency và outbox retry.
- Concurrent reservation không bán vượt stock hoặc consume voucher hai lần.
- Auto/manual voucher và voucher phần trăm không `maxDiscount`.
- Mixed/cross-only SDK chứa đủ item và tổng parent order.
- Source-driven create shipment, AWB/reprint, tracking và cancel.
- Duplicate/out-of-order SPX events; `6001` không hoàn kho, `6003` hoàn đúng
  một lần.
- Media image/video/thumbnail luôn là URL tuyệt đối có thể truy cập.
