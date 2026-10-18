# UX

The UX of Plumb's project page, https://showcase-8b103c.gitlab.io/ (`site/`), from a judge's point of view: someone with no context who has a few minutes to spend. The booking app in `src/public/` is out of scope. It exists to be tested, not to be judged.

## Review 2026-10-18

### Current flow

One page, read from top to bottom. It has no login and no input, and it uses one click at most.

1. **Hero** (`site/index.html:40-51`):
   - the eyebrow, the name and a one-sentence lead;
   - two CTAs: "See it on GitLab", the primary, goes to the repository; "How it works" scrolls down the page.
2. **Terminal replay** of pipeline 2948453748. It types itself line by line (`site/app.js:34-44`).
3. **The problem** (`site/index.html:54-62`): the Google figure, the 3/10 fact and how this differs from retry or quarantine.
4. **How it works** (`site/index.html:64-76`): five numbered steps.
5. **The real run** (`site/index.html:78-88`): four screenshots, each linked to its GitLab page.
6. **Every case** (`site/index.html:90-110`): eight rows, each linked to a real pipeline.
7. **Results** (`site/index.html:112-122`): four stats, each linked to its source.
8. **Honest limits** (`site/index.html:124-134`).
9. **Try it** (`site/index.html:136-146`): the repository, the pipelines, the live demo app, the results and "Video: coming soon".

**The first moment a judge is left without a next step:** the demo video exists and is public, but the page never links it.

### Findings

| # | Finding | Heuristic or law | Evidence | Proposal | Impact | Effort |
|---|---|---|---|---|---|---|
| F1 | The page says the video is coming, but it is already public | 1 Visibility of system status; 10 Help and documentation | `site/text.js:96`, `site/text.js:193`, `site/index.html:144` | Turn the `<span>` at `site/index.html:144` into a link to https://youtu.be/ViidpLXD_PY. Set `link_video` to "Demo video (2:02)" and, in Spanish, "Video de la demo (2:02)" | high · Presentation | S |
| F2 | The primary CTA goes to the code. Of everything the page offers, the code is the slowest place to see the proof | Hick's Law; Peak-End Rule | `site/index.html:45`, `site/text.js:10-11` | Primary CTA: `hero_cta` "Watch the 2-min demo" / "Ver la demo de 2 min", linking to the video. Secondary: `hero_cta2` "See it on GitLab" / "Verlo en GitLab", linking to the repository. "How it works" leaves the hero, since the next scroll reaches it | high · Presentation | S |
| F3 | "Live demo app" opens a booking page and says nothing about what it is | 2 Match between system and real world | `site/index.html:142`, `site/text.js:94`, `site/text.js:191` | `link_app`: "Live demo app (the booking page under test)" / "App de demo en vivo (la página de reservas que se prueba)" | medium · Design | S |
| F4 | The page says "set aside", while the video and the entry say "quarantine" | 4 Consistency and standards | `site/text.js:57`, `site/text.js:87`; against `video/script.tsv:31`, `docs/submission.md:20` | Use "set aside (quarantined)" the first time in `path2_end` and in `limit3`, with the Spanish equivalent "apartado (en cuarentena)" | low · Innovation/Idea | S |
| F5 | The terminal prints `$ duo triage-flow`, a command that does not exist. The flow starts from a pipeline event, not from a command | 2 Match between system and real world | `site/app.js:38` | Change the line to `→ triage-flow (GitLab Duo, started by the pipeline event)`, which names the real trigger | low · Technological Implementation | S |
| F6 | The 50/50 screenshot is from !11, while the story on the page is !10's. The caption has to say so in parentheses | 4 Consistency and standards | `site/index.html:85`, `site/text.js:42`, `site/text.js:139` | If !10's pipeline has a `fix-proof` with 50 passed (check with `glab ci list` on its branch), capture it into `site/img/proof-50.png`, point the link at it and drop the parenthesis from `shot3_caption`. If it does not, leave the shot as it is | medium · Technological Implementation | M |

F1 to F6 were applied on 2026-10-18. F6's proof is the `fix-proof` job log, because !10's pipeline has no test report.

Contrast, focus, keyboard and widths are not measured here; they belong to `hackathon-ux-ud-review`.

### Proposed flow

1. **Hero:**
   - "Watch the 2-min demo" → https://youtu.be/ViidpLXD_PY (F2), with "See it on GitLab" as the secondary CTA;
   - the terminal replay names the real trigger (F5).
2. **Problem, How it works, The real run:** unchanged. The proof shot comes from the same MR as the story (F6).
3. **Every case, Results, Honest limits:** "set aside (quarantined)" matches the video and the entry (F4).
4. **Try it:** the video is linked (F1), and the demo app says what it is (F3).

**The peak** is still the real run and the 33/50 stat. **The end** is the "Try it" list, which now starts from something a judge can watch.
