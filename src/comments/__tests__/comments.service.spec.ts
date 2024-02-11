import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';
import { PostsService } from 'src/posts/posts.service';
import {
  mockChildComment,
  mockComment,
  mockCommentsByPost,
  mockCommentsByPostResponse,
  mockCreateChildCommentDto,
  mockCreateCommentDto,
  mockPost,
  mockUpdateComment,
  mockUpdateCommentDto,
} from 'test/mock/mock-data';
import { mockCommentRepository } from 'test/mock/mock-repositoy';
import { mockPostsService } from 'test/mock/mock-service';
import { Repository } from 'typeorm';
import { CommentsService } from '../comments.service';
import { CommentEntity } from '../entities/comment.entity';

describe('CommentsService', () => {
  let commentsService: CommentsService;
  let commentRepository: Repository<CommentEntity>;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    commentsService = module.get<CommentsService>(CommentsService);
    commentRepository = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentsService).toBeDefined();
    expect(commentRepository).toBeDefined();
    expect(postsService).toBeDefined();
  });

  describe('[게시글의 댓글 조회]', () => {
    let query: OffsetPageOptionDto;

    beforeEach(() => {
      query = new OffsetPageOptionDto();
    });

    it('조회 성공', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest
        .spyOn(commentRepository.createQueryBuilder(), 'getManyAndCount')
        .mockResolvedValue(mockCommentsByPost);

      const result = await commentsService.findAllByPost(mockPost.id, query);

      expect(result).toEqual(mockCommentsByPostResponse);
      expect(
        commentRepository.createQueryBuilder().leftJoinAndSelect,
      ).toBeCalledTimes(3);
      expect(commentRepository.createQueryBuilder().where).toBeCalledTimes(1);
      expect(commentRepository.createQueryBuilder().andWhere).toBeCalledTimes(
        1,
      );
      expect(commentRepository.createQueryBuilder().take).toBeCalledTimes(1);
      expect(commentRepository.createQueryBuilder().skip).toBeCalledTimes(1);
      expect(commentRepository.createQueryBuilder().orderBy).toBeCalledTimes(1);
      expect(commentRepository.createQueryBuilder().addOrderBy).toBeCalledTimes(
        1,
      );
      expect(
        commentRepository.createQueryBuilder().getManyAndCount,
      ).toBeCalledTimes(1);
    });
  });

  describe('[댓글 및 대댓글 생성]', () => {
    const mockUserId = 1;

    it('댓글 생성 성공', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(mockComment);

      const result = await commentsService.createComment(
        mockCreateCommentDto,
        mockUserId,
      );

      expect(result).toEqual(mockComment);
    });

    it('대댓글 생성 성공', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(mockComment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue(mockChildComment);

      const result = await commentsService.createComment(
        mockCreateChildCommentDto,
        mockUserId,
      );

      expect(result).toEqual(mockChildComment);
    });

    it('댓글 또는 대댓글 생성 실패 - 게시글이 없는 경우(404에러)', async () => {
      jest.spyOn(postsService, 'findOnePostByOptions').mockResolvedValue(null);

      try {
        await commentsService.createComment(mockCreateCommentDto, mockUserId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('대댓글 생성 실패 - 부모 댓글이 없는 경우(404에러)', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(null);

      try {
        await commentsService.createComment(
          mockCreateChildCommentDto,
          mockUserId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('[댓글 또는 대댓글 수정]', () => {
    const mockCommentId = 1;

    it('댓글 또는 대댓글 수정 성공', async () => {
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(mockComment);
      jest
        .spyOn(commentRepository, 'save')
        .mockResolvedValue(mockUpdateComment);

      const result = await commentsService.updateComment(
        mockCommentId,
        mockUpdateCommentDto,
      );

      expect(result).toEqual(mockUpdateComment);
    });

    it('댓글 또는 대댓글 수정 실패 - 해당 댓글이 존재하지 않는 경우(404에러)', async () => {
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(null);

      try {
        await commentsService.updateComment(
          mockCommentId,
          mockUpdateCommentDto,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('[댓글 또는 대댓글 삭제]', () => {
    const mockCommentId = 1;

    it('댓글 또는 대댓글 삭제 성공', async () => {
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(mockComment);
      jest
        .spyOn(commentRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await commentsService.deleteComment(mockCommentId);

      expect(result).toBe(true);
    });

    it('댓글 또는 대댓글 삭제 실패 - 해당 댓글이 존재하지 않는 경우(404에러)', async () => {
      jest
        .spyOn(commentsService, 'findOneCommentByOptions')
        .mockResolvedValue(null);

      try {
        await commentsService.deleteComment(mockCommentId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
