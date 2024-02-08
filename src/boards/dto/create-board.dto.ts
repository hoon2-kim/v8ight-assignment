import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EBoardCategory } from '../entities/board.entity';

export class CreateBoardDto {
  @IsEnum(EBoardCategory)
  @IsNotEmpty()
  category: EBoardCategory;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
