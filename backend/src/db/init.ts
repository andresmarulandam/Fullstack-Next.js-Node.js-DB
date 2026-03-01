import fs from 'fs';
import path from 'path';
import pool from './config';

export async function initializeDatabase() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, 'migrations/001_create_tables.sql'),
      'utf8',
    );

    await pool.query(sql);
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}
