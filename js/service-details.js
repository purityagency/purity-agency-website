/* Service cards — fluid focus surface with sliding + -> X morph return control. */
(function () {
  var grid = document.querySelector('.service-grid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
  if (!cards.length) return;

  var lowEnd = typeof navigator !== 'undefined' &&
    ((navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2) ||
     (navigator.deviceMemory === undefined && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches || lowEnd;
  var openFadeMs = reduceMotion ? 0 : 175;
  var closeCollapseMs = reduceMotion ? 0 : 270;
  var settleTimer = 0;
  var closeTimer = 0;
  var isAnimating = false;
  var servicesSection = grid.closest('section');

  if (reduceMotion) grid.classList.add('is-motion-reduced');

  /* Ensure every .service-card__cue has the dual-label track + morphing icon structure */
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

  /* Compute exact pixel travel for the + -> X slide inside each pill */
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

  if (servicesSection && 'IntersectionObserver' in window) {
    var servicesObserver = new IntersectionObserver(function (entries) {
      document.body.classList.toggle('is-exploring-services', entries[0].isIntersecting);
      if (entries[0].isIntersecting) syncAllCues();
    }, { rootMargin: '-12% 0px -18% 0px', threshold: 0.08 });
    servicesObserver.observe(servicesSection);
  }

  /* Scroll-reveal entrance for the 4 cards and 12 sector chips */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealTargets = Array.prototype.slice.call(
      document.querySelectorAll('.service-card, .sector-demo-chip')
    );
    var entranceObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        entranceObserver.unobserve(el);
        if (el.animate && !el.open && !grid.classList.contains('is-focused')) {
          var idx = Number(el.dataset.revealIdx || 0);
          el.animate([
            { opacity: 0, transform: 'translate3d(0, 18px, 0) scale(0.985)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
          ], {
            duration: 460,
            delay: Math.min(idx * 48, 280),
            easing: 'cubic-bezier(.22, 1, .36, 1)',
            fill: 'backwards'
          });
        }
      });
    }, { threshold: 0.14 });

    revealTargets.forEach(function (el, i) {
      el.dataset.revealIdx = String(i % 6);
      entranceObserver.observe(el);
    });
  }

  function animateSurfaceContent(card) {
    if (!card || reduceMotion || !card.animate) return;
    var items = [
      { node: card.querySelector('.service-card__index'), delay: 0 },
      { node: card.querySelector('h3'), delay: 35 },
      { node: card.querySelector('.service-card__visual'), delay: 60 }
    ];
    items.forEach(function (item) {
      if (!item.node || !item.node.animate) return;
      item.node.animate([
        { opacity: 0.78, transform: 'translate3d(0, 6px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], {
        duration: 340,
        delay: item.delay,
        easing: 'cubic-bezier(.22, 1, .36, 1)',
        fill: 'both'
      });
    });
  }

  function animateBodyExpand(card) {
    var body = card && card.querySelector('.service-card__body');
    if (!body || reduceMotion || !body.animate) return;
    var targetHeight = body.scrollHeight;
    if (targetHeight > 0) {
      body.animate([
        { height: '0px', opacity: 0, transform: 'translate3d(0, -8px, 0)' },
        { height: targetHeight + 'px', opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], {
        duration: 400,
        easing: 'cubic-bezier(.22, 1, .36, 1)'
      });
    }
  }

  function animateBodyCollapse(card) {
    var body = card && card.querySelector('.service-card__body');
    if (!body || reduceMotion || !body.animate) return;
    var startHeight = body.offsetHeight;
    if (startHeight > 0) {
      body.animate([
        { height: startHeight + 'px', opacity: 1, transform: 'translate3d(0, 0, 0)' },
        { height: '0px', opacity: 0, transform: 'translate3d(0, -10px, 0)' }
      ], {
        duration: closeCollapseMs,
        easing: 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'forwards'
      });
    }
  }

  function scrollFocusedCardIntoView(card) {
    if (!card || reduceMotion) return;
    var header = document.querySelector('.site-header, header');
    var headerHeight = header ? header.getBoundingClientRect().height : 0;
    var rect = card.getBoundingClientRect();
    if (rect.top < headerHeight + 12 || rect.top > window.innerHeight * 0.45) {
      var top = rect.top + window.scrollY - headerHeight - 22;
      window.scrollTo({
        top: Math.max(top, 0),
        behavior: 'smooth'
      });
    }
  }

  function clearFocus() {
    grid.classList.remove('is-focused', 'is-opening', 'is-settled', 'is-closing', 'is-restoring');
    cards.forEach(function (card) {
      card.classList.remove('is-focused', 'is-closing', 'is-cue-active');
    });
  }

  function openCard(card) {
    if (!card || isAnimating) return;
    isAnimating = true;
    window.clearTimeout(closeTimer);
    window.clearTimeout(settleTimer);

    /* Ensure any other open card is closed */
    cards.forEach(function (other) {
      if (other !== card && other.open) {
        other.open = false;
        other.classList.remove('is-focused', 'is-cue-active', 'is-closing');
      }
    });

    syncCueMetrics(card);

    /* Stage 1: Slide + -> X immediately while sibling cards fade out smoothly */
    grid.classList.remove('is-closing', 'is-restoring', 'is-settled');
    grid.classList.add('is-focused', 'is-opening');
    cards.forEach(function (item) {
      item.classList.toggle('is-focused', item === card);
    });
    card.classList.add('is-cue-active');

    settleTimer = window.setTimeout(function () {
      /* Stage 2: Expand focused card across grid and reveal body smoothly */
      card.open = true;
      grid.classList.remove('is-opening');
      grid.classList.add('is-settled');
      syncCueMetrics(card);

      if (!reduceMotion && card.animate) {
        card.animate([
          { opacity: 0.94, transform: 'translate3d(0, 10px, 0) scale(0.992)' },
          { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
        ], {
          duration: 420,
          easing: 'cubic-bezier(.22, 1, .36, 1)'
        });
      }

      animateSurfaceContent(card);
      animateBodyExpand(card);
      scrollFocusedCardIntoView(card);
      isAnimating = false;
    }, openFadeMs);
  }

  function restoreGrid(card, restoreFocus) {
    if (!card || !card.open || isAnimating) return;
    isAnimating = true;
    window.clearTimeout(settleTimer);
    window.clearTimeout(closeTimer);

    /* Stage 1: Slide X -> + back across the pill while collapsing body */
    card.classList.remove('is-cue-active');
    card.classList.add('is-closing');
    grid.classList.remove('is-opening');
    grid.classList.add('is-closing');
    animateBodyCollapse(card);

    closeTimer = window.setTimeout(function () {
      /* Stage 2: Close details and stagger all 4 cards back into the 2x2 grid */
      card.open = false;
      clearFocus();
      syncAllCues();

      if (!reduceMotion) {
        cards.forEach(function (item, idx) {
          if (!item.animate) return;
          item.animate([
            { opacity: 0, transform: 'translate3d(0, 14px, 0) scale(0.982)' },
            { opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' }
          ], {
            duration: 400,
            delay: idx * 38,
            easing: 'cubic-bezier(.22, 1, .36, 1)',
            fill: 'backwards'
          });
        });
      }

      if (restoreFocus) {
        var summary = card.querySelector('summary');
        if (summary) summary.focus({ preventScroll: true });
      }
      isAnimating = false;
    }, closeCollapseMs);
  }

  cards.forEach(function (card) {
    var summary = card.querySelector('summary');
    if (summary) {
      summary.addEventListener('click', function (event) {
        event.preventDefault();
        if (card.open) {
          restoreGrid(card, true);
        } else {
          openCard(card);
        }
      });
    }

    /* Fallback if browser toggles <details> via Find-in-page or assistive tech */
    card.addEventListener('toggle', function () {
      if (isAnimating) return;
      if (card.open && !grid.classList.contains('is-focused')) {
        syncCueMetrics(card);
        grid.classList.add('is-focused', 'is-settled');
        card.classList.add('is-focused', 'is-cue-active');
      } else if (!card.open && !cards.some(function (item) { return item.open; })) {
        clearFocus();
      }
    });
  });

  /* Escape key closes the focused service card smoothly */
  window.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    var activeCard = cards.find(function (item) { return item.open; });
    if (activeCard) {
      event.preventDefault();
      restoreGrid(activeCard, true);
    }
  });

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
