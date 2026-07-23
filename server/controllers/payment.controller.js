const https = require('https');
const http = require('http');
const crypto = require('crypto');
const env = require('../config/env');
const logger = require('../utils/logger');
const validator = require('../utils/validator');
const ordersRepo = require('../repositories/orders.repository');
const mollieService = require('../services/mollie.service');
const resendService = require('../services/resend.service');
const rateLimit = require('../middleware/rate-limit');

const BRIQUE_DATA = {
  'landing':         { name: 'Landing Page',              price: 390,  mode: 'once'  },
  'vitrine':         { name: 'Site Vitrine',              price: 1490, mode: 'once'  },
  'complet':         { name: 'Site Complet',              price: 2490, mode: 'once'  },
  'ecommerce':       { name: 'E-commerce',                price: 3490, mode: 'once'  },
  'google-biz':      { name: 'Fiche Google Business',     price: 290,  mode: 'once'  },
  'email-pro':       { name: 'Email Professionnel',       price: 90,   mode: 'once'  },
  'seo-local':       { name: 'SEO Local',                 price: 490,  mode: 'month' },
  'pub-google':      { name: 'Pub Google / Meta',         price: 390,  mode: 'month' },
  'visuels-rs':      { name: 'Pack Visuels Réseaux',      price: 290,  mode: 'month' },
  'contenu-mensuel': { name: 'Contenu Mensuel',           price: 390,  mode: 'month' },
  'ia-n1':           { name: 'IA N1 – Réponses auto',     price: 290,  mode: 'once'  },
  'ia-n2':           { name: 'IA N2 – Réservation',       price: 490,  mode: 'once'  },
  'ia-n3':           { name: 'IA N3 – Sur-mesure',        price: 990,  mode: 'once'  },
  'email-sms':       { name: 'Séquences Email / SMS',     price: 290,  mode: 'once'  },
  'facturation':     { name: 'Facturation Peppol',        price: 390,  mode: 'once'  },
  'app-metier':      { name: 'Application Métier',        price: 2490, mode: 'once'  },
  'maintenance':     { name: 'Maintenance Mensuelle',     price: 149,  mode: 'month' },
  'identite':        { name: 'Identité Visuelle',         price: 690,  mode: 'once'  },
  'visuels-graph':   { name: 'Visuels & Photos',          price: 290,  mode: 'once'  },
  'videos':          { name: 'Vidéos & Contenus',         price: 490,  mode: 'once'  },
  'pack-booking':    { name: 'Pack Booking Pro',          price: 249,  mode: 'month' },
  'pack-visibilite': { name: 'Pack Visibilité Locale',    price: 179,  mode: 'month' },
  'pack-resto':      { name: 'Pack Resto & Table',        price: 199,  mode: 'month' },
  'pack-vitrine':    { name: 'Pack Vitrine Pro',          price: 149,  mode: 'month' },
  'hebergement':     { name: 'Hébergement Pro',           price: 49,   mode: 'month' },
  'monitoring':      { name: 'Monitoring & Alertes 24/7', price: 29,   mode: 'month' }
};

function clientPortalUrl() {
  const value = (process.env.CLIENT_PORTAL_URL || '').trim();
  if (/^https?:\/\/[^/\s]+(?::\d+)?$/i.test(value)) return value;
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
}

function provisionPortalClient(order) {
  const portalUrl = clientPortalUrl();
  if (!portalUrl) return Promise.reject(new Error('portal_url_missing'));
  const internalSecret = env.INTERNAL_API_SECRET;
  if (!internalSecret) return Promise.reject(new Error('internal_secret_missing'));

  const endpoint = new URL('/api/internal/provision', portalUrl);
  const payload = JSON.stringify({
    email: order.email,
    name: order.clientName || order.company,
    projectName: order.pack,
    orderId: order.id,
    sector: order.sector,
    totalPrice: order.price,
    depositAmount: order.deposit,
    remainingAmount: order.remaining,
    monthlyAmount: order.monthly
  });
  const lib = endpoint.protocol === 'https:' ? https : http;

  return new Promise((resolve, reject) => {
  const req = lib.request({
    method: 'POST',
    hostname: endpoint.hostname,
    port: endpoint.port || (endpoint.protocol === 'https:' ? 443 : 80),
    path: endpoint.pathname,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
      'Authorization': `Bearer ${internalSecret}`
    }
  }, res => {
    let d = '';
    res.on('data', x => d += x);
    res.on('end', () => {
      if (res.statusCode >= 400) return reject(new Error(`Status ${res.statusCode}: ${d}`));
      resolve(d);
    });
  });
  req.on('error', reject);
  req.write(payload);
  req.end();
  });
}

