import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../../src/server.js';
import { listSlots } from '../../src/slots.js';

let server;
let base;

before(async () => {
  server = createApp();
  await new Promise((r) => server.listen(0, r));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

beforeEach(() => fetch(`${base}/_test/reset`, { method: 'POST' }));

const book = (slotId, name) =>
  fetch(`${base}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slotId, name }),
  });

test('a visitor books a free slot and it becomes confirmed', async () => {
  const res = await book('s1', 'Ana');
  assert.equal(res.status, 201);
  const { id, status } = await res.json();
  assert.equal(status, 'pending');
  await new Promise((r) => setTimeout(r, 850));
  const read = await (await fetch(`${base}/api/bookings/${id}`)).json();
  assert.equal(read.status, 'confirmed');
});

test('a second booking for a booked slot gets slot_taken', async () => {
  assert.equal((await book('s2', 'Ana')).status, 201);
  const res = await book('s2', 'Bruno');
  assert.equal(res.status, 409);
  assert.equal((await res.json()).error.code, 'slot_taken');
});

test('slots are shown in UTC-3, crossing back a day after midnight UTC', () => {
  const [slot] = listSlots('America/Argentina/Buenos_Aires', new Set(), [
    { id: 'x', startUtc: '2026-11-03T23:30:00Z' },
  ]);
  assert.deepEqual([slot.localDate, slot.localTime], ['2026-11-03', '20:30']);
  const [late] = listSlots('America/Argentina/Buenos_Aires', new Set(), [
    { id: 'y', startUtc: '2026-11-04T01:30:00Z' },
  ]);
  assert.deepEqual([late.localDate, late.localTime], ['2026-11-03', '22:30']);
});

test('booking a slot that does not exist is a 404 and stores nothing', async () => {
  const res = await book('s99', 'Ana');
  assert.equal(res.status, 404);
  const body = await res.json();
  assert.equal(body.error.code, 'slot_not_found');
  assert.ok(body.error.message);
  const slots = await (await fetch(`${base}/api/slots`)).json();
  assert.ok(slots.every((s) => s.available));
});
