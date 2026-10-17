# Plumb — Architecture

**Status:** built (describes the system as implemented; Options considered and Spikes record how it was chosen) · **Date:** 2026-10-10, revised 2026-10-11 for R11–R14 and 2026-10-17 for U15

## Summary
CI jobs decide (verdict, proof, merge, deploy) and the Duo flow diagnoses and writes the change; the trade-off is that the merge needs the author's personal access token held by CI, because the flow has no tool that merges and the author's Developer role cannot create a project access token.

## Drivers
| ID | Quality attribute | Scenario (source, stimulus, environment, response) | Measure | From |
|---|---|---|---|---|
| QA-01 | Functional correctness | A developer pushes a commit that really breaks booking; the e2e job fails; the verdict re-runs the failing test | 0 "flaky" verdicts on 10 of 10 seeded real regressions (a real regression fails 10 of 10 re-runs) | R1, R2 |
| QA-02 | Functional correctness | The flow proposes a fix for a test that still fails sometimes; the proof runs the fixed test 50 times | A fix that still fails 10% of runs passes the proof with probability 0.9^50 ≈ 0.5%; at 30% failure, ≈ 2e-8 | R4, R5 |
| QA-03 | Time behaviour | A pipeline fails on an e2e test on a shared small runner | Verdict available ≤ 15 min after the failure | R1 |
| QA-04 | Time behaviour | A fix MR is merged to main | App deployed and verified live ≤ 10 min after the merge | R6 |
| QA-05 | Accountability | Any action the flow takes (comment, MR, quarantine, issue) | 100% of actions link back to the pipeline id that started them | R3, R8 |
| QA-06 | Functional correctness | A test fails on every re-run; the flow reads the commit diff and message and picks one of regression, app change, environment, test data | Right cause in ≥ 11 of 12 runs (4 seeded scenarios × 3 runs); 0 merges from `update/` branches | R11, R12, R13, R14 |

