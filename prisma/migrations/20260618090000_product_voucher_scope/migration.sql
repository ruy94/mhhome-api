-- CreateEnum
CREATE TYPE "VoucherScope" AS ENUM ('Order', 'Product', 'Shipping');

-- AlterTable
ALTER TABLE "vouchers" ADD COLUMN "scope" "VoucherScope" NOT NULL DEFAULT 'Order';
UPDATE "vouchers" SET "scope" = 'Shipping' WHERE "type" = 'Freeship';

-- AlterTable
ALTER TABLE "orders" ADD COLUMN "item_voucher_discount" DECIMAL(15,0) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "order_products"
  ADD COLUMN "item_voucher_id" INTEGER,
  ADD COLUMN "item_voucher_type" "DiscountType",
  ADD COLUMN "item_voucher_value" DECIMAL(15,0),
  ADD COLUMN "item_voucher_discount" DECIMAL(15,0) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "voucher_products" (
  "voucher_id" INTEGER NOT NULL,
  "product_id" INTEGER NOT NULL,

  CONSTRAINT "voucher_products_pkey" PRIMARY KEY ("voucher_id", "product_id")
);

-- CreateIndex
CREATE INDEX "voucher_products_product_id_idx" ON "voucher_products"("product_id");

-- AddForeignKey
ALTER TABLE "order_products" ADD CONSTRAINT "order_products_item_voucher_id_fkey" FOREIGN KEY ("item_voucher_id") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_products" ADD CONSTRAINT "voucher_products_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "voucher_products" ADD CONSTRAINT "voucher_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
