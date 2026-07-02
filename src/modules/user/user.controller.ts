import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { CreateWebsiteUserDto } from './dto/create-website-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UpdateWebsiteUserDto } from './dto/update-website-user.dto.js';
import { UserPageOptionsDto } from './dto/user-page-options.dto.js';
import { UserService } from './user.service.js';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RequirePermissions('user:view')
  @ApiOperation({ summary: 'Danh sách user (có phân trang và tìm kiếm)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'registeredFrom', required: false, enum: ['ZaloMiniApp', 'Website'] })
  findAll(@Query() pageOptionsDto: UserPageOptionsDto) {
    return this.userService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('user:view')
  @ApiOperation({ summary: 'Chi tiết một user' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @RequirePermissions('user:create')
  @ApiOperation({ summary: 'Tạo user mới' })
  create(@Body() data: CreateUserDto | CreateWebsiteUserDto) {
    return this.userService.create(data);
  }

  @Put(':id')
  @RequirePermissions('user:update')
  @ApiOperation({ summary: 'Cập nhật thông tin user' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto | UpdateWebsiteUserDto,
  ) {
    return this.userService.update(id, data as UpdateUserDto);
  }
}
