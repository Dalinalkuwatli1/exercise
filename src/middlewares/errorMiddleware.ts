import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/HttpError';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Zod validation error → 400
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 400,
      message: 'Validation error',
      errors: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Our own HttpError (404, 409, etc.)
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Unexpected errors — never expose internals
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    status: 500,
    message: 'Internal server error',
  });
}
