import express, { Request, Response } from 'express';
import venueRoutes from './routes/venue.routes';
import eventRoutes from './routes/event.routes';
import bookingRoutes from './routes/booking.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// Routes
app.use('/v1/venues', venueRoutes);
app.use('/v1/events', eventRoutes);
app.use('/v1/bookings', bookingRoutes);

// 404 for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});

// Centralized error handler — MUST be last
app.use(errorMiddleware);

export default app;
