import { Test, TestingModule } from '@nestjs/testing';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';
import {
  mockComment,
  mockCommentsByPostResponse,
  mockCreateCommentDto,
  mockUpdateComment,
  mockUpdateCommentDto,
} from 'test/mock/mock-data';
import { mockCommentsService } from 'test/mock/mock-service';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';

const mockPostId = 1;
const mockUserId = 1;
const mockCommentId = 1;

describe('CommentsController', () => {
  let commentsController: CommentsController;
  let commentsService: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    commentsController = module.get<CommentsController>(CommentsController);
    commentsService = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(commentsController).toBeDefined();
    expect(commentsService).toBeDefined();
  });

  describe('[CommentsController.findAllByPost] - 게시글의 댓글 조회', () => {
    const query = new OffsetPageOptionDto();

    it('조회 성공', async () => {
      jest
        .spyOn(commentsService, 'findAllByPost')
        .mockResolvedValue(mockCommentsByPostResponse);

      const result = await commentsController.findAllCommentsByPost(
        mockPostId,
        query,
      );

      expect(result).toEqual(mockCommentsByPostResponse);
      expect(commentsService.findAllByPost).toBeCalled();
      expect(commentsService.findAllByPost).toBeCalledWith(mockPostId, query);
    });
  });

  describe('[CommentsController.createCommentOrReComment] - 댓글/대댓글 생성', () => {
    it('생성 성공', async () => {
      jest
        .spyOn(commentsService, 'createComment')
        .mockResolvedValue(mockComment);

      const result = await commentsController.createCommentOrReComment(
        mockCreateCommentDto,
        mockUserId,
      );

      expect(result).toEqual(mockComment);
      expect(commentsService.createComment).toBeCalled();
      expect(commentsService.createComment).toBeCalledWith(
        mockCreateCommentDto,
        mockUserId,
      );
    });
  });

  describe('[CommentsController.updateCommentOrReComment] - 댓글/대댓글 수정', () => {
    it('수정 성공', async () => {
      jest
        .spyOn(commentsService, 'updateComment')
        .mockResolvedValue(mockUpdateComment);

      const result = await commentsController.updateCommentOrReComment(
        mockCommentId,
        mockUpdateCommentDto,
      );

      expect(result).toEqual(mockUpdateComment);
      expect(commentsService.updateComment).toBeCalled();
      expect(commentsService.updateComment).toBeCalledWith(
        mockCommentId,
        mockUpdateCommentDto,
      );
    });
  });

  describe('[CommentsController.updateCommentOrReComment] - 댓글/대댓글 수정', () => {
    it('수정 성공', async () => {
      jest
        .spyOn(commentsService, 'updateComment')
        .mockResolvedValue(mockUpdateComment);

      const result = await commentsController.updateCommentOrReComment(
        mockCommentId,
        mockUpdateCommentDto,
      );

      expect(result).toEqual(mockUpdateComment);
      expect(commentsService.updateComment).toBeCalled();
      expect(commentsService.updateComment).toBeCalledWith(
        mockCommentId,
        mockUpdateCommentDto,
      );
    });
  });

  describe('[CommentsController.deleteCommentOrReComment] - 댓글/대댓글 삭제', () => {
    it('삭제 성공', async () => {
      jest.spyOn(commentsService, 'deleteComment').mockResolvedValue(true);

      const result = await commentsController.deleteCommentOrReComment(
        mockCommentId,
      );

      expect(result).toBe(true);
      expect(commentsService.deleteComment).toBeCalled();
      expect(commentsService.deleteComment).toBeCalledWith(mockCommentId);
    });
  });
});
