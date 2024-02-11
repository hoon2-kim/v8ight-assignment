import { Query } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { OffsetPageOptionDto } from 'src/common/dtos/offsetPage-option.dto';
import { OffsetPageDto } from 'src/common/dtos/offsetPage.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetCommentsByPostResponseDto } from './dto/get-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { IsCommentOrReCommentMineGuard } from './guard/isMineComment.guard';

@Controller('')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get('posts/:postId/comments')
  async findAllCommentsByPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query() offsetPageOptionDto: OffsetPageOptionDto,
  ): Promise<OffsetPageDto<GetCommentsByPostResponseDto>> {
    return await this.commentsService.findAllByPost(
      postId,
      offsetPageOptionDto,
    );
  }

  @UseGuards(AtGuard)
  @Post('comments')
  async createCommentOrReComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.commentsService.createComment(createCommentDto, userId);
  }

  @UseGuards(AtGuard, IsCommentOrReCommentMineGuard)
  @Patch('comments/:commentId')
  async updateCommentOrReComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.updateComment(
      commentId,
      updateCommentDto,
    );
  }

  @UseGuards(AtGuard, IsCommentOrReCommentMineGuard)
  @Delete('comments/:commentId')
  async deleteCommentOrReComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    return await this.commentsService.deleteComment(commentId);
  }
}
