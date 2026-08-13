// Session 1 homework – full domain model
// No `any`, no enums – literal-union types throughout.

import { createServer, IncomingMessage, ServerResponse } from "node:http";

// ─── Literal-union types ──────────────────────────────────────────────────────

export type Role = "ATTENDEE" | "ORGANIZER" | "ADMIN";
export type BookingStatus = "CONFIRMED" | "CANCELLED" | "WAITLISTED";

// ─── Domain interfaces ────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  capacity: number;
  organizerId: string; // references User.id (must have role ORGANIZER)
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface Booking {
  id: string;
  eventId: string;  // references Event.id
  userId: string;   // references User.id
  status: BookingStatus;
  createdAt: Date;
}

// ─── Generic utility ─────────────────────────────────────────────────────────

/**
 * Finds the first element in `items` whose `id` matches the given value.
 * Returns `undefined` when no match is found.
 */
export function findById<T extends { id: string }>(
  items: ReadonlyArray<T>,
  id: string
): T | undefined {
  return items.find((item) => item.id === id);
}

// ─── HTTP Server ──────────────────────────────────────────────────────────────

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "OK", uptime: process.uptime() }));
    return; // ← prevent fall-through to 404
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
  console.log("Health check endpoint available at http://localhost:3000/health");
});
