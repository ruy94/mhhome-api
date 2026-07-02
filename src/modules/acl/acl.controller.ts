import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { ResponseMessage } from '../../common/decorators/response-message.decorator.js';
import { AclService } from './acl.service.js';
import { CreateRoleDto } from './dto/create-role.dto.js';
import { UpdateRoleDto } from './dto/update-role.dto.js';

@ApiTags('acl')
@ApiBearerAuth()
@Controller('acl')
export class AclController {
  constructor(private readonly aclService: AclService) {}

  // ── Permissions ────────────────────────────────────────────────
  @Get('permissions')
  @RequirePermissions('role:view')
  @ApiOperation({ summary: 'Danh sách tất cả permissions trong hệ thống' })
  findAllPermissions() {
    return this.aclService.findAllPermissions();
  }

  // ── Roles ──────────────────────────────────────────────────────
  @Get('roles')
  @RequirePermissions('role:view')
  @ApiOperation({ summary: 'Danh sách roles (kèm số lượng admin và permissions)' })
  findAllRoles() {
    return this.aclService.findAllRoles();
  }

  @Get('roles/:id')
  @RequirePermissions('role:view')
  @ApiOperation({ summary: 'Chi tiết một role' })
  findOneRole(@Param('id') id: string) {
    return this.aclService.findOneRole(id);
  }

  @Post('roles')
  @RequirePermissions('role:create')
  @ResponseMessage('Role created successfully')
  @ApiOperation({ summary: 'Tạo role mới' })
  createRole(@Body() dto: CreateRoleDto) {
    return this.aclService.createRole(dto);
  }

  @Put('roles/:id')
  @RequirePermissions('role:update')
  @ResponseMessage('Role updated successfully')
  @ApiOperation({ summary: 'Cập nhật role' })
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.aclService.updateRole(id, dto);
  }

  @Delete('roles/:id')
  @RequirePermissions('role:delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa role (không được xóa nếu đang gán cho admin)' })
  removeRole(@Param('id') id: string) {
    return this.aclService.removeRole(id);
  }
}
