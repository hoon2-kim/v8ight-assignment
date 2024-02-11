import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import {
  mockCreatePostDto,
  mockPost,
  mockPostDetail,
  mockPostListRaw,
  mockPostListResponse,
  mockUpdatePostDto,
} from 'test/mock/mock-data';
import { mockPostRepository } from 'test/mock/mock-repositoy';
import { mockAwsS3Service } from 'test/mock/mock-service';
import { Repository } from 'typeorm';
import {
  EPostSort,
  ESearchTarget,
  EViewPeriod,
  PostListQueryDto,
} from '../dto/post.query.dto';
import { PostEntity } from '../entities/post.entity';
import { PostsService } from '../posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let postRepository: Repository<PostEntity>;
  let awsS3Service: AwsS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(PostEntity),
          useValue: mockPostRepository,
        },
        { provide: AwsS3Service, useValue: mockAwsS3Service },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    postRepository = module.get<Repository<PostEntity>>(
      getRepositoryToken(PostEntity),
    );
    awsS3Service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
    expect(postRepository).toBeDefined();
    expect(awsS3Service).toBeDefined();
  });

  describe('[게시글 리스트 조회]', () => {
    let query: PostListQueryDto;

    beforeEach(() => {
      query = new PostListQueryDto();
    });

    it('조회 성공 - 쿼리없이 조회', async () => {
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(
        postRepository.createQueryBuilder().leftJoinAndSelect,
      ).toBeCalledTimes(1);
      expect(postRepository.createQueryBuilder().select).toBeCalledTimes(1);
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledTimes(1);
      expect(postRepository.createQueryBuilder().getRawMany).toBeCalledTimes(1);
      expect(postRepository.createQueryBuilder().getCount).toBeCalledTimes(1);
    });

    it('조회 성공 - 검색 쿼리 호출 테스트(제목+작성자) ', async () => {
      query.s_target = ESearchTarget.title_author;
      query.s = '검색';

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().where).toBeCalledWith(
        'post.title LIKE :title',
        { title: `%${query.s}%` },
      );
      expect(postRepository.createQueryBuilder().orWhere).toBeCalledWith(
        'user.nickname LIKE :nickname',
        {
          nickname: `%${query.s}%`,
        },
      );
    });

    it('조회 성공 - 검색 쿼리 호출 테스트(제목) ', async () => {
      query.s_target = ESearchTarget.title;
      query.s = '검색';

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().andWhere).toBeCalledWith(
        'post.title LIKE :title',
        { title: `%${query.s}%` },
      );
    });

    it('조회 성공 - 검색 쿼리 호출 테스트(작성자) ', async () => {
      query.s_target = ESearchTarget.author;
      query.s = '검색';

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().andWhere).toBeCalledWith(
        'user.nickname LIKE :nickname',
        {
          nickname: `%${query.s}%`,
        },
      );
    });

    it('조회 성공 - 정렬 쿼리 호출 테스트(전체기간) ', async () => {
      query.sort = EPostSort.most_view;
      query.view_period = EViewPeriod.total;

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledWith(
        'post.view',
        'DESC',
      );
    });

    it('조회 성공 - 정렬 쿼리 호출 테스트(전체기간) ', async () => {
      query.sort = EPostSort.most_view;
      query.view_period = EViewPeriod.total;

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledWith(
        'post.view',
        'DESC',
      );
    });

    it('조회 성공 - 정렬 쿼리 호출 테스트(일년) ', async () => {
      query.sort = EPostSort.most_view;
      query.view_period = EViewPeriod.year;

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().andWhere).toBeCalledWith(
        `DATE_FORMAT(post.createdAt, '%Y') = DATE_FORMAT(CURDATE(),'%Y')`,
      );
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledWith(
        'post.view',
        'DESC',
      );
    });

    it('조회 성공 - 정렬 쿼리 호출 테스트(한달) ', async () => {
      query.sort = EPostSort.most_view;
      query.view_period = EViewPeriod.month;

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().andWhere).toBeCalledWith(
        `(DATE_FORMAT(post.createdAt, '%Y-%m')) = DATE_FORMAT(CURDATE(),'%Y-%m')`,
      );
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledWith(
        'post.view',
        'DESC',
      );
    });

    it('조회 성공 - 정렬 쿼리 호출 테스트(일주일) ', async () => {
      query.sort = EPostSort.most_view;
      query.view_period = EViewPeriod.week;

      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawMany')
        .mockResolvedValue(mockPostListRaw);
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getCount')
        .mockResolvedValue(mockPostListRaw.length);

      const result = await postsService.findAllPosts(query);

      expect(result).toEqual(mockPostListResponse);
      expect(postRepository.createQueryBuilder().andWhere).toBeCalledWith(
        `YEARWEEK(DATE_FORMAT(post.createdAt, '%Y-%m-%d'),7) = YEARWEEK(DATE_FORMAT(CURDATE(),'%Y-%m-%d'),7)`,
      );
      expect(postRepository.createQueryBuilder().addOrderBy).toBeCalledWith(
        'post.view',
        'DESC',
      );
    });
  });

  describe('[게시물 상세 조회]', () => {
    const mockPostId = 1;

    it('조회 성공', async () => {
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawOne')
        .mockResolvedValue(mockPostDetail);
      jest
        .spyOn(postRepository, 'increment')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      const result = await postsService.findOne(mockPostId);

      expect(result).toEqual(mockPostDetail);
    });

    it('조회 실패 - 해당 게시글이 없는 경우(404에러)', async () => {
      jest
        .spyOn(postRepository.createQueryBuilder(), 'getRawOne')
        .mockResolvedValue(null);

      try {
        await postsService.findOne(mockPostId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('[게시글 생성]', () => {
    const mockUserId = 1;

    it('생성 성공', async () => {
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost);

      const result = await postsService.create(mockUserId, mockCreatePostDto);

      expect(result).toEqual(mockPost);
    });
  });

  describe('[게시글 수정]', () => {
    const mockPostId = 1;

    it('수정 성공', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest.spyOn(postRepository, 'save').mockResolvedValue(mockPost);

      const result = await postsService.update(mockPostId, mockUpdatePostDto);

      expect(result).toEqual(mockPost);
    });

    it('수정 실패 - 해당 게시글이 없는 경우', async () => {
      jest.spyOn(postsService, 'findOnePostByOptions').mockResolvedValue(null);

      try {
        await postsService.update(mockPostId, mockUpdatePostDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('[게시글 삭제]', () => {
    const mockPostId = 1;

    it('삭제 성공', async () => {
      jest
        .spyOn(postsService, 'findOnePostByOptions')
        .mockResolvedValue(mockPost);
      jest
        .spyOn(postRepository, 'delete')
        .mockResolvedValue({ affected: 1, raw: [] });

      const result = await postsService.delete(mockPostId);

      expect(result).toBe(true);
    });

    it('삭제 실패 - 해당 게시글이 없는 경우', async () => {
      jest.spyOn(postsService, 'findOnePostByOptions').mockResolvedValue(null);

      try {
        await postsService.delete(mockPostId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('[게시글 이미지 업로드]', () => {
    const file = {
      fieldname: 'image',
      originalname: 'test.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from('test.png'),
      size: 51025,
    } as Express.Multer.File;
    const mockPostId = 1;

    const mockUploadUrl = `https://v8ight-s3.s3.ap-northeast-2.amazonaws.com/posts/1/1707657427390_cat.png`;

    it('영상 업로드 성공', async () => {
      jest
        .spyOn(awsS3Service, 'uploadFileToS3')
        .mockResolvedValue(mockUploadUrl);

      const result = await postsService.upload(mockPostId, file);

      expect(result).toEqual(mockUploadUrl);
    });
  });
});
