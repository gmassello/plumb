# <Product> — Plan

> This is the work plan, with each unit's status as of when it was done. The built system is described in the [README](../README.md) and [ARCHITECTURE](ARCHITECTURE.md).

Source: `docs/BRIEF.md`, `docs/ARCHITECTURE.md` · Deadline: 2026-10-27 13:00 UTC (10:00 ART) · Hours left at writing: 398

## Summary
At the end of this plan a real red pipeline on the booking app's e2e suite is turned, with no human in the middle, into either a merged and proven fix that is live on Cloud Run, or a quarantined test with an issue. U4 is the unit that unblocks the demo: it is the first point where Duo acts on a real verdict.

## Key technical decisions
- CI jobs decide verdict, proof and merge; the Duo flow diagnoses and writes the change — chosen over a CI-only bot and a flow that does everything because it keeps the merge rule deterministic. settled: inherited from ARCHITECTURE (ADR-0001)
- Verdict re-runs each failed test 10 times; the proof runs each changed test 50 times — chosen over smaller N because a fix that still fails 10% of runs passes with probability ≈0.5%. settled: inherited from ARCHITECTURE (QA-02)
- The booking app is Node with no framework (`node:http`, static HTML and JS, `node:test` for unit tests) — chosen over Express because it adds no dependency; the only dependency is `@playwright/test` 1.63.0. settled: user-approved (plan-time)
- The flow definition lives in `.gitlab/duo/` as the source of truth and is pasted into the GitLab UI — chosen over UI-only editing because the YAML is then reviewed in MRs and checked for drift (U10). settled: plan-time
- Flakiness comes from the app's natural behaviour and is never forced by a switch — chosen over an injected random failure because the evidence must be honest. settled: inherited from BRIEF
- The merge uses the author's `api`-only personal access token in `MERGE_BOT_TOKEN`; the deploy uses Workload Identity Federation with no Google key. settled: inherited from ARCHITECTURE (spikes S3b, S5)
- The booking app is only the subject under test: no language, theme or register toggles. settled: inherited from BRIEF

## Units
### U1. Booking app with natural flakiness sources
- **Goal:** a small appointment-booking web app runs locally and in a container, and each of the five flakiness sources happens naturally. The README carries a `## Commands` block (install, dev, full suite, one test, lint, deploy). The sources are:
  - the confirmation arrives after a server delay with jitter of hundreds of milliseconds, so it dominates browser overhead and the rate drifts less between a laptop and CI;
  - booking is check-then-insert with an awaited gap, so two visitors can both get the same slot;
  - slots are shown in the visitor's time zone;
  - bookings live in shared in-memory state, with a reset endpoint that tests may forget to call;
  - the confirmation modal is animated and enables its button after a short random delay.
- **Covers:** R10 · F1
- **Files:** `src/server.js`, `src/slots.js`, `src/public/index.html`, `src/public/app.js`, `src/public/styles.css`, `Dockerfile`, `package.json`, `tests/unit/slots.test.js`, `README.md`, `CLAUDE.md`
- **Depends on:** —
- **Status:** done
- **Tests:**
  - happy: a visitor books a free 10:00 slot → the server stores it and the confirmation endpoint reports it as booked.
  - edge: a second booking for an already booked slot → it gets a "slot taken" response. Two requests that arrive at once can both succeed: that race is the intended flakiness source (R10), not a defect.
  - edge: slots are listed for a visitor in UTC−3 → 23:30 UTC shows the same day at 20:30, and 01:30 UTC shows the previous calendar day at 22:30.
  - error: a booking for a slot that does not exist → a 404 with a message, and nothing is stored.

### U2. End-to-end suite and quarantine lanes
- **Goal:** one Playwright test per flakiness source exercises the app in the browser, with `workers: 1` so order and shared state stay predictable. The blocking `e2e` job runs every test not tagged `@quarantine`. A separate `e2e-quarantine` job runs only the tagged ones and never blocks the pipeline. `e2e` keeps its JSON report (`e2e-report.json`) as an artifact for U3.
  - **Rate-flaky (10–40% target):**
    - async wait reads the status after a fixed pause instead of a waiting assertion; this is the AE2 demo source;
    - concurrency is the AE3 quarantine source, because a test-side fix only narrows the server race;
    - animation clicks the modal with `force`.
  - **Not rate-flaky:** time zone and shared state fail by environment or test order, nearly 0% or 100%. They are kept as realistic cases, and their measured rates are recorded instead of promised.
