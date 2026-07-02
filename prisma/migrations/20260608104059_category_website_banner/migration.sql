/*
  Warnings:

  - Added the required column `website_image` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "website_image" VARCHAR(255) NOT NULL;
