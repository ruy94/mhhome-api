import 'reflect-metadata';

jest.mock('../../../generated/prisma/client.js', () => ({
  PaymentMethod: { COD: 'COD', ZaloPay: 'ZaloPay' },
  ShippingProvider: { SPX: 'SPX', JNT: 'JNT' },
}));

import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateOrderDto,
  ElectronicInvoiceType,
} from './create-order.dto.js';

function makeDto(invoiceRequest: Record<string, unknown>) {
  return plainToInstance(CreateOrderDto, {
    userId: 1,
    addressId: 1,
    paymentMethod: 'COD',
    items: [{ productId: 1, variantId: 1, quantity: 1 }],
    invoiceRequest,
  });
}

describe('ElectronicInvoiceRequestDto', () => {
  it('accepts a valid individual invoice request', async () => {
    const dto = makeDto({
      type: ElectronicInvoiceType.Individual,
      customerName: 'Nguyễn Văn A',
      address: '123 Nguyễn Trãi',
      taxCode: '123456789012',
      email: 'customer@example.com',
      citizenId: '012345678901',
    });

    await expect(validate(dto)).resolves.toHaveLength(0);
  });

  it('requires household name and a 12-digit tax code', async () => {
    const dto = makeDto({
      type: ElectronicInvoiceType.HouseholdBusiness,
      customerName: 'Nguyễn Văn A',
      address: '123 Nguyễn Trãi',
      taxCode: '1234567890',
      email: 'customer@example.com',
    });

    const errors = await validate(dto);
    expect(errors.some((error) => error.property === 'invoiceRequest')).toBe(true);
  });

  it('accepts company and branch tax-code formats', async () => {
    const company = makeDto({
      type: ElectronicInvoiceType.Company,
      customerName: 'Nguyễn Văn A',
      entityName: 'Công ty A',
      address: '123 Nguyễn Trãi',
      taxCode: '1234567890',
      email: 'invoice@example.com',
    });
    const branch = makeDto({
      type: ElectronicInvoiceType.Company,
      customerName: 'Nguyễn Văn A',
      entityName: 'Chi nhánh A',
      address: '123 Nguyễn Trãi',
      taxCode: '1234567890-123',
      email: 'invoice@example.com',
    });

    await expect(validate(company)).resolves.toHaveLength(0);
    await expect(validate(branch)).resolves.toHaveLength(0);
  });
});
