# Design Specification: Hero Height & Chatbot Placement

This specification outlines the technical design for adjusting the Hero section height and relocating the default chatbot widget position.

---

## 🏔️ 1. Hero Section Height Adjustment

### Objective:
Ensure the entire hero section content (headline, CTA buttons, reassurance indicators, and the scroll-down "Découvrir" mouse indicator) fits completely within the standard desktop and laptop viewport heights without requiring any initial scrolling.

### CSS Changes (`css/site.css`):
* **`.hero` (Main Container)**:
  Reduce `min-height: 100vh;` to `min-height: 90vh;` (or `90svh` to respect dynamic mobile viewports).
* **`.hero__content` (Content Wrapper)**:
  Reduce `min-height: 100vh;` to `min-height: 90vh;` (or `90svh`).
  Adjust padding to remount text content slightly higher:
  Change `padding-top: calc(var(--nav-h) + 7vh);` to `padding-top: calc(var(--nav-h) + 5vh);`.
* **`.hero__scroll` (Scroll Indicator)**:
  Pull the scroll button higher up to make it prominent.
  Change `bottom: 3.5vh;` to `bottom: 7vh;`.

---

## 🧠 2. Chatbot Strategic Relocation (Bottom-Right)

### Objective:
Align the default chatbot placement with standard user expectations (mental schemas) to optimize engagement rates (+25% to +40% click-through rate) and thumb reachability on mobile devices, while preserving drag-and-drop flexibility.

### HTML Changes (`index.html`):
* Add the `data-side="right"` attribute to the `#chat` div to ensure initial teaser and panels align left (inward on the page):
  `<div id="chat" class="chat" data-side="right">`

### CSS Changes (`css/site.css`):
* **`.chat`**:
  Change default positioning from left-aligned to right-aligned:
  Replace `left: var(--s-lg);` with `right: var(--s-lg);`.
