# Unified Glassmorphic Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the Services section layout where the 5 vertical timeline pillars sit on the left, and the description texts and screens are hosted side-by-side inside a single, unified glassmorphic card on the right.

**Architecture:**
- **HTML**: Move `.svc-desc-panel` inside `.svc-showcase`, adjacent to `.svc-showcase__screen`.
- **CSS**: Apply glassmorphic styles and 2-column flex/grid layouts inside `.svc-showcase` on desktop screen dimensions.
- **JS**: Verify selectors still function properly with the updated DOM tree structure.

---

### Task 1: HTML Structure Modification in index.html

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: Existing HTML structure.
- Produces: Nest `.svc-desc-panel` inside `.svc-showcase`.

- [ ] **Step 1: Relocate the description panel container**
  Cut the `.svc-desc-panel` container and its inner `.svc-desc-pane` elements (lines 277 to 355) and paste them inside `.svc-showcase` (just before `.svc-showcase__screen`, around line 374).
  Also simplify the column container `.svc-nav-col` to only hold the `.svc-pillars-sidebar` to match the two-column sidebar vs dashboard grid.

- [ ] **Step 2: Commit HTML changes**
  Run:
  ```bash
  git add index.html
  git commit -m "feat(html): relocate service description panel into unified showcase container"
  ```

---

### Task 2: CSS Styling Updates in css/site-extra.css

**Files:**
- Modify: `css/site-extra.css`

**Interfaces:**
- Consumes: Moved HTML structures.
- Produces: Unified glassmorphic dashboard container styling and responsive column rules.

