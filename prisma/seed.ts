/**
 * prisma/seed.ts
 *
 * Idempotent seed — runs twice without errors or duplicates.
 * Uses upsert everywhere: if the row already exists it is updated in-place.
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱  Seeding database...');

  // ── Users ─────────────────────────────────────────────────────────────────

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      id: 'user-organizer-1',
      name: 'Alice (Organizer)',
      email: 'alice@example.com',
      role: 'ORGANIZER',
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      id: 'user-admin-1',
      name: 'Bob (Admin)',
      email: 'bob@example.com',
      role: 'ADMIN',
    },
  });

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      id: 'user-attendee-1',
      name: 'Charlie (Attendee)',
      email: 'charlie@example.com',
      role: 'ATTENDEE',
    },
  });

  console.log(`  ✓ Users: ${alice.name}, ${bob.name}, ${charlie.name}`);

  // ── Events ────────────────────────────────────────────────────────────────

  const events = await Promise.all([
    prisma.event.upsert({
      where: { id: 'event-1' },
      update: {},
      create: {
        id: 'event-1',
        title: 'JavaScript Workshop',
        description: 'Deep dive into modern JavaScript',
        venue: 'Istanbul',
        capacity: 50,
        startsAt: new Date('2026-09-10T10:00:00.000Z'),
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-2' },
      update: {},
      create: {
        id: 'event-2',
        title: 'TypeScript Basics',
        description: 'Introduction to TypeScript',
        venue: 'Ankara',
        capacity: 30,
        startsAt: new Date('2026-09-15T10:00:00.000Z'),
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-3' },
      update: {},
      create: {
        id: 'event-3',
        title: 'Node.js Meetup',
        description: 'Node.js ecosystem and tooling',
        venue: 'Istanbul',
        capacity: 80,
        startsAt: new Date('2026-09-20T18:00:00.000Z'),
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-4' },
      update: {},
      create: {
        id: 'event-4',
        title: 'Docker Fundamentals',
        description: 'Containers and orchestration',
        venue: 'Izmir',
        capacity: 40,
        startsAt: new Date('2026-10-05T10:00:00.000Z'),
      },
    }),
    prisma.event.upsert({
      where: { id: 'event-5' },
      update: {},
      create: {
        id: 'event-5',
        title: 'PostgreSQL Performance',
        description: 'Indexes, EXPLAIN, and query tuning',
        venue: 'Istanbul',
        capacity: 25,
        startsAt: new Date('2026-10-12T10:00:00.000Z'),
      },
    }),
  ]);

  console.log(`  ✓ Events: ${events.map((e) => e.title).join(', ')}`);

  // ── Bookings ──────────────────────────────────────────────────────────────

  const bookings = await Promise.all([
    prisma.booking.upsert({
      where: { userId_eventId: { userId: charlie.id, eventId: 'event-1' } },
      update: {},
      create: { userId: charlie.id, eventId: 'event-1', status: 'CONFIRMED' },
    }),
    prisma.booking.upsert({
      where: { userId_eventId: { userId: charlie.id, eventId: 'event-3' } },
      update: {},
      create: { userId: charlie.id, eventId: 'event-3', status: 'CONFIRMED' },
    }),
    prisma.booking.upsert({
      where: { userId_eventId: { userId: bob.id, eventId: 'event-5' } },
      update: {},
      create: { userId: bob.id, eventId: 'event-5', status: 'CONFIRMED' },
    }),
  ]);

  console.log(`  ✓ Bookings: ${bookings.length} created/updated`);
  console.log('✅  Seed complete.');
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
