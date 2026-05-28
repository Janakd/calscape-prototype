# Calscape Unified Search Prototype — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mid-fidelity static HTML prototype of a Calscape.org plant page where propagation guides live as a section *within* each plant page, arguing through experience that integration beats a separate propagation site.

**Architecture:** A static folder of HTML/CSS/vanilla JS that opens directly in a browser (no build, no server). Three substantive pages (Home, Search results, fully-built Manzanita detail) plus four stub plant pages so search has destinations. Client-side search reads an in-memory plant index. An "Show IA notes" toggle reveals a sticky-note annotation overlay explaining the IA decisions; the toggle state persists across pages via `localStorage`.

**Tech Stack:** HTML5, CSS3 (no preprocessors), vanilla JavaScript (no frameworks, no modules — plain `<script>` tags so the prototype works from `file://`). No external dependencies. No build step.

**Spec:** `docs/superpowers/specs/2026-05-27-calscape-unified-search-prototype-design.md`

**Working directory:** `/Users/janak/CNPS`

**Note on git:** The user opted out of git initialization for this project. Tasks omit `git commit` steps; instead each task ends with a **browser verification** step that confirms the page renders/behaves correctly. Treat each verification as the equivalent checkpoint.

**Note on `plants.json` vs `plants-data.js`:** The spec describes the plant index as `plants.json`. We implement it as `assets/js/plants-data.js` — a script that assigns `window.PLANTS_DATA = [ ... ]`. This is functionally equivalent but works on `file://` (where `fetch()` is blocked by browser security). The data shape is unchanged.

---

## File Structure (final)

```
calscape-prototype/
├── index.html                    Home — search hero, featured plants
├── search.html                   Search results (reads ?q= from URL)
├── plants/
│   ├── manzanita.html            Fully built — sidebar TOC, all sections
│   ├── california-poppy.html     Stub
│   ├── hummingbird-sage.html     Stub
│   ├── coast-live-oak.html       Stub
│   └── toyon.html                Stub
├── assets/
│   ├── css/
│   │   ├── base.css              Reset, typography, color palette
│   │   ├── layout.css            Header, footer, hero, sidebar TOC, grid, cards
│   │   └── annotations.css       Sticky-note overlay styling
│   ├── js/
│   │   ├── plants-data.js        window.PLANTS_DATA assignment
│   │   ├── search.js             Pure scoring + result rendering
│   │   ├── toc.js                Sidebar TOC active-section highlighting
│   │   └── annotations.js        Toggle + localStorage + sticky-note rendering
│   ├── img/                      Placeholder colored blocks; can be swapped later
│   └── __tests__.html            JS unit-test runner (pure functions only)
└── README.md                     One-screen summary + how to view
```

All work happens under `/Users/janak/CNPS/`. The prototype lives at the repo root (no `calscape-prototype/` wrapper folder — the tree above is the project root).

---

## Task 1: Project skeleton, palette, and README

**Files:**
- Create: `/Users/janak/CNPS/README.md`
- Create: `/Users/janak/CNPS/assets/css/base.css`
- Create: `/Users/janak/CNPS/index.html` (minimal shell — will be expanded in Task 5)

- [ ] **Step 1: Create the assets directory structure**

```bash
mkdir -p /Users/janak/CNPS/assets/css /Users/janak/CNPS/assets/js /Users/janak/CNPS/assets/img/manzanita /Users/janak/CNPS/assets/img/thumbs /Users/janak/CNPS/plants
```

- [ ] **Step 2: Write `README.md`**

```markdown
# Calscape Unified Search Prototype

A mid-fidelity prototype arguing that propagation guides belong *inside* Calscape's plant detail pages — not in a separate site.

## How to view

Open `index.html` in a modern browser (Chrome, Firefox, Safari). No server needed.

## Reviewer tour (5 minutes)

1. From the home page, try searching `manzanita propagation` and click the first result.
2. On the Manzanita page, scroll to see the sections in the sidebar TOC — note that **Propagation** is one section among peers.
3. Click "Show IA notes" in the header to reveal sticky annotations explaining the IA decisions.
4. Click a stub plant (e.g., California Poppy) from the related plants block to confirm the `/plants/<slug>` URL pattern holds.

## Files

See `docs/superpowers/specs/2026-05-27-calscape-unified-search-prototype-design.md` for the full design.
```

- [ ] **Step 3: Write `assets/css/base.css`**

Pull colors from Calscape's existing palette (deep botanical greens, cream parchment, warm body text):

```css
/* base.css — reset, typography, palette */

:root {
  --green-900: #1f4427;
  --green-700: #2a5934;
  --green-600: #2a7a3e;
  --green-300: #9eb88f;
  --green-100: #e8f0e9;

  --cream-100: #faf8f1;
  --cream-200: #f7f5ef;
  --cream-300: #e0dccd;

  --ink-900: #222;
  --ink-700: #444;
  --ink-500: #666;
  --ink-300: #888;

  --accent-amber: #d4a000;
  --accent-amber-bg: #fff8dc;

  --radius-sm: 3px;
  --radius-md: 6px;
  --radius-lg: 10px;

  --shadow-sm: 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.08);

  --max-width: 1200px;
}

*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  color: var(--ink-900);
  background: var(--cream-100);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: Georgia, "Times New Roman", serif;
  color: var(--green-900);
  line-height: 1.25;
  margin: 0 0 0.4em;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.2rem; }

p { margin: 0 0 1em; }
a { color: var(--green-600); text-decoration: none; }
a:hover { text-decoration: underline; }

img { max-width: 100%; display: block; }

.italic { font-style: italic; }
.muted { color: var(--ink-500); }
.small { font-size: 0.875rem; }
```

- [ ] **Step 4: Write minimal `index.html` shell to verify CSS loads**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calscape — California Native Plants</title>
  <link rel="stylesheet" href="assets/css/base.css">
</head>
<body>
  <h1>Calscape</h1>
  <p>Prototype scaffold — content forthcoming.</p>
</body>
</html>
```

- [ ] **Step 5: Verify in browser**

Run: `open /Users/janak/CNPS/index.html`
Expected: page shows "Calscape" in a dark green serif heading and a paragraph below in cream-background body text. Confirms the palette is wired.

---

## Task 2: Plant data

**Files:**
- Create: `/Users/janak/CNPS/assets/js/plants-data.js`

- [ ] **Step 1: Write `plants-data.js` with 15 plants**

The first 5 (Manzanita + 4 stub-eligible) are what we'll link from. The remaining 10 give search a meaningful corpus to filter.

```javascript
// plants-data.js — sets window.PLANTS_DATA
// Functionally equivalent to plants.json; uses script-tag delivery so the
// prototype runs from file:// without a local server.

