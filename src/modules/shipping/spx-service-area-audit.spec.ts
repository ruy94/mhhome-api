import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import shippingConfig from '../../config/shipping.config.js';
import { SpxShippingClientService } from '../integrations/shipping/spx/spx-shipping-client.service.js';
import { SpxShippingModule } from '../integrations/shipping/spx/spx-shipping.module.js';
import type { ShippingOrderDraft, ShippingParty } from './shipping.types.js';
import { spxServiceArea } from './spx-service-area.js';

interface AuditTarget {
  province: string;
  ward: string;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  codAvailable: boolean;
  status: string;
}

interface AuditRow extends AuditTarget {
  orderId: string;
  result: 'success' | 'failed' | 'skipped';
  estimatedFee?: number;
  retCode?: number;
  message?: string;
  debugMessage?: string;
}

const shouldRunAudit = process.env.RUN_SPX_AUDIT === 'true';
const maybeDescribe = shouldRunAudit ? describe : describe.skip;

function normalizeFilterValue(value?: string) {
  return (value ?? '').trim().toLocaleLowerCase('vi-VN').replace(/\s+/g, ' ');
}

function matchesFilter(value: string, filter?: string) {
  const normalizedFilter = normalizeFilterValue(filter);
  if (!normalizedFilter) return true;
  return normalizeFilterValue(value) === normalizedFilter;
}

function getPositiveIntegerEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

function getNonNegativeIntegerEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isInteger(value) && value >= 0 ? value : fallback;
}

function getTargets() {
  const targets: AuditTarget[] = [];
  const provinceFilter = process.env.SPX_AUDIT_PROVINCE;
  const wardFilter = process.env.SPX_AUDIT_WARD;
  const limit = process.env.SPX_AUDIT_LIMIT ? getPositiveIntegerEnv('SPX_AUDIT_LIMIT', 0) : 0;

  for (const province of spxServiceArea) {
    if (!matchesFilter(province.name, provinceFilter)) continue;
    for (const ward of province.level2s) {
      if (!matchesFilter(ward.name, wardFilter)) continue;
      targets.push({
        province: province.name,
        ward: ward.name,
        deliveryAvailable: ward.deliveryAvailable,
        pickupAvailable: ward.pickupAvailable,
        codAvailable: ward.codAvailable,
        status: ward.status,
      });
      if (limit > 0 && targets.length >= limit) return targets;
    }
  }

  return targets;
}

function buildDraft(target: AuditTarget, index: number, cfg: ConfigService): ShippingOrderDraft {
  const sender = cfg.get<ShippingParty>('shipping.spx.sender');
  const addressVersion = cfg.get<number>('shipping.spx.addressVersion') === 2 ? 2 : 0;
  if (!sender?.state || !sender.city || !sender.detailAddress) {
    throw new Error('Thiếu cấu hình SPX_SENDER_STATE, SPX_SENDER_CITY hoặc SPX_SENDER_DETAIL_ADDRESS');
  }
  if (addressVersion === 0 && !sender.district) {
    throw new Error('Thiếu cấu hình SPX_SENDER_DISTRICT cho address version 0');
  }

  return {
    orderId: `audit_${String(index + 1).padStart(6, '0')}`,
    serviceType: cfg.get<number>('shipping.spx.serviceType') ?? 1,
    sender: { ...sender, addressVersion },
    recipient: {
      state: target.province,
      city: target.ward,
      district: '',
      addressVersion: 2,
      detailAddress: process.env.SPX_AUDIT_DETAIL_ADDRESS ?? 'Dia chi audit SPX',
    },
    paymentRole: cfg.get<number>('shipping.spx.paymentRole') ?? 1,
    codAmount: getNonNegativeIntegerEnv('SPX_AUDIT_COD_AMOUNT', 10000),
    collectType: cfg.get<number>('shipping.spx.collectType') ?? 2,
    pickupTime: cfg.get<number>('shipping.spx.pickupTime'),
    pickupTimeRangeId: cfg.get<number>('shipping.spx.pickupTimeRangeId'),
    pickupTimeRange: cfg.get<string>('shipping.spx.pickupTimeRange') || undefined,
    highValueProcessingCollection: cfg.get<number>('shipping.spx.highValueProcessingCollection') ?? 1,
    parcel: {
      weightGrams: getPositiveIntegerEnv('SPX_AUDIT_WEIGHT_GRAMS', 300),
      itemName: 'SPX service area audit',
      itemQuantity: 1,
      insuredValue: getPositiveIntegerEnv('SPX_AUDIT_INSURED_VALUE', 10000),
      items: [
        {
          name: 'SPX service area audit',
          weightGrams: getPositiveIntegerEnv('SPX_AUDIT_WEIGHT_GRAMS', 300),
          price: getPositiveIntegerEnv('SPX_AUDIT_INSURED_VALUE', 10000),
          quantity: 1,
        },
      ],
    },
  };
}

