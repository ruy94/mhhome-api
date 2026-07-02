import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UploadService } from '../upload/upload.service.js';
import { CreateZaloVideoDto } from './dto/create-zalo-video.dto.js';
import { UpdateZaloVideoDto } from './dto/update-zalo-video.dto.js';

@Injectable()
export class ZaloVideoService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  /** Create a single Zalo video record from already uploaded media. */
  async create(dto: CreateZaloVideoDto) {
    return await this.prisma.zaloVideo.create({
      data: {
        productId: dto.productId ?? 0,
        productLink: dto.productLink ?? '',
        title: dto.title ?? '',
        videoUrl: dto.videoUrl,
        videoThumbnail: dto.videoThumbnail,
      },
    });
  }

  /** List active Zalo videos with pagination. */
  async findAll(pageOptionsDto: PageOptionsDto) {
    const where = {
      isDeleted: 0,
      ...(pageOptionsDto.q ? { title: { contains: pageOptionsDto.q } } : {}),
    };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.zaloVideo.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        orderBy: { id: 'desc' },
      }),
      this.prisma.zaloVideo.count({ where }),
    ]);

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  /** List active Zalo videos attached to one product. */
  async findByProduct(productId: number) {
    return await this.prisma.zaloVideo.findMany({
      where: { productId, isDeleted: 0 },
      orderBy: { id: 'desc' },
    });
  }

  /** Find one active Zalo video. */
  async findOne(id: number) {
    const zaloVideo = await this.prisma.zaloVideo.findFirst({
      where: { id, isDeleted: 0 },
    });
    if (!zaloVideo) throw new NotFoundException('Zalo video not found');
    return zaloVideo;
  }

  /** Upload and create multiple Zalo videos for a product. */
  async bulkCreateVideos(
    productId: number,
    files: Array<Express.Multer.File>,
    titles: string[],
    productLinks: string[],
  ) {
    if (!files.length) throw new BadRequestException('No files uploaded');

    const product = await this.prisma.product.findFirst({
      where: { id: productId, isDeleted: 0 },
      select: { id: true },
    });
    if (!product) {
      await this.uploadService.deleteUploadedInputFiles(files);
      throw new NotFoundException('Product not found');
    }

    const activeCount = await this.prisma.zaloVideo.count({
      where: { productId, isDeleted: 0 },
    });
    if (activeCount + files.length > 5) {
      await this.uploadService.deleteUploadedInputFiles(files);
      throw new BadRequestException('Mỗi sản phẩm chỉ được tối đa 5 video');
    }

    const settledUploads = await Promise.allSettled(
      files.map((file) => this.uploadService.processUploadedVideo(file)),
    );
    const uploaded = settledUploads.filter(isFulfilled).map((result) => result.value);

    if (settledUploads.some((result) => result.status === 'rejected')) {
      await Promise.all(uploaded.map((item) => this.uploadService.deleteVideo(item.videoUrl)));
      throw new BadRequestException('Không thể xử lý một hoặc nhiều video');
    }

    try {
      const created = await this.prisma.$transaction(
        uploaded.map((item, index) =>
          this.prisma.zaloVideo.create({
            data: {
              productId,
              title: titles[index] ?? '',
              productLink: productLinks[index] ?? '',
              videoUrl: item.videoUrl,
              videoThumbnail: item.thumbnailUrl,
            },
          }),
        ),
      );

      return {
        message: `Successfully created ${created.length} videos`,
        data: created,
      };
    } catch (error) {
      await Promise.all(uploaded.map((item) => this.uploadService.deleteVideo(item.videoUrl)));
      throw error;
    }
  }

  /** Update one active Zalo video. */
  async update(id: number, updateZaloVideoDto: UpdateZaloVideoDto) {
    await this.findOne(id);
    return await this.prisma.zaloVideo.update({
      where: { id },
      data: updateZaloVideoDto,
    });
  }

  /** Soft-delete one Zalo video and remove its media files. */
  async remove(id: number) {
    const zaloVideo = await this.findOne(id);
    const removed = await this.prisma.zaloVideo.update({
      where: { id },
      data: { isDeleted: 1 },
    });

    await this.uploadService.deleteVideo(zaloVideo.videoUrl);
    return removed;
  }
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}
