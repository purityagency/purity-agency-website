// Pages détail — reveal au scroll, nav, menu mobile, i18n
const hasHash = !!window.location.hash;
if (history.scrollRestoration) {
  if (!hasHash) history.scrollRestoration = 'manual';
}
if (!hasHash) {
  window.scrollTo(0, 0);
}

window.addEventListener('load', () => {
  if (hasHash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: 1.2,
          ease: 'power3.inOut'
        });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // ─── i18n bootstrap ─────────────────────────────────────────────────────────
  const SUPPORTED_LANGS = ['fr', 'en', 'nl', 'de', 'es', 'pt', 'it', 'pl', 'ru', 'ar', 'zh', 'hi'];

  const applyDict = (dict) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = dict[el.getAttribute('data-i18n')];
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const v = dict[el.getAttribute('data-i18n-aria')];
      if (v != null) el.setAttribute('aria-label', v.replace(/<[^>]+>/g, ''));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const v = dict[el.getAttribute('data-i18n-placeholder')];
      if (v != null) el.setAttribute('placeholder', v.replace(/<[^>]+>/g, ''));
    });
  };

  let _dict = {};

  // Langsel widget (même logique que site.js)
  const langsel = document.getElementById('langsel');
  if (langsel) {
    const dictCache = {};
    const lBtn = document.getElementById('langsel-btn');
    const options = Array.from(langsel.querySelectorAll('[role="option"]'));

    const openMenu  = () => { langsel.classList.add('is-open');    lBtn.setAttribute('aria-expanded', 'true'); };
    const closeMenu = () => { langsel.classList.remove('is-open'); lBtn.setAttribute('aria-expanded', 'false'); };
    lBtn.addEventListener('click', (e) => { e.stopPropagation(); langsel.classList.contains('is-open') ? closeMenu() : openMenu(); });

    const selectLang = async (li, { persist = true } = {}) => {
      const code = li.dataset.lang, flag = li.dataset.flag;
      try {
        if (!dictCache[code]) {
          const res = await fetch(`/i18n/${code}.json`);
          if (!res.ok) throw new Error('fetch ' + res.status);
          dictCache[code] = await res.json();
        }
        _dict = dictCache[code];
        applyDict(_dict);
      } catch (err) {
        console.warn('[i18n]', code, err);
        return;
      }
      options.forEach(o => o.classList.remove('is-active'));
      li.classList.add('is-active');
      const flagImg = lBtn.querySelector('[data-flag] img');
      if (flagImg) flagImg.src = flag;
      lBtn.querySelector('[data-code]').textContent = code.toUpperCase();
      document.documentElement.lang = code;
      document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
      if (persist) { try { localStorage.setItem('purity_lang', code); } catch {} }
      closeMenu();
    };

    options.forEach(li => li.addEventListener('click', () => selectLang(li)));
    document.addEventListener('click', (e) => { if (!langsel.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    // restore saved / auto-detect
    try {
      const saved = localStorage.getItem('purity_lang');
      const detected = (navigator.language || '').slice(0, 2).toLowerCase();
      const preferred = saved || (SUPPORTED_LANGS.includes(detected) ? detected : null);
      if (preferred && preferred !== 'fr') {
        const li = options.find(o => o.dataset.lang === preferred);
        if (li) selectLang(li, { persist: !!saved });
      }
    } catch {}
  } else {
    // pas de widget visible : applique quand même la langue mémorisée
    (async () => {
      try {
        const saved = localStorage.getItem('purity_lang');
        if (!saved || saved === 'fr') return;
        const res = await fetch(`/i18n/${saved}.json`);
        if (!res.ok) return;
        _dict = await res.json();
        applyDict(_dict);
        document.documentElement.lang = saved;
        document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      } catch {}
    })();
  }

  // ─── Tentacules ambiantes ────────────────────────────────────────────────────
  if (window.innerWidth >= 1100) {
    const shouldHaveTentacles = (sec) => {
      const tag = sec.tagName.toLowerCase();
      if (tag === 'nav' || tag === 'header' || tag === 'footer') return false;
      const id = sec.id || '';
      const cl = sec.classList;
      if (id === 'services' || id === 'hero' || id === 'contact' || id === 'nav') return false;
      if (cl.contains('dp-hero') || cl.contains('dp-contact') || cl.contains('dp-statement')) return false;
      if (cl.contains('sec--tentacles')) return false;
      if (sec.querySelector('.ambient-tentacles')) return false;
      return true;
    };
    document.querySelectorAll('.sec, .dp-section, section, header, footer').forEach((sec) => {
      if (!shouldHaveTentacles(sec)) return;
      if (window.getComputedStyle(sec).position === 'static') sec.style.position = 'relative';
      const t = document.createElement('div');
      t.className = 'ambient-tentacles';
      t.setAttribute('aria-hidden', 'true');
      t.innerHTML = `
        <div class="ambient-tentacle ambient-tentacle--left"><div class="ambient-tentacle__float"><div class="ambient-tentacle__inner"></div></div></div>
        <div class="ambient-tentacle ambient-tentacle--right"><div class="ambient-tentacle__float"><div class="ambient-tentacle__inner"></div></div></div>`;
      sec.appendChild(t);
    });
  }

  // ─── GSAP ────────────────────────────────────────────────────────────────────
  if (typeof gsap === 'undefined') {
    console.warn('[detail.js] GSAP absent — animations désactivées.');
    document.querySelectorAll('[data-reveal]').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Tentacules animation
  if (document.querySelector('.ambient-tentacle') && !prefersReduced) {
    gsap.utils.toArray('.ambient-tentacle__float').forEach((el, i) => {
      gsap.to(el, { y: i % 2 === 0 ? '+=25' : '-=25', rotation: i % 2 === 0 ? 3 : -3, duration: 8 + (i % 3), ease: 'sine.inOut', repeat: -1, yoyo: true });
    });
    gsap.utils.toArray('.ambient-tentacle').forEach((t, i) => {
      const parent = t.closest('section, .sec, .dp-section, header, footer');
      if (!parent) return;
      gsap.to(t, { yPercent: i % 2 === 0 ? -12 : 12, rotation: i % 2 === 0 ? '+=3' : '-=3', ease: 'none', scrollTrigger: { trigger: parent, start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
    });
    window.addEventListener('mousemove', (e) => {
      const mx = (e.clientX / window.innerWidth) - 0.5, my = (e.clientY / window.innerHeight) - 0.5;
      gsap.utils.toArray('.ambient-tentacle--left .ambient-tentacle__inner').forEach(el => gsap.to(el, { x: mx * 35, y: my * 40, overwrite: 'auto', duration: 2.2, ease: 'power2.out' }));
      gsap.utils.toArray('.ambient-tentacle--right .ambient-tentacle__inner').forEach(el => gsap.to(el, { x: mx * 35, y: my * -35, overwrite: 'auto', duration: 2.5, ease: 'power2.out' }));
    });
  }

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

  // Reveal au scroll
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue('--d')) || 0;
    if (prefersReduced) { gsap.set(el, { opacity: 1, y: 0 }); return; }
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay,
      scrollTrigger: { trigger: el, start: 'top 92%', toggleActions: 'play none none none', once: true }
    });
  });
  ScrollTrigger.refresh();

  // Parallax hero image
  const heroImg = document.querySelector('.dp-hero__img');
  if (heroImg && !prefersReduced) {
    gsap.fromTo(heroImg, { scale: 1.08 }, {
      scale: 1.16, ease: 'none',
      scrollTrigger: { trigger: '.dp-hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  // TOC actif au scroll
  const tocLinks = gsap.utils.toArray('.dp-toc__link');
  if (tocLinks.length) {
    tocLinks.forEach(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      ScrollTrigger.create({
        trigger: target, start: 'top 40%', end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) { tocLinks.forEach(l => l.classList.remove('is-active')); link.classList.add('is-active'); }
        }
      });
    });
  }

  // Mini-FAQ accordéon
  document.querySelectorAll('.dp-faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const open = q.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.dp-faq__q').forEach(o => o.setAttribute('aria-expanded', 'false'));
      if (!open) q.setAttribute('aria-expanded', 'true');
    });
  });

  // Formulaire de contact (page détail)
  const dForm = document.getElementById('detail-form');
  if (dForm) {
    dForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = dForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = _dict['form.sending'] || 'Envoi…';
      btn.disabled = true;
      const payload = {
        name: dForm.querySelector('#d-name')?.value || '',
        email: dForm.querySelector('#d-email')?.value || '',
        phone: dForm.querySelector('#d-phone')?.value || '',
        activity: dForm.querySelector('#d-activity')?.value || '',
        need: dForm.querySelector('#d-need')?.value || '',
        website_verification: dForm.querySelector('input[name="website_verification"]')?.value || '',
      };
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error('bad status');
        const sentBlock = dForm.querySelector('.dp-form__sent');
        if (sentBlock) sentBlock.style.display = 'block';
        btn.style.display = 'none';
        const note = dForm.querySelector('.dp-form__note');
        if (note) note.style.display = 'none';
        dForm.reset();
      } catch {
        btn.textContent = _dict['form.error'] || 'Erreur — réessayer';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = original; }, 2500);
      }
    });
  }

  // Smooth scroll ancres internes
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

  // Curseur custom
  if (window.matchMedia('(hover: hover)').matches && !prefersReduced) {
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    if (cursor && cursorDot) {
      document.documentElement.classList.add('has-custom-cursor');
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
