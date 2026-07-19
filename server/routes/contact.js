const contactController = require('../controllers/contact.controller');

function handleRoute(req, res, urlPath) {
  // Contrôleurs async (req.on('data'...)) : on retourne `true` nous-mêmes dès
  // que l'URL matche, leur valeur de retour réelle n'est jamais `true`/false.
  if (urlPath === '/api/contact') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    contactController.handleContact(req, res);
    return true;
  }

  if (urlPath === '/api/chat') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    contactController.handleChat(req, res);
    return true;
  }

  if (urlPath === '/api/improve-text') {
    if (req.method !== 'POST') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return true;
    }
    contactController.handleImproveText(req, res);
    return true;
  }

  return false;
}

module.exports = {
  handleRoute
};
