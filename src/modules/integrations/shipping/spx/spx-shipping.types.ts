export interface SpxWrappedResponse<T> {
  ret_code: number;
  message: string;
  data?: T;
}

export interface SpxEstimateResponseData {
  orders?: Array<{
    order_id: string;
    estimated_shipping_fee?: number;
    basic_shipping_fee?: number;
  }>;
  fail_list?: Array<{
    order_id: string;
    ret_code?: number;
    message?: string;
    debug_msg?: string;
  }>;
}

export interface SpxCreateBatchResponseData {
  batch_no: number | string;
}

export interface SpxCreateResultResponseData {
  batch_no: number | string;
  task_status: number;
  description?: string;
  total_count?: number;
  success_count?: number;
  fail_count?: number;
  progress?: string;
  orders?: Array<{
    order_id: string;
    tracking_no: string;
    tracking_link?: string;
    estimated_shipping_fee?: number;
  }>;
  fail_list?: Array<{
    order_id: string;
    message?: string;
    debug_msg?: string;
    ret_code?: number;
  }>;
}

export interface SpxActualFeeResponseData {
  orders?: Array<{
    tracking_no: string;
    fee_info?: { actual_shipping_fee?: number };
  }>;
  fail_list?: Array<{
    tracking_no: string;
    ret_code?: number;
    message?: string;
  }>;
}

export type SpxPickupTimeslotResponseData = Array<{
  date: string;
  pickup_time: number;
  slots?: Array<{
    pickup_time_range_id: number;
    pickup_time_range: string;
  }>;
}>;

export interface SpxTrackOrderResponseData {
  orders?: Array<{
    order_id?: string;
    tracking_no?: string;
    tracking_link?: string;
    status?: string;
    status_code?: string;
    routes?: Array<{
      status?: string;
      status_code?: string;
      message?: string;
      timestamp?: number;
    }>;
  }>;
  fail_list?: Array<{
    ret_code?: number;
    message?: string;
    tracking_no?: string;
    order_id?: string;
  }>;
}

export interface SpxConfirmOrderResponseData {
  tracking_no: string;
  operation_result: number;
}

export interface SpxAwbV1ResponseData {
  awb_link?: string;
  fail_list?: Array<{
    ret_code?: number;
    message?: string;
    tracking_no?: string;
  }>;
}

export interface SpxAwbV2ResponseData {
  batch_no: number | string;
  task_status?: number;
  description?: string;
  total_order_count?: number;
  total_print_count?: number;
  success_print_count?: number;
  progress?: string;
  awb_link?: string;
  orders?: Array<{
    order_id?: string;
    tracking_no?: string;
  }>;
}

export interface SpxCancelOrderResponseData {
  tracking_no_list?: string[];
  fail_list?: Array<{
    ret_code?: number;
    message?: string;
    tracking_no?: string;
  }>;
}
