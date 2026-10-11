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
gcloud run deploy booking --source . --region us-central1         # deploy (wired into CI in U7)
python3 cases/small-booking-api/checks.py http://localhost:8080   # contract checks against a running app
```

## Pipeline

Every merge request and every push to `main` runs the pipeline defined in [`.gitlab-ci.yml`](.gitlab-ci.yml). See [CI/CD → Pipelines](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines) for the history.

## License

[MIT](LICENSE)
