(function(){
  var STATUSES=[
    {v:'pending',l:'En attente de paiement'},
    {v:'paid',l:'Payé — À démarrer'},
    {v:'kickoff',l:'Kickoff en cours'},
    {v:'design',l:'Design & Maquettes'},
    {v:'developpement',l:'Développement'},
    {v:'livraison',l:'Livraison'},
    {v:'maintenance',l:'Maintenance active'},
    {v:'termine',l:'Terminé'}
  ];
  function sLabel(v){var s=STATUSES.find(function(x){return x.v===v;});return s?s.l:v;}
  function sCls(v){if(['paid','kickoff','design','developpement','livraison','maintenance'].indexOf(v)>-1)return 's-paid';if(v==='pending')return 's-pending';if(v==='termine')return 's-termine';return'';}
  function fDate(iso){if(!iso)return'—';try{return new Date(iso).toLocaleDateString('fr-BE',{day:'numeric',month:'short',year:'numeric'});}catch(e){return iso.slice(0,10);}}
  function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function showLogin(){document.getElementById('admin-login').style.display='';document.getElementById('admin-dash').style.display='none';}
  function showDash(){document.getElementById('admin-login').style.display='none';document.getElementById('admin-dash').style.display='';loadOrders();}
  function loadOrders(){
    document.getElementById('admin-orders-loading').style.display='';
    document.getElementById('admin-orders-grid').style.display='none';
    var empty=document.getElementById('admin-orders-empty');
    if(empty)empty.style.display='none';
    fetch('/api/admin/orders').then(function(res){if(res.status===401){showLogin();return null;}if(!res.ok)throw new Error();return res.json();})
    .then(function(data){if(!data)return;renderOrders(data.orders||[]);})
    .catch(function(){document.getElementById('admin-orders-loading').style.display='none';var e=document.getElementById('admin-orders-empty');if(e){e.textContent='Erreur de chargement.';e.style.display='';}});
  }
  function renderOrders(orders){
    var grid=document.getElementById('admin-orders-grid');
    var empty=document.getElementById('admin-orders-empty');
    document.getElementById('admin-orders-loading').style.display='none';
    if(!orders.length){if(empty)empty.style.display='';return;}
    grid.style.display='';
    grid.innerHTML=orders.map(function(o){
      var opts=STATUSES.map(function(s){return'<option value="'+s.v+'"'+(s.v===o.status?' selected':'')+'>'+esc(s.l)+'</option>';}).join('');
      return'<div class="admin-order-card status-'+esc(o.status)+'" data-order-id="'+esc(o.id)+'">'
        +'<div class="admin-order-main">'
        +'<div class="admin-order-top"><span class="admin-order-pack">'+esc(o.pack||'')+'</span><span class="admin-order-status '+sCls(o.status)+'">'+esc(sLabel(o.status))+'</span></div>'
        +'<div class="admin-order-name">'+esc(o.clientName||o.name||'—')+'</div>'
        +'<div class="admin-order-meta">'+esc(o.email||'')+(o.phone?' · '+esc(o.phone):'')+' · '+fDate(o.createdAt)+(o.dashboardUrl?' · <a href="'+esc(o.dashboardUrl)+'" target="_blank" rel="noopener">dashboard</a>':'')+'</div>'
        +'</div>'
        +'<div class="admin-order-actions"><span class="admin-order-deposit">'+(o.deposit||0)+' € payé</span>'
        +'<select class="admin-status-select" data-order-id="'+esc(o.id)+'" aria-label="Statut">'+opts+'</select></div>'
        +'</div>';
    }).join('');
    grid.querySelectorAll('.admin-status-select').forEach(function(sel){
      sel.addEventListener('change',function(){
        var oid=this.getAttribute('data-order-id');var ns=this.value;this.disabled=true;
        fetch('/api/admin/order/'+encodeURIComponent(oid)+'/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:ns})})
        .then(function(res){if(!res.ok)throw new Error();
          var card=grid.querySelector('[data-order-id="'+oid+'"].admin-order-card');
          if(card){card.className='admin-order-card status-'+ns;var b=card.querySelector('.admin-order-status');if(b){b.textContent=sLabel(ns);b.className='admin-order-status '+sCls(ns);}}
        })
        .catch(function(){alert('Erreur. Réessayez.');})
        .finally(function(){sel.disabled=false;});
      });
    });
  }
  var loginForm=document.getElementById('admin-login-form');
  if(loginForm){loginForm.addEventListener('submit',function(e){
    e.preventDefault();
    var pwd=document.getElementById('admin-pwd');var btn=document.getElementById('admin-login-btn');var err=document.getElementById('admin-login-error');
    if(!pwd||!pwd.value)return;btn.disabled=true;btn.textContent='Connexion…';err.textContent='';
    fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pwd.value})})
    .then(function(res){if(res.ok){pwd.value='';showDash();}else{err.textContent='Mot de passe incorrect.';}})
    .catch(function(){err.textContent='Erreur réseau.';})
    .finally(function(){btn.disabled=false;btn.textContent='Accéder';});
  });}
  var logout=document.getElementById('admin-logout');if(logout)logout.addEventListener('click',showLogin);
  var refresh=document.getElementById('admin-refresh');if(refresh)refresh.addEventListener('click',loadOrders);
  fetch('/api/admin/orders').then(function(res){if(res.ok)showDash();else showLogin();}).catch(showLogin);
})();
