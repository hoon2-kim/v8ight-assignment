import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { PostsService } from '../posts.service';

@Injectable()
export class IsPostMineGuard implements CanActivate {
  constructor(
    private readonly postsService: PostsService, //
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const user = req.user as UserEntity;

    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const postId = req.params.id;

    if (!postId) {
      throw new BadRequestException('파라미터로 postId가 제공되어야 합니다.');
    }

    const isPostMine = await this.postsService.findOnePostByOptions({
      where: { id: parseInt(postId), user: { id: user.id } },
    });

    if (!isPostMine) {
      throw new ForbiddenException('게시물의 작성자가 아닙니다.');
    }

    return true;
  }
}
