CREATE TABLE "marketplace_cart_items" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "listing_id" UUID NOT NULL,
    "source_shop_id" UUID NOT NULL,
    "source_shop_code" VARCHAR(50) NOT NULL,
    "source_shop_name" VARCHAR(255) NOT NULL,
    "source_product_id" VARCHAR(100) NOT NULL,
    "source_variant_id" VARCHAR(100) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "platform" "OrderPlatform" NOT NULL DEFAULT 'ZaloMiniApp',
    "product_snapshot" JSONB NOT NULL,
    "variant_snapshot" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_cart_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "marketplace_cart_items_user_id_listing_id_source_variant_id_platform_key"
ON "marketplace_cart_items"("user_id", "listing_id", "source_variant_id", "platform");

CREATE INDEX "marketplace_cart_items_user_id_platform_idx"
ON "marketplace_cart_items"("user_id", "platform");

CREATE INDEX "marketplace_cart_items_source_shop_id_idx"
ON "marketplace_cart_items"("source_shop_id");

ALTER TABLE "marketplace_cart_items"
ADD CONSTRAINT "marketplace_cart_items_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "marketplace_customer_identities" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "marketplace_customer_identities_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "marketplace_customer_identities_user_id_key"
ON "marketplace_customer_identities"("user_id");

ALTER TABLE "marketplace_customer_identities"
ADD CONSTRAINT "marketplace_customer_identities_user_id_fkey"
FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
