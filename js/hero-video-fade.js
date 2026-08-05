// Fait apparaître la vidéo de fond du hero en fondu une fois qu'elle peut
// réellement jouer — l'image statique (peinte immédiatement, élément LCP
// réel) reste seule visible jusque-là. Fichier externe requis par la CSP
// du site (pas de gestionnaire inline).
(function () {
  var video = document.querySelector('.hero__bg-video');
  if (!video) return;

  function reveal() {
    video.classList.add('is-ready');
  }

  if (video.readyState >= 3) {
    reveal();
  } else {
    video.addEventListener('playing', reveal, { once: true });
  }
})();
