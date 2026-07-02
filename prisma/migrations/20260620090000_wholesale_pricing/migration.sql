CREATE TYPE "PricingMode" AS ENUM ('Retail', 'Wholesale');

ALTER TABLE "products" ADD COLUMN "wholesale_enabled" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "variants"
  ADD COLUMN "wholesale_base_price" DECIMAL(15,0),
  ADD COLUMN "wholesale_price" DECIMAL(15,0),
  ADD COLUMN "wholesale_min_quantity" INTEGER;

CREATE TABLE "product_wholesale_users" (
  "product_id" INTEGER NOT NULL,
  "user_id" INTEGER NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "product_wholesale_users_pkey" PRIMARY KEY ("product_id", "user_id")
);

CREATE INDEX "product_wholesale_users_user_id_idx" ON "product_wholesale_users"("user_id");

ALTER TABLE "product_wholesale_users"
  ADD CONSTRAINT "product_wholesale_users_product_id_fkey"
  FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "product_wholesale_users"
  ADD CONSTRAINT "product_wholesale_users_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "cart_items" ADD COLUMN "pricing_mode" "PricingMode" NOT NULL DEFAULT 'Retail';
ALTER TABLE "order_products" ADD COLUMN "pricing_mode" "PricingMode" NOT NULL DEFAULT 'Retail';
