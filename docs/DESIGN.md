# Plumb — Design system

Instructions for any agent that builds a visual surface for Plumb: the pitch deck, the design preview, README graphics or video cards. Use only the values below.

## Context

- **Project:** Plumb. When a `main` pipeline fails, CI re-runs the failed test and decides whether it is flaky or real. A GitLab Duo flow then fixes the test, proves the fix 50 times, and lets it merge or quarantines it.
- **What the demo shows:** a red pipeline turning green with no human action. It happens on GitLab screens: the pipeline, the MR and the summary note. Plumb has no UI of its own; this system dresses the deck and the graphics around those screens.
- **Audience:** the judges of the GitLab Transcend hackathon, who skim each entry in about a minute.
- **Sources:** a mix of two design analyses from the awesome-claude-design collection, neither of them official.
  - From the base system: layout, the 4 px spacing scale, radii, hairline borders, the type scale and component anatomy.
  - From the secondary system: the electric green accent and the code-editor block with a monospace terminal.
- **Originality:**
  - The accent is shifted toward teal and has two values: a deep green for the light theme and a bright mint for the dark theme.
  - Light is the default theme.
  - Plumb adds its own motif, the **plumb line**: a 2 px vertical accent rule that marks the one thing a surface wants you to read.
  - Brand fonts are replaced with Inter and JetBrains Mono.
  - No GitLab orange or purple, so nothing reads as an official GitLab page.

## Stack

- Plain HTML and CSS with custom properties: no framework, no Tailwind, no component library. The repo has no front-end build and adds no dependencies (`AGENTS.md`). The deck is one static HTML file exported to PDF by headless Chrome.
- Fonts come from Google Fonts only: Inter (400, 500, 600, 700) and JetBrains Mono (400, 600).
- JavaScript is allowed only for the theme toggle and the terminal effect, and never in the deck.

## Tokens

Light is the default; dark overrides it through `data-theme="dark"`. Each block sets `color-scheme`. The terminal tokens do not change between themes: the terminal is always dark.

```css
:root {
  color-scheme: light;
  --bg: #ffffff;
  --surface: #f5f6f6;
  --surface-2: #eceef0;
  --fg: #0b0c0e;
  --muted: #5b616b;
  --border: #dfe1e4;
  --border-strong: #c4c8ce;
  --accent: #08775a;
  --accent-hover: #06634a;
  --on-accent: #ffffff;
  --ring: #08775a;
  --danger: #c42b2b;
  --term-bg: #0b0d0e;
  --term-fg: #e6e8ea;
  --term-muted: #8a8f98;
  --term-ok: #2fe0a6;
  --term-fail: #ff6b6b;
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, Menlo, Consolas, monospace;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-24: 96px;
  --shadow-card: 0 1px 2px rgb(11 12 14 / 0.06), 0 4px 16px rgb(11 12 14 / 0.06);
  --plumb: 2px;
}

:root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #08090a;
  --surface: #0f1011;
  --surface-2: #18191a;
  --fg: #f7f8f8;
  --muted: #8a8f98;
  --border: #23252a;
  --border-strong: #34343a;
  --accent: #2fe0a6;
  --accent-hover: #5ae8b9;
  --on-accent: #06120d;
  --ring: #2fe0a6;
  --danger: #ff6b6b;
  --shadow-card: 0 0 0 1px rgb(255 255 255 / 0.04);
}
```

| Token | Use |
|---|---|
| `--bg` | page and slide background |
| `--surface`, `--surface-2` | cards, input fill, hover fill |
| `--fg` | body and headings |
| `--muted` | secondary text, captions, axis labels |
| `--border` | hairline borders of cards and dividers (decorative) |
| `--border-strong` | the hover border of cards |
| `--accent` | the one call to action, the plumb line, "pass" states, links |
| `--on-accent` | text on an accent fill |
| `--ring` | keyboard focus outline |
| `--danger` | "fail" states and error text |
| `--term-*` | the terminal block only |

## Typography

Inter is used for display and text, and JetBrains Mono for code, commands, job names and numbers taken from a run. The sizes are in `rem` on a 16 px root.

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| display | 5rem | 700 | 1.05 | -0.04em |
| h1 | 3.5rem | 600 | 1.1 | -0.03em |
| h2 | 2.5rem | 600 | 1.15 | -0.025em |
| h3 | 1.75rem | 600 | 1.2 | -0.02em |
| subhead | 1.25rem | 400 | 1.4 | -0.01em |
| body | 1rem | 400 | 1.5 | 0 |
| small | 0.875rem | 400 | 1.5 | 0 |
| eyebrow | 0.8125rem | 600 | 1.3 | 0.08em, uppercase |
| mono | 0.875rem | 400 | 1.6 | 0 |

In the deck, a 1920×1080 slide uses the same ratios multiplied by 1.75. Body text is never smaller than 28 px.

## Spacing, grid, radii and shadows

- **Spacing:** multiples of 4 px, through `--space-*` only.
- **Grid:**
  - Pages: 12 columns, 1200 px maximum, 24 px gutter, 16 px side padding below 640 px.
  - Slides: 1920×1080 with 120 px side padding and 96 px top and bottom padding.
- **Radii:**
  - `--radius-sm` for chips and inputs;
  - `--radius-md` for buttons;
  - `--radius-lg` for cards and the terminal;
  - `--radius-xl` for hero panels.
  - Nothing is pill-shaped except status chips.
