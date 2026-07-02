import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BannerService } from './banner.service.js';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { UpdateBannerDto } from './dto/update-banner.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { BannerPageOptionsDto } from './dto/banner-page-options.dto.js';

@Controller('banners')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  @RequirePermissions('banner:view')
  async findAll(@Query() pageOptionsDto: BannerPageOptionsDto) {
    return await this.bannerService.findAll(pageOptionsDto, pageOptionsDto.platform);
  }

  @Get(':id')
  @RequirePermissions('banner:view')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptionsDto: BannerPageOptionsDto,
  ) {
    return await this.bannerService.findOne(id, pageOptionsDto.platform);
  }

  @Post()
  @RequirePermissions('banner:create')
  async create(@Body() dto: CreateBannerDto) {
    return await this.bannerService.create(dto);
  }

  @Put(':id')
  @RequirePermissions('banner:update')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBannerDto) {
    return await this.bannerService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('banner:delete')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Query() pageOptionsDto: BannerPageOptionsDto,
  ) {
    return await this.bannerService.remove(id, pageOptionsDto.platform);
  }
}
