// Revelation du manifeste au defilement : chaque mot passe du gris a l'encre
// a mesure que le bloc traverse l'ecran.
//
// Deux implementations. Les navigateurs qui ont les animations pilotees par
// le defilement (animation-timeline) font tout en CSS, sur le thread de
// composition. Les autres recoivent une progression calculee par
// IntersectionObserver plus requestAnimationFrame, uniquement pendant que le
// bloc est visible.
(function () {
  var blocks = document.querySelectorAll('[data-reveal]');
  if (!blocks.length) return;

  var steps = document.querySelectorAll('[data-reveal-step]');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lowEnd = typeof navigator !== 'undefined' &&
               navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;

  // Sans animation, le texte doit rester pleinement lisible : on le passe en
  // encre plutot que de le laisser gris.
  if (reduced || lowEnd) {
    blocks.forEach(function (b) { b.classList.add('is-done'); });
    steps.forEach(function (s) { s.classList.add('is-in'); });
    return;
  }

  document.documentElement.classList.add('has-scroll-reveal');

  // Decoupe en mots. Les espaces sont conserves hors des spans pour que la
  // selection et la copie du texte restent normales.
  blocks.forEach(function (block) {
    var words = block.textContent.trim().split(/\s+/);
    block.textContent = '';
    words.forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'reveal__w';
      span.style.setProperty('--i', i);
      span.textContent = w;
      block.appendChild(span);
      if (i < words.length - 1) block.appendChild(document.createTextNode(' '));
    });
    block.style.setProperty('--count', words.length);
    block.classList.add('is-split');
  });

  function initSteps() {
    if (!steps.length) return;
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io2.unobserve(e.target);
      });
    }, { threshold: 0.25 });
    steps.forEach(function (s, i) {
      s.style.setProperty('--d', i * 70 + 'ms');
      io2.observe(s);
    });
  }

  var native = CSS.supports('animation-timeline', 'view()');
  if (native) {
    blocks.forEach(function (b) { b.classList.add('is-native'); });
    initSteps();
    return;
  }

  var active = new Set();
  var raf = null;

  function tick() {
    active.forEach(function (block) {
      var r = block.getBoundingClientRect();
      // 0 quand le bloc entre par le bas, 1 quand il atteint le tiers haut.
      var from = window.innerHeight * 0.88;
      var to = window.innerHeight * 0.42;
      var p = (from - r.top) / (from - to);
      block.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
    });
    raf = active.size ? requestAnimationFrame(tick) : null;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) active.add(e.target);
      else active.delete(e.target);
    });
    if (active.size && raf === null) raf = requestAnimationFrame(tick);
  }, { rootMargin: '20% 0px 20% 0px' });

  blocks.forEach(function (b) { io.observe(b); });

  // Blocs secondaires : simple entree a l'apparition, sans suivi continu.
  initSteps();
})();
