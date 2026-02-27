// backend/src/controllers/auth.controller.ts
import { Request, Response } from 'express';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email y password son requeridos',
    });
  }

  // Mock de autenticación
  if (email === 'eve.holt@reqres.in' && password === 'cityslicka') {
    return res.status(200).json({
      token: 'QpwL5tke4Pnpja7X4',
    });
  }

  return res.status(400).json({
    error: 'user not found',
  });
};
