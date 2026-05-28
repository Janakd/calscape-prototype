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

  Calscape.search = { buildSearchString, score, search, highlight, resultUrl, FIELD_WEIGHTS };
  window.Calscape = Calscape;
})();
