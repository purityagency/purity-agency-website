// Beaux Jours : apparition douce des cartes de biens et des images de galerie.
// IntersectionObserver uniquement (pas d'écouteur scroll), coupé en reduced-motion.
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.bj-card, .bj-gallery-track li, .bj-steps article');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('bj-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((el, i) => {
    el.classList.add('bj-reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
  // Menu mobile : un lien choisi referme le panneau.
  const header = document.querySelector('.world-header');
  const toggle = header && header.querySelector('.menu-toggle');
  if (header && toggle) header.querySelectorAll('nav a').forEach((a) => a.addEventListener('click', () => {
    header.classList.remove('menu-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
})();
