import { OrderStatus } from '../../generated/prisma/enums.js';

export const SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES = [
  OrderStatus.SoftCancel,
  OrderStatus.Cancel,
  OrderStatus.Return,
  OrderStatus.Paid,
];

export function mapSpxStatusToOrderStatus(status?: string, statusCode?: string) {
  const normalizedStatus = (status ?? '').trim().toLowerCase();
  const normalizedCode = (statusCode ?? '').trim();
  if (!normalizedStatus && !normalizedCode) return undefined;

  if (normalizedCode === '6003') return OrderStatus.Return;
  if (normalizedCode === '6001') return undefined;
  if (normalizedStatus === 'returned') return OrderStatus.Return;
  if (normalizedStatus === 'returning') return undefined;
  if (normalizedStatus.includes('cancel')) return OrderStatus.Cancel;
  if (
    normalizedCode === '4001' ||
    normalizedStatus.includes('delivered') ||
    normalizedStatus.includes('delivery done') ||
    normalizedStatus.includes('completed')
  ) {
    return OrderStatus.Paid;
  }
  if (normalizedStatus.includes('out for delivery') || normalizedStatus.includes('delivering')) {
    return OrderStatus.Delivering;
  }
  if (
    normalizedStatus.includes('pickup') ||
    normalizedStatus.includes('picked') ||
    normalizedStatus.includes('collect') ||
    normalizedStatus.includes('transport') ||
    normalizedStatus.includes('transit') ||
    normalizedStatus.includes('sorting') ||
    normalizedStatus.includes('handover') ||
    normalizedStatus.includes('inbound') ||
    normalizedStatus.includes('outbound')
  ) {
    return OrderStatus.Prepare;
  }

  return undefined;
}
