/*
  Warnings:

  - A unique constraint covering the columns `[platform]` on the table `banners` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "banners" ADD COLUMN     "platform" "UserPlatform" NOT NULL DEFAULT 'ZaloMiniApp';

-- CreateIndex
CREATE UNIQUE INDEX "banners_platform_key" ON "banners"("platform");
