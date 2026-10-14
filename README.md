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
node tools/verdict.mjs report.json verdict.json                   # verdict from a --repeat-each=10 JSON report
npm run lint                                                      # syntax check (node --check)
                                                                  # type-check: none, plain JavaScript
gcloud run deploy booking --source . --region us-central1         # deploy (CI runs it on main)
SUMMARY_DRY_RUN=1 CI_COMMIT_SHA=<merge sha> node tools/summary.mjs   # print the run summary for a merge (needs CI_API_V4_URL, CI_PROJECT_ID, MERGE_BOT_TOKEN, APP_URL)
python3 cases/small-booking-api/checks.py http://localhost:8080   # contract checks against a running app
```

## Failure scenarios

Five patches in [`demo/scenarios/`](demo/scenarios/) exercise each path of the triage flow. Four make one e2e test fail on every run (three for a reason that is not a bug, one for a real regression), and `quarantine` makes one test flaky in a way the flow cannot fix:

| Scenario | What the commit does | Test that fails |
|---|---|---|
| `app-change` | renames the "Book" button to "Confirm booking" | `async confirmation` |
| `environment` | sets `TZ: America/Argentina/Buenos_Aires` for every CI job | `late slot is listed with its local date and time` |
| `test-data` | seeds a sample booking on slot s3 that the reset keeps | `a visitor books the last slot of the day` |
| `regression` | stops bookings from ever reaching "confirmed", under a commit message that does not say so | `async confirmation` |
| `quarantine` | adds an audit write between the slot check and the insert, which widens a server race to about half of the runs; no change to the test can fix it | `two visitors book the same slot at the same time` (flaky, not always failing) |

```bash
demo/scenarios/apply.sh app-change     # commits the scenario on a clean tree, then push it
```

Undo it after the run with a revert commit; main's history is never rewritten.

## Pipeline

Every merge request and every push to `main` runs the pipeline defined in [`.gitlab-ci.yml`](.gitlab-ci.yml). See [CI/CD → Pipelines](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines) for the history.

When `e2e` fails on `main`, `flake-verdict` re-runs the failed tests 10 times and writes `verdict.json`. The red pipeline starts the Duo triage flow defined in [`.gitlab/duo/triage-flow.yml`](.gitlab/duo/triage-flow.yml). If a test fails on every re-run, the flow reads the commit message and diff and picks a cause: a regression gets a "Real regression" issue, an intended app change gets an `update/` merge request labelled `needs-review`, a CI configuration change gets an `environment` issue, and missing test data gets a `fix/` merge request. Before creating anything it looks for an open issue or merge request with the same title, so a re-run never opens a duplicate. If it passes some of the time, the flow fixes the flaky test on a `fix/<pipeline>-<test>` branch and opens a merge request. In that merge request `fix-proof` runs the changed test 50 times, and `merge-gate` merges it only if all 50 pass. The flow waits for that proof. If it fails, the flow replaces the fix on the same branch with a `@quarantine` tag, which moves the test to the non-blocking `e2e-quarantine` job, and opens a `Quarantined:` issue with both pass rates and an expiry date 14 days out; the quarantine commit has nothing left to prove, so `merge-gate` merges it and `main` turns green. A merge request that adapts a test to an intended app change (`update/` branch) is proven the same way but always waits for a human.

On every green `main` pipeline, `deploy` publishes the app to Google Cloud Run (live at https://booking-vic4jyzsha-uc.a.run.app) and checks that the public URL serves the booking page. It authenticates with Workload Identity Federation, so no Google key is stored anywhere. When the commit is the merge of a flow merge request, `summary` then posts one note on the commit whose pipeline failed, linking that pipeline, the verdict, the merge request, the proof result and the live URL.

[`docs/DEMO.md`](docs/DEMO.md) records one full run of this loop, from the red job to the summary note in 9 min 47 s, with the timestamp and link of every step.

## License

[MIT](LICENSE)
