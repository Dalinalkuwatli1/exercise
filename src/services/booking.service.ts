import { HttpError } from '../utils/HttpError';
import { Booking, CreateBookingDTO } from '../types/booking';
import { bookingRepository } from '../repositories/booking.repository';
import { eventRepository } from '../repositories/event.repository';
import { withTransaction } from '../lib/withTransaction';

// ─── Service ──────────────────────────────────────────────────────────────────

export const bookingService = {
  /**
   * Create or reactivate a booking inside a SERIALIZABLE transaction.
   *
   * Rules (all enforced here, never in the controller):
   *  1. Event must exist → 404
   *  2a. CONFIRMED duplicate → 409
   *  2b. CANCELLED row → flip to CONFIRMED (subject to capacity)
   *  3. Capacity: count only CONFIRMED bookings → 409 when full
   *  4. Race condition P2002 → 409
   */
  async createBooking(userId: string, data: CreateBookingDTO): Promise<Booking> {
    const { eventId } = data;

    // Rule 1 — event must exist (idempotent read outside tx)
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new HttpError(404, 'Event not found');
    }

    try {
      return await withTransaction(async (tx) => {
        const existing = await bookingRepository.findByUserAndEvent(tx, userId, eventId);

        if (existing) {
          if (existing.status === 'CONFIRMED') {
            throw new HttpError(409, 'Booking already exists for this user and event');
          }

          // CANCELLED → attempt rebook
          const confirmed = await bookingRepository.countConfirmed(tx, eventId);
          if (confirmed >= event.capacity) {
            return bookingRepository.updateStatus(tx, existing.id, 'WAITLISTED');
          }
          return bookingRepository.updateStatus(tx, existing.id, 'CONFIRMED');
        }

        // Fresh booking
        const confirmed = await bookingRepository.countConfirmed(tx, eventId);
        if (confirmed >= event.capacity) {
          return bookingRepository.create(tx, { userId, eventId, status: 'WAITLISTED' });
        }
        return bookingRepository.create(tx, { userId, eventId, status: 'CONFIRMED' });
      });
    } catch (err) {
      if (typeof err === 'object' && err !== null && (err as any).code === 'P2002') {
        throw new HttpError(409, 'Booking already exists for this user and event');
      }
      throw err;
    }
  },

  async getBookingById(id: string): Promise<Booking> {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }
    return booking;
  },

  async cancelBooking(id: string): Promise<Booking> {
    await this.getBookingById(id); // throws 404 if missing
    return bookingRepository.cancel(id);
  },
};
