---
name: ltx-mini-site
description: Build or refactor LTX chapter-based mini-websites (sales decks, long presentations) using design/ltx.css and STYLE-GUIDE.md. Use when creating deck/index.html-like sites, LTX composite pages, or cleaning legacy slide/stage code.
---

# LTX mini-site

## Before editing

1. Read `docs/LTX-MINI-SITE-GOALS.md` (non‑negotiables).
2. Read `docs/LTX-MINI-SITE-SYSTEM.md` (anatomy).
3. Read `STYLE-GUIDE.md` and use `design/ltx.css` — no one-off colors or type sizes.

## Vocabulary

- Say **section**, **chapter**, **mini-site** — not slide, deck mode, or presentation.
- HTML: `<section class="site-section …">` inside `.screen`; chapter DOM lives in `#chapter-root`.
- Scroll blocks in a chapter: `.chapter-block` (not `deck-section`).
- Tab + stage explorers: `.split-layout` (1fr \| 2fr), `.split-tab-list` / `.split-tab` / `.split-tab__text`.
- `.layout-document` = flow layout; `.layout-artboard` = scaled absolute layout (legacy, avoid for new work).

## Rules

- Reuse Webflow classes: `heading-style-h*`, `h1-display`, `text-size-*`, `section-name-new`, `ltx-but-base`.
- New visual need → propose class + `STYLE-GUIDE.md` entry; do not add `#id` or single-use selectors without approval.
- Spacing: `var(--section-gap)` (12rem) between `.screen` slots; `var(--hero-to-content-gap)` (4rem) as `padding-bottom` on the hero `.screen` (same for Who); next screen `margin-top: 0`. Subtext → content: `var(--heading-to-content-gap)` (2rem) via `.heading-content-spacer` in markup — do not hardcode margins. Body section titles after heroes: `heading-style-h2 text-weight-semibold` (heroes stay `heading-style-h1`).
- Column: `--content-pad-x` + `--content-max` (100rem); nav inset must match (see `#appnav` padding in reference `deck/index.html`).
- Leave `sales-deck-original/` unchanged.

## Implementation reference

- Working site: `deck/index.html`
- Layout sync for artboards: search `syncArtboardLayout` in that file.
- Chapter nav: `MENU`, `goTo()`, `.chapter.is-on`.

## Do not

- Reintroduce presentation modes, slide counters, or per-layout-type typography tokens.
- Use `--fs-*-stage` overrides in the mini-site.
- Use font-weight 700+ or pink/green accent colors.
