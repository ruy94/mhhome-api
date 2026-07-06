import { IsInt, Min } from 'class-validator';

export class SaleworkProductReportDto {
  @IsInt()
  @Min(0)
  time_start!: number;

  @IsInt()
  @Min(0)
  time_end!: number;
}

