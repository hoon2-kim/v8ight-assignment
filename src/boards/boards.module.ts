import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { CommentsModule } from './comments/comments.module';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  imports: [CommentsModule]
})
export class BoardsModule {}