- **Covers:** R10, R5 · F3
- **Files:** `tests/e2e/booking.spec.ts`, `tests/e2e/timezone.spec.ts`, `tests/e2e/concurrency.spec.ts`, `tests/e2e/shared-state.spec.ts`, `tests/e2e/modal.spec.ts`, `playwright.config.ts`, `.gitlab-ci.yml`
- **Depends on:** U1
- **Status:** done. Measured locally in the CI image, 50 runs each: async wait 16/50 failed (32%, pause 600 ms), concurrency 13/50 (26%, 20 ms check-to-insert gap), animation 12/50 (24%, pause 450 ms); shared state fails on its second repetition; time zone passes in UTC.
- **Tests:**
  - happy: a commit with no tagged tests → `e2e` runs all five specs and `e2e-quarantine` reports nothing to run.
  - edge: one test carries `@quarantine` → `e2e` skips it, `e2e-quarantine` runs it, and the pipeline stays green when it fails.
  - edge: the async test under 20 local runs → its failure rate falls between 10% and 40%; otherwise the delay is retuned before U3.
  - error: the app does not start in CI → `e2e` fails within its timeout with the server log attached as an artifact.

### U3. Flake verdict job
- **Goal:** when `e2e` fails, `flake-verdict` re-runs only the failed tests 10 times on the same commit and writes `verdict.json` with the fields set in ARCHITECTURE's contract. `real` means 0 passes and `flaky` means some passes. The job keeps the pipeline failed so the trigger fires.
- **Covers:** R1, R8 · F1, F2
- **Files:** `.gitlab-ci.yml`, `tools/verdict.mjs`, `tests/unit/verdict.test.js`
- **Depends on:** U2
- **Status:** done. Checked locally in the CI image: a flaky run gave concurrency 7/10 and animation 5/10 (`flaky`); a server that never confirms gave async 0/10 (`real`); a missing report and a green report write no verdict.
- **Tests:**
  - happy: a test that fails about 3 times in 10 → `verdict.json` lists it with `passed` between 1 and 9 and `verdict: flaky`.
  - happy: a commit that breaks the booking confirmation → the test fails 10 of 10 and `verdict.json` says `real`. Covers AE1.
  - edge: two tests fail in the same run → both appear in `verdict.json`, each with its own counts.
  - error: Playwright writes no report (crash before tests) → `verdict.json` is not produced and the job log says why.
  - error: `e2e-report.json` is missing from the `e2e` artifact → the job fails loudly and writes no verdict. The failed tests come from that report as `file:line`, not from `--last-failed`: without `.last-run.json` that flag silently re-runs the whole suite, and with `--repeat-each` it runs each test once.

### U4. Triage flow: detect and fix
- **Goal:** the Duo flow, started by "Pipeline events → Failed", reads `verdict.json` through the API.
  - No `flake-verdict` job: it stops without acting.
  - `real`: it opens one "Real regression" issue with the run evidence and opens no branch or MR.
  - `flaky`: it classifies the cause (async wait, concurrency, time zone, shared state, animation) from the trace and the code, commits a fix on `fix/<pipeline_id>-<slug>`, and opens an MR whose description starts with the cause and the pass rate.
- **Covers:** R2, R3, R7 · F1, F2
- **Files:** `.gitlab/duo/triage-flow.yml`, `docs/ARCHITECTURE.md` (contract updates only if they change)
- **Depends on:** U3
- **Status:** done. Flow `triage-flow` (AI Catalog item 1017874, v1.1.0, same as `.gitlab/duo/triage-flow.yml`), enabled with Pipeline events → Failed. AE2: pipeline 2936535281, async confirmation 8/10 `flaky` → MR !3 `Cause: async-wait · pass rate 8/10`, diff only in `tests/e2e/booking.spec.ts`. AE1: pipeline 2936546100 (deliberate regression d4dd783, reverted in 2f47272), 0/10 `real` → issue #6, no MR. A job log cannot be read with `gitlab_api_get`, so `verdict.json` carries `error` and `error_at`.
- **Tests:**
  - happy: a real regression → one issue "Real regression: <title> (pipeline <id>)" with the 0/10 evidence, and no MR or branch. Covers AE1.
  - happy: the async confirmation test fails 3 in 10 → MR titled with the test, cause `async-wait`, fix waiting for the confirmation. Covers AE2.
  - edge: a red pipeline with no `flake-verdict` job (a failed deploy) → the flow session ends with no note, MR or issue.
  - error: the model returns nothing (`content_filter`) → no action is taken, and the checkpoint shows `finish_reason` for diagnosis.

