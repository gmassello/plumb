# Showcase

Entry for the [GitLab Transcend "Life After Code" hackathon](https://gitlab-transcend.devpost.com/): agents that automate the DevSecOps lifecycle after code is written, built on GitLab Duo Agent Platform.

**Status:** work in progress.

## Commands

The app under test is a small appointment-booking app: Node 24, no framework, no dependencies. Its HTTP contract is [`cases/small-booking-api/SPEC.md`](cases/small-booking-api/SPEC.md).

```bash
npm install                                                       # install (no dependencies yet)
npm start                                                         # dev server on $PORT, default 8080
npm test                                                          # full unit suite
node --test --test-name-pattern="slot_taken" tests/unit/slots.test.js   # one test
npm run lint                                                      # syntax check (node --check)
                                                                  # type-check: none, plain JavaScript
gcloud run deploy booking --source . --region us-central1         # deploy (wired into CI in U7)
python3 cases/small-booking-api/checks.py http://localhost:8080   # contract checks against a running app
```

## Pipeline

Every merge request and every push to `main` runs the pipeline defined in [`.gitlab-ci.yml`](.gitlab-ci.yml). See [CI/CD → Pipelines](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines) for the history.

## License

[MIT](LICENSE)
