import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { ITokenResponse } from 'src/auth/interfaces/auth.interface';
import { CreateCommentDto } from 'src/comments/dto/create-comment.dto';
import { GetCommentsByPostResponseDto } from 'src/comments/dto/get-comment.dto';
import { UpdateCommentDto } from 'src/comments/dto/update-comment.dto';
import { CommentEntity } from 'src/comments/entities/comment.entity';
import { OffsetPageMetaDto } from 'src/common/dtos/offsetPage-meta.dto';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';
import { OffsetPageDto } from 'src/common/dtos/offsetPage.dto';
import { CreatePostDto } from 'src/posts/dto/create-post.dto';
import { PostListQueryDto } from 'src/posts/dto/post.query.dto';
import { UpdatePostDto } from 'src/posts/dto/update-post.dto';
import { EPostCategory, PostEntity } from 'src/posts/entities/post.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

export const mockCreatedUser = {
  id: 1,
  email: 'test@test.com',
  nickname: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
} as UserEntity;

export const mockUser = {
  id: 1,
  email: 'test@test.com',
  nickname: 'test',
  password: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
} as UserEntity;

export const mockCreateUserDto: CreateUserDto = {
  email: 'test@test.com',
  nickname: 'test',
  password: 'test',
};

export const mockLoginUserDto: LoginUserDto = {
  email: 'test@test.com',
  password: 'test',
};

export const mockTokensResponse: ITokenResponse = {
  access_token: 'at',
  refresh_token: 'rt',
};

export const mockPost = {
  id: 1,
  title: 'test',
  content: 'test',
  category: EPostCategory.notice,
  createdAt: new Date(),
  updatedAt: new Date(),
  view: 0,
} as PostEntity;

export const mockCommentsByPost: [CommentEntity[], number] = [
  [
    {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      content: 'test',
      user: {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        email: 'test@test.com',
        nickname: 'test',
        password: 'test',
      } as UserEntity,
      child: [
        {
          id: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
          content: 'test',
          user: {
            id: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
            email: 'test1@test.com',
            nickname: 'test1',
            password: 'test1',
          } as UserEntity,
        } as CommentEntity,
      ],
    } as CommentEntity,
  ],
  1,
];
const pageMeta = new OffsetPageMetaDto({
  offsetPageOptionDto: new OffsetPageOptionDto(),
  itemCount: mockCommentsByPost[1],
});
export const mockCommentsByPostResponse = new OffsetPageDto(
  mockCommentsByPost[0].map((m) => GetCommentsByPostResponseDto.from(m)),
  pageMeta,
);

export const mockComment = {
  id: 1,
  content: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: 1 },
  post: { id: 1 },
} as CommentEntity;

export const mockChildComment = {
  id: 1,
  content: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: { id: 1 },
  post: { id: 1 },
  parent: { id: 2 },
} as CommentEntity;

export const mockCreateCommentDto: CreateCommentDto = {
  postId: 1,
  content: 'test',
};
export const mockCreateChildCommentDto: CreateCommentDto = {
  postId: 1,
  content: 'test',
  parentCommentId: 1,
};

export const mockUpdateCommentDto: UpdateCommentDto = {
  content: '수정',
};

export const mockUpdateComment = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  content: 'test',
} as CommentEntity;

export const mockPostListRaw = [
  {
    id: 1,
    category: EPostCategory.inquiry,
    title: 'test',
    created_at: new Date(),
    view: 1,
    user_id: 1,
    user_nickname: 'test',
  },
  {
    id: 2,
    category: EPostCategory.qna,
    title: 'test',
    created_at: new Date('2023-02-11'),
    view: 100,
    user_id: 2,
    user_nickname: 'test2',
  },
  {
    id: 3,
    category: EPostCategory.notice,
    title: 'test',
    created_at: new Date('2024-01-11'),
    view: 10,
    user_id: 3,
    user_nickname: 'test3',
  },
] as unknown as PostEntity[];
const pageMeta2 = new OffsetPageMetaDto({
  offsetPageOptionDto: new PostListQueryDto(),
  itemCount: mockPostListRaw.length,
});
export const mockPostListResponse = new OffsetPageDto(
  mockPostListRaw,
  pageMeta2,
);

export const mockPostDetail = {
  id: 1,
  category: EPostCategory.inquiry,
  title: '제목',
  content: '내용',
  created_at: new Date(),
  view: 1,
  user_id: 1,
  user_nickname: 'test',
} as unknown as PostEntity;

export const mockCreatePostDto: CreatePostDto = {
  category: EPostCategory.notice,
  title: 'test',
  content: 'test',
};

export const mockUpdatePostDto: UpdatePostDto = {
  title: '수정',
};