- [ ] **Step 1: Implement unified dashboard styling in css/site-extra.css**
  Update the media query styling starting from `@media (min-width: 861px)` to lay out the sidebar and the dashboard card.
  Specifically, `.svc-showcase` will become the unified card container with a liquid glass backdrop, fine white borders, and an internal grid splitting the text and media:
  ```css
  @media (min-width: 861px) {
    #services {
      height: 100vh !important;
      min-height: 100vh !important;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .svc-layout {
      grid-template-columns: 3.5fr 8.5fr !important; /* Pillars sidebar vs wide unified dashboard */
      gap: 3rem !important;
      height: 100%;
      align-items: center;
    }

    /* Left column only has sidebar */
    .svc-nav-col {
      padding: 2rem 0 !important;
      border-right: none !important;
      height: auto;
    }
    
    .svc-pillars-sidebar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
    }

    /* Timeline pillars styling */
    .svc-card {
      position: relative;
      padding: 1.2rem 1.4rem !important;
      background: transparent !important;
      border-left: 2px solid rgba(255, 255, 255, 0.05) !important;
      border-top: none !important;
      border-right: none !important;
      border-bottom: none !important;
      border-radius: 0 !important;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    .svc-card:hover {
      background: rgba(255, 255, 255, 0.02) !important;
      border-color: rgba(255, 255, 255, 0.15) !important;
    }
    .svc-card.is-active {
      background: rgba(124, 58, 237, 0.04) !important;
      border-color: rgba(124, 58, 237, 0.25) !important;
      box-shadow: inset 1px 0 0 rgba(124, 58, 237, 0.3) !important;
    }
    
    /* Progress bar on the left edge */
    .svc-card__progress {
      position: absolute;
      left: -2px;
      top: 0;
      width: 2px;
      height: 100%;
      background: transparent;
    }
    .svc-card__progress-fill {
      width: 100%;
      height: 0%;
      background: var(--c-accent-bright, #9F67FF);
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.6);
    }

    /* Right column holds the unified showcase card */
    .svc-showcase-col {
      height: 100%;
      display: flex;
      align-items: center;
    }

    /* Unified Glassmorphic Card Container */
    .svc-showcase {
      display: grid !important;
      grid-template-columns: 5.2fr 6.8fr !important; /* Left: texts, Right: screen */
      gap: 3.5rem !important;
      padding: 3rem !important;
      width: 100%;
      background: rgba(10, 6, 18, 0.3) !important; /* Liquid glass background */
      border: 1px solid rgba(255, 255, 255, 0.06) !important;
      border-radius: 24px !important;
      backdrop-filter: blur(25px) !important;
      box-shadow: 0 25px 55px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03) !important;
      position: relative;
      overflow: hidden;
    }

    /* Active description panels inside the card */
    .svc-desc-panel {
      position: relative;
      width: 100%;
      min-height: 290px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .svc-desc-pane {
      display: none;
      flex-direction: column;
      gap: 1rem;
      opacity: 0;
      transform: translateY(12px);
    }
    .svc-desc-pane.is-active {
      display: flex;
    }

    .svc-desc-pane__title {
      font-family: var(--font-head);
      font-size: 1.45rem;
      line-height: 1.3;
      color: #fff;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.015em;
    }
    .svc-desc-pane__title em {
      font-style: normal;
      color: var(--c-accent-bright, #9F67FF);
      font-weight: 700;
    }

    .svc-desc-pane__lead {
      font-size: 0.88rem;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
    }

    .svc-desc-pane__tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin: 0.2rem 0;
    }
    .svc-desc-pane__tag {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      background: rgba(124, 58, 237, 0.05);
      border: 1px solid rgba(124, 58, 237, 0.18);
      border-radius: 99px;
      font-size: 0.7rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.2s ease;
    }
    .svc-desc-pane__tag:hover {
      background: rgba(124, 58, 237, 0.1);
      border-color: rgba(124, 58, 237, 0.3);
      color: #fff;
    }
    .svc-desc-pane__tag-ico {
      width: 10px;
      height: 10px;
      color: var(--c-accent-bright, #9F67FF);
      flex-shrink: 0;
    }

    .svc-desc-pane__actions {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      margin-top: 0.4rem;
    }
    .svc-desc-pane__cta {
      padding: 0.6rem 1.2rem !important;
      font-size: 0.78rem !important;
      font-weight: 600 !important;
      border-radius: 99px !important;
      white-space: nowrap;
    }
    .svc-desc-pane__more {
      font-size: 0.78rem;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.6);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
      transition: color 0.2s ease;
    }
    .svc-desc-pane__more:hover {
      color: #fff;
    }
    .svc-desc-pane__more .viz-arrow-line {
      position: relative;
      display: inline-block;
      width: 14px;
      height: 1px;
      background: currentColor;
      transition: transform 0.2s ease;
    }
    .svc-desc-pane__more .viz-arrow-line::after {
      content: '';
      position: absolute;
      right: 0;
      top: -3px;
      width: 6px;
      height: 6px;
      border-right: 1px solid currentColor;
      border-top: 1px solid currentColor;
      transform: rotate(45deg);
    }
    .svc-desc-pane__more:hover .viz-arrow-line {
      transform: translateX(3px);
    }

    /* Right column holds the media screen inside the card */
    .svc-showcase__screen {
      position: relative;
      width: 100%;
      height: 290px;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
      background: #000;
    }

    /* Desktop fallback styles for inner scenes */
    .svc-scene__content {
      display: none !important; /* Handled by left panel */
    }
  }

  /* Fallback and responsive rules for tablet dimensions */
  @media (max-width: 860px) {
    .svc-desc-panel {
      display: none !important; /* Hidden on mobile/tablet viewport sizes */
    }
  }
  ```

- [ ] **Step 2: Commit CSS changes**
  Run:
  ```bash
  git add css/site-extra.css
  git commit -m "style: implement unified dashboard container layout in site-extra.css"
  ```

---

### Task 3: JS Selector Verification in js/site.js

**Files:**
- Modify: `js/site.js`

**Interfaces:**
- Consumes: Modified DOM nodes.
- Produces: Verify that `cards`, `panes`, `scenes`, and `dots` event listeners and transitions work as before.

- [ ] **Step 1: Verify the selector and event listeners**
  Confirm that `const panes = document.querySelectorAll('.svc-desc-pane');` in `js/site.js` works exactly as before. Since it uses document-wide querying, nesting changes won't break the selectors, but we must verify that all transitions function smoothly under ScrollTrigger.

- [ ] **Step 2: Confirm server responds status code 200**
  Run verification code: `node -e "require('http').get('http://localhost:3000/', res => console.log(res.statusCode))"`.

- [ ] **Step 3: Commit Task 3 if changes are made**
