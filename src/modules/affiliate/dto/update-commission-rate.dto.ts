import { IsInt, Max, Min } from 'class-validator';

export class UpdateCommissionRateDto {
  @IsInt()
  @Min(1)
  @Max(100)
  commissionRate!: number;
}
