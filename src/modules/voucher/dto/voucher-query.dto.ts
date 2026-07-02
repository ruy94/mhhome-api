import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { VoucherScope } from '../../../generated/prisma/client.js';
import { PageOptionsDto } from '../../../common/dtos/page-options.dto.js';

export class VoucherQueryDto extends PageOptionsDto {
  @IsEnum(VoucherScope)
  @IsOptional()
  readonly scope?: VoucherScope;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly productId?: number;
}