### U5. Triage flow: wait on the proof and quarantine
- **Goal:** after opening the MR, the flow polls the MR pipeline until it finishes. On a red `fix-proof` it replaces the fix on the same branch with the `@quarantine` tag. It then opens an issue titled `Quarantined: <test>` with labels `flaky` and `quarantine`, the verdict and proof pass rates, the trace links, and an expiry date 14 days out.
- **Covers:** R5 · F3
- **Files:** `.gitlab/duo/triage-flow.yml`
- **Depends on:** U4, U6
- **Status:** done 2026-10-13 (flow v1.3.0). Scenario `quarantine` (an audit write between the slot check and the insert; 27/50 failed in the CI image locally, about 1 in 6 `e2e` runs on the CI runners), pipeline 2944554222: verdict 6/10 `flaky`; MR !9 with label `flaky`, the fix's proof 33/50 (pipeline 2944576807, red); the flow committed the original test with `@quarantine` on the same branch and opened issue #9 with both rates, the trace, the proof job and `Expires: 2026-10-27`, and its note pointed at the audit write as a likely app race. The quarantine commit's proof had nothing to run (pipeline 2944587486, green), `merge-gate` merged it, and the next main pipeline (2944591118) was green with `e2e` running 4 tests and `e2e-quarantine` the quarantined one. The scenario was reverted in b3310b8; the `@quarantine` tag stays until the demo-baseline commit. The green-proof edge was not re-run with v1.3.0.
- **Tests:**
  - happy: a fix that still fails at least once in 50 runs → the branch gets the quarantine commit, the issue holds the pass rates, traces and expiry, and the pipeline goes green. Covers AE3.
  - edge: the proof is green → the flow stops polling and opens no issue.
  - error: the MR pipeline does not finish within the flow's 900 s timeout → the MR stays open with label `flaky`, which is a documented limit.

### U6. Fix proof and merge gate
- **Goal:** in an MR from a `fix/` or `update/` branch, `fix-proof` runs every e2e spec the MR changes (from `git diff` against the MR base, skipping `@quarantine`) 50 times, fails on any failure, and leaves `proof.json` built with `tools/verdict.mjs`. `merge-gate`, the last job, runs only on `fix/` and merges the MR through the API with `MERGE_BOT_TOKEN` once the proof passed, so an `update/` MR never merges itself. On those branches `e2e` does not block: the flakiness of other tests must not hold back a proven fix.
- **Covers:** R4, R12, R14 · F1, F4, F6
- **Files:** `.gitlab-ci.yml`
- **Depends on:** U2, U3
- **Status:** done. MR !3 (async, pipeline 2937036659): `fix-proof` 50 passed in 1.8 min, `proof.json` 50/50, `merge-gate` HTTP 200, merged while `e2e` failed on other flaky tests (non-blocking on `fix/`). MR !4 (modal, pipeline 2937045114): 50 passed, merged. MR !5, a duplicate fix the flow opened from a pipeline that failed before !3 merged, ended with an empty diff and a red `fix-proof`, so it never merged.
- **Tests:**
  - happy: a fixed test passes 50 of 50 → `merge-gate` returns HTTP 200 and the MR is merged into main. Covers AE2.
  - edge: an MR from an `update/` branch → `fix-proof` runs and `merge-gate` does not; the MR stays open for a human.
  - edge: an MR from a branch that is neither `fix/` nor `update/` → neither `fix-proof` nor `merge-gate` runs.
  - edge: a `fix/` MR that changes no e2e spec → `fix-proof` fails and says there is nothing to prove.
  - error: the token is expired or has extra scopes → `merge-gate` fails with the HTTP code in the log and the MR stays open.

