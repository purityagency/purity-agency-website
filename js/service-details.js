/* Service cards — one focused decision surface, with a reversible return path. */
(function () {
  var grid = document.querySelector('.service-grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
  if (!cards.length) return;
  var lowEnd = typeof navigator !== 'undefined' &&
    ((navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2) ||
     (navigator.deviceMemory === undefined && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || lowEnd;
  var motionDuration = reduceMotion ? 0 : 90;
  var settleTimer;
  var closeTimer;
  var servicesSection = grid.closest('section');

  if (reduceMotion) grid.classList.add('is-motion-reduced');

  /* This section has its own calls to action. Clearing the global floating
     controls while it is in view keeps the illustrations and labels intact. */
  if (servicesSection && 'IntersectionObserver' in window) {
    var servicesObserver = new IntersectionObserver(function (entries) {
      document.body.classList.toggle('is-exploring-services', entries[0].isIntersecting);
    }, { rootMargin: '-12% 0px -18% 0px', threshold: 0.08 });
    servicesObserver.observe(servicesSection);
  }

  function animateSurface(surface) {
    if (!surface || reduceMotion || !surface.animate) return;

    /* The surface changes grid span, but its copy must never be scaled with
       it. A short positional reveal preserves continuity without the
       miniature-text artefact caused by a scale-based FLIP animation. */
    surface.animate([
      { opacity: 0.94, transform: 'translate3d(0, 4px, 0)' },
      { opacity: 1, transform: 'translate3d(0, 0, 0)' }
    ], { duration: 260, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' });
  }

  function animateSurfaceContent(card) {
    if (!card || reduceMotion || !card.animate) return;

    var items = [
      { node: card.querySelector('.service-card__index'), delay: 0 },
      { node: card.querySelector('h3'), delay: 45 },
      { node: card.querySelector('.service-card__visual'), delay: 75 },
      { node: card.querySelector('.service-card__cue'), delay: 110 },
      { node: card.querySelector('.service-card__body'), delay: 95 }
    ];

    items.forEach(function (item) {
      if (!item.node) return;
      item.node.animate([
        { opacity: 0.72, transform: 'translate3d(0, 5px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], {
        duration: 260,
        delay: item.delay,
        easing: 'cubic-bezier(.22,1,.36,1)',
        fill: 'both'
      });
    });
  }

  /* Keep the layout change quiet. The grid is allowed to settle first, then
     the real card content appears at its final size. A cloned/scaled surface
     was intentionally avoided: it made the transition look like a floating
     white panel and visually distorted the card's typography. */
  function transitionSurface(card, from, to, onReveal) {
    if (reduceMotion) {
      onReveal();
      return;
    }
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(onReveal);
    });
  }

  function scrollFocusedCardIntoView(card) {
    if (!card || reduceMotion) return;
    var header = document.querySelector('.site-header, header');
    var headerHeight = header ? header.getBoundingClientRect().height : 0;
    var top = card.getBoundingClientRect().top + window.scrollY - headerHeight - 18;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: 'smooth'
    });
  }

  function clearFocus() {
    grid.classList.remove('is-focused', 'is-opening', 'is-settled', 'is-closing');
    cards.forEach(function (card) {
      card.classList.remove('is-focused', 'is-closing');
    });
  }

  function focusCard(card) {
    var summary = card.querySelector('summary');
    var origin = summary ? summary.getBoundingClientRect() : null;
    window.clearTimeout(closeTimer);
    window.clearTimeout(settleTimer);
    grid.classList.remove('is-closing', 'is-restoring', 'is-settled');
    grid.classList.add('is-focused', 'is-opening');
    cards.forEach(function (item) {
      item.classList.toggle('is-focused', item === card);
    });

    settleTimer = window.setTimeout(function () {
      if (!card.open) return;
      var surface = card.querySelector('summary');
      grid.classList.remove('is-opening');
      grid.classList.add('is-settled', 'is-surface-revealing');
      scrollFocusedCardIntoView(card);
      var destination = surface ? surface.getBoundingClientRect() : null;
      transitionSurface(card, origin, destination, function () {
        grid.classList.remove('is-surface-revealing');
        animateSurface(surface);
        animateSurfaceContent(card);
      });
    }, motionDuration);
  }

  function restoreGrid(card, restoreFocus) {
    if (!card || !card.open || grid.classList.contains('is-closing')) return;
    window.clearTimeout(settleTimer);
    grid.classList.remove('is-opening', 'is-settled');
    grid.classList.add('is-closing');
    card.classList.add('is-closing');

    closeTimer = window.setTimeout(function () {
      var surface = card.querySelector('summary');
      var origin = surface ? surface.getBoundingClientRect() : null;
      card.open = false;
      clearFocus();
      card.classList.add('is-transitioning');
      grid.classList.add('is-restoring', 'is-surface-revealing');
      var destination = surface ? surface.getBoundingClientRect() : null;
      transitionSurface(card, origin, destination, function () {
        grid.classList.remove('is-restoring', 'is-surface-revealing');
        card.classList.remove('is-transitioning');
        animateSurface(surface);
        animateSurfaceContent(card);
      });

      if (restoreFocus) {
        var summary = card.querySelector('summary');
        if (summary) summary.focus({ preventScroll: true });
      }
    }, motionDuration);
  }

  function onToggle(card) {
    if (card.open) {
      focusCard(card);
      return;
    }

    if (grid.classList.contains('is-closing')) return;
    if (!cards.some(function (item) { return item.open; })) {
      clearFocus();
    }
  }

  cards.forEach(function (card) {
    var summary = card.querySelector('summary');
    card.addEventListener('toggle', function () {
      onToggle(card);
    });
    if (summary) {
      summary.addEventListener('click', function (event) {
        if (!card.open) return;
        event.preventDefault();
        restoreGrid(card, true);
      });
    }
  });

  /* Delegate the return action so it keeps working after the grid changes
     layout and remains reliable for pointer, touch and keyboard activation. */
  grid.addEventListener('click', function (event) {
    var back = event.target.closest('.service-card__back');
    if (!back) return;

    var card = back.closest('.service-card');
    if (!card) return;

    event.preventDefault();
    event.stopPropagation();
    restoreGrid(card, true);
  });
})();
