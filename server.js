const http   = require('http');
const https  = require('https');
const fs     = require('fs');
const path   = require('path');
const zlib   = require('zlib');
const crypto = require('crypto');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT = __dirname;
const LEADS_DIR = path.join(ROOT, '..', 'data');
// Clés API hors du web root — jamais servies, même en cas de bug de path traversal
const SECRETS_DIR = path.join(ROOT, '..', 'secrets');

const ORDERS_DIR = path.join(__dirname, '..', 'data', 'orders');

/* ── Stripe (côté serveur uniquement — pas de Stripe.js frontend) ── */
function stripeKey() {
    if (process.env.STRIPE_SECRET_KEY) return process.env.STRIPE_SECRET_KEY.trim();
    try { return fs.readFileSync(path.join(SECRETS_DIR, '.stripe-key'), 'utf8').trim(); }
    catch { return ''; }
}
function stripeWebhookSecret() {
    if (process.env.STRIPE_WEBHOOK_SECRET) return process.env.STRIPE_WEBHOOK_SECRET.trim();
    try { return fs.readFileSync(path.join(SECRETS_DIR, '.stripe-webhook-secret'), 'utf8').trim(); }
    catch { return ''; }
}

/* ── Dashboard HMAC token ── */
function dashboardSecret() {
    if (process.env.DASHBOARD_SECRET) return process.env.DASHBOARD_SECRET.trim();
    try { return fs.readFileSync(path.join(SECRETS_DIR, '.dashboard-secret'), 'utf8').trim(); }
    catch { return ''; }
}
function makeDashboardToken(orderId) {
    return crypto.createHmac('sha256', dashboardSecret()).update(orderId).digest('hex');
}
function validDashboardToken(orderId, token) {
    if (!token || token.length !== 64) return false;
    try {
        const expected = Buffer.from(makeDashboardToken(orderId), 'hex');
        const actual = Buffer.from(token, 'hex');
        if (expected.length !== actual.length) return false;
        return crypto.timingSafeEqual(expected, actual);
    } catch { return false; }
}

/* ── Admin session (in-memory, redémarre si le serveur redémarre) ── */
const ADMIN_SESSIONS = new Map();
setInterval(() => {
    const cutoff = Date.now() - 24 * 3600 * 1000;
    for (const [k, v] of ADMIN_SESSIONS) if (v.at < cutoff) ADMIN_SESSIONS.delete(k);
}, 3600 * 1000).unref();

function getAdminSession(req) {
    const cookie = req.headers['cookie'] || '';
    const m = cookie.match(/admin_session=([a-f0-9]{64})/);
    return m ? ADMIN_SESSIONS.has(m[1]) : false;
}

function adminPasswordHash() {
    try {
        const raw = fs.readFileSync(path.join(SECRETS_DIR, '.admin-password'), 'utf8');
        const line = raw.split('\n').find(l => l.trim() && !l.startsWith('#'));
        return line ? line.trim() : '';
    } catch { return ''; }
}

