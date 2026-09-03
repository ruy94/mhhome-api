export interface VtpWrappedResponse<T> {
  status?: number;
  error?: boolean;
  message?: string;
  data?: T;
}

export type VtpFailureStage = 'auth' | 'quote' | 'create' | 'edit' | 'status' | 'print';

export interface VtpFailureDetails {
  stage: VtpFailureStage;
  message: string;
  path?: string;
  httpStatus?: number;
  providerStatus?: number;
  providerPayload?: unknown;
}

export interface VtpLoginData {
  token: string;
  userId?: number;
  partner?: number;
}

export interface VtpResolvedAddress {
  PROVINCE_ID?: number;
  DISTRICT_ID?: number;
  WARD_ID?: number;
  ADDRESS?: string;
}

export interface VtpService {
  MA_DV_CHINH: string;
  TEN_DICHVU: string;
  GIA_CUOC: number;
  THOI_GIAN?: string;
  EXCHANGE_WEIGHT?: number;
  EXTRA_SERVICE?: Array<{
    SERVICE_CODE: string;
    SERVICE_NAME: string;
    DESCRIPTION?: string | null;
  }>;
}

export interface VtpServiceByDetailResponse {
  SENDER_ADDRESS?: VtpResolvedAddress;
  RECEIVER_ADDRESS?: VtpResolvedAddress;
  RESULT?: VtpService[];
}

export interface VtpPriceData {
  MONEY_TOTAL?: number;
  MONEY_TOTAL_FEE?: number;
  MONEY_FEE?: number;
  MONEY_COLLECTION_FEE?: number;
  MONEY_OTHER_FEE?: number;
  MONEY_VAS?: number;
  MONEY_VAT?: number;
  KPI_HT?: number;
  EXCHANGE_WEIGHT?: number;
}

export interface VtpCreateData extends VtpPriceData {
  ORDER_NUMBER: string;
  MONEY_COLLECTION?: number;
  RECEIVER_PROVINCE?: number;
  RECEIVER_DISTRICT?: number;
  RECEIVER_WARD?: number;
  SORT_CODE?: string;
}

export interface VtpQuoteResult {
  provider: 'VTP';
  providerOrderId: string;
  estimatedFee: number;
  basicFee: number;
  serviceCode: string;
  serviceName: string;
  expectedDelivery?: string;
  senderAddress?: VtpResolvedAddress;
  recipientAddress?: VtpResolvedAddress;
  raw: unknown;
}

export interface VtpCreateResult {
  provider: 'VTP';
  providerOrderId: string;
  trackingNo: string;
  estimatedFee: number;
  actualFee: number;
  serviceCode: string;
  serviceName: string;
  expectedDelivery?: string;
  raw: unknown;
}

export interface VtpEditInput {
  recipient?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  weightGrams?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  pickupDate?: string;
  pickupCode?: 0 | 1 | 2 | 3;
  deliveryCode?: -1 | 1 | 2 | 3 | 4 | 5 | 6;
  note?: string;
}

export interface VtpWebhookData {
  ORDER_NUMBER?: string;
  ORDER_REFERENCE?: string;
  ORDER_STATUSDATE?: string;
  ORDER_STATUS?: number;
  STATUS_NAME?: string;
  LOCATION_CURRENTLY?: string;
  LOCALION_CURRENTLY?: string;
  NOTE?: string;
  MONEY_COLLECTION?: number;
  MONEY_FEECOD?: number;
  MONEY_TOTALFEE?: number;
  MONEY_TOTAL?: number;
  MONEY_TOTALVAT?: number;
  MONEY_COLLECTION_ORIGIN?: number | null;
  EXPECTED_DELIVERY?: string;
  PRODUCT_WEIGHT?: number;
  ORDER_SERVICE?: string;
  IS_RETURNING?: boolean;
  REASON_CODE?: string | null;
  RECEIVER_FULLNAME?: string;
}
