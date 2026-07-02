export interface ShippingParty {
  state: string;
  city: string;
  district?: string;
  addressVersion?: 0 | 2;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;
  codAvailable?: boolean;
  name?: string;
  phone?: string;
  detailAddress?: string;
  longitude?: string;
  latitude?: string;
}

export interface ShippingParcelItem {
  itemId?: number;
  name: string;
  weightGrams: number;
  price: number;
  quantity: number;
  picture?: string;
}

export interface ShippingParcel {
  weightGrams: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  itemName: string;
  itemQuantity: number;
  insuredValue: number;
  items: ShippingParcelItem[];
}

export interface ShippingOrderDraft {
  orderId: string;
  serviceType: number;
  sender: ShippingParty;
  recipient: ShippingParty;
  paymentRole: number;
  codAmount: number;
  collectType: number;
  pickupTime?: number;
  pickupTimeRangeId?: number;
  pickupTimeRange?: string;
  highValueProcessingCollection: number;
  note?: string;
  parcel: ShippingParcel;
}

export interface ShippingEstimateResult {
  provider: 'SPX';
  providerOrderId: string;
  estimatedFee: number;
  basicFee: number;
  raw: unknown;
}

export interface ShippingCreateBatchResult {
  provider: 'SPX';
  providerBatchNo: string;
  raw: unknown;
}

export interface ShippingCreateResultOrder {
  providerOrderId: string;
  trackingNo: string;
  trackingLink?: string;
  estimatedFee?: number;
  raw: unknown;
}

export interface ShippingCreateResultFailure {
  providerOrderId: string;
  message: string;
  debugMessage?: string;
  code?: number;
}

export interface ShippingBatchStatusResult {
  provider: 'SPX';
  providerBatchNo: string;
  taskStatus: number;
  description?: string;
  totalCount?: number;
  successCount?: number;
  failCount?: number;
  progress?: string;
  orders: ShippingCreateResultOrder[];
  failures: ShippingCreateResultFailure[];
  raw: unknown;
}

export interface ShippingActualFeeResult {
  provider: 'SPX';
  trackingNo: string;
  actualFee: number;
  raw: unknown;
}

export interface ShippingPickupTimeslot {
  date: string;
  pickupTime: number;
  slots: Array<{
    pickupTimeRangeId: number;
    pickupTimeRange: string;
  }>;
  raw: unknown;
}

export interface ShippingTrackRoute {
  status?: string;
  statusCode?: string;
  message?: string;
  timestamp?: number;
}

export interface ShippingTrackOrderResult {
  provider: 'SPX';
  providerOrderId?: string;
  trackingNo?: string;
  trackingLink?: string;
  status?: string;
  statusCode?: string;
  routes: ShippingTrackRoute[];
  raw: unknown;
}

export interface ShippingConfirmOrderResult {
  provider: 'SPX';
  trackingNo: string;
  operationResult: number;
  raw: unknown;
}

export interface ShippingAwbFailure {
  trackingNo: string;
  message?: string;
  code?: number;
}

export interface ShippingAwbResult {
  provider: 'SPX';
  awbLink?: string;
  batchNo?: string;
  taskStatus?: number;
  description?: string;
  trackingNos: string[];
  failures: ShippingAwbFailure[];
  raw: unknown;
}

export interface ShippingCancelResult {
  provider: 'SPX';
  trackingNos: string[];
  failures: ShippingAwbFailure[];
  raw: unknown;
}

export interface ShippingProviderClient {
  estimateFee(orders: ShippingOrderDraft[]): Promise<ShippingEstimateResult[]>;
  createOrdersBatch(orders: ShippingOrderDraft[]): Promise<ShippingCreateBatchResult>;
  getBatchCreateResult(providerBatchNo: string): Promise<ShippingBatchStatusResult>;
  getAwbByTrackingNos(trackingNos: string[]): Promise<ShippingAwbResult>;
  getAwbByBatchNo(providerBatchNo: string): Promise<ShippingAwbResult>;
  cancelOrders(trackingNos: string[]): Promise<ShippingCancelResult>;
  getActualFee(trackingNos: string[]): Promise<ShippingActualFeeResult[]>;
  getPickupTimeslots(serviceType: number): Promise<ShippingPickupTimeslot[]>;
  trackOrders(input: {
    trackingNos?: string[];
    orderIds?: string[];
    batchNo?: string;
  }): Promise<ShippingTrackOrderResult[]>;
  confirmOrder(trackingNo: string, operation: 1 | 2): Promise<ShippingConfirmOrderResult>;
}
