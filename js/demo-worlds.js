(() => {
  'use strict';
  const id = document.body.dataset.world;
  const key = `purity-world-v2:${id}`;
  const blank = () => ({cart:[],favorites:[],documents:[],booking:null});
  let state = blank();
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if(value && typeof value==='object') state = {...state,...value};
  } catch {}
  state.cart = Array.isArray(state.cart) ? state.cart.filter(x=>x && Number.isInteger(x.id) && x.id>=0 && x.id<4 && typeof x.title==='string' && Number.isFinite(x.price) && x.price>0 && Number.isInteger(x.qty) && x.qty>0 && x.qty<=20) : [];
  state.favorites = Array.isArray(state.favorites)?state.favorites.filter(x=>Number.isInteger(x)&&x>=0&&x<4):[];
  state.documents = Array.isArray(state.documents)?state.documents.filter(x=>Number.isInteger(x)&&x>=0&&x<4):[];
  const save = () => {try{sessionStorage.setItem(key,JSON.stringify(state));}catch{}};
  const notice = document.querySelector('.live-notice');
  let noticeTimer;
  function announce(text) { if(!notice)return;clearTimeout(noticeTimer);notice.textContent=text;notice.classList.add('is-visible');noticeTimer=setTimeout(()=>notice.classList.remove('is-visible'),2600); }
  const header=document.querySelector('.world-header');
  const toggle=document.querySelector('.menu-toggle');
  if(header&&toggle){header.classList.add('menu-ready');toggle.addEventListener('click',()=>{const open=header.classList.toggle('menu-open');toggle.setAttribute('aria-expanded',String(open));});header.addEventListener('keydown',event=>{if(event.key==='Escape'){header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.focus();}});}
  const params=new URLSearchParams(location.search);
  const catalog=document.querySelector('.catalog');
  if(catalog){
    const filters=[...catalog.querySelectorAll('[data-filter]')];
    function filter(value){const valid=filters.some(b=>b.dataset.filter===value)?value:'Tous';let count=0;catalog.querySelectorAll('[data-category]').forEach(card=>{card.hidden=valid!=='Tous'&&card.dataset.category!==valid;if(!card.hidden)count++;});filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===valid)));const status=catalog.querySelector('.catalog-status');if(status)status.textContent=`${count} ${count>1?'éléments':'élément'} dans cette sélection`;}
    filters.forEach(button=>button.addEventListener('click',()=>filter(button.dataset.filter)));
    if(params.has('filter'))filter(params.get('filter'));
  }
  document.querySelectorAll('[data-favorite]').forEach(button=>{
    const index=Number(button.dataset.favorite);
    function paint(){const selected=state.favorites.includes(index);button.setAttribute('aria-pressed',String(selected));button.textContent=selected?'♥':'♡';}
    paint();button.addEventListener('click',()=>{state.favorites=state.favorites.includes(index)?state.favorites.filter(x=>x!==index):[...state.favorites,index];save();paint();announce(state.favorites.includes(index)?'Bien ajouté à votre sélection.':'Bien retiré de votre sélection.');});
  });
  const money = n => new Intl.NumberFormat('fr-BE',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  function updateCount(){const count=state.cart.reduce((n,x)=>n+x.qty,0);document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=count?` (${count})`:'');}
  function el(tag,text,cls){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(cls)node.className=cls;return node;}
  function renderCart(){
    const target=document.querySelector('[data-cart]');updateCount();if(!target)return;
    target.replaceChildren();
    if(!state.cart.length)target.append(el('p','Votre panier est encore vide. Choisissez une pièce dans la collection.'));
    state.cart.forEach(item=>{
      const article=el('article',undefined,'cart-item');const title=el('h3',item.title);article.append(title,el('p',money(item.price*item.qty)));
      const controls=el('div',undefined,'quantity');const minus=el('button','−');minus.type='button';minus.setAttribute('aria-label',`Diminuer la quantité de ${item.title}`);const plus=el('button','+');plus.type='button';plus.setAttribute('aria-label',`Augmenter la quantité de ${item.title}`);plus.disabled=item.qty>=20;
      controls.append(minus,el('span',String(item.qty)),plus);article.append(controls);
      const remove=el('button','Retirer','remove');remove.type='button';article.append(remove);
      function refresh(){save();renderCart();document.querySelector('[data-cart-status]').textContent='';}
      minus.addEventListener('click',()=>{item.qty--;if(!item.qty)state.cart=state.cart.filter(x=>x.id!==item.id);refresh();});plus.addEventListener('click',()=>{item.qty=Math.min(20,item.qty+1);refresh();});remove.addEventListener('click',()=>{state.cart=state.cart.filter(x=>x.id!==item.id);refresh();});target.append(article);
    });
    document.querySelector('[data-cart-total]').textContent=money(state.cart.reduce((n,x)=>n+x.price*x.qty,0));
  }
  document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.add);const found=state.cart.find(x=>x.id===index);if(found){found.qty=Math.min(20,found.qty+1);}else{state.cart.push({id:index,title:button.dataset.title,price:Number(button.dataset.price),qty:1});}save();updateCount();announce(`${button.dataset.title} ajouté au panier.`);}));
  document.querySelectorAll('[data-finish]').forEach(button=>button.addEventListener('click',()=>{state.cartFinish=button.dataset.finish;save();}));
  renderCart();
  const finishSelect=document.querySelector('[data-cart-finish]');
  if(finishSelect&&state.cartFinish){const map={sable:'Sable',argile:'Argile',foret:'Forêt'};finishSelect.value=map[state.cartFinish]||'Sable';}

  const prepareCart=document.querySelector('[data-cart-prepare]');
  if(prepareCart)prepareCart.addEventListener('click',()=>{const status=document.querySelector('[data-cart-status]');if(!state.cart.length){status.textContent='Ajoutez au moins une pièce à votre panier.';return;}state.booking={kind:'Retrait en boutique',entries:[['Articles',state.cart.map(x=>`${x.qty} × ${x.title}`).join(', ')],['Total',money(state.cart.reduce((n,x)=>n+x.price*x.qty,0))],['Finition',document.querySelector('[data-cart-finish]').value]]};save();status.textContent='Sélection enregistrée dans cet aperçu. Aucun paiement ni commande envoyée.';});
  const form=document.querySelector('[data-local-booking]');
  if(form){
    const choice=form.querySelector('[name=choice]');const requested=params.get('choice');if(requested){const option=[...choice.options].find(o=>o.value===requested||o.value.startsWith(requested));if(option)choice.value=option.value;}
    form.addEventListener('submit',event=>{
      event.preventDefault();if(!form.reportValidity())return;
      const labels={choice:'Votre choix',vehicle:'Véhicule',mileage:'Kilométrage',area:'Surface',horizon:'Horizon',size:'Taille',coat:'Pelage',equipment:'Équipement',building:'Logement',day:'Jour',time:'Créneau',note:'Précision'};
      const entries=[...new FormData(form)].filter(([,value])=>String(value).trim()).map(([name,value])=>[labels[name]||name,String(value).slice(0,800)]);
      state.booking={kind:document.body.dataset.kind,entries};save();const output=form.querySelector('[data-booking-summary]');output.replaceChildren();entries.forEach(([name,value])=>{const row=el('div');row.append(el('dt',name),el('dd',value));output.append(row);});form.querySelector('.booking-result').hidden=false;announce('Votre sélection est prête à consulter.');
    });
  }
  const record=document.querySelector('[data-studio-record]');
  if(record&&state.booking&&Array.isArray(state.booking.entries)){
    record.replaceChildren();const dl=el('dl');state.booking.entries.forEach(pair=>{if(!Array.isArray(pair))return;const row=el('div');row.append(el('dt',String(pair[0]).slice(0,100)),el('dd',String(pair[1]).slice(0,800)));dl.append(row);});record.append(dl,el('p','Dossier de démonstration enregistré dans ce navigateur.'));
  }
  const documents=document.querySelectorAll('[data-document]');
  const docStatus=document.querySelector('[data-document-status]');
  function paintDocs(){if(docStatus)docStatus.textContent=`${state.documents.length} document${state.documents.length>1?'s':''} sur 4 prêt${state.documents.length>1?'s':''}`;}
  documents.forEach(input=>{const index=Number(input.dataset.document);input.checked=state.documents.includes(index);input.addEventListener('change',()=>{state.documents=input.checked?[...new Set([...state.documents,index])]:state.documents.filter(x=>x!==index);save();paintDocs();});});paintDocs();
  const symptoms=['Notez le symbole, sa couleur et le moment où il apparaît. Le manuel du véhicule précise les consignes à suivre.','Décrivez le bruit et les conditions : démarrage, accélération, freinage ou virage.','Précisez la zone touchée et si un élément gêne le roulage ou la fermeture.','Rassemblez le carnet et le kilométrage pour préparer les contrôles adaptés.'];
  document.querySelectorAll('[data-symptom]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-symptom]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('.symptom-response').textContent=symptoms[Number(button.dataset.symptom)];}));
  const temperature=document.querySelector('#temperature');if(temperature)temperature.addEventListener('input',()=>document.querySelector('#temperature-value').textContent=`${temperature.value.replace('.',',')} °C`);
  const materialText={sable:'Sable — Des tons clairs, du grès et des textiles naturels.',argile:'Argile — Des nuances chaudes, du bois et des textures terreuses.',foret:'Forêt — Des verts profonds, du chêne et des touches de céramique.'};
  document.querySelectorAll('[data-material]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-material]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));document.querySelector('[data-material-scene]').dataset.materialScene=button.dataset.material;document.querySelector('[data-material-text]').textContent=materialText[button.dataset.material];}));
  document.querySelectorAll('[data-reset]').forEach(button=>button.addEventListener('click',()=>{state=blank();save();location.reload();}));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-spatial]').forEach(root=>{
    const load=()=>import('/js/demo-spatial.js').then(module=>module.mountSpatial(root)).catch(()=>{root.dataset.spatialState='fallback';});
    if('IntersectionObserver' in window){const loader=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loader.disconnect();load();}},{rootMargin:'400px'});loader.observe(root);}else load();
  });
  if(id==='sport'){
    const hero=document.querySelector('.hero-kinetic');let tick=0;
    const paint=()=>{tick=0;if(!hero||reduced.matches||document.hidden)return;const r=hero.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const progress=Math.max(0,Math.min(1,-r.top/r.height));hero.style.setProperty('--kinetic-x',`${progress*-70}px`);hero.style.setProperty('--kinetic-tilt',`${progress*3}deg`);};
    window.addEventListener('scroll',()=>{if(!tick)tick=requestAnimationFrame(paint);},{passive:true});
  }
  const observer='IntersectionObserver' in window ? new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){if(!reduced.matches)entry.target.classList.add('reveal-visible');observer.unobserve(entry.target);}});},{threshold:.13}):null;
  if(observer)document.querySelectorAll('.section-heading,.story-text,.detail-columns article').forEach(el=>observer.observe(el));
  if(matchMedia('(hover: hover)').matches){document.querySelectorAll('[data-depth]').forEach(photo=>{photo.addEventListener('pointermove',event=>{if(reduced.matches)return;const r=photo.getBoundingClientRect();photo.style.setProperty('--depth-x',`${((event.clientX-r.left)/r.width-.5)*-10}px`);photo.style.setProperty('--depth-y',`${((event.clientY-r.top)/r.height-.5)*-8}px`);});photo.addEventListener('pointerleave',()=>{photo.style.removeProperty('--depth-x');photo.style.removeProperty('--depth-y');});});}
})();
