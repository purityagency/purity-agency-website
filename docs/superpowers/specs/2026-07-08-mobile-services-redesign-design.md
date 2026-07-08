# Spécification Design : Redesign de la Section Services sur Mobile — Purity Agency

Ce document détaille les spécifications et choix ergonomiques validés pour le redesign de la section **Services** sur mobile pour le site de Purity Agency, en combinant un carrousel 3D tactile, une ligne de néon liquide (tentacule) et une Bottom Sheet iOS.

## 1. Objectifs
- Créer une expérience utilisateur interactive, fluide et mémorable sur mobile, rompant avec les grilles Bento génériques.
- Aligner parfaitement les services présentés (5 services au total) avec les 5 briques de la section Tarifs (Présence, Acquisition, Automatisation, Sur-mesure, Accompagnement).
- Rendre la consultation des détails de chaque service aérée et structurée sans encombrer la page principale.

## 2. Les 5 Services Raccords
Pour correspondre aux 5 briques tarifaires, les services sont réorganisés comme suit :
1. **Sites Web Performants** (Présence)
2. **Visibilité locale & SEO** (Acquisition)
3. **Automatisations & WhatsApp** (Automatisation)
4. **Applications & Outils Métier** (Sur-mesure)
5. **Accompagnement & Suivi** (Accompagnement)

---

## 3. Spécifications de l'Interface Mobile

### A. Carrousel 3D Horizontal (Deck Tactile)
- **Positionnement** : Centré horizontalement dans la section.
- **Rendu Visuel** :
  - Les 5 cartes de services sont superposées avec un effet tridimensionnel (`transform: perspective(600px) rotateY(...) translateZ(...)`).
  - La carte active est au premier plan, agrandie, avec des bordures violettes brillantes (`box-shadow: 0 0 25px rgba(124, 58, 237, 0.3)`).
  - Les cartes adjacentes sont inclinées vers l'arrière, réduites en opacité et taille pour donner un effet de roue rotative.
- **Interaction** : Défilement par glissement latéral (swipe) avec transitions d'échelle et de rotation gérées en CSS / JS (GSAP).

### B. Le Tentacule Lumineux (Liquid Glow Pipeline)
- **Rendu Visuel** :
  - Une fine ligne horizontale violette ondule légèrement juste sous le carrousel.
  - Elle possède un effet de néon liquide (`border-bottom: 2px solid #7C3AED; filter: drop-shadow(0 0 8px #7C3AED)`).
  - 5 petits points lumineux (les "ventouses" du tentacule) sont disposés le long de la ligne, serving de dots indicateurs de position.
- **Interaction** :
  - Quand l'utilisateur fait tourner le carrousel, un éclat lumineux parcourt la ligne.
  - Le dot correspondant au service actif s'illumine intensément et s'agrandit légèrement.

### C. La iOS Bottom Sheet (Le tiroir de détails)
- **Déclencheur** : Un clic/tap sur la carte de service qui est au premier plan dans le carrousel 3D ouvre le volet.
- **Rendu Visuel** :
  - Un panneau s'élève depuis le bas de l'écran pour occuper 75% de la hauteur de la fenêtre.
  - Style de verre liquide : fond sombre (`rgba(6, 3, 9, 0.85)`), flou d'arrière-plan prononcé (`backdrop-filter: blur(20px)`), et fin filet blanc en bordure haute.
  - Poignée horizontale grise centrée en haut de la Bottom Sheet.
  - Bouton de fermeture "croix" en haut à droite.
- **Contenu Rich** :
  - Image du service en 16:9 sous la poignée.
  - Titre principal et paragraphe de description aéré.
  - Liste de tags/badges des fonctionnalités associées.
  - Boutons d'appel à l'action unifiés : "Réserver un appel" (bouton principal mauve) et "En savoir plus" (lien de détail).
- **Interaction de Fermeture** :
  - Fermable en glissant le volet vers le bas (swipe down), en cliquant sur la croix ou en cliquant en dehors du volet sur le masque d'assombrissement.
