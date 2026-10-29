// Revelation fluide et legere du manifeste du fondateur (sans recalcul par lettre au scroll)
(function () {
  var quote = document.querySelector('.founder__quote');
  if (!quote) return;

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        quote.classList.add('is-in');
        io.disconnect();
      }
    }, { threshold: 0.15 });
    io.observe(quote);
  } else {
    quote.classList.add('is-in');
  }
})();
