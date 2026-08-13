import { z } from 'zod';

export const createVenueSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  capacity: z.number().int().positive("Capacity must be a positive integer"),
  contactEmail: z.string().email("Invalid email format"),
});

export const updateVenueSchema = createVenueSchema.partial();

export const venueQuerySchema = z.object({
  limit: z.coerce.number().int().positive().optional(),
});

export type CreateVenueDTO = z.infer<typeof createVenueSchema>;
export type UpdateVenueDTO = z.infer<typeof updateVenueSchema>;
export type VenueQueryDTO = z.infer<typeof venueQuerySchema>;

export interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  contactEmail: string;
  createdAt: Date;
}
