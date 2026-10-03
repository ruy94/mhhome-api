import { IsBoolean, IsInt, IsOptional, Min, ValidateIf } from 'class-validator';

export class UpdateKiotVietOrderExportDto {
  @IsBoolean()
  enabled!: boolean;

  @ValidateIf((dto: UpdateKiotVietOrderExportDto) => dto.enabled || dto.soldById !== undefined)
  @IsOptional()
  @IsInt()
  @Min(1)
  soldById?: number;
}
