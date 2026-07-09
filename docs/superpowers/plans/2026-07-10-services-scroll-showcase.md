# Scroll-Driven Services Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Services section into an immersive Scroll-Driven Showcase. The section pins as you scroll, filling vertical timeline indicators next to the pillars, cross-fading description cards, and triggering cinematic camera scale animations on the media assets.

**Architecture:** Integrate GSAP ScrollTrigger to pin the `#services` section on desktop screens. Calculate the active service index dynamically from the scrubbed scroll progress. Add linear interpolation to fill the active pillar's timeline bar vertically. Trigger GSAP scale-down transitions on the media assets for cinematic impact.

**Tech Stack:** Vanilla JavaScript (ES6), GSAP, ScrollTrigger, CSS, HTML5.

## Global Constraints
- Target: SMBs, freelancers, artisans in Wallonia
- Stack: Vanilla HTML/CSS/JS + Node.js server (no framework)
- Dark theme background (near-black `#060309`) with violet accent (`#7C3AED`)
- No browser window openings during execution or testing

---

### Task 1: CSS Updates in css/site-extra.css

**Files:**
- Modify: `css/site-extra.css`

**Interfaces:**
- Consumes: `.svc-card`, `.svc-card__progress`, and `.svc-card__progress-fill` classes.
- Produces: Timeline progress line styling and height pinning styles.

- [ ] **Step 1: Replace previously appended AI/showcase styles in css/site-extra.css**
  We will replace the showcase section (under `Premium Split Showcase`) with updated scroll-driven styles:
  ```css
  /* ==========================================================================
     Premium Split Showcase: Left Column Descriptions & Right Column Clean Image
     ========================================================================== */

  /* 50/50 main grid split on desktop */
  @media (min-width: 861px) {
    #services {
      height: 100vh !important;
      min-height: 100vh !important;
      display: flex;
      align-items: center;
      overflow: hidden;
    }

    .svc-layout {
      grid-template-columns: 5.5fr 6.5fr !important; /* Balanced split */
      height: 100%;
      align-items: center;
    }
    
    /* Hide the right-side floating content cards to keep image completely clean */
    .svc-scene__content {
      display: none !important;
    }
    
    /* Left column styling */
    .svc-nav-col {
      padding: 2.8rem 2.2rem !important;
      justify-content: center !important;
      border-right: 1px solid rgba(255, 255, 255, 0.05) !important;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Grid inside the left column */
    .svc-left-grid {
      display: grid;
      grid-template-columns: 1fr 1.35fr; /* 5 pillars on left, active description next to it */
      gap: 2rem;
      width: 100%;
      align-items: center;
    }
    
    /* 5 Pillars Sidebar */
    .svc-pillars-sidebar {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    /* Inactive states & timeline styling */
    .svc-card {
      position: relative;
      padding: 1.2rem 1.4rem !important;
      background: transparent !important;
      border-left: 2px solid rgba(255, 255, 255, 0.05) !important;
      border-top: none !important;
      border-right: none !important;
      border-bottom: none !important;
      border-radius: 0 !important;
      box-shadow: none !important;
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
      height: 0%; /* Vertical progression! */
      background: var(--c-accent-bright, #9F67FF);
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.6);
      transition: none; /* Controlled directly by GSAP ScrollTrigger */
    }

    /* Descriptions Panel */
    .svc-desc-panel {
      position: relative;
      width: 100%;
      min-height: 380px;
      align-self: center;
    }
    
    /* Inactive pane styling */
    .svc-desc-pane {
      display: none;
      flex-direction: column;
      gap: 1.1rem;
      opacity: 0;
      transform: translateY(12px);
      transition: none;
    }
    
    /* Active pane animations */
    .svc-desc-pane.is-active {
      display: flex;
    }

    .svc-desc-pane__title {
      font-family: var(--font-head);
      font-size: 1.4rem;
      line-height: 1.35;
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
      font-size: 0.86rem;
      line-height: 1.55;
      color: rgba(255, 255, 255, 0.65);
      margin: 0;
    }

    /* Tag Pills */
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
      font-size: 0.72rem;
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
      width: 11px;
      height: 11px;
      color: var(--c-accent-bright, #9F67FF);
      flex-shrink: 0;
    }

    /* Actions Container */
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
  }

  /* Fallbacks & Tablet Adjustments */
  @media (max-width: 860px) and (min-width: 769px) {
    .svc-left-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      width: 100%;
    }
    .svc-desc-panel {
      width: 100%;
      margin-top: 0.5rem;
    }
    .svc-desc-pane {
      display: none;
      flex-direction: column;
      gap: 1rem;
    }
    .svc-desc-pane.is-active {
      display: flex;
    }
  }

  /* In mobile layout, hide the left side description pane container (right column swipe card displays instead) */
  @media (max-width: 768px) {
    .svc-desc-panel {
      display: none !important;
    }
  }
  ```

