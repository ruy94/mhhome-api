import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export class PageOptionsDto {
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.DESC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly q?: string;

  get take(): number | undefined {
    return this.limit;
  }

  get skip(): number | undefined {
    if (!this.limit) return undefined;
    return ((this.page ?? 1) - 1) * this.limit;
  }
}
