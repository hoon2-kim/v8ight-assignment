import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity } from 'typeorm';

export enum EBoardCategory {
  notice = '공지사항',
  qna = 'Q&A',
  contactus = '1:1문의',
}

@Entity({ name: 'boards' })
export class BoardEntity extends CommonEntity {
  @Column({ type: 'enum', enum: EBoardCategory })
  category: EBoardCategory;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  commentCount: number;
}
