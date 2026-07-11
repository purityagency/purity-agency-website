// Si l'URL contient une ancre (#services…) au rechargement, on ne force pas le scroll au top pour permettre la redirection
const hasHash = !!window.location.hash;

// Configuration supprimée : Le calendrier externe a été remplacé par une intégration native.

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

  // --- Hero BG : vidéo ou image selon contexte ---
  const heroBgVideo = document.querySelector('.hero__bg-video');
  const heroText    = document.querySelector('.hero__text-col');
  const isMobile    = window.innerWidth <= 768;

  if (heroBgVideo) {
    if (prefersReduced || isMobile) {
      // Reduced motion ou mobile → image de fallback, pas de vidéo
      heroBgVideo.style.display = 'none';
      const fallback = heroBgVideo.querySelector('img');
      if (fallback) {
        fallback.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
        heroBgVideo.parentElement.appendChild(fallback);
      }
    } else {
      // Desktop + pas de reduced motion → fade-in au canplay
      gsap.set(heroBgVideo, { opacity: 0, scale: 1.04 });

      const onReady = () => {
        gsap.to(heroBgVideo, {
          opacity: 1, scale: 1,
          duration: 1.4, ease: 'power2.out'
        });
      };

      if (heroBgVideo.readyState >= 3) {
        onReady();
      } else {
        heroBgVideo.addEventListener('canplay', onReady, { once: true });
        // Fallback : si la vidéo ne charge pas en 4s, afficher quand même
        setTimeout(() => { gsap.set(heroBgVideo, { opacity: 1, scale: 1 }); }, 4000);
      }

      // Parallax scroll sur la vidéo
      gsap.to(heroBgVideo, {
        scale: 1.1, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
      });
    }
  }

  if (heroText) {
    gsap.to(heroText, {
      y: 40, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
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

  // --- 1b. SERVICES : 3D Carousel ---
  const initServicesCarousel = () => {
    const carousel = document.querySelector('.svc-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.svc-carousel__track');
    const cards = Array.from(carousel.querySelectorAll('.svc-card'));
    const dots = Array.from(carousel.querySelectorAll('.svc-carousel__dot'));
    const total = cards.length;
    let currentIndex = 0;
    let isTransitioning = false;

    // Dimensions fixes adaptées pour carrousel déporté
    const cardWidth = 460;
    const gap = 128; // 8rem = 128px

    const goToCard = (index, animate = true) => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) return; // scroll-snap natif sur mobile

      // Loop circulaire pour l'index
      index = ((index % total) + total) % total;
      
      // Calcul du décalage pour centrer la card active
      const offset = -index * (cardWidth + gap);
      
      if (animate) {
        gsap.to(track, {
          x: offset,
          duration: 0.6,
          ease: 'power3.out'
        });
      } else {
        gsap.set(track, { x: offset });
      }

      cards.forEach((card, i) => {
        const distance = Math.abs(i - index);
        
        let scale = 1;
        let opacity = 1;
        let rotateY = 0;
        let z = 0;

        if (distance > 0) {
          scale = 0.90; // un peu plus petit sur les côtés pour marquer le contraste
          opacity = 0.55;
          rotateY = i < index ? 10 : -10; // angle 3D légèrement accentué
          z = -80;
        }

        if (animate) {
          gsap.to(card, {
            scale: scale,
            opacity: opacity,
            rotationY: rotateY,
            z: z,
            duration: 0.5,
            ease: 'power2.out'
          });
        } else {
          gsap.set(card, {
            scale: scale,
            opacity: opacity,
            rotationY: rotateY,
            z: z
          });
        }

        card.classList.toggle('is-active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
      });

      currentIndex = index;
    };

    // Pas d'interception du scroll : la molette garde son comportement normal,
    // la navigation du carrousel se fait uniquement aux flèches / dots.

    // Auto-rotation toutes les 4.5s (pause au hover)
    let autoTimer = null;
    function startAuto() {
      if (window.innerWidth <= 768) return;
      if (autoTimer) return; // Évite les minuteurs multiples
      autoTimer = setInterval(() => {
        goToCard(currentIndex + 1);
      }, 4500);
    }
    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Flèches prev/next
    const prevBtn = carousel.querySelector('.svc-carousel__arrow--prev');
    const nextBtn = carousel.querySelector('.svc-carousel__arrow--next');
    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goToCard(currentIndex - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goToCard(currentIndex + 1); startAuto(); });

    // Clic sur les dots
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        goToCard(idx);
      });
    });

    // Clic sur les cards
    cards.forEach((card, idx) => {
      card.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) return; // Lien natif sur mobile

        if (idx !== currentIndex) {
          e.preventDefault();
          goToCard(idx);
          return;
        }

        // Clic sur la card active -> plongée transition 3D
        e.preventDefault();
        const href = card.getAttribute('data-href');
        
        gsap.timeline()
          .to(card, {
            scale: 2.5,
            z: 400,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.in'
          })
          .to(cards.filter(c => c !== card), {
            opacity: 0,
            scale: 0.7,
            duration: 0.4
          }, '<')
          .to(carousel, {
            filter: 'blur(20px)',
            opacity: 0,
            duration: 0.4
          }, '<0.2')
          .call(() => {
            window.location.href = href;
          });
      });
    });

    // Init positions
    goToCard(0, false);


    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);
    startAuto();

    // Adaptatif sur resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        computeDims();
        goToCard(currentIndex, false);
      } else {
        gsap.set(track, { clearProps: 'all' });
        cards.forEach(card => gsap.set(card, { clearProps: 'all' }));
      }
    });
  };

  initServicesCarousel();


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

  // --- Activity chips (formulaire contact) ---
  const activityChips = document.querySelectorAll('.activity-chip');
  const activityHidden = document.getElementById('f-activity');
  const needField = document.getElementById('f-need');
  const activityHint = document.getElementById('activity-hint');
  const chipHints = {
    'site':     'Ex : refonte de mon site actuel, je veux plus de leads entrants…',
    'ia':       'Ex : un chatbot pour qualifier mes prospects et répondre aux FAQ 24h/24…',
    'auto':     'Ex : automatiser mes relances e-mail et devis depuis mon CRM…',
    'presence': 'Ex : me faire connaître en ligne — Google, réseaux sociaux, visibilité locale…',
    'autre':    'Décrivez votre besoin en quelques mots…',
  };
  activityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      activityChips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      if (activityHidden) activityHidden.value = chip.dataset.value;
      const hint = chipHints[chip.dataset.hint] || '';
      if (activityHint) {
        activityHint.textContent = hint;
        activityHint.hidden = !hint;
      }
      if (needField && hint) needField.focus();
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

      // Configurer le bouton de réservation natif
      const sentBlock = form.querySelector('.form__sent');
      const bookingBtn = sentBlock?.querySelector('.ob-btn-booking');
      if (bookingBtn) {
        // Cloner pour enlever d'anciens events si on soumet 2 fois
        const newBtn = bookingBtn.cloneNode(true);
        bookingBtn.parentNode.replaceChild(newBtn, bookingBtn);
        newBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          const bkName = document.getElementById('bk-name');
          const bkEmail = document.getElementById('bk-email');
          const bkPhone = document.getElementById('bk-phone');
          const bkNeed = document.getElementById('bk-need');
          if (bkName) bkName.value = payload.name;
          if (bkEmail) bkEmail.value = payload.email;
          if (bkPhone) bkPhone.value = payload.phone;
          if (bkNeed) bkNeed.value = payload.need;
          
          window.location.hash = '#booking';
          const calTab = document.getElementById('tab-calendar');
          if (calTab) calTab.click();
        });
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

  // --- #1. Custom Cursor aura ---
  if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
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
  const chatEl = document.getElementById('chat');
  const chatToggle = document.getElementById('chat-toggle');

  if (chatEl && chatToggle) {
    // Dynamic injection of chat-badge if missing
    if (!document.getElementById('chat-badge')) {
      const badge = document.createElement('span');
      badge.id = 'chat-badge';
      badge.className = 'chat__badge';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = '1';
      chatToggle.appendChild(badge);
    }
    // Dynamic injection of chat-teaser if missing
    if (!document.getElementById('chat-teaser')) {
      const teaser = document.createElement('div');
      teaser.id = 'chat-teaser';
      teaser.className = 'chat__teaser';
      teaser.setAttribute('hidden', '');
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'chat__teaser-close';
      closeBtn.setAttribute('data-i18n-aria', 'teaser.close_aria');
      closeBtn.setAttribute('aria-label', (typeof _i18nDict !== 'undefined' && _i18nDict['teaser.close_aria']) || 'Fermer');
      closeBtn.textContent = '✕';
      
      const waveSpan = document.createElement('span');
      waveSpan.className = 'chat__teaser-wave';
      waveSpan.textContent = '👋';
      
      const textPara = document.createElement('p');
      textPara.setAttribute('data-i18n', 'teaser.text');
      textPara.innerHTML = (typeof _i18nDict !== 'undefined' && _i18nDict['teaser.text']) || 'Un projet en tête ?<br><strong>Parlons-en — c\'est gratuit.</strong>';
      
      teaser.appendChild(closeBtn);
      teaser.appendChild(waveSpan);
      teaser.appendChild(textPara);
      chatEl.insertBefore(teaser, chatToggle);
    }
  }

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

  const chatBadge = document.getElementById('chat-badge');
  if (chatBadge) {
    try { if (sessionStorage.getItem('octomask_badge_seen')) chatBadge.hidden = true; } catch {}
  }

  const toggleChat = () => {
    chatOpen = !chatOpen;
    const parent = document.getElementById('chat');

    if (chatOpen) {
      if (chatBadge) {
        chatBadge.hidden = true;
        try { sessionStorage.setItem('octomask_badge_seen', '1'); } catch {}
      }
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
          const intro = _i18nDict['chat.intro'] || "Bonjour ! 👋 Je filtre les premières demandes pour l'équipe Purity. Pour aller droit au but et vous faire gagner du temps : quel est le principal frein de votre activité aujourd'hui ?";
          addMsg(intro, 'sys');
          chatMemory.push({ role: 'model', text: intro });

          // Suggestions orientées conversion (approche "douleur" / ROI)
          const suggestions = [
            _i18nDict['chat.sug1'] || "Je perds des appels quand je travaille",
            _i18nDict['chat.sug2'] || "J'ai trop de RDV oubliés (no-shows)",
            _i18nDict['chat.sug3'] || "On ne me trouve pas bien sur Google",
            _i18nDict['chat.sug4'] || "Je veux (re)faire mon site web"
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
  // chatEl already declared above
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
      if (typeof window.refreshOnboardingFeatures === 'function') {
        window.refreshOnboardingFeatures();
      }
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

    // priorité : ?lang= (URLs indexables / hreflang) > choix mémorisé > langue navigateur
    try {
      const urlLang = new URLSearchParams(location.search).get('lang');
      const saved = localStorage.getItem('purity_lang');
      const detected = (navigator.language || '').slice(0, 2).toLowerCase();
      const preferred = (SUPPORTED_LANGS.includes(urlLang) ? urlLang : null)
        || saved
        || (SUPPORTED_LANGS.includes(detected) ? detected : null);
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
      if (sessionStorage.getItem('octomask_teaser_seen')) return;
      teaserShown = true;
      teaser.removeAttribute('hidden');
      requestAnimationFrame(() => teaser.classList.add('is-visible'));
      // auto-masque après 8s si ignorée
      setTimeout(() => hideTeaser(false), 8000);
    };
    const hideTeaser = (permanent) => {
      teaser.classList.remove('is-visible');
      setTimeout(() => teaser.setAttribute('hidden', ''), 400);
      if (permanent) sessionStorage.setItem('octomask_teaser_seen', '1');
    };
    teaser.querySelector('.chat__teaser-close')?.addEventListener('click', (e) => {
      e.stopPropagation(); hideTeaser(true);
    });
    // clic sur la bulle → ouvre le chat
    teaser.addEventListener('click', () => { hideTeaser(true); if (!chatOpen) toggleChat(); });
    // déclencheurs
    setTimeout(showTeaser, 4000);
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

  // ── Calendrier de réservation maison (backend Google Calendar via /api) ──
  const booking = document.getElementById('booking-widget');
  if (booking) {
    const daysEl   = booking.querySelector('#booking-days');
    const slotsEl  = booking.querySelector('#booking-slots');
    const slotsLbl = booking.querySelector('#booking-slots-label');
    const formEl   = booking.querySelector('#booking-form');
    const doneEl   = booking.querySelector('#booking-done');
    const errEl    = booking.querySelector('#booking-error');
    const calEl    = booking.querySelector('.booking__cal');
    const whenEl   = booking.querySelector('#booking-form-when');
    let selectedSlot = null;

    const LOCALE = () => document.documentElement.lang || 'fr';
    const fmtDay = (d) => d.toLocaleDateString(LOCALE(), { weekday: 'short', day: 'numeric', month: 'short' });
    const fmtTime = (d) => d.toLocaleTimeString(LOCALE(), { hour: '2-digit', minute: '2-digit' });
    const fmtFull = (d) => d.toLocaleString(LOCALE(), { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

    const showError = (msg) => { errEl.textContent = msg; errEl.hidden = false; };
    const clearError = () => { errEl.hidden = true; };

    // Construit les ~14 prochains jours (hors week-end géré côté serveur : jours vides = aucun créneau)
    const buildDays = () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      for (let i = 0; i < 14; i++) {
        const d = new Date(today.getTime() + i * 86400000);
        const wd = d.getDay();
        if (wd === 0 || wd === 6) continue; // on n'affiche pas les week-ends
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'booking__day';
        btn.dataset.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        btn.innerHTML = `<span class="booking__day-wd">${d.toLocaleDateString(LOCALE(), { weekday: 'short' })}</span><span class="booking__day-num">${d.getDate()}</span><span class="booking__day-mo">${d.toLocaleDateString(LOCALE(), { month: 'short' })}</span>`;
        btn.addEventListener('click', () => selectDay(btn));
        daysEl.appendChild(btn);
      }
    };

    const selectDay = (btn) => {
      daysEl.querySelectorAll('.booking__day').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      loadSlots(btn.dataset.date);
    };

    const loadSlots = async (date) => {
      clearError();
      slotsEl.innerHTML = '';
      slotsLbl.textContent = _i18nDict['booking.loading'] || 'Chargement des créneaux…';
      try {
        const res = await fetch(`/api/availability?date=${date}`);
        const data = await res.json();
        if (data.error === 'not_configured') { showError(_i18nDict['booking.err_config'] || 'Réservation en ligne bientôt disponible. Écrivez-nous en attendant.'); slotsLbl.textContent = ''; return; }
        const slots = data.slots || [];
        if (!slots.length) { slotsLbl.textContent = _i18nDict['booking.no_slot'] || 'Aucun créneau ce jour-là. Essayez un autre jour.'; return; }
        slotsLbl.textContent = _i18nDict['booking.pick_slot'] || 'Créneaux disponibles :';
        slots.forEach(iso => {
          const d = new Date(iso);
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'booking__slot';
          if (selectedSlot === iso) b.classList.add('is-active');
          b.textContent = fmtTime(d);
          b.addEventListener('click', () => chooseSlot(iso, b));
          slotsEl.appendChild(b);
        });
      } catch (e) {
        showError(_i18nDict['booking.err_load'] || 'Impossible de charger les créneaux. Réessayez.');
        slotsLbl.textContent = '';
      }
    };

    const chooseSlot = (iso, btnEl) => {
      selectedSlot = iso;
      // Mettre en évidence le bouton sélectionné et nettoyer les autres
      slotsEl.querySelectorAll('.booking__slot').forEach(b => b.classList.remove('is-active'));
      if (btnEl) btnEl.classList.add('is-active');
      
      // On garde le calendrier visible et on affiche simplement le formulaire en dessous
      formEl.hidden = false;
      clearError();
      formEl.querySelector('#bk-name')?.focus();
    };

    // Le bouton retour est caché en CSS mais conservé pour rétrocompatibilité fonctionnelle
    booking.querySelector('#booking-back')?.addEventListener('click', () => {
      formEl.hidden = true;
    });

    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      const submitBtn = formEl.querySelector('#booking-submit');
      const original = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = _i18nDict['form.sending'] || 'Envoi…';
      try {
        const res = await fetch('/api/book', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start: selectedSlot,
            name: formEl.querySelector('#bk-name').value.trim(),
            email: formEl.querySelector('#bk-email').value.trim(),
            phone: formEl.querySelector('#bk-phone').value.trim(),
            need: formEl.querySelector('#bk-need').value.trim(),
            website_verification: formEl.querySelector('#bk-website').value,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (data.error === 'taken') showError(_i18nDict['booking.err_taken'] || 'Ce créneau vient d\'être pris. Choisissez-en un autre.');
          else showError(_i18nDict['booking.err_book'] || 'La réservation a échoué. Réessayez ou écrivez-nous.');
          submitBtn.disabled = false; submitBtn.textContent = original;
          return;
        }
        booking.querySelector('#booking-done-when').textContent = fmtFull(new Date(data.start));
        formEl.hidden = true;
        doneEl.hidden = false;
        // Liens "Ajouter à l'agenda"
        const startDt = new Date(data.start);
        const endDt   = new Date(startDt.getTime() + 15 * 60000);
        const fmtCal  = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const gcalBtn = document.getElementById('bk-done-gcal');
        const icsBtn  = document.getElementById('bk-done-ics');
        const calBlock = document.getElementById('booking-done-cal');
        if (gcalBtn) {
          const gcal = new URL('https://calendar.google.com/calendar/render');
          gcal.searchParams.set('action', 'TEMPLATE');
          gcal.searchParams.set('text', 'Appel stratégique — Purity Agency');
          gcal.searchParams.set('dates', fmtCal(startDt) + '/' + fmtCal(endDt));
          gcal.searchParams.set('details', 'Diagnostic offert de 15 min avec Purity Agency.');
          gcalBtn.href = gcal.toString();
        }
        if (icsBtn) {
          const ics = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Purity Agency//FR',
            'BEGIN:VEVENT',
            'DTSTART:' + fmtCal(startDt),
            'DTEND:'   + fmtCal(endDt),
            'SUMMARY:Appel stratégique — Purity Agency',
            'DESCRIPTION:Diagnostic offert de 15 min avec Purity Agency.',
            'END:VEVENT', 'END:VCALENDAR',
          ].join('\r\n');
          const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
          icsBtn.href = URL.createObjectURL(blob);
          icsBtn.download = 'purity-agency-rdv.ics';
        }
        if (calBlock) calBlock.hidden = false;
      } catch (err) {
        showError(_i18nDict['booking.err_book'] || 'La réservation a échoué. Réessayez ou écrivez-nous.');
        submitBtn.disabled = false; submitBtn.textContent = original;
      }
    });

    buildDays();
    const firstDay = daysEl.querySelector('.booking__day');
    if (firstDay) selectDay(firstDay);
  }

  // ── Notice cookies (informative : aucun traceur, aucun tiers navigateur) ──
  const cookieBanner = document.getElementById('cookie-banner');
  if (cookieBanner) {
    let seen = false;
    try { seen = !!localStorage.getItem('purity_cookie_notice'); } catch {}
    if (!seen) {
      cookieBanner.removeAttribute('hidden');
      document.getElementById('cookie-accept')?.addEventListener('click', () => {
        try { localStorage.setItem('purity_cookie_notice', '1'); } catch {}
        cookieBanner.setAttribute('hidden', '');
      });
    }
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

  // Onboarding modal géré par js/order.js
});