### U7. Deploy to Cloud Run and summary
- **Goal:** on main, `deploy` builds and deploys the app to Cloud Run through Workload Identity Federation. It checks that the public URL serves the booking page, then posts one summary note on the original commit linking the pipeline, the MR and the URL.
- **Covers:** R6 · F1
- **Files:** `.gitlab-ci.yml`, `deploy/gcp-wif.json`
- **Depends on:** U1, U6
- **Status:** done. Deploy 2026-10-13; AE4 closed 2026-10-14 in the U9 rehearsal: after !10 merged, pipeline 2948477539 deployed and `summary` posted the note on commit `57608d9`. Pipeline 2944629161: `deploy` 83 s (Workload Identity Federation, no key), URL https://booking-vic4jyzsha-uc.a.run.app served the booking page, and `cases/small-booking-api/checks.py` passed 6/6 against it; `summary` found no flow merge request and posted nothing, as designed. `SUMMARY_DRY_RUN` against real artifacts built the note for !9 (quarantined, proof 33/50) and !4 (proof 50/50). The federation-rejects-token case was not forced.
- **Tests:**
  - happy: a merged fix → the job prints the URL, the page contains the booking heading, and the summary note links pipeline, MR and URL. Covers AE4.
  - edge: two merges in a row → the second deploy replaces the first and the URL still serves the page.
  - error: the federation rejects the token → `deploy` fails at authentication and no summary is posted.

### U8. Reproducible numbers
- **Goal:** a script reads the verdict and proof artifacts of recorded pipelines through the API and writes a table of pass rates, runs and verdicts into `docs/RESULTS.md`. Every number published in the README, the deck or the video comes from that table.
- **Covers:** R8
- **Files:** `tools/results.mjs`, `docs/RESULTS.md`, `tests/unit/results.test.js`, `package.json`
- **Depends on:** U3, U6
- **Status:** done 2026-10-14. `node tools/results.mjs` reads the flow sessions (GraphQL), `verdict.json`, `proof.json` and the issues and MRs named after each pipeline through `glab api`, and writes `docs/RESULTS.md`: 13 pipelines and 23 flow sessions, QA-06 12/12 right, 0 merges from `update/`. The three pipelines from 2026-10-10 show "artifacts expired". The error test checks a missing `glab` instead of a missing token, since the script uses glab's login.
- **Tests:**
  - happy: three recorded pipelines → the table lists each with its pipeline id, test, pass rate and verdict.
  - edge: the QA-06 classification runs (4 scenarios × 3) → the table lists each run with the expected and the chosen cause, and the total right.
  - edge: a pipeline whose artifacts expired → it is listed as "artifacts expired", not dropped.
  - error: the API token is missing → the script exits non-zero and writes nothing.

### U9. Demo rehearsal
- **Goal:** the full loop runs on a real pipeline, from a red push through verdict, MR, proof, merge, deploy and summary, and it is timed. A demo script records which commit to push, how many re-runs it took to get red, and the timestamps of each step, so the video shows the loop in under 3 minutes.
- **Covers:** R9 · F1, F2, F3, F4
- **Files:** `docs/DEMO.md`
- **Depends on:** U4, U5, U6, U7, U12
- **Status:** done 2026-10-14, recorded in `docs/DEMO.md`. Demo commit `57608d9`; push pipeline 2948453748 passed, one `e2e` retry failed; verdict 3/10 flaky → MR !10 (cause async-wait) → proof 50/50 → merged → deploy and summary in pipeline 2948477539. Red job to summary note: 9 min 47 s, no human action.
- **Tests:**
  - happy: a push of the demo commit → the loop reaches the live URL and every step's timestamp is recorded in `docs/DEMO.md`.
  - edge: the flaky test passes on the first push → the script's re-run step produces the red pipeline within the documented number of retries.
  - error: one step fails during the rehearsal → it is logged with its pipeline link, and the rehearsal is repeated after the fix.

### U10. Flow drift check
- **Goal:** a CI job compares `.gitlab/duo/triage-flow.yml` with the flow definition published in GitLab, read through GraphQL, and fails when they differ. The flow that runs is then always the one reviewed in the repo.
- **Covers:** R7, R17
- **Files:** `.gitlab-ci.yml`, `tools/flow-drift.mjs`, `tests/unit/flow-drift.test.js`
- **Depends on:** U4
- **Status:** done 2026-10-15 (flow v1.4.0). The job reads the catalog with `MERGE_BOT_TOKEN`, or anonymously once the item is public. It runs only on main, with `needs: []`, so a failure never starts `flake-verdict`. A schema check was not added: the catalog validates the YAML when it is saved.
- **Tests:**
  - happy: repo and published definition are identical → the job passes.
  - edge: only trailing whitespace differs → the job passes.
  - error: the published flow has a duplicated YAML block (an editor paste mishap) → the job fails and prints the diff.

