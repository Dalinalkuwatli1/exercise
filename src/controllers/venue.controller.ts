import { Request, Response } from 'express';
import { venueService } from '../services/venue.service';

export const venueController = {
  // Express 5 automatically handles async errors, no need for try/catch and next
  async createVenue(req: Request, res: Response) {
    const venue = await venueService.createVenue(req.body);
    res.status(201).json(venue);
  },

  async listVenues(req: Request, res: Response) {
    // limit is coerced to number by Zod schema, cast safely
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
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
  }
};
