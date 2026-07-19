const contactController = require('../controllers/contact.controller');

function handleRoute(req, res, urlPath) {
  if (urlPath === '/api/contact') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return contactController.handleContact(req, res);
  }

  if (urlPath === '/api/chat') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return contactController.handleChat(req, res);
  }

  if (urlPath === '/api/improve-text') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      return res.end('Method Not Allowed');
    }
    return contactController.handleImproveText(req, res);
  }

  return false;
}

module.exports = {
  handleRoute
};
