// lightbox.js — click a .photo (with data-photo URL) to open a fullscreen view.
// Esc or backdrop click closes. Pure DOM, no dependencies.

(function () {
  function open(src) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.innerHTML =
      '<button class="lightbox__close" aria-label="Close">×</button>' +
      '<img class="lightbox__img" src="' + src + '" alt="">';

    function close() {
      overlay.classList.add('lightbox--out');
      setTimeout(() => overlay.remove(), 180);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.classList.contains('lightbox__close')) close();
    });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
    // Trigger fade-in
    requestAnimationFrame(() => overlay.classList.add('lightbox--in'));
  }

  function init() {
    document.querySelectorAll('.photo[data-photo]').forEach(el => {
      el.style.cursor = 'zoom-in';
      el.addEventListener('click', () => open(el.getAttribute('data-photo')));
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