function toCsvValue(value: unknown) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

async function writeReport(rows: AuditRow[]) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '-');
  const path = join('/tmp', `spx-service-area-audit-${timestamp}.csv`);
  const header = [
    'province',
    'ward',
    'deliveryAvailable',
    'codAvailable',
    'pickupAvailable',
    'spxStatus',
    'orderId',
    'result',
    'estimatedFee',
    'retCode',
    'message',
    'debugMessage',
  ];
  const content = [
    header.join(','),
    ...rows.map((row) =>
      [
        row.province,
        row.ward,
        row.deliveryAvailable,
        row.codAvailable,
        row.pickupAvailable,
        row.status,
        row.orderId,
        row.result,
        row.estimatedFee,
        row.retCode,
        row.message,
        row.debugMessage,
      ]
        .map(toCsvValue)
        .join(','),
    ),
  ].join('\n');

  await writeFile(path, `${content}\n`, 'utf8');
  return path;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'SPX batch_check_order failed';
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

maybeDescribe('SPX service area audit', () => {
  let moduleRef: TestingModule;
  let spxClient: SpxShippingClientService;
  let configService: ConfigService;

  beforeAll(async () => {
    const envName = process.env.SPX_AUDIT_ENV ?? 'development';
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: false,
          load: [shippingConfig],
          envFilePath: [`.env.${envName}`],
        }),
        SpxShippingModule,
      ],
    }).compile();

    spxClient = moduleRef.get(SpxShippingClientService);
    configService = moduleRef.get(ConfigService);
  });

  afterAll(async () => {
    await moduleRef?.close();
  });

  it('accepts every selected two-level SPX service area in batch_check_order', async () => {
    const targets = getTargets();
    const testableTargets = targets.filter((target) => target.deliveryAvailable);
    const skippedRows: AuditRow[] = targets
      .filter((target) => !target.deliveryAvailable)
      .map((target, index) => ({
        ...target,
        orderId: `skip_${String(index + 1).padStart(6, '0')}`,
        result: 'skipped',
        message: 'Delivery unavailable in SPX service area file',
      }));
    const batchSize = getPositiveIntegerEnv('SPX_AUDIT_BATCH_SIZE', 50);
    const delayMs = getPositiveIntegerEnv('SPX_AUDIT_DELAY_MS', 300);
    const rows: AuditRow[] = [...skippedRows];

    expect(targets.length).toBeGreaterThan(0);

    for (let start = 0; start < testableTargets.length; start += batchSize) {
      const batchTargets = testableTargets.slice(start, start + batchSize);
      const drafts = batchTargets.map((target, offset) => buildDraft(target, start + offset, configService));

      try {
        const result = await spxClient.checkEstimateOrdersRaw(drafts);
        const successByOrderId = new Map((result.orders ?? []).map((order) => [order.order_id, order]));
        const failureByOrderId = new Map((result.fail_list ?? []).map((failure) => [failure.order_id, failure]));

        drafts.forEach((draft, index) => {
          const target = batchTargets[index];
          const success = successByOrderId.get(draft.orderId);
          const failure = failureByOrderId.get(draft.orderId);

          if (success) {
            rows.push({
              ...target,
              orderId: draft.orderId,
              result: 'success',
              estimatedFee: Number(success.estimated_shipping_fee ?? 0),
            });
            return;
          }

          rows.push({
            ...target,
            orderId: draft.orderId,
            result: 'failed',
            retCode: failure?.ret_code,
            message: failure?.message ?? 'SPX did not return this order in success list',
            debugMessage: failure?.debug_msg,
          });
        });
      } catch (error) {
        const message = getErrorMessage(error);
        drafts.forEach((draft, index) => {
          rows.push({
            ...batchTargets[index],
            orderId: draft.orderId,
            result: 'failed',
            message,
          });
        });
      }

      if (delayMs > 0 && start + batchSize < testableTargets.length) await delay(delayMs);
    }

    const failures = rows.filter((row) => row.result === 'failed');
    const reportPath = await writeReport(rows);
    console.log(`SPX service area audit: ${rows.filter((row) => row.result === 'success').length}/${testableTargets.length} passed`);
    console.log(`SPX service area audit skipped unavailable areas: ${skippedRows.length}`);
    console.log(`SPX service area audit report: ${reportPath}`);
    if (failures.length) {
      console.log(`SPX service area audit failed areas: ${failures.length}`);
      console.log(
        failures.slice(0, 10).map((failure) => ({
          province: failure.province,
          ward: failure.ward,
          retCode: failure.retCode,
          message: failure.message,
        })),
      );
    }

    expect(failures.length).toBe(0);
  }, 30 * 60 * 1000);
});
