// Bascule les feuilles de style chargées en media="print" (pattern preload
// non-bloquant) vers media="all" une fois téléchargées. Doit rester un
// fichier externe — la CSP du site interdit les gestionnaires inline
// (onload="..." dans le HTML), voir purity-agency-site/server/config.
(function () {
  var links = document.querySelectorAll('link[rel="stylesheet"][media="print"]');
  for (var i = 0; i < links.length; i++) {
    (function (link) {
      if (link.sheet) {
        link.media = 'all';
        return;
      }
      link.addEventListener('load', function () {
        link.media = 'all';
      });
    })(links[i]);
  }
})();
