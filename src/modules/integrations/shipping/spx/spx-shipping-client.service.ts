import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import shippingConfig from '../../../../config/shipping.config.js';
import type {
  ShippingActualFeeResult,
  ShippingAwbResult,
  ShippingBatchStatusResult,
  ShippingCancelResult,
  ShippingConfirmOrderResult,
  ShippingCreateBatchResult,
  ShippingEstimateResult,
  ShippingOrderDraft,
  ShippingPickupTimeslot,
  ShippingProviderClient,
  ShippingTrackOrderResult,
} from '../../../shipping/shipping.types.js';
import { SpxShippingSignerService } from './spx-shipping-signer.service.js';
import type {
  SpxActualFeeResponseData,
  SpxAwbV1ResponseData,
  SpxAwbV2ResponseData,
  SpxCancelOrderResponseData,
  SpxConfirmOrderResponseData,
  SpxCreateBatchResponseData,
  SpxCreateResultResponseData,
  SpxEstimateResponseData,
  SpxPickupTimeslotResponseData,
  SpxTrackOrderResponseData,
  SpxWrappedResponse,
} from './spx-shipping.types.js';

@Injectable()
export class SpxShippingClientService implements ShippingProviderClient {
  private readonly logger = new Logger(SpxShippingClientService.name);

  constructor(
    @Inject(shippingConfig.KEY)
    private readonly cfg: ConfigType<typeof shippingConfig>,
    private readonly signer: SpxShippingSignerService,
  ) {}

  async checkEstimateOrdersRaw(orders: ShippingOrderDraft[]): Promise<SpxEstimateResponseData> {
    const payload = this.withCredentials({
      orders: orders.map((order) => this.toEstimateOrder(order)),
    });

    return this.request<SpxEstimateResponseData>(
      '/open/api/v1/order/batch_check_order',
      payload,
    );
  }

  async estimateFee(orders: ShippingOrderDraft[]): Promise<ShippingEstimateResult[]> {
    const payload = this.withCredentials({
      orders: orders.map((order) => this.toEstimateOrder(order)),
    });
    const response = await this.request<SpxEstimateResponseData>(
      '/open/api/v1/order/batch_check_order',
      payload,
    );
    const failures = response.fail_list ?? [];
    if (failures.length) {
      const first = failures[0];
      throw new BadRequestException(first.debug_msg || first.message || 'SPX estimate fee failed');
    }

    return (response.orders ?? []).map((order) => ({
      provider: 'SPX',
      providerOrderId: order.order_id,
      estimatedFee: Number(order.estimated_shipping_fee ?? 0),
      basicFee: Number(order.basic_shipping_fee ?? order.estimated_shipping_fee ?? 0),
      raw: order,
    }));
  }

  async createOrdersBatch(orders: ShippingOrderDraft[]): Promise<ShippingCreateBatchResult> {
    const payload = this.withCredentials({
      orders: orders.map((order) => this.toCreateOrder(order)),
    });
    const response = await this.request<SpxCreateBatchResponseData>(
      '/open/api/v2/order/batch_create_order',
      payload,
    );
    return { provider: 'SPX', providerBatchNo: String(response.batch_no), raw: response };
  }

  async getBatchCreateResult(providerBatchNo: string): Promise<ShippingBatchStatusResult> {
    const payload = this.withCredentials({ batch_no: Number(providerBatchNo) });
    const response = await this.request<SpxCreateResultResponseData>(
      '/open/api/v2/order/get_order_create_result',
      payload,
    );

    return {
      provider: 'SPX',
      providerBatchNo: String(response.batch_no),
      taskStatus: response.task_status,
      description: response.description,
      totalCount: response.total_count,
      successCount: response.success_count,
      failCount: response.fail_count,
      progress: response.progress,
      orders: (response.orders ?? []).map((order) => ({
        providerOrderId: order.order_id,
        trackingNo: order.tracking_no,
        trackingLink: order.tracking_link,
        estimatedFee: order.estimated_shipping_fee,
        raw: order,
      })),
      failures: (response.fail_list ?? []).map((item) => ({
        providerOrderId: item.order_id,
        message: item.message ?? 'SPX create order failed',
        debugMessage: item.debug_msg,
        code: item.ret_code,
      })),
      raw: response,
    };
  }

