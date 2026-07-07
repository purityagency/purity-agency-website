# Spécification Design : Refonte Mobile & Responsive Globale — Purity Agency

Ce document détaille les spécifications et choix ergonomiques validés pour l'optimisation mobile de l'ensemble du site de Purity Agency. L'objectif est d'offrir une expérience utilisateur fluide, premium et de type "App native" sur les petits écrans.

## 1. Barre de Navigation Basse Flottante (iOS-style TabBar)

### Objectifs
- Supprimer le menu hamburger classique qui surcharge le haut de l'écran.
- Faciliter l'accès au contenu principal d'une seule main (Loi de Fitts).

### Spécifications
- **Positionnement** : Fixe en bas de l'écran (`position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); width: calc(100% - 32px); max-width: 450px; z-index: 999;`).
- **Design Visuel** :
  - Fond en verre liquide flouté (`backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); background: rgba(6, 3, 9, 0.65);`).
  - Fine bordure blanche discrète (`border: 1px solid rgba(255, 255, 255, 0.12);`).
  - Ombres portées douces pour un effet de flottement.
  - Hauteur d'environ 64px.
- **Structure (4 Onglets Tactiles de 48px minimum)** :
  1. **Accueil** (Icône Home SVG) -> Cible `#hero`.
  2. **Services** (Icône Bento Grid SVG) -> Cible `#services`.
  3. **Tarifs** (Icône Euro SVG) -> Cible `#tarifs`.
  4. **Contact** (Icône Message SVG) -> Cible `#contact`.
- **Indicateur d'État Actif (Scrollspy)** :
  - Un point mauve brillant (`#7C3AED`) s'affiche ou glisse sous l'icône correspondant à la section actuellement visible à l'écran.
- **En-tête supérieur (Top Header)** :
  - Nettoyé de toute navigation classique ou bouton burger.
  - Contient uniquement le logo **PURITY** à gauche, et le sélecteur de langue (FR | EN | NL) à droite.

---

## 2. Hub Flottant Chatbot Unique (OctoMask + Prise de RDV)

### Objectifs
- Éviter la présence de plusieurs widgets flottants (chatbot + Calendly/Meet) qui se superposent et gênent la lecture.
- Créer un point d'entrée unique et attrayant pour le contact et la conversion.

### Spécifications
- **Positionnement** : Placé en bas à droite, juste au-dessus de la TabBar (`position: fixed; bottom: 96px; right: 16px; z-index: 998;`).
- **Visuel de la Bulle** :
  - Icône de la mascotte **OctoMask** avec son dégradé violet.
  - Badge rouge dynamique style Apple (`#FF3B30`) placé en haut à droite de la bulle pour attirer l'attention (notification).
  - Petit teaser textuel flottant au chargement initial : *"Bonjour ! Une question ou envie de réserver un appel ? 🐙"* (s'estompe après 5 secondes).
- **Le Panel de Chat unifié au clic** :
  - S'ouvre avec un effet d'apparition fluide.
  - Propose deux boutons d'action larges en haut du panel :
    1. 💬 **"Discuter avec notre IA"** (démarre la conversation instantanée intelligente).
    2. 📅 **"Planifier un appel (15 min)"** (ouvre l'intégration Google Meet / Calendly directement dans un conteneur iframe fluide ou modal).

---

## 3. Layouts de contenu & Carrousels Tactiles (Swipe Mobile)

### Objectifs
- Éviter le défilement vertical sans fin ("scroll fatigue") sur les pages contenant beaucoup d'éléments répétitifs (services, tarifs, bento).
- Améliorer l'interactivité grâce au support des gestes tactiles naturels.

### Spécifications
- **Section Services** :
  - Les 5 onglets de services restent horizontaux tout en haut avec un défilement tactile doux (`overflow-x: auto; scroll-snap-type: x mandatory;`).
  - L'image de droite du bureau passe sous les onglets sur mobile.
  - Les dots indicateurs de position restent situés juste au-dessus de l'image (comme sur desktop, mais adaptés sur mobile).
  - L'image supporte le balayage (swipe) gauche/droite pour changer de service actif (avec synchronisation de la classe active sur les onglets du haut et la barre de progression).
- **Section Tarifs** :
  - Transformation des 5 grilles de prix en un carrousel horizontal tactile.
  - Chaque carte de tarif prend environ 85% de la largeur de l'écran pour laisser entrevoir la carte suivante et encourager le défilement.
  - `scroll-snap-align: center;` pour aligner parfaitement la carte consultée au centre de l'écran.
  - Pagination sous forme de 5 petits dots sous la grille pour indiquer visuellement le pack actif.
- **Bento & Typographie** :
  - Les structures de bento (Stats, articles de Blog) s'empilent sur une seule colonne.
  - Marges intérieures réduites (`padding: 1.5rem`) et réduction proportionnelle des tailles de police (`h2`, `h3`) pour garder un rendu ultra compact et haut de gamme.
