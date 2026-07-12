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
