# LTX visual language

Extended style guide for new LTX web presentations. The source of truth is the LoRA training guide (`olale-ltx/lora-training-ebook`): `styles.css`, `index.html`, and `app.js`. Those values mirror the ltx.io Webflow collections **LTX brand colors** and **Typography** (viewport min 20rem, viewport max 90rem).

Use this guide, `design/ltx.css`, and `design/ltx-logo-black.svg` when building in this folder. `sales-deck-original/` is the previous 2026 deck. Its palette (`#111`, `#ffffff` canvas, green `#33e07a`, heavy weights) is not part of this language.

## What to carry over

Carry the color, type, spacing, hairlines, buttons, media cards, numbered indexes, and motion. Do not copy the ebook’s 30/70 reading rail onto a slide unless the new piece is a long scrolling page.

| Piece | Use it for |
|---|---|
| `design/ltx.css` | Tokens, type classes, buttons, links, media cards, pills, indexes, chart labels, quotes, tables |
| `design/ltx-logo-black.svg` | The LTX mark. On footage, invert it with `filter: brightness(0) invert(1)` |
| `.ltx-page` on `<body>` | A scrolling page. Leave it off a fixed 1920×1080 stage |
| `--fs-*-stage` | Type on a 1920×1080 canvas. The `vw` clamps are for the browser viewport |

## Voice

Short sentences. Titles are statements, not shouty labels.

### Casing (deck + nav)

Use three layers consistently:

