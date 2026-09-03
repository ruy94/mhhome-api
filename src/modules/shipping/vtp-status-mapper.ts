import { OrderStatus } from '../../generated/prisma/enums.js';

export interface VtpStatusMapping {
  orderStatus?: OrderStatus;
  shipmentStatus: 'PendingPickup' | 'InTransit' | 'Delivered' | 'Returning' | 'Returned' | 'Cancelled' | 'Failed';
  terminal: boolean;
  restoreInventory: boolean;
}

export function mapVtpStatus(
  statusCode: number,
  isReturning = false,
  hasBeenPickedUp = false,
): VtpStatusMapping {
  if (statusCode === 501) {
    return {
      orderStatus: OrderStatus.Paid,
      shipmentStatus: 'Delivered',
      terminal: true,
      restoreInventory: false,
    };
  }
  if (statusCode === 504) {
    return {
      orderStatus: OrderStatus.Return,
      shipmentStatus: 'Returned',
      terminal: true,
      restoreInventory: true,
    };
  }
  if (statusCode === 101 || statusCode === 107) {
    return {
      orderStatus: hasBeenPickedUp ? undefined : OrderStatus.Cancel,
      shipmentStatus: 'Cancelled',
      terminal: true,
      restoreInventory: !hasBeenPickedUp,
    };
  }
  if (statusCode === 201 || statusCode === 503) {
    return {
      shipmentStatus: 'Failed',
      terminal: true,
      restoreInventory: false,
    };
  }
  if (isReturning || statusCode === 505 || statusCode === 515) {
    return {
      orderStatus: OrderStatus.Delivering,
      shipmentStatus: 'Returning',
      terminal: false,
      restoreInventory: false,
    };
  }
  if ([200, 202, 300, 400, 500, 506, 507, 508, 509, 550].includes(statusCode)) {
    return {
      orderStatus: OrderStatus.Delivering,
      shipmentStatus: 'InTransit',
      terminal: false,
      restoreInventory: false,
    };
  }
  return {
    orderStatus: OrderStatus.Prepare,
    shipmentStatus: 'PendingPickup',
    terminal: false,
    restoreInventory: false,
  };
}
