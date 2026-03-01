export interface CreatePostDTO {
  title: string;
  content: string;
  author_id: number;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: Date;
  updated_at: Date;
}
