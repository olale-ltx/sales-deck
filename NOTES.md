# Sales deck — working notes

Learned from `sales-deck-original/` on 20 Oct 2026. That folder is the comparison copy. Do not edit it.

The new presentation will live in `deck/` and reuse media from the original (`videos/`, `assets/`) by relative path. Do not duplicate the video library. Serve from the repo root (`/deck/`) so `../sales-deck-original/` paths resolve.

Visual source of truth: `STYLE-GUIDE.md` and `design/ltx.css`. Behavior source of truth: the original `index.html`, `tracker.js`, `Code.gs`, and its `README.md`.

## What this is

A sales meeting deck built as a mini-website: one scrolling page per chapter. Two kinds of section live in a chapter. Flow sections (chapter heroes, Who We Are, dependency → control; slot class `.is-flow`) size themselves. Fixed-artboard slides are laid out on a 1920×1080 canvas and scaled as one unit to the content column by `syncDeckLayout()`. Under 900px the scale is off and every slide stacks in normal flow.

Live URL and the Apps Script contract are in `sales-deck-original/README.md`. Keep them. The form is lead capture, not access control. An API failure still lets the meeting continue.

## Shell

- Gate (`#pw-overlay`): first name, last name, role, access code. Session is remembered in `sessionStorage` (`ltx-sales-deck-auth`). Privacy line links to the Lightricks privacy PDF. Names must not go to the GTM dataLayer.
- After unlock, `tracker.js` records one session row: slides viewed, active time, device. Heartbeat 30s, idle cutoff 60s. Init only after the gate, because the notice says behavior is recorded.
- Persistent chrome: `#appnav` (logo, chapter menu, `01 / N` counter, fullscreen, hamburger). Per-slide `.topbar` / bare `.rule` are `display: none`. The date "July 2026" only lives on those hidden bars.
- Navigation: top nav + chapter subnav/breadcrumb, in-page scroll, hash deep links, hamburger menu on small screens. `F` or the top-right control toggles browser fullscreen only. Enter and arrows do not leave the gate form.
- Chapter menu is the `MENU` array in the deck script (not derived from `data-section`). Agenda rows use `data-goto-section` as an index into that array, so row 01 is Who We Are, not the cover.
- Divider slides (`.divider-grow`) auto-advance: video plays, the frame grows to fill the canvas, then the next slide. Skipped under 900px. Reduced motion waits and advances without the grow.
- Commercial branch: choosing Revenue Share or Usage-Based sets `selectedModel`. Forward/back then skips the other model’s slide until you return to the hub.
- Videos use `data-src` and load on first need. Hidden slides pause. `data-no-sound="1"` marks slides that stay silent.
- Each chapter is a vertically scrollable page; sections within a chapter use `.screen` slots and `.deck-section` blocks.

## Slide list

24 sections. Indexes are DOM order, 0-based, matching `MENU`.