## Constraints
| # | Constraint | Source | Confirmed? |
|---|---|---|---|
| C1 | Must use GitLab Duo Agent Platform agents or flows reacting to triggers | `docs/HACKATHON.md` § Required tech | yes |
| C2 | Code is MIT-licensed and new since 2026-10-05 (Path A) | `docs/HACKATHON.md`, `LICENSE` | yes |
| C3 | Only human actions fire flow triggers; pipelines started by the flow's service account do not | GitLab Duo Agent Platform triggers documentation; a retry through the API with the author's token did fire it (S1) | assumption for the non-human half: the design does not depend on it, it only explains why `fix-proof` needs S6 |
| C4 | The flow job does not see CI/CD variables, custom or predefined; context arrives only through the trigger payload | spike S2 (`SPIKE_VISIBLE=unset CI_PROJECT_ID=unset`) | yes |
| C5 | The flow has no tool that merges or enables auto-merge; `update_merge_request` only offers labels, assignees, reviewers, title, description, squash, target branch and `state_event: close` | spike S3 (issue #3) | yes |
| C6 | Deploy target is Google Cloud for the bonus | `docs/judging.tsv` "Google Cloud bonus" | yes; project `showcase-flaky`, spike S5 |
| C7 | CI variables and secrets live on this project only, never on the parent group | `CLAUDE.md` | yes |
| C8 | Deadline 2026-10-27 13:00 UTC | `docs/HACKATHON.md` § Timeline | yes |
| C9 | The flow has no tool that writes a note on a commit; it can create issues, issue notes and MR notes | GitLab `duo_workflow_service/components/tools_registry.py` lists only `GetCommitComments` for commits | yes; a real regression is reported in an issue |

## Options considered
| | C — the boring one: CI only | A — CI decides, Duo fixes | B — the flow does everything |
|---|---|---|---|
| What it looks like | `retry: 2` plus a script that tags a failing test as quarantined | CI jobs re-run, prove, merge and deploy; the flow reads the verdict, classifies, writes the fix or the quarantine, and waits on the MR pipeline | The flow re-runs the test, proves the fix and decides the merge inside its own job |
| Scenario it favours | QA-03, QA-04 | QA-01, QA-02, QA-05 | Fewest moving parts in the demo |
| Scenario it sacrifices | R3, R4, R7: no diagnosis, no fix, no agent | One more token (the merge token) and a longer pipeline | QA-02 and R4: the model would decide the merge, and the flow job has no Playwright browsers |
| What breaks first | Fails Stage One (no Duo Agent Platform) | The merge token expires or loses its role | A prompt change silently changes the merge rule |
| Cost to operate | CI minutes only | CI minutes + one flow session per red pipeline | Flow minutes for 60 test runs per failure |
| **Cost to exit** | Low, but it is not the product | Medium: the verdict and proof jobs are plain CI and survive dropping Duo | High: the logic lives in a prompt |

A is chosen: it is the only option where a deterministic job decides the verdict and the merge (R4) and Duo still does real work (R7). C loses Stage One; B makes the model the judge. settled: user-approved

## Chosen design

### Context
```mermaid
graph TB
  dev[Developer] -->|git push HTTPS| gl[GitLab project]
  gl -->|Pipeline events: Failed| flow[Duo flow on GitLab Duo Agent Platform]
  flow -->|commits, MR, notes, issues via GitLab tools| gl
  gl -->|CI deploy job, gcloud| gcp[Google Cloud Run]
  maint[Maintainer] -->|reads MR, issue, summary note| gl
  user[Anyone] -->|HTTPS| gcp
```

### Containers
```mermaid
graph TB
  subgraph pipeline[GitLab CI pipeline]
    e2e[e2e: Playwright 1.63, blocking]
    verdict[flake-verdict: re-runs failed tests 10x, writes verdict.json]
    proof[fix-proof: changed test --repeat-each=50, fix/ and update/]
    gate[merge-gate: merges fix/ MRs only via API]
    quar[e2e-quarantine: @quarantine tests, allow_failure]
    qcheck[quarantine-check: cap of 2, issue and expiry]
    unit[unit: lint + node:test]
    api[api-checks: checks.py against the app in the job]
    live[live-checks: checks.py against the Cloud Run URL]
    drift[flow-drift: repo flow vs AI Catalog, main only]
    deploy[deploy: Cloud Run + live check]
    summary[summary: note on the failed commit, MR label]
    pages[pages: copies site/ to GitLab Pages, main only]
  end
  flow[triage-flow: Duo flow, one agent]
  app[booking-app: web app under test]
  e2e -->|on failure| verdict
  verdict -.->|pipeline failed fires trigger| flow
  flow -->|create_commit + create_merge_request| proof
  proof --> gate
  qcheck -->|more than 2 blocks| gate
  gate -->|merge to main| deploy
  deploy --> app
  deploy -->|APP_URL| summary
  deploy -->|APP_URL| live
  unit -->|blocks| gate
  api -->|blocks| gate
  unit -->|blocks| deploy
  unit -->|blocks| pages
  api -->|blocks| deploy
  e2e --> app
```

### Components
| Component | Responsibility (one sentence) | Technology | Covers |
|---|---|---|---|
| `booking-app` | Small appointment-booking web app whose features carry natural flakiness sources (time zones, concurrent bookings, async confirmation, shared test data, animated modals) and one natural case of each deterministic cause (a redesign that renames the booking button, a CI time-zone setting, seed data that runs out) | Node web app, container image | R10 |
| `e2e-suite` | Playwright tests of the booking app, each source of flakiness and each deterministic cause covered by at least one test | `@playwright/test` 1.63.0, image `mcr.microsoft.com/playwright:v1.63.0-noble` | R10 |
| `flake-verdict` | When `e2e` fails, re-runs only the failed tests 10 times on the same commit and writes `verdict.json`, then fails the pipeline so the trigger fires | CI job, `needs: [e2e]` + `when: on_failure`; reads the failed tests' `file:line` from `e2e`'s JSON report and runs them with `--repeat-each=10`. Not `--last-failed`: combined with `--repeat-each` it runs each test once (measured 2026-10-10). The spec files of `real` tests run 3 more times on the parent commit in a `git worktree`, and each `real` test gets `base: { sha, passed, runs }`. Writes a JUnit report with one case per run, because GitLab merges JUnit cases that share a name and Playwright's own reporter repeats the name. Each test gets `order` from the run sequence (`state-leak`, or `suite-only` plus `suite: { passed, runs }` from 3 full-suite runs); a fixed list of infrastructure error patterns writes `infra` instead and skips the re-runs; a spec that fails to load, with no failed test, is written as one `real` test named `<file> failed to load` | R1, R2, R3, R8 |
| `triage-flow` | Reads the verdict; on `real` reads the commit diff and message and classifies the cause: regression → a "Real regression" issue; app change → an MR on `update/` that updates the test and waits for a human; environment → an `environment` issue; test data → a fix MR on `fix/` where the test sets up its own data; on `flaky` classifies the cause, commits a fix on a new branch, opens the MR, waits on its pipeline, and on a red proof replaces the fix with a quarantine and an issue | Duo Agent Platform custom flow (YAML v1, `ambient`), tools `gitlab_api_get`, `get_repository_file`, `create_commit`, `create_merge_request`, `create_issue`, `run_command`; definition in `.gitlab/duo/triage-flow.yml`; published as AI Catalog item 1017874, and the `flow-drift` job (`tools/flow-drift.mjs`) fails main when the published definition differs from the file. Labels everything it creates with a `triage::` state. A test with `order` is `shared-state`; a `recurring` flaky test gets no third fix: the flow opens a `Quarantine recurring flaky test` MR and a `Quarantined:` issue, and quotes the history in everything it creates; before each commit it reads the test file on `main`, not at the failed commit, so changes merged meanwhile are kept; a verdict with `infra` becomes a `triage::infra` issue and no code change | R2, R3, R5, R7, R11, R12, R13, R14 |
| `fix-proof` | In the pipeline of a flow MR from `fix/` or `update/`, runs each test the MR changes 50 times; any failure or skipped run fails the job, and so does no test running unless the MR adds `@quarantine` | CI job, `--repeat-each=50`; specs from `git diff` against the MR base | R4, R8, R12, R14 |
| `merge-gate` | Last job of a `fix/` MR's pipeline (never `update/`); when the proof passed and the MR changes nothing but `tests/e2e/*.spec.ts`, asks GitLab to merge the MR once its pipeline succeeds | CI job with `MERGE_BOT_TOKEN` (the author's personal access token, scope `api` only, masked, expires 2026-11-09) | R4 |
| `quarantine` | Keeps quarantined tests running without blocking: the blocking job skips `@quarantine`, a separate job runs them with `allow_failure: true` | Playwright `--grep-invert @quarantine` / `--grep @quarantine`; the `quarantine-check` job (`tools/quarantine.mjs`) exits 3, an allowed failure, when a quarantine's issue expired or is missing, and 1 when more than 2 tests are quarantined, which blocks `merge-gate` | R5 |
| `deploy` | On a green main pipeline, deploys the app to Cloud Run, checks that the URL serves the booking page, and hands the URL to the `summary` job, which posts the run summary | CI job, `google/cloud-sdk:586.0.0-slim`, `gcloud run deploy --source`, `curl` content check; authenticates with Workload Identity Federation (GitLab `id_tokens` → pool `gitlab-pool`, restricted to this GitLab project → service account `gitlab-deploy`), so no Google key is stored anywhere | R6, R8 |
| `pages` | On every main pipeline whose `unit` job passes, publishes the project page `site/` (what Plumb does, in plain English and Spanish, with real screenshots and the numbers from `docs/CLAIMS.md`) | CI job, `alpine:3.20`, `cp -r site public`; GitLab Pages; no build step and no dependency | R6 |
| `live-health` | Only in the pipeline schedule on main, every 6 hours: runs the API contract checks against the Cloud Run URL and checks that the project page serves `<title>Plumb</title>`. Every other job except `flow-drift` and `quarantine-check` is skipped in that pipeline, so no test runs, nothing deploys and the flow finds no verdict | CI job, `node:24.14.1-alpine`, `cases/small-booking-api/checks.py`, `wget`; pipeline schedule | R7 |

