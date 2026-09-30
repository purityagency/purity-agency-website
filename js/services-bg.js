/* Fond animé de #services : formes épaisses aux bouts arrondis qui dérivent
   doucement et se déforment (repoussées + écrasées) au passage du curseur. */
(function () {
  var host = document.querySelector('[data-services-bg]');
  if (!host) return;
  var section = host.parentElement;
  var NS = 'http://www.w3.org/2000/svg';
  var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Formes en coordonnées locales (centrées sur 0,0). w = épaisseur du trait, rect = forme pleine.
  var TYPES = {
    capsule: { d: 'M0 -150L0 150', w: 110 },
    long: { d: 'M-210 0L210 0', w: 100 },
    hook: { d: 'M-90 -150V40Q-90 140 10 140Q100 140 100 60', w: 100 },
    squiggle: { d: 'M-130 -90C-130 -165 0 -165 0 -90S130 -20 130 55', w: 92 },
    ell: { d: 'M-120 -120V100H120', w: 100 },
    ushape: { d: 'M-100 -110V30Q-100 130 0 130Q100 130 100 30V-110', w: 95 },
    pill: { d: 'M-34 0H34', w: 56 },
    dot: { d: 'M0 0h0.01', w: 84 },
    block: { rect: [-95, -80, 190, 160, 44] },
    slab: { rect: [-190, -100, 380, 200, 70] }
  };
  // type, x, y (fractions de la section), rotation°, échelle
  var LAYOUT = [
    ['capsule', 0.05, 0.07, 0, 1.15], ['capsule', 0.19, 0.10, 0, 1.05], ['hook', 0.36, 0.06, 8, 0.9],
    ['slab', 0.86, 0.09, -8, 1.05], ['long', 0.70, 0.03, 20, 0.9], ['dot', 0.55, 0.13, 0, 0.7],
    ['squiggle', 0.10, 0.34, 20, 1.15], ['block', 0.95, 0.30, 0, 1.0], ['pill', 0.27, 0.30, 30, 0.9],
    ['ushape', 0.06, 0.58, 10, 1.1], ['dot', 0.30, 0.46, 0, 0.8], ['ell', 0.92, 0.52, 0, 1.0],
    ['capsule', 0.04, 0.84, -6, 1.25], ['long', 0.16, 0.96, 8, 1.0], ['block', 0.27, 0.82, 10, 0.9],
    ['dot', 0.44, 0.90, 0, 0.95], ['hook', 0.62, 0.94, 190, 0.95], ['long', 0.84, 0.80, -40, 1.2],
    ['ushape', 0.96, 0.95, 0, 1.0], ['squiggle', 0.50, 0.70, -10, 0.85], ['dot', 0.74, 0.66, 0, 0.6]
  ];

  var svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  // Avant l'arrivée de la feuille de style différée : le calque ne doit jamais pousser la mise en page.
  section.style.position = 'relative';
  host.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden';
  host.appendChild(svg);

  var shapes = LAYOUT.map(function (item, i) {
    var t = TYPES[item[0]];
    var g = document.createElementNS(NS, 'g');
    var el = document.createElementNS(NS, t.rect ? 'rect' : 'path');
    if (t.rect) {
      el.setAttribute('x', t.rect[0]); el.setAttribute('y', t.rect[1]);
      el.setAttribute('width', t.rect[2]); el.setAttribute('height', t.rect[3]);
      el.setAttribute('rx', t.rect[4]); el.setAttribute('fill', '#7b3bd6');
    } else {
      el.setAttribute('d', t.d); el.setAttribute('fill', 'none');
      el.setAttribute('stroke', '#7b3bd6'); el.setAttribute('stroke-width', t.w);
      el.setAttribute('stroke-linecap', 'round'); el.setAttribute('stroke-linejoin', 'round');
    }
    g.appendChild(el);
    svg.appendChild(g);
    return {
      g: g, fx: item[1], fy: item[2], rot: item[3], s: item[4], phase: i * 1.9,
      x: 0, y: 0, k: 1,
      tx: 0, ty: 0, vx: 0, vy: 0, // décalage (ressort)
      d: 0, vd: 0,                // intensité de déformation (ressort)
      a: 0                        // direction du curseur
    };
  });

  var W = 0, H = 0, mouse = null, raf = 0, visible = false;

  function layout() {
    var r = section.getBoundingClientRect();
    W = r.width; H = r.height;
    svg.setAttribute('viewBox', '0 0 ' + Math.round(W) + ' ' + Math.round(H));
    var u = Math.max(0.42, Math.min(1.15, W / 1200));
    shapes.forEach(function (s) { s.x = s.fx * W; s.y = s.fy * H; s.k = u * s.s; });
  }

  function draw(t) {
    var r = section.getBoundingClientRect();
    var R = Math.max(150, Math.min(280, W * 0.22));
    var drift = still ? 0 : 1;
    shapes.forEach(function (s) {
      var bx = Math.sin(t * 0.00035 + s.phase) * 10 * drift;
      var by = Math.cos(t * 0.0003 + s.phase * 1.3) * 12 * drift;
      var br = Math.sin(t * 0.00025 + s.phase) * 2.2 * drift;
      var bs = 1 + Math.sin(t * 0.0004 + s.phase * 0.7) * 0.025 * drift;
      var targetX = 0, targetY = 0, targetD = 0;
      if (mouse) {
        var dx = s.x + bx - (mouse.x - r.left), dy = s.y + by - (mouse.y - r.top);
        var dist = Math.sqrt(dx * dx + dy * dy) || 1;
        var inf = Math.exp(-(dist * dist) / (R * R));
        targetX = (dx / dist) * inf * 52 * s.k;
        targetY = (dy / dist) * inf * 52 * s.k;
        targetD = inf;
        s.a = Math.atan2(dy, dx) * 180 / Math.PI;
      }
      // ressorts : léger rebond « gélatineux »
      s.vx += (targetX - s.tx) * 0.07; s.vx *= 0.82; s.tx += s.vx;
      s.vy += (targetY - s.ty) * 0.07; s.vy *= 0.82; s.ty += s.vy;
      s.vd += (targetD - s.d) * 0.08; s.vd *= 0.8; s.d += s.vd;
      var sq = 1 - 0.32 * s.d; // écrasé face au curseur
      var st = 1 + 0.26 * s.d; // étiré perpendiculairement
      s.g.setAttribute('transform',
        'translate(' + (s.x + bx + s.tx).toFixed(1) + ' ' + (s.y + by + s.ty).toFixed(1) + ')' +
        'rotate(' + s.a.toFixed(1) + ')scale(' + sq.toFixed(3) + ' ' + st.toFixed(3) + ')rotate(' + (-s.a).toFixed(1) + ')' +
        'rotate(' + (s.rot + br).toFixed(2) + ')scale(' + (s.k * bs).toFixed(3) + ')');
    });
  }

  function frame(t) {
    draw(t);
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

  layout();
  draw(0);
  if (still) return;

  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(frame);
  }).observe(section);

  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(section);
  else window.addEventListener('resize', layout);

  section.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    mouse = { x: e.clientX, y: e.clientY };
  }, { passive: true });
  section.addEventListener('pointerleave', function () { mouse = null; });
})();
