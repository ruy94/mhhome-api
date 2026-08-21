ALTER TABLE "vouchers" ADD COLUMN "reserved_count" INTEGER NOT NULL DEFAULT 0;

CREATE TYPE "MarketplaceReservationStatus" AS ENUM (
  'Reserved', 'Confirmed', 'Released', 'Expired', 'Compensated'
);

CREATE TABLE "marketplace_checkout_reservations" (
  "id" TEXT NOT NULL,
  "checkout_session_id" TEXT NOT NULL,
  "host_shop_code" VARCHAR(50) NOT NULL,
  "host_local_user_id" INTEGER,
  "opaque_customer_ref" VARCHAR(100) NOT NULL,
  "mode" VARCHAR(30) NOT NULL,
  "status" "MarketplaceReservationStatus" NOT NULL DEFAULT 'Reserved',
  "expires_at" TIMESTAMP(3) NOT NULL,
  "shipping_fee" DECIMAL(15,0) NOT NULL,
  "merchandise_subtotal" DECIMAL(15,0) NOT NULL,
  "item_voucher_discount" DECIMAL(15,0) NOT NULL,
  "order_voucher_discount" DECIMAL(15,0) NOT NULL,
  "shipping_discount" DECIMAL(15,0) NOT NULL,
  "shipping_amount" DECIMAL(15,0) NOT NULL,
  "total_amount" DECIMAL(15,0) NOT NULL,
  "quote_snapshot" JSONB NOT NULL,
  "confirmed_at" TIMESTAMP(3),
  "released_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "marketplace_checkout_reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "marketplace_inventory_reservations" (
  "id" TEXT NOT NULL,
  "reservation_id" TEXT NOT NULL,
  "product_id" INTEGER NOT NULL,
  "variant_id" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unit_price" DECIMAL(15,0) NOT NULL,
  "pricing_mode" "PricingMode" NOT NULL,
  "flash_sale_item_id" INTEGER,
  "item_snapshot" JSONB NOT NULL,
  CONSTRAINT "marketplace_inventory_reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "marketplace_voucher_reservations" (
  "id" TEXT NOT NULL,
  "reservation_id" TEXT NOT NULL,
  "voucher_id" INTEGER NOT NULL,
  "user_voucher_id" INTEGER,
  "user_voucher_was_created" BOOLEAN NOT NULL DEFAULT false,
  "source_product_id" VARCHAR(100),
  "scope" "VoucherScope" NOT NULL,
  "discount_amount" DECIMAL(15,0) NOT NULL,
  "voucher_snapshot" JSONB NOT NULL,
  CONSTRAINT "marketplace_voucher_reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "marketplace_idempotency_records" (
  "id" TEXT NOT NULL,
  "key" VARCHAR(150) NOT NULL,
  "method" VARCHAR(10) NOT NULL,
  "path" VARCHAR(500) NOT NULL,
  "request_hash" VARCHAR(64) NOT NULL,
  "response_status" INTEGER,
  "response_body" JSONB,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "marketplace_idempotency_records_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "marketplace_checkout_reservations_checkout_session_id_key"
  ON "marketplace_checkout_reservations"("checkout_session_id");
CREATE INDEX "marketplace_checkout_reservations_status_expires_at_idx"
  ON "marketplace_checkout_reservations"("status", "expires_at");
CREATE UNIQUE INDEX "marketplace_inventory_reservations_reservation_id_variant_id_key"
  ON "marketplace_inventory_reservations"("reservation_id", "variant_id");
CREATE INDEX "marketplace_inventory_reservations_variant_id_idx"
  ON "marketplace_inventory_reservations"("variant_id");
CREATE UNIQUE INDEX "marketplace_voucher_reservations_reservation_id_voucher_id_key"
  ON "marketplace_voucher_reservations"("reservation_id", "voucher_id");
CREATE INDEX "marketplace_voucher_reservations_voucher_id_idx"
  ON "marketplace_voucher_reservations"("voucher_id");
CREATE UNIQUE INDEX "marketplace_idempotency_records_key_key"
  ON "marketplace_idempotency_records"("key");
CREATE INDEX "marketplace_idempotency_records_expires_at_idx"
  ON "marketplace_idempotency_records"("expires_at");

ALTER TABLE "marketplace_inventory_reservations"
  ADD CONSTRAINT "marketplace_inventory_reservations_reservation_id_fkey"
  FOREIGN KEY ("reservation_id") REFERENCES "marketplace_checkout_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marketplace_inventory_reservations"
  ADD CONSTRAINT "marketplace_inventory_reservations_variant_id_fkey"
  FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "marketplace_inventory_reservations"
  ADD CONSTRAINT "marketplace_inventory_reservations_flash_sale_item_id_fkey"
  FOREIGN KEY ("flash_sale_item_id") REFERENCES "flash_sale_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "marketplace_voucher_reservations"
  ADD CONSTRAINT "marketplace_voucher_reservations_reservation_id_fkey"
  FOREIGN KEY ("reservation_id") REFERENCES "marketplace_checkout_reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "marketplace_voucher_reservations"
  ADD CONSTRAINT "marketplace_voucher_reservations_voucher_id_fkey"
  FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "marketplace_voucher_reservations"
  ADD CONSTRAINT "marketplace_voucher_reservations_user_voucher_id_fkey"
  FOREIGN KEY ("user_voucher_id") REFERENCES "user_vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
