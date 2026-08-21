CREATE TYPE "ShippingManagedBy" AS ENUM ('Local', 'Marketplace');

ALTER TYPE "MarketplaceReservationStatus" ADD VALUE 'Returned';

ALTER TABLE "shipping_orders"
ADD COLUMN "managed_by" "ShippingManagedBy" NOT NULL DEFAULT 'Local',
ADD COLUMN "marketplace_shipment_id" TEXT;

ALTER TABLE "marketplace_checkout_reservations"
ADD COLUMN "returned_at" TIMESTAMP(3);

CREATE UNIQUE INDEX "shipping_orders_marketplace_shipment_id_key"
ON "shipping_orders"("marketplace_shipment_id");

CREATE INDEX "shipping_orders_managed_by_tracking_no_idx"
ON "shipping_orders"("managed_by", "tracking_no");
