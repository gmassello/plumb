# Pending — GitLab Transcend "Life After Code" close

Deadline: **2026-10-27 13:00 UTC** (2026-10-27 10:00 ART). Competition:
<https://gitlab-transcend.devpost.com/> · Submission: <https://devpost.com/software/plumb-t69qx1> · PR: n/a.

Stages (from the Official Rules, `docs/HACKATHON.md`): submissions until 2026-10-27 13:00 UTC, judging 2026-10-28 10:00 → 2026-11-14 17:00 UTC,
winners around 2026-11-16.

Code status in one line: unit tests (48) and API checks green; every triage path ran on a real pipeline; demo video published; one run on a second project (epic-stack), where the proof rejected both fixes.

---

## Surfaces

| Surface | Where | Status | Verified |
|---|---|---|---|
| Repo and CI | `gitlab-ai-hackathon/transcend-october-2026/43144947/showcase` @ `c31b3de` | ok — `main` = `origin/main`, clean (only untracked local plan files); push pipeline 2983439213 success; 11 `fix/` MRs merged; public; MIT | 2026-10-24 00:10 UTC |
| Site | https://showcase-8b103c.gitlab.io/ | ok — `index.html`, `app.js`, `text.js` and `styles.css` match `origin/main` (c31b3de, no-cache); every link answers 200 except the two font `preconnect` hosts (404 at the root, expected); stat card 3/3 and the epic-stack link live | 2026-10-24 00:10 UTC |
| Demo app | https://booking-vic4jyzsha-uc.a.run.app | down by design — project `showcase-flaky` deleted after the winners were announced; the README, `docs/submission.md` and `site/index.html` still link it | 2026-11-18 UTC |
| Monitoring | schedule 4497507, every 6 h, job `live-health` | ok — green on schedule pipeline 2983441390 | 2026-10-24 00:10 UTC |
| Submission | https://devpost.com/software/plumb-t69qx1 | ok — submitted to Life After Code; public page shows the tagline, video I6_9prWib8Q, 6 gallery images, 7 tags and the 4 Try it out links (anonymous curl) | 2026-10-24 00:40 UTC |
| Gallery card | https://gitlab-transcend.devpost.com/project-gallery | not published yet — Devpost shows no cards at all (0 `gallery-item`) while submissions are open; check the card's thumbnail and tagline after 2026-10-27 13:00 UTC | 2026-10-24 UTC |
| Upstream PR | n/a | n/a — Path A, no upstream | |
| Second checkout | n/a | n/a | |
| Second project | https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/epic-stack | ok — public, flow enabled (consumer 13034333, trigger on failed pipelines), `MERGE_BOT_TOKEN` set; !1 and !2 merged by `merge-gate`, #3 real regression; main green after the undo f6a6540 | 2026-10-23 |
| Video | https://youtu.be/I6_9prWib8Q | ok — public (oembed 200), 2:23 (143.4 s): cold open with the red-pipeline overlay, the epic-stack beat after "human", rendered after `video/script.tsv`; earlier cuts ViidpLXD_PY, u_FShFO1OOQ and PaYtgcmaSj0 private (oembed 403); linked from `docs/submission.md`, the README and the site | 2026-10-24 00:10 UTC |
| Deck | n/a | n/a — the rules do not ask for one | |
| Landing | https://showcase-8b103c.gitlab.io/ | same as Site | 2026-10-24 00:10 UTC |

## Billable resources

Shut down in `hackathon-retro`, once judging ends.

| Resource | Provider | How to delete | Live until |
|---|---|---|---|
| project `showcase-flaky` (Cloud Run service `booking`, us-central1) | Google Cloud | `gcloud projects delete showcase-flaky` | deleted 2026-11-18 (`DELETE_REQUESTED`; restorable with `gcloud projects undelete` for 30 days) |

## Duplicated facts

Copies counted in `README.md`, `docs/submission.md`, `site/text.js`, `site/index.html`, `video/script.tsv`, `video/out/demo.en.srt` and `docs/JUDGING-MOCK.md`. All match their source on 2026-10-19.

| Fact | Real value | Command or record that produces it | Copies |
|---|---|---|---|
| Red to summary note | 9 min 47 s | `docs/DEMO.md:27` (pipeline 2948453748) | 9 |
| Runs a fix must pass | 50 of 50 | `grep -n "repeat-each=50" ci/plumb.gitlab-ci.yml` | 32 |
| Negative control | 33 of 50 | `docs/RESULTS.md:20` (pipeline 2944554222, !9) | 9 |
| Right cause of a real failure | 12/12 | `docs/RESULTS.md:52` (QA-06) | 6 |
| Video length | 2:23 | `ffprobe` on `video/out/demo.mp4`: 143.4 s | 5 |
| Fix merges made by `merge-gate` | 11 of 11 | `docs/CLAIMS.md`, row "merged by merge-gate" (added 2026-10-22) | 3 |
| Median CI minutes per incident | 9.5 min over 11 | `docs/RESULTS.md`, line under Pipelines (added 2026-10-22) | 2 |

## Known gaps

- **Cold start after a redeploy** — on 2026-10-22 23:05 UTC `live-checks` failed on pipeline 2978742313 because `/api/slots` answered something that was not JSON right after the deploy; the next pipeline was green. `--min-instances 1` would remove it and costs money.

- **No proven fix outside the demo app** — [epic-stack](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/epic-stack) runs the flow through `include: project`. It had 3 red pipelines: two flaky tests whose fixes failed the proof (27/50, 30/50) and were quarantined, and one regression issue. The model called the seeded test-data flake an async wait. Its flow trigger stays on.

## Don't break this when you come back

- `video/out/` and `video/*.mov` are git-ignored and hold hours of render and takes; `build-audio.sh` wipes `video/out/`.
- After a video take, book slot s1 in `tests/e2e/modal.spec.ts` again (`video/shots.md`).
- Old YouTube cuts are set to private, never deleted.
- Re-assembling the video: `video/raw.mov` is `raw-v2.mov` + `raw-epic.mov` (the epic-stack beat, cut by hand from two takes, one segment per subtitle). Marks `"0,28,60,93,148,248.4"`, `MAX_SECONDS=170`, `OUTRO=$PWD/video/out/slide-close.png:7`, then `mix-music.sh`. The 2:08 cut is backed up in `~/.cache/plumb-video-2m08`.
- `e2e-quarantine` fails on purpose (`allow_failure: true`): a red there is not a broken main.
- Never rewrite `main`'s history: the CI/CD history is a submission requirement.

## Out of my control

- **The demo app and the page stay up until judging ends (2026-11-14)** — alarm: the `live-health` schedule (see Monitoring); fallback: the video and the page's real screenshots, which the rules accept ("judge based solely on the text description, images, and video").
- **YouTube keeps the video public** — fallback: `video/out/demo.mp4` re-uploaded to the same title.
