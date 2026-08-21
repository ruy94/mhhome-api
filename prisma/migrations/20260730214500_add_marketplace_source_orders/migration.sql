ALTER TYPE "OrderPlatform" ADD VALUE 'Marketplace';

ALTER TABLE "orders"
  ALTER COLUMN "user_id" DROP NOT NULL,
  ADD COLUMN "marketplace_parent_id" TEXT,
  ADD COLUMN "marketplace_sub_order_id" TEXT,
  ADD COLUMN "marketplace_reservation_id" TEXT,
  ADD COLUMN "host_shop_code" VARCHAR(50),
  ADD COLUMN "opaque_customer_ref" VARCHAR(100),
  ADD COLUMN "recipient_snapshot" JSONB,
  ADD COLUMN "sender_snapshot" JSONB;

ALTER TABLE "marketplace_checkout_reservations"
  ADD COLUMN "order_id" INTEGER;

CREATE UNIQUE INDEX "orders_marketplace_sub_order_id_key"
  ON "orders"("marketplace_sub_order_id");
CREATE UNIQUE INDEX "orders_marketplace_reservation_id_key"
  ON "orders"("marketplace_reservation_id");
CREATE UNIQUE INDEX "marketplace_checkout_reservations_order_id_key"
  ON "marketplace_checkout_reservations"("order_id");

ALTER TABLE "marketplace_checkout_reservations"
  ADD CONSTRAINT "marketplace_checkout_reservations_order_id_fkey"
  FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
