# Showcase

Entry for the [GitLab Transcend "Life After Code" hackathon](https://gitlab-transcend.devpost.com/): agents that automate the DevSecOps lifecycle after code is written, built on GitLab Duo Agent Platform.

**Status:** work in progress.

## Commands

The app under test is a small appointment-booking app: Node 24, no framework, no runtime dependencies. Its HTTP contract is [`cases/small-booking-api/SPEC.md`](cases/small-booking-api/SPEC.md). The end-to-end suite uses `@playwright/test` 1.63.0 and is meant to run in the CI image, whose time zone is UTC: `timezone.spec.ts` fails on a machine set to another zone.

```bash
npm ci                                                            # install
npm start                                                         # dev server on $PORT, default 8080
npm test                                                          # full unit suite
node --test --test-name-pattern="slot_taken" tests/unit/slots.test.js   # one unit test
docker run --rm -e CI=1 -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.63.0-noble \
  sh -c 'npm ci && npx playwright test --grep-invert @quarantine'   # e2e suite, as CI runs it
npx playwright test tests/e2e/booking.spec.ts --repeat-each=50    # one e2e test, repeated to measure its failure rate
node tools/verdict.mjs --failed e2e-report.json                   # failed tests of the last e2e run, as file:line
node tools/verdict.mjs report.json verdict.json verdict-junit.xml # verdict from a --repeat-each=10 JSON report, plus a JUnit report with one case per run
npm run lint                                                      # syntax check (node --check)
                                                                  # type-check: none, plain JavaScript
gcloud run deploy booking --source . --region us-central1         # deploy (CI runs it on main)
SUMMARY_DRY_RUN=1 CI_COMMIT_SHA=<merge sha> node tools/summary.mjs   # print the run summary for a merge (needs CI_API_V4_URL, CI_PROJECT_ID, MERGE_BOT_TOKEN, APP_URL)
python3 cases/small-booking-api/checks.py http://localhost:8080   # contract checks against a running app
node tools/results.mjs                                            # regenerate docs/RESULTS.md and docs/sessions/ from the GitLab API (uses glab's login)
MERGE_BOT_TOKEN=<token> node tools/flow-drift.mjs                 # compare .gitlab/duo/triage-flow.yml with the flow published in the AI Catalog
node tools/quarantine.mjs                                         # check quarantined tests against their issues: exit 3 if one expired or has no issue, 1 if more than QUARANTINE_MAX (2)
```

## Failure scenarios

Six patches in [`demo/scenarios/`](demo/scenarios/) exercise each path of the triage flow. Four make one e2e test fail on every run (three for a reason that is not a bug, one for a real regression), `quarantine` makes one test flaky in a way the flow cannot fix, and `order` makes one test depend on state left by the tests before it:

| Scenario | What the commit does | Test that fails |
|---|---|---|
| `app-change` | renames the "Book" button to "Confirm booking" | `async confirmation` |
| `environment` | sets `TZ: America/Argentina/Buenos_Aires` for every CI job | `late slot is listed with its local date and time` |
| `test-data` | seeds a sample booking on slot s3 that the reset keeps | `a visitor books the last slot of the day` |
| `regression` | stops bookings from ever reaching "confirmed", under a commit message that does not say so | `async confirmation` |
| `quarantine` | adds an audit write between the slot check and the insert, which widens a server race to about half of the runs; no change to the test can fix it | `two visitors book the same slot at the same time` (flaky, not always failing) |
| `order` | removes the modal test's reset, so it finds the slot an earlier test booked | `booking from the confirmation modal` (fails in the suite; alone it passes the first run, then fails every later one) |

```bash
demo/scenarios/apply.sh app-change     # commits the scenario on a clean tree, then push it
```

Undo it after the run with a revert commit; main's history is never rewritten.

## Pipeline

Every merge request and every push to `main` runs the pipeline defined in [`.gitlab-ci.yml`](.gitlab-ci.yml). See [CI/CD → Pipelines](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines) for the history.

When `e2e` fails on `main`, `flake-verdict` re-runs the failed tests 10 times and writes `verdict.json`. A test that fails all 10 is also run 3 times on the parent commit, and `verdict.json` records that result too: all passing means this commit broke it, all failing means it was already broken. Each test also gets its order: `state-leak` when it passed the first runs and failed every later one (state left by earlier runs), or `suite-only` when it passed all 10 alone although it failed in the suite; then the full suite runs 3 more times and `verdict.json` records how many passed. Before any re-run, the e2e errors are matched against a fixed list of infrastructure failures (no disk space, out of memory, DNS, browser launch, web server start, network down); a match skips the re-runs and the flow opens a `triage::infra` issue without touching code. Playwright jobs retry once on a runner system failure, a stuck job or a scheduler failure. The red pipeline starts the Duo triage flow defined in [`.gitlab/duo/triage-flow.yml`](.gitlab/duo/triage-flow.yml). If a test fails on every re-run, the flow reads the commit message and diff and picks a cause: a regression gets a "Real regression" issue, an intended app change gets an `update/` merge request labelled `needs-review`, a CI configuration change gets an `environment` issue, and missing test data gets a `fix/` merge request. Before creating anything it looks for an open issue or merge request with the same title, so a re-run never opens a duplicate. Everything the flow creates carries a scoped state label: `triage::real`, `triage::environment`, `triage::needs-review`, `triage::proving` on a fix, then `triage::merged` or `triage::quarantined` once the loop ends. If it passes some of the time, the flow fixes the flaky test (an order-dependent one is classified `shared-state`, and its merge request quotes the order line) on a `fix/<pipeline>-<test>` branch and opens a merge request. In that merge request `fix-proof` runs the changed test 50 times, and `merge-gate` merges it only if all 50 pass. The flow waits for that proof. If it fails, the flow replaces the fix on the same branch with a `@quarantine` tag, which moves the test to the non-blocking `e2e-quarantine` job, and opens a `Quarantined:` issue with both pass rates and an expiry date 14 days out; the quarantine commit has nothing left to prove, so `merge-gate` merges it and `main` turns green. On every pipeline, `quarantine-check` reads the quarantined tests and their issues: an expired or missing issue turns the pipeline yellow, and more than 2 quarantined tests fail it, which also blocks `merge-gate`. A merge request that adapts a test to an intended app change (`update/` branch) is proven the same way but always waits for a human.

Every pipeline also runs `unit` (`npm run lint` and `npm test`) and `api-checks` (`cases/small-booking-api/checks.py` against the app started in the job); `deploy` and `merge-gate` need both. After each deploy, `live-checks` runs the same contract checks against the Cloud Run URL, which resets the demo's bookings. Cloud Run is capped at one instance, because the app keeps bookings in memory.

`e2e`, `flake-verdict` and `fix-proof` publish JUnit reports, so the pipeline's Tests tab and the merge request show how many of the 10 or 50 runs passed. GitLab's SAST and Secret Detection templates scan every pipeline. On `main`, `flow-drift` fails if the flow published in the AI Catalog differs from `.gitlab/duo/triage-flow.yml`, so the flow that runs is always the one reviewed in the repo.

On every green `main` pipeline, `deploy` publishes the app to Google Cloud Run (live at https://booking-vic4jyzsha-uc.a.run.app) and checks that the public URL serves the booking page. It authenticates with Workload Identity Federation, so no Google key is stored anywhere. When the commit is the merge of a flow merge request, `summary` then posts one note on the commit whose pipeline failed, linking that pipeline, the verdict, the merge request, the proof result and the live URL.

[`docs/DEMO.md`](docs/DEMO.md) records one full run of this loop, from the red job to the summary note in 9 min 47 s, with the timestamp and link of every step.

[`docs/RESULTS.md`](docs/RESULTS.md) lists every pipeline the flow has triaged, with the verdict, the cause, what it created and the proof, plus the QA-06 cause check (12 of 12 right). It is generated from the GitLab API by `node tools/results.mjs`, which also exports each flow session's steps and final answer to [`docs/sessions/`](docs/sessions/).

The flow is public in the AI Catalog as `triage-flow`.

## See it work

Each path of the flow on a real pipeline. All links are public; every number is in [`docs/RESULTS.md`](docs/RESULTS.md), with the flow session transcripts in [`docs/sessions/`](docs/sessions/).

| Path | Pipeline | Verdict | What the flow did | Outcome |
|---|---|---|---|---|
| Flaky, fixed | [2948453748](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2948453748) | 3/10 flaky | [!10](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/10): a fixed pause becomes a waiting assertion ([session](docs/sessions/9497797.md)) | `fix-proof` 50/50, merged by `merge-gate`, deployed, summary note: 9 min 47 s with no human action ([timeline](docs/DEMO.md)) |
| Flaky, fixed, with state labels | [2953221849](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2953221849) | 6/10 flaky | [!11](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/11) labelled `triage::proving` ([session](docs/sessions/9576719.md)) | 50 runs in the MR's test widget, merged, relabelled `triage::merged` |
| Flaky, not fixable (negative control) | [2944554222](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2944554222) | 6/10 flaky | [!9](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/9) tried a fix ([session](docs/sessions/9411834.md)) | `fix-proof` passed only 33/50, so `merge-gate` never ran; the flow replaced the fix with a quarantine and opened [#9](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/issues/9) with an expiry date |
| Flaky by order | [2957810765](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2957810765) | 1/10 flaky, `state-leak` | [!12](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/12): cause `shared-state`, puts the test's reset back ([session](docs/sessions/9632136.md)) | `fix-proof` 50/50, merged by `merge-gate`, relabelled `triage::merged` |
| Real regression | [2953211821](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2953211821) | 0/10 real | [#10](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/issues/10) quotes the diff and "Parent commit: passed 3/3 runs" ([session](docs/sessions/9576573.md)) | no code touched |
| Intended app change | [2944391258](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2944391258) | 0/10 real | [!6](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/6) on `update/` updates the test to the new label | proven 50/50, never merged automatically |
| Environment | [2944325042](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2944325042) | 0/10 real | [#8](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/issues/8) names the `TZ` setting the commit added | no code touched |
| Test data | [2944438629](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2944438629) | 0/10 real | [!7](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/7) makes the test reset and use data it knows exists | proven 50/50, merged |

Every claimed number and the command behind it: [`docs/CLAIMS.md`](docs/CLAIMS.md).

## Limits

- The flow handles one test per pipeline: the first real test, or the flaky test with the fewest passes. Other failing tests are listed in the merge request, not fixed.
- The flow waits at most 8 minutes for the proof. A slower pipeline leaves the merge request open with `triage::proving`.
- A quarantine's expiry date turns the pipeline yellow once it passes, but nothing removes the tag.
- The infrastructure failures are a fixed list of error patterns. A crash that refuses connections (ECONNREFUSED) is not on it, because a broken app causes it too.
- A flaky test that happens to pass first and then fail most later runs reads as a state leak.
- The duplicate check looks only at open issues and merge requests, so a test that breaks again after its fix merged gets a new one.
- The parent-commit run compares with one commit back. A failure that started earlier shows as "already failing", without saying where it started.
- Cause classification is the language model's call (12 of 12 right in QA-06, four scenarios). The merge is not: only `merge-gate` merges, after 50 of 50.
- The app keeps bookings in memory, and the deployed demo exposes its test reset endpoint `/_test/reset`.

## License

[MIT](LICENSE)
