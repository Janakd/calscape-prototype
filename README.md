# Calscape Unified Search Prototype

A mid-fidelity static prototype arguing that propagation guides belong **inside** Calscape's plant detail pages — not in a separate site or section.

**Live site:** https://janakd.github.io/calscape-prototype/

## The argument

The California Native Plant Society's Calscape.org team is weighing whether to build propagation guides as a separate page (or even a separate site). This prototype embodies the counter-argument: propagation is just one section of a plant's canonical home page — searched as a unified plant query, deep-linked into the same URL, and read in context of the plant's habitat, climate, and growing needs.

URL structure is the argument:

```
/plants/manzanita              ← canonical home for everything about Manzanita
/plants/manzanita#propagation  ← deep link from a search for "manzanita propagation"
/propagation/manzanita         ← does NOT exist
```

## Tech

Static HTML, CSS, and vanilla JavaScript. No build step, no dependencies. Open `index.html` directly, or serve the folder over any static server.

```bash
# Local dev
python3 -m http.server 8000
open http://localhost:8000/
```

## Tour

- **Home** ([`/`](https://janakd.github.io/calscape-prototype/)) — unified search, featured Manzanita.
- **Search** ([`/search.html?q=manzanita+propagation`](https://janakd.github.io/calscape-prototype/search.html?q=manzanita+propagation)) — client-side fuzzy search across a 13-plant corpus. Matches in propagation keywords deep-link to `#propagation` on the destination page.
- **Manzanita** ([`/plants/manzanita.html`](https://janakd.github.io/calscape-prototype/plants/manzanita.html)) — fully built plant detail page with sidebar TOC scroll-spy. The Propagation section contains:
  - Year-at-a-glance timing calendar
  - Three vertically stacked method cards (seed, cuttings, layering) with steps + parameter tables
  - Step-by-step cuttings photo timeline
  - Home vs Pro cleaning method comparison
  - Pull quote, lesson grid, glossary
- **Stub plants** (Coast Live Oak, Toyon, California Lilac) — placeholder pages so the related-plants block and search results resolve.

Visual style derived from [cnps-prototype.vercel.app](https://cnps-prototype.vercel.app/plant-profile) — deep teal/navy palette, Poppins/Lora typography, soft rounded cards.

## Project structure

```
.
├── index.html                Home
├── search.html               Search results
├── plants/                   Plant detail pages
│   ├── manzanita.html        Fully built
│   └── *.html                Stubs
├── assets/
│   ├── css/                  base, layout
│   ├── js/                   plants-data, search, toc, lightbox
│   ├── img/thumbs/           Placeholder gradient SVGs (15 plants)
│   └── __tests__.html        Browser-runnable JS unit tests
└── docs/superpowers/
    ├── specs/                Brainstorming spec
    └── plans/                Implementation plan
```

## Design history

See [`docs/superpowers/specs/2026-05-27-calscape-unified-search-prototype-design.md`](docs/superpowers/specs/2026-05-27-calscape-unified-search-prototype-design.md) for the brainstorm-stage design, and [`docs/superpowers/plans/2026-05-27-calscape-unified-search-prototype.md`](docs/superpowers/plans/2026-05-27-calscape-unified-search-prototype.md) for the implementation plan.
