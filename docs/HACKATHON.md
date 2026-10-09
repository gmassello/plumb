# GitLab Transcend "Life After Code" — Event Brief

Event facts only, re-read from the event pages on 2026-10-08. Personal status, setup, competition and strategy live in `docs/NOTES.md`. Local times are ART (-03:00).

Sources: [home](https://gitlab-transcend.devpost.com/), [Official Rules](https://gitlab-transcend.devpost.com/rules) (binding; they prevail over any other event material, §11), [dates](https://gitlab-transcend.devpost.com/details/dates).

## 1. Event

- **Name:** The GitLab Transcend Life After Code Hackathon. Tagline: "The path to production at the speed of imagination".
- **URL:** https://gitlab-transcend.devpost.com/
- **Sponsor:** GitLab Inc. **Administrator:** Devpost, Inc.
- **Judges from:** GitLab, Google and Anthropic (home: "Get your work in front of judges from GitLab, Google, and Anthropic").
- **Participants:** 1304 registered (home, 2026-10-08).
- **Other links:** [resources / FAQ](https://gitlab-transcend.devpost.com/resources) · [contributor guide](https://contributors.gitlab.com/transcend-hackathon) · [project](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase) · [onboarding issue](https://gitlab.com/gitlab-ai-hackathon/transcend-october-2026/43144947/showcase/-/work_items/1) · [AI Catalog](https://gitlab.com/explore/ai-catalog) · [Duo Agent Platform docs](https://docs.gitlab.com/user/duo_agent_platform/) · Discord `#transcend-hackathon` (https://discord.gg/gitlab).

## 2. Timeline

| Milestone | Event time | Local (ART) |
|---|---|---|
| Deadline: submissions close | 2026-10-27 13:00 +00:00 | 2026-10-27 10:00 -03:00 |
| Registration opens | 2026-09-29 10:00 +00:00 | 2026-09-29 07:00 -03:00 |
| Period opens | 2026-10-05 10:00 +00:00 | 2026-10-05 07:00 -03:00 |
| Build Session (live, Missy Davies and Dennis Meister; "Oct 9, 10am ET") | 2026-10-09 14:00 +00:00 | 2026-10-09 11:00 -03:00 |
| Judging starts | 2026-10-28 10:00 +00:00 | 2026-10-28 07:00 -03:00 |
| Judging ends | 2026-11-14 17:00 +00:00 | 2026-11-14 14:00 -03:00 |
| Winners announced ("on or around") | 2026-11-16 14:00 +00:00 | 2026-11-16 11:00 -03:00 |

- The dates page differs from the Official Rules on two starts: period opens "October 05 at 5:00pm UTC" and judging "October 28 at 9:00am UTC". The table uses the Official Rules.
- The contributor guide gave 14:00 UTC for the deadline; use the earlier 13:00 UTC from the Official Rules.
- Discord office hours (from the contributor guide, not re-read): 2026-10-15 16:00 -03:00 and 2026-10-20 07:00 -03:00.
- After the deadline the submission cannot change (rules §5). Drafts can be saved on Devpost before it.

## 3. Prizes and tracks

US$45,000, all cash. Pick one **Path** and one **autonomy level**.

| Prize | Amount | Qty | Who qualifies |
|---|---|---|---|
| Path A: Start Fresh, Best Assisted / Supervised / Hands-off Agent | $4,000 / $4,000 / $5,000 | 1 each | Eligible Path A projects |
| Path B: Bring Your Own, Best Assisted / Supervised / Hands-off Agent | $4,000 / $4,000 / $5,000 | 1 each | Eligible Path B projects |
| Most Stages Covered | $5,000 | 2 (one per Path) | "touch the most DevSecOps lifecycle steps ... in the most creative way" |
| Most Environmentally Impactful | $5,000 | 1 | Opt-in on the form; must "quantify the sustainability gain using the latest public measurement methodologies and SCI frameworks" |
| Most Creative | $4,000 | 1 | Highest Innovation/Idea score, either Path |

- A project can win one Path prize **plus** one Special Prize.
- **Path A — Start Fresh:** new project created on or after 2026-10-05; you build the app, the CI/CD pipeline and the automation. Deployment optional.
- **Path B — Bring Your Own:** existing MIT-licensed open-source project (yours or a fork) imported to GitLab; automation and deployment done on or after 2026-10-05; judged on "before" (manual) vs "after" (automated). Deployment required.
- **Autonomy levels:** Assisted ("you approve every step"), Supervised ("you approve the outcome, not the individual steps"), Hands-off ("you set the intent and walk away"). "We expect submissions that go well beyond" the examples.
- **Lifecycle stages:** plan · create · verify · package · secure · release · configure · monitor · govern. "Touching the stage counts."
- Payment: within 60 days of the completed winner forms, which are due 10 business days after being sent. Non-US winners may need a W-8BEN; the sponsor may withhold tax; fees are paid by the winner.

## 4. Judging criteria

| Criterion | Weight | Rule text |
|---|---|---|
| Stage One (pass/fail) | — | "whether the ideas meet a baseline level of viability, in that the Project reasonably fits the theme and reasonably uses GitLab Duo Agent Platform" |
| Technological Implementation | equal (1/5) | "How thoroughly and skillfully does the project use GitLab to automate the post-code DevSecOps lifecycle? Does the code and pipeline config reflect genuine effort and a working, non-trivial implementation?" |
| Design | equal (1/5) | "Does the project deliver a complete, coherent end-to-end workflow, not just a technical proof of concept?" |
| Potential Impact | equal (1/5) | "Does the project make a credible, specific case for solving a real problem for a real audience — and does the solution actually address that problem based on what's demonstrated?" |
| Innovation/Idea | equal (1/5) | "How creative and novel is the concept and how inventively does it apply agentic automation compared to existing concepts?" |
| Presentation | equal (1/5) | "Does the video clearly demonstrate the automation running end-to-end? Does it communicate what problem is solved, who it's for, and why it matters? Is the overall presentation easy to follow?" |
| Stage Three: Google Cloud | up to +0.2 | "Demonstrate that you have deployed your Project on Google Cloud. This code must be included in your public repository." |

- Final score 1 to 5.2. Ties: highest score in the first criterion, then the next, then a judges' vote.
- Judging "may utilize expert panels, peer review, automated AI-driven analysis, or any combination thereof".
- Judges are "not required to test the Project and may choose to judge based solely on the text description, images, and video".
- Judges listed: Missy Davies, Mattias Michaux, Dennis Meister (GitLab), Lee Tickett (GitLab), Rajesh Agadi (Google), Luca Chun Lun Lit (Applied AI Engineer, company not published), Alan Zhang (Member of Technical Staff, company not published), Jackson Dolphin (Customer Success, company not published).

## 5. Required tech

- **GitLab Duo Agent Platform**: "Every project must use GitLab Duo Agent Platform features, such as agents, flows, or MCP clients." Proven by Stage One ("reasonably uses GitLab Duo Agent Platform") and by "Visible CI/CD pipeline history showing your automation running".
- The home page encourages "agents, flows, triggers, and MCP servers - as many features of the GitLab Duo Agent Platform" as possible.
- The project lives on GitLab.com, in the subgroup and project provisioned after contributor onboarding.
- Optional: Google Cloud deployment for the Stage Three bonus.

## 6. Submission requirements

| Item | Requirement | Limit |
|---|---|---|
| Text description | What it does, the problem it solves, how GitLab automates the post-code lifecycle; features and functionality | not published |
| Repository | Public GitLab URL with all source code, assets and run instructions; MIT license file "detectable and visible at the top of the repository page (in the About section)" | — |
| CI/CD | "The project's CI/CD pipeline history must be visible and show the automation running." | — |
| Video | Under 3 minutes ("Judges are not required to watch beyond three minutes"); shows the project functioning; uploaded to YouTube and **publicly visible** (rules §4); no third-party trademarks or copyrighted music without permission | < 3:00 |
| Path B only | URL to the original MIT-licensed project; public URL to the deployed project, live until about 2026-11-16; explanation of what was added or changed during the Submission Period | not published |
| Google Cloud bonus (optional) | Link to the live public project on Google Cloud; deployment code in the repo | — |
| Environmental prize (optional) | Opt in on the form; sustainability explanation quantified with SCI | not published |
| Language | All materials in English, or with an English translation | — |

- Form field character limits: not published (the submission form requires login).
- The project must be available "free of charge and without any restriction, for testing, evaluation and use" until judging ends.

## 7. Disqualifiers

- **Eligibility:** age of majority where you reside. Not open to residents of Brazil, China, Quebec, Russia, Cuba, Iran, North Korea, Syria, Crimea, Donetsk and Luhansk, or where U.S./local law prohibits it. Argentina is eligible. Not open to sponsor/administrator staff and families, judges or their employers.
- **Team:** individuals, teams or organizations; no team size limit published. A team appoints one Representative.
- **New work:** Path A must be created on or after 2026-10-05. Path B automation and deployment must be done on or after 2026-10-05.
- **Licenses:** everything you create is MIT and under GitLab's Developer Certificate of Origin 1.1, "including agent configuration YAML files". Third-party components must use OSI-approved licenses, compatible with yours.
- **Functionality:** must install and run consistently and "function as depicted in the video and/or expressed in the text description".
- **Support:** no project developed with financial or preferential support from GitLab or Devpost.
- **Multiple submissions:** allowed only if each is "unique and substantially different".
- **Registration:** must register and submit on Devpost; work that exists only on GitLab is not an entry.

## 8. Blockers

- **Contributor onboarding** (needed to get the GitLab project): done on 2026-10-08.
- **External agents** (Claude Agent by GitLab): need a maintainer to enable them in the subgroup; the participant role cannot. Only a blocker if the design depends on them.
- **Duo credits**: balance not visible to the participant role; ask the organizers if usage grows.
- **Devpost submission form**: submitted by the participant before 2026-10-27 13:00 +00:00.
