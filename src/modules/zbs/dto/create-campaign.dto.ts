import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export const MAX_CAMPAIGN_RECEIVERS = 4000;

export class CampaignReceiverDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  uid?: string;

  @IsObject()
  @IsNotEmpty()
  templateData!: Record<string, unknown>;
}

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  campaignName!: string;

  @IsString()
  @IsNotEmpty()
  oaId!: string;

  @IsString()
  @IsNotEmpty()
  tenantTemplateId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(MAX_CAMPAIGN_RECEIVERS, {
    message: 'Mỗi chiến dịch tối đa 4.000 người nhận',
  })
  @ValidateNested({ each: true })
  @Type(() => CampaignReceiverDto)
  receivers!: CampaignReceiverDto[];

  @IsOptional()
  @IsBoolean()
  forceSend?: boolean;
}

export class CheckQuotaDto {
  @IsString()
  @IsNotEmpty()
  tenantTemplateId!: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  phones?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  uids?: string[];
}
