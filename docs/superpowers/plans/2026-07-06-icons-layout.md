# Marquee Relocation & Services Cards SVG Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate the marquee section above the services cards and replace the card icons with custom minimalist SVG icons containing micro-animations.

**Architecture:** HTML structure repositioning, inline SVG injection, and CSS keyframe animations triggered by parent `:hover` states.

**Tech Stack:** Vanilla HTML5, CSS3, SVG

## Global Constraints
- Custom minimalist white SVG icons inside `.viz-glass-node`
- Thickness of SVG strokes should be 1.75px
- Animations must be triggered on card hover (`.svc-card:hover`) using CSS Transitions and Keyframes
- No frameworks or external dependencies

---

### Task 1: Relocate the Marquee Section in `index.html`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\index.html`

**Interfaces:**
- Consumes: None
- Produces: Repositioned marquee component

- [ ] **Step 1: Relocate the marquee element**
  Cut the marquee code block from lines 189-196:
  ```html
  <!-- ═══ MARQUEE MÉTIERS ═══ -->
  <div class="marquee" aria-hidden="true">
    <div class="marquee__track">
      <span data-i18n="marquee.restaurants">Restaurants</span><span class="marquee__dot">•</span><span data-i18n="marquee.artisans">Artisans</span><span class="marquee__dot">•</span><span data-i18n="marquee.coiffeurs">Coiffeurs</span><span class="marquee__dot">•</span><span data-i18n="marquee.garages">Garages</span><span class="marquee__dot">•</span><span data-i18n="marquee.independants">Indépendants</span><span class="marquee__dot">•</span><span data-i18n="marquee.commerces">Commerces</span><span class="marquee__dot">•</span><span data-i18n="marquee.cabinets">Cabinets</span><span class="marquee__dot">•</span><span data-i18n="marquee.pme">PME</span><span class="marquee__dot">•</span>
      <span data-i18n="marquee.restaurants">Restaurants</span><span class="marquee__dot">•</span><span data-i18n="marquee.artisans">Artisans</span><span class="marquee__dot">•</span><span data-i18n="marquee.coiffeurs">Coiffeurs</span><span class="marquee__dot">•</span><span data-i18n="marquee.garages">Garages</span><span class="marquee__dot">•</span><span data-i18n="marquee.independants">Indépendants</span><span class="marquee__dot">•</span><span data-i18n="marquee.commerces">Commerces</span><span class="marquee__dot">•</span><span data-i18n="marquee.cabinets">Cabinets</span><span class="marquee__dot">•</span><span data-i18n="marquee.pme">PME</span><span class="marquee__dot">•</span>
    </div>
  </div>
  ```
  And paste it directly before the `<section id="probleme"...>` tag (around line 144).

- [ ] **Step 2: Verify local layout**
  View the page at `http://localhost:3000` to verify the marquee scrolls above the services card section.

- [ ] **Step 3: Commit**
  Run:
  ```bash
  git add index.html
  git commit -m "style: move marquee section above services cards"
  ```

---

### Task 2: Replace Geometric Icons with Inline SVGs in `index.html`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\index.html`

**Interfaces:**
- Consumes: Repositioned marquee from Task 1
- Produces: Updated markup for services cards with SVG structure

- [ ] **Step 1: Replace Card 1 Icon (Sites web performants)**
  Replace the inside of `<div class="svc-card__ico" aria-hidden="true">` in Card 1 with:
  ```html
  <div class="viz-glass-node">
    <svg class="ico-svg ico-browser" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="3" width="20" height="15" rx="2" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <circle cx="5" cy="5.5" r="0.5" fill="currentColor" />
      <circle cx="8" cy="5.5" r="0.5" fill="currentColor" />
      <circle cx="11" cy="5.5" r="0.5" fill="currentColor" />
      <path class="ico-browser__cursor" d="M12 14l3 7 2-1-3-7h5L12 8z" />
    </svg>
  </div>
  ```

- [ ] **Step 2: Replace Card 2 Icon (Présence Google Business)**
  Replace the inside of `<div class="svc-card__ico" aria-hidden="true">` in Card 2 with:
  ```html
  <div class="viz-glass-node">
    <svg class="ico-svg ico-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path class="ico-pin__store" d="M3 9l9-5 9 5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" />
      <path class="ico-pin__awning" d="M3 9h18" />
      <path d="M5 9V11" />
      <path d="M9 9V11" />
      <path d="M13 9V11" />
      <path d="M17 9V11" />
      <path class="ico-pin__marker" d="M12 8c-2.2 0-4 1.8-4 4 0 2.5 4 7 4 7s4-4.5 4-7c0-2.2-1.8-4-4-4z" />
      <circle class="ico-pin__marker-hole" cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  </div>
  ```

- [ ] **Step 3: Replace Card 3 Icon (Intégration WhatsApp)**
  Replace the inside of `<div class="svc-card__ico" aria-hidden="true">` in Card 3 with:
  ```html
  <div class="viz-glass-node">
    <svg class="ico-svg ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <circle class="ico-chat__dot ico-chat__dot--1" cx="8" cy="12" r="1" fill="currentColor" />
      <circle class="ico-chat__dot ico-chat__dot--2" cx="12" cy="12" r="1" fill="currentColor" />
      <circle class="ico-chat__dot ico-chat__dot--3" cx="16" cy="12" r="1" fill="currentColor" />
    </svg>
  </div>
  ```

