import { PageOptionsDto } from './page-options.dto.js';

export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

export class PageMetaDto {
  readonly total: number;
  readonly page: number;
  readonly limit: number | null;
  readonly totalPages: number;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.total = itemCount;
    this.page = pageOptionsDto.page ?? 1;
    this.limit = pageOptionsDto.limit ?? null;
    this.totalPages = pageOptionsDto.limit ? Math.ceil(this.total / pageOptionsDto.limit) : 1;
  }
}
