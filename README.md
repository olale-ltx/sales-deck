# LTX mini-site (sales deck reference)

Chapter-based **mini-website** for LTX sales content—not a slide deck. This repo is the reference implementation for future LTX composite sites (decks, long presentations, rich documents).

## Start here

| Doc | Purpose |
|-----|---------|
| [docs/LTX-MINI-SITE-GOALS.md](docs/LTX-MINI-SITE-GOALS.md) | Goals and non‑negotiables |
| [docs/LTX-MINI-SITE-SYSTEM.md](docs/LTX-MINI-SITE-SYSTEM.md) | HTML anatomy, layout kinds, spacing |
| [STYLE-GUIDE.md](STYLE-GUIDE.md) | Tokens, type, color (law) |
| [design/ltx.css](design/ltx.css) | Shared CSS |
| [DECK-STYLE-GUIDE.md](DECK-STYLE-GUIDE.md) | Class usage map for this site |

**Agent skill:** `.cursor/skills/ltx-mini-site/SKILL.md`

## Run locally

Serve the **repo root** (so `../sales-deck-original/` resolves):

```bash
python3 -m http.server 8790
```

Open [http://127.0.0.1:8790/deck/](http://127.0.0.1:8790/deck/)

## Reference only

`sales-deck-original/` — previous 2020s slide-stage deck; do not copy patterns from it.
