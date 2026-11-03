// Mur de démos de l'accueil : défilement horizontal natif (scroll-snap).
// Ce script ajoute seulement les flèches précédent/suivant pour la souris.
(function () {
  var rail = document.querySelector('[data-proof-rail]');
  var nav = document.querySelector('[data-proof-nav]');
  if (!rail || !nav) return;
  var prev = nav.querySelector('[data-proof-prev]');
  var next = nav.querySelector('[data-proof-next]');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function step() {
    var card = rail.querySelector('.proof-card');
    if (!card) return rail.clientWidth;
    var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    var per = Math.max(1, Math.floor((rail.clientWidth + gap) / (card.offsetWidth + gap)));
    return per * (card.offsetWidth + gap);
  }
  function update() {
    var max = rail.scrollWidth - rail.clientWidth - 2;
    prev.disabled = rail.scrollLeft <= 2;
    next.disabled = rail.scrollLeft >= max;
    nav.hidden = max <= 0;
  }
  function go(dir) {
    rail.scrollBy({ left: dir * step(), behavior: reduced ? 'auto' : 'smooth' });
  }
  prev.addEventListener('click', function () { go(-1); });
  next.addEventListener('click', function () { go(1); });
  var ticking = false;
  rail.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(rail);
  else window.addEventListener('resize', update);
  update();
})();
