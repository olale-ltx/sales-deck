# LTX mini-site system

How to build a chapter-based LTX site like `deck/index.html`. Read `STYLE-GUIDE.md` for tokens and classes.

## Page anatomy

```
#stage
  header#appnav (+ #appnav-sub when chapter has sub-items)
  .global-padding.padding-global
    #chapter-root
      .chapter.is-on
        .page-wrapper.content-container
          .main-container
            .screen.layout-document | .layout-artboard
              section.site-section…
```

| Node | Role |
|------|------|
| `#stage` | Page shell; top padding = `--chrome-top` (nav + subnav). |
| `.global-padding` | Horizontal inset `--content-pad-x` (3vw). |
| `.main-container` | Content column; `max-width: var(--content-max)` (100rem), centered. |
| `.screen` | One navigable section in the chapter; `scroll-margin-top: var(--chrome-top)`. |
| `.site-section` | Semantic `<section>`; holds all content for that block. |

## Layout kinds

**Document** (`.layout-document` on `.screen`) — height from content. Use for chapter heroes, multi-block About pages, interactive explorers built as normal layout.

**Artboard** (`.layout-artboard`) — temporary: absolute coordinates on `--artboard-w` × `--canvas-h`, scaled to column width via `syncArtboardLayout()`. Prefer converting new work to document layout.

## Spacing

- Between consecutive `.screen` slots: `margin-top: var(--section-gap)` (12rem).
- **After a chapter hero video:** the hero lives in its own `.screen` with `.section-hero-slide`; the next `.screen` (first body content) uses **`margin-top: var(--hero-to-content-gap)` (4rem)**, not `--section-gap`. Selector: `.screen:has(> .section-hero-slide) + .screen`.
- Between blocks inside one About `.site-section`: `.about-block + .about-block { margin-top: var(--section-gap) }`.

## Typography (single system)

Use only documented classes. Sizes resolve to `var(--fs-*)` clamps on `:root`.

| Role | Class |
|------|--------|
| Display / cover | `.h1-display` |
| Page title | `.heading-style-h1` |
| Section lead | `.heading-style-h2` or `.text-size-xlarge` (pick one role per pattern) |
| Body | `.text-size-regular` |
| Eyebrow | `.section-name-new` |
| Button | `.ltx-but-base` / `.is-black` |

Do not add page-only `--fs-*` overrides on `.site-section`.

## Nav behavior

- Top nav: chapters (`MENU` in JS).
- Subnav: in-chapter items; scroll to `#id` or artboard slot.
- `scrollToTarget()` aligns slot/block under `--chrome-top` (no smooth-scroll on chapter change).

## New mini-site checklist

1. Copy `design/ltx.css`, `STYLE-GUIDE.md`, `docs/*`, `.cursor/rules/`, `.cursor/skills/ltx-mini-site/`.
2. One `index.html` (or split by chapter later); link `../design/ltx.css`.
3. Build sections with `.site-section` + system classes only.
4. Serve repo root so asset paths resolve (`/deck/`).
5. Update `DECK-STYLE-GUIDE.md` usage map if this deck introduces new roles.

## File map (this repo)

| Path | Purpose |
|------|---------|
| `deck/index.html` | Reference mini-site |
| `design/ltx.css` | Tokens + layout primitives |
| `STYLE-GUIDE.md` | Brand + type law |
| `docs/LTX-MINI-SITE-GOALS.md` | Why & non‑negotiables |
| `sales-deck-original/` | Legacy reference only — do not copy patterns |
