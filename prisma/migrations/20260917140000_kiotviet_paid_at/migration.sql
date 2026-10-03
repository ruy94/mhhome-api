ALTER TABLE "orders" ADD COLUMN "kiotviet_paid_at" TIMESTAMP(3);
CREATE INDEX "orders_kiotviet_paid_at_idx" ON "orders" ("kiotviet_paid_at");
