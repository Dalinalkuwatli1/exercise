import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validate } from '../middlewares/validate';
import { createBookingSchema } from '../types/booking';

const router = Router();

router.post('/', validate(createBookingSchema), bookingController.createBooking);

router.get('/:id', bookingController.getBookingById);

router.delete('/:id', bookingController.cancelBooking);

export default router;
