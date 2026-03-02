// backend/src/repositories/user.repository.ts
import pool from '../db/config';
import { ReqResUser } from '../types/user.types';

export const userRepository = {
  async save(user: ReqResUser) {
    const query = `
      INSERT INTO users (id, email, first_name, last_name, avatar)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id) 
      DO UPDATE SET 
        email = EXCLUDED.email,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        avatar = EXCLUDED.avatar,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      user.id,
      user.email,
      user.first_name,
      user.last_name,
      user.avatar,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async findById(id: number) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    return result.rows;
  },

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rowCount ? result.rowCount > 0 : false;
  },
};
