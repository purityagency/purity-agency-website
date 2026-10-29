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

  // Garantit que "Tarifs" est visible dans la navigation sur toutes les pages du site.
  ['.header__nav', '.menu__nav'].forEach(function (sel) {
    var nav = document.querySelector(sel);
    if (!nav || nav.querySelector('a[href="/tarifs.html"]')) return;
    var link = document.createElement('a');
    link.href = '/tarifs.html';
    link.textContent = 'Tarifs';
    var ref = nav.querySelector('a[href="/cas-concrets.html"]') || nav.firstElementChild;
    if (ref && ref.nextSibling) nav.insertBefore(link, ref.nextSibling);
    else nav.appendChild(link);
  });
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

// Decompte 24h a partir de la 1re ouverture du site, sur un cycle glissant de 30 jours.
// Expose window.PurityPromo24h et synchronise en temps reel la banniere et tous les badges -25 %.
(function () {
  var STORAGE_KEY = 'purity_promo_first_open_v1';
  var COOKIE_KEY = 'purity_first_open';
  var WINDOW_MS = 24 * 60 * 60 * 1000;      // 24 heures de validite du -25 %
  var CYCLE_MS = 30 * 24 * 60 * 60 * 1000;  // Cycle de 30 jours avant reinitialisation

  function readCookieTimestamp() {
    var m = document.cookie.match(/(?:^|;\s*)purity_first_open=(\d{10,15})/);
    return m ? Number(m[1]) : 0;
  }

  function writeTimestamp(ts) {
    try { localStorage.setItem(STORAGE_KEY, String(ts)); } catch {}
    try {
      document.cookie = COOKIE_KEY + '=' + ts + '; Path=/; Max-Age=2592000; SameSite=Lax';
    } catch {}
  }

  function resolveFirstOpen() {
    var now = Date.now();
    var stored = 0;
    try { stored = Number(localStorage.getItem(STORAGE_KEY) || 0); } catch {}
    if (!stored) stored = readCookieTimestamp();
    if (!stored || !Number.isFinite(stored) || stored > now || (now - stored) >= CYCLE_MS) {
      stored = now;
    }
    writeTimestamp(stored);
    return stored;
  }

  var firstOpenAt = resolveFirstOpen();

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function remainingMs() {
    var now = Date.now();
    if ((now - firstOpenAt) >= CYCLE_MS) {
      firstOpenAt = resolveFirstOpen();
    }
    return Math.max(0, (firstOpenAt + WINDOW_MS) - now);
  }

  function isActive() {
    return remainingMs() > 0;
  }

  function formatRemaining() {
    var totalSec = Math.ceil(remainingMs() / 1000);
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }

  function badgeLabel() {
    return isActive() ? '-25 % · ' + formatRemaining() : 'Offre 24h expirée';
  }

  window.PurityPromo24h = {
    get firstOpenAt() { return firstOpenAt; },
    get expiresAt() { return firstOpenAt + WINDOW_MS; },
    get resetAt() { return firstOpenAt + CYCLE_MS; },
    remainingMs: remainingMs,
    isActive: isActive,
    formatRemaining: formatRemaining,
    badgeLabel: badgeLabel
  };

  // Repere tous les elements contenant "24h" liés à l'offre -25 % pour les mettre à jour chaque seconde.
  document.querySelectorAll('small, .btn, .method__cta-label, .service-card__cue b, .service-card__pricing-head strong, [data-promo-countdown]').forEach(function (el) {
    var txt = el.textContent || '';
    if (el.hasAttribute('data-promo-countdown')) return;
    if (txt.indexOf('-25 % 24h') !== -1 || txt.indexOf('-25 % sous 24h') !== -1 || txt.indexOf('(-25 %)') !== -1) {
      el.setAttribute('data-promo-template', txt);
    }
  });

  if (!document.querySelector('.promo-bar')) {
    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem('purity-promo-24h-v2-dismissed') === '1';
    } catch {}

    if (!dismissed) {
      var promo = document.createElement('aside');
      promo.className = 'promo-bar';
      promo.setAttribute('aria-label', 'Offre Novembre – Décembre Purity Agency');
      promo.innerHTML =
        '<span class="promo-bar__badge">Novembre – Décembre</span>' +
        '<span class="promo-bar__timer" data-promo-timer aria-live="off"></span>' +
        '<span class="promo-bar__text" data-promo-bar-text></span>' +
        '<a class="promo-bar__cta" href="/contact.html?promo=novdec25">En profiter →</a>' +
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
        try { sessionStorage.setItem('purity-promo-24h-v2-dismissed', '1'); } catch {}
      });

      window.addEventListener('resize', syncPromoHeight);
      requestAnimationFrame(syncPromoHeight);
    }
  }

  var wasActive = isActive();

  function tickPromo24h() {
    var active = isActive();
    var timerText = formatRemaining();

    document.querySelectorAll('[data-promo-timer]').forEach(function (el) {
      el.textContent = active ? '⏱ -25\u00a0% · ' + timerText : '⏱ Offre 24h expirée';
    });

    document.querySelectorAll('[data-promo-bar-text]').forEach(function (el) {
      if (active) {
        if (el.dataset.state !== 'active') {
          el.dataset.state = 'active';
          el.innerHTML = '<strong>-25\u00a0% sur la création</strong> (24h dès 1re visite) + <strong>1er mois offert</strong> sur vos réseaux sociaux <strong>3x/semaine</strong>';
        }
      } else if (el.dataset.state !== 'expired') {
        el.dataset.state = 'expired';
        el.innerHTML = '<strong>1er mois offert</strong> sur vos réseaux sociaux <strong>3x/semaine</strong> · remise -25\u00a0% (24h) expirée';
      }
    });

    document.querySelectorAll('.promo-pill--25, [data-promo-badge="25"]').forEach(function (el) {
      if (active) {
        el.classList.add('promo-pill--25');
        el.classList.remove('promo-pill--expired');
        el.textContent = '-25 % · ' + timerText;
      } else {
        el.classList.remove('promo-pill--25');
        el.classList.add('promo-pill--expired');
        el.textContent = '24h expiré';
      }
    });

    document.querySelectorAll('[data-promo-template]').forEach(function (el) {
      var tpl = el.getAttribute('data-promo-template') || '';
      if (active) {
        el.textContent = tpl
          .replace(/-25 % sous 24h/g, '-25 % · ' + timerText)
          .replace(/-25 % 24h/g, '-25 % · ' + timerText)
          .replace(/\(-25 %\)/g, '(-25 % · ' + timerText + ')');
      } else {
        el.textContent = tpl
          .replace(/\s*\(-25 % sous 24h\)/g, '')
          .replace(/\s*\(-25 % 24h\)/g, '')
          .replace(/-25 % 24h/g, 'Sur devis')
          .replace(/\s*\(-25 %\)/g, '');
      }
    });

    document.querySelectorAll('[data-promo-countdown]').forEach(function (el) {
      el.textContent = active ? '⏱ -25 % (24h) · ' + timerText : '⏱ Offre 24h expirée';
    });

    if (wasActive && !active) {
      wasActive = false;
      window.dispatchEvent(new CustomEvent('purity:promo24h-expired'));
    }
  }

  tickPromo24h();
  setInterval(tickPromo24h, 1000);
})();
