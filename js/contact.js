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
  var quickWrap = document.getElementById('contact-quick');
  // Texte pré-rempli à compléter : envoyé tel quel, il n'apprendrait rien à Amir.
  var templatePrefill = '';
  // Une puce choisie vaut une réponse : le visiteur l'a sélectionnée lui-même.
  var chipText = '';
  if (quickWrap) {
    var chips = [].slice.call(quickWrap.querySelectorAll('button[data-quick]'));
    chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    quickWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-quick]');
      if (!btn || step !== 0) return;
      field.value = btn.getAttribute('data-quick');
      chipText = field.value;
      templatePrefill = '';
      chips.forEach(function (c) { c.setAttribute('aria-pressed', c === btn ? 'true' : 'false'); });
      field.dispatchEvent(new Event('input'));
      field.focus();
      field.setSelectionRange(field.value.length, field.value.length);
    });
  }

  function isUnfinished(v) {
    return /:\s*$/.test(v) || (templatePrefill && v === templatePrefill.trim());
  }

  var STEPS = [
    { key: 'message', label: 'Votre besoin, en une phrase',
      help: "Ce qui coince aujourd’hui : pas assez d’appels, des devis jamais relancés, un site qui date… Avec vos mots.",
      placeholder: 'Ex. Je rate des appels quand je suis sur chantier…', type: 'textarea', required: true,
      recap: 'Besoin',
      check: function (v) {
        if (chipText && v === chipText.trim()) return null;
        if (isUnfinished(v)) return 'Complétez la phrase avec votre métier et ce qui coince : quelques mots suffisent.';
        return v.length >= 3 ? null : 'Écrivez quelques mots (3 caractères minimum) ou choisissez un besoin ci-dessus.';
      } },
    { key: 'name', label: 'Votre nom', help: 'Je vous réponds moi-même, pas un robot.',
      placeholder: 'Prénom et nom', type: 'text', required: true, recap: 'Nom',
      check: function (v) { return v.length >= 2 ? null : 'Votre prénom suffit pour continuer.'; } },
    { key: 'email', label: 'Votre e-mail', help: "C’est là qu’arrive la réponse. Pas de newsletter.",
      placeholder: 'vous@entreprise.be', type: 'email', required: true, recap: 'E-mail',
      check: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? null : 'Il manque une partie de l’adresse. Exemple : nom@entreprise.be'; } },
    { key: 'phone', label: 'Téléphone (facultatif, pour être rappelé plus vite)', help: 'Vous pouvez passer cette étape : la réponse arrive par e-mail.',
      placeholder: '0470 12 34 56', type: 'tel', required: false, recap: 'Téléphone',
      check: function () { return null; } }
  ];

  var step = 0;
  var data = {};
  var sending = false;
  var params = new URLSearchParams(location.search);
  var offer = params.get('offer');
  var solution = params.get('solution');
  var caseId = params.get('case');
  var promo = params.get('promo');
  // ?promo= ne sert qu'aux demandes de devis ; « novdec25 » reste accepté pour
  // les anciens liens déjà partagés.
  var promoActive = promo === 'lancement' || promo === 'novdec25';
  var PROMO_TEXT = '-25 % si vous signez dans les 24 h après votre devis';
  // Un rendez-vous n'est pas une demande de devis : on mène au bloc de réservation.
  var wantsBooking = params.get('intent') === 'rdv' || solution === 'diagnostic' || offer === 'M01';
  var caseLabels = {
    renovation: 'la démonstration Rénovation intérieure', beaute: 'la démonstration Institut de beauté',
    garage: 'la démonstration Garage / carrosserie', decoration: 'la démonstration Boutique de décoration',
    immobilier: 'la démonstration Agence immobilière', fiduciaire: 'la démonstration Fiduciaire',
    restaurant: 'la démonstration Restaurant', sport: 'la démonstration Studio sportif',
    sante: 'la démonstration Cabinet de santé', animaux: 'la démonstration Service animalier',
    architecture: 'la démonstration Atelier d’architecture', chauffage: 'la démonstration Artisan chauffagiste'
  };
  var solutionLabels = {
    'acquisition': 'attirer plus de clients',
    'automatisation': 'arrêter de perdre du temps sur le suivi des demandes',
    'outil-metier': 'mieux organiser mon activité',
    'presence-marque': 'renforcer ma présence et mon image'
  };
  if (caseId && caseLabels[caseId]) {
    field.value = 'Je voudrais quelque chose de proche de ' + caseLabels[caseId] + '. Mon métier : ';
    help.textContent = 'Votre message est prérempli depuis la démo. Complétez-le : rien n’est envoyé avant votre validation.';
  } else if (wantsBooking) {
    // Aucun devis pré-rempli : le champ reste libre pour qui préfère écrire.
  } else if (offer && /^[A-Z]\d{2}$/.test(offer)) {
    // Noms lisibles du catalogue (data/services.mjs) : le visiteur ne doit pas
    // recevoir un code interne dans son propre message.
    var offerNames = {
      M03: 'Page Essentielle (1 page)', M04: 'Site Vitrine (5 pages)',
      M05: 'Site Complet (10+ pages)', M06: 'Boutique en ligne (E-commerce)', M07: 'Refonte & modernisation de site web',
      M08: 'Fiche Google Business & Maps', M09: 'Identité visuelle & Logo', M10: 'Pack Visuels & Reels Studio',
      M13: 'Référencement local (SEO)', M16: 'Réseaux sociaux (3x/semaine)', M21: 'Pilote Automatique Essentiel',
      M22: 'Pilote Automatique Business', M23: 'Pilote Automatique Intégral'
    };
    field.value = offerNames[offer]
      ? 'Je voudrais un devis pour l’offre « ' + offerNames[offer] + ' ». Mon métier : '
      : 'Je voudrais un devis. Mon métier : ';
    help.textContent = 'Votre message est prérempli avec l’offre choisie. Complétez-le : rien n’est envoyé avant votre validation.';
  } else if (solution && solutionLabels[solution]) {
    field.value = 'Je cherche à ' + solutionLabels[solution] + '. Mon métier : ';
    help.textContent = 'Votre message est prérempli depuis votre choix. Complétez-le : rien n’est envoyé avant votre validation.';
  } else if (promoActive) {
    field.value = 'Je voudrais un devis (' + PROMO_TEXT.replace(/vous signez/, 'je signe').replace(/votre devis/, 'le devis') + '). Mon métier et ce qui coince : ';
    help.textContent = 'L’offre est rappelée dans votre message : ' + PROMO_TEXT + '. Ajoutez votre métier et ce qui coince.';
  }
  if (promoActive && field.value && !wantsBooking && !/-25/.test(field.value)) {
    help.textContent += ' Offre de lancement : ' + PROMO_TEXT + '.';
  }
  templatePrefill = field.value;
  try {
    var draft = JSON.parse(sessionStorage.getItem('purity-contact-draft'));
    if (!caseId && !offer && draft && Date.now() - draft.at < 30 * 60 * 1000 && typeof draft.message === 'string' && draft.message) {
      field.value = draft.message.slice(0, 3400);
      // Le résumé OctoMask peut partir tel quel ; le résultat du test express
      // se termine par « Mon métier : » et doit être complété.
      templatePrefill = draft.source === 'audit' ? field.value : '';
      help.textContent = draft.source === 'audit'
        ? 'Votre message reprend le résultat du test express de votre site. Ajoutez votre métier : rien n’est envoyé avant votre validation.'
        : 'Voici le résumé de votre échange avec OctoMask. Modifiez-le si besoin : rien n’est envoyé avant votre validation.';
    }
  } catch { /* Le formulaire reste utilisable sans stockage local. */ }

  // Rendez-vous demandé : le bloc de réservation passe au premier plan.
  if (wantsBooking) {
    var booking = document.querySelector('.booking');
    // Rendez-vous demandé : le bloc réservation passe avant le formulaire.
    var thread = document.querySelector('.thread');
    if (booking && thread && thread.parentNode === booking.parentNode) thread.parentNode.insertBefore(booking, thread);
    var bookingBtn = booking && booking.querySelector('.booking__external');
    if (booking) {
      var still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        booking.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'center' });
        if (bookingBtn) bookingBtn.focus({ preventScroll: true });
        if (!still && booking.animate) {
          booking.animate([
            { boxShadow: '0 0 0 0 rgba(91,42,143,0)' },
            { boxShadow: '0 0 0 6px rgba(91,42,143,.45)' },
            { boxShadow: '0 0 0 0 rgba(91,42,143,0)' }
          ], { duration: 1400, iterations: 2, easing: 'ease-in-out' });
        }
      }, 60);
    }
  }

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
    if (quickWrap) quickWrap.hidden = step !== 0;
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
    next.textContent = step === STEPS.length - 1 ? 'Envoyer ma demande' : s.key === 'email' ? 'Suivant : téléphone (facultatif)' : 'Continuer';
    if (!s.required) next.textContent = 'Envoyer ma demande';
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

    // Champ piege : invisible pour un visiteur, rempli par les robots. Le
    // serveur ignore alors la demande sans le signaler.
    var trap = form.querySelector('[name="_hp"]');
    var hp = trap ? trap.value : '';

    // La reservation passe par le lien Google Agenda de la page : ce formulaire
    // n'envoie que le message.
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, data, { _hp: hp }))
    }).then(function (r) { return r.json(); })
      .then(function (d) {
        var s = document.querySelector('.thread__sending');
        if (s) s.remove();
        if (!d.ok) {
          ask.hidden = false;
          error.hidden = false;
          error.textContent = "Votre demande n’est pas partie, mais vos réponses sont gardées. Réessayez, ou écrivez à contact@purity-agency.be.";
          return;
        }
        log.hidden = true;
        done.hidden = false;
        // Seul le paragraphe change : le bouton « Choisir mon créneau
        // maintenant » reste en place sous le texte.
        done.querySelector('.thread__done-text').textContent = d.delivered
          ? 'Amir a reçu votre message. Je vous réponds sous 24 h ouvrées, par e-mail, ou par téléphone si vous avez laissé votre numéro.'
          : 'Votre demande est bien enregistrée. Je vous réponds sous 24 h ouvrées ; sans nouvelles d’ici là, écrivez à contact@purity-agency.be.';
        try { document.dispatchEvent(new CustomEvent('purity:lead', { detail: { form: 'contact' } })); } catch {}
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
        error.textContent = "Votre demande n’est pas partie, mais vos réponses sont gardées. Vérifiez votre connexion et réessayez, ou écrivez à contact@purity-agency.be.";
      }).finally(function () { sending = false; });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var s = STEPS[step];
    if (quickWrap) quickWrap.hidden = step !== 0;
    var v = field.value.trim();

    if (s.required || v) {
      var msg = s.check(v);
      if (msg) { error.hidden = false; error.textContent = msg; field.setAttribute('aria-invalid', 'true'); field.setAttribute('aria-describedby', 'ask-help ask-error'); field.focus(); return; }
    }

    data[s.key] = v;
    if (v) addRecap(s, v);

    if (step < STEPS.length - 1) { step++; showStep(); return; }
    submitAll();
  });

  // L'erreur disparait des la premiere frappe corrective.
  form.addEventListener('input', function (e) {
    if (e.target === field && !error.hidden) {
      error.hidden = true;
      field.removeAttribute('aria-invalid');
      field.setAttribute('aria-describedby', 'ask-help');
    }
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
})();
