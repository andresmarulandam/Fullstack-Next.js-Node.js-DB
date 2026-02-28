import pool from '../db/config';
import { CreatePostDTO, UpdatePostDTO, Post } from '../types/post.types';

export const postRepository = {
  async create(data: CreatePostDTO): Promise<Post> {
    const query = `
      INSERT INTO posts (title, content, author_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.title, data.content, data.author_id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findAll(): Promise<Post[]> {
    const query = `
      SELECT p.*, u.email as author_email, u.first_name, u.last_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async findById(id: number): Promise<Post | null> {
    const query = `
      SELECT p.*, u.email as author_email, u.first_name, u.last_name
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  },

  async update(id: number, data: UpdatePostDTO): Promise<Post | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (data.title) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.content) {
      fields.push(`content = $${paramIndex++}`);
      values.push(data.content);
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE posts 
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  },

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },

  async findByAuthor(authorId: number): Promise<Post[]> {
    const query =
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [authorId]);
    return result.rows;
  },
};