/* ── Pack data (prix en euros, acompte 30%) ── */
const PACK_DATA = {
    coiffure:  { name: 'Coiffure & Beauté',      pack: 'Pack Agenda Plein',       price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
    artisan:   { name: 'Artisan & Bâtiment',      pack: 'Pack Zéro Appel Perdu',   price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
    horeca:    { name: 'HoReCa & Restauration',   pack: 'Pack Toujours Ouvert',    price: 1490, deposit: 447, remaining: 1043, monthly: 79 },
    praticien: { name: 'Praticien & Bien-être',   pack: 'Pack Cabinet Serein',     price: 1290, deposit: 387, remaining: 903,  monthly: 69 },
};

/* ── Ordre JSON helpers ── */
function readOrder(orderId) {
    // Sécurité : interdire les path traversal
    if (!/^ord_[0-9]+_[a-z0-9]{6}$/.test(orderId)) return null;
    try {
        const filePath = path.join(ORDERS_DIR, orderId + '.json');
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch { return null; }
}
function writeOrder(order) {
    fs.mkdirSync(ORDERS_DIR, { recursive: true });
    fs.writeFileSync(path.join(ORDERS_DIR, order.id + '.json'), JSON.stringify(order, null, 2), 'utf8');
}
const VALID_STATUSES = ['pending', 'paid', 'kickoff', 'design', 'developpement', 'livraison', 'maintenance', 'termine'];

/* ── Security headers (appliqués à chaque réponse) ── */
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self'",
        "img-src 'self' data:",
        "media-src 'self'",
        "connect-src 'self'",
        "frame-ancestors 'none'",
    ].join('; '),
};
function setSecurityHeaders(res) {
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.setHeader(k, v);
}

function isPlaceholderSecret(value, prefix) {
    return !value || value.startsWith(prefix + '_PLACEHOLDER');
}
function baseUrl() {
    const value = (process.env.BASE_URL || '').trim();
    return /^https:\/\/[^/\s]+$/i.test(value) ? value : '';
}
function isBookingConfigured() {
    const serviceAccount = googleServiceAccount();
    return Boolean(BOOKING.calendarId && serviceAccount?.client_email && serviceAccount?.private_key);
}
function isStripeCheckoutConfigured() {
    const key = stripeKey();
    return Boolean(key && !isPlaceholderSecret(key, 'sk_test') && !isPlaceholderSecret(key, 'sk_live'));
}
function isStripeWebhookConfigured() {
    const secret = stripeWebhookSecret();
    return Boolean(secret && !secret.startsWith('whsec_PLACEHOLDER'));
}

/* ── Origin check (bloque les requêtes cross-origin sur les APIs) ── */
const ALLOWED_ORIGINS = new Set([
    'https://purity-agency.be',
    'https://www.purity-agency.be',
    `http://localhost:${PORT}`,
    `http://127.0.0.1:${PORT}`,
]);
function isOriginAllowed(req) {
    const origin = req.headers['origin'] || '';
    const referer = req.headers['referer'] || '';
    // Pas d'Origin header = requête same-origin (navigation classique)
    if (!origin && !referer) return true;
    if (ALLOWED_ORIGINS.has(origin)) return true;
    for (const allowed of ALLOWED_ORIGINS) {
        if (referer.startsWith(allowed)) return true;
    }
    return false;
}

/* ── Compressible MIME types ── */
const COMPRESSIBLE = new Set([
    'text/html; charset=utf-8', 'text/css', 'application/javascript',
    'image/svg+xml', 'application/xml', 'text/plain; charset=utf-8', 'application/json',
]);

/* ── Assistant IA (proxy Gemini, clé côté serveur uniquement) ── */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
function geminiKey() {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
    try { return fs.readFileSync(path.join(SECRETS_DIR, '.gemini-key'), 'utf8').trim(); }
    catch { return ''; }
}
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
Règles de vérité : n'invente jamais de témoignages, de chiffres non sourcés ou de nom de fondateur (ne cite jamais Amir, présente l'agence comme un collectif). Reste concis (2 à 4 phrases), chaleureux, vouvoiement systématique, français.`;

/* ── Rate-limit simple par IP (protège le quota Gemini) ── */
const RATE = { windowMs: 60_000, max: 20 };
const rateMap = new Map();
function rateLimited(req) {
    // Derrière un reverse proxy, remoteAddress = IP du proxy → tous les visiteurs
    // partageraient le même bucket. X-Forwarded-For donne la vraie IP client.
    const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    const ip = fwd || req.socket.remoteAddress || '?';
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (!entry || now - entry.start > RATE.windowMs) {
        rateMap.set(ip, { start: now, count: 1 });
        return false;
    }
    entry.count++;
    return entry.count > RATE.max;
}
setInterval(() => {
    const now = Date.now();
    for (const [ip, e] of rateMap) if (now - e.start > RATE.windowMs) rateMap.delete(ip);
}, 5 * 60_000).unref();

function handleChat(req, res) {
    if (rateLimited(req)) {
        res.writeHead(429, { 'Content-Type': 'application/json', 'Retry-After': '60' });
        return res.end(JSON.stringify({ error: 'rate_limited' }));
    }
    const key = geminiKey();
    if (!key) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'no_key' }));
    }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 24000) req.destroy(); });
    req.on('end', () => {
        let messages = [];
        try { messages = JSON.parse(body).messages || []; } catch { /* ignore */ }
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
            generationConfig: { maxOutputTokens: 600, temperature: 0.85, topP: 0.95 },
        });
        const greq = https.request({
            method: 'POST',
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${GEMINI_MODEL}:generateContent`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'x-goog-api-key': key,
            },
        }, gres => {
            let data = '';
            gres.on('data', d => data += d);
            gres.on('end', () => {
                let reply = '';
                try { reply = (JSON.parse(data).candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim(); }
                catch { /* ignore */ }
                if (gres.statusCode >= 400 || !reply) {
                    console.error('[chat] upstream', gres.statusCode, data.slice(0, 400));
                    res.writeHead(502, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'upstream', status: gres.statusCode }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
                res.end(JSON.stringify({ reply }));
            });
        });
        greq.on('error', e => {
            console.error('[chat] network', e.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'network' }));
        });
        greq.write(payload);
        greq.end();
    });
}

