/**
 * pack-checkout.js — Activation des Packs Métier (Coiffure, Artisan, HoReCa, Praticien)
 * Formulaire de contact minimal → POST /api/order/create → redirection Stripe Checkout (acompte 30%).
 * Réutilise les styles .ob-* injectés par order-modal.js pour rester visuellement cohérent.
 */
(function () {
  'use strict';

  var PACKS = {
    coiffure:  { name: 'Coiffure & Beauté',     pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, monthly: 69 },
    artisan:   { name: 'Artisan & Bâtiment',    pack: 'Pack Zéro Appel Perdu',   price: 1490, deposit: 447, monthly: 79 },
    horeca:    { name: 'HoReCa & Restauration', pack: 'Pack Toujours Ouvert',    price: 1490, deposit: 447, monthly: 79 },
    praticien: { name: 'Praticien & Bien-être', pack: 'Pack Cabinet Serein',     price: 1290, deposit: 387, monthly: 69 },
    immobilier:{ name: 'Immobilier',            pack: 'Pack Agence Digitale',    price: 1490, deposit: 447, monthly: 79 },
    avocat:    { name: 'Avocats & Juridique',   pack: 'Pack Cabinet Moderne',    price: 1490, deposit: 447, monthly: 79 },
    commerce:  { name: 'Commerces & Retail',    pack: 'Pack Click & Collect',    price: 1990, deposit: 597, monthly: 99 },
    fitness:   { name: 'Salles de Sport',       pack: 'Pack Membres Pro',        price: 1490, deposit: 447, monthly: 79 },
    consulting:{ name: 'Consultants & B2B',     pack: 'Pack Expert Autorité',    price: 1290, deposit: 387, monthly: 69 },
    formation: { name: 'Formateurs & Coachs',   pack: 'Pack Académie',           price: 1990, deposit: 597, monthly: 99 },
    garage:    { name: 'Garages & Concessions', pack: 'Pack Atelier Connecté',   price: 1490, deposit: 447, monthly: 79 },
    finance:   { name: 'Finance & Assurance',   pack: 'Pack Confiance Pro',      price: 1490, deposit: 447, monthly: 79 }
  };

  var ERROR_MESSAGES = {
    invalid_sector: 'Secteur invalide. Rechargez la page et réessayez.',
    invalid_contact: 'Merci de vérifier votre nom et votre adresse e-mail.',
    mollie_not_configured: 'Le paiement en ligne n\'est pas encore configuré. Contactez-nous directement pour démarrer ce pack.',
    mollie_error: 'Le service de paiement a rencontré une erreur. Réessayez dans un instant.',
    storage: 'Une erreur technique est survenue. Réessayez dans un instant.',
    base_url_not_configured: 'Configuration serveur incomplète. Contactez-nous directement pour démarrer ce pack.'
  };

  var currentSector = null;
  var modal, form, errorBox, submitBtn;

  function injectModal() {
    if (document.getElementById('pack-modal')) return;

    var div = document.createElement('div');
    div.id = 'pack-modal';
    div.className = 'ob-modal';
    div.setAttribute('role', 'dialog');
    div.setAttribute('aria-modal', 'true');
    div.setAttribute('aria-hidden', 'true');

    div.innerHTML =
      '<div class="ob-backdrop" id="pk-backdrop"></div>' +
      '<div class="ob-shell" style="max-width:480px;">' +
        '<button class="ob-x" id="pk-close" aria-label="Fermer">✕</button>' +
        '<div class="ob-stage">' +
          '<div class="ob-panel" data-step="1">' +
            '<div class="ob-panel__inner">' +
              '<span class="ob-eyebrow" data-i18n="modal.step1.eyebrow">Activer le pack</span>' +
              '<h2 class="ob-h2" id="pk-title">Pack</h2>' +
              '<p class="ob-sub" id="pk-sub"></p>' +
              '<form id="pk-form" class="ob-form">' +
                '<div class="ob-field"><label for="pk-name"><span data-i18n="modal.form.name">Nom complet</span> <span class="ob-req">*</span></label><input type="text" id="pk-name" required autocomplete="name"></div>' +
                '<div class="ob-field"><label for="pk-company"><span data-i18n="modal.form.company">Entreprise</span> <span data-i18n="modal.form.tva">(facultatif)</span></label><input type="text" id="pk-company" autocomplete="organization"></div>' +
                '<div class="ob-form__row">' +
                  '<div class="ob-field"><label for="pk-email"><span data-i18n="modal.form.email">E-mail</span> <span class="ob-req">*</span></label><input type="email" id="pk-email" required autocomplete="email"></div>' +
                  '<div class="ob-field"><label for="pk-phone"><span data-i18n="modal.form.phone">Téléphone</span> <span class="ob-req">*</span></label><input type="tel" id="pk-phone" required autocomplete="tel"></div>' +
                '</div>' +
                '<input type="text" name="website_verification" id="pk-hp" style="position:absolute;left:-9999px;" tabindex="-1" autocomplete="off">' +
                '<div id="pk-error" class="ob-form__error" hidden></div>' +
                '<button type="submit" class="ob-submit" id="pk-submit"><span class="ob-submit__txt">Payer l\'acompte (30 %) et démarrer</span><span class="ob-submit__spin" hidden></span></button>' +
              '</form>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(div);
    if(window.applyDict) window.applyDict();

    modal = div;
    form = div.querySelector('#pk-form');
    errorBox = div.querySelector('#pk-error');
    submitBtn = div.querySelector('#pk-submit');

    div.querySelector('#pk-close').onclick = closeModal;
    div.querySelector('#pk-backdrop').onclick = closeModal;
    form.onsubmit = handleSubmit;
  }

  function openModal(sector) {
    var pack = PACKS[sector];
    if (!pack) return;

    injectModal();
    currentSector = sector;

    errorBox.hidden = true;
    form.reset();

    modal.querySelector('#pk-title').innerHTML = 'Activer : <em>' + pack.pack + '</em>';
    modal.querySelector('#pk-sub').textContent =
      pack.name + ' — ' + pack.price + ' € HTVA (acompte 30 % = ' + pack.deposit + ' € aujourd\'hui, solde à la livraison, puis ' + pack.monthly + ' €/mois).';

    modal.classList.add('is-open');
    modal.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';

    if (window.PurityFocusTrap) window.PurityFocusTrap.attach(modal.querySelector('.ob-shell'));

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal.querySelector('.ob-shell'),
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
    }
  }

  function closeModal() {
    if (!modal) return;
    if (window.PurityFocusTrap) window.PurityFocusTrap.release();
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (modal.querySelector('#pk-hp').value.trim()) return; // honeypot anti-spam

    var name    = modal.querySelector('#pk-name').value.trim();
    var email   = modal.querySelector('#pk-email').value.trim();
    var phone   = modal.querySelector('#pk-phone').value.trim();
    var company = modal.querySelector('#pk-company').value.trim();

    errorBox.hidden = true;
    submitBtn.disabled = true;
    submitBtn.querySelector('.ob-submit__txt').textContent = 'Redirection vers le paiement...';
    submitBtn.querySelector('.ob-submit__spin').hidden = false;

    fetch('/api/order/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sector: currentSector, name: name, email: email, phone: phone, company: company })
    })
      .then(function (res) {
        return res.json().then(function (data) { return { ok: res.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok && result.data.sessionUrl) {
          window.location.href = result.data.sessionUrl;
          return;
        }
        showError(ERROR_MESSAGES[result.data.error] || 'Une erreur est survenue. Réessayez dans un instant.');
      })
      .catch(function () {
        showError('Connexion impossible. Vérifiez votre réseau et réessayez.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.querySelector('.ob-submit__txt').textContent = 'Payer l\'acompte (30 %) et démarrer';
        submitBtn.querySelector('.ob-submit__spin').hidden = true;
      });
  }

  function init() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('.ob-trigger[data-open-ob]');
      if (!trigger) return;
      e.preventDefault();
      openModal(trigger.getAttribute('data-open-ob'));
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
