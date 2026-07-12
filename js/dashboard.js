(function(){
  var STATUS_ORDER=['paid','kickoff','design','developpement','livraison','maintenance','termine'];
  function show(id){['dash-loading','dash-error','dash-pending','dash-content'].forEach(function(e){var el=document.getElementById(e);if(el)el.style.display=e===id?'':e==='dash-content'&&id==='dash-content'?'':'none';});}
  // Fix: show dash-content as block
  function showContent(){['dash-loading','dash-error','dash-pending'].forEach(function(e){var el=document.getElementById(e);if(el)el.style.display='none';});var c=document.getElementById('dash-content');if(c)c.style.display='';}
  function formatDate(iso){if(!iso)return'—';try{return new Date(iso).toLocaleDateString('fr-BE',{day:'numeric',month:'long',year:'numeric'});}catch(e){return iso.slice(0,10);}}
  function applyTimeline(status){var stages=document.querySelectorAll('#dash-timeline .dash-stage');var idx=STATUS_ORDER.indexOf(status);stages.forEach(function(s){var k=s.getAttribute('data-stage');var si=STATUS_ORDER.indexOf(k);s.classList.remove('is-done','is-current');if(si<idx)s.classList.add('is-done');else if(si===idx)s.classList.add('is-current');});}
  function setText(id,v){var e=document.getElementById(id);if(e)e.textContent=v;}
  function render(order){
    setText('dash-pack-name',order.pack||'');
    setText('dash-client-name','Projet de '+(order.clientName||order.name||'—'));
    setText('dash-order-id-short',(order.id||'').slice(-8));
    setText('dash-order-date',formatDate(order.createdAt));
    setText('dash-deposit',(order.deposit||0)+' €');
    setText('dash-remaining',(order.remaining||0)+' €');
    applyTimeline(order.status||'paid');
    showContent();
  }
  var params=new URLSearchParams(window.location.search);
  var orderId=params.get('order')||'';
  var token=params.get('token')||'';
  if(!orderId||!token){show('dash-error');return;}
  fetch('/api/order/'+encodeURIComponent(orderId)+'?token='+encodeURIComponent(token))
    .then(function(res){if(res.status===403||res.status===404){show('dash-error');return null;}if(!res.ok)throw new Error('server');return res.json();})
    .then(function(order){if(!order)return;if(order.status==='pending'){show('dash-pending');return;}render(order);})
    .catch(function(){show('dash-error');});
})();
