(() => {
  const hero = document.querySelector('.hero');
  const video = hero?.querySelector('.hero__source');
  const posters = hero?.querySelectorAll('.hero__poster');
  const delivery = hero?.querySelector('.hero__delivery');
  const clients = hero?.querySelector('.hero__delivered-clients');
  const toggle = hero?.querySelector('.hero__motion-toggle');
  if (!hero || !video || !posters?.length || !delivery || !clients || !toggle) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let userPaused = false;
  let started = false;
  let seeked = false;
  let frameId;
  let centeredOffset = 0;

  const smooth = (value) => {
    const t = Math.max(0, Math.min(1, value));
    return t * t * t * (t * (t * 6 - 15) + 10);
  };

  function updateClients(time) {
    let delivered = 0;

    // The copy moves once, shortly before the tentacles finish placing the
    // word. It stays put during the whole scene, then recentres only after
    // the final purple fragment has left the frame at roughly 9.2 seconds.
    if (time >= .18 && time < 1.38) {
      delivered = smooth((time - .18) / 1.2);
    } else if (time >= 1.38 && time < 9.22) {
      delivered = 1;
    } else if (time >= 9.22 && time < 9.82) {
      delivered = 1 - smooth((time - 9.22) / .6);
    }

    if (reduced.matches) delivered = 1;
    clients.style.transform = `translate3d(${centeredOffset * (1 - delivered)}px, 0, 0)`;
  }

  function stopFrameLoop() {
    if (frameId === undefined) return;
    if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frameId);
    else cancelAnimationFrame(frameId);
    frameId = undefined;
  }

  function frame() {
    frameId = undefined;
    updateClients(video.currentTime);
    if (!video.paused) frameId = video.requestVideoFrameCallback
      ? video.requestVideoFrameCallback(frame) : requestAnimationFrame(frame);
  }

  function measure() {
    const heroBox = hero.getBoundingClientRect();
    const line = delivery.getBoundingClientRect();
    const sourceWidth = video.videoWidth || 1280;
    const sourceHeight = video.videoHeight || 720;
    const mobile = matchMedia('(max-width: 767px)').matches;
    // Correction optique : la ligne de base du mot incrusté est très
    // légèrement plus haute que celle de General Sans sur desktop.
    const baselineNudge = mobile ? -3 : -2;
    // Keep scaling the native frame on wide screens so its left edge stays
    // outside the viewport instead of revealing an artificial blank margin.
    // Le mot déjà intégré au film doit rester légèrement plus petit que la
    // typographie HTML, sinon il paraît gonflé au moment où il est déposé.
    // On desktop, keep the baked-in word at the same optical size as the
    // General Sans words beside it. Mobile keeps its dedicated composition.
    const width = Math.min(heroBox.width * (mobile ? .615 : .44), sourceWidth);
    const scale = width / sourceWidth;
    const mediaBaselineNudge = mobile ? 0 : 10;
    const top = line.top - heroBox.top + Math.min(line.height * .24, 45) - 309 * scale + mediaBaselineNudge;
    // The baked word uses the same baseline calculation as the adjacent copy.
    // Keep the HTML copy fixed: only the media itself is positioned here.
    const mediaTop = top;
    // Desktop gets a deliberate breathing space after the baked-in word.
    // The mobile composition keeps its compact native spacing.
    const gap = mobile
      ? Math.max(7, Math.min(20, width * .018))
      : Math.max(18, Math.min(32, width * .04));
    const wordStart = width * (310 / 1280);
    // Mesurer la largeur naturelle (non contrainte) avant d'eventuellement
    // appliquer plus bas une limite de largeur mobile — sinon chaque appel
    // repartirait d'une largeur deja retrecie par le precedent.
    clients.style.maxWidth = 'none';
    clients.style.whiteSpace = '';
    delivery.style.marginBottom = '';
    const clientsRectNatural = clients.getBoundingClientRect();
    const clientsWidth = clientsRectNatural.width;
    const clientsLineHeight = clientsRectNatural.height;
    const phraseEnd = width * (970 / 1280) + gap + clientsWidth;
    // The tentacle is designed to enter from outside the viewport: never
    // leave a white gutter between the film and the left edge of the hero.
    let mediaLeft = Math.min(0, (heroBox.width - wordStart - phraseEnd) / 2);
    // Sur mobile, "des clients, pas juste" peut passer a la ligne (contrairement
    // a desktop qui tient sur une seule ligne) : centrer le mot+la phrase sur une
    // largeur qui n'a plus besoin de tenir ensemble pousse mediaLeft trop loin a
    // gauche et rogne le mot lui-meme (le "r" de "ramener" disparaissait). Seule
    // la tentacule doit deborder hors cadre, jamais le mot.
    if (mobile) mediaLeft = Math.max(mediaLeft, -(wordStart - 6));
    for (const media of [video, ...posters]) {
      media.style.width = `${width}px`;
      media.style.height = `${sourceHeight * scale}px`;
      media.style.left = `${mediaLeft}px`;
      media.style.top = `${mediaTop}px`;
    }
    // Coordinates measured in the 1280 x 720 source at the deposited frame.
    const clientsHeroLeft = mediaLeft + width * (970 / 1280) + gap;
    clients.style.left = `${clientsHeroLeft - line.left + heroBox.left}px`;
    // 328 is the optical baseline offset measured on the baked word.
    clients.style.top = `${top + 328 * scale - line.top + heroBox.top + baselineNudge}px`;
    // "des clients, pas juste" peut deborder du cadre sur un mobile etroit : la
    // phrase n'a jamais ete pensee pour partager la ligne avec le mot incruste
    // a cette largeur. Si besoin, autoriser le retour a la ligne plutot que de
    // laisser le dernier mot (ex. "juste") depasser le bord de l'ecran.
    if (mobile) {
      const available = heroBox.width - clientsHeroLeft - 4;
      if (clientsWidth > available) {
        clients.style.maxWidth = `${Math.max(80, available)}px`;
        clients.style.whiteSpace = 'normal';
        // La phrase passe alors sur 2 lignes : sa boite grandit, mais comme elle
        // est en position absolue, la ligne "exister." suivante ne le sait pas
        // et remonterait dessus. On pousse le conteneur du montant exact en trop.
        const wrappedHeight = clients.getBoundingClientRect().height;
        const baseMarginBottom = parseFloat(getComputedStyle(delivery).marginBottom) || 0;
        delivery.style.marginBottom = `${baseMarginBottom + Math.max(0, wrappedHeight - clientsLineHeight)}px`;
      }
    }
    centeredOffset = (heroBox.width - clientsWidth) / 2 - (mediaLeft + width * (970 / 1280) + gap);
    // 0.08 : le film reste hors cadre (pas de mot, pas de tentacule) tant que la
    // lecture n'a pas commence. Le mot "ramener" ne doit jamais etre visible avant
    // que l'animation ne l'apporte — voir le poster "blank" plus bas.
    updateClients(seeked ? video.currentTime : 0.08);
  }

  // L'animation joue aussi sur mobile desormais. Seul un reglage explicite
  // d'economie de donnees ou une connexion tres lente (2G) la desactive :
  // dans ce cas le poster "settled" prend le relais, comme pour reduced-motion.
  function lowData() {
    const c = navigator.connection;
    return !!(c && (c.saveData || /2g/.test(c.effectiveType || '')));
  }

  // Filet de securite mobile : si la video ne demarre pas (seeked jamais recu,
  // lecture silencieusement bloquee, reseau lent), le poster "blank" resterait
  // affiche sans fin et le mot ne serait jamais apporte. Apres 3 s sans
  // 'playing', on montre le poster "settled" (mot deja depose) comme repli.
  let fallbackTimer;
  function armFallback() {
    clearTimeout(fallbackTimer);
    fallbackTimer = setTimeout(() => {
      if (hero.classList.contains('hero--ready')) return;
      hero.classList.remove('hero--ready');
      hero.classList.add('hero--static');
      updateClients(4.4);
    }, 3000);
  }

  function sync() {
    const persistent = reduced.matches || lowData();
    const shouldPlay = visible && !document.hidden && !persistent && !userPaused;
    if (!shouldPlay) {
      video.pause();
      stopFrameLoop();
      if (persistent) {
        hero.classList.remove('hero--ready');
        hero.classList.add('hero--static');
        updateClients(4.4);
      }
      return;
    }
    if (!video.src) video.src = video.dataset.src;
    armFallback();
    if (!seeked) return;
    video.play().then(() => { toggle.hidden = false; }).catch(() => {
      // Lecture bloquee (rare, hors geste utilisateur) : le poster "blank" ne doit
      // pas rester affiche sans fin (le mot ne serait jamais apporte). On bascule
      // sur le poster "settled" pour montrer malgre tout le message complet.
      hero.classList.remove('hero--ready');
      hero.classList.add('hero--static');
      updateClients(4.4);
      toggle.hidden = true;
    });
  }

  video.addEventListener('loadedmetadata', () => {
    measure();
    if (!started) {
      started = true;
      // Hors cadre : juste apres la boucle (la queue 9.22-10s est deja vide de
      // mot et de tentacule), donc la toute premiere chose jouee est l'arrivee
      // du mot — jamais le mot deja depose. 0 pile peut ne pas declencher
      // 'seeked' si le navigateur y est deja ; une valeur non nulle le garantit.
      video.currentTime = 0.08;
    }
  });
  video.addEventListener('seeked', () => {
    if (!seeked) {
      seeked = true;
      sync();
    }
  });
  video.addEventListener('playing', () => {
    clearTimeout(fallbackTimer);
    hero.classList.add('hero--ready');
    hero.classList.remove('hero--static');
    if (frameId === undefined) frame();
  });
  video.addEventListener('error', () => {
    // Le film ne jouera jamais : memes raisons que le catch() de play() plus haut.
    hero.classList.remove('hero--ready');
    hero.classList.add('hero--static');
    toggle.hidden = true;
    stopFrameLoop();
    updateClients(4.4);
  });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.textContent = userPaused ? 'Reprendre l’animation' : 'Mettre l’animation en pause';
    sync();
  });
  new ResizeObserver(measure).observe(hero);
  document.fonts.ready.then(measure);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  }, { threshold: .08 }).observe(hero);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  navigator.connection?.addEventListener('change', sync);
  measure();
  sync();
})();
