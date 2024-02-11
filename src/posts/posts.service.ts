import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AwsS3Service } from 'src/aws/aws-s3.service';
import { OffsetPageMetaDto } from 'src/common/dtos/offsetPage-meta.dto';
import { OffsetPageDto } from 'src/common/dtos/offsetPage.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import {
  EPostSort,
  ESearchTarget,
  EViewPeriod,
  PostListQueryDto,
} from './dto/post.query.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EPostCategory, PostEntity } from './entities/post.entity';
import {
  IPostDetailResponse,
  IPostListResponse,
} from './interfaces/post.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    private readonly awsS3Service: AwsS3Service,
  ) {}

  async findOnePostByOptions(
    options: FindOneOptions<PostEntity>,
  ): Promise<PostEntity | null> {
    const post = await this.postRepository.findOne(options);

    return post;
  }

  async findAllPosts(
    postListQueryDto: PostListQueryDto,
  ): Promise<OffsetPageDto<IPostListResponse>> {
    const { s, s_target, sort, view_period, skip, take, category } =
      postListQueryDto;

    const queryRunner = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .select([
        'post.id as id',
        'post.category as category',
        'post.title as title',
        'post.createdAt as created_at',
        'post.view as view',
        'user.id as user_id',
        'user.nickname as user_nickname',
      ]);

    switch (s_target) {
      case ESearchTarget.title_author:
        queryRunner.where('post.title LIKE :title', { title: `%${s}%` });
        queryRunner.orWhere('user.nickname LIKE :nickname', {
          nickname: `%${s}%`,
        });
        break;

      case ESearchTarget.title:
        queryRunner.andWhere('post.title LIKE :title', { title: `%${s}%` });
        break;

      case ESearchTarget.author:
        queryRunner.andWhere('user.nickname LIKE :nickname', {
          nickname: `%${s}%`,
        });
        break;
    }

    switch (sort) {
      case EPostSort.recent:
        break;

      case EPostSort.most_view:
        if (view_period === EViewPeriod.total) {
          queryRunner.addOrderBy('post.view', 'DESC');
          break;
        }
        if (view_period === EViewPeriod.year) {
          queryRunner.andWhere(
            `DATE_FORMAT(post.createdAt, '%Y') = DATE_FORMAT(CURDATE(),'%Y')`,
          );
          queryRunner.addOrderBy('post.view', 'DESC');
          break;
        }
        if (view_period === EViewPeriod.month) {
          queryRunner.andWhere(
            `(DATE_FORMAT(post.createdAt, '%Y-%m')) = DATE_FORMAT(CURDATE(),'%Y-%m')`,
          );
          queryRunner.addOrderBy('post.view', 'DESC');
          break;
        }
        // 오늘을 기준으로 일주일(월요일 시작)
        if (view_period === EViewPeriod.week) {
          queryRunner.andWhere(
            `YEARWEEK(DATE_FORMAT(post.createdAt, '%Y-%m-%d'),7) = YEARWEEK(DATE_FORMAT(CURDATE(),'%Y-%m-%d'),7)`,
          );
          queryRunner.addOrderBy('post.view', 'DESC');
          break;
        }
    }

    switch (category) {
      case EPostCategory.qna:
        queryRunner.andWhere('post.category = :category', {
          category: EPostCategory.qna,
        });
        break;

      case EPostCategory.inquiry:
        queryRunner.andWhere('post.category = :category', {
          category: EPostCategory.inquiry,
        });
        break;

      case EPostCategory.notice:
        queryRunner.andWhere('post.category = :category', {
          category: EPostCategory.notice,
        });
        break;
    }

    const [result, total] = await Promise.all([
      queryRunner
        .addOrderBy('post.createdAt', 'DESC')
        .take(take)
        .skip(skip)
        .getRawMany(),
      queryRunner.getCount(),
    ]);

    const pageMeta = new OffsetPageMetaDto({
      offsetPageOptionDto: postListQueryDto,
      itemCount: total,
    });

    return new OffsetPageDto(result, pageMeta);
  }

  async findOne(id: number): Promise<IPostDetailResponse> {
    const post = await this.postRepository
      .createQueryBuilder('post')
      .select([
        'post.id as id',
        'post.category as category',
        'post.title as title',
        'post.content as content',
        'post.createdAt as created_at',
        'post.view as view',
        'user.id as user_id',
        'user.nickname as user_nickname',
      ])
      .leftJoin('post.user', 'user')
      .where('post.id = :postId', { postId: id })
      .getRawOne();

    if (!post) {
      throw new NotFoundException('해당 게시글이 존재하지 않습니다.');
    }

    // 조회수 증가
    // 만약 조회수가 중요한 정보라면 redis를 이용하여 ip를 저장하는 방식 사용 고려
    await this.postRepository.increment({ id }, 'view', 1);

    return post;
  }

  async create(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postRepository.save({
      ...createPostDto,
      user: { id: userId },
    });
  }

  async upload(id: number, file: Express.Multer.File): Promise<string> {
    const folderName = `posts/${id}`;

    return await this.awsS3Service.uploadFileToS3(folderName, file);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.findOnePostByOptions({ where: { id } });

    if (!post) {
      throw new NotFoundException('해당 글이 존재하지 않습니다.');
    }

    Object.assign(post, updatePostDto);

    const result = await this.postRepository.save(post);

    return result;
  }

  async delete(id: number): Promise<boolean> {
    const post = await this.findOnePostByOptions({ where: { id } });

    if (!post) {
      throw new NotFoundException('해당 글이 존재하지 않습니다.');
    }

    const result = await this.postRepository.delete(id);

    return result.affected ? true : false;
  }
}
