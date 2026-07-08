# Walkthrough : Redesign de la Section Services sur Mobile — Purity Agency

Nous avons achevé avec succès l'implémentation de la section **Services** sur mobile. L'ensemble des 5 services a été intégré et aligné avec la grille des tarifs, sous un format 3D fluide et haut de gamme.

## Modifications apportées

### 1. Structure HTML & i18n (`index.html` & `i18n/*.json`)
- **5ème Service** : Ajout du service *Accompagnement & Suivi* sous forme de carte et de scène de détail.
- **Dots** : Extension à 5 indicateurs de position dans la roue.
- **Ligne Néon** : Insertion du markup de la ligne tentaculaire fluide (`.svc-glow-line`).
- **iOS Bottom Sheet** : Insertion du code HTML du tiroir de détails (`.svc-drawer`) masqué par défaut.

### 2. Design & Layout CSS (`css/site.css`)
- **Masquage de l'Accordéon** : `.svc-nav-col` est masqué sur mobile pour laisser place exclusivement au carrousel 3D.
- **Perspective 3D** : Configuration du conteneur `.svc-showcase__screen` en mode flex 3D (`perspective: 1000px`).
- **Cartes Volantes (Glassmorphic)** : Mise en forme de `.svc-scene` sous forme de petites cartes de verre translucides ajustées et inclinées en 3D.
- **Ligne de Néon Liquide** : Styles pour `.svc-glow-line` et son fill linéaire dégradé violet qui glisse horizontalement.
- **Style iOS Bottom Sheet** : Conception premium du volet coulissant (fond sombre translucide, flou prononcé, poignée, bouton fermeture, tags colorés et actions).

### 3. Logique Applicative JS (`js/site.js`)
- **Transitions 3D Dynamiques** : Calcul en temps réel des angles `rotateY` et déplacements `translate3d` pour positionner les cartes adjacentes sur un arc virtuel.
- **Indicateur de Glissement (Tentacule)** : Animation dynamique de la position de la ligne de néon liquide (`#svc-glow-fill`) en phase avec le carrousel.
- **Gestionnaire du Tiroir (Bottom Sheet)** :
  - Remplissage dynamique des informations du service actif par clonage des éléments dans le panneau.
  - Déclenchement de l'ouverture lors d'un clic sur la carte au premier plan.
  - Gestion du geste tactile de glissement vers le bas (swipe down) pour fermer le volet de manière native.
