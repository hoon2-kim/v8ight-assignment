import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  nickname: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;
}
