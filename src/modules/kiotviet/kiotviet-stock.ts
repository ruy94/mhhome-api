export interface KiotVietStock {
  code: string;
  branchId: number;
  onHand: number;
  reserved: number;
}

/** Public API uses `onhand`; some other KiotViet payloads use `onHand`. */
export function parseKiotVietStock(value: unknown, code: unknown): KiotVietStock | null {
  if (!value || typeof value !== 'object' || typeof code !== 'string' || !code.trim()) return null;
  const row = value as Record<string, unknown>;
  const branchId = Number(row.branchId ?? row.BranchId);
  const onHandValue = row.onhand ?? row.onHand ?? row.OnHand;
  const reservedValue = row.reserved ?? row.Reserved ?? 0;
  if (onHandValue === null || onHandValue === undefined || onHandValue === '') return null;
  const onHand = Number(onHandValue);
  const reserved = Number(reservedValue);
  if (
    !Number.isInteger(branchId) || branchId <= 0 ||
    !Number.isFinite(onHand) || onHand < 0 ||
    !Number.isFinite(reserved) || reserved < 0
  ) return null;
  return { code: code.trim(), branchId, onHand, reserved };
}
