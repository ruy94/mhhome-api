import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Queue } from 'bullmq';
import { join } from 'path';
import { access, copyFile, rename, unlink } from 'fs/promises';
import { compressVideo, generateThumbnail } from './video.utils.js';

export const UPLOAD_VIDEO_QUEUE = 'upload-video';
export const COMPRESS_VIDEO_JOB = 'compress-video';

export interface CompressVideoJobData {
  filename: string;
  videoPath: string;
}

@Injectable()
export class UploadService {
  private readonly isProduction = process.env.NODE_ENV === 'production';
  private readonly IMAGE_DIR = this.isProduction ? '/var/www/mhhome-uploads' : '/home/duy/Public';
  private readonly VIDEO_DIR = this.isProduction
    ? '/var/www/mhhome-uploads/videos'
    : '/home/duy/Public/videos';
  private readonly THUMBNAIL_DIR = this.isProduction
    ? '/var/www/mhhome-uploads/thumbnails'
    : '/home/duy/Public/thumbnails';

  constructor(
    @InjectQueue(UPLOAD_VIDEO_QUEUE)
    private readonly uploadVideoQueue: Queue<CompressVideoJobData>,
  ) {}

  async processVideo(file: Express.Multer.File) {
    const inputPath = file.path;
    const videoFilename = file.filename;
    const outputVideoPath = join(this.VIDEO_DIR, videoFilename);
    const thumbnailFilename = videoFilename.replace(/\.\w+$/, '.jpg');
    const thumbnailPath = join(this.THUMBNAIL_DIR, thumbnailFilename);

    try {
      await copyFile(inputPath, outputVideoPath);
      await generateThumbnail(outputVideoPath, thumbnailPath);
      await unlink(inputPath);
      await this.enqueueVideoCompression({ filename: videoFilename, videoPath: outputVideoPath });

      return {
        message: 'Video uploaded successfully',
        videoUrl: videoFilename,
        thumbnailUrl: thumbnailFilename,
      };
    } catch (err) {
      Logger.error(err);
      await Promise.all([
        this.deleteFileSafe(outputVideoPath),
        this.deleteFileSafe(thumbnailPath),
        this.deleteFileSafe(inputPath),
      ]);
      throw new InternalServerErrorException('Video processing failed');
    }
  }

  async processMultipleVideos(files: Array<Express.Multer.File>) {
    const settledUploads = await Promise.allSettled(
      files.map((file) => this.processUploadedVideo(file)),
    );
    const uploaded = settledUploads.filter(isFulfilled).map((result) => result.value);

    if (settledUploads.some((result) => result.status === 'rejected')) {
      await Promise.all(uploaded.map((item) => this.deleteVideo(item.videoUrl)));
      Logger.error('Batch video processing failed');
      throw new InternalServerErrorException('Batch video processing failed');
    }

    return {
      message: `Successfully processed ${files.length} videos`,
      data: uploaded,
    };
  }

  async processUploadedVideo(file: Express.Multer.File) {
    const inputPath = file.path;
    const outputVideoFilename = file.filename;
    const originalNameWithoutExt = file.filename.replace(/\.[^/.]+$/, '');
    const outputThumbnailFilename = `${originalNameWithoutExt}.jpg`;
    const outputVideoPath = join(this.VIDEO_DIR, outputVideoFilename);
    const outputThumbnailPath = join(this.THUMBNAIL_DIR, outputThumbnailFilename);

    try {
      await copyFile(inputPath, outputVideoPath);
      await generateThumbnail(outputVideoPath, outputThumbnailPath);
      await unlink(inputPath);

      return {
        videoUrl: outputVideoFilename,
        thumbnailUrl: outputThumbnailFilename,
      };
    } catch (err) {
      Logger.error(`Lỗi xử lý file ${file.originalname}: ${err}`);

      try {
        await unlink(outputVideoPath);
      } catch (e) {
        Logger.debug(e);
      }

      try {
        await unlink(outputThumbnailPath);
      } catch (e) {
        Logger.debug(e);
      }

      try {
        await unlink(inputPath);
      } catch (e) {
        Logger.debug(e);
      }

      throw new InternalServerErrorException('Video processing failed');
    }
  }

  async compressQueuedVideo(data: CompressVideoJobData) {
    if (!data.videoPath.startsWith(this.VIDEO_DIR)) {
      throw new Error('Invalid queued video path');
    }

    const tempOutputPath = data.videoPath.replace(
      /\.\w+$/,
      `.processing-${process.pid}-${Date.now()}.mp4`,
    );

    try {
      await compressVideo(data.videoPath, tempOutputPath);
      await rename(tempOutputPath, data.videoPath);
      Logger.log(`Compressed uploaded video: ${data.filename}`);
    } catch (err) {
      await this.deleteFileSafe(tempOutputPath);
      throw err;
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
      Logger.warn(`Video compression queue unavailable, keeping original video: ${data.filename}`);
      Logger.debug(err);
    }
  }

  private async deleteFileSafe(fullPath: string) {
    try {
      await access(fullPath);
      await unlink(fullPath);
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        Logger.warn(`Delete failed: ${fullPath}`);
      }
    }
  }

  async deleteUploadedInputFiles(files: Array<Express.Multer.File>) {
    await Promise.all(files.map((file) => this.deleteFileSafe(file.path)));
  }

  async deleteImage(filename?: string) {
    if (!filename) return;

    const fullPath = join(this.IMAGE_DIR, filename);
    if (!fullPath.startsWith(this.IMAGE_DIR)) return;

    await this.deleteFileSafe(fullPath);
  }

  async deleteVideo(filename?: string) {
    if (!filename) return;

    const videoPath = join(this.VIDEO_DIR, filename);
    const thumbnailPath = join(this.THUMBNAIL_DIR, filename.replace(/\.\w+$/, '.jpg'));

    if (videoPath.startsWith(this.VIDEO_DIR)) {
      await this.deleteFileSafe(videoPath);
    }

    if (thumbnailPath.startsWith(this.THUMBNAIL_DIR)) {
      await this.deleteFileSafe(thumbnailPath);
    }
  }
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}
