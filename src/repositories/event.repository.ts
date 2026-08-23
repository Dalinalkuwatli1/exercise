import prisma from '../lib/prisma';
import { Event, EventQueryDTO } from '../types/event';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toEvent(row: {
  id: string;
  title: string;
  description: string;
  venue: string;
  capacity: number;
  startsAt: Date;
  createdAt: Date;
}): Event {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    venue: row.venue,
    capacity: row.capacity,
    startsAt: row.startsAt.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

// ─── Repository ───────────────────────────────────────────────────────────────

export const eventRepository = {
  async create(data: {
    title: string;
    description: string;
    venue: string;
    capacity: number;
    startsAt: string;
  }): Promise<Event> {
    const row = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        venue: data.venue,
        capacity: data.capacity,
        startsAt: new Date(data.startsAt),
      },
    });
    return toEvent(row);
  },

  async findMany(query: EventQueryDTO): Promise<{ data: Event[]; total: number }> {
    const { page, limit, venue, from, to } = query;

    // Build startsAt filter only when from/to provided
    const startsAt =
      from !== undefined || to !== undefined
        ? {
            ...(from !== undefined ? { gte: new Date(from) } : {}),
            ...(to !== undefined ? { lte: new Date(to) } : {}),
          }
        : undefined;

    const where = {
      ...(venue !== undefined ? { venue } : {}),
      ...(startsAt !== undefined ? { startsAt } : {}),
    };

    const [total, rows] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startsAt: 'asc' },
      }),
    ]);

    return { data: rows.map(toEvent), total };
  },

  async findById(id: string): Promise<Event | null> {
    const row = await prisma.event.findUnique({ where: { id } });
    return row ? toEvent(row) : null;
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      venue: string;
      capacity: number;
      startsAt: string;
    }>,
  ): Promise<Event> {
    const row = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        ...(data.startsAt !== undefined ? { startsAt: new Date(data.startsAt) } : {}),
      },
    });
    return toEvent(row);
  },

  async delete(id: string): Promise<Event> {
    const row = await prisma.event.delete({ where: { id } });
    return toEvent(row);
  },
};
