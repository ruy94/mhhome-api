import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  validateSync,
} from 'class-validator';

enum AppEnv {
  development = 'development',
  production = 'production',
  test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(AppEnv)
  NODE_ENV: AppEnv = AppEnv.development;

  @IsInt()
  @Min(1)
  PORT: number = 3000;

  @IsInt()
  @Min(1)
  HTTP_JSON_BODY_LIMIT_BYTES: number = 10 * 1024 * 1024;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsInt()
  REDIS_PORT: number = 6379;

  @IsOptional()
  @IsString()
  REDIS_PASSWORD?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  REDIS_DB?: number;

  @IsOptional()
  @IsString()
  GEMINI_API_KEY?: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: string;

  @IsOptional()
  @IsBoolean()
  ELECTRONIC_INVOICE_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  @IsString()
  ZALO_OA_ID!: string;

  @IsString()
  ZALO_APP_SECRET_KEY!: string;

  @IsString()
  CHECKOUT_SECRET_KEY!: string;

  @IsString()
  ZALO_OPENAPIS_KEY!: string;

  @IsOptional()
  @IsString()
  SION_HUB_URL?: string;

  @IsOptional()
  @IsString()
  SION_HUB_SERVICE_NAME?: string;

  @IsOptional()
  @IsString()
  SION_HUB_API_KEY?: string;

  @IsOptional()
  @IsString()
  SION_HUB_WEBHOOK_SECRET?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SION_HUB_TIMEOUT_MS?: number;

  @IsOptional()
  @IsBoolean()
  SPX_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  SPX_ENV?: string;

  @IsOptional()
  @IsString()
  SPX_BASE_URL?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_APP_ID?: number;

  @IsOptional()
  @IsString()
  SPX_SECRET_KEY?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_USER_ID?: number;

  @IsOptional()
  @IsString()
  SPX_USER_SECRET?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_TIMEOUT_MS?: number;

  @IsOptional()
  @IsInt()
  @IsIn([0, 2])
  SPX_ADDRESS_VERSION?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_SERVICE_TYPE?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_COLLECT_TYPE?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_PAYMENT_ROLE?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_PICKUP_TIME?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  SPX_PICKUP_TIME_RANGE_ID?: number;

  @IsOptional()
  @IsString()
  SPX_PICKUP_TIME_RANGE?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  SPX_HIGH_VALUE_PROCESSING_COLLECTION?: number;

  @IsOptional()
  @IsString()
  SPX_SENDER_NAME?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_PHONE?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_STATE?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_CITY?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_DISTRICT?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_DETAIL_ADDRESS?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_LONGITUDE?: string;

  @IsOptional()
  @IsString()
  SPX_SENDER_LATITUDE?: string;

  @IsOptional()
  @IsBoolean()
  SALEWORK_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  SALEWORK_CLIENT_ID?: string;

  @IsOptional()
  @IsString()
  SALEWORK_TOKEN?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  SALEWORK_TIMEOUT_MS?: number;

  @IsOptional()
  @IsString()
  SALEWORK_STOCK_BASE_URL?: string;

  @IsOptional()
  @IsString()
  SALEWORK_BANKING_BASE_URL?: string;

  @IsOptional()
  @IsBoolean()
  MARKETPLACE_ENABLED?: boolean;

  @IsOptional()
  @IsBoolean()
  MARKETPLACE_CHECKOUT_ENABLED?: boolean;

  @IsOptional()
  @IsString()
  MARKETPLACE_BASE_URL?: string;

  @IsOptional()
  @IsString()
  MARKETPLACE_SHOP_CODE?: string;

  @IsOptional()
  @IsUUID()
  MARKETPLACE_KEY_ID?: string;

  @IsOptional()
  @IsString()
  MARKETPLACE_HMAC_SECRET?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  MARKETPLACE_REQUEST_TIMEOUT_MS?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  MARKETPLACE_HMAC_MAX_SKEW_SECONDS?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  MARKETPLACE_NONCE_TTL_SECONDS?: number;

  @IsOptional()
  @IsInt()
  @Min(30)
  MARKETPLACE_RESERVATION_TTL_SECONDS?: number;

  @IsOptional()
  @IsString()
  MARKETPLACE_MEDIA_IMAGE_BASE_URL?: string;

  @IsOptional()
  @IsString()
  MARKETPLACE_MEDIA_VIDEO_BASE_URL?: string;

  @IsOptional()
  @IsString()
  MARKETPLACE_MEDIA_THUMBNAIL_BASE_URL?: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const normalizedConfig = { ...config };
  const booleanKeys = [
    'ELECTRONIC_INVOICE_ENABLED',
    'SPX_ENABLED',
    'SALEWORK_ENABLED',
    'MARKETPLACE_ENABLED',
    'MARKETPLACE_CHECKOUT_ENABLED',
  ] as const;

  for (const key of booleanKeys) {
    const value = normalizedConfig[key];
    if (value === undefined || typeof value === 'boolean') continue;

    if (typeof value === 'string') {
      const normalizedValue = value.trim().toLowerCase();
      if (normalizedValue === 'true' || normalizedValue === 'false') {
        normalizedConfig[key] = normalizedValue === 'true';
        continue;
      }
    }

    throw new Error(`Env validation failed:\n${key} must be either "true" or "false"`);
  }

  const validated = plainToInstance(EnvironmentVariables, normalizedConfig, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Env validation failed:\n${errors.toString()}`);
  }
  if (validated.MARKETPLACE_CHECKOUT_ENABLED && !validated.MARKETPLACE_ENABLED) {
    throw new Error(
      'Env validation failed:\nMARKETPLACE_CHECKOUT_ENABLED requires MARKETPLACE_ENABLED=true',
    );
  }
  if (validated.MARKETPLACE_ENABLED) {
    const requiredMarketplaceKeys = [
      'MARKETPLACE_BASE_URL',
      'MARKETPLACE_SHOP_CODE',
      'MARKETPLACE_KEY_ID',
      'MARKETPLACE_HMAC_SECRET',
      'MARKETPLACE_MEDIA_IMAGE_BASE_URL',
      'MARKETPLACE_MEDIA_VIDEO_BASE_URL',
      'MARKETPLACE_MEDIA_THUMBNAIL_BASE_URL',
      'SPX_SENDER_NAME',
      'SPX_SENDER_PHONE',
      'SPX_SENDER_STATE',
      'SPX_SENDER_CITY',
      'SPX_SENDER_DETAIL_ADDRESS',
    ] as const;
    const missing = requiredMarketplaceKeys.filter(
      (key) => !String(validated[key] ?? '').trim(),
    );
    if (missing.length) {
      throw new Error(
        `Env validation failed:\nMissing Marketplace configuration: ${missing.join(', ')}`,
      );
    }
  }
  return validated;
}
