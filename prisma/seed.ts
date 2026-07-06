// Prisma 7 seed script — chạy thủ công bằng: yarn db:seed
import { config as loadEnv } from 'dotenv';
import { hashSync } from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

loadEnv({ path: `.env.${process.env.NODE_ENV ?? 'development'}` });

const PERMISSIONS = [
  // Admin
  { action: 'admin:view', description: 'Xem danh sách admin' },
  { action: 'admin:create', description: 'Tạo admin mới' },
  { action: 'admin:update', description: 'Cập nhật admin' },
  { action: 'admin:delete', description: 'Xóa admin' },
  // Role & Permission
  { action: 'role:view', description: 'Xem roles và permissions' },
  { action: 'role:create', description: 'Tạo role mới' },
  { action: 'role:update', description: 'Cập nhật role' },
  { action: 'role:delete', description: 'Xóa role' },
  // User
  { action: 'user:view', description: 'Xem danh sách khách hàng' },
  { action: 'user:create', description: 'Tạo khách hàng' },
  { action: 'user:update', description: 'Cập nhật khách hàng' },
  { action: 'user:delete', description: 'Xóa khách hàng' },
  // Address
  { action: 'address:view', description: 'Xem địa chỉ khách hàng' },
  { action: 'address:create', description: 'Tạo địa chỉ khách hàng' },
  { action: 'address:update', description: 'Cập nhật địa chỉ khách hàng' },
  { action: 'address:delete', description: 'Xóa địa chỉ khách hàng' },
  // Affiliate
  { action: 'affiliate:view', description: 'Xem affiliate' },
  { action: 'affiliate:create', description: 'Tạo affiliate' },
  { action: 'affiliate:update', description: 'Cập nhật affiliate/hoa hồng/rút tiền' },
  { action: 'affiliate:delete', description: 'Xóa affiliate' },
  // Banner
  { action: 'banner:view', description: 'Xem banner' },
  { action: 'banner:create', description: 'Tạo banner' },
  { action: 'banner:update', description: 'Cập nhật banner' },
  { action: 'banner:delete', description: 'Xóa banner' },
  // Billing
  { action: 'billing:view', description: 'Xem số dư/gói dịch vụ SionHub' },
  { action: 'billing:create', description: 'Tạo đơn thanh toán SionHub' },
  { action: 'billing:update', description: 'Cập nhật billing' },
  { action: 'billing:delete', description: 'Xóa billing' },
  // Campaign
  { action: 'campaign:view', description: 'Xem chiến dịch gửi tin' },
  { action: 'campaign:create', description: 'Tạo chiến dịch gửi tin' },
  { action: 'campaign:update', description: 'Cập nhật chiến dịch gửi tin' },
  { action: 'campaign:delete', description: 'Xóa chiến dịch gửi tin' },
  { action: 'campaign:export', description: 'Xuất log chiến dịch' },
  // Category
  { action: 'category:view', description: 'Xem danh mục' },
  { action: 'category:create', description: 'Tạo danh mục' },
  { action: 'category:update', description: 'Cập nhật danh mục' },
  { action: 'category:delete', description: 'Xóa danh mục' },
  // Dashboard
  { action: 'dashboard:view', description: 'Xem dashboard/báo cáo' },
  // Flash sale
  { action: 'flash-sale:view', description: 'Xem flash sale' },
  { action: 'flash-sale:create', description: 'Tạo flash sale' },
  { action: 'flash-sale:update', description: 'Cập nhật flash sale' },
  { action: 'flash-sale:delete', description: 'Xóa flash sale' },
  // Order
  { action: 'order:view', description: 'Xem đơn hàng' },
  { action: 'order:create', description: 'Tạo đơn hàng' },
  { action: 'order:update', description: 'Cập nhật đơn hàng' },
  { action: 'order:delete', description: 'Xóa đơn hàng' },
  { action: 'order:update_status', description: 'Cập nhật trạng thái đơn hàng' },
  { action: 'order:update_tracking', description: 'Cập nhật mã vận đơn' },
  // Product
  { action: 'product:view', description: 'Xem sản phẩm' },
  { action: 'product:create', description: 'Tạo sản phẩm' },
  { action: 'product:update', description: 'Cập nhật sản phẩm' },
  { action: 'product:delete', description: 'Xóa sản phẩm' },
  // Review
  { action: 'review:view', description: 'Xem đánh giá sản phẩm' },
  { action: 'review:create', description: 'Tạo đánh giá sản phẩm' },
  { action: 'review:update', description: 'Cập nhật đánh giá sản phẩm' },
  { action: 'review:delete', description: 'Xóa đánh giá sản phẩm' },
  // Upload
  { action: 'upload:view', description: 'Xem file upload' },
  { action: 'upload:create', description: 'Upload file' },
  { action: 'upload:update', description: 'Cập nhật file upload' },
  { action: 'upload:delete', description: 'Xóa file upload' },
  // Variant
  { action: 'variant:view', description: 'Xem biến thể sản phẩm' },
  { action: 'variant:create', description: 'Tạo biến thể sản phẩm' },
  { action: 'variant:update', description: 'Cập nhật biến thể sản phẩm' },
  { action: 'variant:delete', description: 'Xóa biến thể sản phẩm' },
  // Voucher
  { action: 'voucher:view', description: 'Xem voucher' },
  { action: 'voucher:create', description: 'Tạo voucher' },
  { action: 'voucher:update', description: 'Cập nhật voucher' },
  { action: 'voucher:delete', description: 'Xóa voucher' },
  // Zalo / ZBS / SionHub messaging
  { action: 'zalo:view', description: 'Xem cấu hình, template và dữ liệu Zalo/SionHub' },
  { action: 'zalo:create', description: 'Tạo dữ liệu Zalo/SionHub' },
  { action: 'zalo:update', description: 'Cập nhật dữ liệu Zalo/SionHub' },
  { action: 'zalo:delete', description: 'Xóa dữ liệu Zalo/SionHub' },
  { action: 'zalo:send_message', description: 'Gửi tin Zalo/ZBS qua SionHub' },
  // Zalo video
  { action: 'zalo-video:view', description: 'Xem Zalo video' },
  { action: 'zalo-video:create', description: 'Tạo Zalo video' },
  { action: 'zalo-video:update', description: 'Cập nhật Zalo video' },
  { action: 'zalo-video:delete', description: 'Xóa Zalo video' },
  // ZBS
  { action: 'zbs:view', description: 'Xem template/quota ZBS' },
  { action: 'zbs:send', description: 'Gửi chiến dịch ZBS' },
  // Salework
  { action: 'salework:view', description: 'Xem dữ liệu Salework' },
  { action: 'salework:create', description: 'Tạo đơn Salework' },
  { action: 'salework:warehouse', description: 'Thao tác nhập/xuất/hoàn kho Salework' },
  { action: 'salework:banking', description: 'Thao tác merchant/công nợ/QR Salework Banking' },
];

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is not set');

  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  // 1. Permissions
  for (const p of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { action: p.action },
      update: { description: p.description },
      create: p,
    });
  }
  console.log(`✓ ${PERMISSIONS.length} permissions`);

  const allPermissions = await prisma.permission.findMany();

  // 2. Role Super Admin
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: {},
    create: { name: 'Super Admin', description: 'Toàn quyền hệ thống' },
  });

  // 3. Gán tất cả permissions vào role (idempotent)
  for (const p of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: p.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: p.id },
    });
  }

  // 4. Admin accounts
  const specialAdmins = [
    {
      username: 'superadmin',
      password: 'superadmin',
      name: 'Super Admin',
      email: 'bboy2184@gmail.com',
    },
    {
      username: 'mhhome',
      password: 'mhhome',
      name: 'MH Home',
      email: 'mhhomedevice@gmail.com',
    },
  ];

  for (const specialAdmin of specialAdmins) {
    const admin = await prisma.admin.upsert({
      where: { username: specialAdmin.username },
      update: {},
      create: {
        username: specialAdmin.username,
        password: hashSync(specialAdmin.password, 10),
        name: specialAdmin.name,
        email: specialAdmin.email,
      },
    });

    // 5. Link admin → role
    await prisma.adminRole.upsert({
      where: { adminId_roleId: { adminId: admin.id, roleId: superAdminRole.id } },
      update: {},
      create: { adminId: admin.id, roleId: superAdminRole.id },
    });
  }

  console.log('✓ Role: Super all permissions initialized');

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
