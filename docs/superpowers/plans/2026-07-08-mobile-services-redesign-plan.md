# Redesign de la Section Services sur Mobile Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Réorganiser la section Services sur mobile sous forme de carrousel 3D horizontal posé sur un tentacule fluide brillant, déclenchant l'ouverture d'un panneau de détails iOS Bottom Sheet, pour s'aligner sur les 5 briques de tarifs.

**Architecture:** 
- Déclaration de 5 services uniques dans la structure HTML et les fichiers de traduction i18n.
- Intégration d'un carrousel 3D CSS commandé par des gestes de glissement tactile (swipe) et des clicks d'onglets.
- Ligne horizontale néon dessinée sous les cartes, animée en JS au défilement.
- Panneau tiroir Bottom Sheet modal invisible par défaut, s'affichant avec une translation verticale CSS fluide.

**Tech Stack:** Vanilla JS, CSS3 Custom Properties (Perspectives & Transforms), HTML5 Semantic markup.

## Global Constraints
- Target platform: Mobile viewport (width <= 768px).
- Styling framework: Vanilla CSS with BEM prefixing (`.svc-`).
- Zero framework dependencies: JS is pure vanilla ES6+.
- Accessibility: ARIA roles, proper screen reader text, keyboard accessible close button.

---

### Task 1: Traduction et Markup des 5 Services

**Files:**
- Modify: `index.html` (sections `#services` et `#tarifs`)
- Modify: `i18n/fr.json`, `i18n/en.json`, `i18n/nl.json`

**Interfaces:**
- Consumes: Fichiers i18n existants
- Produces: 5 clés de traduction homogènes par langue pour les services

- [ ] **Step 1: Ajouter les clés i18n pour le 5ème service (Accompagnement) dans les dictionnaires**
  - Ouvrir `i18n/fr.json` et ajouter les traductions sous la clé `scene5` et `card5`.
  - Faire de même pour `i18n/en.json` et `i18n/nl.json`.
- [ ] **Step 2: Mettre à jour index.html pour contenir les 5 articles de service**
  - Insérer la 5ème carte `.svc-card` dans la colonne de gauche `.svc-nav-list` :
    ```html
    <article class="svc-card" data-target-scene="4">
      <div class="svc-card__header">
        <div class="svc-card__ico" aria-hidden="true">
          <!-- Icône Accompagnement SVG -->
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="20" stroke="rgba(255,255,255,0.9)" stroke-width="1.5"/>
            <path d="M32 20 L32 32 L40 36" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <h3 data-i18n="card5.title">Accompagnement & Suivi</h3>
      </div>
      <div class="svc-card__body">
        <p data-i18n="card5.desc">Maintenance, hébergement sécurisé, rapports de performance et mises à jour mensuelles.</p>
        <div class="svc-card__progress">
          <div class="svc-card__progress-fill"></div>
        </div>
      </div>
    </article>
    ```
  - Insérer la 5ème scène `.svc-scene` dans `.svc-showcase__screen` :
    ```html
    <article class="svc-scene" data-scene="05" data-pos="bottom-left">
      <div class="svc-scene__media" style="background-image: url('/assets/service5.png')"></div>
      <div class="svc-scene__content">
        <span class="svc-scene__num">05</span>
        <h2 class="svc-scene__title" data-i18n="scene5.title">On reste à vos <em>côtés.</em></h2>
        <p class="svc-scene__lead" data-i18n="scene5.lead">Un site web doit évoluer pour rester performant. Nous assurons la maintenance technique, l'hébergement de sécurité et le suivi SEO mensuel pour vous garantir des résultats constants.</p>
        <div class="svc-scene__tags">
          <span class="svc-scene__tag"><span data-i18n="scene5.tag1">Maintenance technique</span></span>
          <span class="svc-scene__tag"><span data-i18n="scene5.tag2">Suivi SEO</span></span>
          <span class="svc-scene__tag"><span data-i18n="scene5.tag3">Hébergement Cloud</span></span>
        </div>
        <div class="svc-scene__actions">
          <a class="btn btn--accent svc-scene__cta" href="#contact" data-i18n="nav.cta">Parlons de votre projet</a>
          <a class="svc-scene__more" href="presence.html" data-i18n="scene.cta">Voir en détail<span class="viz-arrow-line"></span></a>
        </div>
      </div>
    </article>
    ```
- [ ] **Step 3: Commit**
  ```bash
  git add index.html i18n/*.json
  git commit -m "feat(services): add 5th service (Accompagnement) to HTML structure and translation dictionaries"
  ```

---

### Task 2: Intégration de la Ligne de Néon Tentaculaire et du Carrousel 3D en CSS

