import { CanActivate } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { CommentsService } from '../comments.service';

@Injectable()
export class IsCommentOrReCommentMineGuard implements CanActivate {
  constructor(
    private readonly commentsService: CommentsService, //
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;

    const user = req.user as UserEntity;

    if (!user) {
      throw new UnauthorizedException('유저가 존재하지 않습니다.');
    }

    const commentId = req.params.commentId;

    if (!commentId) {
      throw new BadRequestException(
        '파라미터로 commentId가 제공되어야 합니다.',
      );
    }

    const isPostMine = await this.commentsService.findOneCommentByOptions({
      where: { id: parseInt(commentId), user: { id: user.id } },
    });

    if (!isPostMine) {
      throw new ForbiddenException('댓글 또는 대댓글의 작성자가 아닙니다.');
    }

    return true;
  }
}
