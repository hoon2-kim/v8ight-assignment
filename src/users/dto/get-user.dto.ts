import { UserEntity } from '../entities/user.entity';

export class GetSimpleUserResponseDto {
  id: number;

  nickname: string;

  static from(entity: UserEntity): GetSimpleUserResponseDto {
    const dto = new GetSimpleUserResponseDto();
    const { id, nickname } = entity;

    dto.id = id;
    dto.nickname = nickname;

    return dto;
  }
}