| # | idx | Label | Chapter | What a seller does here |
|---|---|---|---|---|
| 1 | 0 | Cover | Overview | Title. "The world model the world builds on." Video collage on the right. |
| 2 | 1 | Agenda | Overview | Seven rows, each jumps to a chapter. |
| 3 | 2 | 01 — Who we are | Who We Are | Section opener. Video grows, then auto-advances. |
| 4 | 3 | Who are we | Who We Are | One scrolling page, three blocks: intro + 30M+ downloads + logo row; six industries with a shared video; world-model diagram (video, audio, motion, interaction, physics, prediction, physical AI) and three layers. |
| 5 | 4 | From dependency to control | Who We Are | Four topics (Deployment, Customization, Data & IP, Ownership) × Closed platform / Open weights. CTA jumps to the production-grade slide. |
| 6 | 5 | Production-grade model | Who We Are | Stats ~22B, 50 FPS, 4K, 20s. Tabs: joint audio-video, LoRA, open weights, longer prompts. |
| 7 | 6 | What's new in LTX-2.5 | Who We Are | Four tabs. Real Production (EXR, video decoder, fidelity rendering, distilled model). World Consistency (native multishot, Gemma 4 12B encoder). Deep Adaptation (pretrained checkpoint, permissive licensing). Scale (dataset + RL, prompt enhancer, auto duration). |
| 8 | 7 | 02 — What LTX can do | What LTX Can Do | Section opener. |
| 9 | 8 | Capability Explorer | What LTX Can Do | 11 demos: Multi Keyframe, Retake, Union Control, Camera Control, Audio to Video, Character Consistency, LoRA Trainer, Extend, Lip Dub, Inpainting, Outpainting. Several show before/after variants. |
| 10 | 9 | Post-production | What LTX Can Do | Native Resolution, Refine, Restore, SDR to HDR, Native HDR, Layout to Render, Alpha Gen (two examples). |
| 11 | 10 | Also built for | What LTX Can Do | Six cards: SaaS & Enterprise, Automotive, EdTech, Advertising, Companion Apps, VFX. Each expands to three lines. |
| 12 | 11 | 03 — Use cases & workflows | Use Cases | Section opener. |
| 13 | 12 | Multi-Modal Animation Controls | Use Cases | Six workflows: multi-modal controls, animation reference, blocking-to-animation, lab preview (3D + style + HDR), 3D guidance + multi KF, LTX HDR Native (explainer plus inpaint, outpaint, relight thumbs). |
| 14 | 13 | 04 — Why LTX wins | Why LTX Wins | Section opener. |
| 15 | 14 | The LTX advantage | Why LTX Wins | Four pillars that build in: Open (8× is on Efficient), Efficient (8× cost, 10× render), Deployable (fine-tune → deploy → production), Built with you. |
| 16 | 15 | Customer stories | Why LTX Wins | Markov Robotics, Reactor, ComfyUI, fal (80+ fine-tunes), Asteria (Tribeca 2026, 16-bit HDR). Video, quote, rail. |
| 17 | 16 | 05 — Ways to access LTX | Ways to Access | Section opener. |
| 18 | 17 | Ways to access LTX | Ways to Access | Licensing (open weights, on-prem, enterprise support) or API (reliability, no infra, migrate later, early access). Menu can open either pane. |
| 19 | 18 | Next steps | Next Steps | Seven stages from "Explore the use case" to "Define the path to production licensing." Click a stage for the detail. |
| 20 | 19 | 06 — Commercial partnership | Commercial | Section opener. |
| 21 | 20 | Two commercial models | Commercial | Hub. Both start at $150K / year. |
| 22 | 21 | Revenue share | Commercial | Slider $150K → $10M. Share falls 35% → 20%. Break-even shown. Back returns to the hub and clears the branch. |
| 23 | 22 | Usage-based | Commercial | Year timeline: commitment → credits → usage → balance, then pay-as-you-go. |
| 24 | 23 | Thank you | Commercial | Closing collage. |

Menu labels that differ from the slide title: "What Makes It Different" is the production-grade slide. "New in LTX 2.5" is the 2.5 slide. "About LTX", "Industries", and "LTX as a World Model" are scroll targets inside slide 3.

## Copy that must survive a restyle

Do not rewrite claims while restyling. Notable figures already on the slides:

- 30M+ downloads since January 2026
- ~22B parameters, 50 FPS, 4K, 20s fast mode
- Efficient: 8× lower cost, 10× faster rendering
- fal: 80+ LTX fine-tunes
- Asteria: ChikaBOOM! premiered at Tribeca 2026 in 16-bit HDR
- Commercial floor: $150K annual commitment, 12 months
- Revenue share: 35, 32.5, 30, 27.5, 25, 22.5, 20 percent across $150K, $250K, $500K, $1M, $2.5M, $5M, $10M
- Lip-dub languages named on the slide: English, French, Spanish, German, Russian

Customer quotes, names, and roles stay verbatim. CTA targets stay as they are (most "Watch the Full Video" links go to `https://ltx.io/`; Asteria goes to the partnership post).

## How styles are applied

All styling lives in the `<style>` block of `index.html`, plus about 74 inline `style=""` attributes (mostly the commercial slides and a few titles). The script changes classes and text. It does not paint colors.

`:root` sets the canvas: `--bg #ffffff`, `--ink #111`, `--ink-soft`, `--line`, `--dark`, `--accent #33e07a`, `--accent-2 #7c8cff`, `--radius 6px`, `--font` (Aeonik, then Inter), stage `1920×1080`. Many rules never use those variables. Active color, type size, and weight are written as raw values (`#FF4FA3`, `#111`, px sizes, font-weight 600–900), including on SVG `stroke` and `fill`.

Layout is a fixed stage. Slides are `position: absolute; inset: 0`. Content is mostly `position: absolute` with `left` / `top` in px. `#stage` scales `#deck` with `transform: scale()` so the whole 1920×1080 canvas stays visible. Under 900px that scale is off and the deck scrolls as normal document flow.

(That describes the original. The working copy after the brand pass is below.)

## Replacing styles

Yes. Slide structure, `MENU`, ids, `data-src`, and the script can stay while the visual rules change.

What works: point a copy at `design/ltx.css`, then restyle this deck’s own classes (and the inline rules) with those tokens. On this stage use `--fs-*-stage`, not the ebook’s `vw` clamps.

What does not work: swapping in the ebook stylesheet alone. The deck does not use `.hero`, `.rail`, `.chapter`, or `.ltx-btn`. A `:root` remap is not enough either, because most of the color and type is hardcoded below the token block.

Ebook page layout (30/70 rail, scrolling chapters) is a different skeleton. This deck stays a scaled slide stage unless we deliberately change that.

## Style lock (20 Oct 2026)

