# Frontend

One static page, `src/public/index.html`, with `app.js` (an ES module, no build step) and `styles.css`. It exists to be tested: every element the e2e suite touches has a `data-testid`.

## The page

1. On load, it reads the browser's time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), shows it, and lists the slots from `GET /api/slots?tz=<zone>`.
2. Each slot has a **Select** button, or **Taken** (disabled) when it is booked.
3. Select opens a `<dialog>`. Its **Book** button stays disabled for a random 150–600 ms, a deliberate animation-style wait.
4. Book posts the booking, shows "Booking pending", reloads the slots, and polls `GET /api/bookings/:id` every 200 ms until it shows "Booking confirmed". An error shows the server's message.

## State

Module variables only: the chosen slot. Everything else is read from the server on each render. Nothing is stored in the browser.

## What the e2e tests rely on

| Test | Behaviour it depends on |
|---|---|
| `booking.spec.ts` | the status text moving from pending to confirmed |
| `modal.spec.ts` | the Book button enabling after its delay |
| `concurrency.spec.ts` | two pages booking the same slot at once |
| `timezone.spec.ts` | the local date and time of `s3` in the browser's zone (UTC in CI) |
| `shared-state.spec.ts` | which slots are free after earlier tests |

## Accessibility and language

- The name field has a `<label>`; the booking status is a `role="status"` live region; the confirmation is a native `<dialog>`.
- English only (`lang="en"`). No language, theme or plain-language toggles.
- No tests for accessibility.