R7's stages map to: plan (issues), create (fix commit), verify (verdict, proof), package (Cloud Run builds the image from the `Dockerfile` in `deploy`), secure (GitLab's SAST and Secret Detection templates on every pipeline), release (merge-gate), configure (CI and flow YAML in the repo), monitor (live check, the scheduled `live-health`, GitLab Observability traces of CI), govern (service account identity, token scope, quarantine expiry).

### Contracts
- **Trigger:** project trigger "Pipeline events → Failed" on `triage-flow`. `context:goal` is the pipeline webhook JSON (`object_attributes.id`, `ref`, `sha`, `status`, `user`, `builds[]`); `context:project_id` is the project id.
- **`verdict.json`** (artifact of `flake-verdict`, `expire_in: 30 days`):
  ```json
  {"pipeline_id": 0, "sha": "", "runs": 10,
   "tests": [{"file": "tests/e2e/booking.spec.ts", "title": "", "passed": 7, "failed": 3,
              "verdict": "flaky", "trace": "test-results/.../trace.zip",
              "error": "Expected: \"Booking confirmed\" Received: \"Booking pending\"",
              "error_at": "tests/e2e/booking.spec.ts:13"}]}
  ```
  Optional fields, added by `tools/verdict.mjs`:
  - `order` on a test: `"state-leak"` when it passed the first runs, failed every later one and failed more than it passed, `"suite-only"` when it passed every re-run, otherwise `null`.
  - `suite` on a `suite-only` test: `{ "passed", "runs" }` from 3 full-suite runs.
  - `base` on a `real` test: `{ "sha", "passed", "runs" }` from 3 runs on the parent commit, or `null` when the parent does not have the test.
  - `infra` on the verdict: `{ "pattern", "message" }` when an e2e error matches a known infrastructure failure. Then `runs` is 0 and `tests` is empty, because nothing was re-run.
  - `history` on a test, added by `tools/history.mjs`: `{ "fixes", "updates", "quarantines", "regressions", "environment", "recurring" }`. Each list holds `!iid` or `#iid` of this project's merged merge requests and issues whose title names the test with the flow's prefix; `recurring` is `true` at `RECURRING_FIXES` (2) merged fixes. A fix MR whose pipeline id also titles a `Quarantined:` issue ended as a quarantine and is left out of `fixes`. Missing when the GitLab API could not be read.

  `runs` is the number of runs asked for; a test's own run count is `passed + failed`, because skipped and interrupted runs are not counted. `verdict` is `real` when `passed == 0` and `flaky` otherwise. A test that passes all `runs` re-runs is still `flaky`, because it already failed in `e2e`. `error` is the first failure message without ANSI codes, cut to 500 characters, and `error_at` is its `file:line`: the flow classifies from them because `gitlab_api_get` cannot read a job log, which is plain text and comes back empty (U4 run, MR !3). Read by the flow with `gitlab_api_get projects/:id/jobs/:job_id/artifacts/verdict.json` (spike S7).