function handleImproveText(req, res) {
    const key = geminiKey();
    if (!key) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'no_key' }));
    }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 8000) req.destroy(); });
    req.on('end', () => {
        let data = {};
        try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        let text = String(data.text || '').slice(0, 1500).trim();
        
        let promptInstruction = "Tu es un expert en stratégie digitale et un copywriter d'élite pour Purity Agency. Ta mission est de réécrire les notes du client pour les sublimer.\n\nInstructions clés :\n1. Rédige à la première personne du singulier ('Je souhaite...', 'Mon projet consiste à...').\n2. Le ton doit être extrêmement professionnel, inspirant, moderne et tourné vers la performance.\n3. Reste concis et percutant (entre 2 et 4 phrases fluides).\n4. Ne fais AUCUNE liste à puces, n'utilise AUCUN emoji, ne mets pas de titres ou de labels.\n5. Sublime ses idées en y ajoutant du vocabulaire premium adapté aux standards du web moderne (SEO, UX, conversion, automatisation) sans inventer de fausses fonctionnalités.\n\nRéponds uniquement avec le texte sublimé, sans introduction ni commentaires.";
        let userPrompt = text;
        
        if (!text) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'empty' }));
        }
        
        const payload = JSON.stringify({
            system_instruction: { parts: [{ text: promptInstruction }] },
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
            generationConfig: { maxOutputTokens: 1500, temperature: 0.7, topP: 0.9 },
        });

        const greq = https.request({
            method: 'POST',
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${GEMINI_MODEL}:generateContent`,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'x-goog-api-key': key,
            },
        }, gres => {
            let resData = '';
            gres.on('data', d => resData += d);
            gres.on('end', () => {
                let reply = '';
                try { reply = (JSON.parse(resData).candidates?.[0]?.content?.parts || []).map(p => p.text).join('').trim(); }
                catch { /* ignore */ }
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

/* ── Contact (lead) : envoi email via Resend, fallback log fichier ── */
// NB Resend en mode test (domaine non vérifié) : from doit rester onboarding@resend.dev
// et to doit être l'email du compte Resend. Après vérification DNS de purity-agency.be,
// passer CONTACT_FROM sur 'Purity Agency <contact@purity-agency.be>' et CONTACT_TO sur contact@purity-agency.be.
const CONTACT_TO = process.env.CONTACT_TO || 'contact.purityagency@gmail.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'Purity Agency <onboarding@resend.dev>';
function resendKey() {
    if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
    try { return fs.readFileSync(path.join(SECRETS_DIR, '.resend-key'), 'utf8').trim(); }
    catch { return ''; }
}
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function logLead(lead) {
    const line = JSON.stringify({ at: new Date().toISOString(), ...lead }) + '\n';
    try {
        fs.mkdirSync(LEADS_DIR, { recursive: true });
        fs.appendFileSync(path.join(LEADS_DIR, 'leads.log'), line);
    } catch { /* ignore */ }
}
function handleContact(req, res) {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 12000) req.destroy(); });
    req.on('end', () => {
        let data = {};
        try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        const name = String(data.name || '').slice(0, 200).trim();
        const email = String(data.email || '').slice(0, 200).trim();
        const phone = String(data.phone || '').slice(0, 60).trim();
        const activity = String(data.activity || '').slice(0, 200).trim();
        const need = String(data.need || '').slice(0, 4000).trim();
        const honeypot = String(data.website_verification || '').trim();

        // Honeypot anti-spam check (silently drop bot submissions)
        if (honeypot) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ ok: true, mode: 'sent' }));
        }

        // Validation minimale
        if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !need) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'invalid' }));
        }

        const lead = { name, email, phone, activity, need };
        logLead(lead); // capture immédiate — 0 lead perdu même sans clé

        const key = resendKey();
        if (!key) {
            // Pas de clé : le lead est loggé, on répond OK (branchement email plus tard)
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ ok: true, mode: 'logged' }));
        }

        const html = `<h2>Nouveau lead — Purity Agency</h2>
<p><strong>Nom :</strong> ${escapeHtml(name)}<br>
<strong>E-mail :</strong> ${escapeHtml(email)}<br>
<strong>Téléphone :</strong> ${escapeHtml(phone || '—')}<br>
<strong>Activité :</strong> ${escapeHtml(activity || '—')}</p>
<p><strong>Besoin :</strong><br>${escapeHtml(need).replace(/\n/g, '<br>')}</p>`;
        const payload = JSON.stringify({
            from: CONTACT_FROM, to: [CONTACT_TO], reply_to: email,
            subject: `Nouveau lead — ${name}`, html,
        });
        const rreq = https.request({
            method: 'POST',
            hostname: 'api.resend.com',
            path: '/emails',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                'Authorization': `Bearer ${key}`,
            },
        }, rres => {
            let d = '';
            rres.on('data', x => d += x);
            rres.on('end', () => {
                if (rres.statusCode >= 400) {
                    console.error('[contact] resend', rres.statusCode, d.slice(0, 300));
                    // Email échoué mais lead loggé → on ne perd rien
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ ok: true, mode: 'logged_email_failed' }));
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true, mode: 'sent' }));
            });
        });
        rreq.on('error', e => {
            console.error('[contact] network', e.message);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true, mode: 'logged_network_error' }));
        });
        rreq.write(payload);
        rreq.end();
    });
}

/* ══════════════════════════════════════════════════════════════════════════
   RÉSERVATION — calendrier maison connecté à Google Calendar (compte de service)
   Le navigateur ne parle qu'à /api/availability et /api/book (même origine).
   Google n'est contacté que côté serveur → zéro tiers/cookie côté visiteur.
   ══════════════════════════════════════════════════════════════════════════ */
const BOOKING = {
    // ID du calendrier : e-mail du calendrier partagé avec le compte de service
    calendarId: process.env.BOOKING_CALENDAR_ID || '',
    timezone: process.env.BOOKING_TZ || 'Europe/Brussels',
    slotMinutes: 15,          // durée d'un créneau
    minNoticeMinutes: 120,    // pas de RDV à moins de 2 h
    advanceDays: 21,          // réservable jusqu'à 21 jours à l'avance
    meetingLink: process.env.BOOKING_MEETING_LINK || '', // lien Meet fixe (optionnel)
    // Plages d'ouverture par jour (0=dim … 6=sam), heures locales BOOKING.timezone
    hours: {
        1: [['09:00', '18:00']],
        2: [['09:00', '18:00']],
        3: [['09:00', '18:00']],
        4: [['09:00', '18:00']],
        5: [['09:00', '17:00']],
    },
};

/* Compte de service Google (JSON téléchargé depuis Google Cloud) */
function googleServiceAccount() {
    if (process.env.GOOGLE_SERVICE_ACCOUNT) {
        try { return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT); } catch { return null; }
    }
    try { return JSON.parse(fs.readFileSync(path.join(SECRETS_DIR, '.google-service-account.json'), 'utf8')); }
    catch { return null; }
}

/* Jeton d'accès OAuth2 via JWT signé (RS256) — mis en cache ~55 min */
let _gTokenCache = { token: '', exp: 0 };
function getGoogleToken(cb) {
    const now = Date.now();
    if (_gTokenCache.token && now < _gTokenCache.exp - 60_000) return cb(null, _gTokenCache.token);
    const sa = googleServiceAccount();
    if (!sa || !sa.client_email || !sa.private_key) return cb(new Error('no_service_account'));
    const iat = Math.floor(now / 1000);
    const enc = o => Buffer.from(JSON.stringify(o)).toString('base64url');
    const unsigned = enc({ alg: 'RS256', typ: 'JWT' }) + '.' + enc({
        iss: sa.client_email,
        scope: 'https://www.googleapis.com/auth/calendar',
        aud: 'https://oauth2.googleapis.com/token',
        iat, exp: iat + 3600,
    });
    let signature;
    try { signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key, 'base64url'); }
    catch (e) { return cb(e); }
    const post = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + unsigned + '.' + signature;
    const r = https.request({
        method: 'POST', hostname: 'oauth2.googleapis.com', path: '/token',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(post) },
    }, resp => {
        let d = ''; resp.on('data', x => d += x); resp.on('end', () => {
            try {
                const j = JSON.parse(d);
                if (j.access_token) { _gTokenCache = { token: j.access_token, exp: now + j.expires_in * 1000 }; return cb(null, j.access_token); }
                cb(new Error('token_error: ' + d.slice(0, 200)));
            } catch (e) { cb(e); }
        });
    });
    r.on('error', cb); r.write(post); r.end();
}

/* Appel à l'API Google Calendar */
function calApi(method, apiPath, token, body, cb) {
    const payload = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + token };
    if (payload) { headers['Content-Type'] = 'application/json'; headers['Content-Length'] = Buffer.byteLength(payload); }
    const r = https.request({ method, hostname: 'www.googleapis.com', path: apiPath, headers }, resp => {
        let d = ''; resp.on('data', x => d += x); resp.on('end', () => {
            let j = {}; try { j = JSON.parse(d); } catch { /* ignore */ }
            cb(resp.statusCode >= 400 ? new Error('cal_' + resp.statusCode + ': ' + d.slice(0, 300)) : null, j);
        });
    });
    r.on('error', cb); if (payload) r.write(payload); r.end();
}

/* ── Utilitaires fuseau horaire (sans dépendance, gère l'heure d'été) ── */
function tzOffsetMinutes(date, tz) {
    const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const p = dtf.formatToParts(date).reduce((a, x) => (a[x.type] = x.value, a), {});
    const asUTC = Date.UTC(p.year, p.month - 1, p.day, p.hour === '24' ? 0 : p.hour, p.minute, p.second);
    return (asUTC - date.getTime()) / 60000;
}
// Instant UTC correspondant à une heure murale (y,mo,d,h,mi) dans le fuseau tz
function zonedTime(y, mo, d, h, mi, tz) {
    let ts = Date.UTC(y, mo - 1, d, h, mi, 0);
    const off = tzOffsetMinutes(new Date(ts), tz);
    return new Date(ts - off * 60000);
}
const pad2 = n => String(n).padStart(2, '0');
function parseHM(s) { const [h, m] = s.split(':').map(Number); return { h, m }; }

/* Génère les créneaux candidats (Date UTC) pour une date locale donnée */
function candidateSlots(dateStr) {
    const [y, mo, d] = dateStr.split('-').map(Number);
    if (!y || !mo || !d) return [];
    // jour de la semaine dans le fuseau cible
    const noon = zonedTime(y, mo, d, 12, 0, BOOKING.timezone);
    const wd = new Date(noon).getUTCDay(); // approx suffisante à midi
    const ranges = BOOKING.hours[wd];
    if (!ranges) return [];
    const slots = [];
    for (const [start, end] of ranges) {
        const s = parseHM(start), e = parseHM(end);
        let cur = zonedTime(y, mo, d, s.h, s.m, BOOKING.timezone).getTime();
        const stop = zonedTime(y, mo, d, e.h, e.m, BOOKING.timezone).getTime();
        while (cur + BOOKING.slotMinutes * 60000 <= stop) {
            slots.push(new Date(cur));
            cur += BOOKING.slotMinutes * 60000;
        }
    }
    return slots;
}

/* GET /api/availability?date=YYYY-MM-DD → { slots: [ISO,…] } */
function handleAvailability(req, res, query) {
    const dateStr = (query.get('date') || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'bad_date' }));
    }
    const now = Date.now();
    let slots = candidateSlots(dateStr).filter(s =>
        s.getTime() >= now + BOOKING.minNoticeMinutes * 60000 &&
        s.getTime() <= now + BOOKING.advanceDays * 86400000
    );
    if (!slots.length) {
        res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({ slots: [] }));
    }
    
    if (!isBookingConfigured()) {
        res.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
        return res.end(JSON.stringify({ error: 'booking_not_configured' }));
    }
    getGoogleToken((err, token) => {
        if (err) { console.error('[booking] token', err.message); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'auth' })); }
        const timeMin = new Date(slots[0].getTime()).toISOString();
        const timeMax = new Date(slots[slots.length - 1].getTime() + BOOKING.slotMinutes * 60000).toISOString();
        calApi('POST', '/calendar/v3/freeBusy', token, {
            timeMin, timeMax, items: [{ id: BOOKING.calendarId }],
        }, (e2, data) => {
            if (e2) { console.error('[booking] freebusy', e2.message); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'freebusy' })); }
            const busy = (data.calendars?.[BOOKING.calendarId]?.busy || []).map(b => [Date.parse(b.start), Date.parse(b.end)]);
            const free = slots.filter(s => {
                const a = s.getTime(), b = a + BOOKING.slotMinutes * 60000;
                return !busy.some(([bs, be]) => a < be && b > bs);
            }).map(s => s.toISOString());
            res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
            res.end(JSON.stringify({ slots: free }));
        });
    });
}

/* POST /api/book { start, name, email, phone, need } → crée l'événement */
function handleBook(req, res) {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 8000) req.destroy(); });
    req.on('end', () => {
        let data = {}; try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        const start = String(data.start || '').trim();
        const name = String(data.name || '').slice(0, 200).trim();
        const email = String(data.email || '').slice(0, 200).trim();
        const phone = String(data.phone || '').slice(0, 60).trim();
        const need = String(data.need || '').slice(0, 2000).trim();
        const honeypot = String(data.website_verification || '').trim();
        if (honeypot) { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: true })); }

        const startMs = Date.parse(start);
        if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !startMs) {
            res.writeHead(400, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'invalid' }));
        }
        if (startMs < Date.now() + BOOKING.minNoticeMinutes * 60000) {
            res.writeHead(409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'too_soon' }));
        }
        if (!isBookingConfigured()) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'booking_not_configured' }));
        }

        getGoogleToken((err, token) => {
            if (err) { console.error('[booking] token', err.message); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'auth' })); }
            const endMs = startMs + BOOKING.slotMinutes * 60000;
            // Re-vérifie que le créneau est toujours libre (anti double-réservation)
            calApi('POST', '/calendar/v3/freeBusy', token, {
                timeMin: new Date(startMs).toISOString(), timeMax: new Date(endMs).toISOString(),
                items: [{ id: BOOKING.calendarId }],
            }, (e2, fb) => {
                if (e2) { console.error('[booking] freebusy', e2.message); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'freebusy' })); }
                const busy = fb.calendars?.[BOOKING.calendarId]?.busy || [];
                if (busy.length) { res.writeHead(409, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'taken' })); }

                const descLines = [
                    'Appel stratégique de 15 min — Purity Agency.',
                    phone ? 'Téléphone : ' + phone : '',
                    need ? 'Besoin : ' + need : '',
                    BOOKING.meetingLink ? 'Lien visio : ' + BOOKING.meetingLink : '',
                ].filter(Boolean);
                const event = {
                    summary: 'Appel Purity — ' + name,
                    description: descLines.join('\n'),
                    start: { dateTime: new Date(startMs).toISOString(), timeZone: BOOKING.timezone },
                    end: { dateTime: new Date(endMs).toISOString(), timeZone: BOOKING.timezone },
                    attendees: [{ email }],
                    reminders: { useDefault: true },
                };
                if (BOOKING.meetingLink) event.location = BOOKING.meetingLink;

                calApi('POST',
                    `/calendar/v3/calendars/${encodeURIComponent(BOOKING.calendarId)}/events?sendUpdates=all`,
                    token, event, (e3, ev) => {
                        // Toujours logguer le lead (0 perdu, même si l'e-mail d'invitation échoue)
                        logLead({ name, email, phone, activity: '', need: '[RDV] ' + new Date(startMs).toISOString() + (need ? ' — ' + need : '') });
                        if (e3) { console.error('[booking] insert', e3.message); res.writeHead(502, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ error: 'insert' })); }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ ok: true, start: new Date(startMs).toISOString(), htmlLink: ev.htmlLink || '' }));
                    });
            });
        });
    });
}

/* ══════════════════════════════════════════════════════════════════════════
   COMMANDE PACKS — Création commande + session Stripe Checkout
   ══════════════════════════════════════════════════════════════════════════ */
function handleOrderCreate(req, res) {
    if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 4000) req.destroy(); });
    req.on('end', async () => {
        let data = {};
        try { data = JSON.parse(body) || {}; } catch { /* ignore */ }

        // Honeypot
        if (String(data.website_verification || '').trim()) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ ok: true }));
        }

        const sector  = String(data.sector  || '').trim().toLowerCase();
        const name    = String(data.name    || '').slice(0, 200).trim();
        const email   = String(data.email   || '').slice(0, 200).trim();
        const phone   = String(data.phone   || '').slice(0, 60).trim();
        const company = String(data.company || '').slice(0, 200).trim();

        if (!PACK_DATA[sector]) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'invalid_sector' }));
        }
        if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'invalid_contact' }));
        }

        const pack = PACK_DATA[sector];
        const id   = 'ord_' + Date.now() + '_' + crypto.randomBytes(3).toString('hex');
        const appBaseUrl = baseUrl();
        if (!appBaseUrl) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'base_url_not_configured' }));
        }
        if (!dashboardSecret()) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'dashboard_secret_not_configured' }));
        }
        const dashboardToken = makeDashboardToken(id);

        const order = {
            id, sector,
            pack: pack.pack, name: pack.name,
            price: pack.price, deposit: pack.deposit, remaining: pack.remaining, monthly: pack.monthly,
            clientName: name, company, email, phone,
            status: 'pending',
            createdAt: new Date().toISOString(),
            stripeSessionId: '',
            dashboardToken,
            dashboardUrl: `${appBaseUrl}/dashboard?order=${id}&token=${dashboardToken}`,
        };

        // Toujours sauvegarder avant d'appeler Stripe (0 commande perdue)
        try { writeOrder(order); } catch (e) {
            console.error('[order] write', e.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'storage' }));
        }
        logLead({ name, email, phone, activity: sector, need: `[COMMANDE] ${pack.pack} — ${pack.deposit}€ acompte` });

        const key = stripeKey();
        if (!isStripeCheckoutConfigured()) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'stripe_not_configured' }));
        }

        try {
            const Stripe = require('stripe');
            const stripe = Stripe(key);
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Acompte — ${pack.pack}`,
                            description: `30% sur ${pack.price} € HT — Purity Agency`,
                        },
                        unit_amount: pack.deposit * 100,
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                customer_email: email,
                success_url: `${appBaseUrl}/commande-confirmee?order=${id}&session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${appBaseUrl}/#tarifs`,
                metadata: { orderId: id },
            });

            // Mettre à jour l'ordre avec l'ID de session Stripe
            order.stripeSessionId = session.id;
            writeOrder(order);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ sessionUrl: session.url }));
        } catch (e) {
            console.error('[order] stripe', e.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'stripe_error' }));
        }
    });
}

