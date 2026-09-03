ALTER TYPE "ShippingProvider" ADD VALUE IF NOT EXISTS 'VTP';

ALTER TABLE "orders"
ADD COLUMN "shipping_provider" "ShippingProvider" NOT NULL DEFAULT 'SPX',
ADD COLUMN "shipping_quote_snapshot" JSONB;

ALTER TABLE "shipping_orders"
ADD COLUMN "provider_service_code" VARCHAR(50),
ADD COLUMN "provider_service_name" VARCHAR(150),
ADD COLUMN "expected_delivery" VARCHAR(150);

ALTER TABLE "shipping_webhook_events"
ADD COLUMN "attempt_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "error_message" TEXT;
