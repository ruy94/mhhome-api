import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

// Enum trạng thái review
export enum ZaloReviewStatus {
  SUCCESS = 'success',
  REJECT = 'reject',
}

class ZaloReviewDataDto {
  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsString()
  @IsNotEmpty()
  review_status!: string; // 'success' | 'reject'

  @IsString()
  @IsNotEmpty()
  reason!: string; // Lý do từ chối (nếu có)
}

export class ZaloReviewWebhookDto {
  @IsString()
  @IsNotEmpty()
  app_id!: string;

  @IsString()
  @IsNotEmpty()
  event_name!: string; // Thường là 'review_mini_app'

  @IsNumber()
  @IsNotEmpty()
  timestamp!: number;

  @IsString()
  @IsNotEmpty()
  sender!: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ZaloReviewDataDto)
  data!: ZaloReviewDataDto;
}
