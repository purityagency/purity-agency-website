# AI Text Sublimator Premium Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the AI text sublimator to offer an elite copywriting tone (no emojis/bullets/labels), a liquid transition effect (blur & fade), and a row of glassmorphic inspiration chips below empty textareas.

**Architecture:** Update the Gemini system instruction on the server to act as a B2B copywriting specialist. On the client, build and append the interactive inspiration chips below the textareas, listen to input events to toggle chips visibility, and implement a CSS filter transition when loading text.

**Tech Stack:** Vanilla JavaScript (ES6), CSS, Node.js HTTP Server, Gemini API.

## Global Constraints
- Target: SMBs, freelancers, artisans in Wallonia
- Stack: Vanilla HTML/CSS/JS + Node.js server (no framework)
- Dark theme background (near-black `#060309`) with violet accent (`#7C3AED`)
- No browser window openings during execution or testing

---

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

### Task 2: CSS Styles in css/site-extra.css

**Files:**
- Modify: `css/site-extra.css`

**Interfaces:**
- Consumes: Classes `.textarea-ai-loading`, `.ai-inspiration-chips`, and `.ai-chip`.
- Produces: Shimmer, blur transition, and glassmorphic chip pills.

- [ ] **Step 1: Replace previously appended AI styles with new premium styles in css/site-extra.css**
  Append these styles to the end of the file:
  ```css
  /* Textarea AI Loading State - Glass Blur Transition */
  .textarea-ai-loading {
    filter: blur(2.5px);
    opacity: 0.65;
    pointer-events: none;
  }
  textarea {
    transition: filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  }

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

  /* Discreet Inspiration Chips Container */
  .ai-inspiration-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: opacity 0.3s ease, max-height 0.3s ease, margin 0.3s ease;
  }
  .ai-inspiration-chips.is-visible {
    opacity: 1;
    max-height: 80px;
  }
  
  .ai-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.38rem 0.85rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 99px;
    font-size: 0.74rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .ai-chip:hover {
    background: rgba(124, 58, 237, 0.08);
    border-color: rgba(124, 58, 237, 0.3);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.15);
  }
  .ai-chip:active {
    transform: translateY(0);
  }
  ```

- [ ] **Step 2: Commit css/site-extra.css changes**
  Run:
  ```bash
  git add css/site-extra.css
  git commit -m "style: add transition blurs and inspiration chips container"
  ```

---

### Task 3: Client-side logic in js/site.js

**Files:**
- Modify: `js/site.js`

**Interfaces:**
- Consumes: Inspiration chips click triggers, `/api/improve-text` calls.
- Produces: Fully interactive AI assistant with dynamic chip populating and blur transition.

- [ ] **Step 1: Replace improve-text handler with premium chips and transition version**
  Update the `Amélioration de texte IA` section in `js/site.js`:
  ```javascript
  // --- Amélioration de texte IA (OctoMask) ---
  document.addEventListener('DOMContentLoaded', () => {
    const textareas = ['#f-need', '#bk-need'];
    textareas.forEach(id => {
      const textarea = document.querySelector(id);
      if (!textarea) return;
      
      const parentField = textarea.parentNode;
      
      // Create inspiration chips container
      const chipsContainer = document.createElement('div');
      chipsContainer.className = 'ai-inspiration-chips';
      
      const chipsData = [
        { label: "Site Vitrine", text: "Je souhaite concevoir un site vitrine moderne et immersif pour valoriser mon expertise et capter des prospects qualifiés..." },
        { label: "Boutique E-commerce", text: "Je cherche à lancer une boutique e-commerce fluide et performante, optimisée pour maximiser le taux de conversion..." },
        { label: "Portail Client / SaaS", text: "Je souhaite développer un portail client sur-mesure pour automatiser nos échanges et centraliser les données..." },
        { label: "Automatisation & CRM", text: "Je souhaite interconnecter nos outils internes et automatiser nos processus pour gagner en productivité..." }
      ];
      
      chipsData.forEach(chip => {
        const btnChip = document.createElement('button');
        btnChip.type = 'button';
        btnChip.className = 'ai-chip';
        btnChip.textContent = chip.label;
        btnChip.addEventListener('click', () => {
          textarea.value = chip.text;
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.focus();
          // Hide chips
          chipsContainer.classList.remove('is-visible');
        });
        chipsContainer.appendChild(btnChip);
      });
      
      parentField.appendChild(chipsContainer);
      
      // Toggle chips visibility based on focus and content
      const updateChipsVisibility = () => {
        const val = textarea.value.trim();
        if (!val && document.activeElement === textarea) {
          chipsContainer.classList.add('is-visible');
        } else {
          chipsContainer.classList.remove('is-visible');
        }
      };
      
      textarea.addEventListener('focus', updateChipsVisibility);
      textarea.addEventListener('blur', () => {
        // Small delay to allow chip click to register before hiding
        setTimeout(updateChipsVisibility, 150);
      });
      textarea.addEventListener('input', updateChipsVisibility);
      
      // Create Sublimer button
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ai-improve-btn';
      const labelText = "Sublimer avec l'IA";
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13" aria-hidden="true"><path d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904zM19 6.5L18.5 9l-.5-2.5L15.5 6l2.5-.5.5-2.5.5 2.5 2.5.5-2.5.5z"/></svg><span>${labelText}</span>`;
      btn.title = "Sublimer votre texte avec l'IA d'OctoMask";
      
      parentField.appendChild(btn);
      
      btn.addEventListener('click', async () => {
        const val = textarea.value.trim();
        if (!val) {
          // If empty, trigger focus to show chips and prompt user
          textarea.focus();
          chipsContainer.classList.add('is-visible');
          return;
        }
        
        btn.classList.add('is-loading');
        textarea.classList.add('textarea-ai-loading');
        if (parentField) parentField.classList.add('is-ai-working');
        
        btn.querySelector('span').textContent = 'Sublimation…';
        
        try {
          const res = await fetch('/api/improve-text', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: val })
          });
          const data = await res.json();
          if (res.ok && data.text) {
            // Instant text update with opacity fade
            textarea.value = data.text;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
          } else {
            const errText = "Impossible de joindre l'IA d'OctoMask pour le moment.";
            alert(errText);
          }
        } catch (e) {
          console.error(e);
          const errText = "Impossible de joindre l'IA d'OctoMask pour le moment.";
          alert(errText);
        } finally {
          btn.classList.remove('is-loading');
          textarea.classList.remove('textarea-ai-loading');
          if (parentField) parentField.classList.remove('is-ai-working');
          btn.querySelector('span').textContent = "Sublimer avec l'IA";
        }
      });
    });
  });
  ```

- [ ] **Step 2: Test page rendering and console logs**
  Verify page serves properly, status 200.

- [ ] **Step 3: Commit js/site.js changes**
  Run:
  ```bash
  git add js/site.js
  git commit -m "feat(client): implement glass chips and elegant blur transitions for sublimator"
  ```
