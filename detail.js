// Pages détail — reveal au scroll, nav, menu mobile
if (history.scrollRestoration) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav cachée au scroll vers le bas
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 'top -100',
    onUpdate: (self) => {
      if (self.direction === 1) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
    }
  });

  // Menu mobile
  const burger = document.querySelector('.nav__burger');
  const mobMenu = document.getElementById('mobile-menu');
  if (burger && mobMenu) {
    const toggleMenu = () => {
      const isExpanded = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) { mobMenu.removeAttribute('hidden'); document.body.style.overflow = 'hidden'; }
      else { mobMenu.setAttribute('hidden', ''); document.body.style.overflow = ''; }
    };
    burger.addEventListener('click', toggleMenu);
    mobMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
      if (burger.getAttribute('aria-expanded') === 'true') toggleMenu();
    }));
  }

  // Reveal au scroll (robuste : révèle aussi les éléments déjà dans le viewport)
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
    if (prefersReduced) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        toggleActions: 'play none none none',
        once: true
      }
    });
  });
  // Recalcule les positions une fois tout chargé (évite le contenu bloqué invisible)
  ScrollTrigger.refresh();

  // Parallax léger sur l'image hero
  const heroImg = document.querySelector('.dp-hero__img');
  if (heroImg && !prefersReduced) {
    gsap.fromTo(heroImg, { scale: 1.08 }, {
      scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: '.dp-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // --- Sommaire ancré : surligne la section active ---
  const tocLinks = gsap.utils.toArray('.dp-toc__link');
  if (tocLinks.length) {
    tocLinks.forEach(link => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      ScrollTrigger.create({
        trigger: target,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) {
            tocLinks.forEach(l => l.classList.remove('is-active'));
            link.classList.add('is-active');
          }
        }
      });
    });
  }

  // --- Mini-FAQ accordéon ---
  const faqQs = document.querySelectorAll('.dp-faq__q');
  faqQs.forEach(q => {
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      faqQs.forEach(o => o.setAttribute('aria-expanded', 'false'));
      if (!open) q.setAttribute('aria-expanded', 'true');
    });
  });

  // --- Formulaire de contact (page détail) ---
  const dForm = document.getElementById('detail-form');
  if (dForm) {
    dForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = dForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Envoi…';
      btn.disabled = true;
      const payload = {
        name: dForm.querySelector('#d-name')?.value || '',
        email: dForm.querySelector('#d-email')?.value || '',
        phone: dForm.querySelector('#d-phone')?.value || '',
        activity: dForm.querySelector('#d-activity')?.value || '',
        need: dForm.querySelector('#d-need')?.value || '',
      };
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('bad status');
        dForm.querySelector('.dp-form__sent').style.display = 'block';
        btn.style.display = 'none';
        const note = dForm.querySelector('.dp-form__note');
        if (note) note.style.display = 'none';
        dForm.reset();
      } catch (err) {
        btn.textContent = 'Erreur — réessayer';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = original; }, 2500);
      }
    });
  }

  // --- Smooth scroll vers les ancres internes de la page ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  });

  // Curseur custom (cohérence avec l'accueil)
  if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (cursor && cursorDot) {
      const xTo = gsap.quickTo(cursor, 'left', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(cursor, 'top', { duration: 0.4, ease: 'power3.out' });
      const xDot = gsap.quickTo(cursorDot, 'left', { duration: 0.15, ease: 'power2.out' });
      const yDot = gsap.quickTo(cursorDot, 'top', { duration: 0.15, ease: 'power2.out' });
      window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY); xDot(e.clientX); yDot(e.clientY); });
      document.querySelectorAll('a, button, .btn, .dp-feature').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
    }
  }
});
