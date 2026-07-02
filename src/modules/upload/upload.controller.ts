import {
  BadRequestException,
  Controller,
  Delete,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { RequirePermissions } from '../../common/decorators/permissions.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../../common/guards/permissions.guard.js';
import { UploadService } from './upload.service.js';
import { imageUploadOptions, videoUploadOptions } from './upload.config.js';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('upload:create')
  @UseInterceptors(FilesInterceptor('files', 10, imageUploadOptions))
  uploadMultipleImages(@UploadedFiles() files: Array<Express.Multer.File>) {
    const urls = files.map((file) => file.filename);
    return { message: 'Images uploaded successfully', urls };
  }

  @Post('video')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('upload:create')
  @UseInterceptors(FileInterceptor('video', videoUploadOptions))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    return await this.uploadService.processVideo(file);
  }

  @Post('multi-video')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('upload:create')
  @UseInterceptors(FilesInterceptor('videos', 10, videoUploadOptions))
  async uploadMultipleVideos(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return await this.uploadService.processMultipleVideos(files);
  }

  @Delete('image')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('upload:delete')
  async deleteImage(@Query('filename') filename: string) {
    return await this.uploadService.deleteImage(filename);
  }

  @Delete('video')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('upload:delete')
  async deleteVideo(@Query('filename') filename: string) {
    return await this.uploadService.deleteVideo(filename);
  }
}
