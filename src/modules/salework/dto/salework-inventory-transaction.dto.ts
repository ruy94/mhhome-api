import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const INVENTORY_TRANSACTION_TYPES = [
  'allImport',
  'allExport',
  'newImport',
  'returnImport',
  'freeImport',
  'freeExport',
  'saleExport',
  'returnOrder',
] as const;

export class SaleworkInventoryTransactionDto {
  @IsInt()
  @Min(0)
  time_start!: number;

  @IsInt()
  @Min(0)
  time_end!: number;

  @IsOptional()
  @IsString()
  warehouse_id?: string;

  @IsOptional()
  @IsIn(INVENTORY_TRANSACTION_TYPES)
  type_transaction?: (typeof INVENTORY_TRANSACTION_TYPES)[number];

  @IsInt()
  @Min(0)
  next_cursor!: number;
}

