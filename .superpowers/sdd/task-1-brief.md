### Task 1: Server-side Prompting in server.js

**Files:**
- Modify: `server.js`

**Interfaces:**
- Consumes: `/api/improve-text` POST requests.
- Produces: JSON response `{ ok: true, text: string }` containing a clean paragraph (no emojis, bullet points, titles, or headers).

- [ ] **Step 1: Update system instructions inside handleImproveText in server.js**
  Modify lines 205-320 in `server.js` to change the Gemini system prompt:
  ```javascript
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
  ```

- [ ] **Step 2: Restart server and run API test script**
  Run commands to restart `server.js` and execute `scratch/test_api.js` (modified to send a regular query like "site garage").

- [ ] **Step 3: Commit server changes**
  Run:
  ```bash
  git add server.js
  git commit -m "feat(server): rewrite AI system prompt for premium copywriting tone"
  ```

---
