import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service.js';
import { ReceiverIdentifier, ZbsCacheService } from '../../common/redis/zbs-cache.service.js';
import { CampaignStatus } from '../../generated/prisma/client.js';
import { SionHubClientService } from '../integrations/sion-hub/sion-hub-client.service.js';
import {
  CampaignReceiverDto,
  CheckQuotaDto,
  CreateCampaignDto,
} from './dto/create-campaign.dto.js';

export interface SionHubCampaignResult {
  campaignId: string;
  totalMessages?: number;
  estimatedCost?: number;
}

export interface ChunkResult {
  chunk: number;
  status: 'success' | 'failed';
  data?: SionHubCampaignResult;
  error?: string;
}

@Injectable()
export class ZbsService {
  private readonly logger = new Logger(ZbsService.name);
  private readonly CHUNK_SIZE = 4000;
  private readonly MAX_SENDS_PER_DAY = 1;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly sionHub: SionHubClientService,
    private readonly zbsCache: ZbsCacheService,
  ) {}

  async getTenantTemplates() {
    const oaId = this.configService.get<string>('ZALO_OA_ID');
    if (!oaId) throw new BadRequestException('ZALO_OA_ID is not configured');
    return this.sionHub.getApprovedZbsTemplates(oaId);
  }

  async checkQuotaPriorSend(dto: CheckQuotaDto) {
    const { tenantTemplateId, phones = [], uids = [] } = dto;
    const identifiers = this.buildIdentifiers(phones, uids);

    if (identifiers.length === 0) {
      return { total: 0, validCount: 0, exceededCount: 0 };
    }

    const quotaMap = await this.zbsCache.getQuotas(tenantTemplateId, identifiers);
    const exceededPhones: string[] = [];
    const exceededUids: string[] = [];
    const validPhones: string[] = [];
    const validUids: string[] = [];

    for (const item of identifiers) {
      const count = quotaMap.get(item.value) || 0;
      const isExceeded = count >= this.MAX_SENDS_PER_DAY;

      if (item.type === 'phone') {
        if (isExceeded) exceededPhones.push(item.value);
        else validPhones.push(item.value);
      } else if (isExceeded) {
        exceededUids.push(item.value);
      } else {
        validUids.push(item.value);
      }
    }

    return {
      total: identifiers.length,
      validCount: validPhones.length + validUids.length,
      exceededCount: exceededPhones.length + exceededUids.length,
      details: {
        exceededPhones,
        exceededUids,
        validPhones,
        validUids,
      },
      counts: Object.fromEntries(quotaMap),
    };
  }

  async createCampaign(dto: CreateCampaignDto, adminId: string) {
    const { oaId, tenantTemplateId, receivers, campaignName, forceSend } = dto;
    const normalizedReceivers = receivers.map((receiver) => this.normalizeReceiver(receiver));
    const identifiers = normalizedReceivers.map((receiver) => this.getReceiverIdentifier(receiver));

    const quotaMap = await this.zbsCache.getQuotas(tenantTemplateId, identifiers);
    const validReceivers: CampaignReceiverDto[] = [];
    const skippedReceivers: string[] = [];

    for (const receiver of normalizedReceivers) {
      const { value } = this.getReceiverIdentifier(receiver);
      const currentCount = quotaMap.get(value) || 0;

      if (currentCount >= this.MAX_SENDS_PER_DAY && !forceSend) {
        skippedReceivers.push(value);
      } else {
        validReceivers.push(receiver);
      }
    }

    const totalValid = validReceivers.length;
    if (totalValid === 0) {
      throw new BadRequestException({
        message: 'Tất cả SĐT, UID đều đã được gửi tin hôm nay. Có thể ép gửi nếu muốn thử lại.',
        skipped: skippedReceivers,
      });
    }

    const campaign = await this.prisma.campaign.create({
      data: {
        name: campaignName,
        total: totalValid,
        templateId: tenantTemplateId,
        status: CampaignStatus.PROCESSING,
        creatorId: adminId,
        cost: 0,
      },
    });

    const chunks: CampaignReceiverDto[][] = [];
    for (let i = 0; i < totalValid; i += this.CHUNK_SIZE) {
      chunks.push(validReceivers.slice(i, i + this.CHUNK_SIZE));
    }

    const results: ChunkResult[] = [];
    let totalEstimatedCost = 0;
    let providerCampaignId = '';

    for (const [index, chunk] of chunks.entries()) {
      try {
        this.logger.log(`Đang gửi ZBS chunk ${index + 1}/${chunks.length} (${chunk.length})`);

        const rawResult = await this.sionHub.sendCampaign<unknown>({
          oaId,
          tenantTemplateId,
          receivers: chunk,
          metadata: {
            localCampaignId: campaign.id,
            refId: campaign.id,
            campaignName: dto.campaignName,
          },
        });

        const result = this.normalizeCampaignResult(rawResult);
        totalEstimatedCost += Number(result.estimatedCost || 0);
        if (index === 0) providerCampaignId = result.campaignId;
        results.push({ chunk: index + 1, status: 'success', data: result });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.logger.error(`Lỗi gửi ZBS chunk ${index + 1}: ${message}`);
        results.push({ chunk: index + 1, status: 'failed', error: message });
      }
    }

    await this.prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        providerCampaignId,
        cost: totalEstimatedCost,
        status: results.every((result) => result.status === 'failed')
          ? CampaignStatus.FAILED
          : CampaignStatus.PROCESSING,
      },
    });

    const validIdentifiersSent = validReceivers.map((receiver) =>
      this.getReceiverIdentifier(receiver),
    );
    await this.zbsCache.incrementQuotas(tenantTemplateId, validIdentifiersSent);

    return {
      message: 'Chiến dịch đã được khởi tạo',
      localCampaignId: campaign.id,
      totalChunks: chunks.length,
      totalValid,
      totalSkipped: skippedReceivers.length,
      skippedList: skippedReceivers,
      details: results,
    };
  }

  private buildIdentifiers(phones: string[], uids: string[]): ReceiverIdentifier[] {
    const phoneIdentifiers = phones
      .map((value) => this.normalizeIdentifier(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ type: 'phone' as const, value }));
    const uidIdentifiers = uids
      .map((value) => this.normalizeIdentifier(value))
      .filter((value): value is string => Boolean(value))
      .map((value) => ({ type: 'uid' as const, value }));

    return [...phoneIdentifiers, ...uidIdentifiers];
  }

  private normalizeReceiver(receiver: CampaignReceiverDto): CampaignReceiverDto {
    const phone = this.normalizeIdentifier(receiver.phone);
    const uid = this.normalizeIdentifier(receiver.uid);

    if (!phone && !uid) {
      throw new BadRequestException('Mỗi người nhận Tin Nhắn Template cần có SĐT hoặc UID hợp lệ.');
    }

    return {
      ...receiver,
      phone,
      uid,
    };
  }

  private normalizeIdentifier(value?: string): string | undefined {
    const normalized = value?.trim();
    return normalized || undefined;
  }

  private getReceiverIdentifier(receiver: CampaignReceiverDto): ReceiverIdentifier {
    if (receiver.phone) return { type: 'phone', value: receiver.phone };
    return { type: 'uid', value: receiver.uid as string };
  }

  private normalizeCampaignResult(payload: unknown): SionHubCampaignResult {
    const value = this.unwrapData(payload);
    if (!this.isRecord(value) || typeof value['campaignId'] !== 'string') {
      throw new BadRequestException('Invalid campaign response from SionHub');
    }

    return {
      campaignId: value['campaignId'],
      totalMessages:
        typeof value['totalMessages'] === 'number' ? value['totalMessages'] : undefined,
      estimatedCost:
        typeof value['estimatedCost'] === 'number' ? value['estimatedCost'] : undefined,
    };
  }

  private unwrapData(payload: unknown): unknown {
    if (this.isRecord(payload) && 'data' in payload) {
      return this.unwrapData(payload['data']);
    }
    return payload;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }
}
