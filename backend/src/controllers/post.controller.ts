import { Request, Response } from 'express';
import { postRepository } from '../repositories/post.repository';
import { userRepository } from '../repositories/user.repository';
import { createError } from '../middlewares/error.middleware';

export const postController = {
  async create(req: Request, res: Response) {
    try {
      const { title, content, author_id } = req.body;

      if (!title || !content || !author_id) {
        throw createError('Missing required fields: title, content, author_id');
      }

      if (title.length < 3) {
        throw createError('The title must be at least 3 characters long');
      }

      if (content.length < 10) {
        throw createError('The content must be at least 10 characters long');
      }

      const author = await userRepository.findById(author_id);
      if (!author) {
        throw createError(
          'The author does not exist. You must import the user first.',
        );
      }

      const post = await postRepository.create({ title, content, author_id });
      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Error creating post' });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const posts = await postRepository.findAll();
      res.json(posts);
    } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).json({ error: 'Error getting posts' });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const post = await postRepository.findById(id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found ' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error getting post:', error);
      res.status(500).json({ error: 'Error getting post' });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);
      const { title, content } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      if (!title && !content) {
        return res.status(400).json({
          error: 'You must send at least the title or content to update',
        });
      }

      const post = await postRepository.update(id, { title, content });

      if (!post) {
        return res.status(404).json({ error: 'Post not found ' });
      }

      res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Error updating post' });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string, 10);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const deleted = await postRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Post not found ' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Error deleting post' });
    }
  },

  async getByAuthor(req: Request, res: Response) {
    try {
      const authorId = parseInt(req.params.authorId as string, 10);

      if (isNaN(authorId)) {
        return res.status(400).json({ error: 'Invalid author ID' });
      }

      const posts = await postRepository.findByAuthor(authorId);
      res.json(posts);
    } catch (error) {
      console.error('Error retrieving posts from the author:', error);
      res.status(500).json({ error: 'Error retrieving posts from the author' });
    }
  },
};
