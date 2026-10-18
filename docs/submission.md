# Submission

Copy for the Devpost entry, one section per form field. The limit is in each heading; `(-)` means no published limit. Paste the text without the `<!-- src: -->` comments. The Criteria coverage table is for review only.

## Project name (1-60)
Plumb

## Elevator pitch (20-200)
A hands-off GitLab Duo flow that triages a red main pipeline: CI re-runs the failed test to decide flaky or real, Duo fixes it, and the fix merges only after 50 of 50 runs pass. <!-- src: grep -n "repeat-each=50" .gitlab-ci.yml -->

## About the project (-)

### What it does
Plumb is a GitLab Duo Agent Platform flow that takes over when a `main` pipeline goes red, and walks away only when `main` is green again or a person has a precise issue to read. A Pipeline events trigger starts the flow on the failed pipeline; nobody mentions it or clicks anything. It is a Path A project at the Hands-off autonomy level: a person sets the rules in CI and walks away.

Before the flow starts, CI decides what kind of failure it is. `flake-verdict` re-runs each failed test 10 times on the same commit and writes `verdict.json`. <!-- src: grep -n "repeat-each=10" .gitlab-ci.yml --> Any pass makes the test flaky. A test file that fails to load counts as a real failure without re-runs. A test that fails all 10 also runs 3 times on the parent commit, so the verdict says whether this commit broke it or it was already broken. <!-- src: grep -n "repeat-each=3" .gitlab-ci.yml --> The verdict also records order effects (state left by earlier runs, or a test that only fails inside the full suite), infrastructure failures that need no code change, and the test's history in the project.

The flow then acts on that verdict:

- **Flaky:** it finds the cause (async wait, concurrency, animation, time zone, shared state), commits a fix on a `fix/` branch and opens a merge request. In that MR `fix-proof` runs the test 50 times, and `merge-gate` merges only if all 50 pass and the MR changes nothing but e2e specs; a fix that touches the app waits for a human. <!-- src: grep -n "repeat-each=50" .gitlab-ci.yml; grep -n "nothing but e2e specs" .gitlab-ci.yml --> If the proof fails, the flow replaces the fix with a quarantine tag and opens an issue that expires in 14 days. <!-- src: grep -n "14 days" .gitlab/duo/triage-flow.yml -->
- **Real failure:** it reads the commit message and diff and picks a cause. A regression gets an issue that quotes the diff. An intended app change gets an `update/` MR that always waits for a human. A CI setting change gets an `environment` issue. Missing test data gets a `fix/` MR.
- **Recurring:** a test already fixed 2 times is not fixed a third time; it goes straight to quarantine with its history quoted ([!13](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/13)). <!-- src: grep -n "RECURRING_FIXES =" tools/history.mjs -->

After the merge, `deploy` ships the app to Google Cloud Run, `live-checks` runs the API contract against the live URL, and `summary` posts one note on the commit that failed, linking the verdict, the MR, the proof and the live app.

### Inspiration
At Google, about 84% of the transitions from pass to fail involve a flaky test, not a real regression. <!-- src: https://testing.googleblog.com/2016/05/flaky-tests-at-google-and-how-we.html (Google Testing Blog, 2016-05-27) --> So the developer on CI duty who opens a red `main` pipeline is usually chasing noise, and pays twice: the time to read the log, and the habit everyone learns of pressing retry. Retrying hides the flake; skipping it hides the bug.

The usual answers are to retry the failed test, or to quarantine it and file an issue for someone to fix later; GitLab's own testing guide does both. <!-- src: https://docs.gitlab.com/development/testing_guide/unhealthy_tests/ --> Plumb writes the fix, proves it with 50 runs, and quarantines only when the proof fails. We wanted an agent that does the boring part end to end, without trusting a language model to decide what is safe to merge.

### How we built it
The design rule is "CI decides, Duo fixes" (ADR 0001). Everything that decides is deterministic: the re-run counts, the 50-run proof, the merge, the quarantine cap and the recurrence threshold live in `.gitlab-ci.yml` and small Node scripts with unit tests. The Duo flow (`.gitlab/duo/triage-flow.yml`, public in the AI Catalog as `triage-flow`) reads `verdict.json`, picks the cause, writes the fix and opens the MR or issue. `flow-drift` fails the pipeline if the published flow differs from the one in the repo, so the flow that runs is the one that was reviewed.

The subject under test is a small booking app (Node, no framework) with a Playwright suite whose flakiness is natural, not injected: a random confirmation delay, a gap between checking and booking a slot, an animated modal, time zones. It deploys to Cloud Run through Workload Identity Federation, so no Google key is stored anywhere.

Plumb touches all 9 DevSecOps lifecycle stages: plan (the issues it opens), create (the fix commit), verify (`flake-verdict`, `fix-proof`), package (Cloud Run builds the container image from the `Dockerfile`), secure (SAST and Secret Detection on every pipeline), release (`merge-gate`), configure (the CI and the flow are YAML in the repo), monitor (`live-checks` after each deploy, and a health check every 6 hours) and govern (scoped bot token, quarantine expiry, at most 2 quarantined tests). <!-- src: docs/ARCHITECTURE.md, line "R7's stages map to"; grep -n "template:\|--source\|live-health" .gitlab-ci.yml -->

