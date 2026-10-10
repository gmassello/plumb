export const SEED = [
  { id: 's1', startUtc: '2026-11-02T13:00:00Z' },
  { id: 's2', startUtc: '2026-11-02T14:00:00Z' },
  { id: 's3', startUtc: '2026-11-03T01:30:00Z' },
];

export function localParts(startUtc, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(new Date(startUtc))
      .map((p) => [p.type, p.value]),
  );
  return {
    localDate: `${parts.year}-${parts.month}-${parts.day}`,
    localTime: `${parts.hour}:${parts.minute}`,
  };
}

export function listSlots(timeZone, takenIds, slots = SEED) {
  return [...slots]
    .sort((a, b) => a.startUtc.localeCompare(b.startUtc))
    .map((s) => ({
      id: s.id,
      startUtc: s.startUtc,
      ...localParts(s.startUtc, timeZone),
      available: !takenIds.has(s.id),
    }));
}

export function isValidBooking(body) {
  return (
    body !== null &&
    typeof body === 'object' &&
    typeof body.slotId === 'string' &&
    body.slotId !== '' &&
    typeof body.name === 'string' &&
    body.name.trim() !== ''
  );
}