### U11. Deterministic failure scenarios
- **Goal:** three reproducible scenario commits make an e2e test fail on every run for a reason that is not a bug, so each deterministic cause occurs naturally:
  - **app change:** a redesign renames the "Book" button to "Confirm booking"; `booking.spec.ts` first switches to clicking it by role and name, because with a test id the rename breaks nothing;
  - **environment:** a change to `.gitlab-ci.yml` sets `TZ` for the `e2e` job;
  - **test data:** a seed change leaves no free slot for the test that assumes one.

  Each lives as a patch in `demo/scenarios/` with a short script that applies it as a normal commit and reverts it.
- **Covers:** R10 · F4, F5, F6
- **Files:** `demo/scenarios/app-change.patch`, `demo/scenarios/environment.patch`, `demo/scenarios/test-data.patch`, `demo/scenarios/apply.sh`, `README.md`
- **Depends on:** U2, U3
- **Status:** done locally. In the CI image: the base suite passes (its only failures are the flaky concurrency test); `app-change` → `async confirmation` 10/10 failed; `environment` (TZ=America/Argentina/Buenos_Aires) → time-zone test 10/10 failed; `test-data` → `a visitor books the last slot of the day` 10/10 failed and the rest of the suite passes; the small case stays 6/6 with `test-data` applied. `booking.spec.ts` now clicks the modal button by role and name, and `actionTimeout: 5_000` keeps 10 failing re-runs near one minute.
- **Tests:**
  - happy: each scenario applied in the CI image → the expected test fails 10 of 10 re-runs (locally); the same 0/10 `real` verdict on a real pipeline is checked in U12, because before U12 the flow would file a wrong "Real regression" issue.
  - edge: reverting a scenario commit → the next main pipeline has no `real` verdict for that test.
  - error: a patch no longer applies to main → the script stops before committing and names the patch.

### U12. Flow classifies always-failing tests
- **Goal:** on a `real` verdict the flow reads the commit message and diff (spike S8 first) and classifies the cause:
  - **regression** → the "Real regression" issue, as today;
  - **app change** → an MR on `update/<pipeline>-<slug>` with label `needs-review` that updates the test and quotes the commit message and changed lines;
  - **environment** → an `environment` issue naming the setting the commit changed;
  - **test data** → an MR on `fix/` with cause `test-data`, where the test sets up its own data.
- **Covers:** R11, R12, R13, R14 · F4, F5, F6
- **Files:** `.gitlab/duo/triage-flow.yml`, `docs/ARCHITECTURE.md` (S8 result)
- **Depends on:** U4, U6, U11
- **Status:** done 2026-10-13 (flow v1.2.0, published with `aiCatalogFlowUpdate`). QA-06: 12 of 12 right causes, each scenario run once and retried twice on the same pipeline:
  - regression, pipeline 2940411157 → issue #7, retries "already covered by #7";
  - environment, pipeline 2944325042 → issue #8 naming `TZ`, no MR, retries covered by #8 (AE6);
  - app-change, pipeline 2944391258 → MR !6 on `update/` with `needs-review` clicking "Confirm booking", `fix-proof` 50/50, `merge-gate` skipped, closed by hand (AE5);
  - test-data, pipeline 2944438629 → MR !7 with cause `test-data`, `fix-proof` 50/50, merged by `merge-gate` (AE7); the second retry ran after the merge and opened duplicate !8, closed by hand (see ARCHITECTURE risks).
  Each scenario was reverted afterwards. The merged !7 means the test-data scenario no longer fails on main; the demo-baseline commit restores the original test.
- **Tests:**
  - happy: the app-change scenario → an `update/` MR with `needs-review` that clicks "Confirm booking", proven by `fix-proof` and not merged. Covers AE5.
  - happy: the environment scenario → an `environment` issue that names `TZ`, and no MR. Covers AE6.
  - happy: the test-data scenario → a `fix/` MR with cause `test-data`, merged by `merge-gate` after 50 of 50. Covers AE7.
  - edge: the U4 regression (a server that never confirms) → still the "Real regression" issue and no MR.
  - edge: QA-06, the 4 scenarios run 3 times each → the right cause in at least 11 of 12 runs.
  - error: the commit diff cannot be read → a "Real regression" issue that says the diff was unavailable.
  - edge: an open flow MR already fixes the same test (seen with MR !5, opened while !3 was still in proof) → the flow opens nothing and says which MR covers it.

