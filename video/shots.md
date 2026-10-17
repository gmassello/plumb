# Shot list for the take

One window at 1280x800, captured in window mode, no microphone. Each money shot (★) gets about 4 s on screen; waiting is sped up in the edit.

| # | Beat | Screen | What must be legible |
|---|---|---|---|
| 1 | landing | https://showcase-8b103c.gitlab.io/ — scroll slowly through the hero and "how it works" | the name and the one-line claim ★ |
| 2 | red | the scenario commit on main, then its pipeline | `e2e` and `flake-verdict` red ★ |
| 3 | red | `flake-verdict` job log, the end | the verdict JSON: `1/10`, `flaky`, `state-leak` ★ |
| 4 | fix | the merge request the flow opened | title "Fix flaky test: …", labels `flaky` and `triage::proving`, the "Cause: shared-state" line ★ |
| 5 | fix | the MR's Changes tab | the added `beforeEach` that calls `/_test/reset` ★ |
| 6 | proof | the MR pipeline, `fix-proof` job | `50 passed` ★ |
| 7 | proof | the MR overview after `merge-gate` | "Merged", then `triage::merged` ★ |
| 8 | proof | main's pipeline | all green, `deploy` passed |
| 9 | human | MR !15 | "Update test after app change", label `needs-review`, merged by a human ★ |
| 10 | human | issue #10 | "Real regression", no code change |

Before the take: `sh video/check-demo.sh` all `ok`, `chrome-silent`, the debugger banner gone.
The scenario push is run by the human: `! sh demo/scenarios/apply.sh order` and `! git push origin main`.
After the take: book slot s1 in `tests/e2e/modal.spec.ts` again.
