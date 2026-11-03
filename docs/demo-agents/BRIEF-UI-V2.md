# BRIEF UI/UX V2 : niveau visuel « studio primé »

Amir veut avant tout du **visuel** : une UI/UX de niveau pro, des images partout, une finition irréprochable.
La copy n'est plus la priorité (retouche légère seulement si un texte casse la mise en page).
Le MASTER-BRIEF.md reste valable pour les règles de marque (pas de violet/glow/glass, zéro `—`/`–`,
pas de scroll-hijack, AA, reduced-motion, CSP). Ce brief le complète et prime sur la partie « une seule image ».

## 1. Périmètre (anti-collision)
- Tu modifies : `demos/<secteur>/*.html`, `css/world-<secteur>.css` (crée et lie-le si absent, juste après
  `demo-motion.css`), et optionnellement `js/world-<secteur>.js` (nouveau fichier, chargé en `defer` après
  `demo-worlds.js`). Rien d'autre. Pas de git, pas de build, pas de déploiement.
- Conserve tous les attributs `data-*`, `id`, `name` et classes dont dépendent `js/demo-worlds.js` et
  `js/demo-gsap.js` (filtres de catalogue, réservation, studio, reset, depth). Lis ces deux JS avant de toucher au DOM.

## 2. Images (le levier n°1)
Le manifeste `docs/demo-agents/IMAGES.md` liste pour ton secteur 7 images avec leur chemin exact :
`hero` 16:9 · `ambiance` 3:4 · `detail` 1:1 · `offre-1..4` 4:3. Une partie existe, le reste est en cours de
génération par Amir/Claude et apparaîtra sous ces chemins exacts. **Utilise les 7, aux chemins exacts du manifeste.**
- Chaque offre du catalogue a son image (`offre-1` → 1re offre, etc.). Plus jamais la même photo répétée.
- `<img>` avec `width`/`height` cohérents au ratio (1600×900, 1200×1600, 1200×1200, 1200×900), `alt` descriptif,
  `loading="lazy" decoding="async"` sauf le hero (`fetchpriority="high"`). Cadre avec `aspect-ratio` + `object-fit:cover`.
- Traitement photo cohérent par monde (légère gradation via `filter`, recadrages `object-position`), jamais d'overlay coloré criard.
- Les fichiers manquants au moment où tu travailles : c'est normal, ne les remplace pas par autre chose.

## 3. Direction UI/UX attendue
- **Hero** : une image forte qui occupe l'écran (plein cadre ou split asymétrique), titre et CTA lisibles,
  le tout dans le premier viewport desktop ET mobile (375 px).
- **Rythme** : au moins 4 familles de layout différentes par page (plein cadre, split, grille d'offres illustrées,
  bande éditoriale, galerie en scroll-snap horizontal natif, bloc chiffré, FAQ en accordéon…). Jamais 3 sections
  image+texte alternées de suite.
- **Cartes d'offre** : image + titre + 1 ligne + action ; survol subtil (zoom image 1.03-1.05, filet, flèche qui glisse),
  états focus visibles, zones cliquables généreuses.
- **Composants pro** : nav mobile soignée (menu plein écran ou tiroir propre, fermeture Échap), formulaires
  (labels au-dessus, aides, états erreur/succès lisibles, gros champs tactiles), boutons avec états hover/active/focus,
  FAQ en `<details>` stylé.
- **Micro-interactions motivées** : reveal à l'entrée (CSS `animation-timeline:view()` ou IntersectionObserver dans
  `world-<secteur>.js`), parallax léger sur le hero au plus, transitions 200-600 ms easing doux. Pas de
  `scroll` listener, pas de curseur custom, tout coupé en `prefers-reduced-motion`.
- **Finition** : grille et alignements au pixel, échelle typo fluide, espacements constants, coins cohérents
  (un seul système de rayons), ombres teintées et rares, contrastes AA, aucun débordement horizontal à 375 px.
- Garde l'identité du monde (tokens, polices, classe `layout-*`) : on monte en gamme, on ne change pas de marque.

## 4. Skills (invoque-les via l'outil Skill, une fois, puis applique ; pas plus de 4 pour éviter de caler)
Core : `soft-skill`, `frontend-design`, `make-interfaces-feel-better` + l'extra indiqué dans ton prompt.

## 5. Méthode (important, des agents ont calé sur de longues générations)
- Travaille par **petites éditions successives** (Edit ciblés, une section à la fois). Jamais un Write géant d'une page entière.
- Un serveur local tourne sur http://localhost:3000 : si tu as des outils navigateur, contrôle `/demos/<secteur>/`
  en desktop et à 375 px. Sinon vérifie par lecture du code.

## 6. Rapport final (court)
Par page : les changements visuels majeurs ; les fichiers créés ; les skills invoqués ; les images du manifeste
référencées (et où) ; tout problème.
