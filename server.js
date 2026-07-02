const http  = require('http');
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const PORT = 3000;
const ROOT = __dirname;

/* ── Assistant IA (proxy Gemini, clé côté serveur uniquement) ── */
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
function geminiKey() {
    if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim();
    try { return fs.readFileSync(path.join(ROOT, '.gemini-key'), 'utf8').trim(); }
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
- Paiement possible en 4× via Stripe/Klarna.
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

Objectif secondaire si le visiteur refuse de laisser ses coordonnées : l'inviter à écrire à contact.purityagency@gmail.com.
Règles de vérité : n'invente jamais de témoignages, de chiffres non sourcés ou de nom de fondateur (ne cite jamais Amir, présente l'agence comme un collectif). Reste concis (2 à 4 phrases), chaleureux, vouvoiement systématique, français.`;

function handleChat(req, res) {
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

/* ── Contact (lead) : envoi email via Resend, fallback log fichier ── */
// NB Resend en mode test (domaine non vérifié) : from doit rester onboarding@resend.dev
// et to doit être l'email du compte Resend. Après vérification DNS de purity-agency.be,
// passer CONTACT_FROM sur 'Purity Agency <contact@purity-agency.be>' et CONTACT_TO sur contact@purity-agency.be.
const CONTACT_TO = process.env.CONTACT_TO || 'contact.purityagency@gmail.com';
const CONTACT_FROM = process.env.CONTACT_FROM || 'Purity Agency <onboarding@resend.dev>';
function resendKey() {
    if (process.env.RESEND_API_KEY) return process.env.RESEND_API_KEY.trim();
    try { return fs.readFileSync(path.join(ROOT, '.resend-key'), 'utf8').trim(); }
    catch { return ''; }
}
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}
function logLead(lead) {
    const line = JSON.stringify({ at: new Date().toISOString(), ...lead }) + '\n';
    try { fs.appendFileSync(path.join(ROOT, 'leads.log'), line); } catch { /* ignore */ }
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
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    // API : assistant IA (proxy Gemini)
    if (urlPath === '/api/chat') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            return res.end();
        }
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        return handleChat(req, res);
    }

    // API : contact (leads)
    if (urlPath === '/api/contact') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        if (req.method === 'OPTIONS') { res.writeHead(200); return res.end(); }
        if (req.method !== 'POST') { res.writeHead(405); return res.end('Method Not Allowed'); }
        return handleContact(req, res);
    }

    if (urlPath === '/') urlPath = '/index.html';

    const filePath = path.normalize(path.join(ROOT, decodeURIComponent(urlPath)));

    if (!filePath.startsWith(ROOT)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stat) => {
        if (err) {
            res.writeHead(err.code === 'ENOENT' ? 404 : 500);
            return res.end(err.code === 'ENOENT' ? '404 Not found' : '500 Error');
        }

        const ext         = path.extname(filePath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        const fileSize    = stat.size;
        const rangeHeader = req.headers['range'];

        if (rangeHeader) {
            // Parse "bytes=start-end"
            const [startStr, endStr] = rangeHeader.replace(/bytes=/, '').split('-');
            const start    = parseInt(startStr, 10);
            const end      = endStr ? parseInt(endStr, 10) : fileSize - 1;
            const chunkLen = end - start + 1;

            res.writeHead(206, {
                'Content-Range'  : `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges'  : 'bytes',
                'Content-Length' : chunkLen,
                'Content-Type'   : contentType,
                'Cache-Control'  : 'no-cache, no-store',
            });
            fs.createReadStream(filePath, { start, end }).pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length' : fileSize,
                'Content-Type'   : contentType,
                'Accept-Ranges'  : 'bytes',
                'Cache-Control'  : 'no-cache, no-store',
            });
            fs.createReadStream(filePath).pipe(res);
        }
    });
});

server.listen(PORT, '127.0.0.1', () => {
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