window.PLANTS_DATA = [
  {
    slug: "manzanita",
    common_name: "Manzanita",
    scientific_name: "Arctostaphylos densiflora 'Howard McMinn'",
    summary: "Evergreen shrub native to California's chaparral. Famously challenging to propagate from cuttings or stratified seed.",
    tags: ["evergreen", "shrub", "drought-tolerant", "pollinator", "chaparral", "full-sun"],
    propagation_keywords: ["cuttings", "stratification", "semi-hardwood", "smoke", "layering", "scarification"],
    thumb: "assets/img/thumbs/manzanita.svg",
    has_full_page: true
  },
  {
    slug: "california-poppy",
    common_name: "California Poppy",
    scientific_name: "Eschscholzia californica",
    summary: "State flower. Annual or short-lived perennial. Easy from seed sown in fall.",
    tags: ["annual", "wildflower", "drought-tolerant", "pollinator", "full-sun"],
    propagation_keywords: ["seed", "direct-sow", "fall-sown"],
    thumb: "assets/img/thumbs/california-poppy.svg",
    has_full_page: false
  },
  {
    slug: "hummingbird-sage",
    common_name: "Hummingbird Sage",
    scientific_name: "Salvia spathacea",
    summary: "Spreading perennial sage with magenta flower spikes. Pollinator favorite; propagates readily from rhizome division.",
    tags: ["perennial", "pollinator", "shade", "spreading", "salvia"],
    propagation_keywords: ["division", "rhizome", "cuttings"],
    thumb: "assets/img/thumbs/hummingbird-sage.svg",
    has_full_page: false
  },
  {
    slug: "coast-live-oak",
    common_name: "Coast Live Oak",
    scientific_name: "Quercus agrifolia",
    summary: "Iconic evergreen oak of coastal California. Long-lived; grows from acorn with no special treatment.",
    tags: ["tree", "evergreen", "oak", "wildlife", "long-lived"],
    propagation_keywords: ["acorn", "seed", "direct-sow"],
    thumb: "assets/img/thumbs/coast-live-oak.svg",
    has_full_page: false
  },
  {
    slug: "toyon",
    common_name: "Toyon",
    scientific_name: "Heteromeles arbutifolia",
    summary: "Evergreen shrub with red winter berries. The 'Holly' that named Hollywood. Grows from seed after cold stratification.",
    tags: ["evergreen", "shrub", "wildlife", "berries", "drought-tolerant"],
    propagation_keywords: ["seed", "stratification", "cold-strat"],
    thumb: "assets/img/thumbs/toyon.svg",
    has_full_page: false
  },
  {
    slug: "ceanothus",
    common_name: "California Lilac",
    scientific_name: "Ceanothus thyrsiflorus",
    summary: "Evergreen shrub covered in clouds of blue flowers in spring. Nitrogen-fixing. Cuttings or scarified seed.",
    tags: ["evergreen", "shrub", "pollinator", "blue-flower", "nitrogen-fixer", "drought-tolerant"],
    propagation_keywords: ["cuttings", "seed", "scarification", "hot-water"],
    thumb: "assets/img/thumbs/ceanothus.svg",
    has_full_page: false
  },
  {
    slug: "monkeyflower",
    common_name: "Sticky Monkeyflower",
    scientific_name: "Diplacus aurantiacus",
    summary: "Sub-shrub with orange-yellow flowers. Easy from cuttings or seed.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "orange-flower"],
    propagation_keywords: ["cuttings", "seed", "softwood"],
    thumb: "assets/img/thumbs/monkeyflower.svg",
    has_full_page: false
  },
  {
    slug: "yarrow",
    common_name: "Common Yarrow",
    scientific_name: "Achillea millefolium",
    summary: "Tough herbaceous perennial. Spreads by rhizome; easy from seed or division.",
    tags: ["perennial", "herbaceous", "pollinator", "drought-tolerant", "lawn-alternative"],
    propagation_keywords: ["division", "seed", "rhizome"],
    thumb: "assets/img/thumbs/yarrow.svg",
    has_full_page: false
  },
  {
    slug: "matilija-poppy",
    common_name: "Matilija Poppy",
    scientific_name: "Romneya coulteri",
    summary: "Six-foot perennial with huge white 'fried egg' flowers. Notoriously hard to transplant; root cuttings or layering work best.",
    tags: ["perennial", "tall", "drought-tolerant", "white-flower"],
    propagation_keywords: ["root-cuttings", "layering", "difficult"],
    thumb: "assets/img/thumbs/matilija-poppy.svg",
    has_full_page: false
  },
  {
    slug: "buckwheat",
    common_name: "California Buckwheat",
    scientific_name: "Eriogonum fasciculatum",
    summary: "Hardworking sub-shrub. Critical pollinator forage. Grows readily from seed.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "chaparral"],
    propagation_keywords: ["seed", "direct-sow"],
    thumb: "assets/img/thumbs/buckwheat.svg",
    has_full_page: false
  },
  {
    slug: "deergrass",
    common_name: "Deergrass",
    scientific_name: "Muhlenbergia rigens",
    summary: "Large bunchgrass, traditional Indigenous basketry material. Easy from seed or division.",
    tags: ["grass", "perennial", "drought-tolerant", "wildlife"],
    propagation_keywords: ["seed", "division"],
    thumb: "assets/img/thumbs/deergrass.svg",
    has_full_page: false
  },
  {
    slug: "elderberry",
    common_name: "Blue Elderberry",
    scientific_name: "Sambucus nigra ssp. caerulea",
    summary: "Fast-growing tree-shrub with edible berries. Roots readily from hardwood cuttings.",
    tags: ["tree", "shrub", "wildlife", "edible", "deciduous"],
    propagation_keywords: ["cuttings", "hardwood", "seed"],
    thumb: "assets/img/thumbs/elderberry.svg",
    has_full_page: false
  },
  {
    slug: "white-sage",
    common_name: "White Sage",
    scientific_name: "Salvia apiana",
    summary: "Sacred sage with silver foliage. Slow but reliable from semi-hardwood cuttings; conservation concerns around wild harvest.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "salvia", "silver-foliage", "conservation"],
    propagation_keywords: ["cuttings", "seed", "semi-hardwood"],
    thumb: "assets/img/thumbs/white-sage.svg",
    has_full_page: false
  },
  {
    slug: "douglas-iris",
    common_name: "Douglas Iris",
    scientific_name: "Iris douglasiana",
    summary: "Coastal native iris with purple-blue flowers. Spreads from rhizome division.",
    tags: ["perennial", "iris", "rhizomatous", "purple-flower", "coastal"],
    propagation_keywords: ["division", "rhizome"],
    thumb: "assets/img/thumbs/douglas-iris.svg",
    has_full_page: false
  },
  {
    slug: "redbud",
    common_name: "Western Redbud",
    scientific_name: "Cercis occidentalis",
    summary: "Small deciduous tree with magenta spring flowers. Grows from scarified, stratified seed.",
    tags: ["tree", "deciduous", "pink-flower", "drought-tolerant"],
    propagation_keywords: ["seed", "scarification", "stratification"],
    thumb: "assets/img/thumbs/redbud.svg",
    has_full_page: false
  }
];
```

- [ ] **Step 2: Verify the data loads**

Append a temporary `<script>` to `index.html` and a `<script src="assets/js/plants-data.js"></script>`:

```html
<!-- inside <body>, replace the placeholder paragraph: -->
<p>Prototype scaffold — content forthcoming.</p>
<script src="assets/js/plants-data.js"></script>
<script>
  document.body.innerHTML += `<p>Loaded ${window.PLANTS_DATA.length} plants. First: ${window.PLANTS_DATA[0].common_name}.</p>`;
</script>
```

Run: `open /Users/janak/CNPS/index.html`
Expected: page now also shows "Loaded 15 plants. First: Manzanita."

- [ ] **Step 3: Remove the verification scripts**

Strip the two test `<script>` tags from `index.html` (leaving just the original placeholder paragraph). Task 5 will rebuild the home page properly.

---

## Task 3: Search scoring logic + test page

**Files:**
- Create: `/Users/janak/CNPS/assets/js/search.js`
- Create: `/Users/janak/CNPS/assets/__tests__.html`

- [ ] **Step 1: Write the test runner page first (TDD)**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Calscape Prototype — Tests</title>
  <style>
    body { font-family: monospace; padding: 20px; }
    .pass { color: green; }
    .fail { color: red; font-weight: bold; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Search.js tests</h1>
  <div id="results"></div>

  <script src="js/plants-data.js"></script>
  <script src="js/search.js"></script>
  <script>
    const out = document.getElementById('results');
    let passed = 0, failed = 0;

    function assert(name, condition, details) {
      const el = document.createElement('div');
      if (condition) {
        el.className = 'pass';
        el.textContent = '✓ ' + name;
        passed++;
      } else {
        el.className = 'fail';
        el.innerHTML = '✗ ' + name + (details ? '<pre>' + details + '</pre>' : '');
        failed++;
      }
      out.appendChild(el);
    }

    // --- TESTS ---

    assert('Calscape.search namespace exists',
      typeof window.Calscape === 'object' && typeof window.Calscape.search === 'object');

    assert('buildSearchString concatenates fields',
      typeof Calscape.search.buildSearchString === 'function');

    const sampleString = Calscape.search.buildSearchString(window.PLANTS_DATA[0]);
    assert('buildSearchString includes common_name',
      sampleString.toLowerCase().includes('manzanita'),
      'got: ' + sampleString);

    assert('buildSearchString includes propagation keyword',
      sampleString.toLowerCase().includes('cuttings'),
      'got: ' + sampleString);

    // score()
    const manzanita = window.PLANTS_DATA[0];
    const scoreNameMatch = Calscape.search.score('manzanita', manzanita);
    assert('score returns object with score and matchedField',
      typeof scoreNameMatch === 'object' && 'score' in scoreNameMatch && 'matchedField' in scoreNameMatch);

    assert('name match scores higher than keyword match',
      Calscape.search.score('manzanita', manzanita).score >
      Calscape.search.score('cuttings', manzanita).score);

    assert('propagation keyword match sets matchedField=propagation',
      Calscape.search.score('cuttings', manzanita).matchedField === 'propagation');

    assert('name match sets matchedField=name',
      Calscape.search.score('manzanita', manzanita).matchedField === 'name');

    assert('no match returns score 0',
      Calscape.search.score('zzzzz-no-match', manzanita).score === 0);

    // search()
    const results = Calscape.search.search('manzanita', window.PLANTS_DATA);
    assert('search returns array',
      Array.isArray(results));

    assert('search puts best match first',
      results[0].plant.slug === 'manzanita');

    assert('search returns at most 10 results',
      Calscape.search.search('e', window.PLANTS_DATA).length <= 10);

    assert('empty query returns empty array',
      Calscape.search.search('', window.PLANTS_DATA).length === 0);

    assert('search across propagation keywords finds plants',
      Calscape.search.search('division', window.PLANTS_DATA).length >= 2);

    // Summary
    const summary = document.createElement('h2');
    summary.textContent = `${passed} passed · ${failed} failed`;
    summary.style.color = failed === 0 ? 'green' : 'red';
    out.appendChild(summary);
  </script>
</body>
</html>
```

- [ ] **Step 2: Open the test page and verify it fails**