### U13. Evidence in the pipeline
- **Goal:** the pipeline shows more of the loop's evidence:
  - JUnit reports with one case per run on `e2e`, `flake-verdict` and `fix-proof`, so the merge request widget counts the 50 proof runs;
  - a `real` test also runs 3 times on the parent commit, and the flow quotes that result;
  - scoped `triage::` state labels: the flow sets them when it creates something, and `summary` sets `triage::merged` or `triage::quarantined`;
  - the SAST and Secret Detection templates.
- **Covers:** R1, R7, R8
- **Files:** `.gitlab-ci.yml`, `playwright.config.ts`, `tools/verdict.mjs`, `tools/summary.mjs`, `.gitlab/duo/triage-flow.yml`, `tests/unit/verdict.test.js`, `tests/unit/summary.test.js`
- **Depends on:** U3, U4, U6
- **Status:** done 2026-10-16 (flow v1.4.0, public in the AI Catalog). Regression scenario, pipeline 2953211821: `flake-verdict` JUnit 10 cases, 10 failed; issue #10 with `triage::real` and "Parent commit 3297613…: passed 3/3 runs". Flaky loop, pipeline 2953221849: 6/10 → !11 with `triage::proving`, the MR pipeline's `fix-proof` JUnit 50/50, merged by `merge-gate`, relabelled `triage::merged` by `summary`. Scoped labels work: `triage::merged` replaced `triage::proving`.
- **Tests:**
  - happy: a test that passes 3 of 5 runs → a JUnit report with 5 cases and 2 failures.
  - happy: a real test present on the parent commit → `base` with the parent's passes; absent → `base: null`.
  - edge: a quarantined loop → `summary` labels the MR `triage::quarantined`, not `triage::merged`.

### U14. Evidence for the judges
- **Goal:** a reader checks every claim without running anything: a "See it work" table in the README with one real pipeline per path, a "Limits" section, `docs/CLAIMS.md` mapping each published number to its source, and the flow session transcripts in `docs/sessions/`, exported by `tools/results.mjs`.
- **Covers:** R8, R9
- **Files:** `README.md`, `docs/CLAIMS.md`, `docs/sessions/`, `tools/results.mjs`, `tests/unit/results.test.js`
- **Depends on:** U8, U13
- **Status:** done 2026-10-16. 25 sessions exported; QA-06 still 12/12.
- **Tests:**
  - happy: a chat log with tool steps and a final answer → a transcript with one row per step and the answer quoted, without tool responses.
  - happy: a pipeline with two sessions → its RESULTS row links both transcripts.

### U15. Order, infrastructure and quarantine limits
- **Goal:** the verdict tells a test that fails because of state left by earlier runs from an unlucky flaky one, an infrastructure failure never reaches a code fix, and quarantine has an expiry that shows and a cap that blocks.
- **Covers:** R1, R3, R5, R17
- **Files:** `tools/verdict.mjs`, `tools/quarantine.mjs`, `.gitlab-ci.yml`, `.gitlab/duo/triage-flow.yml`, `demo/scenarios/order.patch`, `tests/unit/verdict.test.js`, `tests/unit/quarantine.test.js`
- **Depends on:** U3, U5, U11
- **Status:** done 2026-10-17. Flow v1.5.0. Scenario `order` on pipeline 2957810765: 1/10 `state-leak` → !12 `shared-state`, proof 50/50, merged.
- **Tests:**
  - happy: runs P P F×8 → `state-leak`; P F F F F P×5 → no order; 10/10 alone → `suite-only` with the full-suite result.
  - edge: P×7 F×3 → no order, so an unlucky flaky run is not called a leak.
  - happy: "ENOSPC" and a `config.webServer` timeout are infrastructure; "ECONNREFUSED" is not.
  - happy: an expired quarantine → exit 3; a tagged test with no issue → exit 3; 3 tests over a cap of 2 → exit 1.

