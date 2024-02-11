import { IsEnum, IsOptional } from 'class-validator';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';

export enum ESearchTarget {
  title_author = 'title_author',
  title = 'title',
  author = 'author',
}

export enum EPostSort {
  recent = 'recent',
  most_view = 'most_view',
}

export enum EViewPeriod {
  total = 'total',
  year = 'year',
  month = 'month',
  week = 'week',
}

export class PostListQueryDto extends OffsetPageOptionDto {
  @IsOptional()
  @IsEnum(EPostSort)
  sort: EPostSort;

  @IsOptional()
  @IsEnum(EViewPeriod)
  view_period: EViewPeriod;

  @IsOptional()
  s: string;

  @IsOptional()
  @IsEnum(ESearchTarget)
  s_target: ESearchTarget;
}
