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
