# Session 2 — Implementation Plan

## Architecture Inspection
- [x] Inspect current architecture (venue routes / controller / service / types)
- [x] Inspect HttpError, validate, validateQuery, errorMiddleware
- [x] Inspect package.json, tsconfig.json, session1.ts domain model

## Branch
- [x] Create Session 2 branch (`session-2`)

## Task 1 — In-memory /v1/bookings
- [ ] Define Event & Booking domain types in `src/types/event.ts` and `src/types/booking.ts`
- [ ] Implement in-memory booking storage
- [ ] Implement booking service
  - [ ] Add unknown event validation (404)
  - [ ] Add duplicate userId + eventId validation (409, any status)
  - [ ] Add capacity validation using CONFIRMED bookings only (409)
  - [ ] Keep cancelled booking records (soft delete only)
- [ ] Add `POST /v1/bookings`
  - [ ] Validate booking body with `z.strictObject`
  - [ ] Reject unknown booking body keys with 400
  - [ ] Use hard-coded current user in the controller
  - [ ] Return 201 with CONFIRMED booking
- [ ] Add `GET /v1/bookings/:id` — 200 or 404
- [ ] Add `DELETE /v1/bookings/:id` — soft cancel, 200 with CANCELLED booking

## Task 2 — Pagination for GET /v1/events
- [ ] Define Event domain type in `src/types/event.ts`
- [ ] Define Zod query schema for events (page, limit, venue, from, to)
- [ ] Apply `validateQuery` on `GET /v1/events`
- [ ] Read parsed query values from `res.locals.query`
- [ ] Return `{ data, page, limit, total }` envelope
- [ ] Empty pages return 200 with `data: []`

## Task 3 — Filtering for GET /v1/events
- [ ] Add venue exact-match filter
- [ ] Add from/to date filters on startsAt (inclusive)
- [ ] Ensure filtering happens before pagination
- [ ] Ensure total is the filtered count
- [ ] Validate from/to as valid dates (400 on malformed)
- [ ] Return 400 if from > to

## Task 4 — Consistency Pass
- [ ] Apply shared `validate` middleware to all body endpoints
- [ ] Apply `validateQuery` consistently to query endpoints
- [ ] Use `HttpError` for all endpoint failures
- [ ] Keep one error middleware registered last
- [ ] Remove any inappropriate `res.status(500)` outside global error middleware
- [ ] Confirm no stack traces exposed to clients
- [ ] Add `/health` endpoint to Express app
- [ ] Confirm error response shape is consistent: `{ status, message, errors? }`

## Git / PR
- [ ] Commit plan as first commit on session-2
- [ ] Make implementation commits with clear messages
- [ ] Run TypeScript type-check (`npm run build`)
- [ ] Run the application and verify all acceptance cases
- [ ] Update completed checklist items
- [ ] Prepare PR description with AI section and exit-ticket sentence