### U16. Test history as the flow's memory
- **Goal:** the flow knows what already happened to a failing test (earlier fixes, quarantines, issues), quotes it, and stops fixing a test whose fixes did not hold.
- **Covers:** R3, R5, R8, R16
- **Files:** `tools/history.mjs`, `tests/unit/history.test.js`, `tools/summary.mjs`, `tests/unit/summary.test.js`, `.gitlab-ci.yml`, `.gitlab/duo/triage-flow.yml`, `demo/scenarios/recurring.patch`, `demo/scenarios/apply.sh`, `package.json`
- **Depends on:** U3, U5, U7
- **Status:** done 2026-10-17, flow v1.6.0. The `recurring` scenario ran on pipeline 2959218101 and led to !13, quarantined with its fix history (db0921c); it was undone in 3520ef9. A local run against the API gave `async confirmation` fixes `!3, !10, !11` and `booking from the confirmation modal` `!4, !12`, both recurring.
- **Tests:**
  - happy: merged fixes and earlier issues are listed in iid order.
  - edge: a title that only contains the test's title is not counted.
  - happy: 1 fix → not recurring; 2 → recurring; update MRs and closed fixes do not count.
  - happy: an MR titled `Quarantine …` is reported as quarantined, and the summary names the earlier fixes.
  - happy: Covers AE9. A test with 2 merged fixes that fails as flaky again is quarantined, and the summary quotes both fixes (`tests/unit/summary.test.js`, pipeline 2959218101).

### U17. Review fixes: proof, merge scope, infra list, quarantine trigger
- **Goal:** only a test-only merge request whose 50 runs all passed merges by itself; only failures a commit cannot cause count as infrastructure; a fix is quarantined only when `fix-proof` failed.
- **Covers:** R4, R5, R15
- **Files:** `tools/verdict.mjs`, `tests/unit/verdict.test.js`, `.gitlab-ci.yml`, `.gitlab/duo/triage-flow.yml`
- **Depends on:** U4, U15
- **Status:** done 2026-10-17, flow v1.7.0. Replaces the U15 test that called a `config.webServer` timeout infrastructure.
- **Tests:**
  - happy: 3/3 passed → proven; 2/3, three skipped runs or fewer runs than expected → not proven.
  - edge: `config.webServer` timeout, `browserType.launch` and `getaddrinfo ENOTFOUND` → not infrastructure; `getaddrinfo EAI_AGAIN` → DNS failure.
  - happy (CI image, local): a `test.skip` fix fails `fix-proof`; a quarantine passes it; Covers AE8: a fix that also touches `src/public/app.js` fails `merge-gate`.

### U18. Review fixes: history, load errors, commits on main, last slot, front errors
- **Goal:** a fix that ended in quarantine is not history; a spec that fails to load still gets a verdict; the flow commits on the current `main` content; `shared-state.spec.ts` books the last slot again; the booking page stops on HTTP errors.
- **Covers:** R2, R5
- **Files:** `tools/history.mjs`, `tools/verdict.mjs`, `tests/unit/history.test.js`, `tests/unit/verdict.test.js`, `.gitlab-ci.yml`, `.gitlab/duo/triage-flow.yml`, `tests/e2e/shared-state.spec.ts`, `src/public/app.js`
- **Depends on:** U17
- **Status:** done 2026-10-17, flow v1.8.0.
- **Tests:**
  - happy: a fix MR and a `Quarantined:` issue of the same pipeline → not a fix; one more real fix → `recurring` false.
  - edge: a report with only `errors[]` → one real test `<file> failed to load`; a report with failed tests → no load-error verdict.

### U19. Review fixes: reset token, error log, quarantine tags, real run counts, body limit, infra cell
- **Goal:** the live reset needs a token; a 500 leaves its stack in the log; every `@quarantine` tag counts; pass rates use the runs that ran; the server refuses bodies over 10 000 bytes; `RESULTS.md` shows infra verdicts.
- **Covers:** R5, R8
- **Files:** `src/server.js`, `cases/small-booking-api/checks.py`, `.gitlab-ci.yml`, `tools/quarantine.mjs`, `tools/verdict.mjs`, `tools/summary.mjs`, `tools/results.mjs`, `.gitlab/duo/triage-flow.yml`, `tests/unit/*.test.js`
- **Depends on:** U18
- **Status:** done 2026-10-17, flow v1.9.0. The CI variable was first named `RESET_TOKEN`, which every job on main received, so the app under test in `unit` closed its reset and main went red (pipeline 2958899914); it is now `LIVE_RESET_TOKEN`.
- **Tests:**
  - happy: a `describe`, a mid-title tag and a title across lines are listed as quarantined; an infra verdict shows `infra: <pattern>`.
  - edge: skipped and interrupted runs are not counted; three skipped runs give no verdict; with `RESET_TOKEN=x` the reset without the header is `403` and `checks.py` with the token passes 6/6; a 20 KB body is `413`.

