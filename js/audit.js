// Audit express : appelle /api/audit puis /api/pagespeed. Rien n'est fabrique
// cote client ; tout ce qui s'affiche vient d'une mesure serveur.
(function () {
  var form = document.getElementById('audit-form');
  var input = document.getElementById('audit-url');
  var out = document.getElementById('audit-out');
  if (!form || !input || !out) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Le poids serveur devient un niveau de gravite lisible.
  function severity(w) {
    if (w >= 18) return { key: 'high', label: 'Critique' };
    if (w >= 9) return { key: 'mid', label: 'Important' };
    return { key: 'low', label: 'À corriger' };
  }

  function findingHtml(i, isNew) {
    var s = severity(i.weight);
    return '<li class="card card--' + s.key + (isNew ? ' card--new' : '') +
             '" data-weight="' + i.weight + '">' +
             '<span class="card__sev">' + s.label + '</span>' +
             '<h3 class="card__title">' + esc(i.label) + '</h3>' +
             '<p class="card__text">' + esc(i.detail) + '</p>' +
           '</li>';
  }

  // Etapes reelles de l'analyse : chacune correspond a un travail en cours.
  var STEPS = ['Connexion à votre site', 'Lecture du code de la page',
               'Contrôle de la visibilité Google', 'Mesure de la vitesse réelle'];

  function loading() {
    out.className = 'audit__out is-loading';
    out.innerHTML =
      '<div class="panel panel--loading">' +
        '<div class="ring ring--idle" aria-hidden="true"><svg viewBox="0 0 120 120">' +
          '<circle class="ring__track" cx="60" cy="60" r="52"></circle>' +
          '<circle class="ring__spin" cx="60" cy="60" r="52"></circle>' +
        '</svg></div>' +
        '<ul class="steps" id="steps">' +
          STEPS.map(function (t, n) {
            return '<li class="step" data-n="' + n + '">' + t + '</li>';
          }).join('') +
        '</ul>' +
      '</div>';

    if (reduced) return null;
    var n = 0;
    var el = document.getElementById('steps');
    if (el) el.children[0].classList.add('is-on');
    return setInterval(function () {
      if (!el || !el.isConnected) return;
      if (n < el.children.length - 1) {
        el.children[n].classList.remove('is-on');
        el.children[n].classList.add('is-done');
        el.children[++n].classList.add('is-on');
      }
    }, 700);
  }

  function message(html) {
    out.className = 'audit__out is-msg';
    out.innerHTML = '<div class="panel panel--msg">' + html + '</div>';
  }

  // Le chiffre monte jusqu'au score : le mouvement fait lire la valeur.
  function countTo(el, target) {
    if (!el) return;
    if (reduced) { el.textContent = target; return; }
    var t0 = null, dur = 900;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function render(d) {
    var tone = d.score >= 80 ? 'good' : d.score >= 55 ? 'warn' : 'bad';
    var verdict = d.score >= 80
      ? 'Votre site tient la route. Reste à le faire travailler pour vous.'
      : d.score >= 55
        ? 'Votre site fonctionne, mais il laisse partir des visiteurs en silence.'
        : 'Votre site vous coûte des clients tous les jours.';

    var pending = d.pagespeedPending
      ? '<li class="card card--pending" id="ps-pending">' +
          '<span class="card__sev">Google analyse</span>' +
          '<h3 class="card__title">Mesure de vitesse en cours<span class="dots"><i></i><i></i><i></i></span></h3>' +
          '<p class="card__text">Google charge réellement votre page sur un mobile. Une trentaine de secondes.</p>' +
        '</li>'
      : '';

    var extra = d.issuesTotal - d.issues.length;
    var rest = extra > 0
      ? '<p class="panel__rest">' + extra + (extra > 1 ? ' autres points figurent' : ' autre point figure') +
        ' dans le rapport complet.</p>'
      : '';

    out.className = 'audit__out is-done';
    out.innerHTML =
      '<div class="panel">' +
        '<header class="panel__head">' +
          '<div class="ring ring--' + tone + '">' +
            '<svg viewBox="0 0 120 120" aria-hidden="true">' +
              '<circle class="ring__track" cx="60" cy="60" r="52"></circle>' +
              '<circle class="ring__value" cx="60" cy="60" r="52" style="--pct:' + d.score + '"></circle>' +
            '</svg>' +
            '<span class="ring__num" id="score-num">0</span>' +
          '</div>' +
          '<div class="panel__verdict">' +
            '<p class="panel__site">' + esc(d.url.replace(/^https?:\/\//, '').replace(/\/$/, '')) + '</p>' +
            '<p class="panel__sentence">' + verdict + '</p>' +
            '<p class="panel__meta">' + d.issuesTotal + ' problème' + (d.issuesTotal > 1 ? 's' : '') +
              ' détecté' + (d.issuesTotal > 1 ? 's' : '') + '</p>' +
          '</div>' +
        '</header>' +
        '<ul class="cards" id="cards">' +
          d.issues.map(function (i) { return findingHtml(i, false); }).join('') + pending +
        '</ul>' + rest +
        '<a class="btn btn--primary panel__cta" href="#contact">Corriger ça avec nous</a>' +
      '</div>';

    countTo(document.getElementById('score-num'), d.score);
  }

  function fetchPagespeed(url) {
    fetch('/api/pagespeed?url=' + encodeURIComponent(url))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var slot = document.getElementById('ps-pending');
        if (!slot) return;
        if (!d.ok || !d.issues.length) { slot.remove(); return; }

        // Les mesures Google sont souvent les plus graves : on les fusionne
        // dans la liste et on retrie, sinon un constat critique finirait en
        // bas de grille juste parce qu'il est arrive en dernier.
        var list = document.getElementById('cards');
        slot.remove();
        var current = [].slice.call(list.children).map(function (li) {
          return { html: li.outerHTML, weight: Number(li.dataset.weight || 0) };
        });
        d.issues.forEach(function (i) {
          current.push({ html: findingHtml(i, true), weight: i.weight });
        });
        current.sort(function (a, b) { return b.weight - a.weight; });
        list.innerHTML = current.map(function (c) { return c.html; }).join('');
      })
      .catch(function () {
        var slot = document.getElementById('ps-pending');
        if (slot) slot.remove();
      });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    if (!v) { input.focus(); return; }

    var timer = loading();
    var stop = function () { if (timer) clearInterval(timer); };

    fetch('/api/audit?url=' + encodeURIComponent(v))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        stop();
        if (d.ok) {
          render(d);
          if (d.pagespeedPending) fetchPagespeed(d.url);
          return;
        }
        if (d.reason === 'no-url') {
          message('<p class="panel__sentence">Il nous faut une adresse de site, du type <strong>votre-entreprise.be</strong>.</p>' +
            '<p class="panel__note">Vous n&rsquo;avez pas encore de site ? C&rsquo;est le meilleur moment pour en parler.</p>' +
            '<a class="btn btn--primary panel__cta" href="#contact">En parler avec nous</a>');
          return;
        }
        if (d.reason === 'rate') {
          message('<p class="panel__sentence">Trop d&rsquo;analyses coup sur coup. Réessayez dans une minute.</p>');
          return;
        }
        message('<p class="panel__sentence">Nous n&rsquo;arrivons pas à joindre ce site.</p>' +
          '<p class="panel__note">Soit l&rsquo;adresse comporte une erreur, soit le site ne répond pas. Dans le second cas, le problème est déjà sérieux.</p>' +
          '<a class="btn btn--primary panel__cta" href="#contact">Faites-le vérifier</a>');
      })
      .catch(function () {
        stop();
        message('<p class="panel__sentence">L&rsquo;analyse a échoué. Réessayez dans un instant.</p>');
      });
  });
})();
