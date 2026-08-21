-- CreateEnum
CREATE TYPE "AdminNotificationSeverity" AS ENUM ('Info', 'Success', 'Warning', 'Error');

-- CreateEnum
CREATE TYPE "AdminNotificationDeliveryMode" AS ENUM ('Inbox', 'Toast', 'InboxAndToast');

-- CreateTable
CREATE TABLE "admin_notifications" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "link" VARCHAR(500),
    "severity" "AdminNotificationSeverity" NOT NULL DEFAULT 'Info',
    "delivery_mode" "AdminNotificationDeliveryMode" NOT NULL DEFAULT 'Inbox',
    "metadata" JSONB,
    "dedupe_key" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_notification_recipients" (
    "notification_id" TEXT NOT NULL,
    "admin_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_notification_recipients_pkey" PRIMARY KEY ("notification_id","admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_notifications_dedupe_key_key" ON "admin_notifications"("dedupe_key");
CREATE INDEX "admin_notifications_created_at_idx" ON "admin_notifications"("created_at");
CREATE INDEX "admin_notification_recipients_admin_id_read_at_created_at_idx" ON "admin_notification_recipients"("admin_id", "read_at", "created_at");

-- AddForeignKey
ALTER TABLE "admin_notification_recipients" ADD CONSTRAINT "admin_notification_recipients_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "admin_notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "admin_notification_recipients" ADD CONSTRAINT "admin_notification_recipients_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;
