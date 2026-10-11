# <Product> — Use cases

Source: `docs/BRIEF.md` (R, F, AE) and `docs/PLAN.md` (priorities from its Cut line, units by U-ID).

## Features
| Feature | IDs | Actor | Priority | Criterion | In the video |
|---|---|---|---|---|---|
| Verdict by re-running the failed test N times | R1 · F1, F2 | A2 | must (U3) | Technological Implementation | yes: the 7/10 or 0/10 count |
| A real regression is only explained, never touched | R2 · F2 | A2 | must (U4) | Design | yes: the "Real regression" issue |
| Root cause classified with evidence | R3 · F1, F3 | A2 | must (U4) | Innovation/Idea | yes: the cause in the MR description |
| Fix merged only after N proof runs pass | R4 · F1 | A2 | must (U6) | Innovation/Idea | yes: the 50/50 proof and the merge |
| Quarantine with an issue and an expiry date | R5 · F3 | A2, A3 | must (U2, U5) | Design | yes: the issue |
| Deploy to Google Cloud, verified live, with a summary | R6 · F1 | A2 | must (U7) | Google Cloud bonus | yes: the live URL |
| Built on Duo Agent Platform flows triggered by pipeline events | R7 · F1, F2, F3 | A2 | must (U4); drift check should (U10) | Stage One | yes: the flow session |
| Every published number comes from recorded runs | R8 | A3 | must (U3); results table should (U8) | Potential Impact | yes: numbers on screen |
| Full loop shown in under 3 minutes | R9 · F1 | A1 | must (U9) | Presentation | is the video |
| Booking app with natural flakiness sources | R10 | A1 | must (U1, U2) | Technological Implementation | yes: the app under test |

## Happy paths

### F1. Flaky test fixed — R1, R3, R4, R6
Initial state: main green and deployed. The e2e test `async confirmation` reads the booking status after a fixed 500 ms pause while the server confirms after 0–800 ms (PLAN U2).

1. The developer pushes commit `abc1234` to main; the `e2e` job fails on `async confirmation`.
2. `flake-verdict` re-runs that test 10 times: 7 pass, 3 fail, and `verdict.json` says `flaky`.
3. The pipeline ends red, and "Pipeline events → Failed" starts the triage flow within seconds.
4. The flow reads `verdict.json`, classifies the cause as `async-wait` from the trace and the spec, commits a waiting assertion on `fix/<pipeline_id>-async-confirmation`, and opens an MR that starts with "Cause: async-wait · pass rate 7/10".
5. In the MR pipeline, `fix-proof` runs the changed test 50 times: 50 pass. `merge-gate` merges the MR.
6. On main, `deploy` publishes to Cloud Run, checks that the URL serves the booking page, and posts a summary note on `abc1234` linking the pipeline, the MR and the URL.

Acceptance criteria:
- **AE2.** "Given a test that clicks "Book" before the async confirmation arrives and fails about 3 times in 10, when the pipeline fails, then the flow classifies it as async wait, opens an MR that waits for the confirmation, and merges it only after N repeated runs pass." — How it is proven: `verdict.json` artifact of the failed pipeline (passed 1–9 of 10), the MR description (cause `async-wait`), the `fix-proof` log (50 passed), and the `merge-gate` log (HTTP 200).
- **AE4.** "Given a merged fix, when the deploy job finishes, then the public app URL serves the booking page and the summary links the pipeline, the MR and the URL." — How it is proven: the `deploy` job log (URL and content check), `python3 cases/small-booking-api/checks.py <live URL>` exit 0, and the summary note read through the API.

### F2. Real regression — R1, R2
Initial state: main green. The developer pushes `def5678`, which removes the confirmation step from the server.

1. `e2e` fails on `async confirmation`.
2. `flake-verdict` re-runs it 10 times: 0 pass, and `verdict.json` says `real`.
3. The flow reads the verdict, opens the issue `Real regression: async confirmation (pipeline <id>)` with `def5678`, the 0/10 evidence and the pipeline link, and stops.

Acceptance criteria:
- **AE1.** "Given a commit that breaks the booking confirmation, when the pipeline fails and the test fails on all N re-runs, then the flow opens a "Real regression" issue with the run evidence and opens no MR." — How it is proven: `verdict.json` (passed 0 of 10), the issue read through the API (label `regression`, title naming the pipeline), and the project's MR list with no MR whose source branch starts with `fix/<pipeline_id>`.

