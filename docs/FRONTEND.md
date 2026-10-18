# Frontend

The repo has two pages: the booking app under test, and Plumb's project page.

## Booking app

One static page, `src/public/index.html`, with `app.js` (an ES module, no build step) and `styles.css`. It exists to be tested: every element the e2e suite touches has a `data-testid`.

### The page

1. On load, it reads the browser's time zone (`Intl.DateTimeFormat().resolvedOptions().timeZone`), shows it, and lists the slots from `GET /api/slots?tz=<zone>`.
2. Each slot has a **Select** button, or **Taken** (disabled) when it is booked.
3. Select opens a `<dialog>`. Its **Confirm booking** button (renamed from **Book** in !15) stays disabled for a random 150–600 ms, a deliberate animation-style wait.
4. Book posts the booking, shows "Booking pending", reloads the slots, and polls `GET /api/bookings/:id` every 200 ms until it shows "Booking confirmed". An error shows the server's message: a refused booking also reloads the slots, and an error while loading the slots or polling (for example a booking the reset removed) stops there instead of retrying.

### State

Module variables only: the chosen slot. Everything else is read from the server on each render. Nothing is stored in the browser.

### What the e2e tests rely on

| Test | Behaviour it depends on |
|---|---|
| `booking.spec.ts` | the status text moving from pending to confirmed |
| `modal.spec.ts` | the Book button enabling after its delay |
| `concurrency.spec.ts` | two pages booking the same slot at once |
| `timezone.spec.ts` | the local date and time of `s3` in the browser's zone (UTC in CI) |
| `shared-state.spec.ts` | which slots are free after earlier tests |

### Accessibility and language

- The name field has a `<label>`; the booking status is a `role="status"` live region; the confirmation is a native `<dialog>`.
- English only (`lang="en"`). No language, theme or plain-language toggles.
- No tests for accessibility.

## Project page

`site/index.html`, `site/app.js`, `site/text.js` and `site/styles.css`, published by the `pages` job to GitLab Pages. No build step and no dependency. Its look is [`DESIGN.md`](DESIGN.md): the tokens in `styles.css` are copied from it.

- **Copy:** every visible string lives in `site/text.js`, in two sibling tables, `en` and `es`, with the same keys. The HTML carries only `data-t`, `data-t-alt` and `data-t-label` keys, and `app.js` fills them. A missing key falls back to English (`textFor`). Numbers, ids and job names are the same in both languages. The prose is always plain language; there is no technical register.
- **Toggles:** language (English or Spanish) and theme (light or dark). The first visit is in English, whatever the browser language, and takes the theme from `prefers-color-scheme`. Both choices are kept in `localStorage`, behind try/catch. An inline script in `<head>` applies them before the stylesheet loads, so the first paint is right. The language toggle also sets `document.documentElement.lang`.
- **Effect:** a terminal that types the demo run. Under `prefers-reduced-motion: reduce` it shows every line at once.
- **Screenshots:** `site/img/` holds real captures of public GitLab pages: pipeline 2948453748, MR !10, the `fix-proof` job log of !10's pipeline, and the summary note.
- **Sharing:** `og:` and `twitter:card` tags point to `site/img/og.png`, a 1200x630 crop of the pipeline screenshot, by its absolute Pages URL.
- **Test:** `tests/unit/site-text.test.js` checks that both languages have the same keys and no empty value, that every key the HTML uses exists, and that an unknown language falls back to English.
