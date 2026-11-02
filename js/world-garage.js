// Garage Rive : reveal discret des cartes et images à l'entrée (IntersectionObserver, pas de scroll listener).
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.world-garage .offering, .world-garage .band-photo, .world-garage .band-copy, .world-garage .story-photo, .world-garage .gallery-track li, .world-garage .heading-photo');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  targets.forEach((el, i) => {
    el.classList.add('g-reveal');
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
})();
