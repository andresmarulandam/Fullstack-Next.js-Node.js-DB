import { Request, Response, NextFunction } from 'express';

const VALID_TOKEN = 'QpwL5tke4Pnpja7X4';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  const token = parts[1];

  if (token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  next();
};
