const paymentController = require('../controllers/payment.controller');

function handleRoute(req, res, urlPath) {
  if (urlPath === '/api/order/create') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return paymentController.handleOrderCreate(req, res);
  }

  if (urlPath === '/api/mollie/webhook') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return paymentController.handleMollieWebhook(req, res);
  }

  return false;
}

module.exports = {
  handleRoute,
  clientPortalUrl: paymentController.clientPortalUrl
};
