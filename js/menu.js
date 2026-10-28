// Secours pour les navigateurs sans invoker commands (command / commandfor).
// Quand l'API est presente, ce fichier ne fait que tenir aria-expanded a jour.
(function () {
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  var hasPopover = HTMLElement.prototype.hasOwnProperty('popover');
  var hasCommand = 'command' in HTMLButtonElement.prototype;

  if (hasPopover && !hasCommand) {
    burger.addEventListener('click', function () {
      menu.togglePopover();
    });
  }

  if (hasPopover) {
    menu.addEventListener('toggle', function (e) {
      burger.setAttribute('aria-expanded', String(e.newState === 'open'));
      burger.setAttribute('aria-label', e.newState === 'open' ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    // Un lien d'ancre ne referme pas le popover de lui-meme.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.hidePopover();
    });
  } else {
    // Sans Popover API : bascule par classe, plus fermeture Echap.
    menu.classList.add('menu--fallback');
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) burger.click();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) burger.click();
    });
  }
})();

// Barre de progression de lecture / scroll globale.
(function () {
  var bar = document.createElement('span');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span class="scroll-progress__bar"></span>';
  document.body.prepend(bar);

  var raf = 0;

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function paint() {
    raf = 0;
    var doc = document.documentElement;
    var max = Math.max(1, doc.scrollHeight - window.innerHeight);
    doc.style.setProperty('--scroll-progress', clamp(window.scrollY / max).toFixed(4));
  }

  function requestPaint() {
    if (!raf) raf = requestAnimationFrame(paint);
  }

  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint);
  paint();
})();

// Banniere jaune d'offre d'ouverture en haut de toutes les pages du site.
(function () {
  if (document.querySelector('.promo-bar')) return;
  try {
    if (sessionStorage.getItem('purity-promo-v25-dismissed') === '1') return;
  } catch {}

  var promo = document.createElement('aside');
  promo.className = 'promo-bar';
  promo.setAttribute('aria-label', 'Offre d’ouverture Purity Agency');
  promo.innerHTML =
    '<span class="promo-bar__badge">Offre de lancement</span>' +
    '<span class="promo-bar__text"><strong>-25\u00a0% sur la création</strong> (devis sous 24h) + <strong>1er mois offert</strong> sur vos réseaux sociaux <strong>3x/semaine</strong></span>' +
    '<a class="promo-bar__cta" href="/contact.html?promo=ouverture25">En profiter →</a>' +
    '<button type="button" class="promo-bar__close" aria-label="Masquer cette offre">×</button>';

  document.body.prepend(promo);

  function syncPromoHeight() {
    if (!promo.isConnected) {
      document.documentElement.style.setProperty('--promo-h', '0px');
      return;
    }
    document.documentElement.style.setProperty('--promo-h', (promo.offsetHeight + 4) + 'px');
  }

  promo.querySelector('.promo-bar__close').addEventListener('click', function () {
    promo.remove();
    syncPromoHeight();
    try { sessionStorage.setItem('purity-promo-v25-dismissed', '1'); } catch {}
  });

  window.addEventListener('resize', syncPromoHeight);
  syncPromoHeight();
})();
