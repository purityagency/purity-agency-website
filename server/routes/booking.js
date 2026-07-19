const bookingController = require('../controllers/booking.controller');

function handleRoute(req, res, urlPath) {
  // Contrôleurs async : on retourne `true` nous-mêmes dès que l'URL matche.
  if (urlPath === '/api/availability') {
    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    const query = new URLSearchParams(req.url.split('?')[1] || '');
    bookingController.handleAvailability(req, res, query);
    return true;
  }

  if (urlPath === '/api/book') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    bookingController.handleBook(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handleRoute
};
