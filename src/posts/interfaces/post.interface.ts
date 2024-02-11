import { EPostCategory } from '../entities/post.entity';

export interface IPostListResponse {
  id: number;
  category: EPostCategory;
  title: string;
  created_at: Date;
  view: number;
  user_id: number;
  user_nickname: number;
}

export interface IPostDetailResponse {
  id: number;
  category: EPostCategory;
  title: string;
  content: string;
  created_at: Date;
  view: number;
  user_id: number;
  user_nickname: number;
}
