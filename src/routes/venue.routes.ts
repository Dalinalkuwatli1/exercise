import { Router } from 'express';
import { venueController } from '../controllers/venue.controller';
import { validate, validateQuery } from '../middlewares/validate';
import { createVenueSchema, updateVenueSchema, venueQuerySchema } from '../types/venue';

const router = Router();

router.post(
  '/',
  validate(createVenueSchema),
  venueController.createVenue
);

router.get(
  '/',
  validateQuery(venueQuerySchema),
  venueController.listVenues
);

router.get(
  '/:id',
  venueController.getVenueById
);

router.patch(
  '/:id',
  validate(updateVenueSchema),
  venueController.updateVenue
);

router.delete(
  '/:id',
  venueController.deleteVenue
);

export default router;
