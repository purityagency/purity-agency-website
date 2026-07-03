# 🌐 Purity Agency — Website Repository

Ce dépôt contient le site web vitrine et applicatif de **Purity Agency** (agence digitale à Charleroi, Belgique), ciblant les indépendants, artisans et PME de Wallonie.

> [!IMPORTANT]
> **Ce projet est conçu sans framework (Vanilla HTML/JS/CSS)** pour garantir des performances optimales, une maintenance minimale et une indépendance technologique totale.

---

## 🗺️ Cartographie & Structure du Projet

Le serveur Node.js (`server.js`) servant les fichiers statiques de manière directe, l'ensemble des pages et ressources essentielles est structuré directement à la racine pour conserver des URL propres sans étape de build.

```text
purity-agency-website/
│
├── 📄 Pages HTML (Points d'entrée)
│   ├── index.html                           # Page d'accueil principale (Hub & Grille de services)
│   ├── presence.html                        # Service : Présence en ligne & Landing Pages
│   ├── outils.html                          # Service : Outils métiers & Applications sur mesure
│   ├── automatisation.html                  # Service : Automatisation des processus & IA
│   ├── acquisition.html                     # Service : Acquisition client & SEO local
│   ├── blog.html                            # Index des articles de blog
│   ├── article-prix-site-web-belgique.html  # Article : Analyse des tarifs web en Belgique
│   ├── article-seo-local-wallonie.html      # Article : Guide SEO local Wallonie
│   ├── article-ia-pme-belgique.html         # Article : Guide pratique de l'IA pour PME
│   ├── article-site-ne-convertit-pas.html   # Article : 7 raisons de baisse de conversion
│   └── legal.html                           # Mentions légales, Confidentialité & Cookies
│
├── ⚡ Logique Client (Vanilla JavaScript + GSAP)
│   ├── site.js                              # Scripts globaux (Chatbot, Nav, Animations Accueil)
│   └── detail.js                            # Scripts spécifiques aux pages de services (Sub-sections, FAQ)
│
├── 🎨 Design & Styles (CSS BEM-inspired)
│   ├── site.css                             # Design System principal, variables violet/glass, layouts
│   └── site-extra.css                       # Styles complémentaires et animations avancées
│
├── ⚙️ Serveur & Backend (Pure Node.js)
│   ├── server.js                            # Serveur HTTP natif (sans Express) : routage, API Chatbot, Contact
│   └── leads.log                            # Journal local de capture des leads (fallback fichiers)
│
└── 📦 Assets (Médias & Identité)
    ├── logo.webp                            # Logo officiel Purity Agency
    ├── favicon.svg                          # Favicon vectoriel du site
    ├── hero-bg.webp                         # Fond d'écran du Hero section
    ├── service1.webp à service4.webp        # Visuels premium des services
    ├── tentacle-left.webp                   # Tentacule gauche OctoMask
    ├── tentacle-right.webp                  # Tentacule droite OctoMask
    └── octomask-floating.mp4                # Vidéo d'ambiance du chatbot
```

---

## 🛠️ Stack Technique & Dépendances

* **Serveur** : Node.js (module natif `http` et `https`). **Pas d'Express**.
* **Frontend** : HTML5 sémantique, CSS3 (variables, grid, flexbox, glassmorphism), ES6+ Vanilla JS.
* **Animations** : GSAP (GreenSock) avec les plug-ins *ScrollTrigger* et *ScrollToPlugin* chargés via CDN (Cloudflare).
* **API externe** : Gemini API (via HTTP natif Google AI endpoint) et Resend API (pour l'envoi d'e-mails).

---

## 🎯 Fonctionnalités Clés & Logique Interne

