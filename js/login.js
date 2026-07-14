(function() {
  var form = document.getElementById('login-form');
  var errorEl = document.getElementById('login-error');
  var submitBtn = document.getElementById('login-submit');
  var formView = document.getElementById('login-form-view');
  var successView = document.getElementById('login-success-view');

  if (!form) return;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = 'block';
  }

  function hideError() {
    errorEl.style.display = 'none';
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    hideError();

    var emailInput = document.getElementById('login-email');
    var email = emailInput ? emailInput.value.trim() : '';

    if (!email || email.indexOf('@') === -1) {
      showError("Veuillez entrer une adresse e-mail valide.");
      return;
    }

    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    fetch('/api/client/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('Erreur serveur');
      return res.json();
    })
    .then(function(data) {
      // Pour des raisons de sécurité, le serveur renvoie toujours ok: true
      formView.style.display = 'none';
      successView.style.display = 'flex';
    })
    .catch(function(err) {
      showError("Une erreur est survenue lors de la communication avec le serveur.");
      submitBtn.textContent = "Recevoir mon lien d'accès";
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    });
  });
})();
