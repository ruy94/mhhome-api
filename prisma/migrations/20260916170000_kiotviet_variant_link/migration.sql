ALTER TABLE "variants"
  ADD COLUMN "kiotviet_product_code" VARCHAR(255),
  ADD COLUMN "kiotviet_branch_id" INTEGER;

CREATE UNIQUE INDEX "variants_kiotviet_product_code_kiotviet_branch_id_key"
  ON "variants"("kiotviet_product_code", "kiotviet_branch_id");
