import { CommonEntity } from 'src/common/entity/common.entity';
import { PostEntity } from 'src/posts/entities/post.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'comments' })
export class CommentEntity extends CommonEntity {
  @Column()
  content: string;

  // @Column({ default: 0 })
  // level: number;

  @ManyToOne(() => CommentEntity, (comment) => comment.child, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  parent: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parent)
  child: CommentEntity[];

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    onDelete: 'SET NULL',
  })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.comments, { onDelete: 'CASCADE' })
  post: PostEntity;
}