### Challenges we ran into
A flaky test does not fail on demand, so every scenario had to be measured before it could be demoed. A fix that looks right can still be flaky: the concurrency fix in [!9](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/merge_requests/9) passed only 33 of 50 runs, so it was never merged and the flow quarantined the test instead. <!-- src: docs/RESULTS.md, row 2944554222 --> That negative control is why the proof exists.

### Accomplishments that we're proud of
- From the red job to the summary note in 9 min 47 s, with no human action, on pipeline 2948453748. <!-- src: docs/DEMO.md § Timeline -->
- One incident, measured end to end (pipeline 2958940993 → !14, merged): 6.2 min of CI jobs on the red pipeline, 1.9 of them the verdict re-runs; 5.2 min on the MR pipeline, 2.0 of them the 50-run proof; and a flow session of 4 min 10 s. <!-- src: for p in 2958940993 2958945808; do glab api "projects/:fullpath/pipelines/$p/jobs?per_page=100"; done, sum of duration per pipeline; flow session times in docs/sessions/9641497.md -->
- Every path of the flow ran on a real pipeline, with public links: flaky fixed, flaky not fixable, flaky by order, regression, intended app change, environment, test data, recurring.
- The cause of always-failing tests was right in 12 of 12 runs across four seeded scenarios, and no `update/` MR was ever merged automatically. <!-- src: docs/RESULTS.md § QA-06 -->

### What we learned
A language model is good at reading a diff and writing a three-line fix, and the wrong judge of whether that fix is safe. Keeping the judgement in CI made the agent trustworthy enough to merge on its own.

### What's next
- Handle every failing test in a pipeline, not only the first.
- Take a test out of quarantine automatically when its expiry date passes and it is green again.

### Known limitations
- The flow fixes one test per pipeline; the others are listed in the MR, not fixed.
- The cause of an always-failing test is the model's call. The merge is not: only `merge-gate` merges, after 50 of 50, and only MRs that change nothing but e2e specs. <!-- src: grep -n "repeat-each=50" .gitlab-ci.yml; grep -n "nothing but e2e specs" .gitlab-ci.yml -->
- An expired quarantine turns the pipeline yellow, but nothing removes the tag. At most 2 tests can be quarantined; a third fails the pipeline. <!-- src: QUARANTINE_MAX=0 node tools/quarantine.mjs; echo $? -->
- History is matched by exact test title, so a renamed test starts with none.
- 50 of 50 catches a fix that still fails often, not one that fails rarely: a test that fails 10% of runs passes the proof 0.5% of the time, one that fails 5% passes it 7.7% of the time, and one that fails 1% passes it 60.5% of the time. <!-- src: node -e "for (const f of [0.01,0.05,0.1]) console.log(f, ((1-f)**50).toFixed(3))" -->
- The Duo credits a session uses are not visible to the participant's Developer role (GraphQL `creditsUsed` returns null), so the cost above counts CI minutes and session time only.
- The demo app keeps bookings in memory, and its API has no authentication; only the test reset endpoint needs a token.

## Built with (-)
GitLab Duo Agent Platform, GitLab CI/CD, Google Cloud Run, Workload Identity Federation, Node.js, Playwright, Python

## Try it out (-)
- Demo video: https://youtu.be/PaYtgcmaSj0
- Project page: https://showcase-8b103c.gitlab.io/
- Repository: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase
- Live app: https://booking-vic4jyzsha-uc.a.run.app
- Pipelines: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/pipelines
- Every triaged pipeline: https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/blob/main/docs/RESULTS.md

## Criteria coverage

| Criterion | Weight | Paragraph |
|---|---|---|
| Stage One: uses GitLab Duo Agent Platform | pass/fail | What it does (Pipeline events trigger, flow acts); How we built it (custom flow in the AI Catalog) |
| Technological Implementation | 20% | How we built it (deterministic CI gates, flow-drift, WIF); What it does (verdict, proof, merge-gate) |
| Design | 20% | What it does (full loop from red pipeline to deploy and summary note); Accomplishments (every path on a real pipeline) |
| Potential Impact | 20% | Inspiration (84% of pass-to-fail transitions are flaky at Google; the developer on CI duty); Accomplishments (9 min 47 s, no human) |
| Innovation/Idea | 20% | Inspiration (retry or quarantine vs. fix and prove); How we built it ("CI decides, Duo fixes"); What it does (recurring tests go to quarantine); Challenges (negative control) |
| Presentation | 20% | Try it out (demo video, 2:02); Accomplishments (every path on a real pipeline) |
| Most Stages Covered (special prize) | — | How we built it (all 9 stages, each with its job or file) |
| Hands-off agent (Path A prize) | — | What it does (Hands-off autonomy level); Elevator pitch |
| Google Cloud bonus | +0.2 | What it does (deploy to Cloud Run, live-checks); Try it out (live URL) |
