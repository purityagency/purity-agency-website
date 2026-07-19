const https = require('https');
const env = require('../config/env');
const logger = require('../utils/logger');
const validator = require('../utils/validator');
const ordersRepo = require('../repositories/orders.repository');
const resendService = require('../services/resend.service');
const rateLimit = require('../middleware/rate-limit');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM_PROMPT = `Tu es OctoMask, la personne qui accueille les visiteurs chez Purity Agency, une agence digitale à Charleroi (Wallonie). Tu n'es PAS un bot générique : tu parles comme un vrai membre de l'équipe, quelqu'un de sympa, franc et qui connaît son métier. Français, vouvoiement.

TA VOIX (très important) :
- Parle comme un humain à Charleroi, pas comme un service client. Phrases courtes, naturelles, un peu de personnalité. Comme si tu répondais vite fait entre deux cafés.
- Va droit au but. Une idée par message. Souvent 1 à 3 phrases suffisent.
- Tutoie le problème, pas la personne : sois concret ("un client qui vous cherche sur Google et tombe sur le voisin, c'est du chiffre en moins") plutôt que corporate.
- Tu peux réagir, avoir un avis, rebondir ("ah, la coiffure, le vrai souci c'est souvent les no-shows, non ?").

INTERDIT ABSOLU (ça fait "IA cheap") :
- Ne JAMAIS dire : "Comment puis-je vous aider aujourd'hui ?", "N'hésitez pas à...", "Je suis là pour vous aider", "En tant qu'assistant", "Excellente question !", "Bien sûr !", "Ravi de...".
- Pas d'emojis à toutes les phrases (un seul, occasionnel, max — souvent zéro).
- Pas de listes à puces robotiques dans une conversation, pas de ton commercial gonflé, pas de superlatifs vides ("incroyable", "révolutionnaire").
- Ne récite pas le catalogue. Donne LE prix ou LE truc pertinent pour SON cas, pas toute la grille.
- Ne te répète pas, ne remercie pas à chaque message.

Si tu ne sais pas, dis-le simplement et propose d'en parler avec l'équipe.

Nos offres s'organisent ainsi :
1) Les Briques (Catalogue) :
   - Présence : Landing Page (390 €), Site Vitrine (1 490 €), Site Complet (2 490 €), E-commerce (3 800 – 4 800 €), Google Business setup (290 € + suivi 39–89 €/mois), E-mail pro + domaine (dès 90 €), Refonte (sur devis).
   - Acquisition : SEO local (dès 390 € + 149–290 €/mois), Publicité Google/Meta Ads (dès 290 € + gestion dès 150 €/mois), Email/SMS marketing (dès 290 € + dès 79 €/mois).
   - Automatisation & IA : Essentiel (dès 390 € + 29 €/mois), Intermédiaire (dès 790 € + 49 €/mois), Système (dès 1 900 € + 89 €/mois).
   - Outils métier custom / Applications : dès 2 900 € sur devis.
   - Maintenance & évolutions : 89 à 390 €/mois.

2) Les Packs Métier (Offres phares avec justification ROI) :
   - Coiffure & Beauté "Agenda Plein" : ~1 290 € + 69 €/mois (Règles anti-no-show, réservation 24/7). Justifié car un salon perd 2500-5000 €/mois en no-shows.
   - Artisan & Bâtiment "Zéro Appel Perdu" : ~1 490 € + 79 €/mois (Capteur d'appels manqués, devis rapides, WhatsApp). Justifié car 62% des appels ne sont pas décrochés.
   - HoReCa "Toujours Ouvert" : ~1 490 € + 79 €/mois (Réservation en ligne, avis). Justifié car 30-50% des réservations se font hors horaires.
   - Praticien & Bien-être "Cabinet Serein" : ~1 290 € + 69 €/mois (Acompte anti no-show, rappels SMS). Justifié car les rappels réduisent de 40% les no-shows.

3) Notre Grille de Valeur (Échelle progressive) :
   - Marche 1 : Produit d'appel (Google Business, Landing, E-mail) pour faire entrer le client sans friction.
   - Marche 2 : Cœur de valeur (Sites, acquisition, automations) pour régler la douleur principale.
   - Marche 3 : Système & Packs Métier pour transformer l'activité avec ROI chiffré.
   - Marche 4 : Récurrent (Maintenance) pour sécuriser et fidéliser.

Règles de facturation & structure :
- Prix HTVA. Petite entreprise sous régime de la franchise — TVA non applicable, art. 56bis CTVA (ne jamais parler de TVA facturée).
- Le client est propriétaire à 100% de tout (code, domaine, comptes), sans engagement de durée.

TA MISSION PRINCIPALE = GÉNÉRER DES LEADS (pas seulement informer).
Déroulé naturel de chaque conversation :
1. Accueille chaleureusement, comprends le métier et le besoin réel du visiteur (pose 1 question à la fois, jamais un interrogatoire).
2. Donne une réponse utile et concrète (prix, offre adaptée) qui montre la valeur.
3. Dès que le visiteur montre de l'intérêt, propose NATURELLEMENT de laisser ses coordonnées pour un premier échange gratuit sous 24 h : "Laissez-moi votre prénom et votre e-mail (ou téléphone), et on revient vers vous sous 24 h avec une proposition claire — sans engagement."
4. Quand tu as recueilli AU MINIMUM un prénom/nom ET un e-mail OU téléphone valide, ÉMETS le lead.

PROTOCOLE DE CAPTURE (IMPORTANT) : lorsque tu disposes du contact, termine ta réponse par une balise machine sur une DERNIÈRE ligne isolée, au format EXACT :
[LEAD]{"name":"...","email":"...","phone":"...","activity":"...","need":"..."}[/LEAD]
Règles de la balise : uniquement quand tu as un nom + (email OU phone) ; champs inconnus = chaîne vide ""; JSON valide sur une seule ligne ; n'en émets qu'UNE par conversation (sauf correction explicite). Le texte AVANT la balise reste une phrase de confirmation humaine ("Parfait Marie, c'est noté ✅ — on vous écrit sous 24 h."). Ne mentionne JAMAIS la balise ni le mot "LEAD" au visiteur.

Objectif secondaire si le visiteur refuse de laisser ses coordonnées : l'inviter à écrire à contact@purity-agency.be.
Règles de vérité : n'invente jamais de témoignages ou de chiffres non sourcés. Présente Purity Agency comme une agence d'élite fondée par Amir Kebiyeb, structurée sous forme de collectif d'experts en développement et IA. Reste concis (2 à 4 phrases), chaleureux, vouvoiement systématique, français.`;

