# Mock judging — 2026-10-23 (fifth pass)

Weighted score: 4.6/5, unchanged from the fourth pass. With the Google Cloud bonus (up to +0.2), that is 4.8 out of 5.2.

Only what the judges see counts:

- the entry text, `docs/submission.md`;
- the demo video, https://youtu.be/I6_9prWib8Q (2:23, public; earlier cuts are private);
- the project page, https://showcase-8b103c.gitlab.io/;
- the public GitLab links.

There is no deck, and the rules do not ask for one. The rules let judges decide "based solely on the text description, images, and video" (`docs/HACKATHON.md:66`).

Since the fourth pass the entry gained a second project. The same published flow ran on a copy of epic-stack, which includes Plumb's CI jobs with one `include: project` (`docs/submission.md:46`, `docs/submission.md:62`). That answers question 9, which was the only gap. Potential Impact still stays at 4: on epic-stack neither fix held, so what the entry proves there is the safety net (the proof rejected both fixes, and `merge-gate` merged the quarantines), not that Plumb fixes flaky tests in someone else's app. Since then the video (`video/script.tsv`, beat `2:05 epic`) and the project page (a stat card and a link) show it too. Every citation was re-checked against the current line numbers.

## Criteria
| Criterion | Weight | Previous | Score | Evidence | What is missing and where |
|---|---|---|---|---|---|
| Stage One: uses GitLab Duo Agent Platform | pass/fail | pass | pass | `docs/submission.md:14` (Pipeline events trigger, no mention or click), `docs/submission.md:32` (custom flow, public in the AI Catalog), `video/script.tsv:8` ("CI measures the verdict. A Duo flow acts on it.") | — |
| Technological Implementation | 20% | 5 | 5 | `docs/submission.md:16-24` (10 re-runs, 3 on the parent commit, 50-run proof, merge-gate, deploy, live-checks), `docs/submission.md:32` (flow-drift, scripts with unit tests), `docs/submission.md:34` (WIF, no stored key), `docs/submission.md:46` (the jobs reused by another project with one `include: project`); on film: `video/script.tsv:13` (10 re-runs), `video/script.tsv:23` (50 of 50, merge-gate merges) | — |
| Design | 20% | 5 | 5 | `docs/submission.md:24` (merge → deploy → live-checks → summary note), `docs/submission.md:45` (every path on a real pipeline, linked); on film from red to deploy (`video/script.tsv:10-25`) and the paths where it does not act (`video/script.tsv:26-29`) | — |
| Potential Impact | 20% | 4 | 4 | `docs/submission.md:27` (about 84% of pass-to-fail transitions at Google are flaky, cited; the developer on CI duty), `docs/submission.md:42` (9 min 47 s, no human), `docs/submission.md:43` (one incident's CI minutes and session time), `docs/submission.md:46` and `docs/submission.md:62` (a second project: 3 red pipelines triaged, both fixes rejected by the proof, quarantines merged by `merge-gate`), `video/script.tsv:5` ("For the developer on CI duty, every red pipeline is a guess."), `video/script.tsv:6` (what teams do today) | For 5: a fix that holds outside the demo app. On epic-stack the proof rejected both fixes (27/50 and 30/50), and the model named the wrong cause for the seeded one (`docs/submission.md:62`), so the case for "it fixes" still rests on the booking app. |
| Innovation/Idea | 20% | 5 | 5 | `docs/submission.md:29` (retry or quarantine vs. fix and prove, citing GitLab's own testing guide), `docs/submission.md:32` ("CI decides, Duo fixes"), `docs/submission.md:39` (33/50 negative control), `video/script.tsv:6` and `video/script.tsv:29` (re-run, mute or delete vs. fix and prove; no third fix), `video/script.tsv:30-31` (the 33/50 fix not merged, quarantined instead, with the job log and the issue on screen) | — |
| Presentation | 20% | 4 | 4 | `docs/submission.md:75` (video link), a 2:23 video with a cold open, burned-in subtitles and the loop on a real run (`video/script.tsv`); problem and audience at `video/script.tsv:5`, the end-to-end loop at `video/script.tsv:10-25` | For 5: the presenter is an AI avatar, labelled by YouTube as altered content (`docs/AI_DISCLOSURE.md:7`), and a judge may count that against the presentation → `hackathon-record-video` |
| Google Cloud bonus | +0.2 | 5 | 5 | `docs/submission.md:24` (deploy to Cloud Run, live-checks), `docs/submission.md:78` (live URL), `video/script.tsv:25` (deploys to Google Cloud Run, on film), deploy code in `.gitlab-ci.yml` | — |

## No evidence
None. Every criterion has evidence in the entry and in the video.

## Likely questions
1. What stops the agent from merging a bad fix into main?
   Only `merge-gate` merges. It needs 50 of 50, and the MR must change nothing but e2e specs; a change to the app waits for a human (`docs/submission.md:20`, `video/script.tsv:23`).
2. Is the flakiness real or injected?
   On the booking app it is natural: a random confirmation delay, a gap between checking and booking a slot, an animated modal, time zones (`docs/submission.md:34`). On epic-stack one flaky test was already in the app and one was seeded (`docs/submission.md:46`).
3. How long from red to green, and who steps in?
   9 min 47 s on pipeline 2948453748, with no human action (`docs/submission.md:42`).
4. What if the agent's fix is wrong?
   It does not merge. !9's fix passed 33 of 50, so the flow replaced it with a 14-day quarantine and opened an issue for it (`docs/submission.md:39`, `docs/submission.md:20`, `video/script.tsv:30-31`). The same thing happened twice on epic-stack, at 27/50 and 30/50 (`docs/submission.md:46`).
5. How is this different from automatic retries or existing flaky-test detection?
   GitLab's own testing guide retries the test or quarantines it with an issue for later. Plumb writes the fix, proves it with 50 runs, and quarantines only when the proof fails (`docs/submission.md:29`).
6. What does one incident cost (Duo credits, CI minutes)?
   For pipeline 2958940993 → !14: 6.2 min of CI jobs on the red pipeline, 5.2 min on the MR pipeline, and a 4 min 10 s flow session (`docs/submission.md:43`). Over the 11 incidents with a fix merge request the median is 9.5 min of CI jobs (`docs/RESULTS.md:42`). A Developer role cannot see the Duo credits per session (`docs/submission.md:68`).
7. Is that you presenting, and is the run in the video live?
   The face and voice are an AI avatar and a cloned voice of the author, made with HeyGen. The screen recording is a real run on the live project, with the waiting sped up (`docs/AI_DISCLOSURE.md:7`, `docs/AI_DISCLOSURE.md:9`).
8. How likely is 50 of 50 to catch a fix that is still flaky?
   It catches frequent failures, not rare ones. A fix that still fails 10% of runs passes 50/50 0.5% of the time; at 5% it passes 7.7% of the time, and at 1% it passes 60.5% of the time (`docs/submission.md:67`).
9. Does it work on a real project, outside the demo app?
   Partly. The same published flow triaged 3 red pipelines on a copy of epic-stack. It opened the regression issue, and the proof rejected both flaky fixes, which `merge-gate` replaced with merged quarantines (`docs/submission.md:46`). No fix held there, and for the seeded test the model named the wrong cause (`docs/submission.md:62`). Why it got that cause wrong, and what would change it: **gap**, the entry states the misdiagnosis but not its reason.
10. If it is Hands-off, what does a person still do?
    Approve `update/` MRs (intended app changes) and remove the tag of an expired quarantine (`docs/submission.md:21`, `docs/submission.md:65`, `video/script.tsv:28`).
