# Portfolio — Agni Miftah Fauzi (2026 edition)

Personal portfolio of **Agni Miftah Fauzi** — Software & AI Engineer, Bandung, Indonesia.
Rebuilt from scratch as a hand-coded, single-page editorial site. No template, no page builder, no framework.

> Live: **https://portfolio-agni-v2.vercel.app**

## What's inside

- `index.html` — the whole site (single page, 5 sections)
- `projects/` — 10 documentation pages, one per documented project (Caku Finance, Caku Automation, PromptCraft, AtapDigital AI, Weather RNN, Bioreactor, RF Harvesting, RFID Attendance, Line Follower, Sumo Robot), migrated from the previous site's project pages
- `assets/css/style.css` — design system: warm paper, ink, one rust accent
- `assets/js/main.js` — ~90 lines of vanilla JS: scroll reveal, index filters, Bandung clock
- `assets/img/` — compressed project imagery (~4.9 MB total)

## Design decisions (deliberately anti-"AI slop")

- **Editorial ledger look** — hairline rules, mono metadata, serif display type (Fraunces), no glassmorphism, no gradients, no glow, no emoji.
- **One theme, done properly** — warm light palette that's easy on the eyes; no dark-mode toggle.
- **Specific, honest copy** — real numbers only (139,832 rows, 42 tests, 87% mAP50, 31 live demos); fictional brands are labelled as concept demos/simulations.
- **The Index** — every project on the record as a filterable table, including 19 demos shipped in one sprint.
- Typefaces: Fraunces (display), Archivo (body), JetBrains Mono (metadata), via Google Fonts.

## Run locally

```bash
python -m http.server 8622
# open http://127.0.0.1:8622
```

Or just open `index.html` in a browser — no build step.

## Sections

1. Hero — intro + selected numbers
2. 01 Selected work — 6 flagship projects
3. 02 The index — AI & data / web & product (31 demos) / hardware
4. 03 Experience — work, education, organizations, certification
5. 04 About — bio, how I work, capabilities
6. 05 Contact — email, GitHub, LinkedIn

## Links

- GitHub: [@Atazyyy](https://github.com/Atazyyy)
- LinkedIn: [agni-miftah-fauzi](https://www.linkedin.com/in/agni-miftah-fauzi/)
