# Project: Showcase — GitLab Transcend "Life After Code" hackathon

## Hard constraints (the submission is disqualified otherwise)
- Everything in this repo is MIT-licensed. Only add dependencies with OSI-approved licenses compatible with MIT.
- The project must genuinely use GitLab Duo Agent Platform (custom agents, flows, skills or MCP). Chat alone does not qualify: agents/flows must react to triggers and take actions.
- Path A: all code is new, created on or after 2026-10-05.
- All docs, comments, commit messages and UI text in English.
- CI/CD pipeline history must stay visible: never rewrite main's history.
- Never commit secrets. Use CI/CD variables on this project only, never on the parent group.

## Event context
- `docs/HACKATHON.md` holds the event brief (dates, prizes, judging criteria, submission requirements); `docs/judging.tsv` lists the criteria.
- `docs/NOTES.md` holds personal status, setup, competition and strategy. It is git-ignored and must never be committed.

## Layout (create each folder when first needed)
- `.gitlab-ci.yml` — pipeline
- `.gitlab/duo/` — agent and flow definitions (YAML)
- `skills/<name>/SKILL.md` — project-level Duo skills (name + description frontmatter required)
- `src/` — application code
- `tests/` — tests

## Gate
Run before calling a task done. The commands live in the README's `## Commands`:
```bash
npm run lint && npm test
PORT=8080 node src/server.js & python3 cases/small-booking-api/checks.py http://localhost:8080   # 6 passed
docker run --rm -e CI=1 -v "$PWD":/w -w /w mcr.microsoft.com/playwright:v1.63.0-noble sh -c 'npm ci && npx playwright test --list'   # 5 tests
```
The e2e suite is flaky on purpose. Its gate is that every spec loads and the five are listed, not that a run is green. Run it in the CI image, not on the laptop: the laptop's time zone breaks `timezone.spec.ts`. To change a pause or a delay, re-measure with `--repeat-each=50` and update the rates in `docs/PLAN.md` U2.
`npm run lint` is `node --check` on every JavaScript file. There is no ESLint, because the app has no runtime dependencies. Run a single test with `node --test --test-name-pattern="<name>" tests/unit/slots.test.js`. `node --test tests/unit` fails, because it does not walk a directory.

## Tooling
- Use `glab` for MRs, pipelines and CI logs (`glab mr create --fill`, `glab ci status`, `glab ci trace <job>`).
- GitLab MCP server is available as `GitLab`; Observability MCP as `gitlab-o11y`.
- Push scaffolding straight to main; use feature branches and MRs when exercising Duo flows (they trigger on MR events). Never force-push main.

## Deadline
- Submission closes 2026-10-27 10:00 ART (13:00 UTC). Video < 3 min.

@~/Documents/dotfiles/projects/hackathon/CLAUDE.md
