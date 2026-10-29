// Fond décoratif de #services : fond statique et léger sans surcharge CPU
(function () {
  var host = document.querySelector('[data-services-bg]');
  if (!host) return;
  host.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden;opacity:0.35';
})();
