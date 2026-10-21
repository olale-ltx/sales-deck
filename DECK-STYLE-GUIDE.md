# Mini-site style usage map

Which **STYLE-GUIDE** classes this reference site uses, and where. Not a second design system—an audit of `deck/index.html`.

Visual review: `http://127.0.0.1:8790/deck/style-reference.html`

The brand source stays `STYLE-GUIDE.md` and `design/ltx.css`. This file is the deck’s usage map: which of those styles appear, what they were applied to, and the single job each one should keep.

## What went wrong

The first pass mapped each old pixel size to the nearest LTX step. The same role then landed on several steps. Shared Webflow classes are on the cover, the slide titles, the eyebrows, and three buttons. Everything else is still a one-off rule.

Weight is the other break. Display through H3, body, and buttons are 400 in the system. H4–H6 and active labels are 500. The deck has about 118 rules at 500, because old 600–900 weights were flattened to 500.

H5 is defined and unused. Grey-medium is in the palette and barely has a job.

## Lock

Applied on desktop. One role, one class, one color, one weight.

| Role | Class | Color | Weight | Job |
|---|---|---|---|---|
| Cover and close | `.h1-display` | black | 400 | Cover headline, “Thank you” |
| Section divider | `.h1-display` | black; number is grey-light | 400 | “01 Who we are” and the other openers |
| Slide title | `.heading-style-h1` | black | 400 | The one title on a content slide |
| Panel heading | `.heading-style-h3` | black | 400 | The main heading inside a slide, under the title |
| Card or row title | `.heading-style-h5` | black | 500 | Cards, list rows, tabs, stage names |
| Lead | `.text-size-xlarge` | black | 400 | The sentence under a slide title |
| Body | `.text-size-regular` | black | 400 | Paragraphs |
| Support | `.text-size-small` | grey-light | 400 | Secondary lines, nav labels |
| Meta | `.text-size-tiny` | grey-muted | 400 | Captions, axis labels, footnotes, inactive numbers |
| Active label | `.text-size-tiny` | black | 500 | The selected tab, row, or nav item |
| Hero stat | `.h1-display` | black | 400 | The 30M+ figure only |
| Metric | `.heading-style-h2` | black | 400 | Figures inside a slide: 22B, 50, 4K, $150K, 35% |
| Eyebrow | `.section-name-new` | grey-medium | 300 | Every uppercase section label and small tag; no brackets |
| Primary button | `.ltx-but-base.is-black` | white on black | 400 | The forward action |
| Secondary button | `.ltx-but-base` | black on transparent | 400 | The quieter action |
| Quote | `.text-style-quote` | black | 400 | Customer quotes |

Unused on purpose until a slide needs them: H4, H6, large, medium. Grey-medium drops out. `.is-small` drops out, so both buttons share one size.

## Text styles in the deck now

Sizes are the stage ceilings, the sizes on the 1920×1080 canvas.

| Style | Size | Weight in the system | Where the deck uses it now |
|---|---|---|---|
| Display `.h1-display` | 6rem | 400 | Cover, thank you, divider number and label, 30M+, world-model hero |
| H1 `.heading-style-h1` | 4.5rem | 400 | All 13 content-slide titles. Two stray rules also point icons and a metric at this size |
| H2 `.heading-style-h2` | 2.8rem | 400 | Cover subhead, agenda rows, capability titles, accordion headlines, several card titles, metric values |
| H3 `.heading-style-h3` | 2.2rem | 400 | Leads, panel headings (“You control how it’s deployed”), pricing figures, case numbers |
| H4 `.heading-style-h4` | 1.75rem | 500 | “Who are we” lead, a few card titles, pricing card values. Also the hidden per-slide wordmark |
| H5 `.heading-style-h5` | 1.5rem | 500 | Not used |
| H6 `.heading-style-h6` | 1.25rem | 500 | Short descriptions under a heading, some panel copy |
| X-large `.text-size-xlarge` | 1.5rem | 400 | Industry card titles, “Also built for” titles, next-steps intro, chart subheads |
| Large `.text-size-large` | 1.375rem | 400 | Footer captions, some card titles, watermarks, body in older cards |
| Medium `.text-size-medium` | 1.125rem | 400 | Mixed body, tabs, pills, node labels |
| Regular `.text-size-regular` | 1.03125rem | 400 | Mixed body and notes |
| Small `.text-size-small` | 0.9375rem | 400 | Nav labels, quotes, some secondary lines |
| Tiny `.text-size-tiny` | 0.8125rem | 400 | The largest set: captions, kickers, axis labels, proofs, rail names |
| Eyebrow `.section-name` | 0.9rem | 300 | Every eyebrow label. This size belongs to the component, not the type scale |
| Button `.ltx-but-base` | 1.1rem | 400 | Gate “Continue”, “See how LTX works”, “Watch the Full Video”. The last two also use `.is-small` (1.05rem) |

Same job, several sizes:

- A title inside a card or row is H2, H3, H4, x-large, or large.
- The sentence under a slide title is H2, H3, H4, or x-large.
- A paragraph is large, medium, regular, or small.
- A big number is display, H1, H2, or H3.

