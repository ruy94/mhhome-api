import { WithdrawalStatus } from '../../../generated/prisma/client.js';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWithdrawalDto {
  @IsEnum(WithdrawalStatus)
  @IsNotEmpty()
  status!: WithdrawalStatus;

  @IsString()
  @IsOptional()
  adminNote?: string;
}
