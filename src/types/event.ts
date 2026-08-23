import { z } from 'zod';

// ─── Domain ───────────────────────────────────────────────────────────────────

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  capacity: number;
  startsAt: string; // ISO-8601
  createdAt: string; // ISO-8601
}

// ─── Zod schemas ──────────────────────────────────────────────────────────────

export const createEventSchema = z.strictObject({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  venue: z.string().min(1, 'Venue is required'),
  capacity: z.number().int().positive('Capacity must be a positive integer'),
  startsAt: z.string().datetime({ message: 'startsAt must be a valid ISO-8601 datetime' }),
});

export const updateEventSchema = createEventSchema.partial();

/**
 * Query schema for GET /v1/events.
 * All fields are optional; page and limit have sensible defaults.
 */
export const eventQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1, 'page must be >= 1').default(1),
    limit: z.coerce
      .number()
      .int()
      .min(1, 'limit must be >= 1')
      .max(100, 'limit must be <= 100')
      .default(20),
    venue: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    // Validate `from` is a real date
    if (val.from !== undefined) {
      const d = new Date(val.from);
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['from'], message: 'from must be a valid date' });
      }
    }
    // Validate `to` is a real date
    if (val.to !== undefined) {
      const d = new Date(val.to);
      if (isNaN(d.getTime())) {
        ctx.addIssue({ code: 'custom', path: ['to'], message: 'to must be a valid date' });
      }
    }
    // from must not be after to
    if (val.from !== undefined && val.to !== undefined) {
      const from = new Date(val.from);
      const to = new Date(val.to);
      if (!isNaN(from.getTime()) && !isNaN(to.getTime()) && from > to) {
        ctx.addIssue({ code: 'custom', path: ['from'], message: 'from must not be after to' });
      }
    }
  });

export type CreateEventDTO = z.infer<typeof createEventSchema>;
export type UpdateEventDTO = z.infer<typeof updateEventSchema>;
export type EventQueryDTO = z.infer<typeof eventQuerySchema>;