## Color

| Token | Value | Used now for |
|---|---|---|
| `--ltx-black` | `#0b0b0b` | Titles, most text, active states, primary button, focus, selection |
| `--ltx-grey` | `#333333` | Some supporting paragraphs. Aliased as `--color-text-secondary` |
| `--ltx-grey-medium` | `#474747` | Eyebrows |
| `--ltx-grey-light` | `#707070` | Muted text and some captions. Aliased as `--ink-soft` and `--color-text-muted` |
| `--ltx-grey-muted` | `#858585` | Quiet labels and inactive numbers. Aliased as `--ink-faint` and `--color-text-subtle` |
| `--ltx-grey-line` | `#d2d2d7` | Hairlines, borders, the “Who are we” spine |
| `--ltx-offwhite` | `#e7e8eb` | Slide ground, top nav, gate ground |
| `--ltx-white` | `#f9f9f9` | Cards, panels, type on footage, glass on video. Pure white is not used |
| `--ltx-slate-dark` | `#2e3445` | Accent for current position |
| `--ltx-slate-medium` | `#868ea5` | Accent for progress so far. Not a text color |

The deck is mostly greys. Slate-dark and slate-medium are the only accents. Grey-dark, white-full, slate-light, and slate-tint are in the Webflow collection and not used here. Grey-dark became grey. White-full became white `#f9f9f9`.

## Slate in place of purple

Applied.

| Mark | Now | Proposed |
|---|---|---|
| Pricing slider thumb, chart dot | Purple | Slate-dark |
| Pricing slider fill | Purple | Slate-medium |
| Next-steps line | Purple | Slate-medium |
| Usage timeline fill, hatch | Purple | Slate-medium |
| Usage playhead | Purple | Slate-dark |
| Capability tick | Purple | Slate-dark |
| Unfilled track | Grey-line | Grey-line |

Active navigation, links, and buttons stay black. Selected cards and rows stay on the greys.

## Gate error

Applied. A missing or wrong field gets a black border, focus moves to it, and the message under the form says what is wrong and shakes. Color is not the only signal (WCAG 2.1, 1.4.1 Use of Color).

## Layout

- Every slide uses `.content-container`.
- The shared content maximum is `90rem` (1440px).
- The container is centered automatically. On the 1920px stage this produces 240px / 15rem on either side; that space shrinks with the viewport.
- Headings, copy, cards, charts, controls, and content media align to the shared edges.
- Full-bleed collage footage, divider footage while growing, decorative background grids, navigation, and logo marquees may extend beyond it.

## Components

- Eyebrow: `.section-name-new` with a `.section-name` label. Bracket elements are hidden globally. Eyebrows are grey-medium.
- Buttons: `.ltx-but-base`. Filled `.is-black` on the gate and “See how LTX works”. Outline `.is-small` on “Watch the Full Video”.
- Cards: ground `--ltx-white`, 1px `--color-border`, radius `--radius-md` (0.5rem).
- Buttons keep their own radius, `--radius-btn` (0.3rem).
- Quotes are not on `.text-style-quote` yet. Customer quotes still use `.cs-quote` at small size.

## Decisions (confirmed 20 Oct 2026)

1. Every content slide keeps one H1 title, including dense slides.
2. The sentence under a title is always x-large.
3. The heading inside a panel is always H3.
4. Card, row, and tab titles are always H5.
5. Body is regular in black. Support is small in grey-light. Meta is tiny in grey-muted.
6. In-slide figures are H2. Display stays on the cover, the close, the section dividers, and 30M+.
7. Purple leaves. Current position uses slate-dark. Progress so far uses slate-medium. Unfilled tracks stay grey-line.
8. Weight 400 through H3, body, and buttons. Weight 500 only on H4–H6 and the active label. Eyebrows stay 300.
9. Grey-medium is reserved for eyebrows.
10. Both buttons share `.ltx-but-base` size. `.is-small` goes away.
11. Red leaves. A gate field error gets a black border, and the message says what is wrong.

## How the lock was applied

- Every desktop rule that sets type was assigned one role. Size, weight, tracking, line height, and color come from that role.
- Inactive and active states keep their own color. Active labels keep weight 500. Type on footage stays white.
- Uppercase labels that are not eyebrows (“TO CONTROL”, “GLOBAL ADOPTION”, card categories) use the `.section-name` type: 0.9rem, 300, 0.15em.
- Tabs and navigation labels are support text: small, grey-light, black and 500 when active.
- Arrows and icon glyphs use the regular size. The agenda arrow follows its row at H3.
- The agenda rows are H3. They are the slide’s main content, not cards.
- Customer quotes use `.text-style-quote`. “Back to Commercial Models” is a secondary `.ltx-but-base`. “Explore” on the commercial cards is support text, not a button.
- Commercial slides no longer set type inline. Leads use `.text-size-xlarge`. Row labels use `.heading-style-h5`. Row copy uses `.text-size-regular`.
- “How pricing scales” is an eyebrow.
- Under 900px the mobile overrides still use their own pixel sizes. That pass is next.
