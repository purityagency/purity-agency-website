// Cadence Studio : reveal discret des blocs illustrés (IntersectionObserver, coupé en reduced-motion)
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const items = document.querySelectorAll('.world-sport .offering, .world-sport .gallery-track li, .world-sport .sport-figures div, .world-sport .detail-photo, .world-sport .story-photo');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  items.forEach((el, i) => { el.classList.add('sport-reveal'); el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
})();
