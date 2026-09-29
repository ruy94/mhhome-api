import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type { Queue } from 'bullmq';
import { fileTypeFromFile } from 'file-type';
import { basename, join } from 'path';
import { mkdir, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

import { StorageService } from '../storage/storage.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../common/redis/redis.service.js';
import { compressVideo, generateThumbnail } from './video.utils.js';
import { UPLOAD_TEMP_DIR } from './upload.config.js';

export const UPLOAD_VIDEO_QUEUE = 'upload-video';
export const COMPRESS_VIDEO_JOB = 'compress-video';
export const MEDIA_CLEANUP_QUEUE = 'media-cleanup';
export const DELETE_IMAGE_JOB = 'delete-image';
export const DELETE_VIDEO_JOB = 'delete-video';

const IMAGE_PREFIX = 'images';
const VIDEO_PREFIX = 'videos';
const THUMBNAIL_PREFIX = 'thumbnails';

export interface CompressVideoJobData {
  filename: string;
  videoKey: string;
}

export interface ProcessedVideo {
  videoUrl: string;
  thumbnailUrl: string;
}

export interface MediaCleanupJobData {
  filename: string;
}

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
]);
const VIDEO_TOMBSTONE_TTL_SECONDS = 24 * 60 * 60;

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(
    @InjectQueue(UPLOAD_VIDEO_QUEUE)
    private readonly uploadVideoQueue: Queue<CompressVideoJobData>,
    @InjectQueue(MEDIA_CLEANUP_QUEUE)
    private readonly mediaCleanupQueue: Queue<MediaCleanupJobData>,
    private readonly storage: StorageService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async processImages(files: Array<Express.Multer.File>) {
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const detectedType = await fileTypeFromFile(file.path);
        if (!detectedType || !ALLOWED_IMAGE_MIME_TYPES.has(detectedType.mime)) {
          throw new BadRequestException(`Invalid image content: ${file.originalname}`);
        }
        const filename = this.safeFilename(file.filename);
        await this.storage.uploadFile(this.imageKey(filename), file.path, detectedType.mime);
        uploaded.push(filename);
      }

      return { message: 'Images uploaded successfully', urls: uploaded };
    } catch (err) {
      await Promise.all(uploaded.map((filename) => this.deleteImageNow(filename)));
      this.logger.error('Image upload failed', err instanceof Error ? err.stack : String(err));
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Image upload failed');
    } finally {
      await this.deleteUploadedInputFiles(files);
    }
  }

  async processVideo(file: Express.Multer.File) {
    return await this.processUploadedVideo(file, { enqueueCompression: true });
  }

  async processMultipleVideos(files: Array<Express.Multer.File>) {
    const settledUploads = await Promise.allSettled(
      files.map((file) => this.processUploadedVideo(file, { enqueueCompression: true })),
    );
    const uploaded = settledUploads.filter(isFulfilled).map((result) => result.value);

    if (settledUploads.some((result) => result.status === 'rejected')) {
      await Promise.all(uploaded.map((item) => this.deleteVideo(item.videoUrl)));
      this.logger.error('Batch video processing failed');
      throw new InternalServerErrorException('Batch video processing failed');
    }

    return {
      message: `Successfully processed ${files.length} videos`,
      data: uploaded,
    };
  }

  async processUploadedVideo(
    file: Express.Multer.File,
    options: { enqueueCompression?: boolean } = {},
  ): Promise<ProcessedVideo> {
    const inputPath = file.path;
    const videoFilename = this.safeFilename(file.filename);
    const thumbnailFilename = videoFilename.replace(/\.\w+$/, '.jpg');
    const thumbnailPath = join(UPLOAD_TEMP_DIR, `${randomUUID()}-${thumbnailFilename}`);
    const videoKey = this.videoKey(videoFilename);
    const thumbnailKey = this.thumbnailKey(thumbnailFilename);

    try {
      const detectedType = await fileTypeFromFile(inputPath);
      if (detectedType?.mime !== 'video/mp4') {
        throw new BadRequestException(`Invalid MP4 content: ${file.originalname}`);
      }
      await generateThumbnail(inputPath, thumbnailPath);
      await this.storage.uploadFile(videoKey, inputPath, detectedType.mime);
      await this.storage.uploadFile(thumbnailKey, thumbnailPath, 'image/jpeg');

      if (options.enqueueCompression) {
        await this.enqueueVideoCompression({ filename: videoFilename, videoKey });
      }

      return {
        videoUrl: videoFilename,
        thumbnailUrl: thumbnailFilename,
      };
    } catch (err) {
      this.logger.error(
        `Video processing failed for ${file.originalname}`,
        err instanceof Error ? err.stack : String(err),
      );
      await Promise.all([
        this.storage.deleteObject(videoKey).catch(() => undefined),
        this.storage.deleteObject(thumbnailKey).catch(() => undefined),
      ]);
      if (err instanceof HttpException) throw err;
      throw new InternalServerErrorException('Video processing failed');
    } finally {
      await Promise.all([this.deleteFileSafe(inputPath), this.deleteFileSafe(thumbnailPath)]);
    }
  }

  async compressQueuedVideo(data: CompressVideoJobData) {
    const filename = this.safeFilename(data.filename);
    const videoKey = data.videoKey || this.videoKey(filename);
    const workDir = join(UPLOAD_TEMP_DIR, 'compression');
    await mkdir(workDir, { recursive: true });

    const inputPath = join(workDir, `${randomUUID()}-${filename}`);
    const outputPath = inputPath.replace(/\.\w+$/, `.compressed-${process.pid}-${Date.now()}.mp4`);

    try {
      if (await this.isVideoDeleted(videoKey)) {
        this.logger.log(`Skipping deleted video compression: ${filename}`);
        return;
      }
      await this.storage.downloadFile(videoKey, inputPath);
      await compressVideo(inputPath, outputPath);
      if (await this.isVideoDeleted(videoKey)) return;
      await this.storage.uploadFile(videoKey, outputPath, 'video/mp4');
      if (await this.isVideoDeleted(videoKey)) {
        await this.storage.deleteObject(videoKey);
        return;
      }
      this.logger.log(`Compressed uploaded video: ${filename}`);
    } catch (err) {
      this.logger.error(
        `Video compression failed for ${filename}`,
        err instanceof Error ? err.stack : String(err),
      );
      throw err;
    } finally {
      await Promise.all([this.deleteFileSafe(inputPath), this.deleteFileSafe(outputPath)]);
    }
  }

  private async enqueueVideoCompression(data: CompressVideoJobData) {
    try {
      await this.uploadVideoQueue.add(COMPRESS_VIDEO_JOB, data, {
        attempts: 2,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: { count: 100 },
        removeOnFail: { count: 200 },
      });
    } catch (err) {
      this.logger.warn(
        `Video compression queue unavailable, keeping original video: ${data.filename}`,
      );
      this.logger.debug(err);
    }
  }

  private async deleteFileSafe(fullPath: string) {
    try {
      await unlink(fullPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        this.logger.warn(`Delete failed: ${fullPath}`);
      }
    }
  }

  async deleteUploadedInputFiles(files: Array<Express.Multer.File>) {
    await Promise.all(files.map((file) => this.deleteFileSafe(file.path)));
  }

  async deleteImage(filename?: string) {
    if (!filename) return;
    const safeFilename = this.safeFilename(filename);
    await this.assertImageUnreferenced(safeFilename);
    await this.enqueueImageCleanup(safeFilename);
  }

  async deleteVideo(filename?: string) {
    if (!filename) return;
    const videoFilename = this.safeFilename(filename);
    await this.assertVideoUnreferenced(videoFilename);
    await this.enqueueVideoCleanup(videoFilename);
  }

  async enqueueImageCleanup(filename?: string): Promise<void> {
    if (!filename) return;
    const safeFilename = this.safeFilename(filename);
    await this.enqueueCleanup(DELETE_IMAGE_JOB, safeFilename);
  }

  async enqueueVideoCleanup(filename?: string): Promise<void> {
    if (!filename) return;
    const videoFilename = this.safeFilename(filename);
    await this.markVideoDeleted(this.videoKey(videoFilename));
    await this.enqueueCleanup(DELETE_VIDEO_JOB, videoFilename);
  }

  async deleteImageNow(filename?: string): Promise<void> {
    if (!filename) return;
    await this.storage.deleteObject(this.imageKey(this.safeFilename(filename)));
  }

  async deleteVideoNow(filename?: string): Promise<void> {
    if (!filename) return;
    const videoFilename = this.safeFilename(filename);
    const thumbnailFilename = videoFilename.replace(/\.\w+$/, '.jpg');

    await Promise.all([
      this.storage.deleteObject(this.videoKey(videoFilename)),
      this.storage.deleteObject(this.thumbnailKey(thumbnailFilename)),
    ]);
  }

  private async enqueueCleanup(jobName: string, filename: string): Promise<void> {
    try {
      await this.mediaCleanupQueue.add(
        jobName,
        { filename },
        {
          jobId: `${jobName}-${filename}`,
          attempts: 3,
          backoff: { type: 'exponential', delay: 5000 },
          removeOnComplete: { count: 500 },
          removeOnFail: { count: 500 },
        },
      );
    } catch (err) {
      this.logger.error(
        `Unable to enqueue media cleanup for ${filename}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  private async markVideoDeleted(videoKey: string): Promise<void> {
    try {
      await this.redis
        .getClient()
        .set(this.videoTombstoneKey(videoKey), '1', 'EX', VIDEO_TOMBSTONE_TTL_SECONDS);
    } catch (err) {
      this.logger.warn(`Unable to mark deleted video: ${videoKey}`);
      this.logger.debug(err);
    }
  }

  private async isVideoDeleted(videoKey: string): Promise<boolean> {
    try {
      return (await this.redis.getClient().exists(this.videoTombstoneKey(videoKey))) === 1;
    } catch (err) {
      this.logger.warn(`Unable to read video tombstone: ${videoKey}`);
      this.logger.debug(err);
      return false;
    }
  }

  private videoTombstoneKey(videoKey: string): string {
    return `media:deleted:${videoKey}`;
  }

  private async assertImageUnreferenced(filename: string): Promise<void> {
    const [
      products,
      variants,
      categories,
      websiteCategories,
      banners,
      campaignBanners,
      reviewImages,
      reviewAvatars,
    ] = await Promise.all([
      this.prisma.product.count({ where: { image: { has: filename } } }),
      this.prisma.variant.count({ where: { image: filename } }),
      this.prisma.category.count({ where: { image: filename } }),
      this.prisma.category.count({ where: { websiteImage: filename } }),
      this.prisma.banner.count({ where: { adBanners: { has: filename } } }),
      this.prisma.banner.count({ where: { camBanners: { has: filename } } }),
      this.prisma.review.count({ where: { image: { has: filename } } }),
      this.prisma.review.count({ where: { customerAvatar: filename } }),
    ]);

    if (
      products +
        variants +
        categories +
        websiteCategories +
        banners +
        campaignBanners +
        reviewImages +
        reviewAvatars >
      0
    ) {
      throw new ConflictException('Image is still referenced');
    }
  }

  private async assertVideoUnreferenced(filename: string): Promise<void> {
    const [products, reviews, zaloVideos] = await Promise.all([
      this.prisma.product.count({ where: { videoUrl: filename } }),
      this.prisma.review.count({ where: { videoUrl: filename } }),
      this.prisma.zaloVideo.count({ where: { videoUrl: filename } }),
    ]);

    if (products + reviews + zaloVideos > 0) {
      throw new ConflictException('Video is still referenced');
    }
  }

  private imageKey(filename: string): string {
    return `${IMAGE_PREFIX}/${filename}`;
  }

  private videoKey(filename: string): string {
    return `${VIDEO_PREFIX}/${filename}`;
  }

  private thumbnailKey(filename: string): string {
    return `${THUMBNAIL_PREFIX}/${filename}`;
  }

  private safeFilename(filename: string): string {
    return basename(filename).replace(/^\.+/, '');
  }
}

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}
