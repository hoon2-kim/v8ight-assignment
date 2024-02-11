import { OffsetPageOptionDto } from './offsetPage-option.dto';

interface IPageMetaDtoParam {
  offsetPageOptionDto: OffsetPageOptionDto;
  itemCount: number;
}

export class OffsetPageMetaDto {
  readonly page: number;

  readonly take: number;

  readonly itemCount: number;

  readonly pageCount: number;

  readonly hasPreviousPage: boolean;

  readonly hasNextPage: boolean;

  constructor({ offsetPageOptionDto, itemCount }: IPageMetaDtoParam) {
    this.page = offsetPageOptionDto.page;
    this.take = offsetPageOptionDto.take;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
