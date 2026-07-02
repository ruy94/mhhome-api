import { AffiliateStatus } from '../../../generated/prisma/client.js';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateAffiliateStatusDto {
  @IsEnum(AffiliateStatus)
  @IsNotEmpty()
  status!: AffiliateStatus;
}
