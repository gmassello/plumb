import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SEED, listSlots, isValidBooking } from './slots.js';

const CONFIRM_MAX_MS = 800;
const BOOKING_GAP_MAX_MS = 20;
const PUBLIC = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/app.js': ['app.js', 'text/javascript; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
};

const bookings = new Map();

function takenIds() {
  return new Set([...bookings.values()].map((b) => b.slotId));
}

function view(b) {
  return {
    id: b.id,
    slotId: b.slotId,
    name: b.name,
    status: Date.now() >= b.confirmAt ? 'confirmed' : 'pending',
  };
}

function send(res, status, body) {
  const data = body === undefined ? '' : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(data);
}

function fail(res, status, code, message) {
  send(res, status, { error: { code, message } });
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  try {
    return JSON.parse(raw || 'null');
  } catch {
    return null;
  }
}

async function book(req, res) {
  const body = await readJson(req);
  if (!isValidBooking(body)) return fail(res, 400, 'validation_error', 'slotId and a non-blank name are required');
  if (!SEED.some((s) => s.id === body.slotId)) return fail(res, 404, 'slot_not_found', `No slot ${body.slotId}`);
  if (takenIds().has(body.slotId)) return fail(res, 409, 'slot_taken', `Slot ${body.slotId} is already booked`);
  await sleep(Math.random() * BOOKING_GAP_MAX_MS);
  const id = randomUUID();
  const booking = { id, slotId: body.slotId, name: body.name.trim(), confirmAt: Infinity };
  bookings.set(id, booking);
  send(res, 201, { ...view(booking), status: 'pending' });
}

async function handle(req, res) {
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;
  if (req.method === 'GET' && path === '/health') return send(res, 200, { status: 'ok' });
  if (req.method === 'POST' && path === '/_test/reset') {
    bookings.clear();
    return send(res, 204);
  }
  if (req.method === 'GET' && path === '/api/slots') {
    try {
      return send(res, 200, listSlots(url.searchParams.get('tz') || 'UTC', takenIds()));
    } catch (err) {
      if (err instanceof RangeError) return fail(res, 400, 'validation_error', 'Unknown time zone');
      throw err;
    }
  }
  if (req.method === 'POST' && path === '/api/bookings') return book(req, res);
  if (req.method === 'GET' && path.startsWith('/api/bookings/')) {
    const b = bookings.get(path.slice('/api/bookings/'.length));
    return b ? send(res, 200, view(b)) : fail(res, 404, 'booking_not_found', 'No such booking');
  }
  if (req.method === 'GET' && PUBLIC[path]) {
    const [file, type] = PUBLIC[path];
    const html = await readFile(fileURLToPath(new URL(`./public/${file}`, import.meta.url)));
    res.writeHead(200, { 'Content-Type': type });
    return res.end(html);
  }
  fail(res, 404, 'not_found', 'No such route');
}

export function createApp() {
  return createServer((req, res) =>
    handle(req, res).catch(() => fail(res, 500, 'internal_error', 'Unexpected error')),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT || 8080);
  createApp().listen(port, () => console.log(`booking app listening on ${port}`));
}
