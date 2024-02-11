import { GetSimpleUserResponseDto } from 'src/users/dto/get-user.dto';
import { CommentEntity } from '../entities/comment.entity';

export class GetCommentsByPostResponseDto {
  id: number;

  content: string;

  created_at: Date;

  user: GetSimpleUserResponseDto;

  child: GetCommentsByPostResponseDto[];

  static from(entity: CommentEntity): GetCommentsByPostResponseDto {
    const dto = new GetCommentsByPostResponseDto();
    const { id, content, createdAt, user } = entity;

    dto.id = id;
    dto.content = content;
    dto.created_at = createdAt;
    dto.user = GetSimpleUserResponseDto.from(user);
    dto.child = entity.child?.map((c) => GetCommentsByPostResponseDto.from(c));

    return dto;
  }
}