1. **Statement headlines** — sentence case. Slide H1/H2 that read as copy (often ending with a period): cover line, chapter intro blurbs, `.nx-h`, `.ctrl-h`, customer story `.cs-h`, section-hero intro `heading-style-h2`, and body text.
2. **Muted caps kickers** — **`.chart-label.is-caps`** (and Webflow **`.section-name`**, which shares the same tokens). Group lines (`.nx-cat`), control kickers, bridge copy, bracket chart tags, and card categories. Write source in sentence case; CSS uppercases. Diagram lane labels use plain **`.chart-label`** (sentence case in markup) unless they are a hub title (add **`.is-caps`**).
3. **Short labels** — Title Case (site mega-menu style). Top nav and agenda chapters, tabs (`.nx-tab-lbl`, `.industry-tab__title`, `.pgx-item h4`, `.cap-btn` / `.cap-title`, workflow accordion labels, card titles on feature grids, licensing tiles, next-steps stages, commercial model names, and matching slide `data-label` values when they name a section.

Chapter **section heroes** and matching page titles use sentence case (keep product names like LTX as written); the paragraph below stays a sentence-case statement. Nav, agenda, and short UI labels stay Title Case.

A lead can be one sentence per line on a wide layout (`<br>` between sentences, `text-wrap: balance`). On a narrow layout those breaks disappear and the lead becomes one paragraph.

Numbers in a list are zero-padded (`01`), set in **`.index-num`** (Aeonik, `--fs-tiny`, `tabular-nums`, always `--ltx-black`).

## Color

Values are the Webflow **LTX brand colors** collection. Page ground is off-white, not white. Ink is `#0b0b0b`.

| Token | Webflow name | Value | Use |
|---|---|---|---|
| `--ltx-black` | black | `#0b0b0b` | Ink, active states, primary button, focus, selection |
| `--ltx-grey` | grey | `#333333` | Secondary text. Also dark fills and the media fallback before footage loads |
| `--ltx-grey-medium` | grey-medium | `#474747` | Supporting copy |
| `--ltx-grey-light` | grey-light | `#707070` | Muted text, eyebrows, captions |
| `--ltx-grey-muted` | grey-muted | `#858585` | Inactive numerals, quiet labels |
| `--ltx-grey-line` | grey-line | `#d2d2d7` | Hairlines and borders |
| `--ltx-offwhite` | offwhite | `#e7e8eb` | Page and slide background |
| `--ltx-white` | white | `#f9f9f9` | Cards, panels, text on footage. The deck uses this wherever a design would have reached for pure white |
| `--ltx-slate-dark` | slate-dark | `#2e3445` | Accent. Current position on progress and position marks |
| `--ltx-slate-medium` | slate-medium | `#868ea5` | Accent. Progress so far. Also the soft-fill base. Not a text color |

Semantic aliases in `design/ltx.css`:

| Token | Points at | Use |
|---|---|---|
| `--color-bg` | offwhite | Page |
| `--color-surface` | white | Cards, drawers, panels |
| `--color-ink` / `--color-text` | black | Body and titles |
| `--color-text-secondary` | grey | Supporting copy |
| `--color-text-muted` | grey-light | Inactive nav, captions, eyebrows |
| `--color-text-subtle` | grey-muted | Index numerals |
| `--color-border` | grey-line | Hairlines |
| `--color-soft-fill` | `rgba(134, 142, 165, 0.1)` | Code chips, quiet fills |
| `--color-active-fill` | `#dde0e6` (slate-medium wash) | Selected/hover wash on list rails and shell tabs |
| `--color-on-media` | white | Type sitting on footage |
| `--color-accent` | slate-dark | Accent |

Pink is not part of the system. Active and selected states are black. Slate-dark and slate-medium are the only accents, used on progress and position marks. Purple is not used. The ebook (`lora-training-ebook/styles.css`) still uses older grey values (`#636367`, `#999999`) that Webflow has since deleted; this folder follows Webflow.

Selection is inverted: black background, white text. Focus is a 2px black outline, 2px offset. Do not remove it.

## Type

Aeonik is the face. Inter is the fallback. JetBrains Mono is for code only.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<script src="https://use.typekit.net/emb1gsr.js"></script>
<script>try{Typekit.load()}catch(e){}</script>
```

Kit `emb1gsr` is the Adobe Fonts kit the guide already loads. Stack:

```css
font-family: "Aeonik", "Inter", Arial, system-ui, -apple-system, sans-serif;
```

Smoothing: `-webkit-font-smoothing: antialiased` and `text-rendering: optimizeLegibility`.

### Scale

Values are the ltx.io site’s published classes. Clamps run from a 20rem viewport to a 90rem viewport. Class names match Webflow.

| Style | Class | Max size | Line-height | Tracking | Weight |
|---|---|---|---|---|---|
| Display | `.h1-display` | 6rem | 1 | −0.035em | 400 |
| H1 | `.heading-style-h1` | 4.5rem | 1 | −0.03em | 400 |
| H2 | `.heading-style-h2` | 2.8rem | 1.1 | −0.03em | 400 |
| H3 | `.heading-style-h3` | 2.2rem | 1 | −0.025em | 400 |
| H4 | `.heading-style-h4` | 1.75rem | 1.1 | −0.02em | 500 |
| H5 | `.heading-style-h5` | 1.5rem | 1.1 | −0.01em | 500 |
| H6 | `.heading-style-h6` | 1.25rem | 1.3 | −0.02em | 500 |
| X-large | `.text-size-xlarge` | 1.5rem | 1.3 | 0 | 400 |
| Large | `.text-size-large` | 1.375rem | 1.3 | −0.015em | 400 |
| Medium | `.text-size-medium` | 1.125rem | 1.3 | 0.001em | 400 |
| Regular | `.text-size-regular` | 1.03125rem | 1.1 | 0.01rem | 400 |
| Small | `.text-size-small` | 0.9375rem | 1.2 | 0.01rem | 400 |
| Tiny | `.text-size-tiny` | 0.8125rem | 1.1 | 0.002rem | 400 |
| Index numeral | `.index-num` | 0.8125rem | 1.1 | 0.002rem | 400 |
| Chart label | `.chart-label` | 0.8125rem | 1.1 | 0.002rem | 400 |

`.index-num` uses the tiny scale plus Aeonik, `tabular-nums`, and always `--ltx-black` (not a general body class).

`.chart-label` is the tiny scale, weight 400, `--ltx-grey-muted` — for diagram lanes, spec captions, and (with **`.is-caps`**) deck kickers. (The old name **viz-label** meant “visualization”; **chart-label** is clearer.)

Line-height tokens: `--lh-tiny` 0.95, `--lh-compact` 1, `--lh-small` 1.1, `--lh-normal` 1.1, `--lh-medium` 1.3, `--lh-large` 1.4, `--lh-xlarge` 1.5. Regular, tiny, and H5 use `--lh-normal`; `.text-size-small` sets `line-height: 1.2` directly. Multi-line body in slides often sets `--lh-medium` explicitly in component CSS.

Utilities with Webflow names: `.text-weight-light` (300), `.text-weight-normal` (400), `.text-weight-semibold` (600), `.text-style-allcaps`, `.text-style-muted` (opacity 0.6), `.text-balanced`, `.text-style-quote`.

Weights in use: 400 for display through H3, body, and buttons. 500 for H4–H6 and active labels. Do not use 700, 800, or 900.

### Section eyebrow (Webflow)

Webflow component **page-name-eyebrow**, wrapper **`section-name-new`**. Brackets are hidden. Inner **`.section-name`** uses the same tokens as **`.chart-label.is-caps`** (tiny, 400, muted, uppercase).

```html
<div class="section-name-new">
  <div class="text-scramble">[</div>
  <p class="section-name">About LTX</p>
  <div class="text-scramble">]</div>
</div>
```

In the deck, prefer explicit **`chart-label is-caps`** on kickers; keep **`section-name`** inside **`section-name-new`** for bracket chart tags.

### Chart label (diagrams and spec strips)

Class **`.chart-label`** in `design/ltx.css` for labels **inside** visuals: track names (`Video` / `Audio`), sync hints (`What you see`), captions under metric values, step tags on frames. Same scale as **`.text-size-tiny`**, weight **400**, `--ltx-grey-muted`. Default casing follows the source string; add **`.is-caps`** for uppercase kickers and hub titles.

On footage or dark scrims, add **`.is-on-media`** (light type at ~72% white). Active/highlight states can override color in component CSS (e.g. live A/V beat → ink). A second line in the same box can sit in **`<em>`** (sentence case, same muted color; no extra uppercase).

```html
<span class="pgx-av-lbl chart-label">Video</span>
<div class="pgx-av-cue chart-label">What you see</div>
<span class="mlbl chart-label">Max resolution</span>
<span class="pgx-shot-lbl chart-label is-on-media">Step</span>
<p class="nx-card-cat chart-label is-caps">Generation</p>
<p class="nx-cat chart-label is-caps">Built for real production</p>
```

The same tokens apply to legacy hooks in the deck (prefer adding `.chart-label` in markup): `.wm-node-lbl`, `.adv-bar-lbl`, `.adv-mlbl`, `.dash-metrics .mlbl`, `.pr-card-lbl`, `.pr-slider-scale span`, `.uf-tl-months span`, `.nx-prog-lbl`, `.cs-metric-lbl`, `.cs-rail-ind`, `.cs-section-lbl`, `.cs-hero-stat .lbl`, `.cs-wf-legend span`, `.chal-col-head`, `.compare-col .lbl`, `.example-strip .cell .lbl`. Exception: `.chal-cols-dense .chal-col-head` stays body-style row titles (not uppercase).

### Type in the sales deck

The deck is a scrolling site, not a separate “presentation mode.” **One type system everywhere:** `design/ltx.css` **`--fs-*` clamps** on `:root`, applied through Webflow classes (`h1-display`, `heading-style-h1` … `heading-style-h6`, `text-size-*`). Do not override `--fs-*` on `.site-section` by layout kind.

| Class | Token |
|---|---|
| `.h1-display` | `--fs-display` |
| `.heading-style-h1` | `--fs-h1` |
| `.heading-style-h2` | `--fs-h2` |
| … | … |

**Artboard sections** (`.layout-artboard`, scaled by `syncArtboardLayout()`) use the same classes; the whole artboard is `transform: scale(...)`. No second `--fs-*-stage` pin in the deck.

**`--fs-*-stage` tokens** in `design/ltx.css` are for a literal 1920×1080 canvas (`.ltx-page` off, no slide transform). The deck does not use them.

Tracking and line-height stay on the shared tokens. `text-wrap: balance` on titles and leads. `text-wrap: pretty` on index titles that wrap.

## Space

| Token | Value |
|---|---|
| `--space-3xs` | 0.25rem |
| `--space-2xs` | 0.5rem |
| `--space-xs` | 0.75rem |
| `--space-sm` | 1.25rem |
| `--space-md` | 1.75rem |
| `--space-lg` | 2.5rem |
| `--space-xl` | 4rem |
| `--space-2xl` | 6rem |
| `--heading-to-content-gap` | 2rem — subtext → content (and title/chips → stage). Use `.heading-content-spacer` in markup |

Use the scale. Do not invent a one-off `18px` gap when `--space-sm` or `--space-md` is close. For subtext → content (and title/chips → stage), use `.heading-content-spacer` / `--heading-to-content-gap` (2rem), not a one-off margin.

### Deck page layout (chapter scroll)

The deck is a mini-website: one scrollable chapter per top-nav item. Structure each chapter as:

`#stage` → `.global-padding` (3vw inline) → `#chapter-root` → `page-wrapper` → `main-container` → `.screen` / `.chapter-block`

| Class | Role |
|---|---|
| `.page-wrapper` | Full-width chapter shell |
| `.global-padding` / `.padding-global` | Horizontal inset for all deck content (`--content-pad-x`, 3vw) |
| `.main-container` | Content column capped at `--content-max` (100rem), centered inside the 3vw padding; nav uses the same inset so the logo lines up with the column |
| `.chapter-block` | One scroll block inside a chapter (about article, control explorer, etc.) |
| `.split-layout` | Shared **1fr \| 2fr** grid for tab list + stage (`--split-cols`, `--split-gap` 3rem). Use on Industries, World Model, control explorer, Production-grade explorer, etc. |
| `.split-tab` / `.split-tab-list` | Vertical tab rail in a split layout (title + `.split-tab__text` body). Active/hover: **3px left rail** (`.industry-tab`, `.ctrl-nav-item`). Horizontal line variant archived in `docs/patterns/tab-indicator-horizontal-line.md`. |
| `.ltx-surface` | White panel on off-white ground: `--ltx-white` (`#f9f9f9`), **no outer border** (keep tab hairlines inside), `--radius-md` (0.5rem). Typography and tab rows unchanged — do not flex-shrink tab copy. |

Fixed-artboard slides (absolute layout) are drawn on a 90rem × 1080 artboard, where `--content-gutter` resolves to 0, and scaled to the column. Covers use the full 1920 artboard with the gutter forced to 0. Migrate those artboards into `.chapter-block` document flow over time.

A scrolling page sits in `.container`: max-width `100rem`, horizontal padding `clamp(1rem, 3.5vw, 3rem)`.

Hairlines need equal air on both sides. The gap above a rule is measured from the last line of copy, which still carries half its leading under the descenders. The gap below a rule starts on a hard edge (a cover, a title). Trim that slack, or the rule looks closer to the block above it. In the ebook this is `margin-bottom: calc((1em - 1lh) / 2)` on the last child, with `text-box-trim: trim-end` where supported.

Padding that belongs to an open accordion lives on the open state only. A `0fr` grid row zeroes the content box and leaves the padding, so closed rows otherwise keep a gap.

## Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 3px | Focus chips, small controls |
| `--radius-chip` | 0.25rem | Bordered tag / filter chips (`.ltx-chip`) |
| `--radius-btn` | 0.3rem | Buttons. This is not `--radius-sm` |
| `--radius-md` | 0.5rem | Media cards, figures, code cards |
| `--radius-pill` | 999px | Chapter pills |

Corners stay small. Do not round a card to 10px or more.

## Hairlines and indexes

Dividers are 1px, color `--color-border`. They are not 2px and they are not grey-light.

A numbered row is a grid: a fixed number column, then the title.

```css
grid-template-columns: var(--nav-num-col) minmax(0, 1fr);
```

`--nav-num-col` is `calc(2ch + 0.08em)`. It only resolves to the right width when it is read on an element whose font-size is the number’s font-size. Sub-items indent with `padding-left: calc(var(--nav-num-col) + gap)` on that same font-size, so they line up with the title even when the title wraps.

Inactive titles are muted. Hover and the active row go to ink. The active title is weight 500. Numerals use **`.index-num`** (same tokens as `.index__num` in the list pattern) and stay `--ltx-black` in every state.

Read-progress, when a long page has it, is a 1px black bar on the active row only (`transform: scaleX(var(--progress))`, origin left). It tracks scroll. It does not animate on click. The row borders stay thin.

Classes in `design/ltx.css`: **`.index-num`** (standalone span in split tabs, agenda, feature lists); list markup **`.index`**, **`.index__row`**, **`.index__num`**, **`.index__title`**, **`.is-active`**.

```html
<span class="index-num">01</span>
<h5 class="heading-style-h5">Deployment</h5>
```

Do not use `.index-num` for display-scale stats, divider chapter numbers, or panel counters (those keep their own heading scale).

## Buttons

Class `.ltx-but-base`, the ltx.io Webflow button. Two variants on light.

| | Primary `.ltx-but-base.is-black` | Secondary `.ltx-but-base` |
|---|---|---|
| Fill | `--ltx-black` | transparent |
| Label | `--ltx-white` | `--ltx-black` |
| Border | `--ltx-black` | `--ltx-black` |

Shared: padding `0.8rem 1.6rem 0.9rem` (extra pixel of padding under the label, so it sits optically centered), radius `0.3rem`, 1.1rem, weight 400, tracking `0.03rem`, line-height 1. Hover lifts `translateY(-3px)` over 0.35s with `cubic-bezier(0.165, 0.84, 0.44, 1)`. `.is-small` tightens the padding. No shadow, no pill radius, no filled grey.

Group them with `.nav-ctas` (`display: flex; gap: 1rem`). In a narrow drawer, stack them full width with `--space-2xs` between. The ebook still uses its older `.ltx-btn` names for the same button.

Primary is the forward action (Talk to Sales). Secondary is the lighter one (Try Now). External links use `target="_blank"` and `rel="noopener noreferrer"`.

## Tag chips

Class **`.ltx-chip`**: 1px `--color-border`, **`--radius-chip` (0.25rem)**, `--ltx-white` fill, `text-size-small` scale. Inactive label `--ltx-grey-light`; hover darkens border; **`.active` / `.is-on` / `aria-selected="true"`** uses black border and ink at weight 500. Wrap rows with `flex-wrap` and ~`0.5rem` gap (no dot separators). Used on capability tabs (`.cap-btn.ltx-chip`), production LoRA toggles (`.pgx-chip.ltx-chip`), and matching filters on ltx.io.

## Links

Inline links have no `text-decoration`. A 1px `currentColor` rule sits 2px under the text, full width, and retracts on hover or focus (`scaleX(1)` from the left, then `scaleX(0)` toward the right, 0.3s ease). Class: `.draw-underline`.

When `prefers-reduced-motion: reduce` is set, drop the pseudo-element and use a normal underline with `text-underline-offset: 4px`.

The logo is a link to `https://ltx.io/` with `aria-label="LTX"`. The mark is `design/ltx-logo-black.svg`, 91×39. Header height is about 22px. Hero height is `clamp(24px, 0.8rem + 1.1vw, 34px)`. Rail height is `clamp(20px, 0.875rem + 0.6vw, 28px)`.

## Media cards

Footage fills a rounded card. Copy sits at the bottom-left, in white, on a scrim. The card’s own background is `--ltx-grey` so a slow video does not flash white.

```css
--scrim:
  linear-gradient(to top, rgba(11, 11, 11, 0.55) 0%, rgba(11, 11, 11, 0.18) 42%, rgba(11, 11, 11, 0) 72%),
  linear-gradient(100deg, rgba(11, 11, 11, 0.32) 0%, rgba(11, 11, 11, 0) 45%);
```

The scrim is enough for white type and leaves the top and the right side of the frame open. Do not lay a flat black overlay on the whole image.

Classes: `.media-card`, `.media-card__media`, `.media-card__scrim`, `.media-card__inner`, `.media-card__title`.

Ebook specifics worth keeping when the layout is a cover:

- Hero min-height `min(78vh, 44rem)` on desktop, `min(70vh, 32rem)` under 900px. Inset it by the page padding so the card has the same gap on all four sides.
- Chapter covers use `aspect-ratio: 1080 / 520`. Under 720px, `min-height: 17rem` so the title is not crushed. Title `max-width: 27rem` so it breaks to two lines and not three.
- A chapter pill (`.pill`) sits above the title: white text, 1px border at 72% white, fill `rgba(11, 11, 11, 0.3)`, `backdrop-filter: blur(6px)`, padding `0.5rem 1rem`.

### Video

Use two `<video>` elements, desktop and mobile. Do not use `<source media>`. Browsers evaluate that only on the first load and never again. Show one, `display: none` the other, and pause the hidden one.

Attributes: `autoplay muted loop playsinline preload="metadata"` (mobile can be `preload="none"`), `disablepictureinpicture`, `aria-hidden="true"`, `tabindex="-1"`, plus a `poster`. `object-fit: cover`.

Baked captions and letterbox: many demo clips have titles, subtitles, and stage labels painted into the video pixels (not live HTML). Those must stay fully visible. Do not use `transform: scale(…)` letterbox-crop zooms to hide baked black bars — that clips edge captions. Prefer readable baked text over edge-to-edge fill; thin letterbox bars may show. When labels sit at the frame edges (Multi-Keyframe, Extend), use `object-fit: contain` instead of cover.

## Quotes, code, tables

Quote: `.text-style-quote` (Webflow). 0.1875rem black left rule, padding `0.75rem 1.25rem`, 1.25rem type, line-height 1.5.

Inline code: mono at `0.88em`, soft fill, padding `0.12em 0.35em`, radius 3px. Class `.ltx-code`.

Code card: soft-fill panel, radius `--radius-md`, padding `1.5rem`, mono `0.9rem`, grey-medium, `white-space: pre`, horizontal scroll. Class `.code-card`.

Tables use the surrounding type size, not a larger embed size. Border `rgba(11, 11, 11, 0.12)`. Header weight 700 on `rgba(11, 11, 11, 0.03)`. Cell padding `12px 14px`, less on a phone (`7px 9px`). Wrap the table and let it scroll (`min-width: 480px` under 768px) instead of squashing columns. Classes `.comparison-table-wrapper` and `.comparison-table`.

Figures are full width, radius `--radius-md`. The figure owns the margin on both sides (`--space-lg` desktop, `--space-sm` under 900px) so the next heading’s margin does not collapse into it. Captions are small, grey-medium, `--space-xs` above the image.

## Motion

| Token | Value |
|---|---|
| `--ease-out-soft` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-btn` | `cubic-bezier(0.165, 0.84, 0.44, 1)` |
| `--transition-fast` | 0.14s |
| `--transition-base` | 0.24s |
| `--transition-panel` | 0.34s |
| `--transition-open` | 0.5s |

Color and small moves use fast or base. Panels (drawer, chevron) use panel. Accordions use open.

Open a nested list with `grid-template-rows: 0fr` to `1fr` and fade opacity. Do not animate `height: auto`.

`prefers-reduced-motion: reduce` collapses animation and transition duration to `0.001ms`. Honor it before adding a new animation.

On a scrolling page, smooth wheel and trackpad with Lenis, and do not start Lenis when reduced motion is requested. In-page links jump (`behavior: auto` / Lenis `immediate: true`). Native `scroll-behavior` stays `auto`. Menu jumps are not a scroll animation.

## Breakpoints from the guide

| Width | What changes |
|---|---|
| ≤ 900px | Sticky rail hides. Mobile bar and drawer take over. Chapter padding tightens from `--space-2xl` to `--space-lg`. Hero drops its own logo because the bar already has one |
| ≤ 768px | Tables scroll instead of shrinking the first column |
| ≤ 720px | Chapter cover gets `min-height: 17rem` |
| ≤ 440px | Display title may wrap |

900px is the layout break. Do not add a second, nearby breakpoint for the same switch.

Mobile bar: fixed, `z-index: 20`, fill `hsla(0, 0%, 97.65%, 0.55)`, `backdrop-filter: saturate(140%) blur(10px)`, hairline along the bottom. Drawer is a surface sheet, shadow `0 8px 24px rgba(0, 0, 0, 0.06)`, scrim `rgba(0, 0, 0, 0.18)`. Body scroll locks while it is open. Escape closes it. Only one chapter’s sub-list is open at a time.

## Layout, when the piece scrolls

Desktop shell: `grid-template-columns: minmax(0, 30%) minmax(0, 1fr)`, gap `clamp(3rem, 7vw, 8rem)`. The rail is sticky, `top: --space-md`, and scrolls inside itself if the list is taller than the viewport. Content is `minmax(0, 1fr)` so media cannot blow out the column.

Chapters are separated by a hairline and `--space-2xl` of padding (`--space-lg` on a phone). The first chapter has no top rule. `scroll-margin-top` on a chapter is `--space-md`; on an in-chapter heading it is `5rem`, so a jump does not hide the title under the bar.

## Applying this to the sales deck

The sales deck is a chapter-based scroll site (not a scaled 1920×1080 stage). Restyle sections with this language:

- Ground a light slide with `--ltx-offwhite` or `--ltx-white`. A dark slide uses `--ltx-black`, with `--ltx-white` type. Grey fills a media card before footage loads.
- Titles use the shared heading/display classes and `--fs-*` clamps, weight 400 (or 500 from H4 down). Do not revive 70px / weight 600 as a special slide title.
- Section numbers stay muted and tabular, not 100px extra-bold.
- Footage lives in a `.media-card` with the shared scrim, radius `--radius-md`.
- Dividers are `--color-border`, inset from the slide edge by a consistent pad (the ebook’s `--container-pad` idea, not a new inset per slide).
- Actions are `.ltx-but-base`. One primary (`.is-black`), one secondary.
- Eyebrows are `.section-name-new`. Accents are slate-dark and slate-medium on progress and position only; never pink or purple.
- Motion stays inside the duration and easing tokens. A slide change can fade; it should not bounce.

Leave `sales-deck-original/` untouched as the reference cut. New slides live outside that folder and link `design/ltx.css`.

## Markup habits

- BEM: `block__element--modifier`. State classes are `is-open`, `is-active`, `is-expanded`.
- Prefer a class on a heading (`.heading-style-h2`) so the visual size and the document outline can differ.
- Logo and cover video are decorative beside a text title: empty or short `alt` on the logo when a sibling already names LTX, `aria-hidden` on the video.
- Buttons that open a panel expose `aria-expanded` and `aria-controls`.
- Do not put secrets, access codes, or sheet ids in front-end comments.

## Do not

- Set the page to pure white or add a green or purple accent.
- Use font-weight above 700, or 700 outside table headers.
- Animate layout with `height`, `top`, or `margin` when transform or `grid-template-rows` will do.
- Use `<source media>` to swap cover videos.
- Smooth-scroll in-page navigation.
- Let a closed accordion keep its open padding.
- Size type with raw `vw` inside a scaled 1920×1080 stage.
