import { OrderStatus } from '../../generated/prisma/enums.js';
import {
  mapSpxStatusToOrderStatus,
  SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES,
} from './spx-status-mapper.js';

describe('mapSpxStatusToOrderStatus', () => {
  it('does not complete a return while SPX is still returning the parcel', () => {
    expect(mapSpxStatusToOrderStatus('Returning', '6001')).toBeUndefined();
    expect(mapSpxStatusToOrderStatus('Returned', '6001')).toBeUndefined();
  });

  it('completes a return only when SPX reports 6003/Returned', () => {
    expect(mapSpxStatusToOrderStatus('Returned', '6003')).toBe(OrderStatus.Return);
  });

  it('keeps the existing delivered mapping', () => {
    expect(mapSpxStatusToOrderStatus('Delivered', '4001')).toBe(OrderStatus.Paid);
  });

  it('protects terminal local states from stale non-terminal tracking events', () => {
    expect(SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES).toEqual(
      expect.arrayContaining([OrderStatus.Paid, OrderStatus.Cancel, OrderStatus.Return]),
    );
    expect(SPX_NON_TERMINAL_UPDATE_BLOCKED_STATUSES).not.toContain(OrderStatus.Delivering);
  });
});
