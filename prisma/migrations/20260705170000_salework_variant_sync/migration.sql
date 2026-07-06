-- CreateEnum
CREATE TYPE "SaleWorkOutboxOperation" AS ENUM ('Export', 'Return');

-- CreateEnum
CREATE TYPE "SaleWorkOutboxStatus" AS ENUM ('Pending', 'Success', 'Failed');

-- AlterTable
ALTER TABLE "variants" ADD COLUMN "salework_product_code" VARCHAR(255), ADD COLUMN "salework_warehouse_id" VARCHAR(255);

-- CreateTable
CREATE TABLE "salework_outbox_logs" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "variant_id" INTEGER NOT NULL,
    "operation" "SaleWorkOutboxOperation" NOT NULL,
    "warehouse_id" VARCHAR(255) NOT NULL,
    "product_code" VARCHAR(255) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "SaleWorkOutboxStatus" NOT NULL DEFAULT 'Pending',
    "request_payload" JSONB,
    "response_payload" JSONB,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salework_outbox_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "variants_salework_product_code_salework_warehouse_id_key" ON "variants"("salework_product_code", "salework_warehouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "salework_outbox_logs_order_id_variant_id_operation_key" ON "salework_outbox_logs"("order_id", "variant_id", "operation");

-- CreateIndex
CREATE INDEX "salework_outbox_logs_status_idx" ON "salework_outbox_logs"("status");

-- CreateIndex
CREATE INDEX "salework_outbox_logs_operation_status_idx" ON "salework_outbox_logs"("operation", "status");

-- AddForeignKey
ALTER TABLE "salework_outbox_logs" ADD CONSTRAINT "salework_outbox_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "salework_outbox_logs" ADD CONSTRAINT "salework_outbox_logs_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
