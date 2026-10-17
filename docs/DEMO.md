# Demo rehearsal

> **Historical snapshot (2026-10-14).** This records one run of the loop as the pipeline was then. It predates `quarantine-check` and the order and infrastructure checks in `flake-verdict`; the current pipeline is described in the [README](../README.md#pipeline) and [ARCHITECTURE](ARCHITECTURE.md).

The full loop on a real pipeline, run on 2026-10-14 (U9). Every time below comes from the GitLab API (`created_at`, `started_at`, `finished_at`, `merged_at` and the note's `created_at`), not from a stopwatch.

## Setup

- Demo commit: `57608d9` "Demo baseline: async confirmation reads the status after a fixed pause". It brings back the fixed 600 ms pause in `tests/e2e/booking.spec.ts`, so `async confirmation` fails about one run in three (U2 measured 16/50). The rest of the suite stays fixed, so the verdict lists one flaky test.
- Getting red: the push pipeline [2948453748](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2948453748) passed `e2e` on the first run. One retry of the `e2e` job failed, and that re-evaluated `flake-verdict`. Retries needed: **1**.

## Timeline

T0 is the retry of `e2e` at 21:46:28 UTC.

| Step | UTC | T+ | Evidence |
|---|---|---|---|
| `e2e` fails | 21:47:19 | 0:51 | job 17184204929 |
| `flake-verdict`: `async confirmation` passed 3/10, verdict `flaky` | 21:49:08 | 2:40 | job 17184144686, 108 s |
| Duo flow session starts | 21:49:11 | 2:43 | session 9497797 |
| Flow opens the fix MR, cause `async-wait` | 21:50:11 | 3:43 | [!10](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/10) |
| `fix-proof`: 50/50 runs passed | 21:53:16 | 6:48 | pipeline 2948469314, 183 s |
| `merge-gate` merges !10 | 21:53:56 | 7:28 | merge commit `80d5cd5` |
| `deploy` to Cloud Run | 21:55:59 | 9:31 | pipeline [2948477539](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines/2948477539) |
| `summary` posts the note on `57608d9` | 21:56:15 | 9:47 | commit comment |

From the red job to the summary note took 9 min 47 s, with no human action. The live URL https://booking-vic4jyzsha-uc.a.run.app served "Book an appointment" afterwards.

## The note

Posted on commit `57608d9` by the `summary` job:

> **Flaky-test loop summary** for pipeline 2948453748
>
> - Failed test: `async confirmation` · 3/10 re-runs passed · verdict `flaky`
> - Merge request: !10 Fix flaky test: async confirmation (pipeline 2948453748)
> - Proof: 50/50 runs passed
> - Deployed: https://booking-vic4jyzsha-uc.a.run.app (deploy pipeline)

## Fitting the video under 3 minutes

The loop takes about 10 minutes, and most of it is CI waiting. The video cuts from one artifact to the next instead of showing the waits:

1. The red pipeline and the `flake-verdict` job log (3/10, flaky).
2. The Duo session: it reads the verdict and the test file, then opens !10.
3. The !10 description (cause, evidence, fix) and its diff: a fixed pause becomes a waiting assertion.
4. The `fix-proof` log at 50/50, then `merge-gate` merging.
5. The `deploy` job with the URL, the live page, and the summary note on the original commit.

## Repeating the rehearsal

The fix is now on main, so `async confirmation` passes again. To run the loop again:

```bash
git revert --no-edit -m 1 <merge commit of the fix MR>   # brings the fixed pause back
git push origin main
# if e2e passes, retry the e2e job until it fails:
glab api -X POST projects/87376478/jobs/<e2e job id>/retry
```

The flow's duplicate check looks only at open issues and merge requests, so the merged !10 does not block a new fix MR.
