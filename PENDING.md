# Pending — GitLab Transcend "Life After Code" close

Deadline: **2026-10-27 13:00 UTC** (2026-10-27 10:00 ART). Competition:
<https://gitlab-transcend.devpost.com/> · Submission: not published yet · PR: n/a.

Stages (from the Official Rules, `docs/HACKATHON.md`): submissions until 2026-10-27 13:00 UTC, judging 2026-10-28 10:00 → 2026-11-14 17:00 UTC,
winners around 2026-11-16.

Code status in one line: unit tests (48) and API checks green; every triage path ran on a real pipeline; demo video published; one run on a second project (epic-stack), where the proof rejected both fixes.

---

## Surfaces

| Surface | Where | Status | Verified |
|---|---|---|---|
| Repo and CI | `gitlab-ai-hackathon/transcend-october-2026/43144947/showcase` @ `8b49ecc` | ok — `main` = `origin/main`, clean; pipeline 2961089937 success; public; MIT detected; `secret_detection` green | 2026-10-19 00:00 UTC |
| Site | https://showcase-8b103c.gitlab.io/ | ok — `index.html`, `app.js`, `text.js` and `styles.css` have the same hash as `origin/main` (e2f1023); the 5 images answer 200 | 2026-10-23 22:12 UTC |
| Demo app | https://booking-vic4jyzsha-uc.a.run.app | ok — serves "Book an appointment"; `deploy` and `live-checks` green on pipeline 2983124458, `live-health` green on schedule run 2983142614 | 2026-10-23 22:12 UTC |
| Monitoring | schedule 4497507, every 6 h, job `live-health` | ok — green on pipeline 2961165751. It had failed at 12:09, 18:09 and 00:08 UTC with exit 141: `wget | grep -q` under `pipefail` died on SIGPIPE; fixed in 4aeaecd (also in the `deploy` and `fix-proof` checks). The app checks can still time out on a Cloud Run cold start | 2026-10-19 00:42 UTC |
| Submission | Devpost project page | **not published** — no Plumb project on https://devpost.com/gmassello | 2026-10-19 00:00 UTC |
| Gallery card | https://gitlab-transcend.devpost.com/project-gallery | n/a until the submission exists | |
| Upstream PR | n/a | n/a — Path A, no upstream | |
| Second checkout | n/a | n/a | |
| Second project | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/epic-stack | ok — public, flow enabled (consumer 13034333, trigger on failed pipelines), `MERGE_BOT_TOKEN` set; !1 and !2 merged by `merge-gate`, #3 real regression; main green after the undo f6a6540 | 2026-10-23 |
| Video | https://youtu.be/ViidpLXD_PY | ok — public (oembed 200), 2:02 (121.6 s), rendered after `video/script.tsv` and `docs/RESULTS.md`; earlier cuts u_FShFO1OOQ and PaYtgcmaSj0 private; linked from `docs/submission.md` and the site; **stale since 2026-10-22: the local `video/out/demo.mp4` opens on 9 s of stock footage (`video/hook.json` shot 1), runs 2:08 (127.6 s) and is not uploaded yet; on upload, update the 2:02 in `site/text.js`, `docs/submission.md` and row "Video length"** | 2026-10-22 |
| Deck | n/a | n/a — the rules do not ask for one | |
| Landing | https://showcase-8b103c.gitlab.io/ | same as Site | 2026-10-23 22:12 UTC |

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
| Runs a fix must pass | 50 of 50 | `grep -n "repeat-each=50" ci/plumb.gitlab-ci.yml` | 32 |
| Negative control | 33 of 50 | `docs/RESULTS.md:20` (pipeline 2944554222, !9) | 9 |
| Right cause of a real failure | 12/12 | `docs/RESULTS.md:52` (QA-06) | 6 |
| Video length | 2:02 | `ffprobe` on `video/out/demo.mp4`: 121.6 s | 5 |
| Fix merges made by `merge-gate` | 11 of 11 | `docs/CLAIMS.md`, row "merged by merge-gate" (added 2026-10-22) | 3 |
| Median CI minutes per incident | 9.5 min over 11 | `docs/RESULTS.md`, line under Pipelines (added 2026-10-22) | 2 |

## Known gaps

- **Cold start after a redeploy** — on 2026-10-22 23:05 UTC `live-checks` failed on pipeline 2978742313 because `/api/slots` answered something that was not JSON right after the deploy; the next pipeline was green. `--min-instances 1` would remove it and costs money.

- **No proven fix outside the demo app** — [epic-stack](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/epic-stack) runs the flow through `include: project`. It had 3 red pipelines: two flaky tests whose fixes failed the proof (27/50, 30/50) and were quarantined, and one regression issue. The model called the seeded test-data flake an async wait. Its flow trigger stays on.

## Don't break this when you come back

- `video/out/` and `video/*.mov` are git-ignored and hold hours of render and takes; `build-audio.sh` wipes `video/out/`.
- After a video take, book slot s1 in `tests/e2e/modal.spec.ts` again (`video/shots.md`).
- Old YouTube cuts are set to private, never deleted.
- `e2e-quarantine` fails on purpose (`allow_failure: true`): a red there is not a broken main.
- Never rewrite `main`'s history: the CI/CD history is a submission requirement.

## Out of my control

- **The demo app and the page stay up until judging ends (2026-11-14)** — alarm: the `live-health` schedule (see Monitoring); fallback: the video and the page's real screenshots, which the rules accept ("judge based solely on the text description, images, and video").
- **YouTube keeps the video public** — fallback: `video/out/demo.mp4` re-uploaded to the same title.
