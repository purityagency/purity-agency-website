(function () {
  var grid = document.querySelector('.case-grid');
  if (!grid) return;
  var buttons = [].slice.call(document.querySelectorAll('[data-filter]'));
  var select = document.querySelector('.case-select');
  var status = document.querySelector('.case-status');
  var cards = [].slice.call(grid.querySelectorAll('.case-card'));
  var storageKey = 'purity-case-filter';
  var scrollKey = 'purity-case-scroll';
  var current = sessionStorage.getItem(storageKey) || 'Tous';

  var introTitle = document.querySelector('.cases__intro h1');
  var introKicker = document.querySelector('.cases__intro .section-kicker');
  if (introTitle) introTitle.textContent = 'Démos par métier.';
  if (introKicker) introKicker.textContent = 'Démos par métier';

  // --preview-scale ajuste l'iframe de 1280 px a la largeur de l'apercu.
  var previews = cards.map(function (card) { return card.querySelector('.case-preview'); }).filter(Boolean);
  function screenOf(preview) { return preview.querySelector('.case-preview__screen') || preview; }
  function setScale(preview, width) {
    if (width > 0) preview.style.setProperty('--preview-scale', (width / 1280).toFixed(4));
  }
  function updateScales() {
    // Toutes les lectures avant les ecritures : une seule mise en page.
    var widths = previews.map(function (preview) { return screenOf(preview).clientWidth; });
    previews.forEach(function (preview, i) { setScale(preview, widths[i]); });
  }
  var observer = 'ResizeObserver' in window ? new ResizeObserver(function (entries) {
    entries.forEach(function (entry) { setScale(entry.target.closest('.case-preview'), entry.contentRect.width); });
  }) : null;

  function apply(filter, shouldStore) {
    current = filter;
    if (shouldStore) sessionStorage.setItem(storageKey, filter);
    buttons.forEach(function (button) {
      var active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (select) select.value = filter;
    var count = 0;
    cards.forEach(function (card, index) {
      var visible = filter === 'Tous' || card.dataset.category === filter;
      card.hidden = !visible;
      card.style.setProperty('--case-index', index);
      if (visible) count++;
    });
    status.textContent = count === 1 ? '1 démonstration affichée.' : count + ' démonstrations affichées.';
    if (!observer) requestAnimationFrame(updateScales);
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { apply(button.dataset.filter, true); }); });
  if (select) select.addEventListener('change', function () { apply(select.value, true); });
  apply(current, false);

  if (observer) {
    previews.forEach(function (preview) { observer.observe(screenOf(preview)); });
  } else {
    updateScales();
    window.addEventListener('resize', updateScales);
    window.addEventListener('load', updateScales);
  }

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    cards.forEach(function (card) {
      var preview = card.querySelector('.case-preview');
      if (!preview) return;

      card.addEventListener('pointerenter', function () {
        card.classList.add('is-hovered');
        preview.classList.add('is-hovered');
      });

      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-hovered');
        preview.classList.remove('is-hovered');
      });

      card.addEventListener('focusin', function () {
        card.classList.add('is-hovered');
        preview.classList.add('is-hovered');
      });

      card.addEventListener('focusout', function (event) {
        if (!card.contains(event.relatedTarget)) {
          card.classList.remove('is-hovered');
          preview.classList.remove('is-hovered');
        }
      });
    });
  }
  window.addEventListener('pagehide', function () {
    sessionStorage.setItem(scrollKey, String(window.scrollY));
  });
  if (performance.getEntriesByType('navigation')[0] && performance.getEntriesByType('navigation')[0].type === 'back') {
    var savedScroll = Number(sessionStorage.getItem(scrollKey));
    if (Number.isFinite(savedScroll)) requestAnimationFrame(function () { window.scrollTo(0, savedScroll); });
  }
})();
