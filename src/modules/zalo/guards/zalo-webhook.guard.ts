import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';
import { Request } from 'express';

// Interface mở rộng để TypeScript hiểu rawBody
interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

@Injectable()
export class ZaloWebhookGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithRawBody>();

    // 1. Lấy thông tin từ Header
    const signature = request.headers['x-zevent-signature'] as string;
    const timestamp = request.headers['x-zevent-timestamp'] as string;

    if (!signature || !timestamp) {
      throw new BadRequestException('Missing Zalo Signature Headers');
    }

    // 2. Lấy API Key từ config
    const apiKey = this.configService.get<string>('ZALO_OPENAPIS_KEY');
    if (!apiKey) {
      console.error('Missing ZALO_API_KEY in env');
      throw new UnauthorizedException('Server configuration error');
    }

    // 3. Lấy Raw Body
    if (!request.rawBody) {
      throw new BadRequestException('Raw body not available. Check main.ts');
    }
    const bodyContent = request.rawBody.toString('utf8');

    // 4. Tính toán chữ ký: SHA256(TimeStamp + APIKey + Body)
    // Tài liệu: https://miniapp.zaloplatforms.com/documents/open-apis/webhook/verifysignature/
    const dataToHash = timestamp + apiKey + bodyContent;
    const computedSignature = CryptoJS.SHA256(dataToHash).toString(CryptoJS.enc.Hex);

    // 5. So sánh
    if (computedSignature !== signature) {
      throw new UnauthorizedException('Invalid Zalo Signature');
    }

    return true;
  }
}
