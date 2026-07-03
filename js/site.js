// Si l'URL contient une ancre (#services…) au rechargement, on ne force pas le scroll au top pour permettre la redirection
const hasHash = !!window.location.hash;

// ────────────────────────────────────────────────────────────────────────────
// 🗓 CONFIGURATION GLOBALE — URL de réservation Google Calendar
// Remplacez par votre lien Google Appointment Schedules ou Calendly/Cal.com
// Pour Google Calendar → https://calendar.google.com/calendar/appointments/schedules/VOTRE_ID
// Pour Calendly → https://calendly.com/purity-agency/15min
// Les paramètres ?name=&email=&phone= seront ajoutés automatiquement
const BOOKING_URL = 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0Mg-8wLya1IHrX8h2kIFUrFAgJpdl0qPvoY8YkqCx1KugNvIUtOYq5FGeeXRP7khf0DqVbhTWI';
// ────────────────────────────────────────────────────────────────────────────

/**
 * Génère un lien de réservation pré-rempli avec les infos de l'utilisateur.
 * Compatible Google Calendar Appointment Schedules, Calendly, Cal.com.
 */
function buildBookingUrl(name, email, phone) {
  const url = new URL(BOOKING_URL, window.location.href);
  if (name)  url.searchParams.set('name',  name);
  if (email) url.searchParams.set('email', email);
  if (phone) url.searchParams.set('phone', phone);
  return url.toString();
}

if (history.scrollRestoration) {
  if (!hasHash) history.scrollRestoration = 'manual';
}

const _jumpTop = () => {
  if (!hasHash) window.scrollTo(0, 0);
};
_jumpTop();

// --- Loader dismiss (bulletproof) ---
const _dismissLoader = () => {
  const loader = document.getElementById('loader');
  if (!loader || loader.dataset.dismissed) return;
  loader.dataset.dismissed = '1';
  const fill = loader.querySelector('.loader__fill');
  if (fill) fill.style.width = '100%';
  setTimeout(() => {
    loader.classList.add('is-done');
    setTimeout(() => loader.remove(), 600);
  }, 300);
};
// Failsafe : le loader disparaît dans tous les cas après 3s max
setTimeout(_dismissLoader, 3000);

window.addEventListener('load', () => {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  
  if (hasHash) {
    // On se positionne instantanément sur l'ancre sous le loader
    const target = document.querySelector(window.location.hash);
    if (target) {
      target.scrollIntoView();
    }
  } else {
    _jumpTop();
  }

  requestAnimationFrame(() => { html.style.scrollBehavior = prev; });
  _dismissLoader();

  // Si l'URL contient une ancre, on force ScrollTrigger à se rafraîchir pour s'assurer que les animations se déclenchent correctement
  if (hasHash && typeof ScrollTrigger !== 'undefined') {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }

  // Vidéo avatar du chat : chargée seulement après le load complet (ne concurrence pas le hero)
  document.querySelectorAll('video.chat__avatar[data-src]').forEach(v => {
    v.src = v.dataset.src;
    v.play().catch(() => {});
  });
});

let _i18nDict = {};

