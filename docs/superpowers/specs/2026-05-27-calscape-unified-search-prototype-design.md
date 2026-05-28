# Calscape Unified Search Prototype — Design

## Purpose

A mid-fidelity prototype that argues, through experience, that propagation guides belong **inside** Calscape's existing plant detail pages rather than in a separate site or section. The prototype demonstrates a single, unified search experience where propagation content is a section within each plant's canonical page — not a sibling concept reachable through its own navigation.

The prototype is for internal design exploration: the Calscape team is currently weighing whether to build propagation guides as a separate page. This prototype embodies the counter-argument.

## Scope

**In scope:**
- Three substantive pages: Home, Search results, and one fully built plant detail page (Manzanita)
- Four stub plant detail pages so search results have valid destinations
- Working client-side search across a ~15–20 plant index
- Annotation overlay that explains IA decisions when toggled on
- Calscape-inspired visual style (greens, naturalist tone, header/footer cues from the live site)
- Responsive: sidebar TOC on desktop, stacked sections on mobile

**Out of scope:**
- Backend, database, or content management
- User accounts, favorites, comments, or any account-bearing features
- A second fully built plant page (a stretch option already declined in brainstorming)
- A separate browse / index / category page (declined in favor of a tighter argument)
- An "about this prototype" intro page
- Pixel-perfect Calscape replication — the goal is *credible relationship to* Calscape, not a swap-in patch

## Information Architecture

The IA is the argument. The URL tree intentionally has no `/propagation/` branch:

```
/                                Home
/search?q=…                      Search results
/plants/<slug>                   Plant detail (canonical home for everything about a plant)
/plants/<slug>#propagation       Deep link into the propagation section of a plant page
```

A search for "manzanita propagation" routes to `/plants/manzanita#propagation`. There is no parallel `/propagation/manzanita`, and there is no global propagation index page.

## Pages

### Home (`index.html`)

- Calscape-style green header with logo and "Show IA notes" annotation toggle
- Hero band: large prompt ("California Native Plants"), short tagline, big search input, example queries that include `propagation` to signal it's a valid search term
- Featured plants strip: three thumbnail cards (Manzanita, California Poppy, Hummingbird Sage)
- Standard footer

### Search results (`search.html`)

- Reads `?q=` from the URL on load and runs the client-side search
- Each result card shows: thumbnail, common name, scientific name (italic), one-line snippet with matched terms highlighted via `<mark>`
- Clicking a result whose match came from propagation keywords deep-links to `#propagation`; otherwise links to the top of the plant page
- No propagation-specific badge on result cards — propagation is treated as ordinary plant content, not a featured capability
- Empty state: "No plants found. Try a different term or browse featured plants below." with the home page's featured strip repeated

### Plant detail — Manzanita (`plants/manzanita.html`)

- Hero band with scientific name (italic), common name, and attribute pills (Evergreen shrub · Drought tolerant · Pollinator)
- **Desktop layout:** two columns. Left rail is a sticky sidebar TOC. Main column is the scrolling content.
- **Mobile layout:** sidebar is hidden. A collapsible in-page anchor menu near the top provides jump-to navigation. Sections stack.
- **Sidebar TOC (desktop only):** lists all sections in scroll order. Active section is highlighted by scroll position via `toc.js`.
- **Section order:**
  1. Overview — habitat narrative, ecological role
  2. At a glance — facts grid: height, sun, water, soil, bloom time
  3. Habitat & Range — where it grows naturally, range map placeholder
  4. Garden Use — design tips, companion plants
  5. Growing Conditions — soil, water, sun, climate zones
  6. Propagation — three method cards (seed, cuttings, layering). Each card carries steps, timing, difficulty rating, and success notes. This is the substantive section that makes the integration case.
  7. Wildlife Value — pollinators, birds, larval hosts
  8. Photos — placeholder gallery grid
  9. Related plants — links to other Arctostaphylos species (stub pages)

### Plant detail stubs (`plants/california-poppy.html`, `plants/hummingbird-sage.html`, `plants/coast-live-oak.html`, `plants/toyon.html`)

- Same header, hero band, and footer as Manzanita
- Single paragraph of overview content
- A muted note: "This plant page is a placeholder in this prototype."
- Exists so search results have valid destinations

## Annotation Overlay

A toggle in the page header ("Show IA notes") switches a sticky-note overlay on or off. State persists across pages via `localStorage`.

**Visual treatment:** semi-transparent yellow sticky notes positioned in the page margin on desktop (anchored to the elements they describe with a thin connector line); collapsed to a small numbered tab on mobile that expands the note inline when tapped. Notes never cover content.

**Annotation inventory (8 notes total across the journey):**

| # | Page | Pinned to | Rationale |
|---|---|---|---|
| 1 | Home | Search bar | One search box covers all plant content. No separate "find a propagation guide" entry point. |
| 2 | Home | Example query "propagation" | Propagation is a legitimate search term, not a navigation category. |
| 3 | Search | Result snippet | Search hits in propagation content surface as snippet matches, not as a separate result type. |
| 4 | Search | Result link | Clicking deep-links to `#propagation` — the URL anchors into the plant page, not a different site. |
| 5 | Plant detail | URL bar `/plants/manzanita` | Canonical URL. No `/propagation/manzanita` exists. |
| 6 | Plant detail | Sidebar TOC | Propagation is a section among peers — same weight as Habitat or Growing. |
| 7 | Plant detail | Propagation section | Lives in the plant's page so users see propagation in context of the plant's habitat, climate, and growing needs — not abstracted into a how-to library. |
| 8 | Plant detail | Related plants block | Pivot is by plant identity, not by "similar propagation difficulty" — reinforces plant-as-the-unit. |