Run: `open /Users/janak/CNPS/assets/__tests__.html`
Expected: all assertions fail (`Calscape.search` doesn't exist yet). Page should show red X marks and a red "0 passed · N failed" summary.

- [ ] **Step 3: Write the minimal `search.js` implementation**

```javascript
// search.js — pure search scoring + result rendering helpers
// Attaches to window.Calscape.search namespace.

(function () {
  const Calscape = window.Calscape || {};

  const FIELD_WEIGHTS = {
    name: 3,
    tags: 2,
    summary: 1,
    propagation: 1
  };

  function buildSearchString(plant) {
    return [
      plant.common_name,
      plant.scientific_name,
      (plant.tags || []).join(' '),
      plant.summary,
      (plant.propagation_keywords || []).join(' ')
    ].join(' ').toLowerCase();
  }

  // Returns { score: number, matchedField: 'name'|'tags'|'summary'|'propagation'|null }
  // matchedField is whichever weighted field first contained the query
  // (checked in priority order: name > tags > propagation > summary).
  function score(query, plant) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return { score: 0, matchedField: null };

    const name = (plant.common_name + ' ' + plant.scientific_name).toLowerCase();
    const tags = (plant.tags || []).join(' ').toLowerCase();
    const propagation = (plant.propagation_keywords || []).join(' ').toLowerCase();
    const summary = (plant.summary || '').toLowerCase();

    let total = 0;
    let matchedField = null;

    if (name.includes(q)) {
      total += FIELD_WEIGHTS.name;
      matchedField = matchedField || 'name';
    }
    if (tags.includes(q)) {
      total += FIELD_WEIGHTS.tags;
      matchedField = matchedField || 'tags';
    }
    if (propagation.includes(q)) {
      total += FIELD_WEIGHTS.propagation;
      matchedField = matchedField || 'propagation';
    }
    if (summary.includes(q)) {
      total += FIELD_WEIGHTS.summary;
      matchedField = matchedField || 'summary';
    }

    return { score: total, matchedField };
  }

  // Returns sorted array of { plant, score, matchedField }, top 10, score > 0 only.
  function search(query, plants) {
    if (!query || !query.trim()) return [];
    return plants
      .map(p => Object.assign({ plant: p }, score(query, p)))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }

  Calscape.search = { buildSearchString, score, search, FIELD_WEIGHTS };
  window.Calscape = Calscape;
})();
```

- [ ] **Step 4: Re-open the test page and verify it passes**

Run: `open /Users/janak/CNPS/assets/__tests__.html`
Expected: all assertions show green checkmarks; summary reads "N passed · 0 failed" in green.

---

## Task 4: Search results page

**Files:**
- Create: `/Users/janak/CNPS/search.html`
- Modify: `/Users/janak/CNPS/assets/js/search.js` (add a `renderResults` helper)

- [ ] **Step 1: Extend `search.js` with rendering helpers**

Append to `search.js` inside the same IIFE (above the `Calscape.search = ...` line):

```javascript
  // Highlights all occurrences of `query` in `text` with <mark>.
  // Case-insensitive, escapes regex special chars in query.
  function highlight(text, query) {
    if (!query || !query.trim()) return escapeHtml(text);
    const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(' + safeQuery + ')', 'gi');
    return escapeHtml(text).replace(re, '<mark>$1</mark>');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Returns the destination URL for a search result.
  // Deep-links to #propagation when the match came from propagation keywords.
  function resultUrl(result) {
    const base = 'plants/' + result.plant.slug + '.html';
    return result.matchedField === 'propagation' ? base + '#propagation' : base;
  }
```

And update the namespace export at the bottom:

```javascript
  Calscape.search = { buildSearchString, score, search, highlight, resultUrl, FIELD_WEIGHTS };
```

- [ ] **Step 2: Add a test for `highlight` and `resultUrl` to `__tests__.html`**

Insert before the "Summary" block:

```javascript
    // highlight()
    assert('highlight wraps matches in <mark>',
      Calscape.search.highlight('Manzanita propagation', 'propagation').includes('<mark>propagation</mark>'));

    assert('highlight is case-insensitive',
      Calscape.search.highlight('Manzanita propagation', 'MANZANITA').includes('<mark>Manzanita</mark>'));

    assert('highlight escapes HTML',
      Calscape.search.highlight('<script>x</script>', 'x').includes('&lt;script&gt;'));

    // resultUrl()
    const propResult = { plant: { slug: 'manzanita' }, matchedField: 'propagation' };
    const nameResult = { plant: { slug: 'manzanita' }, matchedField: 'name' };
    assert('resultUrl deep-links to #propagation when matched field is propagation',
      Calscape.search.resultUrl(propResult) === 'plants/manzanita.html#propagation');
    assert('resultUrl omits anchor when matched field is name',
      Calscape.search.resultUrl(nameResult) === 'plants/manzanita.html');
```

Run: `open /Users/janak/CNPS/assets/__tests__.html`
Expected: all assertions pass.

- [ ] **Step 3: Write `search.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Search · Calscape</title>
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/annotations.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">Calscape</a>
    <form class="search-form" role="search" action="search.html" method="get">
      <input type="search" name="q" id="search-input" placeholder="Search plants…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <button class="annotation-toggle" id="annotation-toggle" type="button" aria-pressed="false">Show IA notes</button>
  </header>

  <main class="search-page">
    <h1 id="search-heading">Search</h1>
    <p class="muted" id="search-meta"></p>

    <ul id="search-results" class="result-list"></ul>

    <div id="search-empty" class="empty-state" hidden>
      <p>No plants found. Try a different term or browse featured plants below.</p>
    </div>
  </main>

  <footer class="site-footer">
    <p class="small muted">Prototype — California Native Plant Society</p>
  </footer>

  <script src="assets/js/plants-data.js"></script>
  <script src="assets/js/search.js"></script>
  <script src="assets/js/annotations.js"></script>
  <script>
    (function () {
      const params = new URLSearchParams(window.location.search);
      const q = (params.get('q') || '').trim();
      document.getElementById('search-input').value = q;
      document.getElementById('search-heading').textContent =
        q ? `Results for "${q}"` : 'Search plants';

      const results = Calscape.search.search(q, window.PLANTS_DATA);
      const meta = document.getElementById('search-meta');
      const list = document.getElementById('search-results');
      const empty = document.getElementById('search-empty');

      if (!q) {
        meta.textContent = 'Type a plant name, habitat, or task — e.g., "manzanita", "drought tolerant", "cuttings".';
        return;
      }

      meta.textContent = `${results.length} plant${results.length === 1 ? '' : 's'} match`;

      if (results.length === 0) {
        empty.hidden = false;
        return;
      }

      results.forEach(r => {
        const li = document.createElement('li');
        li.className = 'result-card';
        li.innerHTML = `
          <a class="result-link" href="${Calscape.search.resultUrl(r)}">
            <div class="result-thumb" style="background-image:url('${r.plant.thumb}')"></div>
            <div class="result-body">
              <div class="result-name">${Calscape.search.highlight(r.plant.common_name, q)}</div>
              <div class="result-sci italic muted small">${Calscape.search.highlight(r.plant.scientific_name, q)}</div>
              <div class="result-summary small">${Calscape.search.highlight(r.plant.summary, q)}</div>
            </div>
          </a>
        `;
        list.appendChild(li);
      });
    })();
  </script>
</body>
</html>
```

- [ ] **Step 4: Verify search page in browser**

Run: `open "/Users/janak/CNPS/search.html?q=manzanita"`

Expected:
- Header with brand, search box (pre-filled with "manzanita"), and "Show IA notes" button (button won't function yet — that's Task 11)
- Heading: "Results for \"manzanita\""
- Meta: "1 plant matches"
- One result card: Manzanita with scientific name italic, summary with "Manzanita" highlighted in `<mark>` (will look unstyled until Task 6 — that's fine)
- Clicking the result navigates to `plants/manzanita.html` (file may 404 until Task 7 — that's fine)

Also try: `open "/Users/janak/CNPS/search.html?q=cuttings"` → should match multiple plants including manzanita; the manzanita link href should end with `#propagation`. Right-click → "Inspect" the link to verify.

Also try: `open "/Users/janak/CNPS/search.html?q=zzzzzz"` → should show the empty state.

---

## Task 5: Home page

**Files:**
- Modify: `/Users/janak/CNPS/index.html` (replace the placeholder shell from Task 1)

- [ ] **Step 1: Write the full `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Calscape — California Native Plants</title>
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/annotations.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="index.html">Calscape</a>
    <form class="search-form" role="search" action="search.html" method="get">
      <input type="search" name="q" placeholder="Search plants…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <button class="annotation-toggle" id="annotation-toggle" type="button" aria-pressed="false">Show IA notes</button>
  </header>

  <section class="hero">
    <div class="hero-inner">
      <h1>California Native Plants</h1>
      <p class="hero-tagline">Find plants for your garden, your habitat, your goals.</p>
      <form class="hero-search" role="search" action="search.html" method="get">
        <input type="search" name="q" placeholder='Search by plant, habitat, or task — e.g., "manzanita propagation"' autocomplete="off"
               data-note='{"n":1,"title":"One unified search","body":"One search box covers all plant content. No separate \"find a propagation guide\" entry point."}'>
        <button type="submit">Search</button>
      </form>
      <p class="hero-examples small">
        Try:
        <a href="search.html?q=propagation"
           data-note='{"n":2,"title":"Propagation as a search term","body":"Propagation is a legitimate search term, not a navigation category."}'>propagation</a>
        ·
        <a href="search.html?q=drought+tolerant">drought tolerant</a>
        ·
        <a href="search.html?q=chaparral">chaparral</a>
      </p>
    </div>
  </section>

  <section class="featured">
    <h2>Featured plants</h2>
    <ul class="card-grid" id="featured-grid"></ul>
  </section>

  <footer class="site-footer">
    <p class="small muted">Prototype — California Native Plant Society</p>
  </footer>

  <script src="assets/js/plants-data.js"></script>
  <script src="assets/js/annotations.js"></script>
  <script>
    (function () {
      const featuredSlugs = ['manzanita', 'california-poppy', 'hummingbird-sage'];
      const grid = document.getElementById('featured-grid');
      featuredSlugs.forEach(slug => {
        const p = window.PLANTS_DATA.find(x => x.slug === slug);
        if (!p) return;
        const li = document.createElement('li');
        li.className = 'plant-card';
        li.innerHTML = `
          <a href="plants/${p.slug}.html">
            <div class="plant-card-thumb" style="background-image:url('${p.thumb}')"></div>
            <div class="plant-card-name">${p.common_name}</div>
            <div class="plant-card-sci italic muted small">${p.scientific_name}</div>
          </a>
        `;
        grid.appendChild(li);
      });
    })();
  </script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Run: `open /Users/janak/CNPS/index.html`

Expected (will look unstyled until Task 6):
- Header bar with brand "Calscape", a search box, and "Show IA notes" button (not functional yet)
- Hero section with the headline, tagline, hero search bar, example links
- "Featured plants" heading and three plant cards (Manzanita, California Poppy, Hummingbird Sage)
- Submitting the hero search bar with "manzanita" should navigate to `search.html?q=manzanita`

Click a featured card → navigates to a plant page (404 until later tasks; that's fine).

---

## Task 6: Layout CSS

**Files:**
- Create: `/Users/janak/CNPS/assets/css/layout.css`

This task styles all the structural elements that appear across pages.

- [ ] **Step 1: Write `layout.css`**

```css
/* layout.css — header, footer, hero, sidebar TOC, card grids, search results */

/* --- Site header --- */
.site-header {
  background: var(--green-700);
  color: #fff;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: var(--shadow-sm);
}

.brand {
  color: #fff;
  font-family: Georgia, serif;
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
}
.brand:hover { text-decoration: none; opacity: 0.9; }

.search-form {
  flex: 1;
  display: flex;
  max-width: 480px;
}
.search-form input[type=search] {
  flex: 1;
  border: none;
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  padding: 6px 10px;
  font-size: 0.875rem;
  background: #fff;
}
.search-form button {
  background: var(--green-900);
  color: #fff;
  border: none;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 6px 14px;
  font-size: 0.875rem;
  cursor: pointer;
}
.search-form button:hover { background: #000; }

.annotation-toggle {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,.4);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
}
.annotation-toggle[aria-pressed="true"] {
  background: var(--accent-amber);
  color: var(--green-900);
  border-color: var(--accent-amber);
}

/* --- Site footer --- */
.site-footer {
  margin-top: 60px;
  padding: 24px;
  border-top: 1px solid var(--cream-300);
  text-align: center;
}

/* --- Hero --- */
.hero {
  background: linear-gradient(135deg, var(--green-300), var(--green-700));
  color: #fff;
  padding: 48px 24px;
}
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.hero h1 { color: #fff; font-size: 2.5rem; }
.hero-tagline { font-size: 1.125rem; opacity: 0.95; margin-bottom: 24px; }

.hero-search {
  display: flex;
  max-width: 560px;
  margin: 0 auto;
}
.hero-search input[type=search] {
  flex: 1;
  border: none;
  border-radius: var(--radius-md) 0 0 var(--radius-md);
  padding: 12px 16px;
  font-size: 1rem;
}
.hero-search button {
  background: var(--cream-100);
  color: var(--green-900);
  border: none;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}
.hero-search button:hover { background: #fff; }

.hero-examples {
  margin-top: 12px;
  opacity: 0.9;
}
.hero-examples a {
  color: #fff;
  text-decoration: underline;
  margin: 0 4px;
}

/* --- Featured plants on home --- */
.featured {
  max-width: var(--max-width);
  margin: 48px auto;
  padding: 0 24px;
}
.card-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.plant-card {
  background: #fff;
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.plant-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
.plant-card a { color: var(--ink-900); text-decoration: none; display: block; padding: 12px; }
.plant-card a:hover { text-decoration: none; }
.plant-card-thumb {
  height: 140px;
  background-color: var(--green-300);
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-sm);
  margin-bottom: 10px;
}
.plant-card-name { font-weight: 600; color: var(--green-900); }

/* --- Search results page --- */
.search-page {
  max-width: 800px;
  margin: 32px auto;
  padding: 0 24px;
}
.result-list {
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}
.result-card {
  margin-bottom: 12px;
  background: #fff;
  border: 1px solid var(--cream-300);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: box-shadow 0.15s ease;
}
.result-card:hover { box-shadow: var(--shadow-md); }
.result-link {
  display: flex;
  gap: 16px;
  padding: 12px;
  color: var(--ink-900);
  text-decoration: none;
}
.result-link:hover { text-decoration: none; }
.result-thumb {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  background-color: var(--green-300);
  background-size: cover;
  background-position: center;
  border-radius: var(--radius-sm);
}
.result-body { flex: 1; }
.result-name { font-weight: 600; color: var(--green-900); font-size: 1.05rem; }
.result-summary { color: var(--ink-700); margin-top: 4px; }

mark { background: var(--accent-amber-bg); padding: 0 2px; border-radius: 2px; }

.empty-state {
  background: var(--cream-200);
  padding: 24px;
  border-radius: var(--radius-md);
  text-align: center;
  color: var(--ink-500);
}

/* --- Plant detail layout (sidebar TOC + main) --- */
.plant-page {
  max-width: var(--max-width);
  margin: 0 auto;
}
.plant-hero {
  background: linear-gradient(135deg, var(--green-300), var(--green-700));
  color: #fff;
  padding: 56px 32px;
  position: relative;
}
.plant-hero-name { font-size: 2.5rem; font-family: Georgia, serif; color: #fff; margin: 0; }
.plant-hero-sci { font-style: italic; opacity: 0.9; margin-bottom: 12px; }
.plant-hero-pills { margin-top: 12px; display: flex; gap: 8px; flex-wrap: wrap; }
.pill {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
}

.plant-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 0;
}
.plant-toc {
  background: var(--cream-200);
  border-right: 1px solid var(--cream-300);
  padding: 24px 16px;
  position: sticky;
  top: 60px; /* under the site header */
  align-self: start;
  height: calc(100vh - 60px);
  overflow-y: auto;
}
.plant-toc-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-500);
  margin-bottom: 10px;
}
.plant-toc ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.plant-toc li { margin: 0; }
.plant-toc a {
  display: block;
  padding: 6px 10px;
  color: var(--ink-700);
  font-size: 0.9rem;
  border-left: 3px solid transparent;
  text-decoration: none;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}
.plant-toc a:hover { background: rgba(0,0,0,0.03); }
.plant-toc a.active {
  border-left-color: var(--green-600);
  color: var(--green-600);
  font-weight: 600;
  background: rgba(42, 122, 62, 0.06);
}

.plant-content {
  padding: 32px 40px;
  max-width: 760px;
}
.plant-content section { scroll-margin-top: 70px; }
.plant-content section + section {
  border-top: 1px solid var(--cream-300);
  margin-top: 32px;
  padding-top: 32px;
}

.facts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.fact {
  background: var(--cream-200);
  padding: 12px;
  border-radius: var(--radius-sm);
}
.fact-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--ink-500);
}
.fact-value { font-size: 1rem; color: var(--ink-900); margin-top: 4px; }

.method-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 16px;
}
.method-card {
  background: var(--green-100);
  border-radius: var(--radius-md);
  padding: 16px;
}
.method-card h4 {
  font-family: Georgia, serif;
  color: var(--green-900);
  margin: 0 0 6px;
}
.method-card .method-meta {
  font-size: 0.8rem;
  color: var(--ink-500);
  margin-bottom: 10px;
}
.method-card ol {
  padding-left: 18px;
  font-size: 0.9rem;
  line-height: 1.6;
}
.method-card .method-notes {
  margin-top: 10px;
  font-size: 0.85rem;
  color: var(--ink-700);
  font-style: italic;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.photo-grid .photo {
  background: var(--green-300);
  height: 140px;
  border-radius: var(--radius-sm);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.related-card {
  background: var(--cream-200);
  padding: 12px;
  border-radius: var(--radius-sm);
  display: flex;
  gap: 12px;
  align-items: center;
  text-decoration: none;
  color: var(--ink-900);
}
.related-card:hover { background: var(--cream-300); text-decoration: none; }
.related-card .thumb {
  width: 56px;
  height: 56px;
  background: var(--green-300);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

/* --- Stub plant page banner --- */
.stub-notice {
  background: var(--accent-amber-bg);
  border-left: 4px solid var(--accent-amber);
  padding: 12px 16px;
  margin: 24px 0;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  color: var(--ink-700);
  font-size: 0.9rem;
}
```

- [ ] **Step 2: Verify home page now looks styled**

Run: `open /Users/janak/CNPS/index.html`
Expected:
- Header is dark green with white brand text
- Hero band has a green gradient with centered headline, search bar, and example links
- Featured plant cards are in a 3-column grid with hover lift
- Footer is a subtle line of muted text

Run: `open "/Users/janak/CNPS/search.html?q=manzanita"`
Expected: result card looks styled — image thumbnail on the left, name/sci/summary on the right; matched terms highlighted with amber background.

---

## Task 7a: Manzanita page — header, hero, Overview, At a glance

**Files:**
- Create: `/Users/janak/CNPS/plants/manzanita.html`

This task creates the page skeleton + first two sections. Subsequent 7b/7c/7d will append more sections.

- [ ] **Step 1: Write the initial `plants/manzanita.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manzanita · Calscape</title>
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/layout.css">
  <link rel="stylesheet" href="../assets/css/annotations.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="../index.html">Calscape</a>
    <form class="search-form" role="search" action="../search.html" method="get">
      <input type="search" name="q" placeholder="Search plants…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <button class="annotation-toggle" id="annotation-toggle" type="button" aria-pressed="false">Show IA notes</button>
  </header>

  <article class="plant-page">

    <header class="plant-hero">
      <div>
        <div class="plant-hero-sci"
             data-note='{"n":5,"title":"Canonical URL","body":"/plants/manzanita is the canonical home for everything about this plant. No /propagation/manzanita exists."}'>Arctostaphylos densiflora 'Howard McMinn'</div>
        <h1 class="plant-hero-name">Manzanita</h1>
        <div class="plant-hero-pills">
          <span class="pill">Evergreen shrub</span>
          <span class="pill">Drought tolerant</span>
          <span class="pill">Pollinator</span>
          <span class="pill">Chaparral native</span>
        </div>
      </div>
    </header>

    <div class="plant-body">
      <aside class="plant-toc" id="plant-toc"
             data-note='{"n":6,"title":"Propagation is a section among peers","body":"Same weight as Habitat or Growing — not separated into its own destination."}'>
        <div class="plant-toc-label">On this page</div>
        <ul>
          <li><a href="#overview" class="active">Overview</a></li>
          <li><a href="#at-a-glance">At a glance</a></li>
          <li><a href="#habitat">Habitat &amp; Range</a></li>
          <li><a href="#garden-use">Garden Use</a></li>
          <li><a href="#growing">Growing Conditions</a></li>
          <li><a href="#propagation">Propagation</a></li>
          <li><a href="#wildlife">Wildlife Value</a></li>
          <li><a href="#photos">Photos</a></li>
          <li><a href="#related">Related plants</a></li>
        </ul>
      </aside>

      <div class="plant-content">

        <section id="overview">
          <h2>Overview</h2>
          <p>
            Manzanita is an evergreen shrub native to California's chaparral and coastal scrub.
            Its smooth, mahogany-red bark, blue-green leaves, and clusters of small urn-shaped flowers
            in late winter make it one of the most distinctive plants of the California landscape.
            'Howard McMinn' is a garden-friendly hybrid valued for its compact, mounded form and
            superior performance in cultivated settings compared to most wild species.
          </p>
          <p>
            Manzanitas grow slowly and live long — wild specimens can reach 50+ years.
            In a garden, they form a sculptural anchor: a single mature plant can carry an entire bed.
          </p>
        </section>

        <section id="at-a-glance">
          <h2>At a glance</h2>
          <div class="facts-grid">
            <div class="fact"><div class="fact-label">Height</div><div class="fact-value">3–8 ft</div></div>
            <div class="fact"><div class="fact-label">Spread</div><div class="fact-value">4–10 ft</div></div>
            <div class="fact"><div class="fact-label">Sun</div><div class="fact-value">Full sun</div></div>
            <div class="fact"><div class="fact-label">Water</div><div class="fact-value">Very low</div></div>
            <div class="fact"><div class="fact-label">Soil</div><div class="fact-value">Well-drained, lean</div></div>
            <div class="fact"><div class="fact-label">Bloom</div><div class="fact-value">Jan–Mar</div></div>
          </div>
        </section>

        <!-- Sections 7b/7c/7d will be inserted here -->

      </div>
    </div>
  </article>

  <footer class="site-footer">
    <p class="small muted">Prototype — California Native Plant Society</p>
  </footer>

  <script src="../assets/js/plants-data.js"></script>
  <script src="../assets/js/annotations.js"></script>
  <script src="../assets/js/toc.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Run: `open /Users/janak/CNPS/plants/manzanita.html`
Expected:
- Header bar styled like home
- Green gradient hero with scientific name (italic), "Manzanita" headline, and four attribute pills
- Two-column body: sidebar TOC on the left (sticky), Overview + At a glance sections on the right with the facts grid
- TOC link styling: "Overview" is highlighted as active (the JS in Task 8 will swap this on scroll — for now it's static)
- TOC links won't actually scroll-spy yet (Task 8); but clicking them should jump to anchors

---

## Task 7b: Manzanita — Habitat, Garden Use, Growing Conditions

**Files:**
- Modify: `/Users/janak/CNPS/plants/manzanita.html`

- [ ] **Step 1: Insert three sections after the At a Glance section**

Find the `<!-- Sections 7b/7c/7d will be inserted here -->` comment and replace it with:

```html
        <section id="habitat">
          <h2>Habitat &amp; Range</h2>
          <p>
            Wild Manzanita species are found across California's chaparral, coastal scrub, and lower-elevation
            forests, from Baja California north into Oregon. They thrive in lean, well-drained, often rocky
            soils on slopes where water moves quickly.
          </p>
          <p>
            'Howard McMinn' is a hybrid (A. densiflora × A. uva-ursi) developed at the University of California
            Botanical Garden in the 1950s — bred for garden adaptability.
          </p>
          <div class="placeholder" style="background:var(--cream-200);height:180px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;color:var(--ink-500);font-style:italic">
            Range map placeholder
          </div>
        </section>

        <section id="garden-use">
          <h2>Garden Use</h2>
          <p>
            Excellent as a sculptural anchor in a dry garden, low-water hedge, or slope stabilizer.
            The smooth red bark provides visual interest year-round, especially in winter when most
            other plants are dormant.
          </p>
          <p><strong>Companion plants:</strong> California buckwheat, sticky monkeyflower, deergrass,
          ceanothus, salvias. All share Manzanita's preference for lean soil and minimal summer water.</p>
        </section>

        <section id="growing">
          <h2>Growing Conditions</h2>
          <ul>
            <li><strong>Sun:</strong> Full sun. Tolerates light afternoon shade inland.</li>
            <li><strong>Water:</strong> Very low once established. Summer water is the single most common
              cause of decline; do not irrigate established plants.</li>
            <li><strong>Soil:</strong> Lean, well-drained, slightly acidic preferred. Tolerates clay if
              planted on a slope or mound for drainage.</li>
            <li><strong>USDA Zone:</strong> 7–10.</li>
            <li><strong>Establishment:</strong> Water deeply once a week the first summer; taper off in
              year 2; by year 3, rely on winter rain only.</li>
          </ul>
        </section>

        <!-- Section 7c will be inserted here -->
```

- [ ] **Step 2: Verify in browser**

Run: `open /Users/janak/CNPS/plants/manzanita.html`
Expected: three additional sections visible after At a glance, with dividing borders, the range-map placeholder, companion plants line, and growing conditions list.

Click "Growing Conditions" in the sidebar TOC → page should jump to that section.

---

## Task 7c: Manzanita — Propagation (the centerpiece)

**Files:**
- Modify: `/Users/janak/CNPS/plants/manzanita.html`

This is the section that does the heavy lifting in the IA argument.

- [ ] **Step 1: Insert the Propagation section**

Find `<!-- Section 7c will be inserted here -->` and replace it with:

```html
        <section id="propagation"
                 data-note='{"n":7,"title":"Propagation in context","body":"Lives in the plant page so users see propagation in context of habitat, climate, and growing needs — not abstracted into a how-to library."}'>
          <h2>Propagation</h2>
          <p>
            Manzanita is famously challenging to propagate. Three methods are viable, with very
            different effort and success rates. Cuttings are most common in nurseries; layering
            is the highest-success method for home gardeners; seed is mostly for research and
            patience-rich enthusiasts.
          </p>

          <div class="method-cards">

            <div class="method-card">
              <h4>From seed</h4>
              <div class="method-meta">Difficulty: <strong>High</strong> · Timing: Sow in fall</div>
              <ol>
                <li>Collect ripe berries in fall; macerate in water to separate seeds.</li>
                <li>Treat to simulate fire: pour boiling water over seeds and let stand 24 hours, or use commercial smoke water.</li>
                <li>Cold-stratify: refrigerate moist seeds at 35–40°F for 30–60 days.</li>
                <li>Sow in a well-drained gritty mix; keep slightly moist.</li>
                <li>Germination is erratic over 1–3 years; expect 1–2% success even with full treatment.</li>
              </ol>
              <div class="method-notes">Manzanita seed has famously low germination rates. Most growers use cuttings unless they specifically need genetic diversity.</div>
            </div>

            <div class="method-card">
              <h4>From cuttings</h4>
              <div class="method-meta">Difficulty: <strong>Medium</strong> · Timing: Late summer to early fall</div>
              <ol>
                <li>Take 4–6 inch semi-hardwood cuttings from current-year growth.</li>
                <li>Strip the lower leaves; cut just below a node.</li>
                <li>Dip in 0.8% IBA rooting hormone (higher for stubborn species).</li>
                <li>Insert into a fast-draining mix: 50/50 perlite and coarse sand.</li>
                <li>Provide humidity (dome or mist) and bottom heat (~70°F).</li>
                <li>Roots form in 6–12 weeks for 'Howard McMinn'; some wild species take 6+ months.</li>
              </ol>
              <div class="method-notes">'Howard McMinn' and other garden hybrids root far more reliably than wild-collected species.</div>
            </div>

            <div class="method-card">
              <h4>Layering</h4>
              <div class="method-meta">Difficulty: <strong>Low</strong> · Timing: Late winter to early spring</div>
              <ol>
                <li>Select a low, flexible branch from a healthy parent plant.</li>
                <li>Wound the underside of the branch where it will contact soil.</li>
                <li>Bury that section under 3–4 inches of soil; pin with a stone or wire.</li>
                <li>Keep moist (the parent plant will do most of the work).</li>
                <li>Roots form over 1–2 years.</li>
                <li>Cut the new plant from the parent once well-rooted; transplant in fall.</li>
              </ol>
              <div class="method-notes">Slow but very reliable. Best suited to low-growing species like 'Howard McMinn'; impractical for upright varieties.</div>
            </div>

          </div>
        </section>

        <!-- Section 7d will be inserted here -->
```

- [ ] **Step 2: Verify in browser**

Run: `open "/Users/janak/CNPS/plants/manzanita.html#propagation"`
Expected: page opens scrolled to the Propagation section. Three green-tinted method cards in a row, each with the method name, difficulty/timing meta, numbered steps, and italic notes at the bottom.

Also confirm: searching from home for "stratification" lands on this page deep-linked to `#propagation`.
Run: `open "/Users/janak/CNPS/index.html"`, type "stratification" into the hero search, submit → result lands on `search.html?q=stratification`. Click Manzanita result → URL should end with `#propagation` and page should scroll there.

---

## Task 7d: Manzanita — Wildlife, Photos, Related plants

**Files:**
- Modify: `/Users/janak/CNPS/plants/manzanita.html`

- [ ] **Step 1: Insert the final three sections**

Find `<!-- Section 7d will be inserted here -->` and replace it with:

```html
        <section id="wildlife">
          <h2>Wildlife Value</h2>
          <ul>
            <li><strong>Pollinators:</strong> Manzanita's winter-blooming urn-shaped flowers are a critical nectar
              source for native bumblebees and honeybees when little else is in bloom.</li>
            <li><strong>Birds:</strong> Berries feed quail, towhees, mockingbirds, and many migratory species in late spring and summer.</li>
            <li><strong>Larval host:</strong> Several Arctostaphylos-specialist moth species require manzanita as host plants.</li>
          </ul>
        </section>

        <section id="photos">
          <h2>Photos</h2>
          <div class="photo-grid">
            <div class="photo"></div>
            <div class="photo"></div>
            <div class="photo"></div>
            <div class="photo"></div>
            <div class="photo"></div>
            <div class="photo"></div>
          </div>
        </section>

        <section id="related"
                 data-note='{"n":8,"title":"Pivot by plant identity","body":"Related plants are surfaced by botanical relationship, not by \"similar propagation difficulty\" — reinforces plant-as-the-unit."}'>
          <h2>Related plants</h2>
          <div class="related-grid">
            <a class="related-card" href="california-poppy.html">
              <div class="thumb"></div>
              <div>
                <div><strong>California Poppy</strong></div>
                <div class="small muted italic">Eschscholzia californica</div>
              </div>
            </a>
            <a class="related-card" href="ceanothus.html">
              <div class="thumb"></div>
              <div>
                <div><strong>California Lilac</strong></div>
                <div class="small muted italic">Ceanothus thyrsiflorus</div>
              </div>
            </a>
            <a class="related-card" href="toyon.html">
              <div class="thumb"></div>
              <div>
                <div><strong>Toyon</strong></div>
                <div class="small muted italic">Heteromeles arbutifolia</div>
              </div>
            </a>
            <a class="related-card" href="coast-live-oak.html">
              <div class="thumb"></div>
              <div>
                <div><strong>Coast Live Oak</strong></div>
                <div class="small muted italic">Quercus agrifolia</div>
              </div>
            </a>
          </div>
        </section>
```

- [ ] **Step 2: Verify in browser**

Run: `open /Users/janak/CNPS/plants/manzanita.html`
Expected: page now ends with Wildlife Value (list), Photos (6 green placeholder blocks in a grid), and Related plants (4 cards in 2×2 grid). Clicking a Related card navigates to a stub page (will 404 until Task 9).

---

## Task 8: Sidebar TOC scroll-spy + smooth scroll

**Files:**
- Create: `/Users/janak/CNPS/assets/js/toc.js`

- [ ] **Step 1: Add scroll-spy tests to `__tests__.html`**

Append before the Summary block:

```javascript
    // toc.js tests are integration-only (depend on DOM layout).
    // We test only the pure helper exposed for testing.
    assert('Calscape.toc namespace exists',
      typeof window.Calscape.toc === 'object');
    assert('Calscape.toc.findActiveSection is a function',
      typeof window.Calscape.toc.findActiveSection === 'function');

    // findActiveSection takes an array of {id, top} and a scrollY value;
    // returns the id of the section whose top is the largest top <= scrollY.
    const sections = [
      { id: 'overview', top: 0 },
      { id: 'at-a-glance', top: 400 },
      { id: 'habitat', top: 900 },
      { id: 'propagation', top: 1500 }
    ];
    assert('findActiveSection returns first section when scrollY=0',
      Calscape.toc.findActiveSection(sections, 0) === 'overview');
    assert('findActiveSection returns correct mid section',
      Calscape.toc.findActiveSection(sections, 950) === 'habitat');
    assert('findActiveSection returns last when scrolled past all',
      Calscape.toc.findActiveSection(sections, 5000) === 'propagation');
    assert('findActiveSection returns first when array is empty',
      Calscape.toc.findActiveSection([], 100) === null);
```

Open the test page; the new assertions should fail (`Calscape.toc` undefined).

- [ ] **Step 2: Write `toc.js`**

```javascript
// toc.js — sidebar TOC scroll-spy + smooth scroll
// Only initializes if the page contains a .plant-toc element.

(function () {
  const Calscape = window.Calscape || {};

  // Pure helper: given [{id, top}, ...] and a scrollY value,
  // returns the id of the section whose top is the greatest value <= scrollY.
  // Returns null if the array is empty.
  function findActiveSection(sections, scrollY) {
    if (!sections || sections.length === 0) return null;
    let active = sections[0].id;
    for (const s of sections) {
      if (s.top <= scrollY + 80) active = s.id; // 80px = header offset
    }
    return active;
  }

  function init() {
    const toc = document.querySelector('.plant-toc');
    if (!toc) return;

    const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
    if (links.length === 0) return;

    // Smooth scroll on click
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const id = link.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      });
    });

    // Build section index lazily; recompute on resize.
    let sectionIndex = [];
    function rebuildIndex() {
      sectionIndex = links.map(link => {
        const id = link.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
      }).filter(Boolean);
    }

    function updateActive() {
      const activeId = findActiveSection(sectionIndex, window.scrollY);
      links.forEach(link => {
        const isActive = link.getAttribute('href') === '#' + activeId;
        link.classList.toggle('active', isActive);
      });
    }

    rebuildIndex();
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', () => { rebuildIndex(); updateActive(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  Calscape.toc = { findActiveSection };
  window.Calscape = Calscape;
})();
```

- [ ] **Step 3: Verify tests pass**

Run: `open /Users/janak/CNPS/assets/__tests__.html`
Expected: all assertions pass (green).

- [ ] **Step 4: Verify TOC scroll-spy in browser**

Run: `open /Users/janak/CNPS/plants/manzanita.html`
Expected:
- Sidebar TOC visible on left
- As you scroll down, the active highlight moves from Overview → At a glance → Habitat & Range → … in lockstep with the section you're reading
- Clicking a TOC link smoothly scrolls to that section
- URL hash updates to the section ID without a hard jump

---

## Task 9: Stub plant pages

**Files:**
- Create: `/Users/janak/CNPS/plants/california-poppy.html`
- Create: `/Users/janak/CNPS/plants/hummingbird-sage.html`
- Create: `/Users/janak/CNPS/plants/coast-live-oak.html`
- Create: `/Users/janak/CNPS/plants/toyon.html`
- Create: `/Users/janak/CNPS/plants/ceanothus.html`

Five stub pages so internal links from Manzanita's Related-plants block all resolve.

- [ ] **Step 1: Write `plants/california-poppy.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>California Poppy · Calscape</title>
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/layout.css">
  <link rel="stylesheet" href="../assets/css/annotations.css">
</head>
<body>
  <header class="site-header">
    <a class="brand" href="../index.html">Calscape</a>
    <form class="search-form" role="search" action="../search.html" method="get">
      <input type="search" name="q" placeholder="Search plants…" autocomplete="off">
      <button type="submit">Search</button>
    </form>
    <button class="annotation-toggle" id="annotation-toggle" type="button" aria-pressed="false">Show IA notes</button>
  </header>

  <article class="plant-page">
    <header class="plant-hero">
      <div>
        <div class="plant-hero-sci">Eschscholzia californica</div>
        <h1 class="plant-hero-name">California Poppy</h1>
        <div class="plant-hero-pills">
          <span class="pill">State flower</span>
          <span class="pill">Annual / Perennial</span>
          <span class="pill">Full sun</span>
        </div>
      </div>
    </header>

    <div style="max-width:760px;margin:32px auto;padding:0 24px;">
      <div class="stub-notice">
        <strong>Placeholder page.</strong> In this prototype, only the Manzanita page is fully built out.
        The full structure (sidebar TOC, all sections including an integrated propagation guide)
        applies to every plant — this stub keeps the navigation argument honest.
      </div>
      <p>
        California's state flower. An iconic annual (sometimes short-lived perennial) with silky orange
        cups that open in sun and close on overcast days. Naturalizes readily from fall-sown seed.
      </p>
      <p><a href="../index.html">← Back to home</a></p>
    </div>
  </article>

  <footer class="site-footer">
    <p class="small muted">Prototype — California Native Plant Society</p>
  </footer>

  <script src="../assets/js/plants-data.js"></script>
  <script src="../assets/js/annotations.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `plants/hummingbird-sage.html`**

Same structure as California Poppy. Change `<title>`, scientific name, common name, pills, and the single paragraph:

```html
<!-- inside <head>: -->
<title>Hummingbird Sage · Calscape</title>

<!-- hero: -->
<div class="plant-hero-sci">Salvia spathacea</div>
<h1 class="plant-hero-name">Hummingbird Sage</h1>
<div class="plant-hero-pills">
  <span class="pill">Perennial</span>
  <span class="pill">Pollinator</span>
  <span class="pill">Part shade</span>
</div>

<!-- body paragraph: -->
<p>
  Spreading evergreen perennial sage with tall spikes of magenta tubular flowers. A pollinator favorite,
  especially for hummingbirds. Propagates readily by rhizome division — a striking contrast to manzanita.
</p>
```

Everything else (header, footer, scripts, stub notice) is identical to California Poppy.

- [ ] **Step 3: Write `plants/coast-live-oak.html`**

```html
<!-- inside <head>: -->
<title>Coast Live Oak · Calscape</title>

<!-- hero: -->
<div class="plant-hero-sci">Quercus agrifolia</div>
<h1 class="plant-hero-name">Coast Live Oak</h1>
<div class="plant-hero-pills">
  <span class="pill">Tree</span>
  <span class="pill">Evergreen</span>
  <span class="pill">Long-lived</span>
</div>

<!-- body paragraph: -->
<p>
  Iconic evergreen oak of coastal California — gnarled, broad-canopied, and capable of living 250+ years.
  Grows easily from a freshly-fallen acorn pressed into the ground. The slowest-developing relationship
  in a garden, and one of the most rewarding.
</p>
```

- [ ] **Step 4: Write `plants/toyon.html`**

```html
<!-- inside <head>: -->
<title>Toyon · Calscape</title>

<!-- hero: -->
<div class="plant-hero-sci">Heteromeles arbutifolia</div>
<h1 class="plant-hero-name">Toyon</h1>
<div class="plant-hero-pills">
  <span class="pill">Evergreen shrub</span>
  <span class="pill">Wildlife</span>
  <span class="pill">Berries</span>
</div>

<!-- body paragraph: -->
<p>
  Evergreen shrub or small tree with clusters of bright red berries in winter — the "Holly" that gave
  Hollywood its name. Berries feed cedar waxwings, robins, and other birds through the dry season.
  Grows from cold-stratified seed.
</p>
```

- [ ] **Step 5: Write `plants/ceanothus.html`**

```html
<!-- inside <head>: -->
<title>California Lilac · Calscape</title>

<!-- hero: -->
<div class="plant-hero-sci">Ceanothus thyrsiflorus</div>
<h1 class="plant-hero-name">California Lilac</h1>
<div class="plant-hero-pills">
  <span class="pill">Evergreen shrub</span>
  <span class="pill">Nitrogen-fixer</span>
  <span class="pill">Pollinator</span>
</div>

<!-- body paragraph: -->
<p>
  Evergreen shrub that disappears under clouds of pale-blue flowers each spring. Nitrogen-fixing — it
  builds soil quality where it grows. Propagated from softwood cuttings or scarified seed (briefly
  treated with boiling water to break dormancy).
</p>
```

- [ ] **Step 6: Verify in browser**

Run: `open /Users/janak/CNPS/plants/manzanita.html`, scroll to "Related plants", click each card.
Expected: all four links open valid stub pages (no 404). Each page shows: header, plant hero with name and pills, the yellow "Placeholder page" stub notice, a one-paragraph description, and a back-to-home link.

Also visit `plants/ceanothus.html` directly: `open /Users/janak/CNPS/plants/ceanothus.html` (linked from Manzanita's Related cards).

---

## Task 10: Annotation overlay CSS

**Files:**
- Create: `/Users/janak/CNPS/assets/css/annotations.css`

- [ ] **Step 1: Write `annotations.css`**

```css
/* annotations.css — sticky-note overlay for "Show IA notes" mode */

.ia-note {
  position: absolute;
  z-index: 5;
  background: var(--accent-amber-bg);
  border: 1px solid var(--accent-amber);
  border-radius: var(--radius-sm);
  padding: 10px 12px;
  width: 240px;
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--ink-700);
  box-shadow: var(--shadow-md);
  pointer-events: auto;
  transition: opacity 0.2s ease;
}

.ia-note::before {
  content: attr(data-n);
  display: inline-block;
  width: 22px;
  height: 22px;
  background: var(--accent-amber);
  color: var(--green-900);
  border-radius: 50%;
  text-align: center;
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 22px;
  margin-right: 8px;
  vertical-align: middle;
}

.ia-note .ia-note-title {
  display: inline;
  font-weight: 700;
  color: var(--green-900);
}

.ia-note .ia-note-body {
  display: block;
  margin-top: 6px;
}

/* Highlight the annotated element itself when notes are visible */
body.annotations-on [data-note] {
  outline: 2px dashed var(--accent-amber);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
  transition: outline-color 0.2s ease;
}

/* When notes are off, hide all notes and remove the outline */
body:not(.annotations-on) .ia-note { display: none; }

/* Mobile: compact tabs */
@media (max-width: 640px) {
  .ia-note {
    position: fixed;
    bottom: 16px;
    left: 16px;
    right: 16px;
    width: auto;
    z-index: 50;
  }
  /* Show only the active mobile note at a time; controlled via JS */
  body:not(.annotations-on) .ia-note { display: none; }
  .ia-note:not(.ia-note-mobile-active) { display: none; }

  /* Mobile floating tab cluster (numbered dots near each annotated element) */
  .ia-note-tab {
    position: absolute;
    z-index: 5;
    background: var(--accent-amber);
    color: var(--green-900);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-weight: 700;
    font-size: 0.75rem;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }
  body:not(.annotations-on) .ia-note-tab { display: none; }
}

/* On desktop, hide mobile-only tabs */
@media (min-width: 641px) {
  .ia-note-tab { display: none !important; }
}
```

- [ ] **Step 2: Manual visual check in DevTools**

Open any page (e.g., `open /Users/janak/CNPS/index.html`). Open DevTools console and run:
```javascript
document.body.classList.add('annotations-on');
const note = document.createElement('div');
note.className = 'ia-note';
note.setAttribute('data-n', '1');
note.innerHTML = '<span class="ia-note-title">One unified search</span><span class="ia-note-body">One search box covers all plant content.</span>';
note.style.top = '200px';
note.style.left = '40px';
document.body.appendChild(note);
```
Expected: a yellow sticky note appears in the upper-left of the page, with a circled "1" prefix, bold title, and body text below.

Then in the DevTools console:
```javascript
document.querySelector('[data-note]') && document.querySelector('[data-note]').getBoundingClientRect();
```
Expected: returns a DOMRect — confirms there are `[data-note]` elements in the page.

Reload to clear the manual edits.

---

## Task 11: Annotation overlay JS

**Files:**
- Create: `/Users/janak/CNPS/assets/js/annotations.js`

- [ ] **Step 1: Write `annotations.js`**

```javascript
// annotations.js — "Show IA notes" toggle + sticky note rendering
// State persists across pages via localStorage.
// Each annotation is declared inline on its target element as:
//   data-note='{"n":1,"title":"...","body":"..."}'

(function () {
  const Calscape = window.Calscape || {};
  const STORAGE_KEY = 'calscape.annotations.on';

  function isOn() {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  }

  function setOn(on) {
    localStorage.setItem(STORAGE_KEY, on ? 'true' : 'false');
    document.body.classList.toggle('annotations-on', on);
    const btn = document.getElementById('annotation-toggle');
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (on) renderAllNotes();
    else clearAllNotes();
  }

  function clearAllNotes() {
    document.querySelectorAll('.ia-note, .ia-note-tab').forEach(el => el.remove());
  }

  function renderAllNotes() {
    clearAllNotes();
    const isMobile = window.matchMedia('(max-width: 640px)').matches;
    document.querySelectorAll('[data-note]').forEach((target, idx) => {
      let data;
      try { data = JSON.parse(target.getAttribute('data-note')); }
      catch { return; }
      if (isMobile) renderMobileTab(target, data);
      else renderDesktopNote(target, data);
    });
  }

  function renderDesktopNote(target, data) {
    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const note = document.createElement('div');
    note.className = 'ia-note';
    note.setAttribute('data-n', data.n);
    note.innerHTML =
      '<span class="ia-note-title">' + escapeHtml(data.title) + '</span>' +
      '<span class="ia-note-body">' + escapeHtml(data.body) + '</span>';

    // Position to the right of the target; if no room, position below.
    const noteWidth = 240;
    const margin = 16;
    const docWidth = document.documentElement.scrollWidth;

    let left = rect.right + scrollX + margin;
    let top = rect.top + scrollY;

    if (left + noteWidth > docWidth - 10) {
      // Place below
      left = rect.left + scrollX;
      top = rect.bottom + scrollY + margin;
    }

    note.style.left = left + 'px';
    note.style.top = top + 'px';
    document.body.appendChild(note);
  }

  function renderMobileTab(target, data) {
    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    const tab = document.createElement('button');
    tab.className = 'ia-note-tab';
    tab.textContent = data.n;
    tab.style.left = (rect.left + scrollX) + 'px';
    tab.style.top = (rect.top + scrollY - 12) + 'px';
    tab.setAttribute('aria-label', 'Show annotation ' + data.n);

    tab.addEventListener('click', () => {
      // Remove any existing active mobile note
      document.querySelectorAll('.ia-note').forEach(n => n.remove());
      const note = document.createElement('div');
      note.className = 'ia-note ia-note-mobile-active';
      note.setAttribute('data-n', data.n);
      note.innerHTML =
        '<span class="ia-note-title">' + escapeHtml(data.title) + '</span>' +
        '<span class="ia-note-body">' + escapeHtml(data.body) + '</span>' +
        '<button class="ia-note-close" style="position:absolute;top:6px;right:8px;background:none;border:none;font-size:1.2rem;cursor:pointer;color:var(--ink-500)" aria-label="Close">×</button>';
      note.querySelector('.ia-note-close').addEventListener('click', () => note.remove());
      document.body.appendChild(note);
    });

    document.body.appendChild(tab);
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function init() {
    const btn = document.getElementById('annotation-toggle');
    if (btn) {
      btn.addEventListener('click', () => setOn(!isOn()));
    }
    setOn(isOn());

    // Re-render on resize and scroll (positions change as layout reflows)
    let raf = null;
    function scheduleRerender() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        if (isOn()) renderAllNotes();
      });
    }
    window.addEventListener('resize', scheduleRerender);
    window.addEventListener('scroll', scheduleRerender, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  Calscape.annotations = { isOn, setOn, renderAllNotes };
  window.Calscape = Calscape;
})();
```

- [ ] **Step 2: Verify on the home page**

Run: `open /Users/janak/CNPS/index.html`

Expected:
- Click "Show IA notes" in the header → button turns amber, two sticky notes appear:
  - Note #1 attached to the hero search bar ("One unified search")
  - Note #2 attached to the "propagation" example link
- The annotated elements get a dashed amber outline
- Click "Show IA notes" again → notes vanish, outlines clear
- Reload the page with notes ON → notes still appear (localStorage persisted)

- [ ] **Step 3: Verify across pages**

With notes ON, navigate Home → Search ("manzanita propagation") → Manzanita page.

Expected on Manzanita page:
- Note #5 on the URL bar position (anchored to the `.plant-page` container) — visible as a sticky note near the top
- Note #6 on the sidebar TOC
- Note #7 on the Propagation section (scroll to see it)
- Note #8 on the Related plants section

If a note overlaps content awkwardly on desktop, it's acceptable for this prototype — the goal is "annotations exist and explain decisions," not pixel-perfect positioning.

- [ ] **Step 4: Verify search-page notes**

Open `search.html?q=manzanita` with notes ON. Note #3 and #4 should appear near the result snippet and the result link respectively.

Wait — Task 7a's annotations only put notes #5–8 on Manzanita, and Task 5 placed #1–2 on home. We still need notes #3 and #4 on search results. Add them now:

In `search.html`, find the script block that renders results. After the `list.appendChild(li)` line, add (still inside the `results.forEach` loop):

```javascript
        // Annotate the first result on the first matched-field type only.
        if (r === results[0]) {
          const summaryEl = li.querySelector('.result-summary');
          if (summaryEl) summaryEl.setAttribute('data-note',
            JSON.stringify({ n: 3, title: "Inline match, not a separate result type",
              body: "Search hits in propagation content surface as snippet matches, not as a separate result type." }));
          const linkEl = li.querySelector('.result-link');
          if (linkEl) linkEl.setAttribute('data-note',
            JSON.stringify({ n: 4, title: "Anchored deep link",
              body: "Clicking deep-links to #propagation — the URL anchors into the plant page, not a different site." }));
        }
```

Then re-render annotations after results are inserted. Add this line at the end of the IIFE in `search.html` (after the forEach):

```javascript
      if (window.Calscape && Calscape.annotations && Calscape.annotations.isOn()) {
        Calscape.annotations.renderAllNotes();
      }
```

- [ ] **Step 5: Verify search annotations**

Reload `search.html?q=manzanita` with notes ON.
Expected: notes #3 and #4 appear attached to the first result's summary and link.

---

## Task 12: Responsive breakpoints

**Files:**
- Modify: `/Users/janak/CNPS/assets/css/layout.css` (append to end)
- Modify: `/Users/janak/CNPS/plants/manzanita.html` (add a mobile anchor menu)

- [ ] **Step 1: Append responsive media queries to `layout.css`**

```css
/* --- Tablet --- */
@media (max-width: 1023px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .facts-grid { grid-template-columns: repeat(2, 1fr); }
  .method-cards { grid-template-columns: 1fr; }
  .photo-grid { grid-template-columns: repeat(2, 1fr); }
  .related-grid { grid-template-columns: 1fr; }

  .plant-body { grid-template-columns: 180px 1fr; }
  .plant-content { padding: 24px; }
}

/* --- Mobile --- */
@media (max-width: 640px) {
  .site-header {
    flex-wrap: wrap;
    gap: 8px;
    padding: 10px 14px;
  }
  .search-form { order: 3; flex-basis: 100%; max-width: none; }
  .annotation-toggle { font-size: 0.7rem; padding: 3px 8px; }

  .hero { padding: 32px 16px; }
  .hero h1 { font-size: 1.75rem; }
  .hero-search { flex-direction: column; gap: 6px; }
  .hero-search input[type=search] { border-radius: var(--radius-md); }
  .hero-search button { border-radius: var(--radius-md); }

  .card-grid { grid-template-columns: 1fr; }
  .facts-grid { grid-template-columns: 1fr; }

  .plant-hero { padding: 32px 20px; }
  .plant-hero-name { font-size: 1.75rem; }

  .plant-body { grid-template-columns: 1fr; }
  .plant-toc { display: none; }
  .plant-content { padding: 16px; }

  /* Mobile anchor menu inserted in manzanita.html */
  .mobile-toc {
    background: var(--cream-200);
    border: 1px solid var(--cream-300);
    border-radius: var(--radius-md);
    margin: 16px 0;
    padding: 12px 16px;
  }
  .mobile-toc summary {
    cursor: pointer;
    font-weight: 600;
    color: var(--green-900);
  }
  .mobile-toc ul {
    list-style: none;
    padding: 12px 0 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .mobile-toc a {
    display: block;
    padding: 4px 0;
    font-size: 0.9rem;
  }
}

/* Hide mobile-only blocks on larger screens */
@media (min-width: 641px) {
  .mobile-toc { display: none; }
}
```

- [ ] **Step 2: Add the mobile anchor menu to `plants/manzanita.html`**

Find `<div class="plant-content">` and insert immediately after it (so it's the first child of the content area):

```html
        <details class="mobile-toc">
          <summary>On this page</summary>
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#at-a-glance">At a glance</a></li>
            <li><a href="#habitat">Habitat &amp; Range</a></li>
            <li><a href="#garden-use">Garden Use</a></li>
            <li><a href="#growing">Growing Conditions</a></li>
            <li><a href="#propagation">Propagation</a></li>
            <li><a href="#wildlife">Wildlife Value</a></li>
            <li><a href="#photos">Photos</a></li>
            <li><a href="#related">Related plants</a></li>
          </ul>
        </details>
```

- [ ] **Step 3: Verify responsive layouts in DevTools**

Open `/Users/janak/CNPS/index.html` in Chrome. Open DevTools, toggle device mode (Cmd+Shift+M). Set to 375×667 (iPhone SE).

Expected:
- Header wraps with the search box on a second row
- Hero search stacks vertically (input above button)
- Featured cards become a single column
- "Show IA notes" toggle still works; annotations should display as numbered tab dots near each annotated element (mobile mode)

Navigate to `plants/manzanita.html` in mobile view:
- Sidebar TOC is hidden
- A "On this page" `<details>` accordion appears just above the Overview section; tapping it expands a 2-column section list
- Method cards stack vertically

Switch DevTools back to desktop and confirm the desktop sidebar TOC reappears.

---

## Task 13: Placeholder thumb images

**Files:**
- Create: `/Users/janak/CNPS/assets/img/thumbs/manzanita.svg`
- Create: similar SVGs for california-poppy, hummingbird-sage, coast-live-oak, toyon, and the remaining 10 plants

Rather than searching for real photographs, generate simple SVG color blocks so the prototype works offline with no asset hunt.

- [ ] **Step 1: Write a helper script to generate the SVGs**

Run this once from the project root (paste into a temporary `gen-thumbs.sh` or run inline):

```bash
mkdir -p /Users/janak/CNPS/assets/img/thumbs
cd /Users/janak/CNPS/assets/img/thumbs

# Slug, label, two hex colors (light, dark) for the gradient
while IFS='|' read -r slug label c1 c2; do
  cat > "${slug}.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#g)"/>
  <text x="100" y="105" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="14" font-weight="600" opacity="0.85">${label}</text>
</svg>
EOF
done <<'PLANTS'
manzanita|Manzanita|#9eb88f|#4d7a4b
california-poppy|Poppy|#ffb347|#d97a1f
hummingbird-sage|Hummingbird Sage|#a64d79|#5a1f3a
coast-live-oak|Coast Live Oak|#5a7b4f|#2d3e1f
toyon|Toyon|#a83a3a|#5a1f1f
ceanothus|Ceanothus|#7faedb|#2a4d7a
monkeyflower|Monkeyflower|#ff9e3d|#cc6600
yarrow|Yarrow|#e8d5a0|#a08850
matilija-poppy|Matilija|#fefefe|#e8e8d5
buckwheat|Buckwheat|#d4a572|#8a5d2c
deergrass|Deergrass|#c4a35a|#7a6533
elderberry|Elderberry|#4f6b8a|#1f2d4a
white-sage|White Sage|#c5cebd|#8a9580
douglas-iris|Douglas Iris|#8a5fa3|#3d2a5a
redbud|Redbud|#d97aa3|#8a2a4d
PLANTS
```

- [ ] **Step 2: Verify thumbs render**

Run: `open /Users/janak/CNPS/index.html`
Expected: the three Featured plant cards now show colored gradient thumbs with the plant name in white serif type, instead of flat green blocks.

Run: `open "/Users/janak/CNPS/search.html?q=plant"`
Expected: result cards show the colored gradient thumbs.

---

## Task 14: Final QA pass

This task is a manual checklist — no new files. Walk through the prototype end-to-end and confirm every behavior described in the spec.

- [ ] **Step 1: Home page checks**

Run: `open /Users/janak/CNPS/index.html`
- [ ] Header renders with brand, search box, "Show IA notes" button
- [ ] Hero band has correct gradient, headline, tagline, search bar, three example links
- [ ] Featured plants grid shows Manzanita, California Poppy, Hummingbird Sage with thumbs
- [ ] Submitting the hero search with "manzanita" navigates to `search.html?q=manzanita`
- [ ] Clicking the Manzanita featured card navigates to `plants/manzanita.html`

- [ ] **Step 2: Search behavior checks**

- [ ] `search.html?q=manzanita` returns 1 match (Manzanita), highlighted
- [ ] `search.html?q=cuttings` returns multiple matches; Manzanita link ends with `#propagation`
- [ ] `search.html?q=evergreen` returns the evergreen-tagged plants
- [ ] `search.html?q=zzzzzz` shows the empty state
- [ ] `search.html` (no query) shows the prompt without empty state

- [ ] **Step 3: Manzanita page checks**

Run: `open /Users/janak/CNPS/plants/manzanita.html`
- [ ] All 9 sections present and in order: Overview, At a glance, Habitat & Range, Garden Use, Growing Conditions, Propagation, Wildlife Value, Photos, Related plants
- [ ] Sidebar TOC visible (desktop), active section updates on scroll
- [ ] Smooth scroll on TOC link click
- [ ] Propagation section shows three method cards with steps
- [ ] Related plants block links to all four stub pages
- [ ] No console errors in DevTools

- [ ] **Step 4: Annotation overlay checks**

- [ ] Click "Show IA notes" → 8 notes total visible across the three substantive pages (2 on home, 2 on search, 4 on Manzanita)
- [ ] Toggle button shows amber background when on
- [ ] State persists across navigation (close + reopen tab still works while session lasts)
- [ ] Each annotated element shows a dashed amber outline when notes are on
- [ ] Clicking "Show IA notes" again hides all notes and outlines

- [ ] **Step 5: Responsive checks**

In DevTools, toggle device mode and set viewport to 375×667.
- [ ] Header wraps appropriately
- [ ] Featured plants become single column
- [ ] Manzanita sidebar TOC hidden; mobile anchor menu (details/summary) visible
- [ ] Method cards stack vertically
- [ ] Annotations appear as numbered amber dot tabs near elements; tapping opens the note as a bottom-fixed banner

- [ ] **Step 6: Tests pass**

Run: `open /Users/janak/CNPS/assets/__tests__.html`
- [ ] All assertions green, "0 failed" in green summary

- [ ] **Step 7: Stub pages**

For each of california-poppy, hummingbird-sage, coast-live-oak, toyon, ceanothus:
- [ ] Page opens, header renders, plant hero shows correct name/scientific/pills
- [ ] Yellow "Placeholder page" stub notice visible
- [ ] One-paragraph description present
- [ ] Back-to-home link works

When all 7 steps pass, the prototype is complete.

---

## Out of Scope (Reminder)

Per the design doc, none of these should be added during implementation without re-opening brainstorming:

- Backend, CMS, or database
- Accounts, favorites, comments
- A separate browse / category / index page
- A second fully built plant detail page
- An "about this prototype" intro page
- Pixel-perfect Calscape visual fidelity (only credible relationship needed)
- Search autocomplete, typo correction, analytics
- Propagation-specific search badges (explicitly removed during design)

---

## Implementation tips

- Each task is independently demoable. After completing a task, opening the relevant file in a browser should show the new behavior described in the verification step.
- The CSS file (`layout.css`) is the largest single artifact. If sticky positioning behaves oddly, the most common culprit is a wrapping element with `overflow: hidden` — check ancestors of `.plant-toc`.
- `localStorage` does work on `file://` in modern Chrome, Firefox, and Safari. If a future reviewer reports persistence issues, suggest serving with `python3 -m http.server` from the project root.
- For the propagation guide content (Task 7c), accuracy matters. The included content is reasonable; if a Calscape SME spots errors, treat their copy edits as spec-changing requests rather than implementation tweaks.