/* ── Webhook Stripe (vérifie signature, met à jour statut + envoie email) ── */
function handleStripeWebhook(req, res) {
    const sig = req.headers['stripe-signature'] || '';
    let rawBody = Buffer.alloc(0);
    req.on('data', chunk => { rawBody = Buffer.concat([rawBody, chunk]); if (rawBody.length > 65536) req.destroy(); });
    req.on('end', async () => {
        const secret = stripeWebhookSecret();
        let event;
        try {
            if (!isStripeWebhookConfigured()) throw new Error('stripe_webhook_not_configured');
            const Stripe = require('stripe');
            const stripe = Stripe(stripeKey());
            event = stripe.webhooks.constructEvent(rawBody, sig, secret);
        } catch (e) {
            console.error('[webhook] signature', e.message);
            res.writeHead(e.message === 'stripe_webhook_not_configured' ? 503 : 400, { 'Content-Type': 'text/plain' });
            return res.end('Webhook signature invalid');
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const orderId = session.metadata?.orderId || '';
            const order = readOrder(orderId);
            if (order && order.status === 'pending') {
                order.status = 'paid';
                order.paidAt = new Date().toISOString();
                order.stripePaymentIntent = session.payment_intent || '';
                writeOrder(order);

                // Email de confirmation au client
                const resendApiKey = resendKey();
                if (resendApiKey) {
                    const html = `<h2>Commande confirmée — Purity Agency</h2>
<p>Bonjour ${escapeHtml(order.clientName)},</p>
<p>Votre acompte de <strong>${order.deposit} €</strong> pour le <strong>${escapeHtml(order.pack)}</strong> a bien été reçu.</p>
<p><strong>Suivez l'avancement de votre projet :</strong><br>
<a href="${escapeHtml(order.dashboardUrl)}" style="color:#7c3aed;">${escapeHtml(order.dashboardUrl)}</a></p>
<p>Notre équipe vous contacte sous 24 h pour lancer le kickoff.</p>
<p style="color:#666;">— L'équipe Purity Agency</p>`;
                    const payload = JSON.stringify({
                        from: process.env.CONTACT_FROM || 'Purity Agency <onboarding@resend.dev>',
                        to: [order.email],
                        subject: `Commande confirmée — ${order.pack}`,
                        html,
                    });
                    const rreq = https.request({
                        method: 'POST', hostname: 'api.resend.com', path: '/emails',
                        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), 'Authorization': `Bearer ${resendApiKey}` },
                    }, rres => { let d = ''; rres.on('data', x => d += x); rres.on('end', () => { if (rres.statusCode >= 400) console.error('[webhook] resend', rres.statusCode); }); });
                    rreq.on('error', e => console.error('[webhook] resend network', e.message));
                    rreq.write(payload); rreq.end();
                }

                // Notif interne
                logLead({ name: order.clientName, email: order.email, phone: order.phone || '', activity: order.sector, need: `[PAYÉ] ${order.pack} — ${order.deposit}€` });
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ received: true }));
    });
}