## File Structure

```
calscape-prototype/
├── index.html
├── search.html
├── plants/
│   ├── manzanita.html
│   ├── california-poppy.html
│   ├── hummingbird-sage.html
│   ├── coast-live-oak.html
│   └── toyon.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── layout.css
│   │   └── annotations.css
│   ├── js/
│   │   ├── search.js
│   │   ├── toc.js
│   │   └── annotations.js
│   ├── data/
│   │   └── plants.json
│   └── img/
│       ├── manzanita/
│       └── thumbs/
└── README.md
```

## Data Model

`assets/data/plants.json` is an array of objects with this shape:

```json
{
  "slug": "manzanita",
  "common_name": "Manzanita",
  "scientific_name": "Arctostaphylos densiflora 'Howard McMinn'",
  "summary": "Evergreen shrub native to California's chaparral. Famously challenging to propagate from cuttings or stratified seed.",
  "tags": ["evergreen", "drought-tolerant", "pollinator", "chaparral"],
  "propagation_keywords": ["cuttings", "stratification", "semi-hardwood", "smoke", "layering"],
  "thumb": "assets/img/thumbs/manzanita.jpg",
  "has_full_page": true
}
```

Stub plants have `has_full_page: false`. Search results still link to their pages.

## Behaviors

### Client-side search (`search.js`)

- On page load, fetch `plants.json` once and cache in memory
- Build a per-plant search string concatenating `common_name`, `scientific_name`, `tags`, `propagation_keywords`, and `summary`
- Score matches by substring presence, weighted: name (×3) > tags (×2) > summary / keywords (×1)
- Track which field matched first — if `propagation_keywords` produced the match, the result link gets the `#propagation` anchor
- Render top 10 matches, sorted by score
- Live filtering on `input` events when the user types in the search box; submit triggers navigation to `search.html?q=…`

### Sidebar TOC (`toc.js`)

- On scroll, find the topmost section currently in the viewport
- Apply `.active` class to the matching TOC item
- Smooth-scroll on TOC click; update URL hash without page jump
- Only runs on the Manzanita page (other pages don't have a TOC)

### Annotations (`annotations.js`)

- Annotation data lives inline in each HTML page as `data-note` attributes on annotated elements (number + title + rationale)
- Toggle button reads/writes `localStorage.showAnnotations` (boolean)
- When enabled, render sticky-note overlays positioned via the annotated elements' bounding rects
- Re-position on resize and scroll
- On mobile (`max-width: 640px`), render compact numbered tabs that expand on tap

## Visual Style

Pull colors and typography cues from live calscape.org so the prototype reads as a credible evolution of the existing site:

- **Primary green** (header, accents) — drawn from Calscape's existing palette
- **Cream/parchment** (sidebar TOC background, card backgrounds) — naturalist tone
- **Body type** — humanist sans-serif (system font stack acceptable in prototype)
- **Headings** — slightly serif or display sans to match Calscape's botanical feel
- **Hero imagery** — high-quality plant photography; placeholders may use Unsplash or solid color gradients in v1

Exact palette and font selections are pulled by referencing the live Calscape site during build, not specified here in hex codes.

## Responsive Breakpoints

- **≥ 1024 px (desktop):** sidebar TOC visible on plant detail; multi-column layouts where useful (e.g., facts grid 3-wide)
- **640–1023 px (tablet):** sidebar TOC hidden; collapsible anchor menu at top of plant detail; grid layouts reduce to 2-wide
- **< 640 px (mobile):** no TOC; sections stack; annotation notes collapse to numbered tabs; search bar dominates home hero

## How Reviewers Use the Prototype

1. Open `index.html` in a browser
2. Try searching "manzanita propagation" — observe the result deep-links into the plant page
3. Explore the Manzanita detail page; scroll through to find the propagation section in context
4. Toggle "Show IA notes" — see annotations explaining each IA decision
5. Click through to stub plants to confirm the URL pattern holds

## Out-of-Scope (Explicit Exclusions)

- Backend or CMS — every page is hand-authored HTML
- Account features, favorites, comments
- Search analytics, autocomplete, typo correction
- A separate browse / category / index page
- A second fully built detail page
- An intro/about page for reviewers
- Pixel-perfect Calscape style replication
- Accessibility audit beyond reasonable defaults (semantic HTML, alt text, keyboard navigability of the toggle and TOC)

## Success Criteria

- A reviewer who has not seen the brainstorm can open `index.html` and, within five minutes, understand the proposed IA without explanation
- Toggling "Show IA notes" makes the IA argument explicit for reviewers who need it spelled out
- The Manzanita page reads as a credible plant detail page, with propagation feeling native — not bolted on
- The search box reliably finds plants by name, scientific name, tag, and propagation keyword
- The prototype runs from a static file server (or `file://`) with no build step