document.addEventListener('DOMContentLoaded', () => {
  // --- Injection des tentacules par section (DA Purity) ---
  if (window.innerWidth >= 1100) {
    const shouldHaveTentacles = (sec) => {
      const tag = sec.tagName.toLowerCase();
      if (tag === 'nav' || tag === 'header' || tag === 'footer') return false;

      const id = sec.id || '';
      const classes = sec.classList;

      // Exclure les menus, entêtes, pieds de page, hero, services et formulaire contact
      if (id === 'services' || id === 'hero' || id === 'contact' || id === 'nav' || id === 'haut') return false;
      if (classes.contains('nav') || classes.contains('dp-hero') || classes.contains('dp-contact') || classes.contains('svc')) return false;

      // Exclure les sections trop courtes/spécifiques (ex. déclarations ou intro de blog)
      if (classes.contains('dp-statement') || classes.contains('why-intro') || classes.contains('legal')) return false;

      // Exclure les sections qui ont déjà des tentacules statiques/breathe en CSS
      if (classes.contains('sec--tentacles')) return false;

      // Éviter l'injection si déjà présent
      if (sec.querySelector('.ambient-tentacles')) return false;

      return true;
    };

    document.querySelectorAll('.sec, .dp-section, section, header, footer').forEach((sec) => {
      if (!shouldHaveTentacles(sec)) return;
      
      // S'assurer que le parent est positionné pour contenir l'absolu
      const position = window.getComputedStyle(sec).position;
      if (position === 'static') {
        sec.style.position = 'relative';
      }

      const tentaclesContainer = document.createElement('div');
      tentaclesContainer.className = 'ambient-tentacles';
      tentaclesContainer.setAttribute('aria-hidden', 'true');
      tentaclesContainer.innerHTML = `
        <div class="ambient-tentacle ambient-tentacle--left">
          <div class="ambient-tentacle__float">
            <div class="ambient-tentacle__inner"></div>
          </div>
        </div>
        <div class="ambient-tentacle ambient-tentacle--right">
          <div class="ambient-tentacle__float">
            <div class="ambient-tentacle__inner"></div>
          </div>
        </div>
      `;
      sec.appendChild(tentaclesContainer);
    });
  }


  // Garde-fou : si GSAP n'est pas chargé sur cette page, on ne plante pas tout le script
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.warn('[site.js] GSAP absent — animations désactivées sur cette page.');
    document.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }

  // --- GSAP Setup ---
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Animation Organique des Tentacules (DA Purity) ---
  const leftTentacle = document.querySelector('.ambient-tentacle--left');
  const rightTentacle = document.querySelector('.ambient-tentacle--right');
  
  if (leftTentacle && rightTentacle && !prefersReduced) {
    const leftFloat = leftTentacle.querySelector('.ambient-tentacle__float');
    const rightFloat = rightTentacle.querySelector('.ambient-tentacle__float');
    const leftInner = leftTentacle.querySelector('.ambient-tentacle__inner');
    const rightInner = rightTentacle.querySelector('.ambient-tentacle__inner');

    // 1. Flottaison lente organique (masse physique dans l'eau)
    gsap.utils.toArray('.ambient-tentacle__float').forEach((floatEl, i) => {
      gsap.to(floatEl, {
        y: i % 2 === 0 ? "+=25" : "-=25",
        rotation: i % 2 === 0 ? 3 : -3,
        duration: 8 + (i % 3),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    });

    // 2. Parallaxe de profondeur au scroll (ScrollTrigger par section parente)
    gsap.utils.toArray('.ambient-tentacle').forEach((tentacle, i) => {
      const parentSection = tentacle.closest('section, .sec, .dp-section, header, footer');
      if (!parentSection) return;
      gsap.to(tentacle, {
        yPercent: i % 2 === 0 ? -12 : 12,
        rotation: i % 2 === 0 ? "+=3" : "-=3",
        ease: "none",
        scrollTrigger: {
          trigger: parentSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2
        }
      });
    });

    // 3. Interaction fluide avec la souris (Inertie)
    let mouseX = 0;
    let mouseY = 0;
    
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) - 0.5;
      mouseY = (e.clientY / window.innerHeight) - 0.5;
      
      gsap.utils.toArray('.ambient-tentacle--left .ambient-tentacle__inner').forEach(inner => {
        gsap.to(inner, {
          x: mouseX * 35,
          y: mouseY * 40,
          overwrite: "auto",
          duration: 2.2,
          ease: "power2.out"
        });
      });
      
      gsap.utils.toArray('.ambient-tentacle--right .ambient-tentacle__inner').forEach(inner => {
        gsap.to(inner, {
          x: mouseX * 35,
          y: mouseY * -35,
          overwrite: "auto",
          duration: 2.5,
          ease: "power2.out"
        });
      });
    });
  }

  // --- Sticky Nav (GSAP) ---
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: "top -100",
    onUpdate: (self) => {
      // self.direction = 1 (down), -1 (up)
      if (self.direction === 1) nav.classList.add('nav--hidden');
      else nav.classList.remove('nav--hidden');
    }
  });

  // --- Mobile Menu ---
  const burger = document.querySelector('.nav__burger');
  const mobMenu = document.getElementById('mobile-menu');

  if (burger && mobMenu) {
  const toggleMenu = () => {
    const isExpanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', !isExpanded);
    if (!isExpanded) {
      mobMenu.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      // GSAP stagger on mobile links
      const links = mobMenu.querySelectorAll('a');
      gsap.fromTo(links, 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', clearProps: "all" }
      );
    } else {
      mobMenu.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  };
  burger.addEventListener('click', toggleMenu);
  mobMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
    if (burger.getAttribute('aria-expanded') === 'true') toggleMenu();
  }));
  }

  // --- Scroll Reveal Blocks (GSAP) ---
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delayAttr = el.style.getPropertyValue('--d');
    const delay = delayAttr ? parseFloat(delayAttr) : 0;
    
    gsap.to(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 90%", // Trigger when top of element hits 90% of viewport
        once: true // Animate only once
      },
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power4.out",
      delay: delay
    });
  });

  // --- Scroll Text Reveal (GSAP Scrubbing) ---
  gsap.utils.toArray('[data-scroll-text]').forEach(el => {
    const text = el.innerText;
    el.innerHTML = '';
    const words = text.split(' ').map(word => `<span>${word} </span>`);
    el.innerHTML = words.join('');

    const spans = el.querySelectorAll('span');
    gsap.set(spans, { opacity: 0.15 });

    gsap.to(spans, {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1 // 1 sec lag for ultra-smooth scrubbing
      }
    });
  });

  // --- Hero Parallax (GSAP) ---
  const heroImg = document.querySelector('.hero__img');
  const heroText = document.querySelector('.hero__text-col');
  
  if (heroImg && heroText) {
    // Léger parallax interne au cadre (scale, ne sort pas du cadre)
    gsap.fromTo(heroImg,
      { scale: 1.06 },
      {
        scale: 1.12, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      }
    );
    gsap.to(heroText, {
      y: 40,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  // ════════════════════════════════════════════════════════════
  //  MOTION LAYER — hero clip-mask, services carrousel, count-up
  // ════════════════════════════════════════════════════════════

  // --- 1. Hero : titre en clip-mask qui monte ligne par ligne ---
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle && !prefersReduced) {
    // Découpe le titre en "lignes" sur les <br>, chacune masquée puis révélée
    const rawHTML = heroTitle.innerHTML;
    const lines = rawHTML.split(/<br\s*\/?>/i);
    heroTitle.innerHTML = lines
      .map(l => `<span class="hline"><span class="hline-inner">${l}</span></span>`)
      .join('');
    heroTitle.style.opacity = 1; // override le data-reveal initial
    const inners = heroTitle.querySelectorAll('.hline-inner');
    gsap.set(inners, { yPercent: 120 });
    gsap.to(inners, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power4.out',
      stagger: 0.12,
      delay: 0.15
    });
  }

  // --- 1b. SERVICES : carrousel COVERFLOW 3D (cartes dans l'espace) ---
  const svc = document.getElementById('services');
  const stage = svc && svc.querySelector('.svc__stage');
  if (svc && stage) {
    const scenes = gsap.utils.toArray('.svc-scene');
    const progIndex = svc.querySelector('.svc__index');
    const progFill = svc.querySelector('.svc__bar i');
    const total = scenes.length;

    const contentOf = (s) => s.querySelectorAll('.svc-scene__num, .svc-scene__title, .svc-scene__lead, .svc-scene__tags, .svc-scene__more');

    // Setters rapides (uniquement translation X pour le slide)
    const setters = scenes.map(s => ({
      x: gsap.quickSetter(s, 'x', 'px')
    }));
    const vw = () => window.innerWidth;

    // Place toutes les cartes selon l'index actif (float continu)
    const layout = (active) => {
      scenes.forEach((_, i) => {
        const off = i - active; // distance de la carte active
        setters[i].x(off * vw()); // décalage de 100vw par index
      });
    };

    if (prefersReduced) {
      scenes.forEach((s) => {
        gsap.set(s, { position: 'relative', clearProps: 'transform', opacity: 1 });
        gsap.set(contentOf(s), { opacity: 1, y: 0 });
      });
      gsap.set(stage, { height: 'auto' });
      gsap.set(svc, { height: 'auto' });
    } else {
      gsap.set(scenes, { opacity: 1 });
      gsap.set(scenes.map(s => contentOf(s)), { opacity: 1, y: 0 });
      layout(0);

      ScrollTrigger.create({
        trigger: svc,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        onUpdate: (self) => {
          const active = self.progress * (total - 1);
          layout(active);
          const idx = Math.round(active);
          if (progIndex) progIndex.textContent = String(idx + 1).padStart(2, '0');
          if (progFill) progFill.style.transform = `translateY(${idx * 100}%)`;
          scenes.forEach((s, n) => s.classList.toggle('is-active', n === idx));
        }
      });

      // GAP_X dépend de la largeur → recalcule au resize
      window.addEventListener('resize', () => ScrollTrigger.refresh());
    }
  }


  // --- Kinetic typography (constat) : lignes qui montent au scroll ---
  const ktLines = gsap.utils.toArray('[data-kt]');
  if (ktLines.length && !prefersReduced) {
    gsap.set(ktLines, { yPercent: 60, opacity: 0 });
    gsap.to(ktLines, {
      yPercent: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.12,
      scrollTrigger: { trigger: '.kt', start: 'top 75%', once: true }
    });
  } else if (ktLines.length) {
    gsap.set(ktLines, { opacity: 1, yPercent: 0 });
  }

  // --- Bento 2 : chiffres qui se montrent ---
  const bento2 = document.querySelector('.bento2');
  if (bento2) {
    ScrollTrigger.create({
      trigger: bento2,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        // count-up
        bento2.querySelectorAll('.b2__count').forEach(el => {
          const target = parseInt(el.getAttribute('data-count'), 10) || 0;
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: target, duration: 1.4, ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(proxy.v); }
          });
        });
        // jauge prix
        const gauge = bento2.querySelector('.b2__gauge-fill');
        if (gauge) gsap.fromTo(gauge, { width: '0%' }, { width: '14%', duration: 1.4, ease: 'power2.out', delay: 0.2 });
        // segments 4×
        const segs = bento2.querySelectorAll('.b2__segs i');
        segs.forEach((s, i) => setTimeout(() => s.classList.add('on'), 500 + i * 180));
        // horloge : aiguilles tournent
        const h = bento2.querySelector('.b2__hand--h');
        const m = bento2.querySelector('.b2__hand--m');
        if (h && m) {
          gsap.fromTo(h, { rotation: 0 }, { rotation: 300, duration: 1.6, ease: 'power2.out', transformOrigin: 'bottom center' });
          gsap.fromTo(m, { rotation: 0 }, { rotation: 720, duration: 1.6, ease: 'power2.out', transformOrigin: 'bottom center' });
        }
      }
    });
  }

  // --- Pourquoi : item actif au scroll + compteur ---
  const why2Items = gsap.utils.toArray('.why2__item');
  const why2Now = document.querySelector('.why2__count-now');
  why2Items.forEach((item, i) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => {
        if (self.isActive) {
          why2Items.forEach(x => x.classList.remove('is-active'));
          item.classList.add('is-active');
          if (why2Now) why2Now.textContent = String(i + 1).padStart(2, '0');
        }
      }
    });
  });

  // --- FAQ ---
  const faqs = document.querySelectorAll('.faq__q');
  faqs.forEach(q => {
    q.addEventListener('click', () => {
      const isExp = q.getAttribute('aria-expanded') === 'true';
      faqs.forEach(other => other.setAttribute('aria-expanded', 'false'));
      if (!isExp) q.setAttribute('aria-expanded', 'true');
    });
  });

  // --- Contact Form ---
  const form = document.getElementById('contact-form');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const original = btn.textContent;
    btn.textContent = _i18nDict['form.sending'] || 'Envoi…';
    btn.disabled = true;
    const payload = {
      name: form.querySelector('#f-name')?.value || '',
      email: form.querySelector('#f-email')?.value || '',
      phone: form.querySelector('#f-phone')?.value || '',
      activity: form.querySelector('#f-activity')?.value || '',
      need: form.querySelector('#f-need')?.value || '',
      website_verification: form.querySelector('input[name="website_verification"]')?.value || '',
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status');

      // Injecter l'URL de réservation pré-remplie dans le bouton de calendrier
      const sentBlock = form.querySelector('.form__sent');
      const bookingBtn = sentBlock?.querySelector('.ob-btn-booking');
      if (bookingBtn) {
        bookingBtn.href = buildBookingUrl(payload.name, payload.email, payload.phone);
      }

      if (sentBlock) sentBlock.style.display = 'block';
      btn.style.display = 'none';
      form.reset();
    } catch (err) {
      btn.textContent = _i18nDict['form.error'] || 'Erreur — réessayer';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = original; }, 2500);
    }
  });

  // ════════════════════════════════════════════════════════════
  //  NEW FEATURES — 10 concrete improvements
  // ════════════════════════════════════════════════════════════

  // --- #1. Custom Cursor (magnetic) ---
  if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (cursor && cursorDot) {
      document.documentElement.classList.add('has-custom-cursor');
      const xTo = gsap.quickTo(cursor, 'left', { duration: 0.4, ease: 'power3.out' });
      const yTo = gsap.quickTo(cursor, 'top', { duration: 0.4, ease: 'power3.out' });
      const xDot = gsap.quickTo(cursorDot, 'left', { duration: 0.15, ease: 'power2.out' });
      const yDot = gsap.quickTo(cursorDot, 'top', { duration: 0.15, ease: 'power2.out' });

      window.addEventListener('mousemove', (e) => {
        xTo(e.clientX); yTo(e.clientY);
        xDot(e.clientX); yDot(e.clientY);
      });

      document.querySelectorAll('a, button, input, textarea, .btn, .price, .faq__q, .why, .bento__card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
      });
    }
  }

  // --- #2. Parallax on "Pourquoi Purity" cards ---
  if (!prefersReduced) {
    gsap.utils.toArray('.why').forEach((card, i) => {
      gsap.to(card, {
        y: -15 - (i * 8),
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  // --- #3. Méthode : ligne de progression + pictos actifs au scroll ---
  const mtrack = document.querySelector('.mtrack');
  const mprogress = document.querySelector('.mtrack__progress');
  if (mtrack && !prefersReduced) {
    const msteps = gsap.utils.toArray('.mstep');
    gsap.to(mprogress, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: mtrack,
        start: 'top 65%',
        end: 'bottom 60%',
        scrub: 1,
        onUpdate: (self) => {
          msteps.forEach((step, i) => {
            const threshold = i / msteps.length;
            step.classList.toggle('is-active', self.progress >= threshold);
          });
        }
      }
    });
    // premier actif d'emblée
    if (msteps[0]) msteps[0].classList.add('is-active');
  } else if (mtrack) {
    gsap.utils.toArray('.mstep').forEach(s => s.classList.add('is-active'));
    if (mprogress) mprogress.style.width = '100%';
  }

  // --- #5. Smooth scroll GSAP (replace native) ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 0 },
        duration: 1.2,
        ease: 'power3.inOut'
      });
    });
  });

  // --- #6. Interactive Pricing Tabs & Volets ---
  const tabBtns = document.querySelectorAll('.tarifs-tab');
  const panes = document.querySelectorAll('.tarifs-pane');

  if (tabBtns.length && panes.length) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const targetPane = document.getElementById(`pane-${targetId}`);
        const activeBtn = document.querySelector('.tarifs-tab.is-active');
        const activePane = document.querySelector('.tarifs-pane.is-active');

        if (btn === activeBtn || !targetPane) return;

        // 1. Switch active class on buttons
        activeBtn.classList.remove('is-active');
        btn.classList.add('is-active');

        // 2. Animate transition between panes
        if (prefersReduced) {
          if (activePane) {
            activePane.classList.remove('is-active');
            activePane.style.display = 'none';
            activePane.setAttribute('aria-hidden', 'true');
          }
          targetPane.style.display = 'block';
          targetPane.classList.add('is-active');
          targetPane.setAttribute('aria-hidden', 'false');
          tabBtns.forEach(t => t.setAttribute('aria-selected', 'false'));
          btn.setAttribute('aria-selected', 'true');
          ScrollTrigger.refresh();
        } else {
          // Fade out active pane
          gsap.to(activePane, {
            opacity: 0,
            y: 15,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
              activePane.classList.remove('is-active');
              activePane.style.display = 'none';
              activePane.setAttribute('aria-hidden', 'true');

              // Display target pane
              targetPane.style.display = 'block';
              targetPane.classList.add('is-active');
              targetPane.setAttribute('aria-hidden', 'false');

              // Accessibility updates
              tabBtns.forEach(t => t.setAttribute('aria-selected', 'false'));
              btn.setAttribute('aria-selected', 'true');

              // ScrollTrigger refresh is critical here to recalculate scroll heights
              ScrollTrigger.refresh();

              // Fade in new pane
              gsap.fromTo(targetPane,
                { opacity: 0, y: 15 },
                { 
                  opacity: 1, 
                  y: 0, 
                  duration: 0.35, 
                  ease: 'power2.out',
                  onComplete: () => {
                    // Trigger scroll trigger refresh again just in case height settling takes a frame
                    ScrollTrigger.refresh();
                  }
                }
              );

              // Sub-animations inside the panes for the extra "WOW" effect
              if (targetId === 'briques') {
                gsap.fromTo(targetPane.querySelectorAll('.brique-card'),
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
                );
              } else if (targetId === 'packs') {
                gsap.fromTo(targetPane.querySelectorAll('.pack-card'),
                  { opacity: 0, y: 20 },
                  { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
                );
              }
            }
          });
        }
      });
    });

    // Handle keyboard navigation for tabs
    const tabElements = document.querySelectorAll('.tarifs-tab');
    tabElements.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        let newIndex = index;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          newIndex = (index + 1) % tabElements.length;
          e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          newIndex = (index - 1 + tabElements.length) % tabElements.length;
          e.preventDefault();
        }
        if (newIndex !== index) {
          tabElements[newIndex].focus();
          tabElements[newIndex].click();
        }
      });
    });

    // Initial stagger for active tab (briques) on scroll reveal
    if (!prefersReduced) {
      gsap.from('.tarifs-pane.is-active .brique-card', {
        scrollTrigger: {
          trigger: '#tarifs',
          start: 'top 75%',
          once: true
        },
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
      });
    }
  }

  // --- #7. Section Dividers (animated line) ---
  if (!prefersReduced) {
    gsap.utils.toArray('.sec-divider').forEach(hr => {
      gsap.to(hr, {
        scaleX: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: hr,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1
        }
      });
    });
  }

  // --- #9. Footer reveal (clip-mask like Hero) ---
  const footerTagline = document.querySelector('.footer__tagline');
  if (footerTagline && !prefersReduced) {
    const rawHTML = footerTagline.innerHTML;
    const lines = rawHTML.split(/<br\s*\/?>/i);
    footerTagline.innerHTML = lines
      .map(l => `<span class="hline"><span class="hline-inner">${l}</span></span>`)
      .join('');
    const inners = footerTagline.querySelectorAll('.hline-inner');
    gsap.set(inners, { yPercent: 120 });
    gsap.to(inners, {
      yPercent: 0,
      duration: 1,
      ease: 'power4.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: footerTagline,
        start: 'top 85%',
        once: true
      }
    });
  }


  // --- Chatbot OctoMask (Gemini Flash 2.5) ---
  const chatToggle = document.getElementById('chat-toggle');
  const chatPanel = document.getElementById('chat-panel');
  const chatLog = document.getElementById('chat-log');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatSubmit = document.getElementById('chat-submit');
  
  let chatOpen = false;
  let chatInited = false;
  let chatMemory = []; // Stocke l'historique pour l'IA
  let chatLeadSent = sessionStorage.getItem('chatLeadSent') === '1'; // un seul lead capturé par session

  const addMsg = (text, type = 'sys') => {
    const d = document.createElement('div');
    d.className = `msg msg--${type}`;
    d.textContent = text;
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const addTypingIndicator = () => {
    const d = document.createElement('div');
    d.id = 'typing-indicator';
    d.className = 'msg msg--sys chat__typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    chatLog.appendChild(d);
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  const removeTypingIndicator = () => {
    const d = document.getElementById('typing-indicator');
    if (d) d.remove();
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    // Affiche le message de l'utilisateur
    addMsg(text, 'usr');
    chatInput.value = '';
    chatInput.disabled = true;
    chatSubmit.disabled = true;

    // Ajoute à la mémoire
    chatMemory.push({ role: 'user', text });

    // Affiche l'indicateur
    addTypingIndicator();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMemory })
      });
      const data = await res.json();
      removeTypingIndicator();

      if (data.reply) {
        // Interception du lead : la balise [LEAD]{...}[/LEAD] ne s'affiche jamais
        let display = data.reply;
        const leadMatch = data.reply.match(/\[LEAD\]\s*(\{[\s\S]*?\})\s*\[\/LEAD\]/i);
        if (leadMatch) {
          display = data.reply.replace(/\[LEAD\][\s\S]*?\[\/LEAD\]/i, '').trim();
          try {
            const lead = JSON.parse(leadMatch[1]);
            if (!chatLeadSent && lead && (lead.email || lead.phone) && lead.name) {
              chatLeadSent = true;
              sessionStorage.setItem('chatLeadSent', '1');
              fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: lead.name || '', email: lead.email || '', phone: lead.phone || '',
                  activity: lead.activity || '', need: (lead.need || '') + ' [via chatbot OctoMask]',
                }),
              }).catch(() => {});
            }
          } catch { /* balise malformée : on ignore, le texte reste propre */ }
        }
        if (display) addMsg(display, 'sys');
        chatMemory.push({ role: 'model', text: display });
        if (chatMemory.length > 20) chatMemory = chatMemory.slice(-20);
      } else {
        addMsg(_i18nDict['chat.error1'] || "Désolé, je rencontre un problème de connexion. Vous pouvez nous écrire à contact@purity-agency.be.", 'sys');
      }
    } catch (err) {
      removeTypingIndicator();
      addMsg(_i18nDict['chat.error2'] || "Désolé, une erreur s'est produite. Vous pouvez nous contacter directement à contact@purity-agency.be.", 'sys');
    }

    chatInput.disabled = false;
    chatSubmit.disabled = false;
    chatInput.focus();
  };

  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }

  const toggleChat = () => {
    chatOpen = !chatOpen;
    const parent = document.getElementById('chat');
    
    if (chatOpen) {
      parent.classList.add('is-open');
      chatPanel.removeAttribute('hidden');
      chatPanel.classList.add('is-entering');
      requestAnimationFrame(() => {
        chatPanel.classList.remove('is-entering');
        chatPanel.classList.add('is-active');
      });
      if (!chatInited) {
        chatInited = true;
        // Message d'accueil (n'est pas envoyé à l'API, sert juste d'intro)
        setTimeout(() => {
          const intro = _i18nDict['chat.intro'] || "Bonjour ! 👋 Je suis OctoMask, l'assistant virtuel de Purity Agency. Quel est votre métier ? Je peux vous indiquer concrètement ce que nous pourrions optimiser pour votre présence en ligne.";
          addMsg(intro, 'sys');
          chatMemory.push({ role: 'model', text: intro });

          // Suggestions orientées conversion
          const suggestions = [
            _i18nDict['chat.sug1'] || "Je veux un site pour mon activité",
            _i18nDict['chat.sug2'] || "Combien coûte un site ?",
            _i18nDict['chat.sug3'] || "Automatiser mon WhatsApp / mes RDV",
            _i18nDict['chat.sug4'] || "Être trouvé sur Google"
          ];
          
          const sugContainer = document.createElement('div');
          sugContainer.className = 'chat__suggestions';
          
          suggestions.forEach((txt, i) => {
            const btn = document.createElement('button');
            btn.className = 'chat__suggestion-btn';
            btn.textContent = txt;
            btn.style.animationDelay = `${i * 0.1}s`;
            btn.onclick = () => {
              sugContainer.remove(); // Efface les suggestions
              chatInput.value = txt; // Rempli le champ
              chatForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); // Envoie
            };
            sugContainer.appendChild(btn);
          });
          
          chatLog.appendChild(sugContainer);
          chatLog.scrollTop = chatLog.scrollHeight;
          
        }, 400);
      }
      setTimeout(() => chatInput.focus(), 500);
    } else {
      parent.classList.remove('is-open');
      chatPanel.classList.remove('is-active');
      chatPanel.classList.add('is-entering');
      setTimeout(() => {
        chatPanel.setAttribute('hidden', '');
      }, 300);
    }
  };

  // --- Chatbot déplaçable (drag) : distingue clic (ouvre) vs glissé (déplace) ---
  const chatEl = document.getElementById('chat');
  if (chatToggle && chatEl) {
    let dragging = false, moved = false, startX = 0, startY = 0, originX = 0, originY = 0;

    const onDown = (e) => {
      const pt = e.touches ? e.touches[0] : e;
      dragging = true; moved = false;
      startX = pt.clientX; startY = pt.clientY;
      const rect = chatEl.getBoundingClientRect();
      originX = rect.left; originY = rect.top;
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false });
      document.addEventListener('touchend', onUp);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const pt = e.touches ? e.touches[0] : e;
      const dx = pt.clientX - startX, dy = pt.clientY - startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { moved = true; chatEl.classList.add('is-dragging'); }
      if (moved) {
        if (e.cancelable) e.preventDefault();
        const w = chatEl.offsetWidth, h = chatEl.offsetHeight;
        let nx = Math.min(Math.max(0, originX + dx), window.innerWidth - w);
        let ny = Math.min(Math.max(0, originY + dy), window.innerHeight - h);
        chatEl.style.left = nx + 'px';
        chatEl.style.top = ny + 'px';
        chatEl.style.right = 'auto';
        chatEl.style.bottom = 'auto';
      }
    };
    const onUp = () => {
      dragging = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);

      if (moved) {
        // Magnétisme aux bords (comme la bulle Messenger) : snap au bord vertical le plus proche
        const w = chatEl.offsetWidth, h = chatEl.offsetHeight;
        const rect = chatEl.getBoundingClientRect();
        const margin = 20;
        const centerX = rect.left + w / 2;
        const snapLeft = centerX < window.innerWidth / 2;
        // clamp vertical dans l'écran
        let ny = Math.min(Math.max(margin, rect.top), window.innerHeight - h - margin);
        chatEl.classList.remove('is-dragging'); // réactive la transition pour un snap animé
        chatEl.style.top = ny + 'px';
        chatEl.style.bottom = 'auto';
        chatEl.style.right = 'auto';
        chatEl.style.left = (snapLeft ? margin : window.innerWidth - w - margin) + 'px';
        chatEl.dataset.side = snapLeft ? 'left' : 'right';
      } else {
        chatEl.classList.remove('is-dragging');
      }
    };

    chatToggle.addEventListener('mousedown', onDown);
    chatToggle.addEventListener('touchstart', onDown, { passive: true });
    // Clic = ouvre/ferme SEULEMENT si pas de déplacement
    chatToggle.addEventListener('click', (e) => {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; return; }
      toggleChat();
    });
  }

  // --- Sélecteur de langue (fonctionnel : traduction réelle via i18n/{code}.json) ---
  const langsel = document.getElementById('langsel');
  if (langsel) {
    const SUPPORTED_LANGS = ['fr', 'en', 'nl', 'de', 'es', 'pt', 'it', 'pl', 'ru', 'ar', 'zh', 'hi'];
    const btn = document.getElementById('langsel-btn');
    const options = Array.from(langsel.querySelectorAll('[role="option"]'));
    const dictCache = {};

    const openMenu = () => { langsel.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
    const closeMenu = () => { langsel.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
    const toggleMenu = () => langsel.classList.contains('is-open') ? closeMenu() : openMenu();

    btn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });

    const applyDict = (dict) => {
      _i18nDict = dict;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] != null) el.innerHTML = dict[key];
      });
      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        if (dict[key] != null) el.setAttribute('aria-label', dict[key].replace(/<[^>]+>/g, ''));
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (dict[key] != null) el.setAttribute('placeholder', dict[key].replace(/<[^>]+>/g, ''));
      });
    };

    const selectLang = async (li, { persist = true, userInitiated = false } = {}) => {
      if (li.getAttribute('aria-disabled') === 'true') return;
      const code = li.dataset.lang, flag = li.dataset.flag;

      try {
        if (!dictCache[code]) {
          const res = await fetch(`/i18n/${code}.json`);
          if (!res.ok) throw new Error('i18n fetch failed: ' + res.status);
          dictCache[code] = await res.json();
        }
        applyDict(dictCache[code]);
      } catch (err) {
        console.warn('[i18n] Impossible de charger la langue', code, err);
        if (userInitiated) return; // on n'affiche pas un site à moitié traduit
      }

      options.forEach(o => o.classList.remove('is-active'));
      li.classList.add('is-active');
      const flagImg = btn.querySelector('[data-flag] img');
      if (flagImg) flagImg.src = flag;
      btn.querySelector('[data-code]').textContent = code.toUpperCase();
      document.documentElement.lang = code;
      document.documentElement.dir = (code === 'ar') ? 'rtl' : 'ltr';
      if (persist) { try { localStorage.setItem('purity_lang', code); } catch {} }
      closeMenu();
    };
    options.forEach(li => li.addEventListener('click', () => selectLang(li, { userInitiated: true })));

    // restaure le choix mémorisé ou détecte la langue navigateur
    try {
      const saved = localStorage.getItem('purity_lang');
      const detected = (navigator.language || '').slice(0, 2).toLowerCase();
      const preferred = saved || (SUPPORTED_LANGS.includes(detected) ? detected : null);
      if (preferred && preferred !== 'fr') {
        const li = options.find(o => o.dataset.lang === preferred);
        if (li) selectLang(li, { persist: !!saved });
      }
    } catch {}

    // fermeture : clic extérieur + Échap
    document.addEventListener('click', (e) => { if (!langsel.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        const obEl = document.getElementById('ob-modal');
        if (obEl && obEl.classList.contains('is-open')) obEl.querySelector('.ob-close')?.click();
      }
    });
  }

  // --- Bulle teaser d'onboarding (12s OU 1er scroll, une seule fois) ---
  const teaser = document.getElementById('chat-teaser');
  if (teaser) {
    let teaserShown = false;
    const showTeaser = () => {
      if (teaserShown || chatOpen) return;
      if (localStorage.getItem('octomask_teaser_seen')) return;
      teaserShown = true;
      teaser.removeAttribute('hidden');
      requestAnimationFrame(() => teaser.classList.add('is-visible'));
      // auto-masque après 8s si ignorée
      setTimeout(() => hideTeaser(false), 8000);
    };
    const hideTeaser = (permanent) => {
      teaser.classList.remove('is-visible');
      setTimeout(() => teaser.setAttribute('hidden', ''), 400);
      if (permanent) localStorage.setItem('octomask_teaser_seen', '1');
    };
    teaser.querySelector('.chat__teaser-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); hideTeaser(true);
    });
    // clic sur la bulle → ouvre le chat
    teaser.addEventListener('click', () => { hideTeaser(true); if (!chatOpen) toggleChat(); });
    // déclencheurs
    setTimeout(showTeaser, 12000);
    window.addEventListener('scroll', function onFirstScroll() {
      if (window.scrollY > 400) { showTeaser(); window.removeEventListener('scroll', onFirstScroll); }
    }, { passive: true });
  }

  // ==========================================================================
  //  STICKY BOOKING CTA — affiche après scroll 55% ou 45s de visite
  // ==========================================================================
  const stickyBooking = document.getElementById('sticky-booking');
  if (stickyBooking) {
    let stickyShown = false;
    let stickyDismissed = false;
    
    const showStickyBooking = () => {
      if (stickyShown || stickyDismissed) return;
      // Ne pas afficher si le visiteur est déjà sur la section de contact/booking
      const bkSection = document.getElementById('contact');
      if (bkSection) {
        const rect = bkSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) return;
      }
      stickyShown = true;
      stickyBooking.hidden = false;
    };

    // Trigger 1 — 55% de scroll
    const onStickyScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.55) {
        showStickyBooking();
        window.removeEventListener('scroll', onStickyScroll);
      }
    };
    window.addEventListener('scroll', onStickyScroll, { passive: true });

    // Trigger 2 — 45 secondes de dwell time
    setTimeout(showStickyBooking, 45000);

    // Masquer quand l'utilisateur arrive sur #contact (IntersectionObserver)
    const bkEl = document.getElementById('contact');
    if (bkEl) {
      const bkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            stickyBooking.hidden = true;
          } else if (stickyShown && !stickyDismissed) {
            stickyBooking.hidden = false;
          }
        });
      }, { threshold: 0.1 });
      bkObserver.observe(bkEl);
    }

    // Marquer comme dismissed si l'utilisateur ferme manuellement
    stickyBooking.querySelector('.sticky-booking__close')?.addEventListener('click', () => {
      stickyDismissed = true;
    });
  }

  // Iframe booking fallback — si Google bloque l'embed, afficher le fallback
  const bkIframe = document.getElementById('bk-calendar-iframe');
  if (bkIframe) {
    bkIframe.addEventListener('error', () => {
      bkIframe.closest('.bk-iframe-container').style.display = 'none';
      const fallback = document.querySelector('.bk-fallback');
      if (fallback) fallback.style.display = 'block';
    });
    // Timeout safety — si après 8s l'iframe est vide, afficher le fallback
    setTimeout(() => {
      if (bkIframe.contentDocument?.body?.innerHTML?.length < 10) {
        bkIframe.closest('.bk-iframe-container').style.display = 'none';
        const fallback = document.querySelector('.bk-fallback');
        if (fallback) fallback.style.display = 'block';
      }
    }, 8000);
  }

  // ==========================================================================
  //  FUSION CONTACT & BOOKING — Commutateur d'onglets & gestion des ancres
  // ==========================================================================
  const cbTabs = document.querySelector('.cb-tabs');
  if (cbTabs) {
    const tabs = cbTabs.querySelectorAll('.cb-tab');
    const panes = document.querySelectorAll('.cb-pane');

    const activateTab = (targetId) => {
      tabs.forEach(tab => {
        const isActive = tab.getAttribute('data-target') === targetId;
        tab.classList.toggle('is-active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      panes.forEach(pane => {
        const idSuffix = pane.id.replace('pane-', '');
        if (idSuffix === targetId) {
          pane.style.display = 'block';
        } else {
          pane.style.display = 'none';
        }
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetId = tab.getAttribute('data-target');
        activateTab(targetId);
      });
    });

    // Intercepter les clics sur les liens d'ancres de navigation
    document.querySelectorAll('a[href^="#"], a[href*="index.html#"]').forEach(link => {
      link.addEventListener('click', () => {
        const href = link.getAttribute('href');
        const hash = href.substring(href.indexOf('#'));
        if (hash === '#booking') {
          activateTab('calendar');
        } else if (hash === '#contact') {
          activateTab('form');
        }
      });
    });

    // Vérifier l'ancre au chargement
    const checkHashOnLoad = () => {
      const hash = window.location.hash;
      if (hash === '#booking') {
        activateTab('calendar');
      } else if (hash === '#contact') {
        activateTab('form');
      }
    };

    window.addEventListener('hashchange', checkHashOnLoad);
    checkHashOnLoad();
  }

  // ==========================================================================
  //  ONBOARDING ASSISTANT FOR PACKS
  // ==========================================================================
  const obModal = document.getElementById('ob-modal');
  if (obModal) {
    const triggers = document.querySelectorAll('.ob-trigger');
    const closeBtn = obModal.querySelector('.ob-close');
    const steps = obModal.querySelectorAll('.ob-step');
    const progressFill = obModal.querySelector('.ob-progress-fill');
    const progressSteps = obModal.querySelectorAll('.ob-progress-step');
    const customSectorWrap = obModal.querySelector('#ob-custom-sector-wrap');
    const customSectorInput = obModal.querySelector('#ob-custom-sector');
    
    let currentStep = 1;
    let selectedSector = '';
    
    // Config des briques par secteur
    const sectorFeatures = {
      coiffure: [
        { name: "Réservation en ligne 24/7", desc: "Permettez à vos clients de réserver à tout moment sans vous déranger.", checked: true },
        { name: "Rappels SMS & WhatsApp anti no-show", desc: "Réduisez les rendez-vous manqués de plus de 65%.", checked: true },
        { name: "Récolte d'avis Google automatisée", desc: "Envoyez une demande d'avis par message après chaque visite.", checked: true },
        { name: "Acompte en ligne sécurisé", desc: "Optionnel : encaissez un acompte à la réservation pour garantir le RDV.", checked: false },
        { name: "Campagnes SMS Marketing de fidélisation", desc: "Optionnel : relancez automatiquement les clients inactifs.", checked: false }
      ],
      artisan: [
        { name: "Répondeur SMS intelligent", desc: "Envoie un SMS automatisé en cas d'appel manqué pour capter le client.", checked: true },
        { name: "WhatsApp Business automatisé", desc: "Répond instantanément aux demandes de devis et questions courantes.", checked: true },
        { name: "Visibilité locale Google (Fiche)", desc: "Optimisation de votre présence pour apparaître premier dans votre région.", checked: true },
        { name: "Module d'estimation et devis rapide", desc: "Optionnel : formulaire intelligent pour estimer un coût de travaux.", checked: false },
        { name: "Espace client suivi de chantiers", desc: "Optionnel : partagez l'avancement des travaux avec photos en ligne.", checked: false }
      ],
      horeca: [
        { name: "Module de commande & Click & Collect", desc: "Permettez la commande à emporter sans commissions tierces.", checked: true },
        { name: "Réservation de table connectée", desc: "Confirmez les réservations par SMS ou mail de manière autonome.", checked: true },
        { name: "Menu QR code interactif", desc: "Affichez votre carte de manière dynamique et moderne.", checked: true },
        { name: "Avis clients Tripadvisor & Google", desc: "Optionnel : récolte systématique d'avis de satisfaction.", checked: false },
        { name: "Fidélité digitale intégrée", desc: "Optionnel : programme de fidélité automatique pour les clients réguliers.", checked: false }
      ],
      praticien: [
        { name: "Prise de rendez-vous médicale/soins", desc: "Agenda en ligne avec créneaux et spécialités configurables.", checked: true },
        { name: "SMS et WhatsApp de rappels", desc: "Rappels programmés à H-24 et H-2 pour éviter les oublis.", checked: true },
        { name: "Acompte sécurisé anti-désistement", desc: "Optionnel : sécurisez vos créneaux en demandant un acompte.", checked: true },
        { name: "Questionnaire pré-consultation", desc: "Optionnel : récoltez les antécédents avant la séance.", checked: false },
        { name: "Espace fiches patients sécurisé", desc: "Optionnel : suivi numérique des séances et notes de consultation.", checked: false }
      ],
      liberal: [
        { name: "Prise de rendez-vous en ligne sécurisée", desc: "Agenda partagé pour réserver des créneaux de consultation.", checked: true },
        { name: "Relance et rappels automatiques", desc: "WhatsApp/SMS automatisés pour réduire le taux d'absentéisme.", checked: true },
        { name: "Récolte d'avis et recommandations", desc: "Obtenez des avis Google de façon autonome et déontologique.", checked: true },
        { name: "Espace de dépôt de documents sécurisé", desc: "Optionnel : portail client conforme RGPD pour recevoir les pièces.", checked: false },
        { name: "Formulaire intelligent de pré-qualification", desc: "Optionnel : qualifie le besoin du prospect avant le RDV.", checked: false }
      ],
      commerce: [
        { name: "Click & Collect & Vente locale", desc: "Votre boutique en ligne pour commander et retirer les produits.", checked: true },
        { name: "Visibilité Maps & SEO Local", desc: "Abonnement de visibilité pour capter les recherches à proximité.", checked: true },
        { name: "WhatsApp Business avec FAQ intégrée", desc: "Réponses instantanées sur vos horaires, stocks et localisations.", checked: true },
        { name: "Fidélisation client par SMS", desc: "Optionnel : envoyez vos ventes privées et offres directement sur le mobile.", checked: false },
        { name: "Synchronisation catalogue Instagram", desc: "Optionnel : vendez directement depuis vos publications sociales.", checked: false }
      ],
      immo: [
        { name: "Prise de RDV visites automatisée", desc: "Planification autonome des visites pour désengorger vos agents.", checked: true },
        { name: "Formulaire d'estimation de bien", desc: "Capteur de leads qualifiés souhaitant vendre leur bien.", checked: true },
        { name: "WhatsApp automatisé acquéreurs", desc: "Répond aux critères de recherche des acheteurs 24h/24.", checked: true },
        { name: "Alertes SMS nouveaux biens", desc: "Optionnel : notifiez vos acheteurs chauds dès qu'un bien rentre.", checked: false },
        { name: "Visite virtuelle interactive", desc: "Optionnel : intégration HD de vos visites 3D sur le site.", checked: false }
      ],
      autre: [
        { name: "Landing page de capture de leads", desc: "Page moderne centrée sur la conversion pour récolter des demandes.", checked: true },
        { name: "Rappels et notifications par e-mail", desc: "Suivi automatisé pour accuser réception et rassurer le client.", checked: true },
        { name: "Secrétariat WhatsApp Business", desc: "Réponse automatique aux messages de prospects.", checked: true },
        { name: "Module de réservation en ligne", desc: "Optionnel : agenda interactif pour fixer vos prestations.", checked: false },
        { name: "Paiement en ligne sécurisé (Stripe/PayPal)", desc: "Optionnel : encaissez vos prestations directement depuis le site.", checked: false }
      ]
    };

    const showStep = (step) => {
      steps.forEach(s => s.classList.remove('is-active'));
      const activeStep = obModal.querySelector(`.ob-step[data-step="${step}"]`);
      if (activeStep) activeStep.classList.add('is-active');
      
      // Update progress bar
      if (step <= 3) {
        progressFill.style.width = `${((step - 1) / 2) * 100}%`;
        progressSteps.forEach((s, idx) => {
          s.classList.remove('is-active', 'is-done');
          if (idx + 1 < step) s.classList.add('is-done');
          else if (idx + 1 === step) s.classList.add('is-active');
        });
        obModal.querySelector('.ob-progress-bar').style.display = 'block';
      } else {
        obModal.querySelector('.ob-progress-bar').style.display = 'none';
      }
      currentStep = step;
    };

    const loadFeatures = (sector) => {
      const list = obModal.querySelector('.ob-features-list');
      if (!list) return;
      list.innerHTML = '';
      
      const features = sectorFeatures[sector] || sectorFeatures['autre'];
      features.forEach((f, idx) => {
        const item = document.createElement('label');
        item.className = 'ob-feature-item';
        item.innerHTML = `
          <input type="checkbox" name="ob-feature" value="${f.name}" ${f.checked ? 'checked' : ''}>
          <span class="ob-feature-checkbox">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span class="ob-feature-text">
            <span class="ob-feature-name">${f.name}</span>
            <span class="ob-feature-desc">${f.desc}</span>
          </span>
        `;
        list.appendChild(item);
      });
    };

    // Trigger open
    triggers.forEach(t => t.addEventListener('click', (e) => {
      e.preventDefault();
      const sector = t.getAttribute('data-open-ob');
      selectedSector = sector;
      
      // Check correct sector radio
      const radio = obModal.querySelector(`input[name="ob-sector"][value="${sector}"]`);
      if (radio) {
        radio.checked = true;
      }
      
      if (sector === 'autre') {
        if (customSectorWrap) customSectorWrap.style.display = 'block';
        if (customSectorInput) {
          customSectorInput.required = true;
          customSectorInput.focus();
        }
      } else {
        if (customSectorWrap) customSectorWrap.style.display = 'none';
        if (customSectorInput) customSectorInput.required = false;
      }
      
      // Load relevant features
      loadFeatures(sector);
      
      // Show first step & open modal
      showStep(1);
      obModal.classList.add('is-open');
      obModal.removeAttribute('aria-hidden');
      obModal.querySelector('.ob-close')?.focus();
      document.body.style.overflow = 'hidden'; // block page scroll
    }));

    // Close
    const closeModal = () => {
      obModal.classList.remove('is-open');
      obModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      // Reset form
      obModal.querySelector('#ob-contact-form')?.reset();
      const firstRadio = obModal.querySelector('input[name="ob-sector"]:checked');
      if (firstRadio) firstRadio.checked = false;
      const painChecks = obModal.querySelectorAll('input[name="ob-pain"]');
      painChecks.forEach(c => c.checked = false);
      if (customSectorWrap) customSectorWrap.style.display = 'none';
      if (customSectorInput) {
        customSectorInput.value = '';
        customSectorInput.required = false;
      }
      // Supprimer les douleurs personnalisées rajoutées dynamiquement (les 20 premières sont par défaut)
      const painsWrapper = obModal.querySelector('#ob-pains-wrapper');
      if (painsWrapper) {
        const dynamicChips = painsWrapper.querySelectorAll('.ob-chip:nth-child(n+21)');
        dynamicChips.forEach(c => c.remove());
      }
      const addPainInput = obModal.querySelector('#ob-add-pain-input');
      if (addPainInput) addPainInput.value = '';
    };

    closeBtn.addEventListener('click', closeModal);
    obModal.querySelector('.ob-modal__backdrop').addEventListener('click', closeModal);
    obModal.querySelector('.ob-btn-close')?.addEventListener('click', closeModal);

    // Radios change handler to dynamic features load & custom text input visibility
    obModal.querySelectorAll('input[name="ob-sector"]').forEach(input => {
      input.addEventListener('change', (e) => {
        selectedSector = e.target.value;
        if (selectedSector === 'autre') {
          if (customSectorWrap) customSectorWrap.style.display = 'block';
          if (customSectorInput) {
            customSectorInput.required = true;
            customSectorInput.focus();
          }
        } else {
          if (customSectorWrap) customSectorWrap.style.display = 'none';
          if (customSectorInput) {
            customSectorInput.value = '';
            customSectorInput.required = false;
          }
        }
        loadFeatures(selectedSector);
      });
    });

    // Pain points custom additions handler
    const addPainInput = obModal.querySelector('#ob-add-pain-input');
    const addPainBtn = obModal.querySelector('#ob-add-pain-btn');
    const painsWrapper = obModal.querySelector('#ob-pains-wrapper');

    if (addPainBtn && addPainInput && painsWrapper) {
      const handleAddPain = () => {
        const val = addPainInput.value.trim();
        if (!val) return;
        
        const label = document.createElement('label');
        label.className = 'ob-chip';
        const cleanVal = val.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const cb = document.createElement('input');
        cb.type = 'checkbox'; cb.name = 'ob-pain'; cb.value = cleanVal; cb.checked = true;
        const sp = document.createElement('span');
        sp.textContent = val;
        label.appendChild(cb);
        label.appendChild(sp);
        
        painsWrapper.appendChild(label);
        addPainInput.value = '';
      };

      addPainBtn.addEventListener('click', (e) => {
        e.preventDefault();
        handleAddPain();
      });
      
      addPainInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAddPain();
        }
      });
    }

    // Next / Prev actions
    obModal.querySelectorAll('.ob-btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep === 1) {
          if (!selectedSector) {
            const selected = obModal.querySelector('input[name="ob-sector"]:checked');
            if (selected) selectedSector = selected.value;
            else {
              alert(_i18nDict['ob.alert.sector'] || "Veuillez sélectionner votre secteur d'activité.");
              return;
            }
          }
          if (selectedSector === 'autre' && customSectorInput && !customSectorInput.value.trim()) {
            alert(_i18nDict['ob.alert.metier'] || "Veuillez saisir votre métier.");
            customSectorInput.focus();
            return;
          }
          // Validation minimum 1 douleur
          const chosenPains = obModal.querySelectorAll('input[name="ob-pain"]:checked');
          if (chosenPains.length === 0) {
            alert(_i18nDict['ob.alert.pain'] || "Veuillez cocher au moins une douleur actuelle.");
            return;
          }
          
          loadFeatures(selectedSector);
          showStep(2);
        } else if (currentStep === 2) {
          // Validation minimum 1 brique
          const chosenFeatures = obModal.querySelectorAll('input[name="ob-feature"]:checked');
          if (chosenFeatures.length === 0) {
            alert(_i18nDict['ob.alert.feature'] || "Veuillez sélectionner au moins une brique de fonctionnalité.");
            return;
          }
          showStep(3);
        }
      });
    });

    obModal.querySelectorAll('.ob-btn-prev').forEach(btn => {
      btn.addEventListener('click', () => {
        showStep(currentStep - 1);
      });
    });

    // Form submit
    const obForm = obModal.querySelector('#ob-contact-form');
    if (obForm) obForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = obForm.querySelector('.ob-btn-submit');
      const originalText = btn.textContent;
      btn.textContent = _i18nDict['form.sending'] || 'Envoi…';
      btn.disabled = true;

      // Extract options selected
      let chosenSectorName = '';
      if (selectedSector === 'autre' && customSectorInput) {
        chosenSectorName = customSectorInput.value.trim() || 'Autre';
      } else {
        const checkedRadio = obModal.querySelector(`input[name="ob-sector"]:checked`);
        chosenSectorName = checkedRadio?.parentElement.querySelector('.ob-select-title')?.textContent || selectedSector;
      }
      
      const chosenPains = Array.from(obModal.querySelectorAll('input[name="ob-pain"]:checked')).map(el => el.parentElement.querySelector('span').textContent);
      const chosenFeatures = Array.from(obModal.querySelectorAll('input[name="ob-feature"]:checked')).map(el => el.value);

      const needFormatted = `[Onboarding Pack - ${chosenSectorName}]
- Douleurs ciblées : ${chosenPains.length > 0 ? chosenPains.join(', ') : 'Aucune spécifique'}
- Fonctionnalités connectées : ${chosenFeatures.length > 0 ? chosenFeatures.join(', ') : 'Aucune spécifique'}
- Message additionnel : ${obForm.querySelector('#ob-f-msg')?.value || '—'}`;

      const payload = {
        name: obForm.querySelector('#ob-f-name')?.value || '',
        email: obForm.querySelector('#ob-f-email')?.value || '',
        phone: obForm.querySelector('#ob-f-phone')?.value || '',
        activity: `Secteur : ${chosenSectorName} (${obForm.querySelector('#ob-f-company')?.value || 'Sans entreprise'})`,
        need: needFormatted,
        website_verification: obForm.querySelector('input[name="website_verification"]')?.value || '',
      };

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('bad status');

        // Injecter l'URL de réservation pré-remplie dans le bouton du modal step 4
        const obBookingBtn = obModal.querySelector('[data-step="4"] .ob-btn-booking');
        if (obBookingBtn) {
          obBookingBtn.href = buildBookingUrl(payload.name, payload.email, payload.phone);
        }

        showStep(4);
        obForm.reset();
      } catch (err) {
        btn.textContent = _i18nDict['form.error'] || 'Erreur — réessayer';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 2500);
      }
    });
  }

  // Escape key sans langsel (ex. pages où langsel absent)
  if (!langsel) {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && obModal && obModal.classList.contains('is-open')) {
        obModal.querySelector('.ob-close')?.click();
      }
    });
  }
});
