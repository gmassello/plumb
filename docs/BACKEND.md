# Backend

Two kinds of server-side code live here: the booking app that the e2e suite tests, and the `tools/` scripts that CI runs to judge failures. The contracts between CI and the Duo flow (`verdict.json`, `proof.json`, branch and issue names) are in [`ARCHITECTURE.md` § Contracts](ARCHITECTURE.md#contracts).

## Booking app

`src/server.js` is a `node:http` server with no framework. `src/slots.js` holds the seed slots and the pure functions behind them (`listSlots`, `localParts`, `isValidBooking`), so unit tests reach them without HTTP.

The HTTP contract is [`cases/small-booking-api/SPEC.md`](../cases/small-booking-api/SPEC.md). Routes in `handle()`:

| Route | What it does |
|---|---|
| `GET /health` | `{"status": "ok"}`; Playwright's `webServer` waits on it |
| `POST /_test/reset` | drops every booking; also exposed on the deployed app |
| `GET /api/slots?tz=` | the three seed slots in the visitor's zone, with `available`; an unknown zone is `400` |
| `POST /api/bookings` | validates, then `404` for an unknown slot, `409` for a taken one, else `201` with `status: pending` |
| `GET /api/bookings/:id` | the booking, `pending` until its random confirm time passes, then `confirmed` |
| `GET /`, `/app.js`, `/styles.css` | the static page from `src/public/` |

Every error is `{"error": {"code", "message"}}`; an exception is a `500 internal_error`.

**Persistence:** a `Map` in memory. A restart or `/_test/reset` empties it.

**Flakiness on purpose.** Two constants at the top of `server.js` give the e2e suite real timing to get wrong:

- `CONFIRM_MAX_MS = 800`: a booking confirms at a random moment up to 800 ms after it is created.
- `BOOKING_GAP_MAX_MS = 20`: a random pause between the "is this slot taken" check and the insert, so two visitors who book the same slot at once can both get `201`.

Changing either one changes the measured failure rates in `docs/PLAN.md` U2 and `docs/CLAIMS.md`.

**Tests:** `tests/unit/slots.test.js` covers the pure functions; `checks.py` covers the six contract checks against a running app; the e2e suite covers it through the browser.

## CI tools

Plain Node scripts in `tools/`, each with its unit test in `tests/unit/`. Exported functions are pure; `main()` does the I/O.

| Script | Job | What it does |
|---|---|---|
| `verdict.mjs` | `flake-verdict`, `fix-proof` | Reads Playwright JSON reports and writes `verdict.json` / `proof.json` and a JUnit file with one case per run. Modes: `--failed` (the failed tests as `file:line`), `--infra` (infrastructure failure patterns), `--real`, `--base` (parent-commit result), `--unreproduced`, `--suite` (full-suite re-runs) |
| `quarantine.mjs` | `quarantine-check` | Lists tests tagged `@quarantine` and matches each with an open-or-closed `Quarantined:` issue. Exit 1 when more than `QUARANTINE_MAX` (default 2) are quarantined; exit 3, a non-blocking warning, when one has no issue or its `Expires:` date has passed |
| `flow-drift.mjs` | `flow-drift` | Compares `.gitlab/duo/triage-flow.yml` with the latest version published in the AI Catalog (GraphQL) and fails on any difference |
| `summary.mjs` | `summary` | On a `main` commit merged from a flow MR, posts one note on the commit whose pipeline failed (verdict, MR, proof, live URL) and labels the MR `triage::merged` or `triage::quarantined` |
| `results.mjs` | run by hand | Regenerates `docs/RESULTS.md` and `docs/sessions/` from the GitLab API through `glab` |

### How the verdict is decided

`buildVerdict` in `verdict.mjs` counts the 10 re-runs of each failed test:

- 0 passed → `real`; any pass → `flaky`.
- `order: "state-leak"` when it passed the first runs and failed every later one (state left by earlier runs).
- `order: "suite-only"` when it passed every isolated run. CI then runs the full suite 3 times and records the result as `suite`.
- A `real` test also runs 3 times on the parent commit, recorded as `base`.
- `infraMatch` checks failure messages for six patterns (disk full, out of memory, DNS, browser launch, web server start, network down). On a match, nothing is re-run and `verdict.json` carries `infra` instead of tests.

**Errors:** every script prints a line that starts with its own name and says what is missing, then exits non-zero. `flake-verdict` always exits 1 on purpose, so the pipeline stays red and the Duo trigger fires.

**Observability:** CI traces, metrics and logs go to GitLab Observability through the `GITLAB_OBSERVABILITY_EXPORT` project variable. The app itself only logs its start line, kept in `server.log` as a job artifact.
