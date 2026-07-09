# AI Text Improver Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Boost the "Améliorer avec l'IA" feature by adding a pulsing purple glow around textareas during generation, writing the generated response letter-by-letter with a typewriter effect, supporting starting drafts when cliked empty, and formatting the output into a structured agency brief (🎯 Objectif & 🛠️ Besoins clés).

**Architecture:** Update the Gemini system prompt on the server to enforce structured briefs and support empty text requests. On the client, wrap textareas in CSS pulsing glows, secure the AI button against multiple clicks, and write responses character-by-character using a fast typing loop with event dispatching.

**Tech Stack:** Vanilla JavaScript (ES6), CSS, Node.js HTTP Server, Gemini API.

## Global Constraints
- Target: SMBs, freelancers, artisans in Wallonia
- Stack: Vanilla HTML/CSS/JS + Node.js server (no framework)
- Dark theme background (near-black `#060309`) with violet accent (`#7C3AED`)
- No browser window openings during execution or testing

---

### Task 1: Server-side Gemini system instruction and query updates in server.js

**Files:**
- Modify: `server.js:205-259`
- Test script: `C:\Users\User\.gemini\antigravity-ide\brain\2ebb92b7-7656-435c-9242-3c8870a7e9e0\scratch\test_api.js`

**Interfaces:**
- Consumes: `/api/improve-text` POST requests.
- Produces: JSON response `{ ok: true, text: string }` formatted as:
  ```
  🎯 Objectif : [Objective]
  🛠️ Besoins clés :
  - [Need 1]
  - [Need 2]
  - [Need 3]
  ```

