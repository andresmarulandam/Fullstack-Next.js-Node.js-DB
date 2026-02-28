import { Request, Response } from 'express';
import { reqresService } from '../services/reqres.service';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  try {
    const result = await reqresService.login(email, password);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
