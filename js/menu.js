// Secours pour les navigateurs sans invoker commands (command / commandfor).
// Quand l'API est presente, ce fichier ne fait que tenir aria-expanded a jour.
(function () {
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  var hasPopover = HTMLElement.prototype.hasOwnProperty('popover');
  var hasCommand = 'command' in HTMLButtonElement.prototype;

  // Boutons internes au menu (le x de fermeture) : meme dependance aux invoker commands.
  var closers = Array.prototype.filter.call(document.querySelectorAll('[commandfor="menu"]'), function (b) { return b !== burger; });

  // Un lien suivi ferme le menu sans renvoyer le focus au burger.
  var closingViaLink = false;

  function isOpen() {
    if (menu.classList.contains('is-open')) return true;
    try { return menu.matches(':popover-open'); } catch (e) { return false; }
  }

  function focusables() {
    return Array.prototype.filter.call(
      menu.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      function (el) { return el.getClientRects().length > 0; }
    );
  }

  function onOpened() {
    var items = focusables();
    if (items.length) items[0].focus({ preventScroll: true });
  }

  function onClosed() {
    var active = document.activeElement;
    if (!closingViaLink && (!active || active === document.body || menu.contains(active))) burger.focus();
    closingViaLink = false;
  }

  // Le menu ouvert couvre tout l'ecran : la tabulation reste dedans au lieu de
  // partir sur la page masquee derriere.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab' || !isOpen()) return;
    var items = focusables();
    if (!items.length) return;
    var first = items[0];
    var last = items[items.length - 1];
    var active = document.activeElement;
    if (!menu.contains(active)) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  });

  if (hasPopover && !hasCommand) {
    burger.addEventListener('click', function () {
      menu.togglePopover();
    });
    closers.forEach(function (b) {
      b.addEventListener('click', function () { menu.hidePopover(); });
    });
  }

  if (hasPopover) {
    menu.addEventListener('toggle', function (e) {
      var open = e.newState === 'open';
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      if (open) onOpened(); else onClosed();
    });
    // Un lien d'ancre ne referme pas le popover de lui-meme.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closingViaLink = true;
        menu.hidePopover();
      }
    });
  } else {
    // Sans Popover API : bascule par classe, plus fermeture Echap.
    menu.classList.add('menu--fallback');
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) onOpened(); else onClosed();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) burger.click();
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        closingViaLink = true;
        burger.click();
      }
    });
    closers.forEach(function (b) {
      b.addEventListener('click', function () {
        if (menu.classList.contains('is-open')) burger.click();
      });
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

// Barre d'offre : message fixe, identique pour tous les visiteurs, sans compte a rebours.
(function () {
  // Efface les traceurs de l'ancien compte a rebours encore presents chez les visiteurs.
  try { document.cookie = 'purity_first_open=; Max-Age=0; Path=/; SameSite=Lax'; } catch (e) {}
  try { localStorage.removeItem('purity_promo_first_open_v1'); } catch (e) {}

  if (document.querySelector('.promo-bar')) return;
  var dismissed = false;
  try { dismissed = sessionStorage.getItem('purity-promo-bar-dismissed') === '1'; } catch (e) {}
  if (dismissed) return;

  var promo = document.createElement('aside');
  promo.className = 'promo-bar';
  promo.setAttribute('aria-label', 'Offre Purity Agency');
  promo.innerHTML =
    '<a class="promo-bar__link" href="/contact.html?promo=lancement"><span class="promo-bar__text">' +
      '<strong>-25 %</strong> sur la création si vous validez dans les 24 h suivant votre devis · 1er mois offert sur la formule Réseaux sociaux' +
    '</span></a>' +
    '<button type="button" class="promo-bar__close" aria-label="Masquer l’offre">×</button>';

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
    try { sessionStorage.setItem('purity-promo-bar-dismissed', '1'); } catch (e) {}
  });

  window.addEventListener('resize', syncPromoHeight);
  requestAnimationFrame(syncPromoHeight);
})();

// Lien d'evitement : premier element tabulable de chaque page, vers le contenu principal.
(function () {
  if (document.querySelector('.skip-link')) return;
  var main = document.querySelector('main');
  if (!main) return;
  if (!main.id) main.id = 'contenu';
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  var skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#' + main.id;
  skip.textContent = 'Aller au contenu';
  document.body.insertBefore(skip, document.body.firstChild);
})();

// Consentement + mesure d'audience, chargé sur toutes les pages.
(() => {
  if (document.querySelector('script[src^="/js/consent.js"]')) return;
  const s = document.createElement('script');
  s.src = '/js/consent.js?v=2';
  s.defer = true;
  document.head.appendChild(s);
})();
