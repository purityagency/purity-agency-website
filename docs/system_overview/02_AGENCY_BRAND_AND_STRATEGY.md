# 02 — MARQUE, IDENTITÉ VISUELLE & POSITIONNEMENT STRATÉGIQUE

> **Purity Agency** — Document d'Identité de Marque, Design System & Conversion (v1.0)
> *Guide fondamental de l'image de marque, du langage visuel et du positionnement marché.*

---

## 1. VISION & POSITIONNEMENT MARCHÉ (B2B WALLONIE & BELGIQUE)

**Purity Agency** (`purity-agency.be`) s'impose comme l'agence digitale de référence de nouvelle génération (2026-2027) dédiée aux PME, artisans, commerçants, professions libérales et indépendants en Wallonie (Charleroi, Namur, Mons, Liège, Brabant Wallon).

### A. Proposition de Valeur Centrale
> *"La puissance et l'esthétique d'une grande agence internationale (Awwwards level) au tarif accessible d'un studio indépendant, avec l'automatisation IA intégrée."*

### B. Différenciateurs Clés
1. **Transparence Absolue** : Aucun tarif caché. Prix affichés en clair avec franchise de TVA (Art. 56bis CTVA).
2. **Packs Métier Clé en Main** : Offres packagées par secteur (Restauration, Artisanat, Santé/Beauté, Immobilier, Services Pro).
3. **Purity OS & Ingestion IA** : Un portail client connecté permettant de suivre l'avancement en temps réel, de configurer ses briques optionnelles et de bénéficier d'agents IA 24/7.
4. **Vitesse & Performance Extrême** : Zéro framework lourd côté vitrine. Chargement sous 0.5s et score Google PageSpeed 95+.

---

## 2. CHARTE GRAPHIQUE & DESIGN SYSTEM "LIQUID GLASS 2026"

Le langage visuel de Purity Agency adopte une esthétique **Liquid Glass (Glassmorphism Next-Gen)** alliant élégance nocturne, lignes de précision vectorielles et touches lumineuses mauves/violettes.

### A. Palette de Couleurs Officielles
```css
:root {
  /* Fond principal & Surfaces */
  --c-bg-main:      #060309; /* Deep Near-Black avec nuance violette sombre */
  --c-bg-card:      rgba(15, 10, 25, 0.65); /* Glassmorphism translucide */
  --c-bg-surface:   #0d0814;
  
  /* Lignes de Contour & Frontières */
  --c-border-fine:  rgba(255, 255, 255, 0.12); /* Fin blanc vectoriel */
  --c-border-glow:  rgba(124, 58, 237, 0.4);   /* Contour lumineux au survol */

  /* Accents & Typographie */
  --c-accent:       #7C3AED; /* Mauve / Violet électrique Purity Identity */
  --c-accent-hover: #8B5CF6; /* Violet lumineux au clic */
  --c-text-primary: #FFFFFF; /* Blanc haute lisibilité (Contrast WCAG AAA) */
  --c-text-muted:   #9CA3AF; /* Gris neutre pour descriptions et sous-titres */
}
```

### B. Composants UI & Effets
- **Cartes Glassmorphic (`.svc-card`, `.brique-card`)** : Composants avec fond translucide, flou d'arrière-plan (`backdrop-filter: blur(16px)`), bordure fine blanche de 1px et ombres portées douces.
- **MasCOTTE & Identité "OctoMask"** : Intégration subtile de motifs tentaculaires et d'un masque poulpe futuriste dégradé violet.
- **Micro-Interactions & Animations** : Rehausse visuelle via GSAP (`ScrollTrigger`, `stagger`), effets d'aimant au survol, lueurs au passage de la souris.

---

## 3. RÈGLES DE BRAND VOICE & COPYWRITING (ANTI-SLOP)

### A. Lignes Directrices
- **Zéro Verbiage / Mode Caveman Actif** : Phrases courtes, denses, orientées résultat. Pas de métaphores vagues ("propulser votre business vers les étoiles").
- **Vocabulaire Axé ROI & Bénéfice Métier** : Ne jamais vendre de la technique brute (ex: *"API Integration"*), mais le résultat ("*Réservation 24/7 sans No-Show*").
- **Appellation Officielle** : Utiliser exclusivement **"Purity Agency"** (ou "Purity"). La marque "Purity ONE" a été définitivement supprimée de tous les supports client.

### B. Mentions Administratives & Légales
Toutes les pages de vente et devis incluent obligatoirement les mentions conformes à la législation belge :
- `Purity Agency — BCE 1036.775.590 — Charleroi, Wallonie, Belgique`
- `« Régime particulier de franchise des petites entreprises — TVA non applicable »` (Art. 56bis CTVA).
