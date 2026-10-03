INSERT INTO "permissions" ("id", "action", "description") VALUES
  ('kiotviet_view_permission', 'kiotviet:view', 'Xem dữ liệu KiotViet'),
  ('kiotviet_sync_permission', 'kiotviet:sync', 'Liên kết SKU, đồng bộ tồn và quản lý webhook KiotViet'),
  ('kiotviet_write_permission', 'kiotviet:write', 'Xác nhận giao và đối chiếu hóa đơn KiotViet')
ON CONFLICT ("action") DO UPDATE SET "description" = EXCLUDED."description";

INSERT INTO "role_permissions" ("role_id", "permission_id")
SELECT r."id", p."id"
FROM "roles" r
CROSS JOIN "permissions" p
WHERE r."name" = 'Super Admin'
  AND p."action" IN ('kiotviet:view', 'kiotviet:sync', 'kiotviet:write')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
