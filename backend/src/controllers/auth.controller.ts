import { Request, Response } from 'express';
import { reqresService } from '../services/reqres.service';

const MOCK_USERS = [
  { email: 'eve.holt@reqres.in', password: 'cityslicka' },
  { email: 'janet.weaver@reqres.in', password: 'cityslicka' },
  { email: 'george.bluth@reqres.in', password: 'cityslicka' },
];

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  try {
    const result = await reqresService.login(email, password);

    if (result.status === 200) {
      return res.status(200).json(result.data);
    }

    const mockUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (mockUser) {
      return res.status(200).json({
        token: 'QpwL5tke4Pnpja7X4',
      });
    } else {
      return res.status(400).json({
        error: 'user not found',
      });
    }
  } catch (error) {
    console.error('Error en login:', error);

    const mockUser = MOCK_USERS.find(
      (u) => u.email === email && u.password === password,
    );

    if (mockUser) {
      return res.status(200).json({
        token: 'QpwL5tke4Pnpja7X4',
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
};
