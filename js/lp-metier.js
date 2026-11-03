// Pages metier (cas-concrets/*.html) : inclinaison 3D, widgets et envoi du formulaire.
// Fichier externe : la CSP (script-src 'self') bloque tout script inline.
document.addEventListener('DOMContentLoaded', function () {
  // --- 3D TILT & MOUSE SPOTLIGHT (ACCESSIBLE) ---
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    // Inclinaison 3D reservee aux souris : au doigt, un tap figeait la carte penchee.
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var tiltElements = finePointer ? document.querySelectorAll('[data-tilt], .case-preview') : [];
    tiltElements.forEach(function (el) {
      var bounds;
      function updateBounds() { bounds = el.getBoundingClientRect(); }
      el.addEventListener('mouseenter', updateBounds);
      el.addEventListener('mousemove', function (e) {
        if (!bounds) updateBounds();
        var x = e.clientX - bounds.left;
        var y = e.clientY - bounds.top;
        var centerX = bounds.width / 2;
        var centerY = bounds.height / 2;
        var rotateX = ((y - centerY) / centerY) * -5;
        var rotateY = ((x - centerX) / centerX) * 5;
        el.style.transform = 'perspective(1000px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(-3px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });

    // --- PARALLAX ON SCROLL ---
    var preview = document.querySelector('.case-detail__hero .case-preview');
    if (preview) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            var rect = preview.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              var offset = (window.innerHeight - rect.top) * 0.04;
              var poster = preview.querySelector('.case-preview__poster img');
              if (poster && !preview.classList.contains('is-hovered')) {
                poster.style.transform = 'translateY(' + (offset * 0.4 - 8).toFixed(1) + 'px)';
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });
    }
  }

  // --- INTERACTIVE MICRO-UI WIDGETS ---
  // Widget 1: Formula selector chips
  var formulaWidget = document.querySelector('.cap-widget[data-type="formula"]');
  if (formulaWidget) {
    var chips = formulaWidget.querySelectorAll('.cap-chip');
    var output = formulaWidget.querySelector('.cap-widget__output');
    var feedbacks = [];
    try { feedbacks = JSON.parse(document.getElementById('lp-feedbacks').textContent); } catch (e) {}
    chips.forEach(function (chip, i) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) {
          c.classList.toggle('is-active', c === chip);
          c.setAttribute('aria-pressed', String(c === chip));
        });
        if (output && feedbacks[i]) {
          output.style.opacity = '0';
          setTimeout(function () {
            output.textContent = feedbacks[i];
            output.style.opacity = '1';
          }, 120);
        }
      });
    });
  }

  // Widget 2: Calendar slots
  var calWidget = document.querySelector('.cap-widget[data-type="calendar"]');
  if (calWidget) {
    var slots = calWidget.querySelectorAll('.cap-slot');
    var slotStatus = calWidget.querySelector('.cap-widget__slot-status');
    slots.forEach(function (slot) {
      slot.addEventListener('click', function () {
        slots.forEach(function (s) {
          s.classList.toggle('is-active', s === slot);
          s.setAttribute('aria-pressed', String(s === slot));
        });
        if (slotStatus) {
          slotStatus.textContent = 'Créneau de ' + slot.getAttribute('data-slot') + ' validé · Synchronisation agenda instantanée';
        }
      });
    });
  }

  // --- PREVIEW SCALE UPDATE ---
  var previewEl = document.querySelector('.case-preview');
  if (previewEl) {
    function updateScale() {
      var screen = previewEl.querySelector('.case-preview__screen') || previewEl;
      var w = screen.clientWidth;
      if (w > 0) previewEl.style.setProperty('--preview-scale', (w / 1280).toFixed(4));
    }
    updateScale();
    window.addEventListener('resize', updateScale);
    window.addEventListener('load', updateScale);
    previewEl.addEventListener('pointerenter', function () {
      updateScale();
      previewEl.classList.add('is-hovered');
    });
    previewEl.addEventListener('pointerleave', function () {
      previewEl.classList.remove('is-hovered');
    });
  }

  // --- FORM SUBMISSION ---
  // Meme lien de reservation que contact.html (.booking__external).
  var BOOKING_URL = 'https://calendar.app.google/yybUurryQkpLmyCQ9';
  var form = document.getElementById('lp-form');
  var status = document.getElementById('lp-status');
  if (form && status) {
    var sending = false;
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      // Bouton jamais desactive : un second clic pendant l'envoi est simplement ignore.
      if (sending) return;
      // Validation à l'envoi (jamais à la frappe) : le bouton reste cliquable,
      // l'erreur nomme le champ et le focus y va.
      var msgField = form.querySelector('[name="message"]');
      if (msgField && msgField.value.trim().length < 3) {
        status.className = 'lp-form__status is-error';
        status.textContent = 'Écrivez quelques mots (3 caractères minimum) pour qu’on comprenne votre priorité.';
        msgField.setAttribute('aria-invalid', 'true');
        msgField.focus();
        return;
      }
      if (msgField) msgField.removeAttribute('aria-invalid');
      sending = true;
      var btn = form.querySelector('button[type="submit"]');
      btn.setAttribute('aria-busy', 'true');
      btn.textContent = 'Envoi en cours...';

      var formData = new FormData(form);
      // Le contexte du cas part dans un champ dedie : il ne doit plus apparaitre
      // comme un creneau dans l'e-mail recu.
      var payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        context: formData.get('context') || '',
        message: 'Ville : ' + (formData.get('location') || 'Non précisée') + ' | ' + formData.get('message'),
        _hp: formData.get('_hp')
      };

      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var data = await res.json();
        if (res.ok && data.ok) {
          try { document.dispatchEvent(new CustomEvent('purity:lead', { detail: { form: 'cas_concret' } })); } catch {}
          status.className = 'lp-form__status is-success';
          status.textContent = '';
          var text = document.createElement('p');
          text.className = 'lp-form__status-text';
          text.textContent = data.delivered === false
            ? 'Votre demande est bien enregistrée. Réponse personnelle sous 24 h ouvrées ; sans nouvelles d’ici là, écrivez à contact@purity-agency.be. Pour aller plus vite, réservez un appel de 15 minutes.'
            : '✓ Demande bien reçue. Réponse personnelle sous 24 h ouvrées. Pour aller plus vite, réservez directement un appel de 15 minutes.';
          var booking = document.createElement('a');
          booking.className = 'lp-form__booking';
          booking.href = BOOKING_URL;
          booking.target = '_blank';
          booking.rel = 'noopener';
          booking.textContent = 'Choisir mon créneau maintenant';
          status.appendChild(text);
          status.appendChild(booking);
          form.reset();
          btn.textContent = 'Demande envoyée';
        } else {
          throw new Error(data.error || 'Erreur lors de l’envoi');
        }
      } catch (err) {
        status.className = 'lp-form__status is-error';
        status.textContent = 'Une erreur est survenue. Vos réponses sont conservées : réessayez, ou écrivez directement à contact@purity-agency.be';
        btn.textContent = 'Réessayer';
      } finally {
        sending = false;
        btn.removeAttribute('aria-busy');
      }
    });
  }
});
