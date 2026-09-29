import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import type { Readable } from 'stream';

import storageConfig from '../../config/storage.config.js';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(
    @Inject(storageConfig.KEY)
    cfg: ConfigType<typeof storageConfig>,
  ) {
    const minio = cfg.minio;
    this.bucket = minio.bucket;
    this.client = new S3Client({
      endpoint: minio.endpoint,
      region: minio.region,
      forcePathStyle: minio.forcePathStyle,
      credentials: {
        accessKeyId: minio.accessKey,
        secretAccessKey: minio.secretKey,
      },
    });
  }

  async uploadFile(key: string, filePath: string, contentType?: string): Promise<void> {
    this.assertConfigured();
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: createReadStream(filePath),
        ContentType: contentType,
      }),
    );
  }

  async downloadFile(key: string, destinationPath: string): Promise<void> {
    this.assertConfigured();
    const result = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!result.Body) {
      throw new InternalServerErrorException(`Object ${key} has no body`);
    }

    await pipeline(result.Body as Readable, createWriteStream(destinationPath));
  }

  async deleteObject(key: string): Promise<void> {
    if (!key) return;
    this.assertConfigured();
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  private assertConfigured(): void {
    if (!this.bucket) {
      throw new InternalServerErrorException('MINIO_MEDIA_BUCKET is not configured');
    }
  }
}