/* ── GET /api/order/:id?token=HMAC — données commande pour le dashboard ── */
function handleOrderGet(req, res, orderId, token) {
    if (!validDashboardToken(orderId, token)) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'forbidden' }));
    }
    const order = readOrder(orderId);
    if (!order) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'not_found' }));
    }
    // Retourner uniquement les données non sensibles
    const safe = {
        id: order.id, sector: order.sector, pack: order.pack, name: order.name,
        clientName: order.clientName, company: order.company,
        price: order.price, deposit: order.deposit, remaining: order.remaining, monthly: order.monthly,
        status: order.status, createdAt: order.createdAt, paidAt: order.paidAt || null,
    };
    res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(safe));
}

/* ── Client : login via email (magic link) ── */
function handleClientLogin(req, res) {
    if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1000) req.destroy(); });
    req.on('end', () => {
        let data = {}; try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        const email = String(data.email || '').slice(0, 200).trim().toLowerCase();
        
        if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'invalid_email' }));
        }

        let matchedOrder = null;
        try {
            if (fs.existsSync(ORDERS_DIR)) {
                const files = fs.readdirSync(ORDERS_DIR).filter(f => f.endsWith('.json') && f !== '.gitkeep');
                const orders = files.map(f => {
                    try { return JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, f), 'utf8')); }
                    catch { return null; }
                }).filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                matchedOrder = orders.find(o => o.email && o.email.toLowerCase() === email);
            }
        } catch (e) {
            console.error('[client_login] read orders', e.message);
        }

        if (matchedOrder) {
            const resendApiKey = resendKey();
            if (resendApiKey) {
                const appBaseUrl = process.env.APP_URL || `http://${req.headers.host}`;
                const magicLink = `${appBaseUrl}/dashboard.html?order=${matchedOrder.id}&token=${matchedOrder.token}`;
                
                const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                    <h2 style="color: #7C3AED;">Purity Agency</h2>
                    <p>Bonjour ${escapeHtml(matchedOrder.clientName || '')},</p>
                    <p>Voici votre lien d'accès magique pour vous connecter à votre Espace Client :</p>
                    <p style="margin: 2rem 0;">
                        <a href="${magicLink}" style="background-color: #7C3AED; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 99px; font-weight: bold;">Accéder à mon tableau de bord</a>
                    </p>
                    <p>Ce lien est personnel et sécurisé. Si vous n'avez pas demandé cet accès, vous pouvez ignorer cet e-mail.</p>
                </div>`;
                
                const payload = JSON.stringify({
                    from: CONTACT_FROM,
                    to: [email],
                    subject: 'Votre lien magique Espace Client',
                    html
                });
                
                const rreq = https.request({
                    method: 'POST',
                    hostname: 'api.resend.com',
                    path: '/emails',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload),
                        'Authorization': `Bearer ${resendApiKey}`
                    }
                }, rres => {
                    let d = ''; rres.on('data', x => d += x);
                    rres.on('end', () => {
                        if (rres.statusCode >= 400) console.error('[client_login] resend failed', rres.statusCode, d);
                    });
                });
                rreq.on('error', e => console.error('[client_login] resend error', e.message));
                rreq.write(payload);
                rreq.end();
            } else {
                console.warn('[client_login] No resend API key configured to send magic link');
            }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
    });
}

/* ── Admin : login ── */
function handleAdminLogin(req, res) {
    let body = '';
    req.on('data', c => { body += c; if (body.length > 1000) req.destroy(); });
    req.on('end', () => {
        let data = {}; try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        const password = String(data.password || '').slice(0, 200);
        const stored = adminPasswordHash();
        if (!stored) {
            res.writeHead(503, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'no_password_configured' }));
        }
        const inputHash = crypto.createHash('sha256').update(password).digest('hex');
        let match = false;
        try { match = crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(stored, 'hex')); } catch { match = false; }
        if (!match) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'unauthorized' }));
        }
        const token = crypto.randomBytes(32).toString('hex');
        ADMIN_SESSIONS.set(token, { at: Date.now() });
        const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        res.setHeader('Set-Cookie', `admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400${secureFlag}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
    });
}

