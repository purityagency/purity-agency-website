// Force page to load at the top (Hero) on refresh, sans animation
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
// Si l'URL contient une ancre (#services…) au rechargement, on la retire pour repartir du hero
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}
const _jumpTop = () => window.scrollTo(0, 0);
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
  _jumpTop();
  requestAnimationFrame(() => { html.style.scrollBehavior = prev; });
  _dismissLoader();
});

document.addEventListener('DOMContentLoaded', () => {

  // --- GSAP Setup ---
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // --- 2. Number count-up : stats bento ---
  const countEls = [
    ...document.querySelectorAll('.bento__val'),
  ];
  countEls.forEach(el => {
    // Extrait le nombre, garde le reste (€, h, ×, small...) intact
    const match = el.textContent.match(/(\d[\d\s ]*)/);
    if (!match) return;
    const target = parseInt(match[1].replace(/[\s ]/g, ''), 10);
    if (isNaN(target)) return;
    const fullHTML = el.innerHTML;
    const numStr = match[1];
    const proxy = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(proxy, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            const current = Math.round(proxy.v).toString();
            el.innerHTML = fullHTML.replace(numStr.trim(), current);
          },
          onComplete: () => { el.innerHTML = fullHTML; }
        });
      }
    });
  });

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
    btn.textContent = 'Envoi...';
    btn.disabled = true;
    const payload = {
      name: form.querySelector('#f-name')?.value || '',
      email: form.querySelector('#f-email')?.value || '',
      phone: form.querySelector('#f-phone')?.value || '',
      activity: form.querySelector('#f-activity')?.value || '',
      need: form.querySelector('#f-need')?.value || '',
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('bad status');
      form.querySelector('.form__sent').style.display = 'block';
      btn.style.display = 'none';
      form.reset();
    } catch (err) {
      btn.textContent = 'Erreur — réessayer';
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
          }
          targetPane.style.display = 'block';
          targetPane.classList.add('is-active');
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

              // Display target pane
              targetPane.style.display = 'block';
              targetPane.classList.add('is-active');

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
  let chatLeadSent = false; // un seul lead capturé par conversation

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
        chatMemory.push({ role: 'model', text: data.reply });
      } else {
        addMsg("Désolé, je rencontre un problème de connexion.", 'sys');
      }
    } catch (err) {
      removeTypingIndicator();
      addMsg("Désolé, une erreur s'est produite.", 'sys');
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
          const intro = "Salut 👋 Moi c'est OctoMask, de l'équipe Purity. Vous faites quoi comme métier ? Je vous dis vite fait ce qu'on pourrait améliorer pour vous.";
          addMsg(intro, 'sys');
          chatMemory.push({ role: 'model', text: intro });

          // Suggestions orientées conversion
          const suggestions = [
            "Je veux un site pour mon activité",
            "Combien coûte un site ?",
            "Automatiser mon WhatsApp / mes RDV",
            "Être trouvé sur Google"
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
});