**Files:**
- Modify: `css/site.css`

**Interfaces:**
- Consumes: Structure HTML à 5 services
- Produces: Styles CSS pour le carrousel 3D horizontal et la ligne fluide néon sur mobile

- [ ] **Step 1: Déclarer la grille de carrousel 3D et le tentacule lumineux dans css/site.css**
  - Ajouter les classes de style pour `.svc-showcase__screen` en carrousel horizontal tactile avec effets de perspective :
    ```css
    @media (max-width: 768px) {
      .svc-showcase__screen {
        perspective: 800px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        height: 380px !important;
        overflow: visible !important;
      }
      .svc-scene {
        position: absolute !important;
        width: 280px !important;
        height: 340px !important;
        display: flex !important;
        flex-direction: column !important;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s !important;
        opacity: 0.4 !important;
        transform: scale(0.85) translateZ(-100px) !important;
        pointer-events: none !important;
      }
      .svc-scene.is-active {
        opacity: 1 !important;
        transform: scale(1) translateZ(0) !important;
        pointer-events: auto !important;
        z-index: 10 !important;
      }
      /* Positionnement asymétrique des scènes adjacentes géré en JS */
      
      /* Le tentacule lumineux */
      .svc-glow-line {
        position: relative;
        width: 100%;
        height: 2px;
        background: rgba(124, 58, 237, 0.15);
        margin-top: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.1);
      }
      .svc-glow-line__fill {
        position: absolute;
        top: 0; left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(90deg, transparent, #7C3AED, transparent);
        filter: drop-shadow(0 0 6px #7C3AED);
        transition: transform 0.5s ease-out;
      }
    }
    ```
- [ ] **Step 2: Commit**
  ```bash
  git add css/site.css
  git commit -m "style(mobile): implement 3D carousel structure and glowing neon tentacule pipeline line in CSS"
  ```

---

### Task 3: Implémentation de la iOS Bottom Sheet et des interactions JS

**Files:**
- Modify: `index.html`
- Modify: `css/site.css`
- Modify: `js/site.js`

**Interfaces:**
- Consumes: Transitions CSS
- Produces: Gestion dynamique de l'ouverture/fermeture du tiroir avec gestion du swipe tactile sur mobile

- [ ] **Step 1: Ajouter le markup de la Bottom Sheet dans index.html juste sous la section services**
  ```html
  <!-- iOS Bottom Sheet Drawer pour les détails de service -->
  <div class="svc-drawer" id="svc-drawer" aria-hidden="true" role="dialog">
    <div class="svc-drawer__overlay" id="svc-drawer-overlay"></div>
    <div class="svc-drawer__panel">
      <div class="svc-drawer__handle"></div>
      <button class="svc-drawer__close" id="svc-drawer-close" aria-label="Fermer le volet">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="svc-drawer__body" id="svc-drawer-body">
        <!-- Rempli dynamiquement en JS -->
      </div>
    </div>
  </div>
  ```
- [ ] **Step 2: Ajouter les styles CSS de la Bottom Sheet dans css/site.css**
  ```css
  .svc-drawer {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: none;
    align-items: flex-end;
  }
  .svc-drawer.is-active {
    display: flex;
  }
  .svc-drawer__overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  .svc-drawer.is-active .svc-drawer__overlay {
    opacity: 1;
  }
  .svc-drawer__panel {
    position: relative;
    width: 100%;
    max-height: 80vh;
    background: rgba(6, 3, 9, 0.9);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 32px 32px 0 0;
    padding: 1.5rem;
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1;
    overflow-y: auto;
  }
  .svc-drawer.is-active .svc-drawer__panel {
    transform: translateY(0);
  }
  .svc-drawer__handle {
    width: 40px;
    height: 4px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    margin: 0 auto 1.5rem;
  }
  .svc-drawer__close {
    position: absolute;
    top: 1rem;
    right: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
  }
  ```
- [ ] **Step 3: Coder la rotation 3D et le déclenchement de la Bottom Sheet dans js/site.js**
  - Mettre à jour l'initialisation des scènes en JS pour supporter la 5ème scène.
  - Gérer le décalage 3D (`rotateY`, `translateZ`, `translateX`) en fonction de l'index de la scène active pour donner la perspective de roue.
  - Implémenter l'ouverture de la Bottom Sheet au clic sur la carte active, en clonant son contenu riche dans `.svc-drawer__body`.
- [ ] **Step 4: Commit**
  ```bash
  git add index.html css/site.css js/site.js
  git commit -m "feat(mobile): implement iOS Bottom Sheet drawer markup, styling and JS 3D carousel logic"
  ```
