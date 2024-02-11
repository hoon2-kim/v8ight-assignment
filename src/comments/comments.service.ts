import { NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffsetPageMetaDto } from 'src/common/dtos/offsetPage-meta.dto';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';
import { OffsetPageDto } from 'src/common/dtos/offsetPage.dto';
import { FindOneOptions, IsNull, Repository } from 'typeorm';
import { PostsService } from '../posts/posts.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsByPostResponseDto } from './dto/get-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,

    private readonly postsService: PostsService,
  ) {}

  async findOneCommentByOptions(
    options: FindOneOptions<CommentEntity>,
  ): Promise<CommentEntity | null> {
    const comment = await this.commentRepository.findOne(options);

    return comment;
  }

  async findAllByPost(
    postId: number,
    offsetPageOptionDto: OffsetPageOptionDto,
  ): Promise<OffsetPageDto<GetCommentsByPostResponseDto>> {
    const { take, skip } = offsetPageOptionDto;

    const post = await this.postsService.findOnePostByOptions({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    const [comments, total] = await this.commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.child', 'child')
      .leftJoinAndSelect('child.user', 'child_user')
      .where('comment.postId = :postId', { postId })
      .andWhere('comment.parentId IS NULL')
      .orderBy('comment.createdAt', 'DESC')
      .addOrderBy('child.createdAt', 'ASC')
      .take(take)
      .skip(skip)
      .getManyAndCount();

    const pageMeta = new OffsetPageMetaDto({
      offsetPageOptionDto,
      itemCount: total,
    });

    return new OffsetPageDto(
      comments.map((c) => GetCommentsByPostResponseDto.from(c)),
      pageMeta,
    );
  }

  async createComment(createCommentDto: CreateCommentDto, userId: number) {
    const { content, postId, parentCommentId } = createCommentDto;

    const post = await this.postsService.findOnePostByOptions({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    // 대댓글
    if (parentCommentId) {
      const parent = await this.findOneCommentByOptions({
        where: { id: parentCommentId, parent: IsNull() },
      });

      if (!parent) {
        throw new NotFoundException(
          '부모 댓글이 존재하지 않거나 부모 댓글이 아닙니다.',
        );
      }

      return await this.commentRepository.save({
        content,
        user: { id: userId },
        post: { id: postId },
        parent: { id: parentCommentId },
      });
    } else {
      // 댓글
      return await this.commentRepository.save({
        content,
        user: { id: userId },
        post: { id: postId },
      });
    }
  }

  async updateComment(commentId: number, updateCommentDto: UpdateCommentDto) {
    const comment = await this.findOneCommentByOptions({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    }

    Object.assign(comment, updateCommentDto);

    return await this.commentRepository.save(comment);
  }

  async deleteComment(commentId: number) {
    const comment = await this.findOneCommentByOptions({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('해당 댓글이 존재하지 않습니다.');
    }

    const result = await this.commentRepository.delete({ id: commentId });

    return result.affected ? true : false;
  }
}
