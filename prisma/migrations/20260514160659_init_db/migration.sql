-- CreateEnum
CREATE TYPE "WarrantyType" AS ENUM ('Days', 'Months', 'Years');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('COD', 'ZaloPay');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('Pending', 'Prepare', 'Delivering', 'Paid', 'Refund', 'Cancel');

-- CreateEnum
CREATE TYPE "OrderPlatform" AS ENUM ('ZaloMiniApp', 'Website');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('Normal', 'Freeship', 'Secret', 'Hidden');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('Fixed', 'Percentage');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('ZaloMiniApp', 'Tiktok', 'Shopee', 'Facebook');

-- CreateEnum
CREATE TYPE "FlashSaleStatus" AS ENUM ('Upcoming', 'Active', 'Ended');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AffiliateStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Suspended');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Paid');

-- CreateEnum
CREATE TYPE "WithdrawalStatus" AS ENUM ('Pending', 'Processing', 'Completed', 'Rejected');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "admin_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("admin_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "service_credentials" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "api_key" TEXT NOT NULL DEFAULT '',
    "webhook_secret" TEXT,
    "rotated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" SERIAL NOT NULL,
    "ad_banners" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cam_banners" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zalo_videos" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER,
    "product_link" TEXT,
    "title" VARCHAR(255),
    "video_url" VARCHAR(255) NOT NULL,
    "video_thumbnail" VARCHAR(255) NOT NULL,
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "zalo_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "zalo_id" TEXT,
    "id_by_oa" TEXT,
    "name" VARCHAR(255),
    "phone" VARCHAR(70),
    "avatar" VARCHAR(255),
    "followed_oa" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "cnee_name" VARCHAR(255),
    "cnee_phone" VARCHAR(70),
    "id_city" VARCHAR(20),
    "id_district" VARCHAR(20),
    "id_ward" VARCHAR(20),
    "city" VARCHAR(70),
    "district" VARCHAR(70),
    "ward" VARCHAR(70),
    "full_addr" VARCHAR(255),
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255) NOT NULL,
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER[],
    "name" VARCHAR(255) NOT NULL,
    "detail" TEXT NOT NULL,
    "image" VARCHAR(255)[],
    "video_url" VARCHAR(255),
    "video_thumbnail" VARCHAR(255),
    "source" VARCHAR(255),
    "warranty" INTEGER,
    "warranty_type" "WarrantyType",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fake_sold" INTEGER,
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,
    "tier_variations" JSONB,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variants" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "image" VARCHAR(255),
    "base_price" DECIMAL(15,0),
    "original_price" DECIMAL(15,0) NOT NULL,
    "stock" INTEGER NOT NULL,
    "is_deleted" INTEGER NOT NULL DEFAULT 0,
    "dimensions" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_products" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "variant_id" INTEGER,
    "original_price" DECIMAL(15,0) NOT NULL,
    "final_price" DECIMAL(15,0) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "flash_sale_id" INTEGER,
    "flash_sale_type" "DiscountType",
    "flash_sale_value" DECIMAL(65,30),

    CONSTRAINT "order_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "tracking_code" TEXT,
    "user_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "product_voucher_id" INTEGER,
    "delivery_voucher_id" INTEGER,
    "est_amount" DECIMAL(15,0) NOT NULL,
    "product_discount" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "delivery_fee" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "delivery_discount" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "delivery_amount" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(15,0) NOT NULL,
    "affiliate_code" VARCHAR(50),
    "affiliate_product_id" INTEGER,
    "status" "OrderStatus" NOT NULL DEFAULT 'Pending',
    "payment_method" "PaymentMethod" NOT NULL DEFAULT 'COD',
    "platform" "OrderPlatform" NOT NULL DEFAULT 'ZaloMiniApp',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Chương trình khuyến mãi',
    "type" "VoucherType" NOT NULL DEFAULT 'Normal',
    "discount_type" "DiscountType" NOT NULL,
    "discount_value" DECIMAL(15,0) NOT NULL,
    "max_discount" DECIMAL(15,0),
    "min_order_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "usage_limit" INTEGER,
    "used_count" INTEGER NOT NULL DEFAULT 0,
    "limit_per_user" INTEGER NOT NULL DEFAULT 1,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,
    "condition_type" "ConditionType" NOT NULL DEFAULT 'ZaloMiniApp',

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vouchers" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "user_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_sales" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "FlashSaleStatus" NOT NULL DEFAULT 'Upcoming',
    "is_deleted" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "flash_sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flash_sale_items" (
    "id" SERIAL NOT NULL,
    "flash_sale_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "discount_type" "DiscountType" NOT NULL,
    "discount_percent" INTEGER,
    "sale_price" INTEGER,
    "sale_stock" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "flash_sale_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "customer_name" VARCHAR(50),
    "customer_avatar" VARCHAR(255),
    "rating" INTEGER,
    "comment" TEXT,
    "image" VARCHAR(255)[],
    "video_url" VARCHAR(255),
    "video_thumbnail" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "provider_campaign_id" TEXT,
    "template_id" VARCHAR(50),
    "total" INTEGER NOT NULL,
    "sent" INTEGER NOT NULL DEFAULT 0,
    "success" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "cost" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "status" "CampaignStatus" NOT NULL DEFAULT 'PROCESSING',
    "fail_reason" TEXT,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliates" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "ref_code" VARCHAR(50) NOT NULL,
    "status" "AffiliateStatus" NOT NULL DEFAULT 'Pending',
    "commission_rate" INTEGER NOT NULL DEFAULT 5,
    "bank_name" VARCHAR(100),
    "bank_account" VARCHAR(50),
    "bank_holder" VARCHAR(100),
    "total_earned" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "total_withdrawn" DECIMAL(15,0) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_commissions" (
    "id" SERIAL NOT NULL,
    "affiliate_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_amount" DECIMAL(15,0) NOT NULL,
    "commission_rate" INTEGER NOT NULL,
    "commission_amount" DECIMAL(15,0) NOT NULL,
    "status" "CommissionStatus" NOT NULL DEFAULT 'Pending',
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_withdrawals" (
    "id" SERIAL NOT NULL,
    "affiliate_id" INTEGER NOT NULL,
    "amount" DECIMAL(15,0) NOT NULL,
    "status" "WithdrawalStatus" NOT NULL DEFAULT 'Pending',
    "bank_name" VARCHAR(100) NOT NULL,
    "bank_account" VARCHAR(50) NOT NULL,
    "bank_holder" VARCHAR(100) NOT NULL,
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "affiliate_withdrawals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_key" ON "permissions"("action");

-- CreateIndex
CREATE UNIQUE INDEX "service_credentials_service_key" ON "service_credentials"("service");

-- CreateIndex
CREATE UNIQUE INDEX "users_zalo_id_key" ON "users"("zalo_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_by_oa_key" ON "users"("id_by_oa");

-- CreateIndex
CREATE UNIQUE INDEX "orders_code_key" ON "orders"("code");

-- CreateIndex
CREATE UNIQUE INDEX "vouchers_code_key" ON "vouchers"("code");

-- CreateIndex
CREATE INDEX "vouchers_code_idx" ON "vouchers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "flash_sale_items_flash_sale_id_variant_id_key" ON "flash_sale_items"("flash_sale_id", "variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_provider_campaign_id_key" ON "campaigns"("provider_campaign_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_user_id_key" ON "affiliates"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliates_ref_code_key" ON "affiliates"("ref_code");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_commissions_order_id_key" ON "affiliate_commissions"("order_id");

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_roles" ADD CONSTRAINT "admin_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_product_voucher_id_fkey" FOREIGN KEY ("product_voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_voucher_id_fkey" FOREIGN KEY ("delivery_voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_items" ADD CONSTRAINT "flash_sale_items_flash_sale_id_fkey" FOREIGN KEY ("flash_sale_id") REFERENCES "flash_sales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flash_sale_items" ADD CONSTRAINT "flash_sale_items_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliates" ADD CONSTRAINT "affiliates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_commissions" ADD CONSTRAINT "affiliate_commissions_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_withdrawals" ADD CONSTRAINT "affiliate_withdrawals_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