### U20. CI and uptime: live checks every 6 hours
- **Goal:** until judging ends, a schedule proves that the live app, the project page, the published flow and the quarantines are still right, and its log says what it received when they are not.
- **Covers:** R6, R17
- **Files:** `.gitlab-ci.yml` (`live-health`), pipeline schedule 4497507
- **Depends on:** U7, U10, U15
- **Status:** done 2026-10-17 (904b155). Red at 12:09, 18:09 and 00:08 UTC on 2026-10-18 because `wget | grep -q` died on SIGPIPE under `pipefail`; fixed in 4aeaecd and green on pipeline 2961165751.
- **Tests:**
  - happy: the page serves `<title>Plumb</title>` and the app answers `/health` with 200.
  - edge: a page that serves something else fails the job and prints its first 400 bytes.

### U21. Project page and demo video
- **Goal:** a judge with no context sees the whole loop in a few minutes: a project page in English and Spanish, light and dark, every number linked to its run, and a demo video under 3 minutes.
- **Covers:** R9
- **Files:** `site/`, `video/script.tsv`, `.gitlab-ci.yml` (`pages`)
- **Depends on:** U9, U14
- **Status:** done. Page in 51e1a98; video sources in b78ec13, published at https://youtu.be/ViidpLXD_PY (2:02); UX review applied in 8b49ecc; accessibility fixes in d3e7322.
- **Tests:**
  - happy: `tests/unit/site-text.test.js`, the same keys in both languages.

## Cut line
| Tier | Units | Why |
|---|---|---|
| must | U1, U2, U3, U4, U5, U6, U7, U9, U11, U12, U20 | the full loop from red pipeline to live app is the demo, and telling an outdated test from a regression is the idea's edge (Innovation/Idea); without any of these there is nothing to film |
| should | U8, U10, U13, U14, U15, U16, U17, U18, U19, U21 | U8 backs every published number (Potential Impact); U10 strengthens the govern stage (Stage One, Technological Implementation) |
| cut | — | nothing is cut: 110 hours on 2026-10-22, every must unit done; what is left is sending the entry |

## Risks
- The webServer runs once per `playwright test` invocation, so all 10 or 50 repetitions share one in-memory state. This is inferred from Playwright's source, not documented — likelihood: media — mitigation: the first U2 test checks it with a hit counter, and tests that need clean state call the reset endpoint — fallback: restart the server per repetition batch.
- The flaky test does not fail when the video is recorded — likelihood: alta — mitigation: U9 measures the re-runs needed to get red and the script includes them — fallback: show a recorded run of the same loop.
- The model refuses or returns nothing (`content_filter`) — likelihood: media — mitigation: narrow prompts that name exact fields and never ask to dump environment or secrets — fallback: re-run the failed job, which fires the trigger again.
- The flow times out while polling the MR pipeline — likelihood: baja — mitigation: the 50-run proof measured 88 s against the flow's 900 s timeout — fallback: the MR stays open with a label, documented as a known limit.
- Duo credits or CI minutes run out before the demo — likelihood: media — mitigation: run the full loop only in U9 and keep other checks to single jobs — fallback: none; the loop needs both.
- The flow picks the wrong cause for an always-failing test — likelihood: media — mitigation: QA-06 measures it on 12 runs, and an app-change MR never merges itself (`merge-gate` skips `update/`) — fallback: the reviewer closes the MR; a wrong `test-data` merge shows up again on the next red pipeline.
- Six flows do not fit a video under 3 minutes — likelihood: alta — mitigation: the video shows F1 end to end plus a short cut of F4; F2, F3, F5 and F6 are backed by runs in `docs/RESULTS.md` — fallback: drop the F4 cut.
- `MERGE_BOT_TOKEN` expires on 2026-11-09 — likelihood: baja — mitigation: the date is after judging — fallback: replace it with a new `api`-only token.
- Cloud Run answers 500 or times out for the first seconds after a redeploy (three 500s seen on 2026-10-18) — likelihood: media — mitigation: `live-health` checks the app every 6 hours — fallback: the video and the page's screenshots; `--min-instances 1` would remove it but costs money and is not set.

## Out of scope
- Releasing a test from quarantine automatically once someone else fixes it.
- Predicting flakiness before a test has ever failed.
- Running across several projects or a whole group.
- Test frameworks other than Playwright.
- Infrastructure flakiness (runner or registry outages).
- A dashboard of its own; the record lives in merge requests, issues and notes.
- A polished booking product with language, theme or register toggles.
