// Maison Lune : révélation douce des cartes et figures à l'entrée (aucun listener scroll)
(() => {
  'use strict';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const items = document.querySelectorAll('.treatment-list .offering, .gallery-track li, .lune-figures dl > div, .detail-photo, .story-photo');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      setTimeout(() => { entry.target.style.transitionDelay = ''; }, 1100);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, i) => {
    el.classList.add('lune-reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
})();
