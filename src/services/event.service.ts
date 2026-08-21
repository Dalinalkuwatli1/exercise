import { randomUUID } from 'crypto';
import { HttpError } from '../utils/HttpError';
import { Event, CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/event';

// ─── In-memory store ─────────────────────────────────────────────────────────

const events = new Map<string, Event>();

// ─── Paginated result shape ───────────────────────────────────────────────────

export interface EventListResult {
  data: Event[];
  page: number;
  limit: number;
  total: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const eventService = {
  async createEvent(data: CreateEventDTO): Promise<Event> {
    const newEvent: Event = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    events.set(newEvent.id, newEvent);
    return newEvent;
  },

  /**
   * List events with optional venue/date filtering and pagination.
   * Filtering is applied BEFORE pagination; total reflects the filtered count.
   */
  async listEvents(query: EventQueryDTO): Promise<EventListResult> {
    const { page, limit, venue, from, to } = query;

    let filtered = Array.from(events.values());

    // 1. Filter by venue (exact match)
    if (venue !== undefined) {
      filtered = filtered.filter((e) => e.venue === venue);
    }

    // 2. Filter by from (startsAt >= from, inclusive)
    if (from !== undefined) {
      const fromDate = new Date(from);
      filtered = filtered.filter((e) => new Date(e.startsAt) >= fromDate);
    }

    // 3. Filter by to (startsAt <= to, inclusive)
    if (to !== undefined) {
      // Make `to` inclusive to end-of-day when only a date is given
      const toDate = new Date(to);
      filtered = filtered.filter((e) => new Date(e.startsAt) <= toDate);
    }

    // 4. Total is the filtered count, NOT the original store size
    const total = filtered.length;

    // 5. Paginate
    const offset = (page - 1) * limit;
    const data = filtered.slice(offset, offset + limit);

    return { data, page, limit, total };
  },

  async getEventById(id: string): Promise<Event> {
    const event = events.get(id);
    if (!event) {
      throw new HttpError(404, 'Event not found');
    }
    return event;
  },

  async updateEvent(id: string, data: UpdateEventDTO): Promise<Event> {
    const event = await this.getEventById(id);
    const updated: Event = { ...event, ...data };
    events.set(id, updated);
    return updated;
  },

  async deleteEvent(id: string): Promise<Event> {
    const event = await this.getEventById(id);
    events.delete(id);
    return event;
  },
};

// Export the raw store so the booking service can look up events and capacity.
export { events as eventStore };