### 1. OctoMask Ambient Tentacles (Animation Organique)
Pour habiller les espaces vides sur les côtés sans surcharger visuellement, les tentacules d'OctoMask sont injectées en `position: absolute` dans chaque section parente (`.sec`, `.dp-section`, `section`, etc.).
Pour éviter les conflits de propriétés dans GSAP, la structure est multi-couches :
1. Enveloppe externe `.ambient-tentacle` ➡️ Gérée par **ScrollTrigger** (Parallaxe vertical lié au scroll de sa propre section).
2. Niveau intermédiaire `.ambient-tentacle__float` ➡️ Gérée par **Flottaison lente** (Boucle de respiration infinie en Y et rotation).
3. Niveau interne `.ambient-tentacle__inner` ➡️ Gérée par **Inertie du Curseur** (Mouvement fluide réactif à la souris).

### 2. Chatbot OctoMask (Gemini Proxy)
* **Client** : `site.js` gère l'interface de messagerie, l'historique de session et l'affichage.
* **Serveur** : `/api/chat` dans `server.js` sert de proxy sécurisé. Il envoie l'historique complet et les instructions système (`SYSTEM_PROMPT`) à Gemini 2.5 Flash sans exposer la clé API au client.
* **Capture de leads** : L'IA est entraînée à détecter le contact client et à émettre un tag spécifique :
  `[LEAD]{"name":"...","email":"...","phone":"...","activity":"...","need":"..."}[/LEAD]`
  Le script client intercepte silencieusement ce tag pour enregistrer le prospect via `/api/contact`.

### 3. Honeypot Anti-Spam (Sécurité invisible)
Tous les formulaires intègrent un champ caché aux yeux des utilisateurs réels (placé hors écran via CSS absolu) nommé `website_verification`.
* Si un robot remplit ce champ, le serveur répond par un code `200 OK` simulé mais **ignore silencieusement la requête** (pas d'écriture dans `leads.log`, pas d'envoi d'e-mail Resend).

### 4. Performance & Cache HTTP 304
* Le serveur prend en charge la validation de cache via les en-têtes `Last-Modified` et `If-Modified-Since`. Si aucun changement n'a eu lieu, il renvoie instantanément un code **`304 Not Modified`** sans retransmettre le fichier.
* Les médias (`.webp`, `.mp4`) et les polices possèdent une politique de cache agressif (`Cache-Control: public, max-age=31536000, immutable`).

---

## 🤖 Guide pour les Agents IA (Consignes de travail)

Si vous êtes une intelligence artificielle amenée à travailler sur ce codebase, veuillez respecter scrupuleusement les directives suivantes :

1. **Pas de Framework ni de Bundler** : Ne tentez pas d'ajouter des dépendances NPM superflues, de packager avec Webpack/Vite ou d'utiliser React/Vue. Écrivez du code Vanilla direct et propre.
2. **Design Language & Identité** : Respectez la charte graphique premium. Thème sombre violet (`#7C3AED` accent), effets de verre glacé (glassmorphism), polices *DM Sans* et *Space Grotesk*.
3. **Respectez BEM** : Utilisez le style de nommage CSS inspiré de BEM déjà en place (ex: `.footer__tagline`, `.btn--accent`, `.ambient-tentacle__inner`).
4. **Espacement Typographique** : Faites attention aux règles de typographie francophone (espaces insécables `&nbsp;` devant la ponctuation double, espaces de sécurité autour des retours à la ligne `<br>` pour éviter les concaténations sur une ligne).
5. **Modification chirurgicale** : Pas de code de remplissage (placeholders). Modifiez uniquement les blocs nécessaires sans altérer le reste de la logique ou des commentaires.

---

## 🚀 Lancement Local

1. Configurez vos clés d'API locales :
   * Créez un fichier `.gemini-key` à la racine contenant votre clé d'API Gemini.
   * Créez un fichier `.resend-key` à la racine contenant votre clé d'API Resend.
2. Démarrez le serveur :
   ```bash
   node server.js
   ```
3. Ouvrez votre navigateur sur : **`http://localhost:3000`**
