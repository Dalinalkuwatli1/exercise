import { randomUUID } from 'crypto';
import { HttpError } from '../utils/HttpError';
import { Booking, BookingStatus, CreateBookingDTO } from '../types/booking';
import { eventStore } from './event.service';

// ─── In-memory store ─────────────────────────────────────────────────────────

const bookings = new Map<string, Booking>();

// ─── Service ──────────────────────────────────────────────────────────────────

export const bookingService = {
  /**
   * Create a CONFIRMED booking.
   *
   * Business rules (all live here, not in the controller):
   *  1. The event must exist → 404
   *  2. A booking for this userId + eventId must not exist in ANY status → 409
   *  3. Capacity is counted from CONFIRMED bookings only → 409 when full
   */
  async createBooking(userId: string, data: CreateBookingDTO): Promise<Booking> {
    const { eventId } = data;

    // Rule 1 — event must exist
    const event = eventStore.get(eventId);
    if (!event) {
      throw new HttpError(404, 'Event not found');
    }

    // Rule 2 — duplicate booking (any status)
    const duplicate = Array.from(bookings.values()).find(
      (b) => b.userId === userId && b.eventId === eventId,
    );
    if (duplicate) {
      throw new HttpError(409, 'Booking already exists for this user and event');
    }

    // Rule 3 — capacity (CONFIRMED only)
    const confirmedCount = Array.from(bookings.values()).filter(
      (b) => b.eventId === eventId && b.status === 'CONFIRMED',
    ).length;
    if (confirmedCount >= event.capacity) {
      throw new HttpError(409, 'Event has reached full capacity');
    }

    const newBooking: Booking = {
      id: randomUUID(),
      userId,
      eventId,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    bookings.set(newBooking.id, newBooking);
    return newBooking;
  },

  async getBookingById(id: string): Promise<Booking> {
    const booking = bookings.get(id);
    if (!booking) {
      throw new HttpError(404, 'Booking not found');
    }
    return booking;
  },

  /**
   * Soft-cancel a booking: status → CANCELLED, record is kept.
   */
  async cancelBooking(id: string): Promise<Booking> {
    const booking = await this.getBookingById(id);
    const cancelled: Booking = { ...booking, status: 'CANCELLED' as BookingStatus };
    bookings.set(id, cancelled);
    return cancelled;
  },
};
