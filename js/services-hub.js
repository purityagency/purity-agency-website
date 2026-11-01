// Hub /services : filtres par pilier. Fichier externe car la CSP bloque le script inline.
(() => {
  const filterBtns = document.querySelectorAll('.sd-hub-filter-btn');
  const cards = document.querySelectorAll('#services-grid .sd-hub-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.pillar === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
