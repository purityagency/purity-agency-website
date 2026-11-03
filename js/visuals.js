// Visuels SVG : arme les figures [data-vz] puis lance leur animation une seule fois à l'entrée dans l'écran.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { threshold: 0.3, rootMargin: '0px 0px -8% 0px' });
  for (const f of document.querySelectorAll('[data-vz]')) { f.classList.add('vz-armed'); io.observe(f); }
})();
