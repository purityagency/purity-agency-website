(function () {
  var dialog = document.querySelector('.demo-dialog');
  var open = document.querySelector('[data-demo-open]');
  if (open && dialog) open.addEventListener('click', function () { dialog.showModal(); });
  if (dialog) {
    dialog.querySelectorAll('[data-demo-close]').forEach(function (button) {
      button.addEventListener('click', function () { dialog.close(); });
    });
    var form = dialog.querySelector('form');
    if (form) form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input');
      var out = form.querySelector('output');
      if (!input || !input.value.trim()) {
        if (input) input.focus();
        if (out) out.textContent = 'Ajoutez quelques mots pour continuer.';
        return;
      }
      if (out) out.textContent = 'Merci, votre demande est prête.';
    });
  }
  document.querySelectorAll('[data-demo-toast]').forEach(function (button) {
    button.addEventListener('click', function () {
      button.textContent = 'Ouvert';
      button.disabled = true;
    });
  });
  var reset = document.querySelector('[data-reset-demo]');
  if (reset) reset.addEventListener('click', function () { location.reload(); });

  var depth = document.querySelector('[data-demo-depth]');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (depth && canHover && !reduced) {
    depth.addEventListener('pointermove', function (event) {
      var rect = depth.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - .5;
      var y = (event.clientY - rect.top) / rect.height - .5;
      depth.style.setProperty('--art-x', (x * -14).toFixed(2) + 'px');
      depth.style.setProperty('--art-y', (y * -10).toFixed(2) + 'px');
    });
    depth.addEventListener('pointerleave', function () {
      depth.style.removeProperty('--art-x');
      depth.style.removeProperty('--art-y');
    });
  }
})();
