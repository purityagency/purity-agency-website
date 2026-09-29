/* Le choix d’une situation révèle une configuration indicative. Il ne simule
   ni devis ni disponibilité : le visiteur comprend l’approche avant le contact. */
(function () {
  var picker = document.querySelector('[data-solution-picker]');
  if (!picker) return;

  var tabs = Array.prototype.slice.call(picker.querySelectorAll('[role="tab"]'));
  var panels = Array.prototype.slice.call(picker.querySelectorAll('[role="tabpanel"]'));

  function select(tab, moveFocus) {
    var key = tab.getAttribute('data-solution');
    tabs.forEach(function (item) {
      var active = item === tab;
      item.classList.toggle('is-selected', active);
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
    });
    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-solution-panel') === key;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });
    if (moveFocus) tab.focus();
  }

  tabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () { select(tab, false); });
    tab.addEventListener('keydown', function (event) {
      var next;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next], true);
    });
  });
})();
