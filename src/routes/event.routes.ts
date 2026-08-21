import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { validate, validateQuery } from '../middlewares/validate';
import { createEventSchema, updateEventSchema, eventQuerySchema } from '../types/event';

const router = Router();

router.post('/', validate(createEventSchema), eventController.createEvent);

router.get('/', validateQuery(eventQuerySchema), eventController.listEvents);

router.get('/:id', eventController.getEventById);

router.patch('/:id', validate(updateEventSchema), eventController.updateEvent);

router.delete('/:id', eventController.deleteEvent);

export default router;