/* ── Admin : liste des commandes ── */
function handleAdminOrders(req, res) {
    if (!getAdminSession(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'unauthorized' }));
    }
    try {
        fs.mkdirSync(ORDERS_DIR, { recursive: true });
        const files = fs.readdirSync(ORDERS_DIR).filter(f => f.endsWith('.json') && f !== '.gitkeep');
        const orders = files.map(f => {
            try { return JSON.parse(fs.readFileSync(path.join(ORDERS_DIR, f), 'utf8')); }
            catch { return null; }
        }).filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ orders }));
    } catch (e) {
        console.error('[admin] list orders', e.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'server_error' }));
    }
}

/* ── Admin : mise à jour statut commande ── */
function handleAdminOrderStatus(req, res, orderId) {
    if (!getAdminSession(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'unauthorized' }));
    }
    let body = '';
    req.on('data', c => { body += c; if (body.length > 500) req.destroy(); });
    req.on('end', () => {
        let data = {}; try { data = JSON.parse(body) || {}; } catch { /* ignore */ }
        const status = String(data.status || '').trim();
        if (!VALID_STATUSES.includes(status)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'invalid_status' }));
        }
        const order = readOrder(orderId);
        if (!order) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'not_found' }));
        }
        order.status = status;
        order.updatedAt = new Date().toISOString();
        writeOrder(order);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, status }));
    });
}

