CREATE TABLE "kiotviet_inventories" (
    "product_code" VARCHAR(255) NOT NULL,
    "branch_id" INTEGER NOT NULL,
    "remote_available_stock" INTEGER NOT NULL,
    "available_stock" INTEGER NOT NULL,
    "stock_synced_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiotviet_inventories_pkey" PRIMARY KEY ("product_code")
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM "variants"
        WHERE "kiotviet_product_code" IS NOT NULL
          AND "kiotviet_branch_id" IS NOT NULL
        GROUP BY "kiotviet_product_code"
        HAVING COUNT(DISTINCT "kiotviet_branch_id") > 1
    ) THEN
        RAISE EXCEPTION 'Cannot share KiotViet inventory: one product code is linked to multiple branches';
    END IF;
END $$;

INSERT INTO "kiotviet_inventories" (
    "product_code",
    "branch_id",
    "remote_available_stock",
    "available_stock",
    "stock_synced_at",
    "created_at",
    "updated_at"
)
SELECT
    "kiotviet_product_code",
    MIN("kiotviet_branch_id"),
    MAX("stock"),
    MAX("stock"),
    COALESCE(MAX("kiotviet_stock_synced_at"), CURRENT_TIMESTAMP),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "variants"
WHERE "kiotviet_product_code" IS NOT NULL
  AND "kiotviet_branch_id" IS NOT NULL
GROUP BY "kiotviet_product_code";

DROP INDEX "variants_kiotviet_product_code_kiotviet_branch_id_key";

CREATE INDEX "variants_kiotviet_product_code_kiotviet_branch_id_idx"
    ON "variants"("kiotviet_product_code", "kiotviet_branch_id");

ALTER TABLE "variants"
    ADD CONSTRAINT "variants_kiotviet_product_code_fkey"
    FOREIGN KEY ("kiotviet_product_code")
    REFERENCES "kiotviet_inventories"("product_code")
    ON DELETE RESTRICT
    ON UPDATE CASCADE;
