import { z } from 'zod';

// ─── Domain ───────────────────────────────────────────────────────────────────

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'WAITLISTED';

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: BookingStatus;
  createdAt: string; // ISO-8601
}

// ─── Zod schemas ──────────────────────────────────────────────────────────────

/**
 * z.strictObject rejects any extra key (like userId) with a 400.
 * The client may only send eventId.
 */
export const createBookingSchema = z.strictObject({
  eventId: z.string().min(1, 'eventId is required'),
});

export type CreateBookingDTO = z.infer<typeof createBookingSchema>;
