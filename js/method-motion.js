// Entree animee du bloc « Par ou commencer » : declenchee une fois quand le bloc arrive a l'ecran.
(function () {
  var s = document.querySelector('.method');
  if (!s || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  s.classList.add('has-motion');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      s.classList.add('is-live');
      io.disconnect();
    });
  }, { threshold: 0.3 });
  io.observe(s);
})();
