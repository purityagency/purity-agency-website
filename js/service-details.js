/* Service cards — fluid, lag-free cards with instant + -> X slide & morph */
(function () {
  var grid = document.querySelector('.service-grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
  if (!cards.length) return;

  /* Initialize cue markup with open and close labels */
  cards.forEach(function (card) {
    var cue = card.querySelector('.service-card__cue');
    if (!cue) return;
    if (!cue.querySelector('.service-card__cue-track')) {
      var openB = cue.querySelector('b');
      var icon = cue.querySelector('i');
      var openLabel = openB ? openB.textContent : 'Voir les tarifs';
      cue.innerHTML =
        '<span class="service-card__cue-track">' +
          '<b class="service-card__cue-open">' + openLabel + '</b>' +
          '<b class="service-card__cue-close" aria-hidden="true">Retour aux priorités</b>' +
        '</span>';
      if (icon) cue.appendChild(icon);
    }
  });

  /* Calculate slide metrics once without polling */
  function syncCueMetrics(card) {
    var cue = card && card.querySelector('.service-card__cue');
    if (!cue) return;
    var icon = cue.querySelector('i');
    if (!icon) return;
    var cueWidth = cue.clientWidth;
    var iconWidth = icon.offsetWidth;
    if (cueWidth > iconWidth + 16) {
      var slidePx = Math.max(0, cueWidth - iconWidth - 11.5);
      var trackShiftPx = Math.max(0, iconWidth - 3);
      cue.style.setProperty('--cue-slide', slidePx.toFixed(1) + 'px');
      cue.style.setProperty('--cue-track-shift', trackShiftPx.toFixed(1) + 'px');
    }
  }

  function syncAllCues() {
    cards.forEach(syncCueMetrics);
  }

  syncAllCues();
  window.addEventListener('resize', syncAllCues, { passive: true });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncAllCues).catch(function () {});
  }

  function toggleCard(card) {
    var willOpen = !card.open;

    /* Close siblings without layout thrashing */
    cards.forEach(function (other) {
      if (other !== card && other.open) {
        other.open = false;
        other.classList.remove('is-focused', 'is-cue-active');
      }
    });

    if (willOpen) {
      card.open = true;
      card.classList.add('is-focused', 'is-cue-active');
      grid.classList.add('is-focused');
      syncCueMetrics(card);
    } else {
      card.open = false;
      card.classList.remove('is-focused', 'is-cue-active');
      if (!cards.some(function (c) { return c.open; })) {
        grid.classList.remove('is-focused');
      }
      syncCueMetrics(card);
    }
  }

  cards.forEach(function (card) {
    var summary = card.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', function (event) {
        event.preventDefault();
        toggleCard(card);
      });
    }

    card.addEventListener('toggle', function () {
      card.classList.toggle('is-focused', card.open);
      card.classList.toggle('is-cue-active', card.open);
      var anyOpen = cards.some(function (c) { return c.open; });
      grid.classList.toggle('is-focused', anyOpen);
      syncCueMetrics(card);
    });
  });

  window.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var activeCard = cards.find(function (c) { return c.open; });
    if (activeCard) {
      event.preventDefault();
      toggleCard(activeCard);
    }
  });

  grid.addEventListener('click', function (event) {
    var back = event.target.closest('.service-card__back');
    if (!back) return;
    var card = back.closest('.service-card');
    if (!card) return;
    event.preventDefault();
    toggleCard(card);
  });
})();
