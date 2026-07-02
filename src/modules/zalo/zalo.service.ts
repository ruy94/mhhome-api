/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import CryptoJS from 'crypto-js';
import { ZaloNotifyDto } from './dto/zalo-notify.dto.js';
import { ZaloReviewWebhookDto } from './dto/zalo-webhook.dto.js';
import { ZaloRevokeWebhookDto } from './dto/zalo-revoke-webhook.dto.js';

@Injectable()
export class ZaloService {
  private readonly logger = new Logger(ZaloService.name);
  constructor(
    protected configService: ConfigService,
    protected prisma: PrismaService,
  ) {}

  // Phần tạo MAC và Notify cho việc đặt hàng CheckoutSDK phía zalo
  createMac(body: Record<string, any>) {
    const secretKey = this.configService.get<string>('CHECKOUT_SECRET_KEY');
    if (!secretKey) {
      throw new Error('Missing CHECKOUT_SECRET_KEY in env');
    }
    try {
      const dataMac = Object.keys(body)
        .sort()
        .map(
          (key) =>
            `${key}=${typeof body[key] === 'object' ? JSON.stringify(body[key]) : body[key]}`,
        )
        .join('&');

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mac = CryptoJS.HmacSHA256(
        dataMac,
        secretKey,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ).toString();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return mac;
    } catch (e) {
      this.logger.error('createMac error', e);
      throw e;
    }
  }

  zaloNotify(body: ZaloNotifyDto) {
    try {
      const { data, mac } = body || {};
      if (!data || !mac) return { returnCode: 0, returnMessage: 'Missing data or mac' };

      const { appId, orderId, method } = data;

      const secretKey = this.configService.get<string>('CHECKOUT_SECRET_KEY');
      if (!secretKey) throw new Error('Missing Secret Key');

      const raw = `appId=${appId}&orderId=${orderId}&method=${method}`;
      const expectedMac = CryptoJS.HmacSHA256(raw, secretKey).toString();

      if (mac === expectedMac) {
        // TODO: Xử lý logic cập nhật trạng thái đơn hàng tại đây
        this.logger.log(`Zalo Notify Success: Order ${orderId}`);
        return { returnCode: 1, returnMessage: 'Success' };
      }
      this.logger.warn(`Invalid MAC for order ${orderId}`);
      return { returnCode: 0, returnMessage: 'Invalid MAC' };
    } catch (error) {
      this.logger.error('Zalo Notify Error', error);
      return { returnCode: 0, returnMessage: 'Fail' };
    }
  }

  // Webhook Zalo Status
  handleReviewWebhook(payload: ZaloReviewWebhookDto) {
    const { app_id, event_name, data } = payload;

    this.logger.log(`Received Zalo Webhook [${event_name}] for App: ${app_id}`);

    if (event_name === 'review_mini_app') {
      this.processReviewEvent(data);
    }

    // Luôn trả về success để Zalo không retry spam server
    return { message: 'Received' };
  }

  processReviewEvent(data: ZaloReviewWebhookDto['data']) {
    if (data.review_status === 'success') {
      this.logger.log(`Mini App Version ${data.version} được duyệt!`);
      // TODO: Update database status = ACTIVE
    } else if (data.review_status === 'reject') {
      this.logger.warn(`Mini App Version ${data.version} bị từ chối. Lý do: ${data.reason}`);
      // TODO: Update database status = REJECTED, save reason
    }
  }

  async handleRevokeWebhook(payload: ZaloRevokeWebhookDto) {
    const { event_name, user_id_by_app, app_id } = payload;

    this.logger.log(`Received Revoke Webhook for App: ${app_id}, User: ${user_id_by_app}`);

    if (event_name === 'user_revoke_consent_and_remove_data') {
      await this.processRevokeUser(user_id_by_app);
    }

    return { message: 'Received' };
  }

  private async processRevokeUser(zaloId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { zaloId },
      });

      if (!user) {
        this.logger.warn(`Revoke data: User with zaloId ${zaloId} not found.`);
        return;
      }

      this.logger.log(
        ` UserID: ${user.id} - tên: ${user.name} - SĐT: ${user.phone} đã thực hiện rút quyền trên zalo`,
      );
    } catch (error) {
      this.logger.error(`Lỗi khi xử lý Revoke User ${zaloId}`, error);
    }
  }
}