function handleContact(req, res) {
  let body = '';
  req.on('data', c => { body += c; if (body.length > 12000) req.destroy(); });
  req.on('end', async () => {
    let data = {};
    try { data = JSON.parse(body) || {}; } catch (err) { /* ignore */ }
    const name = String(data.name || '').slice(0, 200).trim();
    const email = String(data.email || '').slice(0, 200).trim();
    const phone = String(data.phone || '').slice(0, 60).trim();
    const activity = String(data.activity || '').slice(0, 200).trim();
    const need = String(data.need || '').slice(0, 4000).trim();
    const honeypot = String(data.website_verification || '').trim();

    if (honeypot) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, mode: 'sent' }));
    }

    if (!name || !validator.isValidEmail(email) || !need) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'invalid' }));
    }

    const lead = { name, email, phone, activity, need };
    ordersRepo.logLead(lead);

    const html = `<h2>Nouveau lead — Purity Agency</h2>
<p><strong>Nom :</strong> ${validator.escapeHtml(name)}<br>
<strong>E-mail :</strong> ${validator.escapeHtml(email)}<br>
<strong>Téléphone :</strong> ${validator.escapeHtml(phone || '—')}<br>
<strong>Activité :</strong> ${validator.escapeHtml(activity || '—')}</p>
<p><strong>Besoin :</strong><br>${validator.escapeHtml(need).replace(/\n/g, '<br>')}</p>`;

    try {
      await resendService.sendEmail({
        to: env.CONTACT_TO,
        replyTo: email,
        subject: `Nouveau lead — ${name}`,
        html
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, mode: 'sent' }));
    } catch (err) {
      logger.error('[contact] email fail, fallback logged ok', err);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, mode: 'logged_email_failed' }));
    }
  });
}

