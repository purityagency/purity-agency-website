# Audit complet — Purity Agency (site vitrine statique)

Date : 2026-07-02 · Auditeur : revue front-end / SEO / a11y / perf
Périmètre : `index.html`, `presence.html`, `acquisition.html`, `automatisation.html`, `outils.html`, `blog.html`, `article-*.html` (×4), `legal.html`, `site.css`, `site.js`, `detail.js`, `server.js`.

Deux familles de pages coexistent :
- **Famille « moderne »** (index + 4 pages service) : classes `nav__`, `dp-`, `footer__`, JS `site.js`/`detail.js`, thème noir/violet. Correctement stylée.
- **Famille « ancienne »** (blog + 4 articles) : classes `nav-`, `post-`, `footer-`, éléments `#stars`/`#aurora`/`#grain`. **CSS absent** → pages non stylées.
- `legal.html` : autonome (CSS inline), cohérente, `noindex`.

Comptage : **Critical 6 · Important 11 · Minor 9**.

---

## CRITICAL

### [Critical] Blog + 4 articles reposent sur un CSS mort — pages cassées visuellement
Fichiers : `blog.html`, `article-ia-pme-belgique.html`, `article-prix-site-web-belgique.html`, `article-seo-local-wallonie.html`, `article-site-ne-convertit-pas.html`
Description : Vérifié — aucune des classes utilisées par ces pages n'existe dans `site.css` : `.article`, `.prose`, `.post`, `.posts`, `.post-cat`, `.post-meta`, `.post-go`, `.nav-logo`, `.nav-links`, `.nav-cta`, `.footer-inner`, `.footer-word`, `.footer-cols`, `.footer-legal`, `.footer-links`, `.footer-base`, `.page-title`, `.page-head`, `.page-lead`, `.eyebrow`, `.article-hero`, `.article-meta`, `.article-cta`, `.back-link`, `.lead`, `.magnetic`, `.btn-primary`. De même `#stars`, `#aurora`, `#grain`, `#site`, `#c-dot`, `#c-ring` n'ont aucune règle. Ces pages s'affichent en HTML brut non stylé (texte noir sur fond par défaut, layout cassé). CONFIRMÉ exact.
Correction : soit (a) réécrire blog/articles avec la charte « moderne » (`nav__`, `footer__`, `wrap`, `btn btn--accent`) et créer un bloc CSS `.article`/`.prose` dans `site.css` ; soit (b) porter l'ancien CSS blog dans `site.css`. Option (a) recommandée pour l'unité visuelle.

### [Critical] Canvas #stars sans dimensionnement et sans JS → soit invisible soit bloc noir
Fichiers : `blog.html:22`, `article-*.html:25`
Description : `<canvas id="stars">` présent mais (1) aucune règle CSS (taille par défaut 300×150), (2) aucun script d'initialisation dans `site.js` (grep « stars » = 0 hit JS). Idem `#aurora`, `#grain`. Résidus d'un ancien thème.
Correction : supprimer `#stars`/`#aurora`/`#grain` de ces pages (ou réimplémenter le décor via le thème moderne).

### [Critical] Liens de nav du blog/articles pointent vers des ancres inexistantes
Fichiers : `blog.html:30-31,92-93`, `article-*.html:33-34,123-124` (etc.)
Description : CONFIRMÉ. Les nav pointent vers `index.html#solutions` et `index.html#preuves`. Or `index.html` n'a **ni** `id="solutions"` **ni** `id="preuves"`. Les sections réelles sont `id="services"`, `id="methode"`, `id="preuve"` (singulier !), `id="tarifs"`, `id="faq"`, `id="contact"`. Clic = arrivée en haut de page sans scroll.
Correction : remplacer `#solutions`→`#services`, `#preuves`→`#preuve` (ou renommer la section index en `#preuves` et harmoniser). Aligner sur la nav des pages service (`#services`, `#methode`, `#tarifs`, `#contact`).

