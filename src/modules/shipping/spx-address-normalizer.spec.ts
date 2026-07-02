import { normalizeSpxAddress, normalizeSpxSenderAddress } from './spx-address-normalizer.js';
import { spxServiceArea } from './spx-service-area.js';

function normalizeExactPart(value?: string | null) {
  return (value ?? '').trim().replace(/\s+/g, ' ');
}

describe('SPX two-level address resolver', () => {
  it('maps an exact two-level address from the SPX service area', () => {
    expect(normalizeSpxAddress('Tỉnh Khánh Hòa', '', 'Xã Bắc Ninh Hòa')).toEqual({
      state: 'Tỉnh Khánh Hòa',
      city: 'Xã Bắc Ninh Hòa',
      district: '',
      addressVersion: 2,
      deliveryAvailable: true,
      pickupAvailable: true,
      codAvailable: true,
      status: 'Available',
    });
  });

  it('does not normalize old three-level addresses', () => {
    expect(normalizeSpxAddress('Bạc Liêu', 'Thị Xã Giá Rai', 'Thị Trấn Giá Rai')).toBeNull();
  });

  it('keeps SPX availability flags from the service area file', () => {
    expect(normalizeSpxAddress('Tỉnh Sơn La', '', 'Phường Thảo Nguyên')).toMatchObject({
      deliveryAvailable: false,
      pickupAvailable: false,
      codAvailable: false,
    });
    expect(normalizeSpxAddress('Thành phố Đà Nẵng', '', 'Đặc khu Hoàng Sa')).toMatchObject({
      deliveryAvailable: false,
      codAvailable: false,
    });
  });

  it('can resolve sender addresses with province and ward only', () => {
    expect(normalizeSpxSenderAddress('Tỉnh Khánh Hòa', 'Xã Bắc Ninh Hòa')).toMatchObject({
      state: 'Tỉnh Khánh Hòa',
      city: 'Xã Bắc Ninh Hòa',
      district: '',
      addressVersion: 2,
    });
  });

  it('does not contain duplicated exact province/ward keys', () => {
    const seen = new Map<string, string>();
    const duplicates: string[] = [];

    for (const province of spxServiceArea) {
      for (const ward of province.level2s) {
        const key = [province.name, ward.name].map(normalizeExactPart).join('|');
        const label = `${province.name} / ${ward.name}`;
        const existing = seen.get(key);
        if (existing) duplicates.push(`${existing} <-> ${label}`);
        seen.set(key, label);
      }
    }

    expect(duplicates).toEqual([]);
  });
});
