# Spécification Technique — Showcase des Services Immersif au Scroll

Ce document présente l'architecture et les choix d'implémentation pour transformer la section des Services en une expérience immersive pilotée par le défilement (Scroll-Driven Showcase) avec GSAP ScrollTrigger.

## Objectifs d'Interaction & UX

1. **Contrôle utilisateur** : Le défilement de l'utilisateur dicte la progression des services.
2. **Effet de Pinning (Verrouillage)** : La section `#services` se verrouille en haut de l'écran pendant que l'utilisateur fait défiler la molette, puis se déverrouille une fois le dernier service passé.
3. **Barre de progression synchronisée** : Chaque pilier affiche un trait de progression vertical à sa gauche qui se remplit au pixel près selon la position du scroll de l'utilisateur.
4. **Cinématiques d'Image** : À chaque changement d'étape, l'image du service subit un léger zoom cinématographique inversé (de `1.12` à `1.0`) et un fondu croisé pour donner une impression de mouvement tridimensionnel.
5. **Fluidité des textes** : Les descriptions effectuent un glissement subtil vers le haut en fondu enchaîné pour guider le regard de l'utilisateur.

---

## Architecture de la Grille & Styles CSS

### 1. Structure de gauche (Piliers & Descriptions)
Nous conservons la disposition en 3 parties, mais l'optimisons pour l'alignement vertical :
- Les cartes `.svc-card` sont empilées verticalement sans bordure extérieure complète, mais avec un bord gauche de chronologie (`border-left`).
- Un conteneur `.svc-card__progress-fill` se remplit verticalement (`height: 0%` vers `100%`) pour matérialiser la progression.

### 2. Structure de droite (Showcase Sticky)
- La colonne de droite `.svc-showcase-col` et son conteneur `.svc-showcase` sont configurés pour occuper tout l'écran en hauteur (`height: 100vh`) pour un rendu théâtral pendant le pinning.

---

## Logique JavaScript & GSAP (ScrollTrigger)

1. **Initialisation de ScrollTrigger** :
   - Un conteneur ScrollTrigger est créé sur la section `#services`.
   - `pin: true` verrouille le layout.
   - `scrub: 1` assure que les transitions suivent la molette avec une inertie premium très douce.
   - `end: "+=3500"` définit une hauteur de défilement virtuelle de 3500px pour laisser le temps de lire confortablement.

2. **Calcul de l'index de progression** :
   - Le défilement est divisé en 5 zones égales (de 0 à 4).
   - `currentIndex = Math.min(4, Math.floor(progress * 5))`.
   - À chaque transition de zone : appel de la fonction `goToScene(nextIndex)`.

3. **Synchronisation du clic** :
   - Cliquer sur un pilier `i` fait défiler la page de manière fluide jusqu'à la position de scroll correspondant à sa zone :
     `scrollTarget = scrollTrigger.start + (i / 5) * (scrollTrigger.end - scrollTrigger.start) + 50`.

4. **Animations GSAP** :
   - **Textes** : `gsap.fromTo(pane, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })`.
   - **Média (Mouvement de caméra)** : `gsap.fromTo(media, { scale: 1.12, filter: "brightness(0.75)" }, { scale: 1.0, filter: "brightness(1)", duration: 1.2, ease: "power2.out" })`.

---

## Plan de Validation

1. **Scroll standard** : Vérifier que la section se bloque proprement en haut de l'écran, que les 5 services défilent un par un à la molette, et que la page continue ensuite normalement.
2. **Barre de progression** : Valider que le remplissage des barres de gauche suit fidèlement la vitesse du scroll de l'utilisateur.
3. **Clics de navigation** : Cliquer sur le pilier 4 doit scroller la page directement à l'étape 4 avec une transition fluide.
4. **Validation Responsive** :
   - Largeur > 860px : Pinning et grille complète active.
   - Largeur < 860px : Pinning désactivé, comportement normal de défilement pour garantir une accessibilité parfaite.
