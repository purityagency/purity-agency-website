(() => {
  const hero = document.querySelector('.hero');
  const video = hero?.querySelector('.hero__source');
  const poster = hero?.querySelector('.hero__poster');
  const delivery = hero?.querySelector('.hero__delivery');
  const clients = hero?.querySelector('.hero__delivered-clients');
  const toggle = hero?.querySelector('.hero__motion-toggle');
  if (!hero || !video || !poster || !delivery || !clients || !toggle) return;

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
    const clientsWidth = clients.getBoundingClientRect().width;
    const phraseEnd = width * (970 / 1280) + gap + clientsWidth;
    // The tentacle is designed to enter from outside the viewport: never
    // leave a white gutter between the film and the left edge of the hero.
    const mediaLeft = Math.min(0, (heroBox.width - wordStart - phraseEnd) / 2);
    for (const media of [video, poster]) {
      media.style.width = `${width}px`;
      media.style.height = `${sourceHeight * scale}px`;
      media.style.left = `${mediaLeft}px`;
      media.style.top = `${mediaTop}px`;
    }
    // Coordinates measured in the 1280 x 720 source at the deposited frame.
    clients.style.left = `${mediaLeft + width * (970 / 1280) + gap - line.left + heroBox.left}px`;
    // 328 is the optical baseline offset measured on the baked word.
    clients.style.top = `${top + 328 * scale - line.top + heroBox.top + baselineNudge}px`;
    centeredOffset = (heroBox.width - clientsWidth) / 2 - (mediaLeft + width * (970 / 1280) + gap);
    updateClients(seeked ? video.currentTime : 4.4);
  }

  function sync() {
    const shouldPlay = visible && !document.hidden && !reduced.matches && !userPaused;
    if (!shouldPlay) {
      video.pause();
      stopFrameLoop();
      if (reduced.matches) {
        hero.classList.remove('hero--ready');
        updateClients(4.4);
      }
      return;
    }
    if (!video.src) video.src = video.dataset.src;
    if (!seeked) return;
    video.play().then(() => { toggle.hidden = false; }).catch(() => {
      hero.classList.remove('hero--ready');
      toggle.hidden = true;
    });
  }

  video.addEventListener('loadedmetadata', () => {
    measure();
    if (!started) {
      started = true;
      video.currentTime = 4.4;
    }
  });
  video.addEventListener('seeked', () => {
    if (!seeked) {
      seeked = true;
      sync();
    }
  });
  video.addEventListener('playing', () => {
    hero.classList.add('hero--ready');
    if (frameId === undefined) frame();
  });
  video.addEventListener('error', () => {
    hero.classList.remove('hero--ready');
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
  measure();
  sync();
})();
