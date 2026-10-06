// Script orchestrateur pour les animations GSAP des sites de démo
// Ne s'exécute que si les scripts GSAP (gsap, ScrollTrigger) sont disponibles.

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('GSAP ou ScrollTrigger manquant. Animations GSAP désactivées.');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Respecter prefers-reduced-motion
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const worldId = document.body.dataset.world;

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 701px)' }, () => {
    gsap.utils.toArray('.section').forEach((section) => {
      gsap.fromTo(section, { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: .72, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 82%', once: true }
      });
    });

    if (worldId === 'architecture') {
      const heroImage = document.querySelector('.hero-folio .hero-photo img');
      if (heroImage) gsap.to(heroImage, {
        yPercent: 11,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-folio', start: 'top top', end: 'bottom top', scrub: .55 }
      });
      gsap.utils.toArray('.world-architecture .project-image').forEach((image, index) => {
        gsap.fromTo(image, { clipPath: 'inset(14% 0 14% 0)' }, {
          clipPath: 'inset(0% 0 0% 0)',
          duration: 1.05,
          delay: index * .05,
          ease: 'power4.out',
          scrollTrigger: { trigger: image, start: 'top 78%', once: true }
        });
      });
    }
  });

  // Animations spécifiques par univers (à implémenter)
  switch (worldId) {
    case 'architecture':
      // Interaction signature : reveal des plans
      break;
    case 'decoration':
      // Interaction signature : Vase 3D tournant (géré en partie par Three.js)
      break;
    // ... autres univers à venir
  }
});