Applied to every slide on desktop. Usage map: `DECK-STYLE-GUIDE.md`. Visual reference: `deck/style-reference.html`.

- Each desktop type rule has one role: display, H1 title, H2 metric, H3 panel heading, H5 card title, x-large lead, regular body, small support, tiny meta, or the `.section-name` eyebrow type.
- H4, H6, large, and medium are no longer used. Weight 500 is only on card titles, active states, and bold words inside sentences.
- Slate-dark marks current position. Slate-medium marks progress so far. Purple and the gate red are gone.
- Grey-dark, white-full, slate-light, and slate-tint are not used.
- Under 900px the mobile overrides still use pixel sizes. Next pass.

Script: `/tmp/deckshot/lock.py`. Snapshot before it ran: `/tmp/deckshot/index.pre-lock.html`.

## Brand pass (20 Oct 2026)

`deck/index.html` now links `../design/ltx.css` and loads Aeonik from Typekit `emb1gsr`. Inter is trimmed to 300/400/500.

- `:root` deck tokens map to LTX vars: `--bg` offwhite, `--card` white, `--ink` black, `--ink-soft` grey-light, `--ink-faint` grey-muted, `--line` grey-line, `--accent` slate-dark, `--radius` `--radius-md`.
- Above 900px, `#deck` points `--fs-*` at `--fs-*-stage`, so the shared Webflow classes (`heading-style-h1`, `h1-display`, `text-size-*`) render at desktop ceiling on the scaled canvas. Under 900px they fall back to the clamps.
- Pink is gone. Black replaces it. Progress and position marks were purple in this pass, later replaced by slate (see Style lock).
- Raw greys were mapped by value onto the palette. Weights 600–900 became 500. Desktop px font sizes became `--fs-*-stage` tokens by nearest step. Card radii 8–24px became `--radius-md`. Mobile `@media` px sizes are untouched.
- Every `[ LABEL ]` eyebrow and tag uses the Webflow markup: `.section-name-new` > `.text-scramble` `[` + `.section-name` + `.text-scramble` `]`. `.eyebrow`, `.ns-panel-tag`, `.pr-slider-tag`, `.uf-tl-tag` keep only position.
- All slide titles carry `heading-style-h1`. Per-slide size overrides (`.cs-slide .title`, `.about-block .title`, `.who-title`, `.ctrl-title`, `.nx-title`) were removed on desktop. Cover and thank-you headlines are `h1-display`.
- CTAs use `ltx-but-base`: gate submit and the control-slide CTA are `is-black`, customer-story CTA is the outline `is-small`.
- Nav is offwhite with a grey-line hairline, labels weight 400, counter tabular. `.big-stat-glossy` is solid ink. "Who are we" spine line is a grey-line hairline.
- Gate error red `#c0392b` stays (functional).

Before/after screenshots: `/tmp/deckshot/before/`, `/tmp/deckshot/after/` (`node shoot.js <url> <dir>`, `python3 sheet.py <dir> <out.png>`).

## UX notes for the polish pass

These are observations, not a decision to change the meeting flow.

- Divider openers drive themselves. In a live meeting that can skip a section title before the seller has said it. Keep the animation, but it should be easy to hold or skip.
- "Who are we" mixes a paged deck with a long scroll. Arrow down both scrolls and, at the bottom, advances. Easy to overshoot.
- Full-slide click zones sit beside interactive controls (sliders, tabs, carousels). Any restyle has to keep those controls hittable.
- A lot of type and position is inline (`left:50px`, one-off font sizes), especially the two pricing slides. Restyling means pulling that into classes, or the brand pass will not stick.
- CSS still contains blocks for slides that were folded into explorers (pipeline, impact). Dead weight. Do not port it unless a slide still uses the class.
- Watermarks say "Ltx". The logo does not.
- Initial counter text says `01 / 27`. Script replaces it with the real length (24).

## Preview

`deck/` is the working copy. Media paths point at `../sales-deck-original/`.

Serve the project root, not `deck/`, or those paths break:

```bash
cd /Users/ola/Documents/Cursor/sales-deck && python3 -m http.server 8790 --bind 127.0.0.1
```

Open `http://127.0.0.1:8790/deck/`. The original is at `http://127.0.0.1:8790/sales-deck-original/`.

On `localhost` / `127.0.0.1` the working copy skips the lead gate with the bare `'1'` session marker, so it never calls the Apps Script API and tracking never starts. The original has no such skip — its gate writes real rows to the lead sheet.

## When we change styles

Work in `deck/`, not in `sales-deck-original/`. Keep the script hooks (`.slide`, `data-label`, ids, `data-src`, `data-goto-section`, `MENU` indexes). Point videos and images at `../sales-deck-original/`.

Change only the styles you ask for. A token remap will not catch raw hex, px type, or the inline styles on the commercial slides — those get edited where they are written.
