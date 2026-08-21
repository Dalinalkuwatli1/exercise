import { Request, Response } from 'express';
import { venueService } from '../services/venue.service';
import { VenueQueryDTO } from '../types/venue';

export const venueController = {
  // Express 5 automatically handles async errors, no need for try/catch and next
  async createVenue(req: Request, res: Response) {
    const venue = await venueService.createVenue(req.body);
    res.status(201).json(venue);
  },

  async listVenues(req: Request, res: Response) {
    // Read the parsed query from res.locals.query (set by validateQuery middleware)
    const { limit } = res.locals['query'] as VenueQueryDTO;
    const venues = await venueService.listVenues(limit);
    res.status(200).json(venues);
  },

  async getVenueById(req: Request, res: Response) {
    const id = String(req.params['id']);
    const venue = await venueService.getVenueById(id);
    res.status(200).json(venue);
  },

  async updateVenue(req: Request, res: Response) {
    const id = String(req.params['id']);
    const venue = await venueService.updateVenue(id, req.body);
    res.status(200).json(venue);
  },

  async deleteVenue(req: Request, res: Response) {
    const id = String(req.params['id']);
    await venueService.deleteVenue(id);
    res.status(204).send();
  },
};
