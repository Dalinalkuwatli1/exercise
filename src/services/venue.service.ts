import { randomUUID } from 'crypto';
import { HttpError } from '../utils/HttpError';
import { Venue, CreateVenueDTO, UpdateVenueDTO } from '../types/venue';

// In-memory Map store
const venues = new Map<string, Venue>();

export const venueService = {
  async createVenue(data: CreateVenueDTO): Promise<Venue> {
    for (const venue of venues.values()) {
      if (venue.name === data.name) {
        throw new HttpError(409, 'Venue with this name already exists');
      }
    }

    const newVenue: Venue = {
      id: randomUUID(),
      ...data,
      createdAt: new Date(),
    };

    venues.set(newVenue.id, newVenue);
    return newVenue;
  },

  async listVenues(limit?: number): Promise<Venue[]> {
    const allVenues = Array.from(venues.values());
    if (limit) {
      return allVenues.slice(0, limit);
    }
    return allVenues;
  },

  async getVenueById(id: string): Promise<Venue> {
    const venue = venues.get(id);
    if (!venue) {
      throw new HttpError(404, 'Venue not found');
    }
    return venue;
  },

  async updateVenue(id: string, data: UpdateVenueDTO): Promise<Venue> {
    const venue = await this.getVenueById(id);

    if (data.name && data.name !== venue.name) {
      for (const v of venues.values()) {
        if (v.name === data.name) {
          throw new HttpError(409, 'Venue with this name already exists');
        }
      }
    }

    const updatedVenue: Venue = {
      ...venue,
      ...data,
    };

    venues.set(id, updatedVenue);
    return updatedVenue;
  },

  async deleteVenue(id: string): Promise<void> {
    const venue = await this.getVenueById(id);
    venues.delete(venue.id);
  }
};