- [ ] **Step 1: Replace handleImproveText implementation in server.js**
  Modify lines 205-259 in `server.js` to support structured briefs and empty-field triggers:
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
          
          let promptInstruction = "Tu es un rédacteur professionnel pour Purity Agency (agence digitale à Charleroi en Belgique). Reformule, structure et améliore de façon impactante et professionnelle le besoin de ce client pour son projet de site web, de SEO ou d'automatisation.\n\nTu dois STRICTEMENT structurer ta réponse dans ce format exact :\n🎯 Objectif : [Une phrase courte et impactante décrivant le but principal du projet]\n🛠️ Besoins clés :\n- [Besoin technique ou fonctionnel 1]\n- [Besoin technique ou fonctionnel 2]\n- [Besoin technique ou fonctionnel 3]\n\nSois direct et professionnel. N'utilise pas d'introduction, de salutations ni de commentaires externes. Réponds uniquement avec le texte structuré de son besoin.";
          let userPrompt = text;
          
          if (!text) {
              promptInstruction = "Tu es un assistant d'idéation pour Purity Agency. L'utilisateur a cliqué sur 'Améliorer avec l'IA' mais n'a rien saisi dans sa description de besoins.\n\nGénère une proposition de brief type de projet digital haut de gamme (site internet ou automatisation) à personnaliser, rédigé à la première personne ('Je souhaite...').\n\nTu dois STRICTEMENT structurer ta réponse dans ce format exact :\n🎯 Objectif : [Une proposition d'objectif de projet inspirante à compléter, par exemple : 'Lancer un site internet d'agence immobilière moderne pour capter des leads locaux.']\n🛠️ Besoins clés :\n- [Proposition de besoin clé 1 à personnaliser]\n- [Proposition de besoin clé 2 à personnaliser]\n- [Proposition de besoin clé 3 à personnaliser]\n\nSois direct et professionnel. Réponds uniquement avec le texte structuré, sans introduction ni commentaires.";
              userPrompt = "Génère un exemple de brief à personnaliser.";
          }
          
          const payload = JSON.stringify({
              system_instruction: { parts: [{ text: promptInstruction }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: { maxOutputTokens: 400, temperature: 0.7, topP: 0.9 },
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

- [ ] **Step 2: Restart the dev server to apply server.js changes**
  Run: `git commit -am "temp" (if needed)` and manage the background task to restart `server.js`.

- [ ] **Step 3: Run the API test script to verify empty-text and structured responses**
  Run: `node C:\Users\User\.gemini\antigravity-ide\brain\2ebb92b7-7656-435c-9242-3c8870a7e9e0\scratch\test_api.js`
  Expected output: HTTP 200, body contains the structured brief template.

- [ ] **Step 4: Commit server.js changes**
  Run:
  ```bash
  git add server.js
  git commit -m "feat(server): update AI text improver system instructions and support empty prompts"
  ```

---

### Task 2: CSS Styles for Pulsing Glow and Shimmer loading in css/site-extra.css

**Files:**
- Modify: `css/site-extra.css`

**Interfaces:**
- Consumes: CSS class `.is-ai-working` applied to `.field` wrapper.
- Produces: Pulsing glow borders and animations on textareas.

- [ ] **Step 1: Append pulsing glow styles to the end of css/site-extra.css**
  Append these styles to the end of the file:
  ```css
  /* AI Assistant Processing Glow */
  .field.is-ai-working {
    border-color: var(--c-accent-bright, #9F67FF) !important;
    box-shadow: 0 0 22px rgba(124, 58, 237, 0.45) !important;
    animation: aiWorkingPulse 1.8s ease-in-out infinite alternate;
  }
  @keyframes aiWorkingPulse {
    0% {
      border-color: rgba(124, 58, 237, 0.4);
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.2);
    }
    100% {
      border-color: rgba(168, 85, 247, 0.95);
      box-shadow: 0 0 25px rgba(124, 58, 237, 0.65);
    }
  }

  /* Shimmer effect for the button when loading */
  .ai-improve-btn.is-loading {
    background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(168, 85, 247, 0.2) 50%, rgba(124, 58, 237, 0.2) 100%) !important;
    background-size: 200% auto !important;
    animation: btnShimmer 1.5s linear infinite !important;
    border-color: rgba(168, 85, 247, 0.5) !important;
  }
  @keyframes btnShimmer {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  ```

- [ ] **Step 2: Commit css/site-extra.css changes**
  Run:
  ```bash
  git add css/site-extra.css
  git commit -m "style: add pulsing glow and button shimmer animations for AI work"
  ```

---

### Task 3: Client-side logic for Typewriter effect, Class toggling and Event dispatching in js/site.js

**Files:**
- Modify: `js/site.js:2083-2114`

**Interfaces:**
- Consumes: API endpoints from Task 1, CSS classes from Task 2.
- Produces: Character-by-character typewriter loop with 6ms delay, event dispatching, and button lock-outs.

- [ ] **Step 1: Replace client-side improve-text click handler in js/site.js**
  Replace lines 2083-2114 in `js/site.js` with this updated handler:
  ```javascript
      btn.addEventListener('click', async () => {
        const val = textarea.value.trim();
        const fieldContainer = textarea.closest('.field');
        
        btn.classList.add('is-loading');
        if (fieldContainer) fieldContainer.classList.add('is-ai-working');
        
        const optimizingText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_optimizing']) || 'Amélioration…';
        btn.querySelector('span').textContent = optimizingText;
        
        try {
          const res = await fetch('/api/improve-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: val })
          });
          const data = await res.json();
          if (res.ok && data.text) {
            // Typewriter effect: Type character by character
            let i = 0;
            textarea.value = '';
            textarea.focus();
            
            const typingInterval = setInterval(() => {
              if (i < data.text.length) {
                textarea.value += data.text.charAt(i);
                // Dispatch input event so float labels and character counters react correctly
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                i++;
              } else {
                clearInterval(typingInterval);
                btn.classList.remove('is-loading');
                if (fieldContainer) fieldContainer.classList.remove('is-ai-working');
                const defaultText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_improve']) || "Améliorer avec l'IA";
                btn.querySelector('span').textContent = defaultText;
              }
            }, 6); // Fast 6ms interval for premium feeling
            
          } else {
            const errText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_err']) || "Impossible de joindre l'IA d'OctoMask pour le moment.";
            alert(errText);
            btn.classList.remove('is-loading');
            if (fieldContainer) fieldContainer.classList.remove('is-ai-working');
            const defaultText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_improve']) || "Améliorer avec l'IA";
            btn.querySelector('span').textContent = defaultText;
          }
        } catch (e) {
          console.error(e);
          const errText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_err']) || "Impossible de joindre l'IA d'OctoMask pour le moment.";
          alert(errText);
          btn.classList.remove('is-loading');
          if (fieldContainer) fieldContainer.classList.remove('is-ai-working');
          const defaultText = (typeof _i18nDict !== 'undefined' && _i18nDict['booking.ai_improve']) || "Améliorer avec l'IA";
          btn.querySelector('span').textContent = defaultText;
        }
      });
  ```

- [ ] **Step 2: Run dev server compile check**
  Run: `node -e "require('http').get('http://localhost:3000/', res => console.log(res.statusCode))"`
  Expected output: 200

- [ ] **Step 3: Commit js/site.js changes**
  Run:
  ```bash
  git add js/site.js
  git commit -m "feat(client): implement typewriter typing and active glow states for AI text improver"
  ```
