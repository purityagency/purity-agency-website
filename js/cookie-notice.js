(() => {
  return;
  // This version has no analytics or advertising tags. The notice is
  // informational only: it must not imply a consent choice where none is needed.
  const key = 'purity-cookie-information-seen';
  try { if (sessionStorage.getItem(key)) return; } catch { return; }
  const notice = document.createElement('aside');
  notice.className = 'cookie-note';
  notice.setAttribute('role', 'status');
  notice.innerHTML = '<p><strong>Fonctionnement du site</strong><span>OctoMask utilise un cookie de session et un stockage temporaire pour garder le fil de votre échange. Aucun cookie publicitaire ni de mesure d’audience n’est actif.</span></p><a href="/cookies.html">En savoir plus</a><button type="button" aria-label="Fermer cette information">×</button>';
  document.body.append(notice);
  notice.querySelector('button').addEventListener('click', () => { try { sessionStorage.setItem(key, '1'); } catch {} notice.remove(); });
})();
