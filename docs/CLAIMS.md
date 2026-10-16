# Claims

Every number this project publishes, where it appears, and the command or record it comes from. If a number here and the source disagree, the source wins and this file is wrong.

| Claim | Appears in | Source | How to check it |
|---|---|---|---|
| A failed test is re-run **10 times** on the same commit | README, BRIEF R1 | `.gitlab-ci.yml`, job `flake-verdict` (`--repeat-each=10`) | `grep repeat-each .gitlab-ci.yml` |
| A test that fails all 10 also runs **3 times** on the parent commit | README | `.gitlab-ci.yml`, job `flake-verdict` (`--repeat-each=3`) | issue #10: "Parent commit 3297613…: passed 3/3 runs" |
| A fix merges only after **50 of 50** runs pass | README, BRIEF R4 | `.gitlab-ci.yml`: `fix-proof` (`--repeat-each=50`) and `merge-gate` (`needs: [fix-proof]`) | `grep -n "repeat-each=50\|needs: \[baseline, fix-proof\]" .gitlab-ci.yml` |
| A fix that is not 50/50 is not merged: **33/50** led to a quarantine | README (Limits and See it work) | !9: `fix-proof` [job 17155472981](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/jobs/17155472981) failed, `merge-gate` [job 17155472982](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/jobs/17155472982) skipped; issue #9 | `docs/RESULTS.md`, row 2944554222 |
| Quarantine expires **14 days** after the failed pipeline | README | `.gitlab/duo/triage-flow.yml` Step 13 | issue #9, first line `Expires:` |
| Red job to summary note in **9 min 47 s**, no human action | README, DEMO | GitLab API timestamps of pipeline 2948453748 and its follow-ups | `docs/DEMO.md` § Timeline |
| Demo verdict **3/10** flaky, proof **50/50** | DEMO | `verdict.json` and `proof.json` artifacts | `node tools/results.mjs`, row 2948453748 |
| Cause of always-failing tests right in **12 of 12** QA-06 runs, **0** merges from `update/` | README, PLAN U12 | flow session final answers | `node tools/results.mjs`, section QA-06 |
| Natural failure rates: async wait **16/50**, concurrency **13/50**, animation **12/50** | PLAN U2, DEMO | local runs in the CI image | `npx playwright test <spec> --repeat-each=50` in the CI image (README `## Commands`) |
| Loop of 2026-10-16: verdict on pipeline 2953221849 → !11, proof **50/50**, labels `triage::proving` → `triage::merged` | README (See it work) | `fix-proof` [job 17219008622](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/jobs/17219008622), MR !11 labels | `node tools/results.mjs`, row 2953221849 |

Flow session transcripts behind every row of `docs/RESULTS.md` are in [`docs/sessions/`](sessions/), exported by the same command.
