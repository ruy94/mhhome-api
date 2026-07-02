import { spxServiceArea } from './spx-service-area.js';

export const SPX_ADDRESS_UPDATE_REQUIRED_MESSAGE =
  'Địa chỉ giao hàng đã cũ, vui lòng cập nhật lại địa chỉ mới.';
export const SPX_DELIVERY_UNAVAILABLE_MESSAGE = 'Địa chỉ này SPX không hỗ trợ giao hàng';
export const SPX_COD_UNAVAILABLE_MESSAGE = 'Địa chỉ này SPX không hỗ trợ thanh toán COD';
export const SPX_PICKUP_UNAVAILABLE_MESSAGE = 'Địa chỉ gửi hàng SPX không hỗ trợ lấy hàng';

export interface NormalizedSpxAddress {
  state: string;
  city: string;
  district: string;
  addressVersion: 2;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  codAvailable: boolean;
  status: string;
}

function normalizeExactPart(value?: string | null) {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

function buildKey(province?: string | null, ward?: string | null) {
  return `${normalizeExactPart(province)}|${normalizeExactPart(ward)}`;
}

const addressMap = new Map<string, NormalizedSpxAddress>();

for (const province of spxServiceArea) {
  for (const ward of province.level2s) {
    addressMap.set(buildKey(province.name, ward.name), {
      state: province.name,
      city: ward.name,
      district: '',
      addressVersion: 2,
      deliveryAvailable: ward.deliveryAvailable,
      pickupAvailable: ward.pickupAvailable,
      codAvailable: ward.codAvailable,
      status: ward.status,
    });
  }
}

export function normalizeSpxAddress(
  city?: string | null,
  district?: string | null,
  ward?: string | null,
): NormalizedSpxAddress | null {
  if (normalizeExactPart(district)) return null;
  return addressMap.get(buildKey(city, ward)) ?? null;
}

export function normalizeSpxSenderAddress(
  state?: string | null,
  city?: string | null,
): NormalizedSpxAddress | null {
  return addressMap.get(buildKey(state, city)) ?? null;
}
