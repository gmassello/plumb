# Pending — GitLab Transcend "Life After Code" close

Deadline: **2026-10-27 13:00 UTC** (2026-10-27 10:00 ART). Competition:
<https://gitlab-transcend.devpost.com/> · Submission: not published yet · PR: n/a.

Stages (from the Official Rules, `docs/HACKATHON.md`): submissions until 2026-10-27 13:00 UTC, judging 2026-10-28 10:00 → 2026-11-14 17:00 UTC,
winners around 2026-11-16.

Code status in one line: unit tests (48) and API checks green; every triage path ran on a real pipeline; demo video published; no run on a second project.

---

## Surfaces

| Surface | Where | Status | Verified |
|---|---|---|---|
| Repo and CI | `gitlab-ai-hackathon/transcend-october-2026/43144947/showcase` @ `8b49ecc` | ok — `main` = `origin/main`, clean; pipeline 2961089937 success; public; MIT detected; `secret_detection` green | 2026-10-19 00:00 UTC |
| Site | https://showcase-8b103c.gitlab.io/ | ok — the HTML and its 8 assets have the same hash as `origin/main`; 29 links checked (`/-/commit/57608d9d` gives 403 to curl only, it opens in a browser) | 2026-10-19 00:00 UTC |
| Demo app | https://booking-vic4jyzsha-uc.a.run.app | ok, with a warning — 200 on `/`, `/health`, `/api/slots`; three 500s (about 10 s each) right after the 23:55 UTC redeploy, then fine | 2026-10-19 00:00 UTC |
| Monitoring | schedule 4497507, every 6 h, job `live-health` | **failing** — the app checks pass 6/6, but the project page check (`.gitlab-ci.yml:305`) failed at 12:09, 18:09 and 00:08 UTC in 0.3 s, while curl gets 200 with `<title>Plumb</title>`; last green 2026-10-18 06:08 | 2026-10-19 00:28 UTC |
| Submission | Devpost project page | **not published** — no Plumb project on https://devpost.com/gmassello | 2026-10-19 00:00 UTC |
| Gallery card | https://gitlab-transcend.devpost.com/project-gallery | n/a until the submission exists | |
| Upstream PR | n/a | n/a — Path A, no upstream | |
| Second checkout | n/a | n/a | |
| Video | https://youtu.be/ViidpLXD_PY | ok — public (oembed 200), 2:02 (121.6 s), rendered after `video/script.tsv` and `docs/RESULTS.md`; earlier cuts u_FShFO1OOQ and PaYtgcmaSj0 private; linked from `docs/submission.md` and the site | 2026-10-19 00:00 UTC |
| Deck | n/a | n/a — the rules do not ask for one | |
| Landing | https://showcase-8b103c.gitlab.io/ | same as Site | 2026-10-19 00:00 UTC |

## Billable resources

Shut down in `hackathon-retro`, once judging ends.

| Resource | Provider | How to delete | Live until |
|---|---|---|---|
| project `showcase-flaky` (Cloud Run service `booking`, us-central1) | Google Cloud | `gcloud projects delete showcase-flaky` | 2026-11-16 |

## Duplicated facts

Copies counted in `README.md`, `docs/submission.md`, `site/text.js`, `site/index.html`, `video/script.tsv`, `video/out/demo.en.srt` and `docs/JUDGING-MOCK.md`. All match their source on 2026-10-19.

| Fact | Real value | Command or record that produces it | Copies |
|---|---|---|---|
| Red to summary note | 9 min 47 s | `docs/DEMO.md:27` (pipeline 2948453748) | 9 |
| Runs a fix must pass | 50 of 50 | `grep -n "repeat-each=50" .gitlab-ci.yml` | 32 |
| Negative control | 33 of 50 | `docs/RESULTS.md:20` (pipeline 2944554222, !9) | 9 |
| Right cause of a real failure | 12/12 | `docs/RESULTS.md:52` (QA-06) | 6 |
| Video length | 2:02 | `ffprobe` on `video/out/demo.mp4`: 121.6 s | 5 |

## Known gaps

- **No run outside the demo app** — every triaged pipeline is on this repo's booking app (`docs/JUDGING-MOCK.md`, question 9). It would take running the flow on a second project.

## Don't break this when you come back

- `video/out/` and `video/*.mov` are git-ignored and hold hours of render and takes; `build-audio.sh` wipes `video/out/`.
- After a video take, book slot s1 in `tests/e2e/modal.spec.ts` again (`video/shots.md`).
- Old YouTube cuts are set to private, never deleted.
- `e2e-quarantine` fails on purpose (`allow_failure: true`): a red there is not a broken main.
- Never rewrite `main`'s history: the CI/CD history is a submission requirement.

## Out of my control

- **The demo app and the page stay up until judging ends (2026-11-14)** — alarm: the `live-health` schedule, which is itself failing (see Monitoring); fallback: the video and the page's real screenshots, which the rules accept ("judge based solely on the text description, images, and video").
- **YouTube keeps the video public** — fallback: `video/out/demo.mp4` re-uploaded to the same title.
