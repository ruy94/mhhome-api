import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto.js';
import { UpdateBannerDto } from './dto/update-banner.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UploadService } from '../upload/upload.service.js';
import { PageDto } from '../../common/dtos/page.dto.js';
import { PageMetaDto } from '../../common/dtos/page-meta.dto.js';
import { PageOptionsDto } from '../../common/dtos/page-options.dto.js';
import { UserPlatform } from '../../generated/prisma/enums.js';

const MAX_AD_BANNERS = 5;
const MAX_CAM_BANNERS = 2;

@Injectable()
export class BannerService {
  constructor(
    private prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  private validateBannerImages(
    adBanners: string[],
    camBanners: string[],
    options: { requireImage?: boolean } = {},
  ) {
    if (options.requireImage && adBanners.length + camBanners.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất một ảnh banner');
    }

    if (adBanners.length > MAX_AD_BANNERS) {
      throw new BadRequestException('Banner quảng cáo tối đa ' + MAX_AD_BANNERS + ' ảnh');
    }

    if (camBanners.length > MAX_CAM_BANNERS) {
      throw new BadRequestException('Banner chiến dịch tối đa ' + MAX_CAM_BANNERS + ' ảnh');
    }
  }

  private async deleteRemovedImages(oldImages: string[], newImages: string[]) {
    const nextImages = new Set(newImages);
    const removedImages = oldImages.filter((image) => !nextImages.has(image));
    await Promise.all(removedImages.map((image) => this.uploadService.deleteImage(image)));
  }

  async create(dto: CreateBannerDto) {
    const existed = await this.prisma.banner.findFirst({
      where: { platform: dto.platform },
    });
    if (existed) throw new BadRequestException('Đã có banner cho nền tảng này, hãy sửa banner cũ');

    const adBanners = dto.adBanners ?? [];
    const camBanners = dto.camBanners ?? [];
    this.validateBannerImages(adBanners, camBanners, { requireImage: true });

    return await this.prisma.banner.create({
      data: {
        adBanners,
        camBanners,
        platform: dto.platform,
      },
    });
  }

  async findAll(pageOptionsDto: PageOptionsDto, platform: UserPlatform) {
    const where = { platform };

    const [items, itemCount] = await this.prisma.$transaction([
      this.prisma.banner.findMany({
        where,
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      }),
      this.prisma.banner.count({ where }),
    ]);

    return new PageDto(items, new PageMetaDto({ itemCount, pageOptionsDto }));
  }

  async findOne(id: number, platform: UserPlatform) {
    const banner = await this.prisma.banner.findFirst({
      where: { id, platform },
    });

    if (!banner) throw new NotFoundException('Banners not found');
    return banner;
  }

  async update(id: number, dto: UpdateBannerDto) {
    const banner = await this.prisma.banner.findFirst({
      where: { id, platform: dto.platform },
    });

    if (!banner) throw new NotFoundException('Banners not found');

    const adBanners = dto.adBanners ?? banner.adBanners;
    const camBanners = dto.camBanners ?? banner.camBanners;
    this.validateBannerImages(adBanners, camBanners);

    const newBanner = await this.prisma.banner.update({
      where: { id },
      data: {
        adBanners,
        camBanners,
      },
    });

    if (dto.adBanners) {
      await this.deleteRemovedImages(banner.adBanners, adBanners);
    }

    if (dto.camBanners) {
      await this.deleteRemovedImages(banner.camBanners, camBanners);
    }

    return newBanner;
  }

  async remove(id: number, platform: UserPlatform) {
    const banner = await this.prisma.banner.findFirst({
      where: { id, platform },
    });

    if (!banner) throw new NotFoundException('Banners not found');

    const deletedBanner = await this.prisma.banner.delete({
      where: { id },
    });

    await Promise.all(
      [...banner.adBanners, ...banner.camBanners].map((image) =>
        this.uploadService.deleteImage(image),
      ),
    );

    return deletedBanner;
  }

  async findAllMiniapp(pageOptionsDto: PageOptionsDto) {
    return this.findAll(pageOptionsDto, UserPlatform.ZaloMiniApp);
  }

  async findOneMiniapp(id: number) {
    return this.findOne(id, UserPlatform.ZaloMiniApp);
  }

  async findAllWebsite(pageOptionsDto: PageOptionsDto) {
    return this.findAll(pageOptionsDto, UserPlatform.Website);
  }

  async findOneWebsite(id: number) {
    return this.findOne(id, UserPlatform.Website);
  }
}
