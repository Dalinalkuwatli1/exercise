import { HttpError } from '../utils/HttpError';
import { Event, CreateEventDTO, UpdateEventDTO, EventQueryDTO } from '../types/event';
import { eventRepository } from '../repositories/event.repository';

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
    return eventRepository.create(data);
  },

  async listEvents(query: EventQueryDTO): Promise<EventListResult> {
    const { page, limit } = query;
    const { data, total } = await eventRepository.findMany(query);
    return { data, page, limit, total };
  },

  async getEventById(id: string): Promise<Event> {
    const event = await eventRepository.findById(id);
    if (!event) {
      throw new HttpError(404, 'Event not found');
    }
    return event;
  },

  async updateEvent(id: string, data: UpdateEventDTO): Promise<Event> {
    await this.getEventById(id); // throws 404 if missing
    return eventRepository.update(id, data);
  },

  async deleteEvent(id: string): Promise<Event> {
    await this.getEventById(id); // throws 404 if missing
    return eventRepository.delete(id);
  },
};
