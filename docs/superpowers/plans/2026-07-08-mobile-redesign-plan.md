# Refonte Mobile & Responsive Globale — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mettre en œuvre une refonte mobile complète, fluide et intuitive (TabBar fixe, widgets condensés et carrousels tactiles) sur l'ensemble du site de Purity Agency.

**Architecture:** 
- Barre de navigation basse applicative fixe en bas d'écran sur mobile.
- Regroupement des actions de contact et de prise de rendez-vous dans la bulle OctoMask avec notification style Apple.
- Transformation des sections longues (tarifs et services) en carrousels horizontaux fluides (scroll-snap / swipe tactile).

**Tech Stack:** Vanilla HTML5, CSS3 (variables CSS, Flexbox, CSS Grid), Vanilla JS ES6+.

## Global Constraints
- Design sombre (fond proche du noir `#060309`).
- Filets blancs fins (`border: 1px solid rgba(255, 255, 255, 0.12)`).
- Accents violet/mauve (`#7C3AED`).
- Pas de bibliothèque tierce pour les carrousels (Vanilla JS/CSS scroll-snap uniquement).

---

### Task 1: Barre de Navigation Basse Mobile (HTML & CSS)

**Files:**
- Modify: [index.html](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/index.html)
- Modify: [css/site.css](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/css/site.css)

- [ ] **Step 1: Ajouter le markup de la TabBar dans l'index HTML**
  Insérer la structure HTML de la TabBar juste avant la fermeture de la balise `</body>`.
  ```html
  <!-- Barre de Navigation Basse Mobile -->
  <nav class="mobile-nav-bar" aria-label="Navigation mobile">
    <a href="#hero" class="mobile-nav-item is-active" data-section="hero">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      <span class="mobile-nav-label">Accueil</span>
    </a>
    <a href="#services" class="mobile-nav-item" data-section="services">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
      <span class="mobile-nav-label">Services</span>
    </a>
    <a href="#tarifs" class="mobile-nav-item" data-section="tarifs">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 12h8"/></svg>
      <span class="mobile-nav-label">Tarifs</span>
    </a>
    <a href="#contact" class="mobile-nav-item" data-section="contact">
      <svg class="mobile-nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span class="mobile-nav-label">Contact</span>
    </a>
  </nav>
  ```

- [ ] **Step 2: Ajouter les styles de la TabBar dans la feuille CSS**
  Ajouter le bloc de styles CSS à la fin du fichier `css/site.css` (caché par défaut sur desktop, affiché sur mobile via media query).
  ```css
  /* TabBar Mobile */
  .mobile-nav-bar {
    position: fixed;
    bottom: 16px;
    left: 50%;
    transform: translateX(-50%) translateY(120%);
    width: calc(100% - 32px);
    max-width: 400px;
    height: 64px;
    background: rgba(6, 3, 9, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 32px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 999;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (max-width: 860px) {
    .mobile-nav-bar {
      transform: translateX(-50%) translateY(0);
    }
    /* Cacher le menu burger existant du top header */
    .header__burger, .nav-menu {
      display: none !important;
    }
  }

  .mobile-nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    font-size: 10px;
    gap: 4px;
    transition: color 0.3s;
    position: relative;
    padding: 8px 12px;
  }

  .mobile-nav-item:hover, .mobile-nav-item.is-active {
    color: #ffffff;
  }

  .mobile-nav-icon {
    width: 20px;
    height: 20px;
    transition: transform 0.3s;
  }

  .mobile-nav-item.is-active .mobile-nav-icon {
    transform: scale(1.1);
    stroke: #7C3AED;
  }

  .mobile-nav-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #7C3AED;
    opacity: 0;
    transform: scale(0);
    transition: opacity 0.3s, transform 0.3s;
  }

  .mobile-nav-item.is-active::after {
    opacity: 1;
    transform: scale(1);
  }
  ```

- [ ] **Step 3: Vérifier le masquage / affichage de la TabBar**
  Ouvrir le navigateur et vérifier que la barre de navigation n'est pas visible sur grand écran et qu'elle s'affiche sur petit écran (largeur inférieure à 860px).

- [ ] **Step 4: Commit**
  ```bash
  git add index.html css/site.css
  git commit -m "feat(mobile): add HTML markup and CSS styling for bottom TabBar navigation"
  ```

---

### Task 2: JS Scrollspy pour la TabBar active

**Files:**
- Modify: [js/site.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/js/site.js)

- [ ] **Step 1: Ajouter l'écouteur de défilement (Scrollspy)**
  À la fin du fichier `js/site.js`, implémenter le scrollspy pour suivre la section active.
  ```javascript
  // Scrollspy pour la TabBar Mobile
  document.addEventListener('DOMContentLoaded', () => {
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    const sections = document.querySelectorAll('section[id], header[id]');

    function updateActiveNavItem() {
      let currentSectionId = 'hero';
      const scrollPos = window.scrollY + window.innerHeight / 3;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      mobileNavItems.forEach(item => {
        item.classList.remove('is-active');
        if (item.getAttribute('data-section') === currentSectionId) {
          item.classList.add('is-active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem();
  });
  ```

