CREATE TYPE "KiotVietOutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'UNCERTAIN');
CREATE TYPE "KiotVietOutboxOperation" AS ENUM ('CREATE_INVOICE');

CREATE TABLE "kiotviet_outbox_logs" (
  "id" SERIAL PRIMARY KEY,
  "order_id" INTEGER NOT NULL REFERENCES "orders"("id"),
  "operation" "KiotVietOutboxOperation" NOT NULL,
  "business_key" VARCHAR(150) NOT NULL UNIQUE,
  "payload_hash" VARCHAR(64) NOT NULL,
  "status" "KiotVietOutboxStatus" NOT NULL DEFAULT 'PENDING',
  "request_payload" JSONB NOT NULL,
  "response_payload" JSONB,
  "external_id" VARCHAR(100),
  "external_code" VARCHAR(100),
  "error_message" VARCHAR(1000),
  "attempt_count" INTEGER NOT NULL DEFAULT 0,
  "locked_at" TIMESTAMP(3),
  "completed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "kiotviet_outbox_logs_status_created_at_idx" ON "kiotviet_outbox_logs"("status", "created_at");
CREATE INDEX "kiotviet_outbox_logs_order_id_operation_idx" ON "kiotviet_outbox_logs"("order_id", "operation");
