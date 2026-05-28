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
