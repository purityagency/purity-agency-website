# Hero Height & Chatbot Placement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Shorten Hero section height, reposition the scroll indicator, and relocate the chatbot widget to the bottom-right corner.

---

### Task 1: Update Chatbot Markup in `index.html`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\index.html`

- [ ] **Step 1: Set default right-side attribute on chatbot**
  Find the `<div id="chat" class="chat">` element (around line 917) and add the `data-side="right"` attribute:
  ```html
  <div id="chat" class="chat" data-side="right">
  ```

- [ ] **Step 2: Commit**
  ```bash
  git add index.html
  git commit -m "markup: set default right-side attribute on chatbot container"
  ```

---

### Task 2: Implement Hero Heights and Chatbot Position in `css/site.css`

**Files:**
- Modify: `c:\Users\User\Desktop\Purity ONE\purity-agency-site\css\site.css`

- [ ] **Step 1: Update Hero heights and padding**
  Find the `.hero` class (around line 496) and `.hero__content` class (around line 525) and reduce their heights:
  - Change `.hero` `min-height: 100vh;` to `min-height: 90vh;` (or `90svh`).
  - Change `.hero__content` `min-height: 100vh;` to `min-height: 90vh;` (or `90svh`).
  - Change `.hero__content` `padding-top: calc(var(--nav-h) + 7vh);` to `padding-top: calc(var(--nav-h) + 5vh);`.

- [ ] **Step 2: Reposition `.hero__scroll` indicator**
  Find the `.hero__scroll` rule (around line 640) and pull it higher:
  - Change `bottom: 3.5vh;` to `bottom: 7vh;`.

- [ ] **Step 3: Reposition `.chat` default placement**
  Find the `.chat` rule (around line 1983) and change its horizontal alignment:
  - Change `left: var(--s-lg);` to `right: var(--s-lg);`.

- [ ] **Step 4: Commit CSS**
  ```bash
  git add css/site.css
  git commit -m "style: reduce hero height, pull scroll indicator up, and shift default chatbot position to bottom-right"
  ```

---

### Task 3: Functional Verification

- [ ] **Step 1: Local Verification**
  Check the hero section height and ensure the "Découvrir" button is clearly visible above the fold. Check that the chatbot loads on the bottom-right and opens/closes inwards, and is draggable/snaps correctly.