- [ ] **Step 2: Commit CSS changes**
  Run:
  ```bash
  git add css/site-extra.css
  git commit -m "style: modify services layout to vertical left-border timelines"
  ```

---

### Task 2: JavaScript Implementation in js/site.js

**Files:**
- Modify: `js/site.js`

**Interfaces:**
- Consumes: GSAP ScrollTrigger library, HTML cards `.svc-card`, scenes `.svc-scene`, and description panes `.svc-desc-pane`.
- Produces: Fully interactive scroll-driven pinning timeline.

- [ ] **Step 1: Replace showcase navigation script in js/site.js**
  We will replace the carousel coverflow script (lines 328-466) with a ScrollTrigger implementation:
  ```javascript
    // --- 1b. SERVICES : Scroll-Driven Showcase with GSAP ScrollTrigger ---
    const svcShowcase = document.querySelector('.svc-showcase');
    if (svcShowcase) {
      const scenes = svcShowcase.querySelectorAll('.svc-scene');
      const dots = svcShowcase.querySelectorAll('.svc-dot');
      const cards = document.querySelectorAll('.svc-card');
      const panes = document.querySelectorAll('.svc-desc-pane');
      const total = scenes.length;
      let currentIndex = 0;
      let isAnimating = false;

      // Desktop Pinning logic
      const initScrollShowcase = () => {
        const isMobile = window.innerWidth <= 860;
        
        if (isMobile) {
          // Fallback to mobile scroll/swipe behavior
          scenes.forEach((s, i) => {
            s.style.transform = '';
            s.style.opacity = '';
            s.style.pointerEvents = '';
          });
          return;
        }

        // Create main ScrollTrigger
        const st = ScrollTrigger.create({
          trigger: "#services",
          start: "top top",
          end: "+=3200", // Scroll track length
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const index = Math.min(total - 1, Math.floor(progress * total));
            
            if (index !== currentIndex && !isAnimating) {
              goToScene(index);
            }

            // Sync vertical timeline progress bars
            cards.forEach((card, i) => {
              const fill = card.querySelector('.svc-card__progress-fill');
              if (fill) {
                const startRange = i / total;
                const endRange = (i + 1) / total;
                let pct = 0;
                
                if (progress > startRange && progress <= endRange) {
                  pct = (progress - startRange) / (endRange - startRange);
                } else if (progress > endRange) {
                  pct = 1;
                }
                gsap.set(fill, { height: `${pct * 100}%` });
              }
            });
          }
        });

        // Sync click events to scroll target
        cards.forEach((card, i) => {
          card.addEventListener('click', () => {
            const rangeStart = i / total;
            const scrollPos = st.start + rangeStart * (st.end - st.start) + 20;
            gsap.to(window, {
              scrollTo: scrollPos,
              duration: 1.1,
              ease: "power3.inOut"
            });
          });
        });
      };

      const goToScene = (index) => {
        isAnimating = true;
        currentIndex = index;

        // Toggle dots active class
        dots.forEach((d, i) => d.classList.toggle('is-active', i === currentIndex));

        // Toggle cards active class
        cards.forEach((card, i) => card.classList.toggle('is-active', i === currentIndex));

        // Transition description panes
        panes.forEach((pane, i) => {
          const isActive = i === currentIndex;
          if (isActive) {
            pane.style.display = 'flex';
            gsap.fromTo(pane, 
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
            );
          } else {
            pane.style.display = 'none';
          }
        });

        // Transition media scenes (Cinematic scale down camera motion)
        scenes.forEach((scene, i) => {
          const isActive = i === currentIndex;
          scene.classList.toggle('is-active', isActive);
          
          if (isActive) {
            const media = scene.querySelector('.svc-scene__media');
            if (media) {
              gsap.fromTo(media,
                { scale: 1.12, filter: 'brightness(0.7)' },
                { scale: 1.0, filter: 'brightness(1)', duration: 1.2, ease: 'power2.out' }
              );
            }
          }
        });

        // Small timeout to prevent overlapping scroll animations
        setTimeout(() => { isAnimating = false; }, 200);
      };

      // Run on DOM load
      initScrollShowcase();
      
      // Update on resize
      window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
      });
    }
  ```

- [ ] **Step 2: Check compiler outputs and verify page runs 200**
  Run local connectivity command: `node -e "require('http').get('http://localhost:3000/', res => console.log(res.statusCode))"`.

- [ ] **Step 3: Commit js/site.js changes**
  Run:
  ```bash
  git add js/site.js
  git commit -m "feat(client): implement ScrollTrigger pinning and cinematic camera zooms for services"
  ```
