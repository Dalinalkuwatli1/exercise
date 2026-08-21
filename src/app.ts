import express, { NextFunction, Request, Response } from 'express';
import venueRoutes from './routes/venue.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { HttpError } from './utils/HttpError';

const app = express();

app.use(express.json());

// Health check — plain handler; no expected failures, but async so Express 5
// will propagate any unexpected throw to the global error middleware automatically.
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Routes
app.use('/v1/venues', venueRoutes);
app.use('/v1/events', eventRoutes);
app.use('/v1/bookings', bookingRoutes);

// 404 for unknown routes — throw HttpError so the global errorMiddleware
// formats the response with the same shape as every other error.
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new HttpError(404, 'Route not found'));
});

// Centralized error handler — MUST be last
app.use(errorMiddleware);

export default app;
