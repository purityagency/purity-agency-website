/**
 * focus-trap.js — Piège à focus clavier minimal pour les modals (WCAG 2.1.2)
 * Empêche Tab/Shift+Tab de sortir du modal ouvert et restaure le focus à la fermeture.
 */
window.PurityFocusTrap = (function () {
  'use strict';

  var activeContainer = null;
  var lastFocused = null;

  function isVisible(el) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function getFocusable(container) {
    var selector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.prototype.slice.call(container.querySelectorAll(selector)).filter(isVisible);
  }

  function handleKeydown(e) {
    if (e.key !== 'Tab' || !activeContainer) return;

    var focusable = getFocusable(activeContainer);
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (!activeContainer.contains(document.activeElement)) {
      // Focus a fui le conteneur (ex: changement de step DOM) — le ramener dedans
      e.preventDefault();
      first.focus();
    }
  }

  return {
    attach: function (container) {
      activeContainer = container;
      lastFocused = document.activeElement;
      document.addEventListener('keydown', handleKeydown, true);

      var focusable = getFocusable(container);
      if (focusable.length) focusable[0].focus();
    },
    release: function () {
      document.removeEventListener('keydown', handleKeydown, true);
      activeContainer = null;
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
      lastFocused = null;
    }
  };
})();
