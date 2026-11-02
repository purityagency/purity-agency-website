(()=>{'use strict';
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
const els=document.querySelectorAll('.groom-list .offering,.pd-rail li,.pd-detail-photo,.story-photo,.pd-band figure,.questions details');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('pd-in');io.unobserve(e.target);}}),{threshold:.12,rootMargin:'0px 0px -40px 0px'});
els.forEach((el,i)=>{el.classList.add('pd-reveal');el.style.transitionDelay=`${(i%4)*70}ms`;io.observe(el);});
})();