/* Seules ces extensions sont servies. Tout le reste (clés, logs, server.js,
   dotfiles) répond 404 — indispensable avant mise en ligne. */
const BLOCKED_FILES = new Set(['server.js', 'leads.log']);
const BLOCKED_EXTENSIONS = new Set(['.png']); // WebP existe pour chaque PNG → bloquer les sources lourdes
const PNG_EXCEPTIONS = new Set(['logo.png', 'service5.png']); // og:image — les crawlers sociaux préfèrent le PNG
function isServable(filePath) {
    const base = path.basename(filePath);
    if (base.startsWith('.') || BLOCKED_FILES.has(base)) return false;
    if (PNG_EXCEPTIONS.has(base)) return true;
    // aucun segment du chemin ne doit être un dossier caché
    const rel = path.relative(ROOT, filePath);
    if (rel.split(path.sep).some(seg => seg.startsWith('.'))) return false;
    const ext = path.extname(filePath).toLowerCase();
    if (BLOCKED_EXTENSIONS.has(ext)) return false;
    return Object.prototype.hasOwnProperty.call(MIME, ext);
}

const MIME = {
    '.html' : 'text/html; charset=utf-8',
    '.css'  : 'text/css',
    '.js'   : 'application/javascript',
    '.png'  : 'image/png',
    '.jpg'  : 'image/jpeg',
    '.jpeg' : 'image/jpeg',
    '.gif'  : 'image/gif',
    '.svg'  : 'image/svg+xml',
    '.ico'  : 'image/x-icon',
    '.mp4'  : 'video/mp4',
    '.webm' : 'video/webm',
    '.woff' : 'font/woff',
    '.woff2': 'font/woff2',
    '.webp' : 'image/webp',
    '.txt'  : 'text/plain; charset=utf-8',
    '.xml'  : 'application/xml',
    '.json' : 'application/json',
};

