(() => {
  const hero = document.querySelector('.hero');
  const video = hero?.querySelector('.hero__source');
  const canvas = hero?.querySelector('.hero__canvas');
  const posters = hero?.querySelectorAll('.hero__poster');
  const delivery = hero?.querySelector('.hero__delivery');
  const clients = hero?.querySelector('.hero__delivered-clients');
  const toggle = hero?.querySelector('.hero__motion-toggle');
  if (!hero || !video || !canvas || !posters?.length || !delivery || !clients || !toggle) return;

  // Film "stacked alpha" : couleur en haut (1280x720), 16 px de marge noire,
  // puis la transparence en niveaux de gris (1280x720). Recompose en WebGL.
  // Pourquoi pas un WebM VP9 transparent : Safari (tous les iPhone) ignore son
  // canal alpha et affiche le fond gris clair encode sous la transparence —
  // la "case grise" — ou ne le lit pas du tout. Ce format marche partout.
  const FRAME_W = 1280;
  const FRAME_H = 720;
  const PAD = 16;
  const FPS = 24;
  const SOURCES = [
    ['/assets/hero-tentacle-stacked-av1.mp4', 'video/mp4; codecs="av01.0.08M.08"', 1.98e6],
    ['/assets/hero-tentacle-stacked-hevc.mp4', 'video/mp4; codecs="hvc1.1.6.L120.90"', 2.36e6],
    ['/assets/hero-tentacle-stacked-h264.mp4', 'video/mp4; codecs="avc1.640028"', 2.39e6],
  ];

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  let userPaused = false;
  let gaveUp = false;
  let ready = false;
  let loading;
  let gl;
  let frameId;
  let lastFrame = -1;
  let fallbackTimer;
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

    if (reduced.matches || gaveUp) delivered = 1;
    clients.style.transform = `translate3d(${centeredOffset * (1 - delivered)}px, 0, 0)`;
  }

  function initGL() {
    const options = { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: true, powerPreference: 'low-power' };
    const ctx = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
    if (!ctx) return null;
    const H = FRAME_H * 2 + PAD;
    const vs = `attribute vec2 p;varying vec2 uv;void main(){uv=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}`;
    // Seuil de 8/255 sur l'alpha : efface les residus de compression (pixels
    // quasi transparents) sans toucher aux bords reels de la tentacule.
    const fs = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D f;varying vec2 uv;
void main(){
  vec3 c=texture2D(f,vec2(uv.x,uv.y*${FRAME_H}.0/${H}.0)).rgb;
  float a=texture2D(f,vec2(uv.x,(${FRAME_H + PAD}.0+uv.y*${FRAME_H}.0)/${H}.0)).r;
  a=clamp((a-.031)/.969,0.,1.);
  gl_FragColor=vec4(c*a,a);
}`;
    const program = ctx.createProgram();
    for (const [type, src] of [[ctx.VERTEX_SHADER, vs], [ctx.FRAGMENT_SHADER, fs]]) {
      const shader = ctx.createShader(type);
      ctx.shaderSource(shader, src);
      ctx.compileShader(shader);
      if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) return null;
      ctx.attachShader(program, shader);
    }
    ctx.linkProgram(program);
    if (!ctx.getProgramParameter(program, ctx.LINK_STATUS)) return null;
    ctx.useProgram(program);
    ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), ctx.STATIC_DRAW);
    const loc = ctx.getAttribLocation(program, 'p');
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
    ctx.bindTexture(ctx.TEXTURE_2D, ctx.createTexture());
    for (const [k, v] of [[ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE], [ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE], [ctx.TEXTURE_MIN_FILTER, ctx.NEAREST], [ctx.TEXTURE_MAG_FILTER, ctx.NEAREST]]) {
      ctx.texParameteri(ctx.TEXTURE_2D, k, v);
    }
    canvas.width = FRAME_W;
    canvas.height = FRAME_H;
    ctx.viewport(0, 0, FRAME_W, FRAME_H);
    return ctx;
  }

  function draw() {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function stopFrameLoop() {
    if (frameId === undefined) return;
    cancelAnimationFrame(frameId);
    frameId = undefined;
  }

  function frame() {
    frameId = undefined;
    if (video.readyState >= 2 && gl) {
      // N'envoyer au GPU qu'une fois par image du film (24/s), pas a 60 Hz.
      const index = Math.floor(video.currentTime * FPS);
      if (index !== lastFrame) {
        lastFrame = index;
        draw();
        if (!ready) {
          ready = true;
          clearTimeout(fallbackTimer);
          hero.classList.add('hero--ready');
          hero.classList.remove('hero--static');
          toggle.hidden = false;
        }
      }
    }
    updateClients(video.currentTime);
    if (!video.paused) frameId = requestAnimationFrame(frame);
  }

  // Repli definitif : le poster "settled" (mot deja depose) remplace
  // l'animation. Jamais de bascule tardive vers le film ensuite, sinon le mot
  // disparaitrait sous les yeux du visiteur avant d'etre rapporte.
  function goStatic() {
    gaveUp = true;
    clearTimeout(fallbackTimer);
    stopFrameLoop();
    video.pause();
    video.removeAttribute('src');
    video.load();
    hero.classList.remove('hero--ready');
    hero.classList.add('hero--static');
    toggle.hidden = true;
    updateClients(4.4);
  }

  async function pickSource() {
    const playable = SOURCES.filter(([, type]) => video.canPlayType(type));
    if (!playable.length) return null;
    // Preferer un decodage materiel (economie de batterie, pas de saccades sur
    // les Android d'entree de gamme) quand le navigateur sait le dire.
    if (navigator.mediaCapabilities?.decodingInfo) {
      try {
        // Jamais plus d'une seconde d'attente : sans reponse, premier codec lisible.
        const infos = await Promise.race([
          Promise.all(playable.map(([, contentType, bitrate]) => navigator.mediaCapabilities.decodingInfo({
            type: 'file',
            video: { contentType, width: FRAME_W, height: FRAME_H * 2 + PAD, bitrate, framerate: FPS },
          }))),
          new Promise((_, reject) => setTimeout(reject, 1000)),
        ]);
        const best = playable.find((_, i) => infos[i].supported && infos[i].powerEfficient)
          || playable.find((_, i) => infos[i].supported && infos[i].smooth);
        if (best) return best[0];
      } catch {}
    }
    return playable[0][0];
  }

  // L'animation joue aussi sur mobile. Seul un reglage explicite d'economie de
  // donnees ou une connexion tres lente (2G) la desactive.
  function lowData() {
    const c = navigator.connection;
    return !!(c && (c.saveData || /2g/.test(c.effectiveType || '')));
  }

  function play() {
    // Safari n'autorise l'autoplay qu'a partir d'une tache distincte.
    setTimeout(() => {
      if (gaveUp) return;
      video.play().catch(() => {
        // Lecture refusee (mode economie d'energie iOS, autoplay bloque) : le
        // message complet doit rester lisible.
        if (!ready) goStatic();
        else toggle.hidden = true;
      });
    }, 0);
  }

  function sync() {
    if (gaveUp) return;
    if (reduced.matches || lowData()) {
      goStatic();
      return;
    }
    const shouldPlay = visible && !document.hidden && !userPaused;
    if (!shouldPlay) {
      video.pause();
      stopFrameLoop();
      return;
    }
    if (!gl) {
      gl = initGL();
      if (!gl) {
        goStatic();
        return;
      }
    }
    if (!loading) {
      // Le film ne doit jamais laisser le titre ampute de son mot : sans
      // premiere image affichee apres 4 s, on passe au repli statique.
      fallbackTimer = setTimeout(() => { if (!ready) goStatic(); }, 4000);
      loading = pickSource().then((src) => {
        if (gaveUp) return;
        if (!src) {
          goStatic();
          return;
        }
        video.src = src;
        sync();
      });
      return;
    }
    if (video.getAttribute('src')) play();
  }

  function measure() {
    const heroBox = hero.getBoundingClientRect();
    const line = delivery.getBoundingClientRect();
    const sourceWidth = FRAME_W;
    const sourceHeight = FRAME_H;
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
    for (const media of [canvas, ...posters]) {
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
    // Avant lecture, le film est a sa premiere image (vide : ni mot ni
    // tentacule). Le mot "ramener" ne doit jamais etre visible avant que
    // l'animation ne l'apporte.
    updateClients(gaveUp ? 4.4 : video.currentTime);
  }

  video.addEventListener('playing', () => {
    if (frameId === undefined) frame();
  });
  video.addEventListener('error', () => {
    if (video.getAttribute('src') && !ready) goStatic();
  });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    goStatic();
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
