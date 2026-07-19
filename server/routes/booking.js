const bookingController = require('../controllers/booking.controller');

function handleRoute(req, res, urlPath) {
  if (urlPath === '/api/availability') {
    if (req.method !== 'GET') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    const query = new URLSearchParams(req.url.split('?')[1] || '');
    return bookingController.handleAvailability(req, res, query);
  }

  if (urlPath === '/api/book') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return bookingController.handleBook(req, res);
  }

  return false;
}

module.exports = {
  handleRoute
};
