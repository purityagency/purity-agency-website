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
const SYSTEM_PROMPT = `Tu es l'assistant virtuel de Purity Agency, une agence digitale à Charleroi (Wallonie, Belgique).
Tu guides les visiteurs avec clarté et chaleur. Tu réponds TOUJOURS en français et tu vouvoies systématiquement.
Style : concis (2 à 4 phrases), moderne, direct, sans jargon ni superlatifs creux. Tu peux poser une question pour cibler le besoin.

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

Objectif : inviter naturellement à réserver un appel gratuit de 20 min ou à écrire à contact@purity-agency.be.
Règles de vérité : n'invente jamais de témoignages, de chiffres non sourcés ou de nom de fondateur (ne cite jamais Amir, présente l'agence comme un collectif).`;

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
            generationConfig: { maxOutputTokens: 320, temperature: 0.6, topP: 0.9 },
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
