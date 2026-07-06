# Design Specification: Showcase Refactoring & Cards Interconnection

This specification defines the layout, design language, and interaction improvements for the services showcase section of the Purity Agency website.

## 🎯 Goals
1. Standardize and elevate the services showcase text panels `.svc-scene__content` to a premium "liquid glass" visual style.
2. Refine the showcase tags to use a clean, Apple-like micro-bullet design instead of solid purple block masks.
3. Introduce a staggered slide-in transition for items inside the active showcase text panel.
4. Interconnect the 4 service cards at the top with the showcase slider at the bottom, so clicking a card transitions the slider and scrolls to the showcase. The corresponding card will remain in its active state (without translation offset).

---

## 🎨 CSS Upgrades (`css/site.css`)

### 1. Showcase Text Panels & Refined Tags
```css
/* Glassmorphism upgrade for the panel */
.svc-scene__content {
  background: rgba(12, 8, 18, 0.55);
  backdrop-filter: blur(28px) saturate(1.4);
  -webkit-backdrop-filter: blur(28px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 30px 80px rgba(0, 0, 0, 0.6), 
    inset 0 1px 0 rgba(255, 255, 255, 0.15), 
    0 0 40px rgba(124, 58, 237, 0.08);
}

/* Tags refinement (Apple-like clean dots) */
.svc-scene__tags span {
  font-size: 0.82rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
}

.svc-scene__tags span::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 6px var(--c-accent);
  opacity: 1;
  mask: none;
  -webkit-mask: none;
}
```

### 2. Staggered Cascading Animations on Scene Change
```css
/* Initial hidden state for items inside the panel */
.svc-scene .svc-scene__title,
.svc-scene .svc-scene__lead,
.svc-scene .svc-scene__tags,
.svc-scene .svc-scene__actions {
  opacity: 0;
  transform: translateY(15px);
  transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
}

/* Active cascade animations */
.svc-scene.is-active .svc-scene__title { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
.svc-scene.is-active .svc-scene__lead  { opacity: 1; transform: translateY(0); transition-delay: 0.25s; }
.svc-scene.is-active .svc-scene__tags  { opacity: 1; transform: translateY(0); transition-delay: 0.35s; }
.svc-scene.is-active .svc-scene__actions { opacity: 1; transform: translateY(0); transition-delay: 0.45s; }
```

### 3. Active State Style for Top Cards
```css
.svc-card.is-active {
  border-color: rgba(124, 58, 237, 0.45);
  background: rgba(124, 58, 237, 0.06);
}
```

---

## ⚙️ JavaScript & Interaction (`js/site.js`)
We will select all `.svc-card` elements and bind them to the slider state:
1. Clicking on a card changes the active slide.
2. The window is scrolled smoothly to `#services` when a card is clicked.
3. The active card class `.is-active` is synchronized with the showcase index `currentIndex` dynamically.
