# Improvements after GitLab Transcend "Life After Code"

The contest closed with 10 prizes for 9 projects (CodeTinder won two) out of 785 entries in the gallery. Plumb did not win. The Path A Hands-off prize, Plumb's category, went to ShakeFix. Nothing below is applied yet: it is the backlog for a next iteration or a next event.

## What the winners had in common

| Project | Prize | What it does | Proof it leads with |
|---|---|---|---|
| [Aftermath](https://devpost.com/software/aftermath-hnkzb5) | Path A · Assisted | Traces which past CI jobs ran a hijacked npm package and what they could reach, then rotates only those keys | the old key answers HTTP 401 |
| [Lookback](https://devpost.com/software/lookback-k98qr5) | Path A · Supervised | One won benefits appeal fixes the bug and finds every household the same bug underpaid | 413 households, $25,861 owed; 99.0% agreement with USDA on 42,327 households |
| [ShakeFix](https://devpost.com/software/shakefix) | **Path A · Hands-off** | A 78-year-old shakes her phone and describes a pharmacy-app bug; agents fix, prove and ship it | 18 min 34 s, zero human touches; 12 of 12 pre-registered controls |
| [Unstuck](https://devpost.com/software/unstuck-8hljga) | Path B · Assisted | Two flows finish the dependency upgrades a real OSS app (doccano) was stuck on | 80 advisories down to 0; 25 stuck bot PRs replaced by 6 merged MRs |
| [CodeTinder](https://devpost.com/software/codetinder-swipe-for-the-love-of-code) | Path B · Supervised + Most Creative | You swipe one-change variants of a function; Duo learns a principles doc and rewrites the MR | 20 learned principles in a versioned doc |
| [Locus](https://devpost.com/software/locus-qlbm19) | Path B · Hands-off | A teacher's email becomes a 3D-printable tactile math graph for a blind student | real printed plates |
| [Stale](https://devpost.com/software/stale) | Most Stages (Path A) | Re-checks "safe to ship" verdicts when the world changes (a distrusted root CA, a table that grew), not the code | 9 `stages:` in the pipeline, one job each; canary 0/50/100 |
| [Earned Autonomy](https://devpost.com/software/earned-autonomy-li8qxm) | Most Stages (Path B) | Every MR earns its own autonomy level from evidence and loses it where production proves it wrong | 12 seeded changes, expected levels committed first |
| [Memory Lane](https://devpost.com/software/memory-lane-audzxb) | Most Environmentally Impactful | Care-home coordinators file a plain-English issue and three flows ship it | issue to production in 22 min; a prompt injection refused |

Patterns that repeat across the 9 winners:

1. **Every winner deploys on Google Cloud Run** (9 of 9), and 6 of 9 list Workload Identity Federation in Built With. Plumb has both but lists 7 tags against a median of 17.
2. **More than one agent role** (9 of 9): separate planner, fixer, reviewer or verifier agents, or several flows. Plumb has one flow.
3. **The problem is cited from outside data before the product appears** (6 of 9): CDC, KFF, Lancet, a named worm, a named outage. Plumb cites one Google figure and says it is not its own.
4. **A named person outside engineering benefits** (4 of 9): Ana on SNAP, Margaret at 78, a blind student's teacher, care-home carers. Every winner names who it is for in its first lines.
5. **Ground truth fixed before the run, misses published** (4 of 9): Lookback, ShakeFix, Earned Autonomy and Aftermath commit the expected answer before running and report what they got wrong.
6. **A measured before and after on their own run**: money owed, advisories closed, minutes from report to production.

## Where Plumb stands

Devpost page against the 9 winners ([full benchmark](competitors/benchmark.md)):

| Signal | Plumb | Winners' median | Percentile |
|---|---|---|---|
| Words in the description | 1570 | 1455 | 67 |
| Screenshots | 6 | 8 | 33 |
| "Built With" tags | 7 | 17 | 0 |
| Video | yes | 9 of 9 | — |

Coverage of the judging criteria ([`judging.tsv`](judging.tsv)): Plumb's page matches every criterion's wording, as do most winners (Design 56%, Presentation 67%, everything else 89-100%). The regex finds the words, not the strength of the proof, so coverage did not separate winners from Plumb.

Deep review of 4 winners' repos (same probes on both sides, nothing executed, notes 1-5 per criterion: Tech / Design / Impact / Innovation / Presentation):

| Competitor | Competitor score | Plumb score | Report |
|---|---|---|---|
| ShakeFix | 5 / 5 / 5 / 5 / 5 | 4 / 5 / 4 / 5 / 4 | [md](competitors/competidores-gitlab-transcend-shakefix.md) · [html](competitors/competidores-gitlab-transcend-shakefix.html) |
| Lookback | 5 / 5 / 5 / 5 / 5 | 4 / 5 / 4 / 5 / 4 | [md](competitors/competidores-gitlab-transcend-lookback.md) · [html](competitors/competidores-gitlab-transcend-lookback.html) |
| Stale | 5 / 5 / 4 / 5 / 4 | 4 / 4 / 3 / 3 / 4 | [md](competitors/competidores-gitlab-transcend-stale.md) · [html](competitors/competidores-gitlab-transcend-stale.html) |
| Earned Autonomy | 5 / 5 / 4 / 5 / 4 | 4 / 4 / 4 / 5 / 4 | [md](competitors/competidores-gitlab-transcend-earned-autonomy.md) · [html](competitors/competidores-gitlab-transcend-earned-autonomy.html) |

Ten more Path A Hands-off rivals were reviewed before the results came out; the prediction and its ranking are in [`competitors/prediction-before-results.md`](competitors/prediction-before-results.md). None of those ten won a prize.

What we already had going for us:
- A proof no winner has in this niche: 50 of 50 runs before a merge, and a negative control where 33 of 50 kept the fix out.
- The same flow run on a second, real project (epic-stack).
- `docs/CLAIMS.md` with a command behind every number.
- 43 `duo_workflow` pipelines, against 16 for Stale.

## Improvements to apply

Ordered by how much each one moves a judging criterion. The first four were raised by two or more of the deep reviews.

| # | Change | Criterion | Effort | Where |
|---|---|---|---|---|
| 1 | **Lead with a person and a number of our own.** Today the README, page and video open on a red pipeline and cite Google's figure. Name who loses time (the on-call developer at a small team) and measure it on our runs: CI minutes and wall time per flaky incident, before and after. | Potential Impact | medium | `README.md`, `docs/submission.md`, `site/text.js`, `video/script.tsv`, `tools/results.mjs` |
| 2 | **A judges page outside the event group, readable without login.** When the group was archived, `showcase-8b103c.gitlab.io` started redirecting to sign-in; ShakeFix and Lookback serve theirs from Cloud Run and still answer 200. Serve the site (and one "verify in 5 minutes" table, one claim per row with its run link) from the Cloud Run service or a mirror, and put that table in the first 40 lines of the README. | Presentation | low | `site/`, `README.md`, `docs/CLAIMS.md` (add a run-link column), `.gitlab-ci.yml` |
| 3 | **Pre-register a batch of controls.** Commit the expected verdict (flaky / real / not fixable) for N seeded failures before running them, then publish expected against actual, misses included. Today there is one negative control (!9, 33/50). | Technological Implementation, Innovation | medium | `cases/`, `tools/verdict.mjs`, `docs/RESULTS.md` (via `tools/results.mjs`) |
| 4 | **Make the nine stages real jobs.** The page claims nine stages; six have their own job. Add `stages:` for all nine, a package job that builds and publishes the image, a release with a canary and rollback on Cloud Run, Container Scanning, and record the deploy as a GitLab `environment:`. Then a stage table with one run link per stage. | Technological Implementation, Design, Most Stages | high | `.gitlab-ci.yml`, `ci/plumb.gitlab-ci.yml`, `docs/ARCHITECTURE.md` |
| 5 | **Split the flow into roles.** One triage flow does everything; every winner has separate agents. A verifier agent that reviews the fix's diff, separate from the one that writes it, would also answer the weakened-assert gap (today that rule lives only in the prompt). | Technological Implementation | high | `.gitlab/duo/triage-flow.yml`, `ci/plumb.gitlab-ci.yml` |
| 6 | **Put the human number in the video title and the tagline.** "9 min 47 s, no human" is already measured (`docs/DEMO.md`) but sits below the fold. | Presentation | low | `docs/submission.md`, `video/script.tsv` |
| 7 | **Fill in Built With.** 7 tags against a winners' median of 17; Workload Identity Federation, Playwright, Node.js and GitLab Pages are used but not listed. | Presentation | low | `docs/submission.md` |
| 8 | **Infrastructure as code for the Google Cloud deploy**, with budget and roles, instead of `gcloud run deploy` in CI. | Google Cloud bonus, Technological Implementation | medium | new `infra/`, `.gitlab-ci.yml` |

## Caveats

- The competitor repos were read, never executed. Test counts come from `test(`/`it(` lines and give orders of magnitude, not exact numbers.
- The 1-5 notes are the reviewers' reading of the evidence with the event's rubric, not the jury's scores, which are not published.
- The prediction missed the Hands-off winner. ShakeFix's repo lives outside the event group (`gitlab.com/nxt-spacenos-global/shakefix`), so the GitLab sweep of `gitlab-ai-hackathon/transcend-october-2026` never saw its evidence. The prediction also weighted pipeline counts and stage coverage over the problem's story, and the winners show the opposite order.
- The Pages sites of the event group redirect to login since the group was archived. When that started is unknown, so whether judges saw Plumb's page is unknown.
- "Repo publico: no" in the benchmark is a false negative: Plumb's page links `gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase`, but the script did not count that link as a repo.
