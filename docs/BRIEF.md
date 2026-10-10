# <Product> — Brief

## Summary
A GitLab Duo flow that wakes up when a pipeline fails on an end-to-end test, proves whether the test is flaky by re-running it, fixes the root cause and merges the fix only when the fix is proven stable. When it cannot prove a fix, it quarantines the test with the evidence so it stops blocking the team. Either way, the change reaches production with no human in the middle.

## Problem frame
Most red pipelines are not broken code. At Google, "about 84% of the transitions we observe from pass to fail involve a flaky test" ([Google Testing Blog, 2016](https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html)). At Atlassian, flaky failures in the Jira backend repo force reruns that "waste over 150,000 hours of developer time each year" ([Atlassian Engineering, 2025](https://www.atlassian.com/blog/atlassian-engineering/taming-test-flakiness-how-we-built-a-scalable-tool-to-detect-and-manage-flaky-tests)). It is a weekly problem for most teams: "40% deal with flaky tests at least weekly" ([Eck et al., FSE 2019](https://arxiv.org/abs/1907.01466)).

UI tests are the worst case, and their causes are known: async wait alone explains 45% of UI-based flaky tests ([Romano et al., ICSE 2021](https://arxiv.org/abs/2103.02669)), followed by environment, test-runner misuse and test logic such as load order and test order dependency.

Today the workaround is manual: someone notices the red pipeline, re-runs it, guesses whether it is the test or the code, and either fixes the test or quarantines it by hand. GitLab itself documents a manual quarantine process with a 3-day fast quarantine and a 3-month long-term limit ([GitLab Handbook](https://handbook.gitlab.com/handbook/engineering/testing/quarantine-process/)). Nobody closes the loop automatically: detection tools flag flakiness, and humans still do the diagnosis, the fix and the proof.

## Actors
- A1. Developer — pushes code; the failing pipeline is theirs.
- A2. The flow — a Duo Agent Platform flow with its own service account; diagnoses, fixes, proves, merges or quarantines.
- A3. Maintainer — reads the summary afterwards; never needs to act for the loop to finish.

## Requirements
- R1. When a pipeline fails on an e2e test, the developer gets a verdict — flaky or real regression — decided by re-running that test N times on the same commit. [criterion: Technological Implementation]
- R2. A real regression is never touched: the flow only explains it in a comment on the pipeline's MR or commit. [criterion: Design]
- R3. A proven flaky test gets its root cause classified (async wait, concurrency or load order, time or time zone, shared state or test order, animation) with the evidence: pass rate, traces and the failing step. [criterion: Innovation/Idea]
- R4. The flow proposes a fix and merges it only if N repeated runs of the fixed test pass; the language model never decides the merge. [criterion: Innovation/Idea]
- R5. When the fix cannot be proven, the test is quarantined: it keeps running without blocking the pipeline, and an issue records the evidence and an expiry date. [criterion: Design]
- R6. After a merge, the app is deployed to Google Cloud and verified live, and a summary of the whole run is posted where it started. [criterion: Google Cloud bonus]
- R7. The automation is built on GitLab Duo Agent Platform flows triggered by pipeline events, and touches plan, create, verify, release, configure, monitor and govern. [criterion: Stage One: uses GitLab Duo Agent Platform]
- R8. Every number the project shows (pass rates, runs, time saved) comes from recorded pipeline runs that anyone can reproduce. [criterion: Potential Impact]
- R9. The demo video shows the full loop on a real pipeline, from red to live in production, in under 3 minutes. [criterion: Presentation]
- R10. A small appointment-booking web app, with flakiness sources that occur naturally (time zones, concurrent bookings, async confirmation, shared test data, animated modals), is the subject under test. [criterion: Technological Implementation]

## Key flows
- F1. **Flaky test fixed** — pipeline fails on an e2e test → the test is re-run N times on the same commit and passes sometimes → the cause is classified from traces and code → a fix is opened as an MR → N repeated runs pass → the fix is merged → the app deploys and is verified live → summary posted. (A1, A2; R1, R3, R4, R6)
- F2. **Real regression** — pipeline fails on an e2e test → the test fails on every re-run → the flow comments with the evidence and stops. (A1, A2; R1, R2)
- F3. **Fix not proven** — same as F1 until the proof → the repeated runs still fail sometimes → the test moves to quarantine and an issue records the evidence and the expiry date → the pipeline is green again. (A2, A3; R1, R3, R5)

## Acceptance examples
- AE1. **Covers R1, R2.** Given a commit that breaks the booking confirmation, when the pipeline fails and the test fails on all N re-runs, then the flow posts a "real regression" comment with the run evidence and opens no MR.
- AE2. **Covers R1, R3, R4.** Given a test that clicks "Book" before the async confirmation arrives and fails about 3 times in 10, when the pipeline fails, then the flow classifies it as async wait, opens an MR that waits for the confirmation, and merges it only after N repeated runs pass.
- AE3. **Covers R5.** Given a flaky test whose proposed fix still fails at least once in N runs, when the proof ends, then the test runs in a non-blocking job and an issue holds the pass rate, the traces and an expiry date.
- AE4. **Covers R6.** Given a merged fix, when the deploy job finishes, then the public app URL serves the booking page and the summary links the pipeline, the MR and the URL.

## Key decisions
- Flaky tests as the problem — chosen over a pipeline-efficiency doctor, a feature-flag reaper, a cost canary and migration rehearsal because it was the only open angle in both competitor scans (about 360 projects) that also matches the author's QA background and the CI telemetry already wired in. settled: user-approved
- Fix-or-isolate, Hands-off, Path A — chosen over a supervised quarantine bot and a pre-merge flake hunter because it closes the loop from red pipeline to production. settled: user-approved
- Web app tested with Playwright, plus unit tests — chosen over an API with pytest and a mobile app because UI flakiness is the most common and visible kind, and it runs on shared runners. settled: user-approved
- Appointment booking as the app under test — chosen over a shop checkout and dogfooding the product's own dashboard because its flakiness sources occur naturally and read in seconds on video. settled: user-approved
- Evidence from verified public sources only, no internal data from the author's employer. settled: user-directed
- The booking app is only the subject under test: no language, theme or register toggles, and no polish beyond what the flakiness sources need. settled: user-directed
- Deterministic code decides the verdict and the merge; the model diagnoses and writes the fix. settled: user-approved

## Scope boundaries
### Deferred
- Releasing a test from quarantine automatically once it is fixed by someone else.
- Predicting flakiness before a test has ever failed.
- Running across several projects or a whole group.
### Outside this product
- Test frameworks other than Playwright (Cypress, Jest, Appium).
- Infrastructure flakiness (a runner that dies, a registry outage).
- A dashboard of its own: the record lives in GitLab merge requests, issues and comments.
- A polished booking product: the app exists to be tested, so it skips the language, theme and register toggles.

## Assumptions
- The Pipeline events trigger works in this group (its documentation is inconsistent). If it does not, a mention on the failed pipeline's MR starts the same flow, and the demo loses the "no human" moment.
- Flow jobs can run the Playwright browser image. If not, the re-runs happen in a normal CI job the flow starts and reads.
- The group's Duo credits cover development and the demo runs.

## Outstanding questions
- Product name (chosen by the author; the event FAQ asks not to let AI name it) — blocks: none | resolve before planning: no
- Opt in to Most Environmentally Impactful? — blocks: R8 | resolve before planning: no
- ~~Does the booking app carry the language, theme and register toggles, or is it only a test subject?~~ Resolved 2026-10-09: test subject only, no toggles (see Key decisions).
- Google Cloud account for the deploy — blocks: R6 | resolve before planning: no
