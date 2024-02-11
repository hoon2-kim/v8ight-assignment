import { CommonEntity } from 'src/common/entity/common.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CommentEntity } from '../../comments/entities/comment.entity';

export enum EPostCategory {
  notice = '공지사항',
  qna = 'Q&A',
  inquiry = '1:1문의',
}

@Entity({ name: 'posts' })
export class PostEntity extends CommonEntity {
  @Column({ type: 'enum', enum: EPostCategory })
  category: EPostCategory;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  view: number;

  @ManyToOne(() => UserEntity, (user) => user.posts, { onDelete: 'CASCADE' })
  user: UserEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
}
