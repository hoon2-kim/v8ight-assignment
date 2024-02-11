import { OffsetPageMetaDto } from './offsetPage-meta.dto';

export class OffsetPageDto<T> {
  readonly data: T[];

  readonly meta: OffsetPageMetaDto;

  constructor(data: T[], meta: OffsetPageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