  async getAwbByTrackingNos(trackingNos: string[]): Promise<ShippingAwbResult> {
    const payload = this.withCredentials({ tracking_no_list: trackingNos });
    const response = await this.request<SpxAwbV1ResponseData>(
      '/open/api/v1/order/batch_get_shipping_label',
      payload,
    );

    return {
      provider: 'SPX',
      awbLink: response.awb_link,
      trackingNos,
      failures: (response.fail_list ?? []).map((item) => ({
        trackingNo: item.tracking_no ?? '',
        message: item.message,
        code: item.ret_code,
      })),
      raw: response,
    };
  }

  async getAwbByBatchNo(providerBatchNo: string): Promise<ShippingAwbResult> {
    const payload = this.withCredentials({ batch_no: Number(providerBatchNo) });
    const response = await this.request<SpxAwbV2ResponseData>(
      '/open/api/v2/order/batch_get_shipping_label',
      payload,
    );

    return {
      provider: 'SPX',
      awbLink: response.awb_link,
      batchNo: String(response.batch_no),
      taskStatus: response.task_status,
      description: response.description,
      trackingNos: (response.orders ?? [])
        .map((order) => order.tracking_no)
        .filter((trackingNo): trackingNo is string => Boolean(trackingNo)),
      failures: [],
      raw: response,
    };
  }

  async cancelOrders(trackingNos: string[]): Promise<ShippingCancelResult> {
    const payload = this.withCredentials({ tracking_no_list: trackingNos });
    const response = await this.request<SpxCancelOrderResponseData>(
      '/open/api/v1/order/batch_cancel_order',
      payload,
    );

    return {
      provider: 'SPX',
      trackingNos: response.tracking_no_list ?? [],
      failures: (response.fail_list ?? []).map((item) => ({
        trackingNo: item.tracking_no ?? '',
        message: item.message,
        code: item.ret_code,
      })),
      raw: response,
    };
  }

  async getActualFee(trackingNos: string[]): Promise<ShippingActualFeeResult[]> {
    const payload = this.withCredentials({ tracking_no_list: trackingNos });
    const response = await this.request<SpxActualFeeResponseData>(
      '/open/api/v1/order/batch_get_asf',
      payload,
    );
    const failures = response.fail_list ?? [];
    if (failures.length) {
      const first = failures[0];
      throw new BadRequestException(first.message || 'SPX actual fee failed');
    }

    return (response.orders ?? []).map((order) => ({
      provider: 'SPX',
      trackingNo: order.tracking_no,
      actualFee: Number(order.fee_info?.actual_shipping_fee ?? 0),
      raw: order,
    }));
  }

  async getPickupTimeslots(serviceType: number): Promise<ShippingPickupTimeslot[]> {
    const payload = this.withCredentials({ service_type: serviceType });
    const response = await this.request<SpxPickupTimeslotResponseData>(
      '/open/api/v1/order/get_pickup_time',
      payload,
    );

    return response.map((item) => ({
      date: item.date,
      pickupTime: item.pickup_time,
      slots: (item.slots ?? []).map((slot) => ({
        pickupTimeRangeId: slot.pickup_time_range_id,
        pickupTimeRange: slot.pickup_time_range,
      })),
      raw: item,
    }));
  }

  async trackOrders(input: {
    trackingNos?: string[];
    orderIds?: string[];
    batchNo?: string;
  }): Promise<ShippingTrackOrderResult[]> {
    const payload = this.withCredentials({
      ...(input.trackingNos?.length ? { tracking_no_list: input.trackingNos } : {}),
      ...(input.orderIds?.length ? { order_id_list: input.orderIds } : {}),
      ...(input.batchNo ? { batch_no: Number(input.batchNo) } : {}),
    });
    const response = await this.request<SpxTrackOrderResponseData>(
      '/open/api/v1/order/batch_search_order',
      payload,
    );
    const failures = response.fail_list ?? [];
    if (failures.length && !response.orders?.length) {
      const first = failures[0];
      throw new BadRequestException(first.message || 'SPX track order failed');
    }

    return (response.orders ?? []).map((order) => ({
      provider: 'SPX',
      providerOrderId: order.order_id,
      trackingNo: order.tracking_no,
      trackingLink: order.tracking_link,
      status: order.status,
      statusCode: order.status_code,
      routes: (order.routes ?? []).map((route) => ({
        status: route.status,
        statusCode: route.status_code,
        message: route.message,
        timestamp: route.timestamp,
      })),
      raw: order,
    }));
  }

