export class RedisKey {
  // Admin permissions (cache sau khi validate JWT)
  static adminPermissions(adminId: string): string {
    return `auth:permissions:${adminId}`;
  }

  // Refresh token blacklist (key tự expire khi token hết hạn)
  static refreshTokenBlacklist(jti: string): string {
    return `auth:blacklist:${jti}`;
  }

  static sionHubApiKey(service: string): string {
    return `integration:${service}:api-key`;
  }

  static sionHubWebhookSecret(service: string): string {
    return `integration:${service}:webhook-secret`;
  }

  static zbsPhoneQuota(templateId: string, phone: string): string {
    return `zbs:quota:phone:${templateId}:${phone}`;
  }

  static zbsUidQuota(templateId: string, uid: string): string {
    return `zbs:quota:uid:${templateId}:${uid}`;
  }
}
