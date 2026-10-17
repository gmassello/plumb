# Stack

What the project runs on, and the file that pins each version. Change the version there, not here.

## Application

| Piece | Version | Pinned in |
|---|---|---|
| Node.js | 24.14.1 (Alpine image); `engines` asks for `>=24` | `Dockerfile`, `.gitlab-ci.yml`, `package.json` |
| Runtime dependencies | none: `node:http`, `node:fs`, `node:crypto` and `Intl` only | `package.json` |
| Unit tests | `node:test`, built in | `package.json` script `test` |
| Lint | `node --check` on every JavaScript file; no ESLint, no type-check | `package.json` script `lint` |
| Container | `node:24.14.1-alpine`, runs as `node`; the image holds only `package.json` and `src/` | `Dockerfile`, `.dockerignore` |

## Tests and checks

| Piece | Version | Pinned in |
|---|---|---|
| `@playwright/test` | 1.63.0, the only dependency (dev) | `package.json`, `package-lock.json` |
| Browser image | `mcr.microsoft.com/playwright:v1.63.0-noble`, Chromium only, time zone UTC | `.gitlab-ci.yml`, `playwright.config.ts` |
| HTTP contract checks | Python 3, standard library only | `cases/small-booking-api/checks.py` |

## CI and delivery

| Piece | Version or value | Pinned in |
|---|---|---|
| CI | GitLab CI on gitlab.com shared runners | `.gitlab-ci.yml` |
| Security scans | GitLab templates `Jobs/SAST` and `Jobs/Secret-Detection` | `.gitlab-ci.yml` `include:` |
| Other job images | `alpine:3.20` (`baseline`), `curlimages/curl:8.10.1` (`merge-gate`), `google/cloud-sdk:586.0.0-slim` (`deploy`) | `.gitlab-ci.yml` |
| Hosting | Google Cloud Run, service `booking`, project `showcase-flaky`, region `us-central1` | `.gitlab-ci.yml` job `deploy` |
| Cloud auth | Workload Identity Federation: GitLab `id_tokens` → pool `gitlab-pool`, provider `gitlab-com` → service account `gitlab-deploy`; no key file | `deploy/gcp-wif.json`, `.gitlab-ci.yml` |
| CI variables | `MERGE_BOT_TOKEN` (masked, scope `api`), `GITLAB_OBSERVABILITY_EXPORT`; project level only | GitLab project settings |

## Agent

| Piece | Value | Pinned in |
|---|---|---|
| Platform | GitLab Duo Agent Platform, custom flow (YAML `v1`, environment `ambient`, one agent, timeout 900 s) | `.gitlab/duo/triage-flow.yml` |
| Trigger | Pipeline events → Failed | project trigger settings in GitLab |
| Published copy | AI Catalog item 1017874; `flow-drift` fails `main` when it differs from the repo file | `tools/flow-drift.mjs` |
| Model | the one GitLab Duo selects; the repo holds no model key and calls no model directly | — |
