# LTX mini-site — goals (source of truth)

**Status:** Active north star for this repo and future LTX composite sites (sales decks, long-form presentations, rich documents).

## Product intent

- Build **mini-websites**, not slide decks. No presentation modes, no “stage” UX, no special viewer behavior beyond normal scroll + nav.
- **Same visual language as ltx.io / Webflow:** tokens in `design/ltx.css`, classes documented in `STYLE-GUIDE.md`.
- **Reusable for Lightricks:** teammates and agents should clone the pattern, swap content, and ship without one-off CSS.
- **Eventually:** all LTX materials (site, decks, docs) share one system; this repo is the reference implementation.

## Design-system rules (non‑negotiable)

1. **Classes, not patches** — Use `heading-style-h*`, `h1-display`, `text-size-*`, `section-name-new`, `ltx-but-base`, etc. No random `font-size` / hex on a single block unless we add a **named pattern** to the guide together.
2. **One type scale** — `--fs-*` clamps from `design/ltx.css` on every section. No alternate `--fs-*-stage` pins per layout kind in the deck.
3. **Clear hierarchy** — Display → H1 → H2 → … → body; weights 400 (display–H3), 500 (H4–H6, active labels). No 700+.
4. **Webflow-like structure** — `page-wrapper` → `main-container` → sections; global `--content-pad-x` (3vw); column `--content-max` (100rem).
5. **Spacing rhythm** — `--section-gap` (12rem) between major sections in a chapter unless a documented pattern says otherwise.
6. **New patterns** — Propose class + guide entry + example markup; do not ship silent `#id` or `.one-off` rules.

## Layout vocabulary (internal)

| Term | Meaning |
|------|--------|
| **Chapter** | Top nav item; one scroll “page” of content (`#chapter-n`). |
| **Section slot** | `.screen` wrapper — one scroll target in the chapter. |
| **Site section** | `.site-section` — the content block (hero, artboard block, document block). |
| **Document layout** | `.layout-document` — normal flow height (heroes, About, control explorer). |
| **Artboard layout** | `.layout-artboard` — legacy absolute 1440×1080 (or 1920 cover) scaled by `syncArtboardLayout()`. **Migrate to document layout over time.** |

## Cleanup backlog (living)

- [ ] Convert remaining **artboard** sections to **document layout** (absolute → flow + shared components).
- [ ] Replace artboard-only CSS with shared section patterns in `docs/LTX-MINI-SITE-PATTERNS.md`.
- [ ] Align every eyebrow with `.section-name-new` markup; remove bracket hacks.
- [ ] Publish agent **skill** (`.cursor/skills/ltx-mini-site/`) for new repos.
- [ ] Optional: share skill to org-wide Cursor skills when stable.

## What we removed / do not bring back

- Presentation modes, left/right tap zones, slide counter chrome (except fullscreen on nav).
- Per-section-type typography forks (“flow vs fixed” type tokens).
- Pink/green accents, 700+ weights, ad-hoc 70px titles.

## Related files

- Anatomy & rules: `docs/LTX-MINI-SITE-SYSTEM.md`
- Tokens & type: `STYLE-GUIDE.md`, `design/ltx.css`
- Usage audit (this deck): `DECK-STYLE-GUIDE.md`
- Agent skill: `.cursor/skills/ltx-mini-site/SKILL.md`
