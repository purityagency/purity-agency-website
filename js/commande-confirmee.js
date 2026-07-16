(function () {
  var params = new URLSearchParams(window.location.search);
  var orderId = params.get('order') || '';
  var isDemo = params.get('demo') === '1';

  if (isDemo) {
    var demoBlock = document.getElementById('confirm-demo');
    var mainCard = document.getElementById('confirm-card');
    if (demoBlock) demoBlock.style.display = '';
    if (mainCard) mainCard.style.display = 'none';

    var demoId = document.getElementById('confirm-demo-order-id');
    if (demoId && orderId) demoId.textContent = 'N° commande : ' + orderId;
    return;
  }

  var orderLabel = document.getElementById('confirm-order-id');
  if (orderLabel && orderId) orderLabel.textContent = 'N° commande : ' + orderId;

  var portalLink = document.getElementById('confirm-dashboard-link');
  if (portalLink) portalLink.href = '/login';
})();
