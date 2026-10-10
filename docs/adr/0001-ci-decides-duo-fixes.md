---
status: accepted
date: 2026-10-10
decision-makers: [gmassello]
consulted: []
informed: []
---

# 0001. CI decides verdict, proof and merge; the Duo flow diagnoses and writes the change

## Context and Problem Statement

The product must turn a red pipeline caused by a flaky Playwright test into a merged fix or a quarantined test with no human in the loop (BRIEF R1–R5), and it must genuinely use GitLab Duo Agent Platform (R7). A fix that still fails 10% of the time must almost never be merged (QA-02: 0.9^50 ≈ 0.5% with 50 runs).

Platform spikes on 2026-10-09/10 showed that a "Pipeline events → Failed" trigger starts a flow about 3 s after the failure (S1), that the flow job cannot see CI/CD variables (S2), that the flow has no tool to merge or enable auto-merge (S3), and that it can poll its own MR pipeline and read the result (S6).

Who decides whether a test is flaky, whether a fix is proven, and whether it is merged: the model or deterministic CI jobs?

## Decision Drivers

* QA-01: 0 real regressions classified as flaky.
* QA-02: the merge rule must be a fixed number of passing runs, not a judgment.
* R7 / Stage One: Duo must take real actions, not only chat.
* C5: the flow cannot merge, so some CI job must hold the merge.
* Deadline 2026-10-27: no custom infrastructure beyond GitLab CI and one flow.

## Considered Options

* C — CI only: retries plus an automatic quarantine script, no agent.
* A — CI decides, Duo fixes.
* B — the flow re-runs, proves and merges inside its own job.

## Decision Outcome

Chose option "A", because it is the only one where the verdict and the merge come from fixed rules in CI (10 re-runs, 50 proof runs, all-green gate) while the flow does the diagnosis and the code change.

### Consequences

* Good: correctness of the merge rule (QA-02) does not depend on a prompt; the verdict and proof jobs keep working if the flow is removed.
* Bad: the merge needs a project access token in a masked CI variable (`MERGE_BOT_TOKEN`), which is one more secret to rotate, and the pipeline gets two extra jobs.
* To watch: if the flow's polling of its MR pipeline (S6) hits the 900 s timeout in practice, the red-proof path stops being hands-off and this decision needs a CI-side quarantine instead.

### Confirmation

* `merge-gate` is the only job that calls the merge API, and it runs only when every earlier job passed (`when: on_success`); a CI lint test greps the flow YAML for any merge tool and fails if one appears.
* QA-01 and QA-02 are re-checked with seeded regressions and seeded flaky tests whose results are recorded in pipeline artifacts.

## Pros and Cons of the Options

### C — CI only

* Good, because it is the cheapest and fastest to build.
* Bad, because it never fixes anything (R3, R4) and fails Stage One (R7).

### A — CI decides, Duo fixes

* Good, because the decision rules are reviewable YAML and the model's output always passes through a 50-run proof.
* Bad, because it needs a merge token and the flow must poll a pipeline it started.

### B — the flow does everything

* Good, because there is one place to read the whole loop.
* Bad, because the model would decide the merge, the flow job has no Playwright browsers, and the logic would live in a prompt (high cost to exit).

## More Information

`docs/ARCHITECTURE.md` (spikes S1–S7 and contracts). Revisit after spike S3b, which proves the `merge-gate` job can merge with the project token.
