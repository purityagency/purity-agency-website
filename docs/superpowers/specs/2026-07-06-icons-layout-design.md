# Design Specification: Marquee Relocation & Services Cards SVG Icons

This specification defines the design and layout improvements for the Purity Agency website. The goals are:
1. Relocating the scrolling marquee above the services cards for better logical continuity.
2. Replacing abstract geometric shapes in the service cards with custom, minimalist white SVG icons that feature micro-animations on hover.

---

## 🗺️ Layout Changes

### Marquee Relocation
The scrolling marquee (`.marquee`) currently resides below the services cards (`.svc-cards`). It will be moved directly above the services cards section to bridge the gap between the Hero section and the Services/Cards.

#### Old Structure:
```html
<section id="hero" class="hero">...</section>
<section id="probleme" class="sec svc-cards ...">...</section>
<div class="marquee">...</div>
<section id="services" class="svc ...">...</section>
```

#### New Structure:
```html
<section id="hero" class="hero">...</section>
<div class="marquee" aria-hidden="true">...</div>
<section id="probleme" class="sec svc-cards ...">...</section>
<section id="services" class="svc ...">...</section>
```

---

## 🎨 Card Visual Upgrades (Minimalist & Animated SVGs)

All icons will be written as inline SVGs inside the `.viz-glass-node` containers. They will use `stroke: #ffffff`, a stroke width of `1.75px`, `fill: none`, and are optimized for a `24x24` grid viewport.

### 1. Card: "Sites web performants" (Browser/Cursor Icon)
- **Concept**: A web browser window with a floating click cursor.
- **HTML**:
  ```html
  <svg class="ico-svg ico-browser" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="15" rx="2" />
    <line x1="2" y1="8" x2="22" y2="8" />
    <circle cx="5" cy="5.5" r="0.5" fill="currentColor" />
    <circle cx="8" cy="5.5" r="0.5" fill="currentColor" />
    <circle cx="11" cy="5.5" r="0.5" fill="currentColor" />
    <!-- Pointer cursor -->
    <path class="ico-browser__cursor" d="M12 14l3 7 2-1-3-7h5L12 8z" />
  </svg>
  ```
- **CSS Animation**:
  On hover, the cursor `.ico-browser__cursor` scales and translates inwards to simulate a click, combined with a brief scaling animation.

### 2. Card: "Présence Google Business" (Map Pin / Store Icon)
- **Concept**: A storefront locator pin.
- **HTML**:
  ```html
  <svg class="ico-svg ico-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <!-- Storefront shape -->
    <path class="ico-pin__store" d="M3 9l9-5 9 5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9z" />
    <path class="ico-pin__awning" d="M3 9h18" />
    <!-- Awning stripes/slopes -->
    <path d="M5 9V11" />
    <path d="M9 9V11" />
    <path d="M13 9V11" />
    <path d="M17 9V11" />
    <!-- Locator pin in center -->
    <path class="ico-pin__marker" d="M12 8c-2.2 0-4 1.8-4 4 0 2.5 4 7 4 7s4-4.5 4-7c0-2.2-1.8-4-4-4z" />
    <circle class="ico-pin__marker-hole" cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
  ```
- **CSS Animation**:
  On hover, the pin `.ico-pin__marker` bounces vertically (`translateY(-2px)`) to mimic geolocation search.

### 3. Card: "Intégration WhatsApp" (Chat / Typing Dots Icon)
- **Concept**: A rounded speech bubble with three dots.
- **HTML**:
  ```html
  <svg class="ico-svg ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <circle class="ico-chat__dot ico-chat__dot--1" cx="8" cy="12" r="1" fill="currentColor" />
    <circle class="ico-chat__dot ico-chat__dot--2" cx="12" cy="12" r="1" fill="currentColor" />
    <circle class="ico-chat__dot ico-chat__dot--3" cx="16" cy="12" r="1" fill="currentColor" />
  </svg>
  ```
- **CSS Animation**:
  On hover, `.ico-chat__dot--1`, `.ico-chat__dot--2`, and `.ico-chat__dot--3` will animate their opacity sequentially in a typing loop.

### 4. Card: "Automatisations & IA" (Sparkles Icon)
- **Concept**: A modern 3-star spark node configuration.
- **HTML**:
  ```html
  <svg class="ico-svg ico-spark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
    <!-- Sparkle 1 (Large) -->
    <path class="ico-spark__main" d="M12 2c0 5.5 4.5 10 10 10-5.5 0-10 4.5-10 10 0-5.5-4.5-10-10-10 5.5 0 10-4.5 10-10z" />
    <!-- Sparkle 2 (Small top-right) -->
    <path class="ico-spark__sub-1" d="M19 5c0 1.6 1.4 3 3 3-1.6 0-3 1.4-3 3 0-1.6-1.4-3-3-3 1.6 0 3-1.4 3-3z" />
    <!-- Sparkle 3 (Small bottom-left) -->
    <path class="ico-spark__sub-2" d="M5 19c0 1.6 1.4 3 3 3-1.6 0-3 1.4-3 3 0-1.6-1.4-3-3-3 1.6 0 3-1.4 3-3z" />
  </svg>
  ```
- **CSS Animation**:
  On hover, `.ico-spark__main` rotates slowly (`transform: rotate(45deg)`) and scales, while the sub-sparkles blink/pulse.

---

## 🧪 Verification Plan

### Manual Verification
1. Open the dev server on `http://localhost:3000`.
2. Inspect the placement of the marquee to verify it sits cleanly between the Hero section and the Services cards section.
3. Hover over each card to verify that the micro-animations (click cursor, map pin bounce, typing chat dots, rotating sparkles) trigger smoothly and cleanly.
4. Verify responsivity on mobile layout widths (900px, 768px, and 480px).