### F3. Fix not proven — R1, R3, R5
Initial state: main green. The `two visitors book the same slot` test fails about 3 times in 10 because the server checks and inserts with an awaited gap (PLAN U1).

1. The pipeline fails, and `flake-verdict` marks the test `flaky` (for example, 6/10).
2. The flow classifies the cause as `concurrency`, commits a test-side fix on `fix/<pipeline_id>-concurrency`, and opens the MR.
3. `fix-proof` fails at least once in 50 runs, because the race lives in the server.
4. The flow, polling the MR pipeline, replaces the fix with the `@quarantine` tag on the same branch and opens the issue `Quarantined: two visitors book the same slot`, with the pass rates, the trace links and an expiry 14 days out.
5. The new MR pipeline skips the proof, `merge-gate` merges, and main goes green with the test running in `e2e-quarantine`.

Acceptance criteria:
- **AE3.** "Given a flaky test whose proposed fix still fails at least once in N runs, when the proof ends, then the test runs in a non-blocking job and an issue holds the pass rate, the traces and an expiry date." — How it is proven: the red `fix-proof` log, the issue read through the API (labels `flaky`, `quarantine`, an `Expires:` line), and the next main pipeline with `e2e` green and `e2e-quarantine` running the tagged test.

## Test cases

### Small — booking app HTTP contract
A self-owned, trivial case: the app's API that the e2e suite drives and the deploy job checks live. If it fails, the app, the container or the deploy is broken, not the flakiness logic. Units: U1 (local), U7 (live). Spec and checks: `cases/small-booking-api/`.

| Layer | Criterion | How it is proven |
|---|---|---|
| Product | Health, time-zone listing, booking that confirms within 2 s, slot taken, unknown ids and validation all behave as the spec says | `python3 cases/small-booking-api/checks.py http://localhost:8080` exits 0 with "6 passed" |
| Product | The same contract holds on the deployed app | `python3 cases/small-booking-api/checks.py <Cloud Run URL>` exits 0 |
| System | The checks were written from the spec and catch a broken server | Validated 2026-10-10: a reference server passed 6/6, and a mutant accepting a taken slot failed `check_slot_taken` |

### Medium — the two paths that do not end in a fix
A subset of the delivery with no event-provided suite: F2 and F3 on the same app and the same configuration. They are re-run at closing time as evidence that nothing was tuned by hand for the large case. Units: U3, U4, U5, U6.

| Layer | Criterion | How it is proven |
|---|---|---|
| Product | A real regression gets one explanatory issue and no MR (AE1) | `verdict.json` 0/10, the issue and the MR list through the API |
| Product | An unprovable fix ends in quarantine with an issue and a green main (AE3) | red `fix-proof` log, the issue through the API, the next main pipeline status |
| System | No human acted between the push and the outcome | the only human event in the pipeline and MR history is the initial push |
| System | Each path finishes within 15 min of the failure (QA-03) | pipeline and flow session timestamps, recorded in `docs/RESULTS.md` (U8) |

### Large — the full delivery
F1 end to end on a real pipeline, timed and filmed: red push to live URL with the summary. Units: U1–U7 and U9, with U8 for the numbers.

| Layer | Criterion | How it is proven |
|---|---|---|
| Product | The flaky test is fixed, proven 50/50, merged and live (AE2, AE4) | pipeline, MR, `fix-proof` and `deploy` links in `docs/DEMO.md` |
| Product | Every number shown in the video exists in recorded runs (R8) | each figure in the video and README traced to a row of `docs/RESULTS.md` |
| System | Zero human actions after the push; the merge comes from `merge-gate`, never from the flow | MR "merged by" plus the `merge-gate` log; the flow YAML has no merge tool |
| System | The loop from red to live fits the demo | step timestamps in `docs/DEMO.md`; the edited video is under 3 minutes |

## Out of scope
- Releasing a test from quarantine automatically once someone else fixes it.
- Predicting flakiness before a test has ever failed.
- Running across several projects or a whole group.
- Test frameworks other than Playwright.
- Infrastructure flakiness (runner or registry outages).
- A dashboard of its own; the record lives in merge requests, issues and notes.
- A polished booking product with language, theme or register toggles.
- Checking the concurrency race in the small case: it is an intended flakiness source, not a contract defect.
