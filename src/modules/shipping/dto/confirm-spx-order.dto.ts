import { IsIn } from 'class-validator';

export class ConfirmSpxOrderDto {
  @IsIn([1, 2])
  operation!: 1 | 2;
}