const server = http.createServer((req, res) => {
    setSecurityHeaders(res);
    let urlPath = req.url.split('?')[0];

    // Health check (monitoring / load balancer)
    if (urlPath === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: 'ok',
            ts: Date.now(),
            config: {
                baseUrl: Boolean(baseUrl()),
                dashboardSecret: Boolean(dashboardSecret()),
                stripeCheckout: isStripeCheckoutConfigured(),
                stripeWebhook: isStripeWebhookConfigured(),
                booking: isBookingConfigured(),
            },
        }));
    }

    // API : assistant IA (proxy Gemini) — même origine uniquement
    if (urlPath === '/api/chat') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        return handleChat(req, res);
    }

    // API : amélioration de texte par IA
    if (urlPath === '/api/improve-text') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
        return handleImproveText(req, res);
    }

    // API : contact (leads)
    if (urlPath === '/api/contact') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
        return handleContact(req, res);
    }

    // API : disponibilités du calendrier (créneaux libres)
    if (urlPath === '/api/availability') {
        if (req.method !== 'GET') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
        return handleAvailability(req, res, new URLSearchParams(req.url.split('?')[1] || ''));
    }

    // API : réservation d'un créneau (crée l'événement Google Calendar)
    if (urlPath === '/api/book') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
        return handleBook(req, res);
    }

    // ── Routes commande / packs ──

    // POST /api/order/create
    if (urlPath === '/api/order/create') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        return handleOrderCreate(req, res);
    }

    // POST /api/stripe/webhook (pas de check origine — vient de Stripe)
    if (urlPath === '/api/stripe/webhook') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        return handleStripeWebhook(req, res);
    }

    // GET /api/order/:id?token=HMAC
    {
        const orderMatch = urlPath.match(/^\/api\/order\/(ord_[0-9]+_[a-z0-9]{6})$/);
        if (orderMatch) {
            if (req.method !== 'GET') { res.writeHead(405); return res.end('Method Not Allowed'); }
            if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
            const query = new URLSearchParams(req.url.split('?')[1] || '');
            return handleOrderGet(req, res, orderMatch[1], query.get('token') || '');
        }
    }

    // POST /api/client/login
    if (urlPath === '/api/client/login') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        return handleClientLogin(req, res);
    }

    // POST /api/admin/login
    if (urlPath === '/api/admin/login') {
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        if (rateLimited(req)) { res.writeHead(429, { 'Retry-After': '60' }); return res.end(); }
        return handleAdminLogin(req, res);
    }

    // GET /api/admin/orders
    if (urlPath === '/api/admin/orders') {
        if (req.method !== 'GET') { res.writeHead(405); return res.end('Method Not Allowed'); }
        if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
        return handleAdminOrders(req, res);
    }

    // POST /api/admin/order/:id/status
    {
        const statusMatch = urlPath.match(/^\/api\/admin\/order\/(ord_[0-9]+_[a-z0-9]{6})\/status$/);
        if (statusMatch) {
            if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
            if (!isOriginAllowed(req)) { res.writeHead(403); return res.end('Forbidden'); }
            return handleAdminOrderStatus(req, res, statusMatch[1]);
        }
    }

    // Pages HTML spéciales (sans extension dans l'URL)
    if (urlPath === '/dashboard') { urlPath = '/dashboard.html'; }
    if (urlPath === '/commande-confirmee') { urlPath = '/commande-confirmee.html'; }
    if (urlPath === '/admin') { urlPath = '/admin.html'; }

    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.normalize(path.join(ROOT, decodeURIComponent(urlPath)));

    if (!filePath.startsWith(ROOT) || !isServable(filePath)) {
        res.writeHead(404);
        return res.end('404 Not found');
    }

    fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
            res.writeHead(err && err.code !== 'ENOENT' ? 500 : 404);
            return res.end(err && err.code !== 'ENOENT' ? '500 Error' : '404 Not found');
        }

        const ext         = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext];
        const fileSize    = stat.size;
        const rangeHeader = req.headers['range'];
        
        // Cache headers
        const lastModified = stat.mtime.toUTCString();
        const cacheControl = ['.html', '.css', '.js', '.json'].includes(ext)
            ? 'no-cache'
            : 'public, max-age=31536000, immutable';

        res.setHeader('Last-Modified', lastModified);
        res.setHeader('Cache-Control', cacheControl);

        // Cache validation (304 Not Modified)
        const ifModifiedSince = req.headers['if-modified-since'];
        if (ifModifiedSince && ifModifiedSince === lastModified) {
            res.writeHead(304);
            return res.end();
        }

        if (rangeHeader) {
            // Parse et valide "bytes=start-end"
            const m = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
            const start = m && m[1] !== '' ? parseInt(m[1], 10) : 0;
            const end   = m && m[2] !== '' ? parseInt(m[2], 10) : fileSize - 1;
            if (!m || start > end || start >= fileSize) {
                res.writeHead(416, { 'Content-Range': `bytes */${fileSize}` });
                return res.end();
            }
            const safeEnd  = Math.min(end, fileSize - 1);
            const chunkLen = safeEnd - start + 1;

            res.writeHead(206, {
                'Content-Range'  : `bytes ${start}-${safeEnd}/${fileSize}`,
                'Accept-Ranges'  : 'bytes',
                'Content-Length' : chunkLen,
                'Content-Type'   : contentType,
                'Cache-Control'  : cacheControl,
            });
            fs.createReadStream(filePath, { start, end: safeEnd }).pipe(res);
        } else {
            // Gzip compression for text assets
            const acceptEncoding = req.headers['accept-encoding'] || '';
            if (COMPRESSIBLE.has(contentType) && acceptEncoding.includes('gzip')) {
                res.writeHead(200, {
                    'Content-Type'     : contentType,
                    'Content-Encoding' : 'gzip',
                    'Accept-Ranges'    : 'bytes',
                    'Cache-Control'    : cacheControl,
                    'Vary'             : 'Accept-Encoding',
                });
                fs.createReadStream(filePath).pipe(zlib.createGzip({ level: 6 })).pipe(res);
            } else {
                res.writeHead(200, {
                    'Content-Length' : fileSize,
                    'Content-Type'   : contentType,
                    'Accept-Ranges'  : 'bytes',
                    'Cache-Control'  : cacheControl,
                });
                fs.createReadStream(filePath).pipe(res);
            }
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('  ┌──────────────────────────────────────┐');
    console.log('  │        PURITY AGENCY  —  DEV         │');
    console.log('  ├──────────────────────────────────────┤');
    console.log(`  │   http://localhost:${PORT}               │`);
    console.log('  └──────────────────────────────────────┘');
    console.log('');
    console.log('  Ctrl+C  pour arrêter');
    console.log('');
});
