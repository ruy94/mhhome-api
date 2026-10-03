import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import kiotvietConfig from '../../../config/kiotviet.config.js';
import { KiotVietBranch, KiotVietClientService } from './kiotviet-client.service.js';

@Injectable()
export class KiotVietBranchService {
  private cached: KiotVietBranch | null = null;
  private cachedUntil = 0;

  constructor(
    @Inject(kiotvietConfig.KEY) private readonly cfg: ConfigType<typeof kiotvietConfig>,
    private readonly client: KiotVietClientService,
  ) {}

  async resolve(): Promise<KiotVietBranch> {
    if (this.cached && Date.now() < this.cachedUntil) return this.cached;

    let currentItem = 0;
    let total = 0;
    const branches: KiotVietBranch[] = [];
    do {
      const page = await this.client.getBranches(this.cfg.branchId ? 100 : 2, currentItem);
      total = page.total;
      if (!Array.isArray(page.data))
        throw new ServiceUnavailableException('Danh sách chi nhánh KiotViet không hợp lệ');
      branches.push(...page.data);
      currentItem += page.data.length;
      if (!page.data.length) break;
    } while (this.cfg.branchId ? currentItem < total : currentItem < Math.min(total, 2));

    const selected = this.cfg.branchId
      ? branches.find((branch) => branch.id === this.cfg.branchId)
      : total === 1
        ? branches[0]
        : null;
    if (!selected || !Number.isInteger(selected.id) || selected.id <= 0) {
      throw new ServiceUnavailableException(
        this.cfg.branchId
          ? 'KIOTVIET_BRANCH_ID không tồn tại trong gian hàng'
          : total > 1
            ? 'Gian hàng có nhiều chi nhánh; cần cấu hình KIOTVIET_BRANCH_ID'
            : 'Không tìm thấy chi nhánh KiotViet hợp lệ',
      );
    }
    this.cached = selected;
    this.cachedUntil = Date.now() + 60_000;
    return selected;
  }
}
