export const KIOTVIET_STOCK_QUEUE = 'kiotviet-stock-webhook';
export const KIOTVIET_STOCK_EVENT_JOB = 'stock-update';
export const KIOTVIET_STOCK_SYNC_JOB = 'stock-sync';

export type KiotVietStockSyncSource =
  | 'STARTUP'
  | 'POLL'
  | 'MANUAL'
  | 'CHECKOUT'
  | 'ORDER_PAID'
  | 'ORDER_RESERVED'
  | 'ORDER_COMPLETED'
  | 'ORDER_CANCELLED';

export interface KiotVietStockEventJob {
  eventId: string;
  branches: number[];
  codes: string[];
}

export interface KiotVietStockSyncJob {
  source: KiotVietStockSyncSource;
  codes: string[];
  requestedAt: string;
  orderId?: number;
}

export interface KiotVietStockSyncRequestResult {
  state: 'QUEUED' | 'RUNNING';
  accepted: true;
  started: boolean;
  jobId: string;
  message: string;
}

export interface KiotVietStockSyncFailedItem {
  variantId: number;
  code: string | null;
  reason: string;
}

export interface KiotVietStockSyncProgress {
  phase: 'STARTING' | 'FETCHING' | 'SAVING';
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
}

export interface KiotVietStockSyncResult {
  total: number;
  totalLinked: number;
  succeeded: number;
  updated: number;
  unchanged: number;
  failed: number;
  skipped: number;
  failedItems: KiotVietStockSyncFailedItem[];
  skippedItems: KiotVietStockSyncFailedItem[];
  items: Array<{
    variantId: number;
    kiotvietProductCode: string | null;
    kiotVietAvailableStock: number;
    localHeldStock: number;
    safetyStock: number;
    appliedStock: number;
  }>;
}

export interface KiotVietStockSyncJobStatus {
  jobId: string;
  state: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'PARTIAL' | 'FAILED';
  source: KiotVietStockSyncSource;
  requestedAt: string;
  progress: KiotVietStockSyncProgress | null;
  result: KiotVietStockSyncResult | null;
  error: string | null;
}
