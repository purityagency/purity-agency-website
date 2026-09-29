(function () {
  var method = document.querySelector('.method');
  if (!method || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lastY = window.scrollY;
  var targetX = 0;
  var targetY = 0;
  var targetPull = 1;
  var currentX = 0;
  var currentY = 0;
  var currentPull = 1;
  var raf = 0;
  var calmTimer = 0;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function paint() {
    raf = 0;

    currentX += (targetX - currentX) * 0.145;
    currentY += (targetY - currentY) * 0.12;
    currentPull += (targetPull - currentPull) * 0.12;

    method.style.setProperty('--method-wave-x', currentX.toFixed(2));
    method.style.setProperty('--method-wave-y', currentY.toFixed(2));
    method.style.setProperty('--method-wave-pull', currentPull.toFixed(3));

    if (
      Math.abs(targetX - currentX) > 0.05 ||
      Math.abs(targetY - currentY) > 0.05 ||
      Math.abs(targetPull - currentPull) > 0.002
    ) {
      raf = requestAnimationFrame(paint);
    }
  }

  function requestPaint() {
    if (!raf) raf = requestAnimationFrame(paint);
  }

  function onScroll() {
    var rect = method.getBoundingClientRect();
    if (rect.bottom < -140 || rect.top > window.innerHeight + 140) return;

    var y = window.scrollY;
    var velocity = clamp(y - lastY, -54, 54);
    var progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
    targetX = clamp((progress - 0.5) * 44 + velocity * 0.62, -58, 58);
    targetY = 0;
    targetPull = clamp(1 + Math.abs(velocity) / 70, 1, 1.42);
    lastY = y;

    method.classList.add('is-wave-active');
    window.clearTimeout(calmTimer);
    calmTimer = window.setTimeout(function () {
      targetX = 0;
      targetY = 0;
      targetPull = 1;
      method.classList.remove('is-wave-active');
      requestPaint();
    }, 220);

    requestPaint();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