- [ ] **Step 4: Replace Card 4 Icon (Automatisations & IA)**
  Replace the inside of `<div class="svc-card__ico" aria-hidden="true">` in Card 4 with:
  ```html
  <div class="viz-glass-node">
    <svg class="ico-svg ico-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
      <path class="ico-spark__main" d="M12 2c0 5.5 4.5 10 10 10-5.5 0-10 4.5-10 10 0-5.5-4.5-10-10-10 5.5 0 10-4.5 10-10z" />
      <path class="ico-spark__sub-1" d="M19 5c0 1.6 1.4 3 3 3-1.6 0-3 1.4-3 3 0-1.6-1.4-3-3-3 1.6 0 3-1.4 3-3z" />
      <path class="ico-spark__sub-2" d="M5 19c0 1.6 1.4 3 3 3-1.6 0-3 1.4-3 3 0-1.6-1.4-3-3-3 1.6 0 3-1.4 3-3z" />
    </svg>
  </div>
  ```

- [ ] **Step 5: Verify syntax**
  Verify index.html parses and renders without broken layout.

- [ ] **Step 6: Commit**
  Run:
  ```bash
  git add index.html
  git commit -m "style: replace geometric shapes with custom SVGs in service cards"
  ```

---

### Task 3: Implement CSS Styling and Animations in `css/site.css`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\css\site.css`

**Interfaces:**
- Consumes: Inline SVGs in Task 2
- Produces: CSS animations and rules for styling SVGs and triggering hover behaviors

- [ ] **Step 1: Add Base SVG Styles**
  Append these styles to the end of `css/site.css` (or under the Visual Nodes section):
  ```css
  /* SVG Custom Icons styling */
  .ico-svg {
    width: 20px;
    height: 20px;
    color: #fff;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform var(--t-med);
  }

  .viz-glass-node svg {
    display: block;
  }
  ```

- [ ] **Step 2: Add Browser Icon Click animation**
  Add keyframes and triggers for `.ico-browser`:
  ```css
  /* Card 1: Browser + Cursor Click Animation */
  .ico-browser__cursor {
    transform-origin: 12px 14px;
    transition: transform var(--t-med) cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .svc-card:hover .ico-browser__cursor {
    transform: translate(-2px, -2px) scale(0.9);
    animation: cursor-click 0.4s ease forwards;
  }
  @keyframes cursor-click {
    0% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-2px, -2px) scale(0.85); }
    100% { transform: translate(-1px, -1px) scale(1); }
  }
  ```

- [ ] **Step 3: Add Google Pin Bounce animation**
  Add styles and keyframes for `.ico-pin`:
  ```css
  /* Card 2: Google Pin Bounce Animation */
  .ico-pin__marker {
    transform-origin: 12px 19px;
  }
  .svc-card:hover .ico-pin__marker {
    animation: pin-bounce 0.6s ease infinite alternate;
  }
  @keyframes pin-bounce {
    0% { transform: translateY(0); }
    100% { transform: translateY(-3px); }
  }
  ```

- [ ] **Step 4: Add WhatsApp Chat Bubble Typing animation**
  Add styles and keyframes for `.ico-chat`:
  ```css
  /* Card 3: Chat Bubble Typing Animation */
  .ico-chat__dot {
    opacity: 0.3;
  }
  .svc-card:hover .ico-chat__dot {
    animation: chat-typing 1.4s infinite;
  }
  .svc-card:hover .ico-chat__dot--1 { animation-delay: 0s; }
  .svc-card:hover .ico-chat__dot--2 { animation-delay: 0.2s; }
  .svc-card:hover .ico-chat__dot--3 { animation-delay: 0.4s; }

  @keyframes chat-typing {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  ```

- [ ] **Step 5: Add IA Sparkle Rotation/Pulse animation**
  Add styles and keyframes for `.ico-spark`:
  ```css
  /* Card 4: IA Sparkle Animation */
  .ico-spark__main {
    transform-origin: 12px 12px;
    transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .svc-card:hover .ico-spark__main {
    transform: rotate(90deg) scale(1.1);
  }
  .ico-spark__sub-1, .ico-spark__sub-2 {
    opacity: 0.5;
    transform-origin: center;
  }
  .svc-card:hover .ico-spark__sub-1 {
    animation: spark-pulse 1s infinite alternate;
  }
  .svc-card:hover .ico-spark__sub-2 {
    animation: spark-pulse 1s infinite alternate 0.5s;
  }
  @keyframes spark-pulse {
    0% { opacity: 0.3; transform: scale(0.8); }
    100% { opacity: 1; transform: scale(1.2); }
  }
  ```

- [ ] **Step 6: Commit CSS**
  Run:
  ```bash
  git add css/site.css
  git commit -m "style: add CSS animations for service card SVG icons"
  ```

---

### Task 4: Visual and Functional Verification

- [ ] **Step 1: Manual Visual Verification**
  Deploy/run the dev server and hover over each of the four cards to verify the cursor click, pin bounce, chat bubble typing dots, and AI sparkles rotation/pulse.

- [ ] **Step 2: Layout Verification**
  Check the marquee placement and spacing above `.svc-cards`. Verify visual consistency with the liquid glass identity.
