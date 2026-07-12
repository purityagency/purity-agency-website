(function(){
  var params=new URLSearchParams(window.location.search);
  var orderId=params.get('order')||'';
  var isDemo=params.get('demo')==='1';
  if(isDemo){
    var d=document.getElementById('confirm-demo');
    var m=document.getElementById('confirm-card');
    if(d)d.style.display='';
    if(m)m.style.display='none';
    var did=document.getElementById('confirm-demo-order-id');
    if(did&&orderId)did.textContent='N° commande : '+orderId;
    return;
  }
  var oid=document.getElementById('confirm-order-id');
  if(oid&&orderId)oid.textContent='N° commande : '+orderId;
  var link=document.getElementById('confirm-dashboard-link');
  if(link&&orderId)link.href='/dashboard?order='+encodeURIComponent(orderId);
})();
