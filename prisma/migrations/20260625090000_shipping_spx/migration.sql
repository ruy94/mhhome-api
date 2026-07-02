-- Add package dimensions to variants
ALTER TABLE "variants"
  ADD COLUMN "package_weight_grams" INTEGER NOT NULL DEFAULT 300,
  ADD COLUMN "package_length_cm" DECIMAL(8,2),
  ADD COLUMN "package_width_cm" DECIMAL(8,2),
  ADD COLUMN "package_height_cm" DECIMAL(8,2);

CREATE TYPE "ShippingProvider" AS ENUM ('SPX', 'JNT');
CREATE TYPE "ShippingOrderStatus" AS ENUM ('Estimated', 'Pending', 'Created', 'Failed', 'Cancelled');

CREATE TABLE "shipping_batches" (
  "id" SERIAL PRIMARY KEY,
  "provider" "ShippingProvider" NOT NULL,
  "provider_batch_no" VARCHAR(80),
  "task_status" INTEGER,
  "status" VARCHAR(50),
  "progress" VARCHAR(30),
  "total_count" INTEGER,
  "success_count" INTEGER,
  "fail_count" INTEGER,
  "request_payload" JSONB,
  "response_payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "shipping_batches_provider_batch_no_key" ON "shipping_batches"("provider_batch_no");

CREATE TABLE "shipping_orders" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL,
  "batch_id" INTEGER,
  "provider" "ShippingProvider" NOT NULL,
  "status" "ShippingOrderStatus" NOT NULL DEFAULT 'Estimated',
  "provider_order_id" VARCHAR(80),
  "tracking_no" VARCHAR(80),
  "tracking_link" VARCHAR(255),
  "provider_status" VARCHAR(100),
  "provider_status_code" VARCHAR(50),
  "tracking_synced_at" TIMESTAMP(3),
  "estimated_fee" DECIMAL(15,0),
  "actual_fee" DECIMAL(15,0),
  "latest_chargeable_weight" DECIMAL(10,3),
  "latest_actual_weight" DECIMAL(10,3),
  "latest_chargeable_parcel_length" DECIMAL(8,2),
  "latest_chargeable_parcel_width" DECIMAL(8,2),
  "latest_chargeable_parcel_height" DECIMAL(8,2),
  "driver_phone_number" VARCHAR(50),
  "request_payload" JSONB,
  "response_payload" JSONB,
  "error_message" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "shipping_orders_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "shipping_orders_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "shipping_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "shipping_orders_order_id_idx" ON "shipping_orders"("order_id");
CREATE INDEX "shipping_orders_batch_id_idx" ON "shipping_orders"("batch_id");
CREATE INDEX "shipping_orders_tracking_no_idx" ON "shipping_orders"("tracking_no");


CREATE TABLE "shipping_events" (
  "id" SERIAL PRIMARY KEY,
  "shipping_order_id" INTEGER,
  "provider" "ShippingProvider" NOT NULL,
  "provider_event_id" VARCHAR(160),
  "tracking_no" VARCHAR(80),
  "provider_order_id" VARCHAR(80),
  "event_type" VARCHAR(80) NOT NULL,
  "status" VARCHAR(100),
  "status_code" VARCHAR(50),
  "message" TEXT,
  "happened_at" TIMESTAMP(3),
  "raw_payload" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "shipping_events_shipping_order_id_fkey" FOREIGN KEY ("shipping_order_id") REFERENCES "shipping_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "shipping_events_provider_provider_event_id_key" ON "shipping_events"("provider", "provider_event_id");
CREATE INDEX "shipping_events_shipping_order_id_idx" ON "shipping_events"("shipping_order_id");
CREATE INDEX "shipping_events_tracking_no_idx" ON "shipping_events"("tracking_no");
CREATE INDEX "shipping_events_provider_order_id_idx" ON "shipping_events"("provider_order_id");

CREATE TABLE "shipping_webhook_events" (
  "id" SERIAL PRIMARY KEY,
  "provider" "ShippingProvider" NOT NULL,
  "event_id" VARCHAR(160),
  "event_type" VARCHAR(80) NOT NULL,
  "payload_hash" VARCHAR(64) NOT NULL,
  "raw_payload" JSONB,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX "shipping_webhook_events_payload_hash_key" ON "shipping_webhook_events"("payload_hash");
CREATE INDEX "shipping_webhook_events_event_type_idx" ON "shipping_webhook_events"("event_type");
CREATE INDEX "shipping_webhook_events_event_id_idx" ON "shipping_webhook_events"("event_id");
