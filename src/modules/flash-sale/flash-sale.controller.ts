import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service.js';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto.js';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { FlashSaleStatus } from '../../generated/prisma/client.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';

@Controller('flash-sales')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Get()
  @RequirePermissions('flash-sale:view')
  async getFlashSales(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.flashSaleService.getFlashSales(pageOptionsDto);
  }

  @Get(':id')
  @RequirePermissions('flash-sale:view')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.flashSaleService.findOne(id);
  }

  @Post()
  @RequirePermissions('flash-sale:create')
  async create(@Body() dto: CreateFlashSaleDto) {
    return await this.flashSaleService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('flash-sale:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFlashSaleDto) {
    return await this.flashSaleService.update(id, dto);
  }

  @Put(':id/status')
  @RequirePermissions('flash-sale:update')
  async updateFlashSaleStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: FlashSaleStatus,
  ) {
    return await this.flashSaleService.updateFlashSaleStatus(id, status);
  }

  @Delete(':id')
  @RequirePermissions('flash-sale:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.flashSaleService.remove(id);
  }
}
