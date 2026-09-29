// Formulaire pose une question a la fois : un grand formulaire decourage
// avant meme d'etre lu, alors qu'une question isolee se repond sans effort.
// Chaque reponse validee se replie en ligne de recapitulatif, modifiable.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var log = document.getElementById('thread-log');
  var ask = document.getElementById('ask');
  var label = document.getElementById('ask-label');
  var help = document.getElementById('ask-help');
  var field = document.getElementById('field');
  var next = document.getElementById('ask-next');
  var error = document.getElementById('ask-error');
  var done = document.getElementById('thread-done');
  var dots = document.querySelectorAll('#progress .progress__dot');

  var STEPS = [
    { key: 'message', label: 'Le problème à résoudre',
      help: "Décrivez ce qui bloque aujourd’hui : acquisition, image, organisation, outil métier ou suivi.",
      placeholder: 'Ex. Nous perdons du temps à relancer et à retrouver les informations…', type: 'textarea', required: true,
      recap: 'Situation',
      check: function (v) { return v.length >= 10 ? null : 'Quelques mots de plus, pour que nous comprenions.'; } },
    { key: 'name', label: 'Votre nom', help: 'Pour savoir à qui nous répondons personnellement.',
      placeholder: 'Prénom et nom', type: 'text', required: true, recap: 'Nom',
      check: function (v) { return v.length >= 2 ? null : 'Il nous faut au moins un prénom.'; } },
    { key: 'email', label: 'Votre e-mail', help: "C’est là que nous vous répondons.",
      placeholder: 'vous@entreprise.be', type: 'email', required: true, recap: 'E-mail',
      check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Cette adresse semble incomplète.'; } },
    { key: 'phone', label: 'Votre téléphone', help: 'Facultatif. Utile si vous préférez un appel.',
      placeholder: '0470 12 34 56', type: 'tel', required: false, recap: 'Téléphone',
      check: function () { return null; } }
  ];

  var step = 0;
  var data = {};
  var sending = false;
  var params = new URLSearchParams(location.search);
  var offer = params.get('offer');
  var solution = params.get('solution');
  if (offer && /^[A-Z]\d{2}$/.test(offer)) {
    field.value = 'Je souhaite en savoir plus sur l’offre ' + offer + '.';
    help.textContent = 'Cette demande a été préparée depuis la page Tarifs. Modifiez-la avant de continuer : rien n’est encore envoyé.';
  }
  if (!offer && solution && /^[a-z-]{3,40}$/.test(solution)) {
    var solutionLabels = {
      'acquisition': 'attirer plus de clients',
      'automatisation': 'arrêter de perdre du temps sur le suivi',
      'outil-metier': 'mieux organiser mon activité',
      'presence-marque': 'renforcer ma présence et mon image'
    };
    if (solutionLabels[solution]) {
      field.value = 'Je souhaite explorer comment ' + solutionLabels[solution] + '.';
      help.textContent = 'Cette demande a été préparée depuis les systèmes Purity. Modifiez-la avant de continuer : rien n’est encore envoyé.';
    }
  }
  try {
    var draft = JSON.parse(sessionStorage.getItem('purity-contact-draft'));
    if (!offer && draft && Date.now() - draft.at < 30 * 60 * 1000 && typeof draft.message === 'string' && draft.message) {
      field.value = draft.message.slice(0, 3400);
      help.textContent = 'Voici le contexte préparé avec OctoMask. Modifiez-le avant de continuer : rien n’est encore envoyé.';
    }
  } catch { /* Le formulaire reste utilisable sans stockage local. */ }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function tuneField(el) {
    if (!el) return;
    var isArea = el.tagName === 'TEXTAREA';
    el.classList.toggle('ask__input--area', isArea);
    if (!isArea) return;

    function fit() {
      el.style.height = 'auto';
      var max = parseFloat(getComputedStyle(el).maxHeight) || 280;
      var nextHeight = Math.min(el.scrollHeight, max);
      el.style.height = nextHeight + 'px';
      el.style.overflowY = el.scrollHeight > max + 2 ? 'auto' : 'hidden';
    }

    fit();
    el.addEventListener('input', fit);
    requestAnimationFrame(fit);
  }

  function paintDots() {
    dots.forEach(function (d, i) {
      d.classList.toggle('is-on', i === step);
      d.classList.toggle('is-done', i < step);
    });
  }

  function showStep() {
    var s = STEPS[step];
    label.textContent = s.label;
    help.textContent = s.help;

    // Le champ change de nature selon la question : une ligne pour un nom,
    // un bloc pour un projet.
    var isArea = s.type === 'textarea';
    var el = document.createElement(isArea ? 'textarea' : 'input');
    el.className = 'ask__input';
    el.id = 'field';
    el.name = s.key;
    el.placeholder = s.placeholder;
    el.setAttribute('aria-describedby', 'ask-help');
    if (isArea) el.rows = 4;
    else {
      el.type = s.type;
      el.autocomplete = s.key === 'name' ? 'name' : s.key === 'email' ? 'email' : 'tel';
    }
    if (data[s.key]) el.value = data[s.key];
    field.replaceWith(el);
    field = el;
    tuneField(field);

    // La question qui remplace la precedente doit etre annoncee : sans cela
    // un lecteur d'ecran reste sur l'ancien libelle apres validation.
    label.setAttribute('aria-live', 'polite');
    next.textContent = step === STEPS.length - 1 ? 'Envoyer' : 'Continuer';
    if (!s.required) next.textContent = 'Envoyer';
    ask.classList.remove('is-in');
    void ask.offsetWidth;          // relance l'animation d'entree
    ask.classList.add('is-in');
    error.hidden = true;
    paintDots();
    field.focus();
  }

  function addRecap(s, value) {
    var row = document.createElement('button');
    row.type = 'button';
    row.className = 'recap';
    row.innerHTML = '<span class="recap__key">' + esc(s.recap) + '</span>' +
                    '<span class="recap__val">' + esc(value) + '</span>' +
                    '<span class="recap__edit">Modifier</span>';
    row.addEventListener('click', function () {
      step = STEPS.indexOf(s);
      // Les reponses suivantes sont reprises depuis cette etape.
      var all = [].slice.call(log.children);
      all.slice(all.indexOf(row)).forEach(function (n) { n.remove(); });
      showStep();
    });
    log.appendChild(row);
  }

  function submitAll() {
    if (sending) return;
    sending = true;
    ask.hidden = true;
    document.getElementById('progress').hidden = true;
    log.insertAdjacentHTML('beforeend', '<p class="thread__sending">Envoi en cours…</p>');

    // Un creneau choisi doit aussi poser le rendez-vous dans l'agenda, sinon
    // le visiteur croit avoir reserve alors que rien n'est bloque.
    var send = fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json(); });

    var chain = data.slot
      ? send.then(function (d) {
          if (!d.ok) return d;
          return fetch('/api/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start: data.slot, name: data.name, email: data.email,
                                   phone: data.phone, message: data.message })
          }).then(function (r) { return r.json(); })
            .then(function (b) { return Object.assign({}, d, { booked: b.ok }); })
            .catch(function () { return d; });
        })
      : send;

    chain
      .then(function (d) {
        var s = document.querySelector('.thread__sending');
        if (s) s.remove();
        if (!d.ok) {
          ask.hidden = false;
          error.hidden = false;
          error.textContent = "L'envoi a échoué. Réessayez, ou écrivez-nous à contact@purity-agency.be.";
          return;
        }
        log.hidden = true;
        done.hidden = false;
        done.querySelector('.thread__done-text').textContent = d.delivered
          ? 'Votre message a été transmis à Purity. Nous revenons vers vous après lecture.'
          : 'Votre demande est enregistrée sur notre serveur, mais l’e-mail de notification n’a pas pu être envoyé. Pour un contact direct : contact@purity-agency.be.';
        if (data.slot && d.booked) {
          done.querySelector('.thread__done-text').textContent =
            'Votre rendez-vous est enregistré dans notre agenda. Notez le créneau choisi ; aucune invitation e-mail automatique n’est envoyée par ce formulaire.';
        } else if (data.slot) {
          done.querySelector('.thread__done-text').textContent += ' Le rendez-vous n’a pas été réservé : l’équipe doit vous confirmer un créneau.';
        }
        try { sessionStorage.removeItem('purity-contact-draft'); } catch {}
        // Le focus va sur la confirmation : sans cela il reste sur un bouton
        // qui vient de disparaitre.
        done.setAttribute('tabindex', '-1');
        done.focus();
      })
      .catch(function () {
        var s = document.querySelector('.thread__sending');
        if (s) s.remove();
        ask.hidden = false;
        error.hidden = false;
        error.textContent = "L'envoi a échoué. Réessayez, ou écrivez-nous à contact@purity-agency.be.";
      }).finally(function () { sending = false; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var s = STEPS[step];
    var v = field.value.trim();

    if (s.required || v) {
      var msg = s.check(v);
      if (msg) { error.hidden = false; error.textContent = msg; field.focus(); return; }
    }

    data[s.key] = v;
    if (v) addRecap(s, v);

    if (step < STEPS.length - 1) { step++; showStep(); return; }
    submitAll();
  });

  // Entree valide l'etape ; Maj+Entree garde le retour a la ligne du message.
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && e.target === field) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  paintDots();
  tuneField(field);

  // ── Agenda ────────────────────────────────────────────────────────────
  var daysEl = document.getElementById('booking-days');
  var slotsEl = document.getElementById('booking-slots');
  if (!daysEl || !slotsEl) return;

  var fmtDay = new Intl.DateTimeFormat('fr-BE', { weekday: 'short', timeZone: 'Europe/Brussels' });
  var fmtNum = new Intl.DateTimeFormat('fr-BE', { day: 'numeric', timeZone: 'Europe/Brussels' });
  var fmtFull = new Intl.DateTimeFormat('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Brussels' });
  var selected = null;
  var slotsRequest = 0;

  function isoDay(d) {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Brussels' }).format(d);
  }

  function buildDays() {
    var out = '';
    var d = new Date();
    var added = 0;
    while (added < 10) {
      d = new Date(d.getTime() + 86400000);
      var dow = d.getDay();
      if (dow === 0 || dow === 6) continue;      // week-end ferme
      var iso = isoDay(d);
      out += '<button type="button" class="day" aria-pressed="false" data-date="' + iso + '">' +
               '<span class="day__name">' + fmtDay.format(d).replace('.', '') + '</span>' +
               '<span class="day__num">' + fmtNum.format(d) + '</span>' +
             '</button>';
      added++;
    }
    daysEl.innerHTML = out;
    var first = daysEl.querySelector('.day');
    if (first) first.click();
  }

  function loadSlots(iso, btn) {
    var request = ++slotsRequest;
    selected = null;
    delete data.slot;
    var previousSlot = log.querySelector('.recap--slot');
    if (previousSlot) previousSlot.remove();
    daysEl.querySelectorAll('.day').forEach(function (b) {
      var on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    slotsEl.innerHTML = '<p class="booking__state">Lecture de l\'agenda…</p>';

    fetch('/api/slots?date=' + encodeURIComponent(iso))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (request !== slotsRequest) return;
        if (!d.ok) {
          slotsEl.innerHTML = '<p class="booking__state booking__state--off">' +
            'La réservation en ligne est momentanément indisponible.<br>' +
            'Écrivez-nous votre message, nous vous proposons un créneau en retour.</p>';
          return;
        }
        if (!d.slots.length) {
          slotsEl.innerHTML = '<p class="booking__state">Aucun créneau libre ce jour-là. Essayez un autre jour.</p>';
          return;
        }
        slotsEl.innerHTML = '<p class="booking__on">' + fmtFull.format(new Date(iso + 'T12:00:00Z')) + '</p>' +
          '<div class="slots">' + d.slots.map(function (s) {
            return '<button type="button" class="slot" aria-pressed="false" data-start="' +
                   s.start + '" aria-label="Reserver a ' + s.label + '">' + s.label + '</button>';
          }).join('') + '</div>';
      })
      .catch(function () {
        if (request !== slotsRequest) return;
        slotsEl.innerHTML = '<p class="booking__state booking__state--off">Agenda injoignable pour le moment.</p>';
      });
  }

  daysEl.addEventListener('click', function (e) {
    var b = e.target.closest('.day');
    if (b) loadSlots(b.dataset.date, b);
  });

  slotsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.slot');
    if (!b) return;
    selected = b.dataset.start;
    slotsEl.querySelectorAll('.slot').forEach(function (s) {
      var on = s === b;
      s.classList.toggle('is-on', on);
      s.setAttribute('aria-pressed', String(on));
    });

    // Le creneau choisi rejoint le fil de gauche : une seule saisie pour les
    // deux parcours, au lieu d'un second formulaire.
    data.slot = selected;
    var old = log.querySelector('.recap--slot');
    if (old) old.remove();
    var row = document.createElement('span');
    row.className = 'recap recap--slot';
    row.innerHTML = '<span class="recap__key">Rendez-vous</span>' +
      '<span class="recap__val">' + b.textContent + ' le ' +
      fmtFull.format(new Date(selected)) + '</span>';
    log.insertBefore(row, log.firstChild);
    document.querySelector('.thread').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  buildDays();
})();
