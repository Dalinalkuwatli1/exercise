import prisma from '../lib/prisma';
import { Prisma } from '../generated/prisma/client';
import { Booking, BookingStatus } from '../types/booking';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toBooking(row: {
  id: string;
  userId: string;
  eventId: string;
  status: BookingStatus;
  createdAt: Date;
}): Booking {
  return {
    id: row.id,
    userId: row.userId,
    eventId: row.eventId,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const bookingRepository = {
  /**
   * Find an existing booking row for this userId + eventId (any status).
   * Uses the transaction client so it participates in the caller's tx.
   */
  async findByUserAndEvent(
    tx: Prisma.TransactionClient,
    userId: string,
    eventId: string,
  ): Promise<Booking | null> {
    const row = await tx.booking.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    return row ? toBooking(row) : null;
  },

  /**
   * Count CONFIRMED bookings for an event inside a transaction.
   */
  async countConfirmed(
    tx: Prisma.TransactionClient,
    eventId: string,
  ): Promise<number> {
    return tx.booking.count({
      where: { eventId, status: 'CONFIRMED' },
    });
  },

  /** Create a new booking row inside a transaction. */
  async create(
    tx: Prisma.TransactionClient,
    data: { userId: string; eventId: string; status: BookingStatus },
  ): Promise<Booking> {
    const row = await tx.booking.create({ data });
    return toBooking(row);
  },

  /** Update an existing booking's status inside a transaction. */
  async updateStatus(
    tx: Prisma.TransactionClient,
    id: string,
    status: BookingStatus,
  ): Promise<Booking> {
    const row = await tx.booking.update({ where: { id }, data: { status } });
    return toBooking(row);
  },

  /** Find a single booking by primary key (no transaction needed). */
  async findById(id: string): Promise<Booking | null> {
    const row = await prisma.booking.findUnique({ where: { id } });
    return row ? toBooking(row) : null;
  },

  /** Soft-cancel: update status to CANCELLED outside a transaction. */
  async cancel(id: string): Promise<Booking> {
    const row = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
    return toBooking(row);
  },
};
