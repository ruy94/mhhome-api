-- CreateEnum
CREATE TYPE "MarketplaceOutboxEventType" AS ENUM ('ProductUpsert', 'ProductDeleted');

-- CreateEnum
CREATE TYPE "MarketplaceOutboxStatus" AS ENUM ('Pending', 'Processing', 'Success', 'Failed');

-- AlterTable
ALTER TABLE "products" ADD COLUMN "marketplace_sequence" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "marketplace_outbox_logs" (
    "id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "event_type" "MarketplaceOutboxEventType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "MarketplaceOutboxStatus" NOT NULL DEFAULT 'Pending',
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "next_attempt_at" TIMESTAMP(3),
    "last_error" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marketplace_outbox_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "marketplace_outbox_logs_product_id_sequence_key"
ON "marketplace_outbox_logs"("product_id", "sequence");

CREATE INDEX "marketplace_outbox_logs_status_next_attempt_at_idx"
ON "marketplace_outbox_logs"("status", "next_attempt_at");

ALTER TABLE "marketplace_outbox_logs"
ADD CONSTRAINT "marketplace_outbox_logs_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
