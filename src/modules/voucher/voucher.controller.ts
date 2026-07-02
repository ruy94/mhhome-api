import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { VoucherService } from './voucher.service.js';
import { CreateVoucherDto } from './dto/create-voucher.dto.js';
import { UpdateVoucherDto } from './dto/update-voucher.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { VoucherQueryDto } from './dto/voucher-query.dto.js';

@Controller('vouchers')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get()
  @RequirePermissions('voucher:view')
  async findAll(@Query() pageOptionsDto: VoucherQueryDto) {
    return await this.voucherService.findAll(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('voucher:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.voucherService.findOne(id);
  }

  @Post()
  @RequirePermissions('voucher:create')
  async create(@Body() data: CreateVoucherDto) {
    return await this.voucherService.create(data);
  }

  @Put(':id')
  @RequirePermissions('voucher:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVoucherDto) {
    return await this.voucherService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('voucher:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.voucherService.remove(id);
  }
}
