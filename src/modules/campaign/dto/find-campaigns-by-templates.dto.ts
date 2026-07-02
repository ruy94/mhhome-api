import { IsString } from 'class-validator';

import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export class FindCampaignsByTemplatesDto extends PageOptionsDto {
  @IsString()
  templateIds!: string;
}
