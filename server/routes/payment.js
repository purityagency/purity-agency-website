const paymentController = require('../controllers/payment.controller');

function handleRoute(req, res, urlPath) {
  // Les contrôleurs traitent la requête de façon asynchrone (req.on('data'...))
  // et ne retournent rien : on doit renvoyer `true` nous-mêmes dès que l'URL
  // matche, sinon app.js croit que la route n'a pas été prise en charge et
  // retombe sur le serveur de fichiers statiques (404 sur une commande en cours).
  if (urlPath === '/api/order/create') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    paymentController.handleOrderCreate(req, res);
    return true;
  }

  if (urlPath === '/api/mollie/webhook') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    paymentController.handleMollieWebhook(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handleRoute,
  clientPortalUrl: paymentController.clientPortalUrl
};
