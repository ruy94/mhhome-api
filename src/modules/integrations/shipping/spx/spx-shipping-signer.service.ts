import { Injectable } from '@nestjs/common';
import { createHmac, randomInt } from 'node:crypto';

@Injectable()
export class SpxShippingSignerService {
  createHeaders(appId: number, secretKey: string, payload: string) {
    const timestamp = Math.floor(Date.now() / 1000);
    const randomNum = randomInt(1, 2_147_483_647);
    const checkSign = this.generateCheckSign(appId, secretKey, timestamp, randomNum, payload);

    return {
      'Content-Type': 'application/json',
      'app-id': String(appId),
      'check-sign': checkSign,
      timestamp: String(timestamp),
      'random-num': String(randomNum),
    };
  }

  generateCheckSign(
    appId: number,
    secretKey: string,
    timestamp: number | string,
    randomNum: number | string,
    payload: string,
  ) {
    const originalValue = `${appId}_${timestamp}_${randomNum}_${payload}`;
    return createHmac('sha256', secretKey).update(originalValue).digest('hex');
  }
}
