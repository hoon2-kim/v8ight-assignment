import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EPostCategory } from '../entities/post.entity';

export class CreatePostDto {
  @IsEnum(EPostCategory)
  @IsNotEmpty()
  category: EPostCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
