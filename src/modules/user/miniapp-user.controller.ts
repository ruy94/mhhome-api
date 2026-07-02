import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { DecodePhoneZaloDto } from './dto/decode-phone-zalo.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserService } from './user.service.js';

@ApiTags('miniapp-users')
@Public()
@Controller('miniapp/users')
export class MiniappUserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo hoặc cập nhật user miniapp' })
  async create(@Body() data: CreateUserDto) {
    return this.userService.createOrUpdateMiniappUser(data);
  }

  @Get('decode-phone-zalo')
  @ApiOperation({ summary: 'Giải mã số điện thoại từ Zalo Mini App token' })
  async decodePhoneZalo(@Query() data: DecodePhoneZaloDto) {
    return this.userService.decodePhoneZalo(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết user miniapp' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật user miniapp' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.updateMiniappUser(Number(id), data);
  }
}
