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
  if (introTitle) introTitle.textContent = 'Nos réalisations.';
  if (introKicker) introKicker.textContent = 'Portfolio Purity';

  function updateScales() {
    cards.forEach(function (card) {
      var preview = card.querySelector('.case-preview');
      if (!preview) return;
      var screen = preview.querySelector('.case-preview__screen') || preview;
      var w = screen.clientWidth;
      if (w > 0) {
        var scale = (w / 1280).toFixed(4);
        preview.style.setProperty('--preview-scale', scale);
      }
    });
  }

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
    requestAnimationFrame(updateScales);
  }
  buttons.forEach(function (button) { button.addEventListener('click', function () { apply(button.dataset.filter, true); }); });
  if (select) select.addEventListener('change', function () { apply(select.value, true); });
  apply(current, false);

  updateScales();
  window.addEventListener('resize', updateScales);
  window.addEventListener('load', updateScales);

  var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    cards.forEach(function (card) {
      var preview = card.querySelector('.case-preview');
      if (!preview) return;

      card.addEventListener('pointerenter', function () {
        updateScales();
        card.classList.add('is-hovered');
        preview.classList.add('is-hovered');
      });

      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-hovered');
        preview.classList.remove('is-hovered');
        preview.style.removeProperty('--case-x');
        preview.style.removeProperty('--case-y');
      });

      card.addEventListener('pointermove', function (event) {
        var rect = preview.getBoundingClientRect();
        preview.style.setProperty('--case-x', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
        preview.style.setProperty('--case-y', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
      });

      card.addEventListener('focusin', function () {
        updateScales();
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
