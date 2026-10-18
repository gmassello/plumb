# Mock judging — 2026-10-17 (third pass)

Weighted score: 4.4/5, up from 3.4. With the Google Cloud bonus (up to +0.2), that is 4.6 out of 5.2.

Only what the judges see counts:

- the entry text, `docs/submission.md`;
- the demo video, https://youtu.be/u_FShFO1OOQ (1:55, public);
- the project page, https://showcase-8b103c.gitlab.io/;
- the public GitLab links.

There is no deck, and the rules do not ask for one. The rules let judges decide "based solely on the text description, images, and video" (`docs/HACKATHON.md:66`).

Since the second pass the video exists. Its script is `video/script.tsv` and it is linked from the entry (`docs/submission.md:67`). It films the loop on a real run: red pipeline, verdict, Duo fix, 50-run proof, merge and deploy. Then it shows the paths where Plumb does not act. Presentation, Design, Technological Implementation and the Google Cloud bonus went up.

## Criteria
| Criterion | Weight | Previous | Score | Evidence | What is missing and where |
|---|---|---|---|---|---|
| Stage One: uses GitLab Duo Agent Platform | pass/fail | pass | pass | `docs/submission.md:14` (Pipeline events trigger, no mention or click), `docs/submission.md:32` (custom flow, public in the AI Catalog), `video/script.tsv:8` ("CI measures the verdict. A Duo flow acts on it.") | — |
| Technological Implementation | 20% | 4 | 5 | `docs/submission.md:16-24` (10 re-runs, 3 on the parent commit, 50-run proof, merge-gate, deploy, live-checks), `docs/submission.md:32` (flow-drift, scripts with unit tests), `docs/submission.md:34` (WIF, no stored key); on film: `video/script.tsv:13` (10 re-runs), `video/script.tsv:23` (50 of 50, merge-gate merges) | — |
| Design | 20% | 4 | 5 | `docs/submission.md:24` (merge → deploy → live-checks → summary note), `docs/submission.md:44` (every path on a real pipeline, linked); on film from red to deploy (`video/script.tsv:10-25`) and the paths where it does not act (`video/script.tsv:26-29`) | — |
| Potential Impact | 20% | 4 | 4 | `docs/submission.md:27` (about 84% of pass-to-fail transitions at Google are flaky, cited; the developer on CI duty), `docs/submission.md:42` (9 min 47 s, no human), `docs/submission.md:43` (one incident's CI minutes and session time), `video/script.tsv:5-6` (the guess and what teams do today) | For 5: the figure is Google's, not from a team using Plumb; a run on a second project (question 9) would make it Plumb's own. The video says "teams", not who: naming the developer on CI duty in the landing beat would answer "who it's for" → `hackathon-record-video` |
| Innovation/Idea | 20% | 4 | 4 | `docs/submission.md:29` (retry or quarantine vs. fix and prove, citing GitLab's own testing guide), `docs/submission.md:32` ("CI decides, Duo fixes"), `docs/submission.md:39` (33/50 negative control), `video/script.tsv:6` and `video/script.tsv:29` (re-run, mute or delete vs. fix and prove; no third fix) | For 5: the contrast is said, not shown. The 33/50 negative control (!9) is the strongest proof of the idea and is not in the video → `hackathon-record-video` |
| Presentation | 20% | 1 | 4 | `docs/submission.md:67` (video link), video of 1:55 with cold open, burned-in subtitles and the loop on a real run (`video/script.tsv`); problem at `video/script.tsv:5`, the end-to-end loop at `video/script.tsv:10-25` | For 5: "who it's for" is implicit ("teams"). The presenter is an AI avatar, labelled by YouTube as altered content (`docs/AI_DISCLOSURE.md:7`); a judge may count that against the presentation → `hackathon-record-video` |
| Google Cloud bonus | +0.2 | 4 | 5 | `docs/submission.md:24` (deploy to Cloud Run, live-checks), `docs/submission.md:70` (live URL), `video/script.tsv:25` (deploys to Google Cloud Run, on film), deploy code in `.gitlab-ci.yml` | — |

## No evidence
None. Every criterion has evidence in the entry and in the video.

## Likely questions
1. What stops the agent from merging a bad fix into main?
   Only `merge-gate` merges. It needs 50 of 50, and the MR must change nothing but e2e specs; a change to the app waits for a human (`docs/submission.md:20`, `video/script.tsv:23`).
2. Is the flakiness real or injected?
   Natural: a random confirmation delay, a gap between checking and booking a slot, an animated modal, time zones (`docs/submission.md:34`).
3. How long from red to green, and who steps in?
   9 min 47 s on pipeline 2948453748, with no human action (`docs/submission.md:42`).
4. What if the agent's fix is wrong?
   It does not merge. !9's fix passed 33 of 50, so the flow replaced it with a 14-day quarantine and opened an issue for it (`docs/submission.md:39`, `docs/submission.md:20`).
5. How is this different from automatic retries or existing flaky-test detection?
   GitLab's own testing guide retries the test or quarantines it with an issue for later. Plumb writes the fix, proves it with 50 runs, and quarantines only when the proof fails (`docs/submission.md:29`).
6. What does one incident cost (Duo credits, CI minutes)?
   For pipeline 2958940993 → !14: 6.2 min of CI jobs on the red pipeline, 5.2 min on the MR pipeline, and a 4 min 10 s flow session (`docs/submission.md:43`). A Developer role cannot see the Duo credits per session (`docs/submission.md:60`).
7. Is that you presenting, and is the run in the video live?
   The face and voice are an AI avatar and a cloned voice of the author, made with HeyGen. The screen recording is a real run on the live project, with waiting sped up (`docs/AI_DISCLOSURE.md:7`, `docs/AI_DISCLOSURE.md:9`).
8. How likely is 50 of 50 to catch a fix that is still flaky?
   It catches frequent failures, not rare ones. A fix that still fails 10% of runs passes 50/50 0.5% of the time, at 5% it passes 7.7%, and at 1% it passes 60.5% (`docs/submission.md:59`).
9. Does it work on a real project, outside the demo app?
   **gap**: every run is on the repo's booking app (`docs/submission.md:34`); there is no run on another project.
10. If it is Hands-off, what does a person still do?
    Approve `update/` MRs (intended app changes) and remove the tag of an expired quarantine (`docs/submission.md:21`, `docs/submission.md:57`, `video/script.tsv:28`).