- **`proof.json`** (artifact of `fix-proof`, `expire_in: 30 days`): the same shape as `verdict.json`, built by `tools/verdict.mjs` with `runs: 50`; readers use `passed` and `failed` and ignore `verdict`. It is missing when every changed test is tagged `@quarantine`, because then no test runs.
- **`e2e` on `fix/` and `update/` MRs** has `allow_failure: true`: the flakiness of other tests must not hold back a proven fix; there the gate is `fix-proof`. On `main` and other MRs `e2e` blocks.
- **Real regression issue:** title `Real regression: <title> (pipeline <id>)`, label `regression`, with the commit, `passed 0/<runs>` per real test, the pipeline URL, the verdict job id and the trace path; no branch or MR.
- **Flow branch:** `fix/<pipeline_id>-<test-slug>`; MR title `Fix flaky test: <title> (pipeline <id>)`; MR description starts with the cause class (`async-wait`, `concurrency`, `time-zone`, `shared-state`, `animation`, or `test-data` for R14) and the pass rate.
- **Commit evidence for `real`:** the flow reads `gitlab_api_get projects/:id/repository/commits/:sha` (message) and `.../commits/:sha/diff` (changed files and hunks). Rules of thumb in the prompt: the diff changes what the test asserts and the message says it on purpose → app change; only CI, config or dependency files changed → environment; the test reads data it never creates and the seed or a shared record changed → test data; otherwise regression.
- **App change MR:** branch `update/<pipeline_id>-<test-slug>`, title `Update test after app change: <title> (pipeline <id>)`, label `needs-review`; description quotes the commit message and the changed lines. `fix-proof` runs, `merge-gate` does not: a human merges or closes it.
- **Environment issue:** title `Environment change broke: <title> (pipeline <id>)`, label `environment`, naming the configuration file and setting the commit changed and the failing step; no branch or MR.
- **Quarantine:** the flow polls its MR every 30 s (16 checks); on a red proof it commits the original test as it is on `main` with the tag `@quarantine` appended to the title on the same branch; the issue title is `Quarantined: <title>` with labels `flaky`, `quarantine`, the pass rates of verdict and proof, the trace links and `Expires: <date + 14 days>`, the date taken from the pipeline's `created_at` in the payload. Flaky fix MRs carry the label `flaky` from creation, so an MR left open by a poll that ran out of time is marked.
- **Merge:** `merge-gate` calls `PUT /projects/:id/merge_requests/:iid/merge?auto_merge=true` with `MERGE_BOT_TOKEN`, only when `$CI_MERGE_REQUEST_SOURCE_BRANCH_NAME =~ /^fix\//`, so an `update/` MR can never merge itself. The merge is recorded as the author's, so the main pipeline that follows counts as human-started.
- **No verdict, no action:** the flow stops without acting when the failed pipeline has no `flake-verdict` job (a red main pipeline after a merge, a red deploy).
- **Summary:** the `summary` job (`tools/summary.mjs`, `node:24.14.1-alpine`) finds the merged `fix/` or `update/` MR of the main commit, takes the pipeline id from its branch name, and posts one note on that pipeline's commit with `MERGE_BOT_TOKEN` (the job token cannot comment on commits). The note has the verdict, the MR, the proof result (or "quarantined" when the MR's last pipeline has no `proof.json`) and the live URL. It then labels the MR `triage::merged`, or `triage::quarantined`. A main commit that is not a flow merge gets no note.

