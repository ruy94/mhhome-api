import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { AdminService } from './admin.service.js';
import { CreateAdminDto } from './dto/create-admin.dto.js';
import { UpdateAdminDto } from './dto/update-admin.dto.js';

@ApiTags('admins')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @RequirePermissions('admin:view')
  @ApiOperation({ summary: 'Danh sách admin (có phân trang và tìm kiếm)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return this.adminService.findAll(pageOptionsDto);
  }

  @Get('roles')
  @RequirePermissions('role:view')
  @ApiOperation({ summary: 'Danh sách roles (dùng cho dropdown)' })
  getRoles() {
    return this.adminService.getRoles();
  }

  @Get(':id')
  @RequirePermissions('admin:view')
  @ApiOperation({ summary: 'Chi tiết một admin' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Post()
  @RequirePermissions('admin:create')
  @ApiOperation({ summary: 'Tạo admin mới' })
  @ResponseMessage('Admin created successfully')
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Patch(':id')
  @RequirePermissions('admin:update')
  @ApiOperation({ summary: 'Cập nhật thông tin admin' })
  @ResponseMessage('Admin updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
    return this.adminService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('admin:delete')
  @ApiOperation({ summary: 'Xóa admin' })
  @ResponseMessage('Admin deleted successfully')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