- **Shadows:** only `--shadow-card`, only on cards. In the dark theme it becomes a 1 px light ring, because a shadow does not show on near-black.
- **Borders:** 1 px `--border` everywhere. The plumb line is the only 2 px rule.

## Components

All components inherit `font-family: var(--font-sans)`. Focus is always `outline: 2px solid var(--ring); outline-offset: 2px` on `:focus-visible`.

| Component | Default | Hover | Focus | Disabled | Loading | Error |
|---|---|---|---|---|---|---|
| Button primary | `--accent` fill, `--on-accent` text, `--radius-md`, padding 8px 14px, weight 500 | `--accent-hover` fill | ring | 50% opacity, `cursor: not-allowed` | label replaced by "Running…", `aria-busy="true"` | n/a |
| Button secondary | `--surface` fill, `--fg` text, 1px `--border` | `--surface-2` fill | ring | 50% opacity | same as primary | n/a |
| Input | `--bg` fill, 1px `--muted` border, `--radius-sm`, padding 8px 12px | border `--fg` | ring | `--surface` fill, `--muted` text | n/a | border `--danger`, message in `--danger` below, `aria-invalid="true"` |
| Card | `--surface` fill, 1px `--border`, `--radius-lg`, padding `--space-6`, `--shadow-card` | border `--border-strong` | ring when the whole card is a link | n/a | n/a | n/a |
| Plumb card | a card with a `--plumb` `--accent` left border; the one card on a surface that matters most | as card | as card | n/a | n/a | n/a |
| Status chip | `--radius-sm`, mono small; `pass` in `--accent`, `fail` in `--danger`, `flaky` in `--fg` on `--surface-2` | none | n/a | n/a | n/a | n/a |
| Terminal | `--term-bg`, `--term-fg`, mono, `--radius-lg`, padding `--space-6`, a 3-dot title bar in `--term-muted` | none | n/a | n/a | caret blinking at the end | lines in `--term-fail` |
| Stat | number in display mono weight 600, label in eyebrow `--muted` | none | n/a | n/a | n/a | n/a |

## Screens

Plumb has no app screens; there is no `docs/UX.md`. These are the surfaces that use the system:

- **Deck** (`docs/deck.html`, owned by `hackathon-deck`): title, problem, solution, demo, how it works, results, criteria, what's next, links. It uses the stat, the plumb card, the terminal, the status chip and real GitLab screenshots inside a card.
- **Design preview** (`docs/design-preview.html`): every token and component, plus the terminal effect.
- **README and social graphics**: the terminal and the stat only.

## Effects

- **Self-typing terminal** (headline effect; preview and video cards, never the PDF deck). It types the demo run line by line, using only numbers from `docs/CLAIMS.md`. The run is pipeline 2948453748: verdict 3/10 flaky, MR !10, proof 50/50, red to note in 9 min 47 s. Each line appears after the previous one finishes, at about 18 ms per character. The caret blinks 5 times, then stays solid (WCAG 2.2.2). Under `prefers-reduced-motion: reduce`, every line shows at once and the caret does not blink. In the deck it is static: the final state, because a PDF does not animate.
- **Plumb line draw-in** (secondary): a plumb card's left rule grows from 0 to full height over 400 ms when it enters. With `prefers-reduced-motion: reduce` it is drawn from the start.
- No other motion: no gradients, aurora, marquee or 3D tilt.

## Rules

- Do:
  - Use only these tokens.
  - Use one accent per surface and at most one plumb card per slide.
  - Use mono for anything that came out of a run: job names, counts, MR numbers, durations.
  - Use real screenshots.
- Don't:
  - Add a second accent colour.
  - Use GitLab orange or purple.
  - Use gradients or pill buttons.
  - Use a font other than Inter and JetBrains Mono.
  - Use drawn mockups of GitLab.
  - Write a number that `docs/CLAIMS.md` does not list.
  - Use colour alone for pass and fail: the chip always carries the word.
- A component that is not in this file is not built. Add it here first.

## Verification checklist

- [ ] Both themes render; the toggle updates `data-theme` and survives a reload. `localStorage` is wrapped in try/catch.
- [ ] The theme script runs inline in `<head>` before the CSS, so the first paint has the right theme.
- [ ] At 375 px there is no horizontal scroll and the terminal wraps.
- [ ] Every interactive element shows the `--ring` outline on keyboard focus.
- [ ] Contrast, measured in each theme:

| Pair | Light | Dark |
|---|---|---|
| `--fg` on `--bg` | 19.57 | 18.73 |
| `--muted` on `--bg` | 6.24 | 6.13 |
| `--muted` on `--surface` | 5.76 | 5.86 |
| `--accent` on `--bg` | 5.53 | 11.70 |
| `--on-accent` on `--accent` | 5.53 | 11.21 |
| `--danger` on `--bg` | 5.63 | 7.18 |
| `--term-fg` / `--term-ok` / `--term-muted` / `--term-fail` on `--term-bg` | 15.86 / 11.44 / 5.99 / 7.02 | same |

  `--border` and `--border-strong` are decorative and exempt. The input border uses `--muted`, which is above 3:1.
- [ ] `prefers-reduced-motion: reduce` shows the terminal's final state without animation.
