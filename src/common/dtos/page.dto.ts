import { PageMetaDto } from './page-meta.dto.js';

export class PageDto<T> {
  readonly items: T[];
  readonly meta: PageMetaDto;

  constructor(items: T[], meta: PageMetaDto) {
    this.items = items;
    this.meta = meta;
  }
}
