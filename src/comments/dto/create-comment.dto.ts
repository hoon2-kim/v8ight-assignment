import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  parentCommentId?: number;
}
