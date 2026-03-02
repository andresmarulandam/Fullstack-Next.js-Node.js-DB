export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  created_at: string;
  updated_at: string;
  author_email?: string;
  first_name?: string;
  last_name?: string;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  author_id: number;
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
}
