/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserPlatform" AS ENUM ('ZaloMiniApp', 'Website');

-- AlterEnum
ALTER TYPE "ConditionType" ADD VALUE 'Website';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" VARCHAR(255),
ADD COLUMN     "email_verified_at" TIMESTAMP(3),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_guest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_from" "UserPlatform",
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "phone_normalized" VARCHAR(20),
ADD COLUMN     "phone_verified_at" TIMESTAMP(3),
ADD COLUMN     "registered_from" "UserPlatform" NOT NULL DEFAULT 'ZaloMiniApp',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_normalized_idx" ON "users"("phone_normalized");

-- CreateIndex
CREATE INDEX "users_registered_from_idx" ON "users"("registered_from");
