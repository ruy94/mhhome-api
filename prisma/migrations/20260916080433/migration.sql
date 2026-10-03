-- AlterTable
ALTER TABLE "shipping_batches" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "shipping_orders" ALTER COLUMN "updated_at" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "marketplace_cart_items_user_id_listing_id_source_variant_id_pla" RENAME TO "marketplace_cart_items_user_id_listing_id_source_variant_id_key";

-- RenameIndex
ALTER INDEX "marketplace_inventory_reservations_reservation_id_variant_id_ke" RENAME TO "marketplace_inventory_reservations_reservation_id_variant_i_key";
