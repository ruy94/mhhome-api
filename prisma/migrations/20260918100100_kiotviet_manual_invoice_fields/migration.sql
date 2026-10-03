ALTER TABLE "kiotviet_outbox_logs"
  ADD COLUMN "sold_by_id" VARCHAR(30),
  ADD COLUMN "selected_by_admin_id" VARCHAR(50),
  ADD COLUMN "selected_at" TIMESTAMP(3),
  ADD COLUMN "stock_refreshed_at" TIMESTAMP(3);

ALTER TABLE "kiotviet_outbox_logs"
  ALTER COLUMN "status" SET DEFAULT 'WAITING_SELLER';

-- Legacy pending rows have no selected seller; keep them behind the manual gate.
UPDATE "kiotviet_outbox_logs"
SET "status" = 'WAITING_SELLER', "updated_at" = CURRENT_TIMESTAMP
WHERE "status" = 'PENDING' AND "sold_by_id" IS NULL;
