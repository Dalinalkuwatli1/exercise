import { Request, Response } from 'express';
import { eventService } from '../services/event.service';
import { EventQueryDTO } from '../types/event';

export const eventController = {
  async createEvent(req: Request, res: Response) {
    const event = await eventService.createEvent(req.body);
    res.status(201).json(event);
  },

  async listEvents(req: Request, res: Response) {
    // Parsed + validated query is stored in res.locals.query by validateQuery middleware
    const query = res.locals['query'] as EventQueryDTO;
    const result = await eventService.listEvents(query);
    res.status(200).json(result);
  },

  async getEventById(req: Request, res: Response) {
    const id = String(req.params['id']);
    const event = await eventService.getEventById(id);
    res.status(200).json(event);
  },

  async updateEvent(req: Request, res: Response) {
    const id = String(req.params['id']);
    const event = await eventService.updateEvent(id, req.body);
    res.status(200).json(event);
  },

  async deleteEvent(req: Request, res: Response) {
    const id = String(req.params['id']);
    const event = await eventService.deleteEvent(id);
    res.status(200).json(event);
  },
};
