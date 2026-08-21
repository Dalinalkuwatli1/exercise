import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service';

// Hard-coded current user — replaced by real auth in a future session
const CURRENT_USER_ID = 'user-1';

export const bookingController = {
  async createBooking(req: Request, res: Response) {
    // req.body is already validated by validate(createBookingSchema)
    // userId is never read from the client; it always comes from CURRENT_USER_ID
    const booking = await bookingService.createBooking(CURRENT_USER_ID, req.body);
    res.status(201).json(booking);
  },

  async getBookingById(req: Request, res: Response) {
    const id = String(req.params['id']);
    const booking = await bookingService.getBookingById(id);
    res.status(200).json(booking);
  },

  async cancelBooking(req: Request, res: Response) {
    const id = String(req.params['id']);
    const booking = await bookingService.cancelBooking(id);
    res.status(200).json(booking);
  },
};
