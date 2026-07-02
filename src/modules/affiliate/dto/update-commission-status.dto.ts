import { CommissionStatus } from '../../../generated/prisma/client.js';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateCommissionStatusDto {
  @IsEnum(CommissionStatus)
  @IsNotEmpty()
  status!: CommissionStatus;

  @IsString()
  @IsOptional()
  note?: string;
}
