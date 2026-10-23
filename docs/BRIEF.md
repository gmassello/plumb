# <Product> — Brief

## Summary
A GitLab Duo flow that wakes up when a pipeline fails on an end-to-end test, proves whether the test is flaky by re-running it, fixes the root cause and merges the fix only when the fix is proven stable. When it cannot prove a fix, it quarantines the test with the evidence so it stops blocking the team. When the test fails every time, it reads the commit to tell a real regression from an intended app change, an environment change or missing test data, and acts on each one differently. Either way, the change reaches production with no human in the middle, except where judging intent needs one.

## Problem frame
Most red pipelines are not broken code. At Google, "about 84% of the transitions we observe from pass to fail involve a flaky test" ([Google Testing Blog, 2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)). At Atlassian, flaky failures in the Jira backend repo force reruns that "waste over 150,000 hours of developer time each year" ([Atlassian Engineering, 2025](https://www.atlassian.com/blog/atlassian-engineering/taming-test-flakiness-how-we-built-a-scalable-tool-to-detect-and-manage-flaky-tests)). It is a weekly problem for most teams: "40% deal with flaky tests at least weekly" ([Eck et al., FSE 2019](https://arxiv.org/abs/1907.01466)).

UI tests are the worst case, and their causes are known: async wait alone explains 45% of UI-based flaky tests ([Romano et al., ICSE 2021](https://arxiv.org/abs/2103.02669)), followed by environment, test-runner misuse and test logic such as load order and test order dependency.

Today the workaround is manual: someone notices the red pipeline, re-runs it, guesses whether it is the test or the code, and either fixes the test or quarantines it by hand. GitLab itself documents a manual quarantine process with a 3-day fast quarantine and a 3-month long-term limit ([GitLab Handbook](https://handbook.gitlab.com/handbook/engineering/testing/quarantine-process/)). Nobody closes the loop automatically: detection tools flag flakiness, and humans still do the diagnosis, the fix and the proof.

## Impact
- **Persona**: the developer on CI duty who opens a red `main` pipeline; sin contactar.
- **Pierde hoy**: the time to read a log only to learn the failure was a flaky test, and then a retry that hides it until next time.
- **La cifra**: sin medir: there is no baseline of how long a person takes. The loop itself goes from the red job to the summary note in 9 min 47 s with no human (`docs/DEMO.md` § Timeline, pipeline 2948453748).
- **Despues del evento**: run the flow on a second project's real suite, for a team that already quarantines by hand. Started during the event: [a copy of epic-stack](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/epic-stack) runs Plumb's jobs through `include: project` (U23), but no fix there has passed the proof yet.

## Safety
- **Accion irreversible**: merging into `main`, which deploys the app to Cloud Run.
- **Quien la autoriza**: `merge-gate`, only after 50 of 50 runs and only for merge requests that change nothing but e2e specs. Anything else waits for a maintainer to merge it.
- **A quien nunca se le aplica**: `update/` merge requests (app changes) and any merge request that touches app code.
- **Forzado en**: `ci/plumb.gitlab-ci.yml` job `merge-gate` (the spec-only check); `tests/unit/verdict.test.js` "a proof holds only when every test passed every run; a skipped run or one failure breaks it".

## Demo surface
- **Que ejecuta el jurado**: `PORT=8080 node src/server.js` and `python3 cases/small-booking-api/checks.py http://localhost:8080`, or opens !10 and its pipelines from the project page.
- **Que resultado nuevo sale**: 6 passed against the same app the loop deploys. The run against the live app needs the reset token, so CI runs it (`live-checks` after each deploy, `live-health` every 6 hours).
- **Que apuesta demuestra**: CI decides, Duo fixes: the merge is a 50-run proof, never the model's call.
- **Donde**: https://showcase-8b103c.gitlab.io/

## Actors
- A1. Developer — pushes code; the failing pipeline is theirs.
- A2. The flow — a Duo Agent Platform flow with its own service account; diagnoses, fixes, proves, merges or quarantines.
- A3. Maintainer — reads the summary afterwards; never needs to act for the loop to finish.

## Requirements
- R1. When a pipeline fails on an e2e test, the developer gets a verdict — flaky or real regression — decided by re-running that test N times on the same commit. [criterion: Technological Implementation]
- R2. A real regression is never touched: the flow only explains it in an issue that links the commit and the pipeline. [criterion: Design]
- R3. A proven flaky test gets its root cause classified (async wait, concurrency or load order, time or time zone, shared state or test order, animation) with the evidence: pass rate, traces and the failing step. [criterion: Innovation/Idea]
- R4. The flow proposes a fix and merges it only if N repeated runs of the fixed test pass; the language model never decides the merge. [criterion: Innovation/Idea]
- R5. When the fix cannot be proven, the test is quarantined: it keeps running without blocking the pipeline, and an issue records the evidence and an expiry date. [criterion: Design]
- R6. After a merge, the app is deployed to Google Cloud and verified live, and a summary of the whole run is posted where it started. [criterion: Google Cloud bonus]
- R7. The automation is built on GitLab Duo Agent Platform flows triggered by pipeline events, and touches plan, create, verify, release, configure, monitor and govern. [criterion: Stage One: uses GitLab Duo Agent Platform]
- R8. Every number the project shows (pass rates, runs, time saved) comes from recorded pipeline runs that anyone can reproduce. [criterion: Potential Impact]
- R9. The demo video shows the full loop on a real pipeline, from red to live in production, in under 3 minutes. [criterion: Presentation]
- R10. A small appointment-booking web app, with flakiness sources that occur naturally (time zones, concurrent bookings, async confirmation, shared test data, animated modals), is the subject under test. It also carries one natural case of each deterministic cause: a redesign commit that renames the booking button, a CI setting that changes the job's time zone, and seed data that runs out. [criterion: Technological Implementation]
- R11. A test that fails on every re-run gets its cause classified from the commit diff and the failure: regression (the app stopped doing what it did), app change (the commit intentionally changed what the test checks), environment (the commit only changed configuration the tests run under) or test data (the test relies on data it does not set up). Only a regression is handled by R2. [criterion: Innovation/Idea]
- R12. When the app changed on purpose, the flow opens an MR that updates the test to the new behaviour on an `update/` branch, and it is never merged automatically: a human confirms that the change was intended. [criterion: Design]
- R13. When the cause is the environment, the flow opens an issue labelled `environment` that names the configuration the commit changed and the failing step, and touches no code. [criterion: Potential Impact]
- R14. When the cause is test data, the flow opens an MR that makes the test create the data it needs; it is proven and merged like a flaky-test fix (R4). [criterion: Technological Implementation]
- R15. A fix that changes app code is proven like any other but waits for a human; only fixes that change nothing but e2e specs merge on their own. [criterion: Design]
- R16. A test already fixed twice is not fixed a third time: it goes to quarantine with its fix history quoted. [criterion: Innovation/Idea]
- R17. The loop watches itself: the published flow must match the repo, at most 2 tests can be quarantined, an expired quarantine turns the pipeline yellow, and the live app and project page are checked every 6 hours. [criterion: Technological Implementation]

## Key flows
- F1. **Flaky test fixed** — pipeline fails on an e2e test → the test is re-run N times on the same commit and passes sometimes → the cause is classified from traces and code → a fix is opened as an MR → N repeated runs pass → the fix is merged → the app deploys and is verified live → summary posted. (A1, A2; R1, R3, R4, R6)
- F2. **Real regression** — pipeline fails on an e2e test → the test fails on every re-run → the flow opens an issue with the evidence and stops. (A1, A2; R1, R2)
- F3. **Fix not proven** — same as F1 until the proof → the repeated runs still fail sometimes → the test moves to quarantine and an issue records the evidence and the expiry date → the pipeline is green again. (A2, A3; R1, R3, R5)
- F4. **App changed on purpose** — a commit renames the booking button → the test fails on every re-run → the flow reads the diff and the commit message, sees the rename was intended → opens an MR on `update/` that updates the test → the proof passes → the MR waits for a human. (A1, A2, A3; R1, R11, R12)
- F5. **Environment changed** — a commit only changes the CI time zone → a test fails on every re-run → the flow sees no app or test change in the diff → opens an `environment` issue naming the setting → stops. (A1, A2; R1, R11, R13)
- F6. **Test data missing** — a test assumes a slot is free but never sets it up, and the seed runs out → it fails on every re-run → the flow classifies it as test data → opens an MR where the test creates its own booking data → N repeated runs pass → merged. (A2; R1, R11, R14, R4)

## Acceptance examples
- AE1. **Covers R1, R2.** Given a commit that breaks the booking confirmation, when the pipeline fails and the test fails on all N re-runs, then the flow opens a "Real regression" issue with the run evidence and opens no MR.
- AE2. **Covers R1, R3, R4.** Given a test that clicks "Book" before the async confirmation arrives and fails about 3 times in 10, when the pipeline fails, then the flow classifies it as async wait, opens an MR that waits for the confirmation, and merges it only after N repeated runs pass.
- AE3. **Covers R5.** Given a flaky test whose proposed fix still fails at least once in N runs, when the proof ends, then the test runs in a non-blocking job and an issue holds the pass rate, the traces and an expiry date.
- AE4. **Covers R6.** Given a merged fix, when the deploy job finishes, then the public app URL serves the booking page and the summary links the pipeline, the MR and the URL.
- AE5. **Covers R11, R12.** Given a commit titled as a redesign that renames the "Book" button to "Confirm booking", when the e2e test that clicks "Book" fails on all N re-runs, then the flow classifies it as an app change, opens an MR on an `update/` branch that clicks "Confirm booking", and the MR is not merged without a human.
- AE6. **Covers R11, R13.** Given a commit that only sets `TZ` for the e2e job, when the time-zone test fails on all N re-runs, then the flow opens an issue labelled `environment` that names `TZ` and opens no MR.
- AE7. **Covers R11, R14, R4.** Given a test that books a slot it never frees and a seed with no slot left, when it fails on all N re-runs, then the flow opens an MR where the test resets or creates its own data, and it is merged only after N repeated runs pass.
- AE8. **Covers R15.** Given a proven fix that also edits the app code, when `merge-gate` runs, then the merge request is not merged and waits for a human.
- AE9. **Covers R16.** Given a test with 2 merged fixes, when it fails as flaky again, then the flow quarantines it and quotes both earlier fixes ([!13](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/13)).

## Key decisions
- Flaky tests as the problem — chosen over a pipeline-efficiency doctor, a feature-flag reaper, a cost canary and migration rehearsal because it was the only open angle in both competitor scans (about 360 projects) that also matches the author's QA background and the CI telemetry already wired in. settled: user-approved
- Fix-or-isolate, Hands-off, Path A — chosen over a supervised quarantine bot and a pre-merge flake hunter because it closes the loop from red pipeline to production. settled: user-approved
- Web app tested with Playwright, plus unit tests — chosen over an API with pytest and a mobile app because UI flakiness is the most common and visible kind, and it runs on shared runners. settled: user-approved
- Appointment booking as the app under test — chosen over a shop checkout and dogfooding the product's own dashboard because its flakiness sources occur naturally and read in seconds on video. settled: user-approved
- Evidence from verified public sources only, no internal data from the author's employer. settled: user-directed
- The booking app is only the subject under test: no language, theme or register toggles, and no polish beyond what the flakiness sources need. settled: user-directed
- Deterministic code decides the verdict and the merge; the model diagnoses and writes the fix. settled: user-approved
- A real regression is reported in an issue, not a commit comment — the flow toolset has no tool that writes a note on a commit (GitLab `tools_registry.py` only reads commit comments), and an issue keeps the action with Duo instead of a CI token. settled: user-approved (2026-10-11)
- A test that fails every time is not always a regression: the flow tells regression, intended app change, environment and test data apart from the commit diff, chosen over keeping the two-way flaky/real split because the most common false alarm after a redesign is an outdated test. An app-change MR always waits for a human, because deciding that a behaviour change was intended is judgement, not proof. settled: user-approved (2026-10-11)

## Scope boundaries
### Deferred
- Releasing a test from quarantine automatically once it is fixed by someone else.
- Predicting flakiness before a test has ever failed.
- Running across several projects or a whole group.
### Outside this product
- Test frameworks other than Playwright (Cypress, Jest, Appium) — one framework done end to end beats four done halfway, and the verdict reads Playwright's JSON report.
- Infrastructure flakiness (a runner that dies, a registry outage) — it needs a retry, not a code change, so the verdict records it and the flow touches no code. The environment cause in R13 covers only configuration a commit changes in the repo.
- A dashboard of its own — the record lives where the team already looks, in GitLab merge requests, issues and comments.
- A polished booking product — the app exists to be tested, so it skips the language, theme and register toggles.

## Assumptions
- ~~The Pipeline events trigger works in this group~~ Confirmed: it starts the flow on the red pipeline with no mention (`docs/DEMO.md`).
- ~~Flow jobs can run the Playwright browser image~~ Resolved the other way: the re-runs run in the CI job `flake-verdict`, and the flow reads its `verdict.json`.
- ~~The group's Duo credits cover development and the demo runs~~ Confirmed: every flow session in `docs/sessions/` ran on them.

## Outstanding questions
- ~~Product name (chosen by the author; the event FAQ asks not to let AI name it)~~ Resolved 2026-10-17: Plumb. The project path stays `showcase`, which the event assigns.
- ~~Opt in to Most Environmentally Impactful?~~ Resolved 2026-10-22: no. There is no SCI measurement, and building one this close to the deadline competes with the entry.
- ~~Does the booking app carry the language, theme and register toggles, or is it only a test subject?~~ Resolved 2026-10-09: test subject only, no toggles (see Key decisions).
- ~~Google Cloud account for the deploy~~ Resolved: project `showcase-flaky`, Cloud Run deployed through Workload Identity Federation.
