import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostMineGuard } from './guard/isPostMine.guard';
import { PostListQueryDto } from './dto/post.query.dto';
import { UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { OffsetPageDto } from 'src/common/dtos/offsetPage.dto';
import {
  IPostDetailResponse,
  IPostListResponse,
} from './interfaces/post.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAllPosts(
    @Query() postListQueryDto: PostListQueryDto,
  ): Promise<OffsetPageDto<IPostListResponse>> {
    return this.postsService.findAllPosts(postListQueryDto);
  }

  @Get(':id')
  findOnePost(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IPostDetailResponse> {
    return this.postsService.findOne(id);
  }

  @UseGuards(AtGuard)
  @Post()
  async createPost(
    @CurrentUser('id') userId: number,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.create(userId, createPostDto);
  }

  @Post(':id/images')
  @UseGuards(AtGuard)
  @UseInterceptors(FileInterceptor('image'))
  async postImageUpload(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File, //
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('파일이 없습니다.');
    }

    return await this.postsService.upload(id, file);
  }

  @UseGuards(AtGuard, IsPostMineGuard)
  @Patch(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @UseGuards(AtGuard, IsPostMineGuard)
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
    return await this.postsService.delete(id);
  }
}
