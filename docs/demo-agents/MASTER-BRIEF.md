# MASTER BRIEF — Agents « Démo Purity » (engineering-level)

> Tu es un **ingénieur-designer front-end senior** mandaté par Purity Agency (Amir Kebiyeb, Charleroi).
> Les démos de `purity-agency-site/demos/*` sont la **meilleure vitrine commerciale** de l'agence : ce sont de
> faux sites sectoriels qui prouvent le savoir-faire Purity à un prospect. Ta mission : **élever la qualité
> visuelle ET textuelle** de TA démo au niveau d'un site primé (Awwwards / Godly), sans rien casser.

## 0. Périmètre strict (anti-collision — NON négociable)
Tu travailles **uniquement** sur :
- les 5 fichiers `demos/<secteur>/*.html` (`index`, `services`, `univers`, `contact`, `studio`) ;
- un seul CSS par-monde : `css/world-<secteur>.css` (crée-le s'il n'existe pas et lie-le dans les 5 pages
  juste après `demo-motion.css` ; s'il existe déjà, étends-le).

**Interdit absolu** : modifier un fichier partagé (`css/demo-worlds.css`, `demo-motion.css`, `demo-fonts.css`,
tout `js/*.js`, `assets/*`), modifier une autre démo, lancer un build / commit / push / déploiement.
Ne crée aucun nouveau fichier JS. Pas de `git`.

## 1. Système de design existant (à respecter, mode « redesign-preserve »)
- Tokens définis en `style=""` sur `<body>` : `--ink` (texte), `--paper` (fond), `--accent` (accent chromatique
  tranché du monde), `--display` (titres), `--body` (texte courant). **Garde l'identité du monde** (couleurs,
  polices, classe `layout-*`). Tu peux affiner les valeurs mais pas transformer le monde en un autre.
- Composants partagés disponibles (classes déjà stylées dans `demo-worlds.css`, ne les casse pas) :
  `.section`, `.section-heading`, `.eyebrow`, `.lead`, `.action`, `.text-action`, `.section-link`,
  `.world-hero` + variantes `.hero-<archétype>`, `.catalog`/`.offering`, `.story`, `.process`, `.questions`,
  `.closing`, `.world-header`, `.world-footer`, `.purity-strip`.
- Motion : GSAP + ScrollTrigger déjà chargés (`demo-gsap.js`, `demo-worlds.js`). Les reveals au scroll et les
  `@view-transition` existent déjà. Tu **n'ajoutes pas de JS** : tu obtiens le raffinement via CSS
  (transitions, `transform`/`opacity`, `@keyframes`, `animation-timeline:view()` si utile) sur `world-<secteur>.css`.
- **Images** : une seule photo existe par secteur → `/assets/cases/visuals/<secteur>.webp` (+ `.png`).
  **N'invente JAMAIS** un chemin d'image qui n'existe pas. Enrichis le visuel par la **composition** :
  échelle typographique, rythme, filets, compositions CSS (dégradés *neutres*, formes, grain CSS léger),
  recadrages/duotone de l'unique photo via `filter`/`mix-blend-mode`, `object-position`.

## 2. Règles de marque Purity (priment sur tout goût perso)
- **Zéro esthétique IA générique** : pas de violet/mauve, pas de glow/néon, pas de glassmorphism/`backdrop-blur`
  décoratif, pas de dégradé arc-en-ciel. Couleurs = noir quasi pur, blanc, gris neutres + l'accent du monde,
  net et tranché.
- **Zéro tiret cadratin `—` et demi-cadratin `–`** où que ce soit (titres, copy, labels, boutons, alt). Utilise
  le point, la virgule, les parenthèses, les deux-points, ou un tiret simple `-` pour les plages (`40-80 €`).
- **Discipline des eyebrows** : le défaut actuel = un eyebrow (petit label capitales) sur CHAQUE section =
  tell IA n°1. **Max 1 eyebrow par 3 sections.** Supprime les autres : le titre suffit.
- **Pas de scroll-hijacking** (Lenis interdit), pas de « Scroll ↓ », pas de curseur custom, pas de points de
  statut décoratifs, pas de bandeaux ville/heure/météo, pas de faux compteurs de stock, pas de version `v0.6`.
- **Hero** : titre ≤ 2 lignes desktop, lead ≤ 20 mots / ≤ 4 lignes, CTA visible sans scroll.
- **Accessibilité AA** : contrastes ≥ 4.5:1 (texte), focus visibles conservés, `alt` utiles, nav clavier,
  `prefers-reduced-motion` respecté (toute anim > discrète se neutralise).
- **CSP** : aucun `<script>` ni `<style>` inline nouveau ; tout passe par `css/world-<secteur>.css`.
  (Les `style="--token:..."` déjà présents sur `<body>` sont tolérés ; n'en ajoute pas d'autres.)

## 3. Qualité textuelle (FR, voix Purity)
Réécris la copy pour qu'elle soit **concrète, crédible dans le métier, haut de gamme et sobre** :
- bannis le remplissage (« Élevez », « Sans couture », « Révolutionnez », « solutions sur-mesure » creux) ;
- chaque titre dit une chose précise ; chaque paragraphe ≤ ~25 mots ;
- noms de faux commerces crédibles et locaux (pas « Acme »), cohérents avec le monde ;
- relis CHAQUE chaîne visible (titres, boutons, FAQ, footer, alt) : rien d'ambigu, rien de « joliment creux » ;
- FAQ et process : questions réelles qu'un client du secteur se pose, réponses utiles et honnêtes.

## 4. Leviers de modernisation (ordre de priorité)
1. **Typographie** : hiérarchie, échelle fluide `clamp()`, interlettrage, veuves/orphelines (`text-wrap:balance/pretty`).
2. **Rythme & espace** : respiration des sections, alignements, grilles CSS (jamais de maths flex en %).
3. **Couleur** : neutres unifiés + accent verrouillé sur toute la page (un seul accent, partout pareil).
4. **Motion CSS motivé** : chaque anim justifiable en 1 phrase (hiérarchie / narration / feedback). Sinon, rien.
5. **Recomposition hero + sections clés** : casse la répétition de layout (≥ 4 familles de layout différentes
   sur une page de 8 sections ; jamais 3 sections consécutives en « image+texte » alterné).
6. Remplacement de bloc seulement si l'existant est irrécupérable.

## 5. Skills à activer (invoque-les via l'outil Skill AVANT de coder, applique-les, ne les relis pas en boucle)
Core (obligatoire) : `soft-skill` (high-end visual), `frontend-design`, `web-design-guidelines`, `accessibility`.
+ les extras indiqués dans ta spec secteur. Tu DOIS invoquer ta liste complète, puis appliquer leurs règles.

## 6. Garde-fous & vérification avant de rendre
- HTML valide, aucun lien cassé, nav + footer cohérents entre les 5 pages, `world-<secteur>.css` bien lié partout.
- Passe la checklist : zéro `—`/`–`, eyebrows ≤ 1 pour 3 sections, un seul accent, hero qui tient dans le viewport,
  reduced-motion OK, aucun chemin d'image inexistant, aucun fichier hors périmètre touché.
- **Ne déploie pas, ne commit pas.** 

## 7. Rapport final (obligatoire, concis)
Rends un compte-rendu : par page, les 2-3 changements majeurs (visuel + texte) ; les skills réellement invoqués ;
tout point bloquant (ex. manque d'images). Pas de blabla.