- [ ] **Step 2: Vérifier le changement d'onglet actif au défilement**
  Faire défiler la page sur mobile et vérifier que l'indicateur mauve et la classe active basculent d'une section à l'autre de manière synchrone.

- [ ] **Step 3: Commit**
  ```bash
  git add js/site.js
  git commit -m "feat(mobile): add JS Scrollspy functionality to highlight active navigation tab"
  ```

---

### Task 3: Hub Flottant Chatbot Unique & Notification Rouge (OctoMask)

**Files:**
- Modify: [index.html](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/index.html)
- Modify: [css/site.css](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/css/site.css)
- Modify: [js/site.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/js/site.js)

- [ ] **Step 1: Ajouter le badge rouge de notification**
  Trouver la bulle d'appel du chatbot dans `index.html` (généralement `#chatbot-teaser`) et insérer le badge rouge.
  ```html
  <div class="chatbot-teaser__badge" aria-label="Nouvelle notification">1</div>
  ```

- [ ] **Step 2: Ajouter les styles CSS du badge rouge et repositionner le chatbot**
  Dans `css/site.css`, modifier la position du chatbot sur mobile pour qu'il soit placé 96px au-dessus du bas pour ne pas chevaucher la TabBar.
  ```css
  /* Ajustement position chatbot sur mobile */
  @media (max-width: 860px) {
    #chatbot-teaser {
      bottom: 96px !important;
      right: 16px !important;
    }
    #chatbot-panel {
      bottom: 96px !important;
      right: 16px !important;
      width: calc(100% - 32px) !important;
      max-width: 400px !important;
    }
  }

  .chatbot-teaser__badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    background: #FF3B30;
    color: white;
    font-size: 11px;
    font-weight: 700;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #060309;
    box-shadow: 0 2px 8px rgba(255, 59, 48, 0.4);
    animation: pulseBadge 2s infinite;
  }

  @keyframes pulseBadge {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  ```

- [ ] **Step 3: Intégrer les boutons double-action (IA / Meet) dans le panel**
  Modifier la structure intérieure du chatbot dans `index.html` (le header ou le haut de la zone de message) pour proposer le choix direct.
  ```html
  <div class="chatbot-header__actions">
    <button class="btn btn--accent chatbot-btn-meet" onclick="openMeetModal()">
      <svg class="btn-meet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>
      <span>Réserver 15 min</span>
    </button>
  </div>
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add index.html css/site.css js/site.js
  git commit -m "feat(mobile): position chatbot above TabBar, add Apple-style red notification badge, and add quick Meet button"
  ```

---

### Task 4: Carrousels Tactiles Horizontaux (Swipe Services & Tarifs)

**Files:**
- Modify: [css/site.css](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/css/site.css)
- Modify: [js/site.js](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/js/site.js)

- [ ] **Step 1: Modifier les styles CSS de la section Tarifs**
  Dans `css/site.css`, transformer la liste des packs tarifs en carrousel horizontal tactile uniquement sur mobile.
  ```css
  @media (max-width: 860px) {
    .pricing-grid {
      display: flex !important;
      overflow-x: auto !important;
      scroll-snap-type: x mandatory !important;
      gap: 16px !important;
      padding: 16px !important;
      scrollbar-width: none !important; /* Firefox */
    }
    .pricing-grid::-webkit-scrollbar {
      display: none !important; /* Chrome/Safari */
    }
    .pricing-card {
      min-width: 290px !important;
      flex: 0 0 85% !important;
      scroll-snap-align: center !important;
    }
  }
  ```

- [ ] **Step 2: Gérer le Swipe Tactile sur la section Services**
  Dans `js/site.js`, intercepter les glissements de doigt sur l'image de service `.svc-showcase__screen` pour naviguer entre les services.
  ```javascript
  // Swipe tactile Services
  document.addEventListener('DOMContentLoaded', () => {
    const screen = document.querySelector('.svc-showcase__screen');
    if (!screen) return;

    let touchStartX = 0;
    let touchEndX = 0;

    screen.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    screen.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50;
      if (touchEndX < touchStartX - threshold) {
        // Swipe à gauche -> Service suivant
        const btnNext = document.querySelector('.svc-nav-btn--next');
        if (btnNext) btnNext.click();
      } else if (touchEndX > touchStartX + threshold) {
        // Swipe à droite -> Service précédent
        // (on récupère ou simule le clic précédent)
        const activeCard = document.querySelector('.svc-card.is-active');
        if (activeCard) {
          const prevCard = activeCard.previousElementSibling || document.querySelector('.svc-nav-list').lastElementChild;
          if (prevCard) prevCard.click();
        }
      }
    }
  });
  ```

- [ ] **Step 3: Vérifier le bon fonctionnement des carrousels sur simulateur mobile**
  Faire un swipe latéral sur la grille de tarifs et sur les images de services et valider l'alignement (`scroll-snap`) et le changement de service.

- [ ] **Step 4: Commit**
  ```bash
  git add css/site.css js/site.js
  git commit -m "feat(mobile): implement responsive swipeable carrousels for Tarifs and Services sections"
  ```
