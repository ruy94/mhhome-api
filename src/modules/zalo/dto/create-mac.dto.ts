import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateMacDto {
  // Cho phép nhận object key-value bất kỳ
  [key: string]: unknown;
}
