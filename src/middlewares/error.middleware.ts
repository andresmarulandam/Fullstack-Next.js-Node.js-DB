import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error('❌ Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  // En desarrollo, enviar stack trace
  const response = {
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(status).json(response);
};

export const createError = (message: string, status: number = 400) => {
  const error = new Error(message) as AppError;
  error.status = status;
  return error;
};
