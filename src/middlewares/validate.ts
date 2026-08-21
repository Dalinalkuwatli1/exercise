import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * validate — validates req.body against a Zod schema.
 * Replaces req.body with the parsed (stripped / transformed) value.
 * Passes ZodError to next() on failure; the global error middleware handles it.
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * validateQuery — validates req.query against a Zod schema.
 * Stores the parsed result in res.locals.query (does NOT mutate req.query).
 * Controllers must read query values from res.locals.query.
 * Passes ZodError to next() on failure.
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      res.locals['query'] = schema.parse(req.query);
      next();
    } catch (error) {
      next(error);
    }
  };
};
