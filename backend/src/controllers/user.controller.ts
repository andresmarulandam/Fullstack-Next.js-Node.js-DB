import { Request, Response } from 'express';
import { reqresService } from '../services/reqres.service';
import { userRepository } from '../repositories/user.repository';

export const userController = {
  async importUser(req: Request, res: Response) {
    try {
      const idParam = req.params.id;

      const idString = Array.isArray(idParam) ? idParam[0] : idParam;

      const id = parseInt(idString);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'invalid ID' });
      }

      const result = await reqresService.getUserById(id);

      if (result.status !== 200) {
        return res.status(result.status).json(result.data);
      }

      const user = result.data.data;
      const savedUser = await userRepository.save(user);

      res.status(201).json({
        message: 'User successfully imported',
        user: savedUser,
      });
    } catch (error) {
      console.error('Error importing user:', error);
      res.status(500).json({ error: 'Error importing user' });
    }
  },

  async getSavedUsers(req: Request, res: Response) {
    try {
      const users = await userRepository.findAll();
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Error getting users' });
    }
  },

  async getSavedUserById(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const idString = Array.isArray(idParam) ? idParam[0] : idParam;
      const id = parseInt(idString);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'invalid ID' });
      }

      const user = await userRepository.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Error getting user' });
    }
  },

  async deleteSavedUser(req: Request, res: Response) {
    try {
      const idParam = req.params.id;
      const idString = Array.isArray(idParam) ? idParam[0] : idParam;
      const id = parseInt(idString);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
      }

      const deleted = await userRepository.delete(id);

      if (!deleted) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  },
};