function handleOrderCreate(req, res) {
  if (rateLimit.rateLimited(req)) {
    res.writeHead(429, { 'Retry-After': '60' });
    return res.end();
  }

  let body = '';
  req.on('data', c => { body += c; if (body.length > 4000) req.destroy(); });
  req.on('end', async () => {
    let data = {};
    try { data = JSON.parse(body) || {}; } catch (err) { /* ignore */ }

    // Honeypot check
    if (String(data.website_verification || '').trim()) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true }));
    }

    const briqueId = String(data.serviceId || '').trim().toLowerCase();
    const intake = (data.intake && typeof data.intake === 'object') ? data.intake : {};

    let sector, name, email, phone, company, pack;

    if (briqueId) {
      const brique = BRIQUE_DATA[briqueId];
      if (!brique) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'invalid_sector' }));
      }
      sector = 'brique:' + briqueId;
      name = (String(intake.fname || '').trim() + ' ' + String(intake.lname || '').trim()).trim().slice(0, 200);
      email = String(intake.email || '').slice(0, 200).trim();
      phone = String(intake.phone || '').slice(0, 60).trim();
      company = String(intake.business_name || '').slice(0, 200).trim();
      const monthly = brique.mode === 'month' ? brique.price : 0;
      pack = { name: brique.name, pack: brique.name, price: brique.price, deposit: brique.price, remaining: 0, monthly };
    } else {
      sector = String(data.sector || '').trim().toLowerCase();
      name = String(data.name || '').slice(0, 200).trim();
      email = String(data.email || '').slice(0, 200).trim();
      phone = String(data.phone || '').slice(0, 60).trim();
      company = String(data.company || '').slice(0, 200).trim();
      if (!mollieService.PACK_DATA[sector]) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'invalid_sector' }));
      }
      pack = mollieService.PACK_DATA[sector];
    }

    // Brief business collecté à l'étape 2 du tunnel Packs Métier (facultatif,
    // absent pour le tunnel briques qui a son propre `intake`)
    const brief = (data.brief && typeof data.brief === 'object') ? {
      business_name: String(data.brief.business_name || '').slice(0, 200).trim(),
      city: String(data.brief.city || '').slice(0, 200).trim(),
      existing_site: String(data.brief.existing_site || '').slice(0, 30).trim(),
      goal: String(data.brief.goal || '').slice(0, 300).trim()
    } : null;

    if (!name || !validator.isValidEmail(email)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid_contact' }));
    }

    const id = 'ord_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
    const appBaseUrl = env.BASE_URL;
    if (!appBaseUrl) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'base_url_not_configured' }));
    }

    const hasMonthly = Number(pack.monthly) > 0;
    const order = {
      id,
      sector,
      pack: pack.pack,
      name: pack.name,
      price: pack.price,
      deposit: pack.deposit,
      remaining: pack.remaining,
      monthly: pack.monthly,
      clientName: name,
      company,
      email,
      phone,
      status: 'pending',
      createdAt: new Date().toISOString(),
      molliePaymentId: '',
      mollieCustomerId: '',
      mollieSubscriptionId: '',
      dashboardUrl: `${appBaseUrl}/login`
    };
    if (briqueId) order.intake = intake;
    if (brief) order.brief = brief;

    try {
      ordersRepo.writeOrder(order);
    } catch (e) {
      logger.error('[order] write storage error', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'storage' }));
    }

    ordersRepo.logLead({ name, email, phone, activity: sector, need: `[COMMANDE] ${pack.pack} — ${pack.deposit}€ acompte` });

    if (!mollieService.isMollieConfigured()) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'mollie_not_configured' }));
    }

    try {
      const webhookUrl = `${appBaseUrl}/api/mollie/webhook`;
      const redirectUrl = `${appBaseUrl}/commande-confirmee?order=${id}`;

      let mollieCustomerId = '';
      if (hasMonthly) {
        const customer = await mollieService.mollieRequest('POST', '/customers', { name, email });
        mollieCustomerId = customer.id;
      }

      const payment = await mollieService.mollieRequest('POST', '/payments', {
        amount: { currency: 'EUR', value: (pack.deposit).toFixed(2) },
        description: `Acompte — ${pack.pack} (Purity Agency)`,
        redirectUrl,
        webhookUrl,
        metadata: { orderId: id },
        ...(mollieCustomerId ? { customerId: mollieCustomerId, sequenceType: 'first' } : {})
      });

      order.molliePaymentId = payment.id;
      order.mollieCustomerId = mollieCustomerId;
      ordersRepo.writeOrder(order);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ sessionUrl: payment._links.checkout.href }));
    } catch (e) {
      logger.error('[order] mollie api error', e);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'mollie_error' }));
    }
  });
}

