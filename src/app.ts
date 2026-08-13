import express from 'express';
import venueRoutes from './routes/venue.routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

const app = express();

app.use(express.json());

// Routes
app.use('/v1/venues', venueRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ status: 404, message: 'Route not found' });
});

// Centralized error handler — MUST be last
app.use(errorMiddleware);

export default app;
