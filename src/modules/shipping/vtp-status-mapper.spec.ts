import { OrderStatus } from '../../generated/prisma/enums.js';

import { mapVtpStatus } from './vtp-status-mapper.js';

describe('mapVtpStatus', () => {
  it('maps delivered and physical return as terminal states', () => {
    expect(mapVtpStatus(501)).toEqual(expect.objectContaining({
      orderStatus: OrderStatus.Paid,
      shipmentStatus: 'Delivered',
      terminal: true,
      restoreInventory: false,
    }));
    expect(mapVtpStatus(504)).toEqual(expect.objectContaining({
      orderStatus: OrderStatus.Return,
      shipmentStatus: 'Returned',
      terminal: true,
      restoreInventory: true,
    }));
  });

  it('does not restore inventory while a parcel is only returning', () => {
    for (const statusCode of [505, 515]) {
      expect(mapVtpStatus(statusCode)).toEqual(expect.objectContaining({
        shipmentStatus: 'Returning',
        terminal: false,
        restoreInventory: false,
      }));
    }
    expect(mapVtpStatus(400, true).shipmentStatus).toBe('Returning');
  });

  it('only restores a cancelled parcel when it has never been picked up', () => {
    expect(mapVtpStatus(101, false)).toEqual(expect.objectContaining({
      orderStatus: OrderStatus.Cancel,
      restoreInventory: true,
    }));
    expect(mapVtpStatus(101, false, true)).toEqual(expect.objectContaining({
      orderStatus: undefined,
      restoreInventory: false,
    }));
  });

  it('keeps provider failures for manual handling without restoring stock', () => {
    for (const statusCode of [201, 503]) {
      expect(mapVtpStatus(statusCode)).toEqual(expect.objectContaining({
        shipmentStatus: 'Failed',
        terminal: true,
        restoreInventory: false,
      }));
    }
  });
});
