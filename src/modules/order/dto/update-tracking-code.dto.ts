import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTrackingCodeOrderDto {
  @IsString()
  @IsNotEmpty()
  trackingCode!: string;
}