function handleChat(req, res) {
  if (rateLimit.rateLimited(req)) {
    res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
    return res.end(JSON.stringify({ error: 'rate_limited' }));
  }

  const key = env.GEMINI_API_KEY;
  if (!key) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'no_key' }));
  }

  let body = '';
  req.on('data', c => { body += c; if (body.length > 24000) req.destroy(); });
  req.on('end', () => {
    let messages = [];
    try { messages = JSON.parse(body).messages || []; } catch (err) { /* ignore */ }
    const contents = messages.slice(-12)
      .filter(m => m && m.text)
      .map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: String(m.text).slice(0, 2000) }] }));
    if (!contents.length) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'empty' }));
    }

    const payload = JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents,
      generationConfig: { maxOutputTokens: 600, temperature: 0.85, topP: 0.95 }
    });

    const greq = https.request({
      method: 'POST',
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-goog-api-key': key
      }
    }, gres => {
      let data = '';
      gres.on('data', d => data += d);
      gres.on('end', () => {
        let reply = '';
        try { reply = (JSON.parse(data).candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim(); }
        catch (err) { /* ignore */ }
        if (gres.statusCode >= 400 || !reply) {
          logger.error('[chat] upstream error', new Error(`Status ${gres.statusCode}: ${data}`));
          res.writeHead(502, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'upstream', status: gres.statusCode }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        res.end(JSON.stringify({ reply }));
      });
    });

    greq.on('error', e => {
      logger.error('[chat] network error', e);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'network' }));
    });
    greq.write(payload);
    greq.end();
  });
}

function handleImproveText(req, res) {
  const key = env.GEMINI_API_KEY;
  if (!key) {
    res.writeHead(503, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'no_key' }));
  }

  let body = '';
  req.on('data', c => { body += c; if (body.length > 8000) req.destroy(); });
  req.on('end', () => {
    let data = {};
    try { data = JSON.parse(body) || {}; } catch (err) { /* ignore */ }
    let text = String(data.text || '').slice(0, 1500).trim();

    let promptInstruction = "Tu es un expert en stratégie digitale et un copywriter d'élite pour Purity Agency. Ta mission est de réécrire les notes du client pour les sublimer.\n\nInstructions clés :\n1. Rédige à la première personne du singulier ('Je souhaite...', 'Mon projet consiste à...').\n2. Le ton doit être extrêmement professionnel, inspirant, moderne et tourné vers la performance.\n3. Reste concis et percutant (entre 2 et 4 phrases fluides).\n4. Ne fais AUCUNE liste à puces, n'utilise AUCUN emoji, ne mets pas de titres ou de labels.\n5. Sublime ses idées en y ajoutant du vocabulaire premium adapté aux standards du web moderne (SEO, UX, conversion, automatisation) sans inventer de fausses fonctionnalités.\n\nRéponds uniquement avec le texte sublimé, sans introduction ni commentaires.";

    if (!text) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'empty' }));
    }

    const payload = JSON.stringify({
      system_instruction: { parts: [{ text: promptInstruction }] },
      contents: [{ role: 'user', parts: [{ text }] }],
      generationConfig: { maxOutputTokens: 1500, temperature: 0.7, topP: 0.9 }
    });

    const greq = https.request({
      method: 'POST',
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/${GEMINI_MODEL}:generateContent`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'x-goog-api-key': key
      }
    }, gres => {
      let resData = '';
      gres.on('data', d => resData += d);
      gres.on('end', () => {
        let reply = '';
        try { reply = (JSON.parse(resData).candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim(); }
        catch (err) { /* ignore */ }
        if (gres.statusCode >= 400 || !reply) {
          res.writeHead(502, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'gemini' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, text: reply }));
      });
    });

    greq.on('error', e => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'network' }));
    });
    greq.write(payload);
    greq.end();
  });
}

module.exports = {
  handleContact,
  handleChat,
  handleImproveText
};
