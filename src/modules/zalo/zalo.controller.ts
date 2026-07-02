import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ZaloService } from './zalo.service.js';
import { ZaloNotifyDto } from './dto/zalo-notify.dto.js';
import { ZaloWebhookGuard } from './guards/zalo-webhook.guard.js';
import { ZaloReviewWebhookDto } from './dto/zalo-webhook.dto.js';
import { ZaloRevokeWebhookDto } from './dto/zalo-revoke-webhook.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';

@Public()
@Controller('zalo')
export class ZaloController {
  constructor(private readonly zaloService: ZaloService) {}

  // Phần tạo MAC và Notify cho việc đặt hàng CheckoutSDK phía zalo
  @Post('create-mac')
  createMac(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.zaloService.createMac(body);
  }

  @Post('notify')
  zaloNotify(@Body() body: ZaloNotifyDto) {
    return this.zaloService.zaloNotify(body);
  }

  // Webhook Zalo Status
  @Post('webhook/review-app') // Lấy status sau khi mini-app được duyệt
  @HttpCode(HttpStatus.OK) // Webhook nên trả về 200 OK
  @UseGuards(ZaloWebhookGuard) // Guard xác thực chữ ký
  handleReviewWebhook(@Body() payload: ZaloReviewWebhookDto) {
    return this.zaloService.handleReviewWebhook(payload);
  }

  @Post('webhook/revoke-consent') // Lấy status khi user rút lại cấp quyền trên zalo
  @HttpCode(HttpStatus.OK)
  @UseGuards(ZaloWebhookGuard)
  handleRevokeWebhook(@Body() payload: ZaloRevokeWebhookDto) {
    return this.zaloService.handleRevokeWebhook(payload);
  }
}
