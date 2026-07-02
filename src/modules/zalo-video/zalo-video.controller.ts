import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { videoUploadOptions } from '../upload/upload.config.js';
import { CreateZaloVideoDto } from './dto/create-zalo-video.dto.js';
import { UpdateZaloVideoDto } from './dto/update-zalo-video.dto.js';
import { ZaloVideoService } from './zalo-video.service.js';

@Controller('zalo-videos')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ZaloVideoController {
  constructor(private readonly zaloVideoService: ZaloVideoService) {}

  @Get()
  @RequirePermissions('zalo-video:view')
  async findAll(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.zaloVideoService.findAll(pageOptionsDto);
  }

  @Get('product/:productId')
  @RequirePermissions('zalo-video:view')
  async findByProduct(@Param('productId', ParseIntPipe) productId: number) {
    return await this.zaloVideoService.findByProduct(productId);
  }

  @Get(':id')
  @RequirePermissions('zalo-video:view')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.zaloVideoService.findOne(id);
  }

  @Post()
  @RequirePermissions('zalo-video:create')
  async create(@Body() dto: CreateZaloVideoDto) {
    return await this.zaloVideoService.create(dto);
  }

  @Post('bulk-create-video')
  @RequirePermissions('zalo-video:create')
  @UseInterceptors(FilesInterceptor('videos', 10, videoUploadOptions))
  async bulkCreateVideo(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('productId') productIdString: string,
    @Body('titles') titles: string | string[] | undefined,
    @Body('productLinks') productLinks: string | string[] | undefined,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const productId = Number(productIdString);
    if (Number.isNaN(productId)) {
      throw new BadRequestException('Invalid Product ID');
    }

    return await this.zaloVideoService.bulkCreateVideos(
      productId,
      files,
      toArray(titles, files.length),
      toArray(productLinks, files.length),
    );
  }

  @Patch(':id')
  @RequirePermissions('zalo-video:update')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateZaloVideoDto: UpdateZaloVideoDto) {
    return this.zaloVideoService.update(id, updateZaloVideoDto);
  }

  @Delete(':id')
  @RequirePermissions('zalo-video:delete')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.zaloVideoService.remove(id);
  }
}

function toArray(value: string | string[] | undefined, length: number) {
  const items = value ? (Array.isArray(value) ? value : [value]) : [];
  while (items.length < length) items.push('');
  return items;
}
