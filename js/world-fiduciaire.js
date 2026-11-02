// Clarté & Associés : reveal discret des blocs à l'entrée dans le viewport (pas de listener scroll).
(()=>{
  if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const items=document.querySelectorAll('.world-fiduciaire main .section-heading, .world-fiduciaire main .offering, .world-fiduciaire main .story-photo, .world-fiduciaire main .fid-detail-photo, .world-fiduciaire main .process li');
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
  items.forEach((el,i)=>{el.classList.add('fid-reveal');el.style.transitionDelay=(el.matches('.offering, .process li')?(i%4)*70:0)+'ms';io.observe(el);});
})();
