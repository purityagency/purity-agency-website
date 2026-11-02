// Matière Commune : reveal discret des photos à l'entrée (IntersectionObserver, pas de scroll listener)
(()=>{
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=document.querySelectorAll('.offering-media,.story-photo,.detail-photo,.page-heading-photo,.mc-gallery-head');
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(el=>{el.classList.add('mc-reveal');io.observe(el);});
})();
