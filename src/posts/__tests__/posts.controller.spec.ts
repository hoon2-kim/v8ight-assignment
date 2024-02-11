import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockCreatePostDto,
  mockPost,
  mockPostDetail,
  mockPostListResponse,
  mockUpdatePostDto,
} from 'test/mock/mock-data';
import { mockPostsService } from 'test/mock/mock-service';
import { PostListQueryDto } from '../dto/post.query.dto';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
    expect(postsService).toBeDefined();
  });

  describe('[PostsController.findAllPosts] - 게시글 리스트 조회', () => {
    const query = new PostListQueryDto();

    it('조회 성공', async () => {
      jest
        .spyOn(postsService, 'findAllPosts')
        .mockResolvedValue(mockPostListResponse);

      const result = await postsController.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postsService.findAllPosts).toBeCalled();
      expect(postsService.findAllPosts).toBeCalledWith(query);
    });
  });

  describe('[PostsController.findOnePost] - 게시글 상세 조회', () => {
    const mockPostId = 1;

    it('조회 성공', async () => {
      jest.spyOn(postsService, 'findOne').mockResolvedValue(mockPostDetail);

      const result = await postsController.findOnePost(mockPostId);

      expect(result).toEqual(mockPostDetail);
      expect(postsService.findOne).toBeCalled();
      expect(postsService.findOne).toBeCalledWith(mockPostId);
    });
  });

  describe('[PostsController.createPost] - 게시글 생성', () => {
    const mockUserId = 1;

    it('생성 성공', async () => {
      jest.spyOn(postsService, 'create').mockResolvedValue(mockPost);

      const result = await postsController.createPost(
        mockUserId,
        mockCreatePostDto,
      );

      expect(result).toEqual(mockPost);
      expect(postsService.create).toBeCalled();
      expect(postsService.create).toBeCalledWith(mockUserId, mockCreatePostDto);
    });
  });

  describe('[PostsController.postImageUpload] - 게시글 이미지 업로드', () => {
    const mockPostId = 1;
    const file = {
      fieldname: 'image',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from('test.png'),
      size: 51025,
    } as Express.Multer.File;
    const mockUploadUrl = `https://v8ight-s3.s3.ap-northeast-2.amazonaws.com/posts/1/1707657427390_cat.png`;

    it('업로드 성공', async () => {
      jest.spyOn(postsService, 'upload').mockResolvedValue(mockUploadUrl);

      const result = await postsController.postImageUpload(mockPostId, file);

      expect(result).toEqual(mockUploadUrl);
      expect(postsService.upload).toBeCalled();
      expect(postsService.upload).toBeCalledWith(mockPostId, file);
    });

    it('업로드 실패 - 파일이 없는 경우', async () => {
      try {
        await postsController.postImageUpload(mockPostId, null);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('[PostsController.updatePost] - 게시글 수정', () => {
    const mockPostId = 1;

    it('수정 성공', async () => {
      jest.spyOn(postsService, 'update').mockResolvedValue(mockPost);

      const result = await postsController.updatePost(
        mockPostId,
        mockUpdatePostDto,
      );

      expect(result).toEqual(mockPost);
      expect(postsService.update).toBeCalled();
      expect(postsService.update).toBeCalledWith(mockPostId, mockUpdatePostDto);
    });
  });

  describe('[PostsController.deletePost] - 게시글 삭제', () => {
    const mockPostId = 1;

    it('삭제 성공', async () => {
      jest.spyOn(postsService, 'delete').mockResolvedValue(true);

      const result = await postsController.deletePost(mockPostId);

      expect(result).toBe(true);
      expect(postsService.delete).toBeCalled();
      expect(postsService.delete).toBeCalledWith(mockPostId);
    });
  });
});
