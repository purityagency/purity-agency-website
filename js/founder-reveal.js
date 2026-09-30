// La citation se révèle au passage de la section, lettre après lettre. Le
// texte original reste intact tant que le script n'a pas amélioré l'affichage.
(function () {
  var quote = document.querySelector('.founder__quote--letters');
  if (!quote) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lowEnd = typeof navigator !== 'undefined' &&
    ((navigator.deviceMemory !== undefined && navigator.deviceMemory <= 2) ||
     (navigator.deviceMemory === undefined && navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4));
  if (reduced || lowEnd) return;

  var parts = quote.querySelectorAll('[data-founder-copy]');
  var letterIndex = 0;

  parts.forEach(function (part) {
    var value = part.textContent;
    // role="text" : les lettres qui composent le mot sont individuellement aria-hidden
    // (ligne plus bas) pour l'effet visuel ; ce role indique aux lecteurs d'ecran de lire
    // aria-label a la place au lieu de descendre dans les enfants caches. Un span sans role
    // n'a pas le droit de porter aria-label (regle aria-prohibited-attr).
    part.setAttribute('role', 'text');
    part.setAttribute('aria-label', value);
    part.textContent = '';
    value.split(/(\s+)/).forEach(function (fragment) {
      if (/^\s+$/.test(fragment)) {
        part.appendChild(document.createTextNode(fragment));
        return;
      }
      var word = document.createElement('span');
      word.className = 'founder__word';
      Array.from(fragment).forEach(function (character) {
        var letter = document.createElement('span');
        letter.className = 'founder__letter';
        letter.style.setProperty('--i', letterIndex++);
        letter.setAttribute('aria-hidden', 'true');
        letter.textContent = character;
        word.appendChild(letter);
      });
      part.appendChild(word);
    });
  });

  document.documentElement.classList.add('has-founder-reveal');
  var letters = quote.querySelectorAll('.founder__letter');
  var frame = null;
  var active = false;

  function clamp(value) {
    return Math.max(0, Math.min(1, value));
  }

  function paint() {
    frame = null;
    if (!active) return;
    var rect = quote.getBoundingClientRect();
    var start = window.innerHeight * 0.88;
    var end = window.innerHeight * 0.28;
    var progress = clamp((start - rect.top) / (start - end));
    var last = Math.max(letters.length - 1, 1);

    letters.forEach(function (letter, index) {
      // Chaque caractère a une petite fenêtre de lecture : le texte accompagne
      // le scroll au lieu de se déclencher indépendamment de lui.
      var offset = (index / last) * 0.78;
      var local = clamp((progress - offset) / 0.22);
      letter.style.opacity = (0.11 + local * 0.89).toFixed(3);
      letter.style.transform = 'translateY(' + ((1 - local) * 0.045).toFixed(3) + 'em)';
    });
  }

  function requestPaint() {
    if (frame === null) frame = requestAnimationFrame(paint);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      active = entry.isIntersecting;
      if (active) requestPaint();
    });
  }, { rootMargin: '24% 0px 24% 0px' });
  observer.observe(quote);
  window.addEventListener('scroll', requestPaint, { passive: true });
  window.addEventListener('resize', requestPaint, { passive: true });
})();
