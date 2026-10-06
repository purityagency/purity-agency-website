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
  // Mesures du mot "ramener" dans le film (pixels source, image posee) :
  // bords gauche/droit de l'encre et ligne de base des lettres a fond plat.
  const WORD_LEFT = 313;
  const WORD_RIGHT = 971;
  const WORD_BASELINE = 430;
  // Bord droit du mot, image par image, mesure sur la source : arrivee
  // (images 4 a 66) puis sortie (images 189 a 221). Entre les deux, le mot est
  // pose ; avant et apres, il est hors champ. Le texte suit ce bord : il est
  // pousse par le mot a l'arrivee et le suit quand il repart — jamais de trou.
  const ARRIVAL = [22, 43, 65, 87, 111, 136, 162, 188, 215, 243, 271, 299, 327, 355, 383, 412, 439, 467, 494, 521, 546, 572, 597, 621, 644, 667, 689, 709, 729, 749, 767, 785, 801, 817, 831, 844, 857, 868, 878, 887, 897, 905, 912, 919, 925, 930, 935, 940, 944, 948, 951, 954, 957, 959, 961, 963, 964, 965, 966, 967, 968, 969, 970];
  const EXIT = [966, 959, 948, 934, 918, 899, 879, 856, 833, 807, 780, 752, 723, 693, 661, 627, 595, 561, 526, 489, 453, 417, 381, 343, 305, 267, 229, 191, 155, 119, 83, 45, 11];
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
  let layout = { mediaLeft: 0, scale: 0, gap: 0, centered: 0, delivered: 0 };
  const probe = document.createElement('span');

  function frameRight(i) {
    if (i < 4) return 0;
    if (i <= 66) return ARRIVAL[i - 4];
    if (i <= 188) return WORD_RIGHT;
    if (i <= 221) return EXIT[i - 189];
    return 0;
  }

  function wordRight(time) {
    const f = time * FPS;
    const i = Math.floor(f);
    const a = frameRight(i);
    return a + (frameRight(i + 1) - a) * (f - i);
  }

  function updateClients(time) {
    const { mediaLeft, scale, gap, centered, delivered } = layout;
    let x = delivered;
    if (!reduced.matches && !gaveUp) {
      // L'image affichee peut avoir une image d'avance ou de retard sur
      // currentTime : on se cale sur la position la plus a droite du mot dans
      // cette fenetre, pour que le texte ne le touche jamais (sortie rapide).
      const right = Math.max(wordRight(time - 2 / FPS), wordRight(time - 1 / FPS), wordRight(time), wordRight(time + 1 / FPS));
      x = Math.min(delivered, Math.max(centered, mediaLeft + right * scale + gap));
    }
    clients.style.transform = `translate3d(${x - delivered}px, 0, 0)`;
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
    // Keep scaling the native frame on wide screens so its left edge stays
    // outside the viewport instead of revealing an artificial blank margin.
    // On desktop, keep the baked-in word at the same optical size as the
    // General Sans words beside it. Mobile keeps its dedicated composition.
    const width = Math.min(heroBox.width * (mobile ? .615 : .44), sourceWidth);
    const scale = width / sourceWidth;
    // Desktop gets a deliberate breathing space after the baked-in word.
    // The mobile composition keeps its compact native spacing.
    const gap = mobile
      ? Math.max(7, Math.min(20, width * .018))
      : Math.max(18, Math.min(32, width * .04));
    const wordStart = WORD_LEFT * scale;
    // Mesurer la largeur naturelle (non contrainte) avant d'eventuellement
    // appliquer plus bas une limite de largeur mobile — sinon chaque appel
    // repartirait d'une largeur deja retrecie par le precedent.
    clients.style.translate = 'none';
    clients.style.maxWidth = 'none';
    clients.style.whiteSpace = '';
    delivery.style.marginBottom = '';
    const clientsRectNatural = clients.getBoundingClientRect();
    const clientsWidth = clientsRectNatural.width;
    const clientsLineHeight = clientsRectNatural.height;
    // Ligne de base du texte HTML (sonde de hauteur nulle posee sur la ligne
    // de base de "des clients,") : celle du mot incruste s'y aligne au pixel.
    const mediaTop = probe.getBoundingClientRect().top - heroBox.top - WORD_BASELINE * scale;
    const phraseEnd = WORD_RIGHT * scale + gap + clientsWidth;
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
    const clientsHeroLeft = mediaLeft + WORD_RIGHT * scale + gap;
    clients.style.left = `${clientsHeroLeft - line.left + heroBox.left}px`;
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
    layout = { mediaLeft, scale, gap, centered: (heroBox.width - clientsWidth) / 2, delivered: clientsHeroLeft };
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
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'display:inline-block;width:0;height:0';
  clients.prepend(probe);
  const resize = new ResizeObserver(measure);
  resize.observe(hero);
  resize.observe(hero.querySelector('.hero__inner') || delivery);
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
