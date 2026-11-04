// Mur de démos de l'accueil.
// Les 12 démos défilent seules, lentement et en boucle. Le défilement s'arrête
// dès qu'on survole, touche ou parcourt le bloc, puis reprend après quelques
// secondes. Les flèches avancent d'une page. Le bouton pause arrête tout.
(function () {
  var rail = document.querySelector('[data-proof-rail]');
  var nav = document.querySelector('[data-proof-nav]');
  if (!rail || !nav) return;
  var prev = nav.querySelector('[data-proof-prev]');
  var next = nav.querySelector('[data-proof-next]');
  var toggle = nav.querySelector('[data-proof-toggle]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SPEED = 28;         // pixels par seconde : un défilement au ralenti
  var RESUME_AFTER = 4500; // pause après une action de l'utilisateur (ms)

  // Une copie des cartes à la suite des originales permet de boucler sans
  // retour visible au début. La copie est ignorée par les lecteurs d'écran
  // et le clavier.
  var originals = Array.prototype.slice.call(rail.children);
  originals.forEach(function (li) {
    var c = li.cloneNode(true);
    c.setAttribute('aria-hidden', 'true');
    c.removeAttribute('data-reveal-step');
    c.classList.add('is-in', 'proof-card--clone');
    c.querySelectorAll('a,button').forEach(function (el) { el.setAttribute('tabindex', '-1'); });
    rail.appendChild(c);
  });
  var firstClone = rail.children[originals.length];

  function setWidth() { return firstClone.offsetLeft - originals[0].offsetLeft; }
  function step() {
    var card = originals[0];
    var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    var per = Math.max(1, Math.floor((rail.clientWidth + gap) / (card.offsetWidth + gap)));
    return per * (card.offsetWidth + gap);
  }
  function wrap() {
    var w = setWidth();
    if (w <= 0) return;
    if (rail.scrollLeft >= w) rail.scrollLeft -= w;
  }

  // État du défilement automatique
  var paused = reduced;   // mis en pause par le bouton (ou mouvement réduit)
  var hold = false;       // survol ou focus dans le bloc
  var visible = false;    // le bloc est à l'écran
  var resumeAt = 0;       // reprise après une action de l'utilisateur
  var pos = 0, last = 0, raf = 0;

  function running() {
    return !paused && !hold && visible && !document.hidden && performance.now() >= resumeAt;
  }
  function frame(t) {
    raf = 0;
    if (!running()) {
      last = 0;
      if (visible && !paused && !document.hidden) schedule();
      return;
    }
    if (!last) { last = t; pos = rail.scrollLeft; }
    var dt = Math.min(64, t - last);
    last = t;
    pos += SPEED * dt / 1000;
    var w = setWidth();
    if (w > 0 && pos >= w) pos -= w;
    rail.scrollLeft = pos;
    schedule();
  }
  function schedule() {
    if (raf || paused) return;
    raf = requestAnimationFrame(frame);
  }
  function interrupt() {
    resumeAt = performance.now() + RESUME_AFTER;
    last = 0;
  }

  if (!reduced) rail.classList.add('is-auto');

  function go(dir) {
    interrupt();
    var w = setWidth();
    var s = step();
    if (dir < 0 && rail.scrollLeft < s && w > 0) rail.scrollLeft += w;
    rail.scrollBy({ left: dir * s, behavior: reduced ? 'auto' : 'smooth' });
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });

  function setPaused(p) {
    paused = p;
    toggle.setAttribute('aria-pressed', String(p));
    toggle.setAttribute('aria-label', p ? 'Relancer le défilement des démos' : 'Mettre en pause le défilement des démos');
    toggle.classList.toggle('is-paused', p);
    if (!p) { interrupt(); resumeAt = 0; schedule(); }
  }
  if (toggle) {
    if (reduced) toggle.hidden = true;
    toggle.addEventListener('click', function () { setPaused(!paused); });
    setPaused(paused);
  }

  // Survol (souris) et focus clavier : on laisse lire.
  rail.addEventListener('mouseenter', function () { hold = true; });
  rail.addEventListener('mouseleave', function () { hold = false; interrupt(); resumeAt = performance.now() + 900; });
  rail.addEventListener('focusin', function () { hold = true; });
  rail.addEventListener('focusout', function () { hold = false; interrupt(); });
  // Doigt, molette, glisser : l'utilisateur prend la main.
  ['pointerdown', 'touchstart', 'wheel'].forEach(function (ev) {
    rail.addEventListener(ev, interrupt, { passive: true });
  });

  var ticking = false;
  rail.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      if (!running()) wrap();
    });
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) schedule();
    }, { threshold: 0.15 }).observe(rail);
  } else {
    visible = true;
  }
  document.addEventListener('visibilitychange', function () { last = 0; if (!document.hidden) schedule(); });

  nav.hidden = false;
  schedule();
})();