function handleMollieWebhook(req, res) {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 4000) req.destroy(); });
  req.on('end', async () => {
    const params = new URLSearchParams(body);
    const paymentId = params.get('id') || '';
    if (!paymentId) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      return res.end('missing id');
    }

    let payment;
    try {
      payment = await mollieService.mollieRequest('GET', `/payments/${encodeURIComponent(paymentId)}`);
    } catch (e) {
      logger.error('[webhook] mollie fetch error', e);
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      return res.end('fetch failed');
    }

    const orderId = payment.metadata?.orderId || '';
    const order = orderId ? ordersRepo.readOrder(orderId) : ordersRepo.findOrderByMolliePayment(paymentId);

    if (order && payment.status === 'paid') {
      const processingAt = order.webhookProcessingAt ? Date.parse(order.webhookProcessingAt) : 0;
      const processingFresh = processingAt > 0 && (Date.now() - processingAt) < 10 * 60 * 1000;
      if (order.status === 'pending' && !processingFresh) {
        // Durable idempotency guard: duplicate Mollie deliveries cannot re-provision
        // while the first delivery is still executing.
        order.webhookProcessingAt = new Date().toISOString();
        ordersRepo.writeOrder(order);
        order.status = 'paid';
        order.paidAt = new Date().toISOString();
        ordersRepo.writeOrder(order);

        order.provisioningStatus = 'pending';
        ordersRepo.writeOrder(order);
        provisionPortalClient(order).then(() => {
          order.provisioningStatus = 'completed';
          order.provisionedAt = new Date().toISOString();
          ordersRepo.writeOrder(order);
        }).catch(err => {
          order.provisioningStatus = 'failed';
          order.provisioningError = err.message;
          ordersRepo.writeOrder(order);
          logger.error('[provision] failed', err);
        });

        if (order.mollieCustomerId && Number(order.monthly) > 0 && !order.mollieSubscriptionId) {
          try {
            const appBaseUrl = env.BASE_URL;
            const subPayload = {
              amount: { currency: 'EUR', value: Number(order.monthly).toFixed(2) },
              interval: '1 month',
              description: `Suivi mensuel — ${order.pack}`,
              webhookUrl: `${appBaseUrl}/api/mollie/webhook`
            };
            if (Number(order.deposit) === Number(order.monthly)) {
              const d = new Date();
              d.setMonth(d.getMonth() + 1);
              subPayload.startDate = d.toISOString().slice(0, 10);
            }
            const subscription = await mollieService.mollieRequest('POST', `/customers/${encodeURIComponent(order.mollieCustomerId)}/subscriptions`, subPayload);
            order.mollieSubscriptionId = subscription.id;
            ordersRepo.writeOrder(order);
          } catch (e) {
            logger.error('[webhook] mollie subscription creation error', e);
          }
        }

        const companyLine = order.company ? `<br><strong>Entreprise :</strong> ${validator.escapeHtml(order.company)}` : '';
        const bceLine = order.bce ? `<br><strong>N° BCE / TVA :</strong> ${validator.escapeHtml(validator.formatBCE(order.bce))}` : '';

        const html = `<div style="font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #222; background: #09060e;">
<h2 style="color: #7c3aed; margin-top: 0;">Reçu de Commande — Purity Agency</h2>
<p style="color: #ddd;">Bonjour <strong>${validator.escapeHtml(order.clientName)}</strong>,</p>
<p style="color: #ddd;">Votre ${Number(order.remaining) > 0 ? 'acompte' : 'paiement'} de <strong style="color: #fff;">${order.deposit} €</strong> pour <strong>${validator.escapeHtml(order.pack)}</strong> a bien été confirmé.</p>
<div style="background: rgba(124, 58, 237, 0.1); border-left: 3px solid #7c3aed; padding: 12px 16px; margin: 20px 0; color: #eee;">
  <strong>Détails du projet :</strong> ${validator.escapeHtml(order.pack)}${companyLine}${bceLine}<br>
  <strong>Référence commande :</strong> <code>${validator.escapeHtml(order.id)}</code>
</div>
<p style="color: #ddd;"><strong>Espace Client dédié :</strong><br>
<a href="${validator.escapeHtml(order.dashboardUrl)}" style="color: #7c3aed; text-decoration: underline;">${validator.escapeHtml(order.dashboardUrl)}</a></p>
<p style="color: #aaa; font-size: 0.85rem; margin-top: 30px; border-top: 1px solid #333; padding-top: 15px;">
  Purity Agency — BCE 1036.775.590 — Charleroi, Wallonie, Belgique<br>
  <em>${validator.VAT_FRANCHISE_MENTION}</em>
</p>
</div>`;

        resendService.sendEmail({
          to: [order.email],
          subject: `Confirmation de commande — ${order.pack} (Ref: ${order.id})`,
          html
        }).catch(err => logger.error('[webhook] resend email fail', err));

        ordersRepo.logLead({ name: order.clientName, email: order.email, phone: order.phone || '', activity: order.sector, need: `[PAYÉ] ${order.pack} — ${order.deposit}€` });
      }
    }

    if (order && payment.sequenceType === 'recurring' && ['failed', 'expired', 'canceled'].includes(payment.status)) {
      ordersRepo.logLead({ name: order.clientName, email: order.email, phone: order.phone || '', activity: order.sector, need: `[ÉCHEC PRÉLÈVEMENT] Suivi mensuel — ${order.pack}` });
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: true }));
  });
}

module.exports = {
  handleOrderCreate,
  handleMollieWebhook,
  clientPortalUrl
};