### [Critical] Blog/articles chargent `site.js` qui plante avant d'atteindre le chatbot
Fichiers : `blog.html:117`, `article-*.html:148`, `site.js:39,334`
Description : `site.js` fait `gsap.registerPlugin(ScrollTrigger)` (ligne 39) mais **GSAP n'est pas chargé** sur blog/articles (aucun `<script src=gsap>`). `gsap` est `undefined` → exception immédiate → tout le reste de `site.js` ne s'exécute jamais, **y compris le chatbot** (`chat-toggle` en bas du fichier). De plus `site.js:334` fait `form.addEventListener` sur `#contact-form` (absent hors index) → sur index c'est OK, mais sur blog/articles le script est déjà mort avant. Le chatbot est donc **non fonctionnel** sur blog + articles.
Correction : soit ajouter les `<script gsap>` sur ces pages, soit (mieux) les migrer vers le thème moderne + un JS adapté. Garder `if (typeof gsap === 'undefined') return;` en tête de `site.js` comme garde-fou.

### [Critical] `site.js` suppose des éléments présents partout → risque d'exception sur pages sans eux
Fichiers : `site.js:76` (`burger.addEventListener` sans garde), `site.js:334` (`form.addEventListener` sans garde `if(form)`)
Description : `const burger = document.querySelector('.nav__burger')` puis `burger.addEventListener(...)` ligne 76 sans test de nullité ; idem `form` ligne 333-334. Sur index ça passe, mais toute page « moderne » sans burger/form ferait planter le script. `detail.js` est plus robuste (teste `if (burger && mobMenu)`, `if (dForm)`). Fragilité structurelle.
Correction : encadrer par `if (burger && mobMenu)` et `if (form)` comme dans `detail.js`.

### [Critical] Formulaires de contact factices — aucune soumission réelle
Fichiers : `site.js:332-344` (`#contact-form`), `detail.js:94-108` (`#detail-form`)
Description : Les deux formulaires font `e.preventDefault()` puis un `setTimeout` cosmétique qui affiche « Message envoyé ! » et `form.reset()`. **Aucun `fetch`, aucun endpoint, aucun envoi.** Les leads sont perdus. `server.js` n'expose aucune route `/api/contact` (seulement `/api/chat`). Impact commercial direct.
Correction : ajouter une route `/api/contact` dans `server.js` (envoi e-mail / stockage) et un vrai `fetch` POST côté client, avec gestion d'erreur.

---

## IMPORTANT

