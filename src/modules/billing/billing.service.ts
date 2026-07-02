import { Injectable } from '@nestjs/common';

import { SionHubClientService } from '../integrations/sion-hub/sion-hub-client.service.js';
import type { CreateLocalOrderDto } from './dto/create-local-order.dto.js';

@Injectable()
export class BillingService {
  constructor(private readonly sionHub: SionHubClientService) {}

  getBalance(): Promise<{ walletBalance: number }> {
    return this.sionHub.getWalletBalance();
  }

  getPackages(): Promise<unknown> {
    return this.sionHub.getServicePackages();
  }

  createOrder(dto: CreateLocalOrderDto): Promise<unknown> {
    return this.sionHub.createPaymentOrder({
      packageId: dto.packageId,
      returnUrl: dto.returnUrl,
      cancelUrl: dto.cancelUrl,
    });
  }
}
