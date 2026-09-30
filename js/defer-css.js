// Active les feuilles de style pre-chargees (rel="preload" as="style") pour les
// sections sous la ligne de flottaison : le fetch demarre des le <head> (preload),
// seule l'application est retardee de quelques millisecondes, le temps que ce
// script s'execute -> evite qu'elles bloquent le premier rendu.
document.querySelectorAll('link[rel="preload"][as="style"]').forEach(function (preload) {
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = preload.href;
  preload.after(sheet);
});