### [Important] Thème « migré » incomplet : ancien violet #9333EA / rgba(147,51,234) partout dans site.css
Fichiers : `site.css` — ~40 occurrences (ex. l.108, 152, 285, 317, 927, 1028, 1959, 1964, 2285, 2487, 2588…)
Description : `:root` déclare bien `--c-accent: #7C3AED`, mais une quarantaine de valeurs codées en dur utilisent encore l'**ancien** accent `#9333EA` / `rgba(147,51,234,…)` (ombres, glows, badges, borders). Le `.detail` de base et `.detail--presence` ont même `--accent: #9333EA` (l.1959, 1964) alors que le thème cible est #7C3AED — seul `.detail--ia` (l.1966) utilise #7C3AED. Résultat : deux violets légèrement différents cohabitent.
Correction : remplacer les `#9333EA`→`#7C3AED` et `rgba(147,51,234,x)`→`rgba(124,58,237,x)`, ou mieux, remplacer par `var(--c-accent)` / une var `--c-accent-rgb`. NB : `.detail--acquisition` (#2563EB bleu) et `.detail--outils` (#0EA5A4 teal) sont des accents produits volontaires — ne pas les toucher, mais vérifier qu'ils sont cohérents avec le nouveau parti pris noir/violet.

### [Important] Aucun canonical / og:image / og:url / JSON-LD sur les 5 pages principales
Fichiers : `index.html`, `presence.html`, `acquisition.html`, `automatisation.html`, `outils.html`
Description : Grep confirmé — ces pages n'ont **ni** `<link rel="canonical">`, **ni** `og:image`, **ni** `og:url`, **ni** JSON-LD. Ironie : ce sont les 4 articles (pages cassées) qui ont canonical + OG + JSON-LD `Article`. La home n'a aucun balisage `Organization`/`LocalBusiness` alors que c'est une agence locale (Charleroi) — manque à gagner SEO local majeur.
Correction : ajouter sur chaque page principale : canonical absolu, `og:title/description/image/url/type`, `twitter:card`. Ajouter un JSON-LD `LocalBusiness`/`ProfessionalService` sur `index.html` (nom, adresse Charleroi, email, `areaServed` Wallonie, `priceRange`). Ajouter `og:image` (créer une image OG dédiée).

### [Important] Aucun sitemap.xml ni robots.txt
Fichiers : racine du projet (absents — vérifié)
Description : Pas de `sitemap.xml`, pas de `robots.txt`. `server.js` ne les sert donc pas. Indexation non guidée ; `legal.html` est `noindex` (bien) mais rien n'empêche l'indexation des pages articles cassées.
Correction : générer `robots.txt` (+ ligne `Sitemap:`) et `sitemap.xml` listant index + 4 pages service + blog + 4 articles (une fois réparés). Envisager `noindex` temporaire sur blog/articles tant qu'ils sont cassés.

### [Important] hreflang absent (à prévoir pour le multilingue)
Fichiers : toutes les pages
Description : `lang="fr"` partout, aucun `hreflang`. Noté pour le projet multilingue à venir (dossier `i18n/` déjà présent avec `GLOSSARY.md`, `PROGRESS.md`). Pas bloquant aujourd'hui (site monolingue) mais à intégrer dès la bascule.
Correction : au moment du multilingue, ajouter `<link rel="alternate" hreflang="fr-BE" …>` / `hreflang="nl-BE"` / `hreflang="x-default"` sur chaque page, et un canonical par langue.

### [Important] `theme-color` incohérent entre index et pages service
Fichiers : `index.html:8` (`#000000`), `presence/acquisition/automatisation/outils.html:8` (`#060309`)
Description : La home déclare `<meta name="theme-color" content="#000000">` alors que le fond réel est `--c-bg: #060309` et que les 4 pages service utilisent `#060309`. Incohérence mineure de barre d'UI mobile.
Correction : uniformiser sur `#060309`.

### [Important] Nav index : « Réalisations » pointe vers `#services` (pas de section réalisations)
Fichiers : `index.html:35,49`
Description : Le lien « Réalisations » (desktop + mobile) pointe vers `#services`, identique au lien « Services ». Il n'existe aucune section réalisations/portfolio. Deux entrées de menu → même ancre = confusion + attente déçue (le libellé promet des réalisations).
Correction : soit créer une vraie section « Réalisations », soit retirer l'entrée, soit la renommer.

### [Important] Deux systèmes de curseur custom + `cursor:none` sans garde reduced-motion
Fichiers : `site.css:1500-1503`, `site.js:351`, `detail.js:124`
Description : `@media (hover:hover){ html{cursor:none} }` masque le curseur natif pour **tous** les utilisateurs souris. Mais le JS n'active le curseur custom que si `!prefersReduced` (`site.js:351`, `detail.js:124`). Donc un utilisateur **souris + prefers-reduced-motion** se retrouve **sans aucun curseur visible** → blocage d'usage. Blog/articles utilisent en plus `#c-dot`/`#c-ring` (curseur d'un autre design, non stylé).
Correction : ne poser `cursor:none` que lorsque le curseur custom est réellement actif (ajouter une classe `body.has-custom-cursor` posée par le JS après init), ou lever la règle sous `prefers-reduced-motion`.

### [Important] `<html lang="fr">` mais contenu 100 % fr-BE, `og:locale` seulement sur blog/articles
Fichiers : pages principales
Description : `og:locale="fr_BE"` présent sur blog/articles uniquement. Les pages principales n'ont pas d'`og:locale`. Cohérence de localisation à uniformiser.
Correction : ajouter `og:locale=fr_BE` partout ; envisager `lang="fr-BE"`.

### [Important] Images hero servies en PNG lourd en fallback + `<img src=hero-bg.png>` 1,56 Mo
Fichiers : `index.html:65`, fichier `hero-bg.png`
Description : Tailles réelles mesurées :
- `hero-bg.png` : **1 560 989 o (1,56 Mo)** — c'est le `<img src>` de fallback du `<picture>`.
- `hero-bg.webp` : 118 940 o (116 Ko) — desktop.
- `hero-bg-mobile.webp` : 47 472 o (46 Ko) — mobile.
Le `<picture>` sert bien le webp aux navigateurs modernes (preload webp OK), donc le PNG 1,56 Mo n'est chargé que par les très vieux navigateurs — impact réel limité, mais le fichier reste dans le repo et peut être téléchargé. LCP piloté par le hero webp : correct.
Correction : garder le webp ; réduire/optimiser (ou supprimer) le PNG fallback, ou le régénérer à taille raisonnable (<300 Ko).

### [Important] Images services non optimisées : 4 PNG de 1,8 à 3,3 Mo
Fichiers : `service1..4.png`, référencés `index.html:154-190` (CSS `--img`), `presence.html:47`, etc.
Description : Tailles réelles :
- `service1.png` : **1 963 176 o (1,96 Mo)**
- `service2.png` : **3 293 104 o (3,29 Mo)**
- `service3.png` : **1 841 467 o (1,84 Mo)**
- `service4.png` : **2 285 511 o (2,29 Mo)**
- `logo.png` : **232 841 o (227 Ko)** pour un logo.
Total ~9,6 Mo de PNG. `presence.html` fait `preload service1.png` (2 Mo préchargés). Ces images pénalisent lourdement le LCP des pages service et le poids de la section services de l'index (4 backgrounds).
Correction : convertir en WebP/AVIF (gain typique 70-85 %), servir en responsive, lazy-load les scènes hors écran. Redimensionner le logo (un logo n'a pas besoin de 227 Ko).

---

## MINOR

### [Minor] `octomask floating.mp4` de 2,55 Mo en autoplay sur toutes les pages
Fichiers : toutes les pages (`<video src="octomask%20floating.mp4" autoplay loop>`)
Description : `octomask floating.mp4` = **2 674 046 o (2,55 Mo)**, chargé et joué en boucle dès l'ouverture sur chaque page (bouton chat). Consommation data + batterie mobile.
Correction : compresser la vidéo, `preload="none"` jusqu'à interaction, ou remplacer par un WebM/poster + lecture au survol.

### [Minor] 3 fichiers GSAP en CDN bloquants (perf + dépendance tierce + RGPD)
Fichiers : `index.html:724-726`, `presence/acquisition/automatisation/outils.html`
Description : gsap.min.js + ScrollTrigger + ScrollToPlugin depuis `cdnjs.cloudflare.com` (3 requêtes tierces). Sans `defer` sur les tags GSAP (seul `site.js` a `defer`), mais placés en fin de body donc non bloquants pour le rendu. Dépendance CDN externe = point de défaillance + requête tierce à mentionner RGPD (déjà évoqué dans `legal.html`).
Correction : self-héberger GSAP (un seul bundle), ajouter `defer`. Réduit les tiers.

### [Minor] Code mort dans site.js : count-up `.bento__val` ne cible rien
Fichiers : `site.js:227-256`
Description : Le bloc count-up itère sur `document.querySelectorAll('.bento__val')`. `.bento__val` n'existe **dans aucun HTML** (l'index utilise `.b2__count`, géré séparément l.279). La boucle est un no-op. `.bento__val` n'existe qu'en CSS (l.888) sans HTML correspondant. Code résiduel d'une ancienne version.
Correction : supprimer le bloc l.227-256 et les règles CSS orphelines `.bento__val`.

### [Minor] Sélecteurs JS ciblant des classes absentes (parallax `.why`, curseur `.bento__card`, `.price`, `[data-scroll-text]`, `[data-kt]`)
Fichiers : `site.js:102,259,365,374`
Description : `site.js` gère `[data-scroll-text]`, `[data-kt]`, `.why`, `.bento__card`, `.price`, `.faq__q` en hover-cursor. Plusieurs n'existent pas dans l'index actuel (`data-scroll-text`, `data-kt`, `.why`, `.bento__card`, `.price`). Ce sont des `toArray`/`querySelectorAll` → pas d'erreur (tableaux vides), mais code mort à nettoyer.
Correction : purger les blocs sans cible.

### [Minor] `<img alt="">` vide sur le hero (décoratif) — OK mais width/height du fallback ≠ webp
Fichiers : `index.html:65`
Description : `alt=""` sur l'image hero est justifié (décoratif, le texte est en HTML). `width="1672" height="941"` fixés (bien pour CLS). Rien de bloquant ; noté pour info.
Correction : aucune (conforme).

### [Minor] Contraste : `--c-fg-muted: rgba(255,255,255,.7)` et textes gris sur fond #060309
Fichiers : `site.css:10`, usages `.dp-muted`, `.svc-scene__lead`, footer legal
Description : Le blanc à 70 % sur #060309 passe largement AA. En revanche les gris plus faibles (footer `--fg-3: rgba(255,255,255,.38)` dans `legal.html:14`, `.dp-form__note`, notes de tarifs) approchent ou passent sous le seuil AA 4.5:1 pour du petit texte. Les scènes `--onlight` (texte sombre sur image claire, `site.css:838-855`) dépendent de la photo → contraste non garanti.
Correction : vérifier chaque gris < .5 d'opacité au contrast-checker ; monter à ≥ .6 pour le corps de texte. Ajouter un scrim/overlay sur les scènes onlight pour garantir le contraste texte.

### [Minor] Hiérarchie Hn : plusieurs `<h2>` décoratifs, pas de `<h1>` sur certaines vues
Fichiers : `index.html` (h1 unique OK), `presence.html` (h1 OK), articles (h1 OK)
Description : Sur l'index les scènes services utilisent `<h2 class="svc-scene__title">` (4×) plus les `<h2>` de sections — hiérarchie plausible. `aside.article-cta` (articles) utilise `<h2>` pour un CTA, ce qui gonfle le plan de titres. Globalement acceptable, un seul `h1` par page confirmé.
Correction : passer le titre du CTA `aside` en `<p>`/`<strong>` stylé plutôt qu'en `<h2>`.

### [Minor] `#contact-form` : labels flottants OK, mais champ `activity` sans `required` ni autocomplete cohérent
Fichiers : `index.html:671-675`, `presence.html:190-195`
Description : Labels associés via `for`/`id` (bien pour a11y). Le `<textarea>` a `required`. Champ « métier/activité » optionnel sans indication. Le bouton submit devient `display:none` après envoi factice sans `aria-live` sur le message de succès `.form__sent`.
Correction : ajouter `role="status"`/`aria-live="polite"` sur `.form__sent` et `.dp-form__sent` pour annoncer le succès aux lecteurs d'écran.

### [Minor] `server.js` : `Cache-Control: no-store` sur tous les assets → aucune mise en cache
Fichiers : `server.js:171,179`
Description : Tous les fichiers (y compris CSS/PNG/vidéo lourds) sont servis en `no-cache, no-store`. En prod, aucun cache navigateur → re-téléchargement systématique des 9 Mo d'images à chaque visite. Acceptable en dev, coûteux en prod.
Correction : en prod, poser un `Cache-Control: public, max-age=…` sur les assets statiques (immuables si hashés).

### [Minor] `favicon.svg` seul — pas de fallback PNG/ICO ni apple-touch-icon
Fichiers : toutes les pages (`<link rel="icon" href="favicon.svg">`)
Description : Un seul favicon SVG (265 o). Pas d'`apple-touch-icon`, pas de `favicon.ico` de repli, pas de manifest PWA.
Correction : ajouter `apple-touch-icon` (180×180 PNG) et un `favicon.ico` de repli ; optionnel `site.webmanifest`.

---

## Top 5 à corriger en priorité

1. **Réparer la famille blog/articles** (CSS mort + `#stars`/`#aurora`/`#grain` inertes + GSAP absent qui tue `site.js` et le chatbot) — 5 pages actuellement cassées et sans chatbot. Migrer vers la charte moderne.
2. **Rendre les formulaires de contact réels** (index + pages service) : route `/api/contact` dans `server.js` + `fetch` POST. Aujourd'hui tous les leads sont perdus.
3. **Corriger les liens de nav cassés** `#solutions`/`#preuves` (blog/articles) et `#preuve`/« Réalisations » (index) → ancres réelles.
4. **SEO des 5 pages principales** : canonical + Open Graph (`og:image` incluse) + JSON-LD `LocalBusiness` sur la home + `robots.txt` + `sitemap.xml`.
5. **Finir la migration du thème violet** : remplacer les ~40 `#9333EA`/`rgba(147,51,234)` résiduels (dont `.detail`/`.detail--presence`) par `#7C3AED`/`var(--c-accent)`, et uniformiser `theme-color` (#060309). En parallèle, optimiser les images (4 PNG service de 1,8–3,3 Mo + hero PNG 1,56 Mo + vidéo 2,55 Mo → WebP/AVIF) pour le LCP.
