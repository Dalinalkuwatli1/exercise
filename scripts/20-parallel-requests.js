#!/usr/bin/env node
/**
 * scripts/20-parallel-requests.js
 *
 * Sends 20 concurrent POST /v1/bookings requests for the same event.
 * The event must have capacity=5 to trigger oversell detection.
 *
 * Usage:
 *   1. Start the server:  npm run dev
 *   2. Create an event with capacity=5 and note its ID.
 *   3. Run: EVENT_ID=<id> node scripts/20-parallel-requests.js
 *
 * Expected result: exactly 5 CONFIRMED bookings; the rest 409.
 */

const EVENT_ID = process.env.EVENT_ID;
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
const REQUESTS = 20;

if (!EVENT_ID) {
  console.error('❌  Set EVENT_ID environment variable first.');
  process.exit(1);
}

async function sendRequest(index) {
  try {
    const res = await fetch(`${BASE_URL}/v1/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId: EVENT_ID }),
    });
    const body = await res.json();
    return { index, status: res.status, body };
  } catch (err) {
    return { index, status: 'ERR', body: err.message };
  }
}

(async () => {
  console.log(
    `🚀  Firing ${REQUESTS} parallel requests → POST /v1/bookings (eventId=${EVENT_ID})\n`,
  );

  const results = await Promise.all(
    Array.from({ length: REQUESTS }, (_, i) => sendRequest(i + 1)),
  );

  const counts = {};
  for (const { status } of results) {
    counts[status] = (counts[status] ?? 0) + 1;
  }

  for (const { index, status, body } of results) {
    const icon = status === 201 ? '✅' : '❌';
    console.log(`  ${icon} #${String(index).padStart(2)} → ${status}  ${JSON.stringify(body)}`);
  }

  console.log('\n── Summary ──────────────────────────────');
  for (const [status, count] of Object.entries(counts)) {
    console.log(`  HTTP ${status}: ${count}`);
  }

  const confirmed = results.filter(r => r.body?.status === 'CONFIRMED').length;
  const waitlisted = results.filter(r => r.body?.status === 'WAITLISTED').length;
  console.log(`  CONFIRMED: ${confirmed}`);
  console.log(`  WAITLISTED: ${waitlisted}`);

  console.log(
    confirmed <= 5
      ? `\n✅  PASS — ${confirmed} CONFIRMED bookings (capacity not oversold)`
      : `\n❌  FAIL — ${confirmed} CONFIRMED bookings exceed capacity of 5!`,
  );
})();
