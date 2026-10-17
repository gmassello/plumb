# Mock judging — 2026-10-17 (second pass)

Weighted score: 3.4/5, up from 3.0; plus the Google Cloud bonus (up to +0.2): 3.6 out of 5.2.

Only what the judges see counts: the entry text (`docs/submission.md`), the project page (https://showcase-8b103c.gitlab.io/) and the public GitLab links. There is no video and no deck. The rules let judges decide "based solely on the text description, images, and video" (`docs/HACKATHON.md:75`).

Since the first pass the entry says Hands-off, lists the 9 lifecycle stages, opens with a cited figure and its audience, says how it differs from retrying and quarantining, and publishes one incident's cost and the proof's power. Potential Impact and Innovation went up; the video is still missing.

## Criteria
| Criterion | Weight | Previous | Score | Evidence | What is missing and where |
|---|---|---|---|---|---|
| Stage One: uses GitLab Duo Agent Platform | pass/fail | pass | pass | `docs/submission.md:14` (Pipeline events trigger, no mention or click), `docs/submission.md:32` (custom flow, public in the AI Catalog) | — |
| Technological Implementation | 20% | 4 | 4 | `docs/submission.md:16-24` (10 re-runs, 3 on the parent commit, 50-run proof, merge-gate, deploy, live-checks), `docs/submission.md:32` (flow-drift, scripts with unit tests), `docs/submission.md:34` (WIF, no stored key), `docs/submission.md:43` (one incident's CI minutes); every number has its `src:` | For 5: show it in the video (red pipeline → MR → 50/50 → merge) → `hackathon-record-video` |
| Design | 20% | 4 | 4 | `docs/submission.md:24` (merge → deploy → live-checks → summary note), `docs/submission.md:44` (8 paths on real pipelines, linked), the paths table on the project page | For 5: the whole loop on film; today a judge has to open 8 links to believe it → `hackathon-record-video` |
| Potential Impact | 20% | 3 | 4 | `docs/submission.md:27` (about 84% of pass-to-fail transitions at Google are flaky, cited; the developer on CI duty chasing noise), `docs/submission.md:42` (9 min 47 s, no human), `docs/submission.md:43` (one incident: 6.2 + 5.2 min of CI, a 4 min 10 s session) | For 5: the figure is Google's, not from a team using Plumb; a run on a second project (question 9) would make it Plumb's own |
| Innovation/Idea | 20% | 3 | 4 | `docs/submission.md:29` (retry or quarantine vs. fix and prove, citing GitLab's own testing guide), `docs/submission.md:32` ("CI decides, Duo fixes"), `docs/submission.md:22` (no third fix: recurring tests go to quarantine), `docs/submission.md:39` (33/50 negative control) | For 5: show the contrast in the video (a retry hides it, Plumb proves the fix) → `hackathon-record-video` |
| Presentation | 20% | 1 | 1 | The project page and its 4 real screenshots exist, but the criterion asks about the video, and there is none (`docs/submission.md:82`) | A video under 3 minutes, public on YouTube, showing the loop end to end (BRIEF R9) → `hackathon-record-video` |
| Google Cloud bonus | +0.2 | 4 | 4 | `docs/submission.md:24` (deploy to Cloud Run, live-checks), `docs/submission.md:69` (live URL), deploy code in `.gitlab-ci.yml` | Show the app on Cloud Run after the merge in the video → `hackathon-record-video` |

## No evidence
- Presentation: belongs in the video, which does not exist → `hackathon-record-video`

Resolved since the first pass: the Hands-off autonomy level (`docs/submission.md:9`, `docs/submission.md:14`) and the "Most Stages Covered" mapping (`docs/submission.md:36`).

## Likely questions
1. What stops the agent from merging a bad fix into main?
   Only `merge-gate` merges, after 50 of 50 and only when the MR changes nothing but e2e specs; a change to the app waits for a human (`docs/submission.md:20`, `.gitlab-ci.yml:211`).
2. Is the flakiness real or injected?
   Natural: a random confirmation delay, a gap between checking and booking a slot, an animated modal, time zones (`docs/submission.md:34`).
3. How long from red to green, and who steps in?
   9 min 47 s on pipeline 2948453748, with no human action (`docs/submission.md:42`).
4. What if the agent's fix is wrong?
   It does not merge: !9's fix passed 33 of 50, and the flow replaced it with a 14-day quarantine and its issue (`docs/submission.md:39`, `docs/submission.md:20`).
5. How is this different from automatic retries or existing flaky-test detection?
   Retrying or quarantining with an issue for later is what GitLab's own testing guide does; Plumb writes the fix, proves it with 50 runs, and quarantines only when the proof fails (`docs/submission.md:29`).
6. What does one incident cost (Duo credits, CI minutes)?
   One incident (pipeline 2958940993 → !14): 6.2 min of CI jobs on the red pipeline and 5.2 min on the MR pipeline, and a 4 min 10 s flow session (`docs/submission.md:43`). Duo credits per session are not visible to a Developer role (`docs/submission.md:60`).
7. What if several tests fail in the same pipeline?
   It fixes one (the first real test, or the flaky one with the fewest passes) and lists the rest in the MR (`docs/submission.md:55`).
8. How likely is 50 of 50 to catch a fix that is still flaky?
   A test that fails 10% of runs passes 50/50 0.5% of the time, 5% passes it 7.7%, 1% passes it 60.5%: it catches frequent failures, not rare ones (`docs/submission.md:59`).
9. Does it work on a real project, outside the demo app?
   **gap**: every run is on the repo's booking app (`docs/submission.md:34`); there is no run on another project.
10. If it is Hands-off, what does a person still do?
    Approve `update/` MRs (intended app changes) and remove the tag of an expired quarantine (`docs/submission.md:21`, `docs/submission.md:57`).
