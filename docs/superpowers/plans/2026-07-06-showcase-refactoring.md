# Showcase Refactoring & Cards Interconnection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate services showcase text panels and interconnect them with the 4 service cards at the top of the page.

**Architecture:** Add classes/data-attributes to connect cards and showcase, style custom glassmorphism and cascading animations, and write a bidirectional JS synchronization wrapper.

**Tech Stack:** Vanilla JS, CSS3, HTML5

## Global Constraints
- Glassmorphism overlays must use HSL/RGB opacities for the dark violet theme.
- Cascading transition delays: 0.15s, 0.25s, 0.35s, 0.45s.
- Active card styling should match hover state without translateY.

---

### Task 1: Update Card Markup in `index.html`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\index.html`

**Interfaces:**
- Consumes: None
- Produces: Data-attributes on service cards

- [ ] **Step 1: Add target index attributes to cards**
  Add a `data-target-scene="N"` (where N is 0, 1, 2, 3) to each of the four `.svc-card` elements in the grid (around line 160-230).
  - Card 1: `data-target-scene="0"`
  - Card 2: `data-target-scene="1"`
  - Card 3: `data-target-scene="2"`
  - Card 4: `data-target-scene="3"`

- [ ] **Step 2: Commit**
  ```bash
  git add index.html
  git commit -m "markup: add data-target-scene attributes to service cards"
  ```

---

### Task 2: Implement Glassmorphism and Cascade Animations in `css/site.css`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\css\site.css`

**Interfaces:**
- Consumes: Markup from Task 1
- Produces: CSS animations and active state rules

- [ ] **Step 1: Update `.svc-scene__content` styling**
  Find the rule for `.svc-scene__content` in `css/site.css` (around line 899) and replace with the updated glassmorphism properties:
  ```css
  .svc-scene__content {
    position: absolute;
    z-index: 2;
    width: min(42%, 500px);
    padding: clamp(1.8rem, 2.6vw, 2.6rem);
    border-radius: 24px;
    background: rgba(12, 8, 18, 0.55);
    backdrop-filter: blur(28px) saturate(1.4);
    -webkit-backdrop-filter: blur(28px) saturate(1.4);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.6), 
      inset 0 1px 0 rgba(255, 255, 255, 0.15), 
      0 0 40px rgba(124, 58, 237, 0.08);
  }
  ```

- [ ] **Step 2: Update `.svc-scene__tags span` and `::before`**
  Find these classes (around line 980) and replace them with:
  ```css
  .svc-scene__tags span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.82rem;
    font-weight: 500;
    padding: 0.55rem 0.9rem;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    color: rgba(255,255,255,0.92);
    background: rgba(255,255,255,0.03);
    transition: background var(--t-fast), border-color var(--t-fast);
  }
  .svc-scene__tags span::before {
    content: '';
    width: 6px; height: 6px;
    flex-shrink: 0;
    background: var(--c-accent);
    border-radius: 50%;
    box-shadow: 0 0 6px var(--c-accent);
    opacity: 1;
  }
  ```

- [ ] **Step 3: Append cascading panel animations & card active state**
  Append these rules at the end of `css/site.css`:
  ```css
  /* Staggered slide-in for showcase content */
  .svc-scene .svc-scene__title,
  .svc-scene .svc-scene__lead,
  .svc-scene .svc-scene__tags,
  .svc-scene .svc-scene__actions {
    opacity: 0;
    transform: translateY(15px);
    transition: opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1), transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .svc-scene.is-active .svc-scene__title { opacity: 1; transform: translateY(0); transition-delay: 0.15s; }
  .svc-scene.is-active .svc-scene__lead  { opacity: 1; transform: translateY(0); transition-delay: 0.25s; }
  .svc-scene.is-active .svc-scene__tags  { opacity: 1; transform: translateY(0); transition-delay: 0.35s; }
  .svc-scene.is-active .svc-scene__actions { opacity: 1; transform: translateY(0); transition-delay: 0.45s; }

  /* Active card styling */
  .svc-card.is-active {
    border-color: rgba(124, 58, 237, 0.45);
    background: rgba(124, 58, 237, 0.06);
  }
  ```

- [ ] **Step 4: Commit CSS**
  ```bash
  git add css/site.css
  git commit -m "style: implement glassmorphism panel styles, refined tags, and cascade transitions"
  ```

---

### Task 3: Implement Interconnection in `js/site.js`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\js\site.js`

**Interfaces:**
- Consumes: Updated markup and CSS from Task 1 and 2
- Produces: Interactive click bindings and active synchronization between cards and slider

- [ ] **Step 1: Bind cards to slider inside showcase init**
  Locate the showcase initialization code in `js/site.js` (around lines 350-427) and inject card synchronization:
  - Select cards: `const cards = document.querySelectorAll('.svc-card');`
  - In `goToScene(index)`:
    Add code to toggle `.is-active` class on the card that matches the active index:
    ```javascript
    cards.forEach((card, i) => card.classList.toggle('is-active', i === currentIndex));
    ```
  - Bind card click event listeners:
    ```javascript
    cards.forEach((card, i) => {
      card.addEventListener('click', () => {
        goToScene(i);
        const showcaseSection = document.getElementById('services');
        if (showcaseSection) {
          showcaseSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
      // Set cursor-pointer style
      card.style.cursor = 'pointer';
    });
    ```

- [ ] **Step 2: Verify and Commit**
  ```bash
  git add js/site.js
  git commit -m "feat: interconnect service cards and showcase slider with bidirectional active synchronization"
  ```

---

### Task 4: Functional Verification

- [ ] **Step 1: Local Verification**
  Run/test the page, click each card to verify it smoothly transitions the showcase and scrolls to the section, and verify that the active card keeps the glowing border. Check the cascading animation on scene change.
