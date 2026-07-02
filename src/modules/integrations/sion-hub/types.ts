export interface SionHubWrappedResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: unknown;
}

export interface CreateSionHubPaymentOrderDto {
  packageId: number;
  returnUrl: string;
  cancelUrl: string;
}

export interface SendZbsDto {
  oaId: string;
  phone?: string;
  uid?: string;
  tenantTemplateId: string;
  templateData: Record<string, unknown>;
}

export interface CampaignReceiverDto {
  phone?: string;
  uid?: string;
  templateData: Record<string, unknown>;
}

export interface SendCampaignDto {
  oaId: string;
  tenantTemplateId: string;
  receivers: CampaignReceiverDto[];
  metadata?: Record<string, unknown>;
}

export interface SionHubWebhookPayload<TData = Record<string, unknown>> {
  event: string;
  timestamp: number;
  data: TData;
}

export enum SionHubWebhookEvent {
  ORDER_PAID = 'order.paid',
  SUBSCRIPTION_RENEWED = 'subscription.renewed',
  ZALO_MSG_FAILED = 'zalo.message_failed',
  ZALO_EVENT_FORWARD = 'zalo.event_forward',
  CAMPAIGN_COMPLETED = 'campaign.completed',
  CREDENTIAL_ROTATED = 'credential.rotated',
}