// --- Custom Glow Cursor (Mauve lueur sous la souris normale) ---
document.addEventListener('DOMContentLoaded', () => {
  const glowTracker = document.createElement('div');
  glowTracker.className = 'cursor-glow-tracker';
  document.body.appendChild(glowTracker);

  document.addEventListener('mousemove', (e) => {
    // La transition CSS s'occupe de la fluidité
    glowTracker.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
  }, { passive: true });
});

// --- Sticky Booking — fermeture du bandeau ---
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.querySelector('.sticky-booking__close');
  const stickyBanner = document.getElementById('sticky-booking');
  if (closeBtn && stickyBanner) {
    closeBtn.addEventListener('click', () => { stickyBanner.hidden = true; });
  }
});

// Scrollspy pour la TabBar Mobile
document.addEventListener('DOMContentLoaded', () => {
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  const sections = document.querySelectorAll('section[id], header[id]');

  function updateActiveNavItem() {
    let currentSectionId = 'hero';
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    mobileNavItems.forEach(item => {
      item.classList.remove('is-active');
      if (item.getAttribute('data-section') === currentSectionId) {
        item.classList.add('is-active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavItem, { passive: true });
  updateActiveNavItem();
});

// Swipe tactile Services
document.addEventListener('DOMContentLoaded', () => {
  const screen = document.querySelector('.svc-showcase__screen');
  if (!screen) return;

  let touchStartX = 0;
  let touchEndX = 0;

  screen.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  screen.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      // Swipe à gauche -> Service suivant
      const btnNext = document.querySelector('.svc-nav-btn--next');
      if (btnNext) btnNext.click();
    } else if (touchEndX > touchStartX + threshold) {
      // Swipe à droite -> Service précédent
      const btnPrev = document.querySelector('.svc-nav-btn--prev');
      // If we don't have a direct prev button click handler, we trigger previous card
      if (btnPrev) {
        // Wait, on desktop the prev button is there, on mobile we can simulate it
        // by finding the active card and clicking its previous sibling
        const activeCard = document.querySelector('.svc-card.is-active');
        if (activeCard) {
          const prevCard = activeCard.previousElementSibling;
          if (prevCard && prevCard.classList.contains('svc-card')) {
            prevCard.click();
          } else {
            // Loop back to last card
            const cards = document.querySelectorAll('.svc-card');
            if (cards.length > 0) cards[cards.length - 1].click();
          }
        }
      }
    }
  }
});

// --- Amélioration de texte IA (OctoMask) ---
document.addEventListener('DOMContentLoaded', () => {
  const textareas = ['#f-need', '#bk-need'];
  textareas.forEach(id => {
    const textarea = document.querySelector(id);
    if (!textarea) return;
    
    const parentField = textarea.parentNode;
    
    // Create inspiration chips container
    const chipsContainer = document.createElement('div');
    chipsContainer.className = 'ai-inspiration-chips';
    
    const chipsData = [
      { label: "Site Vitrine", text: "Je souhaite concevoir un site vitrine moderne et immersif pour valoriser mon expertise et capter des prospects qualifiés..." },
      { label: "Boutique E-commerce", text: "Je cherche à lancer une boutique e-commerce fluide et performante, optimisée pour maximiser le taux de conversion..." },
      { label: "Portail Client / SaaS", text: "Je souhaite développer un portail client sur-mesure pour automatiser nos échanges et centraliser les données de nos utilisateurs..." },
      { label: "Automatisation & CRM", text: "Je souhaite interconnecter nos outils internes et automatiser nos processus pour gagner en productivité et éliminer les tâches répétitives..." }
    ];
    
    chipsData.forEach(chip => {
      const btnChip = document.createElement('button');
      btnChip.type = 'button';
      btnChip.className = 'ai-chip';
      btnChip.textContent = chip.label;
      btnChip.addEventListener('click', () => {
        textarea.value = chip.text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
        // Hide chips
        chipsContainer.classList.remove('is-visible');
      });
      chipsContainer.appendChild(btnChip);
    });
    
    parentField.appendChild(chipsContainer);
    
    // Toggle chips visibility based on focus and content
    const updateChipsVisibility = () => {
      const val = textarea.value.trim();
      if (!val && document.activeElement === textarea) {
        chipsContainer.classList.add('is-visible');
      } else {
        chipsContainer.classList.remove('is-visible');
      }
    };
    
    textarea.addEventListener('focus', updateChipsVisibility);
    textarea.addEventListener('blur', () => {
      // Small delay to allow chip click to register before hiding
      setTimeout(updateChipsVisibility, 150);
    });
    textarea.addEventListener('input', updateChipsVisibility);
    
    // Create Sublimer button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-improve-btn';
    const labelText = "Sublimer avec l'IA";
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" aria-hidden="true"><path d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM19 6.5L18.5 9l-.5-2.5L15.5 6l2.5-.5.5-2.5.5 2.5 2.5.5-2.5.5z"/></svg><span>${labelText}</span>`;
    btn.title = "Sublimer votre texte avec l'IA d'OctoMask";
    
    parentField.appendChild(btn);
    
    btn.addEventListener('click', async () => {
      const val = textarea.value.trim();
      if (!val) {
        // If empty, trigger focus to show chips and prompt user
        textarea.focus();
        chipsContainer.classList.add('is-visible');
        return;
      }
      
      btn.classList.add('is-loading');
      textarea.classList.add('textarea-ai-loading');
      if (parentField) parentField.classList.add('is-ai-working');
      
      btn.querySelector('span').textContent = 'Sublimation…';
      
      try {
        const res = await fetch('/api/improve-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: val })
        });
        const data = await res.json();
        if (res.ok && data.text) {
          // Instant text update with opacity fade
          textarea.value = data.text;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          const errText = "Impossible de joindre l'IA d'OctoMask pour le moment.";
          alert(errText);
        }
      } catch (e) {
        console.error(e);
        const errText = "Impossible de joindre l'IA d'OctoMask pour le moment.";
        alert(errText);
      } finally {
        btn.classList.remove('is-loading');
        textarea.classList.remove('textarea-ai-loading');
        if (parentField) parentField.classList.remove('is-ai-working');
        btn.querySelector('span').textContent = "Sublimer avec l'IA";
      }
    });
  });
});