  async confirmOrder(
    trackingNo: string,
    operation: 1 | 2,
  ): Promise<ShippingConfirmOrderResult> {
    const payload = this.withCredentials({ tracking_no: trackingNo, operation });
    const response = await this.request<SpxConfirmOrderResponseData>(
      '/open/api/v1/order/confirm_order',
      payload,
    );

    return {
      provider: 'SPX',
      trackingNo: response.tracking_no,
      operationResult: response.operation_result,
      raw: response,
    };
  }

  private async request<T>(path: string, body: Record<string, unknown>): Promise<T> {
    this.assertConfigured();

    const payload = JSON.stringify(body);
    const headers = this.signer.createHeaders(this.cfg.spx.appId, this.cfg.spx.secretKey, payload);
    const url = new URL(path.replace(/^\//, ''), this.normalizeBaseUrl(this.cfg.spx.baseUrl));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.cfg.spx.timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: payload,
        signal: controller.signal,
      });
      const responsePayload = await this.readResponse<SpxWrappedResponse<T>>(response);

      if (!response.ok) {
        throw new BadRequestException(
          responsePayload?.message || response.statusText || 'SPX request failed',
        );
      }
      if (!responsePayload || responsePayload.ret_code !== 0) {
        throw new BadRequestException(responsePayload?.message || 'SPX request failed');
      }
      if (responsePayload.data === undefined || responsePayload.data === null) {
        throw new BadRequestException('SPX response missing data');
      }

      return responsePayload.data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      const message = error instanceof Error ? error.message : 'Unable to connect to SPX';
      this.logger.error(`SPX ${path} failed`, message);
      throw new BadRequestException('Không thể kết nối SPX');
    } finally {
      clearTimeout(timeout);
    }
  }

  private withCredentials<T extends Record<string, unknown>>(body: T) {
    return {
      user_id: this.cfg.spx.userId,
      user_secret: this.cfg.spx.userSecret,
      ...body,
    };
  }

  private getAddressVersion(party: { addressVersion?: 0 | 2 }) {
    return party.addressVersion ?? (this.cfg.spx.addressVersion === 2 ? 2 : 0);
  }

  private toEstimateOrder(order: ShippingOrderDraft) {
    const senderAddressVersion = this.getAddressVersion(order.sender);
    const deliverAddressVersion = this.getAddressVersion(order.recipient);

    return {
      order_id: order.orderId,
      base_info: { service_type: order.serviceType },
      sender_info: {
        sender_state: order.sender.state,
        sender_city: order.sender.city,
        sender_address_version: senderAddressVersion,
        ...(senderAddressVersion === 2 ? {} : { sender_district: order.sender.district }),
        ...(order.sender.longitude ? { sender_longitude: order.sender.longitude } : {}),
        ...(order.sender.latitude ? { sender_latitude: order.sender.latitude } : {}),
        ...(order.sender.detailAddress ? { sender_detail_address: order.sender.detailAddress } : {}),
      },
      fulfillment_info: {
        cod_collection: order.codAmount > 0 ? 1 : 0,
        ...(order.codAmount > 0 ? { cod_amount: order.codAmount } : {}),
        high_value_processing_collection: order.highValueProcessingCollection,
        collect_type: order.collectType,
      },
      deliver_info: {
        deliver_state: order.recipient.state,
        deliver_city: order.recipient.city,
        deliver_address_version: deliverAddressVersion,
        ...(deliverAddressVersion === 2 ? {} : { deliver_district: order.recipient.district }),
        ...(order.recipient.longitude ? { deliver_longitude: order.recipient.longitude } : {}),
        ...(order.recipient.latitude ? { deliver_latitude: order.recipient.latitude } : {}),
        ...(order.recipient.detailAddress ? { deliver_detail_address: order.recipient.detailAddress } : {}),
      },
      parcel_info: this.toParcelInfo(order),
    };
  }

  private toCreateOrder(order: ShippingOrderDraft) {
    const senderAddressVersion = this.getAddressVersion(order.sender);
    const deliverAddressVersion = this.getAddressVersion(order.recipient);

    return {
      order_id: order.orderId,
      base_info: { service_type: order.serviceType },
      sender_info: {
        sender_state: order.sender.state,
        sender_city: order.sender.city,
        sender_address_version: senderAddressVersion,
        ...(senderAddressVersion === 2 ? {} : { sender_district: order.sender.district }),
        sender_name: order.sender.name,
        sender_phone: order.sender.phone,
        sender_detail_address: order.sender.detailAddress,
        ...(order.sender.longitude ? { sender_longitude: order.sender.longitude } : {}),
        ...(order.sender.latitude ? { sender_latitude: order.sender.latitude } : {}),
      },
      fulfillment_info: {
        payment_role: order.paymentRole,
        cod_collection: order.codAmount > 0 ? 1 : 0,
        ...(order.codAmount > 0 ? { cod_amount: order.codAmount } : {}),
        high_value_processing_collection: order.highValueProcessingCollection,
        collect_type: order.collectType,
        ...(order.pickupTime ? { pickup_time: order.pickupTime } : {}),
        ...(order.pickupTimeRangeId ? { pickup_time_range_id: order.pickupTimeRangeId } : {}),
        ...(order.pickupTimeRange ? { pickup_time_range: order.pickupTimeRange } : {}),
        allow_mutual_check: 0,
        allow_try_on: 0,
        allow_partial_delivery: 0,
      },
      deliver_info: {
        deliver_state: order.recipient.state,
        deliver_city: order.recipient.city,
        deliver_address_version: deliverAddressVersion,
        ...(deliverAddressVersion === 2 ? {} : { deliver_district: order.recipient.district }),
        deliver_name: order.recipient.name,
        deliver_phone: order.recipient.phone,
        deliver_detail_address: order.recipient.detailAddress,
        ...(order.note ? { deliver_instruction: order.note } : {}),
        ...(order.recipient.longitude ? { deliver_longitude: order.recipient.longitude } : {}),
        ...(order.recipient.latitude ? { deliver_latitude: order.recipient.latitude } : {}),
      },
      parcel_info: {
        ...this.toParcelInfo(order),
        item_list: order.parcel.items.map((item) => ({
          ...(item.itemId ? { item_id: item.itemId } : {}),
          item_name: item.name,
          item_weight: String(item.weightGrams),
          item_price: String(Math.round(item.price)),
          ...(item.picture ? { item_picture: item.picture } : {}),
          item_quantity: item.quantity,
        })),
      },
    };
  }

  private toParcelInfo(order: ShippingOrderDraft) {
    return {
      parcel_weight: Number((order.parcel.weightGrams / 1000).toFixed(3)),
      ...(order.parcel.lengthCm ? { parcel_length: order.parcel.lengthCm } : {}),
      ...(order.parcel.widthCm ? { parcel_width: order.parcel.widthCm } : {}),
      ...(order.parcel.heightCm ? { parcel_height: order.parcel.heightCm } : {}),
      parcel_item_name: order.parcel.itemName,
      parcel_item_quantity: order.parcel.itemQuantity,
      express_insured_value: Math.round(order.parcel.insuredValue),
    };
  }

  private normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  }

  private assertConfigured() {
    if (!this.cfg.spx.appId || !this.cfg.spx.secretKey || !this.cfg.spx.userId || !this.cfg.spx.userSecret) {
      throw new BadRequestException('Thiếu cấu hình SPX');
    }
  }

  private async readResponse<T>(response: Response): Promise<T | null> {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  }
}
