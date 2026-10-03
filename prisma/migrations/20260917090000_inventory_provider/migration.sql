CREATE TYPE "InventoryProvider" AS ENUM ('LOCAL', 'SALEWORK', 'KIOTVIET');

ALTER TABLE "variants"
  ADD COLUMN "inventory_provider" "InventoryProvider" NOT NULL DEFAULT 'LOCAL',
  ADD COLUMN "kiotviet_linked_at" TIMESTAMP(3);

UPDATE "variants" SET "inventory_provider" = 'SALEWORK'
  WHERE "salework_product_code" IS NOT NULL AND "salework_warehouse_id" IS NOT NULL;

UPDATE "variants" SET "inventory_provider" = 'KIOTVIET'
  WHERE "kiotviet_product_code" IS NOT NULL AND "kiotviet_branch_id" IS NOT NULL;

UPDATE "variants" SET "kiotviet_linked_at" = NOW()
  WHERE "inventory_provider" = 'KIOTVIET';
