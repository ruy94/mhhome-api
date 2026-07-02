import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';

class ZaloSenderDto {
  @IsString()
  @IsNotEmpty()
  id!: string; // Đây chính là User ID theo App (user_id_by_app)
}

export class ZaloRevokeWebhookDto {
  @IsString()
  @IsNotEmpty()
  app_id!: string;

  @IsString()
  @IsNotEmpty()
  event_name!: string; // Sẽ là 'user_revoke_consent_and_remove_data'

  @IsNumber()
  @IsNotEmpty()
  timestamp!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => ZaloSenderDto)
  sender!: ZaloSenderDto;

  @IsString()
  @IsNotEmpty()
  user_id_by_app!: string; // ID người dùng cần xóa
}
