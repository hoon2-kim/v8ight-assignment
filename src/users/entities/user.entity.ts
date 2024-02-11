import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PostEntity } from 'src/posts/entities/post.entity';
import { CommentEntity } from 'src/comments/entities/comment.entity';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => UserEntity, (user) => user.comments)
  comments: CommentEntity[];
}