### Data
Nothing persistent of its own. Evidence lives in GitLab: CI artifacts (`verdict.json`, Playwright traces, 30 days), MRs, issues and notes. The booking app keeps its bookings in memory; a restart resets them.

## Failure modes
| What fails | What happens | How it is detected | How it recovers |
|---|---|---|---|
| The model returns nothing (`finish_reason: content_filter`) | The flow session shows "Finished" with no action | No MR or note for a failed pipeline after 15 min; the GraphQL `duoWorkflowEvents` checkpoint shows 0 output tokens | A human retries the failed job, which fires the trigger again |
| `fix-proof` fails | The flow, still polling the MR pipeline, commits the quarantine on the same branch and opens the issue | `head_pipeline.status == failed` and the pipeline's `fix-proof` job failed, read by `gitlab_api_get` | The new pipeline skips the proof (the diff adds `@quarantine`) and `merge-gate` merges it |
| `fix-proof` passes but another job fails (`merge-gate`, `unit`, `api-checks`, `quarantine-check`) | The flow does not quarantine; it ends with the MR open and names the failed jobs | The MR pipeline's job list | A human fixes the job or merges |
| The flow times out while polling (timeout 900 s) | The MR stays open, red or green, with no merge | MR open > 30 min with label `flaky` | A human merges or closes; documented as a known limit |
| `MERGE_BOT_TOKEN` expired, revoked or with extra scopes | `merge-gate` fails (401 expired; 403 `insufficient_scope` was seen with a token that also carried `ai_workflows` and `mcp`) and the MR stays open | Red `merge-gate` job | Replace it with an `api`-only token in the project variables |
| Workload Identity Federation rejects the token (wrong audience, project id or pool) | `deploy` fails at `gcloud auth login` | Red `deploy` job | Check the `id_tokens` audience against the provider name |
| Cloud Run deploy or live check fails | Main pipeline red after the merge; it counts as human-started (the merge is the author's), so the flow starts, finds no `flake-verdict` job and stops | Red `deploy` job | Re-run the job by hand |
| A real regression is classified flaky | Prevented by construction: `flaky` needs at least one pass in 10 re-runs | QA-01 run on seeded regressions | — |
| A regression is classified as an app change | The flow opens an `update/` MR that would make the test accept the bug | QA-06 runs; the reviewer sees the commit message and changed lines quoted in the MR | Never merged automatically (`merge-gate` skips `update/`); the reviewer closes it and reverts the commit |
| A retried old pipeline runs after its fix MR merged | The duplicate check looks only at open issues and MRs, so the flow opens a second MR for the same test | Seen once in QA-06 (!8 after !7 merged) | Closed by hand; a new pipeline on `main` already includes the fix, so it only happens when an old pipeline is retried |
| A regression or environment change is classified as test data | A `fix/` MR changes how the test sets up data; the proof may pass and it merges | QA-06 runs; the MR description names `test-data` and the data it creates | The next red pipeline shows the regression again; documented as the residual risk of R14 |
| The commit diff cannot be read | The flow cannot classify a `real` failure | S8 | Falls back to a "Real regression" issue that says the diff was unavailable |
| An infrastructure failure on the pattern list (disk, memory, temporary DNS failure, network) | `flake-verdict` writes `infra` and re-runs nothing; the flow opens a `triage::infra` issue and changes no code | `verdict.json` has `infra` | Fix or retry the runner by hand; the issue suggests adding the failure to `retry:when` |
| A spec fails to load (syntax error, broken import), so the report has `errors` and no failed test | `flake-verdict` writes one `real` test `<file> failed to load` and re-runs nothing; the flow classifies its cause from the commit like any real failure | `verdict.json` has that test | Fix the spec or the import |
| An infrastructure failure off the list (for example `ECONNREFUSED`, a web server that does not start or a browser that does not launch, which a commit can also cause) | The failed tests are re-run and judged `real` or `flaky` like any other | Not detected | Documented in README § Limits |
| A flaky test that happens to pass first and then fail most later runs | Marked `state-leak`, so the flow classifies it `shared-state` and adds a reset | The MR quotes the order line | `fix-proof` still has to pass 50/50; otherwise it is quarantined |

## Spikes
| ID | Assumption | Experiment | Success criterion | Result | Plan B |
|---|---|---|---|---|---|
| S1 | "Pipeline events → Failed" starts a custom flow in this group | flow `spike-hello` with that trigger; branch `spike/platform` with a job that runs `exit 1` | flow session created ≤ 5 min | passed: the flow pipeline starts about 3 s after the failure and its job takes 37–40 s | trigger by mention on the MR |
| S2 | What the flow job can see | `run_command` prints named variables; `curl` to gitlab.com | variables and network recorded | passed with a finding: CI variables are not visible (C4); network goes out through a proxy on `localhost:3128` and reaches gitlab.com | pass context through the payload (adopted) |
| S3 | The flow can leave its MR with auto-merge | flow opens MR !1 and calls `update_merge_request` | MR shows merge when pipeline succeeds | failed: the tool has no auto-merge option (C5); the MR itself was created and its pipeline ran | `merge-gate` CI job with a project access token (adopted; see S3b) |
| S3b | A CI job in the flow's MR pipeline can merge it with a token | `merge-gate` job on MR !2 (branch `fix/s3b-…`, opened by the flow) with `MERGE_BOT_TOKEN` | MR merged by the job | passed: the variable reaches pipelines started by the flow's service account; HTTP 200 and MR merged once its pipeline succeeded. A first token with `ai_workflows` and `mcp` scopes got 403 `insufficient_scope`; an `api`-only one works | the flow comments "proof passed" and a human merges |
| S4 | `--repeat-each=50` fits a small shared runner | job with the Playwright image and one test | ≤ 10 min | passed: 50 runs in 37 s; job 88 s in total | lower N using the QA-02 numbers |
| S5 | CI can deploy to Cloud Run | `spike-deploy` job: GitLab OIDC token → Workload Identity Federation → `gcloud run deploy --source` of a one-page container, then `curl` | URL serves the page | passed: `gcloud run deploy` took 44 s on the first deploy (job 89 s) and the URL served the page; no service account key was created | deploy elsewhere and lose the bonus |
| S6 | Someone reacts to a red proof without a human trigger | flow polls its MR with `run_command "sleep 30"` + `gitlab_api_get` | flow reads the final pipeline status | passed: one 30 s poll read the MR pipeline status both green (`success`, S3 run) and red (`failed`, S7 run) | run the 50 repetitions inside a CI job the flow cannot see (no reaction) |
| S7 | The flow can read `verdict.json` from the failed pipeline's job artifacts | `gitlab_api_get` on the artifact path | JSON parsed in the flow | passed: `gitlab_api_get projects/:id/jobs/:job_id/artifacts/verdict.json` returned the JSON; the job id came from the trigger payload with no extra call | `flake-verdict` prints the JSON as the last log line and the flow reads the job trace |
| S8 | The flow can read a commit's message and diff | `gitlab_api_get projects/:id/repository/commits/:sha/diff` in the first R11 run | JSON with `new_path` and `diff` per file | passed 2026-10-13: in every U12 run the flow read `commits/:sha/diff` and quoted the changed lines (`b.confirmed`, `TZ`, the button label, `SEED_BOOKINGS`) | the read-only `get_commit_diff` tool from the GitLab tool registry |

## Decisions
- [ADR-0001](adr/0001-ci-decides-duo-fixes.md) — CI jobs decide verdict, proof and merge; the Duo flow diagnoses and writes the change.

## Out of this design
- R9 (demo video under 3 min) is presentation work, covered by the record-video step, not by a component.
- Releasing a test from quarantine automatically, prediction of flakiness, multi-project runs: deferred in the BRIEF.
- Repairing infrastructure: `flake-verdict` recognises a fixed list of infrastructure error patterns and the flow reports a match in a `triage::infra` issue, but nothing retries or fixes the runner beyond the Playwright jobs' single `retry` on runner, stuck and scheduler failures. The environment cause (R13) covers only configuration a commit changes in the repo.
