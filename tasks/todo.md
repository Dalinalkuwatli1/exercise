# Session 2 — Implementation Plan

## Architecture Inspection
- [x] Inspect current architecture (venue routes / controller / service / types)
- [x] Inspect HttpError, validate, validateQuery, errorMiddleware
- [x] Inspect package.json, tsconfig.json, session1.ts domain model

## Branch
- [x] Create Session 2 branch (`session-2`)

## Task 1 — In-memory /v1/bookings
- [x] Define Event & Booking domain types in `src/types/event.ts` and `src/types/booking.ts`
- [x] Implement in-memory booking storage
- [x] Implement booking service
  - [x] Add unknown event validation (404)
  - [x] Add duplicate userId + eventId validation (409, any status)
  - [x] Add capacity validation using CONFIRMED bookings only (409)
  - [x] Keep cancelled booking records (soft delete only)
- [x] Add `POST /v1/bookings`
  - [x] Validate booking body with `z.strictObject`
  - [x] Reject unknown booking body keys with 400
  - [x] Use hard-coded current user in the controller
  - [x] Return 201 with CONFIRMED booking
- [x] Add `GET /v1/bookings/:id` — 200 or 404
- [x] Add `DELETE /v1/bookings/:id` — soft cancel, 200 with CANCELLED booking

## Task 2 — Pagination for GET /v1/events
- [x] Define Event domain type in `src/types/event.ts`
- [x] Define Zod query schema for events (page, limit, venue, from, to)
- [x] Apply `validateQuery` on `GET /v1/events`
- [x] Read parsed query values from `res.locals.query`
- [x] Return `{ data, page, limit, total }` envelope
- [x] Empty pages return 200 with `data: []`

## Task 3 — Filtering for GET /v1/events
- [x] Add venue exact-match filter
- [x] Add from/to date filters on startsAt (inclusive)
- [x] Ensure filtering happens before pagination
- [x] Ensure total is the filtered count
- [x] Validate from/to as valid dates (400 on malformed)
- [x] Return 400 if from > to

## Task 4 — Consistency Pass
- [x] Apply shared `validate` middleware to all body endpoints
- [x] Apply `validateQuery` consistently to query endpoints
- [x] Use `HttpError` for all endpoint failures
- [x] Keep one error middleware registered last
- [x] Remove any inappropriate `res.status(500)` outside global error middleware
- [x] Confirm no stack traces exposed to clients
- [x] Add `/health` endpoint to Express app
- [x] Confirm error response shape is consistent: `{ status, message, errors? }`

## Git / PR
- [x] Commit plan as first commit on session-2
- [x] Make implementation commits with clear messages
- [x] Run TypeScript type-check (`npm run build`) — 0 errors
- [x] Run the application and verify all acceptance cases (31/31 pass)
- [x] Update completed checklist items
- [x] Prepare PR description with AI section and exit-ticket sentence
