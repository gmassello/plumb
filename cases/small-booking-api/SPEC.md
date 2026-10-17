# Small case — booking app HTTP contract

The trivial, self-owned case: the booking app's HTTP API, the surface the e2e suite drives and every later case builds on. `checks.py` checks it against a running app; the deploy job only checks that the live page loads. It is the contract U1 implements. The intended race on concurrent bookings (BRIEF R10) is deliberately **not** checked here: it is a flakiness source, not a defect of this contract.

## Actors
- A1. Visitor — lists slots in their own time zone and books one.
- A2. Test harness — resets state between checks.

## Runtime contract
- Port: `PORT` environment variable, default `8080`.
- `GET /health` → `200 {"status": "ok"}`.
- `POST /_test/reset` → `204`; restores the seed slots and drops every booking.
- Every error is `{"error": {"code": "<code>", "message": "<text>"}}` with a non-empty message.
- JSON in and out (`Content-Type: application/json`).

## Seed data (after reset)
| id | start (UTC) |
|---|---|
| `s1` | 2026-11-02T13:00:00Z |
| `s2` | 2026-11-02T14:00:00Z |
| `s3` | 2026-11-03T01:30:00Z |

## Requirements
- R1. `GET /api/slots?tz=<IANA zone>` → `200` with a list of `{"id", "startUtc", "localDate", "localTime", "available"}` ordered by `startUtc`. `localDate` is `YYYY-MM-DD` and `localTime` is `HH:MM` in the given zone. Without `tz` the zone is `UTC`. An unknown zone → `400 validation_error`.
- R2. `POST /api/bookings {"slotId", "name"}` → `201 {"id", "slotId", "name", "status": "pending"}`, and that slot is listed as `available: false`.
- R3. `GET /api/bookings/<id>` → `200` with the same booking. `status` becomes `"confirmed"` within 800 ms of creation and stays `"confirmed"`.
- R4. Booking a slot that already has a booking → `409 slot_taken`.
- R5. Booking a slot id that does not exist → `404 slot_not_found`; reading a booking id that does not exist → `404 booking_not_found`.
- R6. A missing or blank `name`, or a missing `slotId` → `400 validation_error`, and nothing is stored.

## Acceptance examples
- AE1. **Covers R1.** Given a reset app, when the visitor lists slots with `tz=America/Argentina/Buenos_Aires`, then `s3` shows `localDate` `2026-11-02` and `localTime` `22:30`.
- AE2. **Covers R2, R3.** Given a reset app, when Ana books `s1`, then the response is `201` with `status` `pending`, and within 2 s a read of that booking returns `confirmed`.
- AE3. **Covers R4.** Given `s2` booked by Ana, when Bruno books `s2`, then the response is `409 slot_taken`.
- AE4. **Covers R5.** Given a reset app, when someone books `s99`, then the response is `404 slot_not_found`.
- AE5. **Covers R6.** Given a reset app, when someone books `s1` with name `"  "`, then the response is `400 validation_error` and `s1` is still available.
