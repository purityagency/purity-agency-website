# 04 — ARCHITECTURE TECHNIQUE & STACK LOGICIELLE

> **Purity Agency** — Document d'Architecture Logicielle & Spécifications (v1.0)
> *Guide technique complet des composants frontend, backend, base de données et intégrations.*

---

## 1. VUE D'ENSEMBLE DE LA STACK LOGICIELLE

L'écosystème **Purity Agency** est construit sur une approche pragmatique, ultra-performante et sans sur-ingénierie (Zero-Bloat Engineering).

```text
[CLIENT BROWSER]
       │
       ├────► Static Assets (Vanilla HTML5 / CSS BEM / Vanilla JS ES6+ / GSAP 3.x)
       │
[SERVER NODE.JS NATIF] (Render)
       │
       ├────► Routing Natif (HTTP Module, zero-express)
       ├────► In-Memory Gzip File Cache (watchDirectory auto-invalidation)
       ├────► Middleware de Sécurité & Headers CSP
       ├────► Repositories (JSON file storage under data/orders/)
       ├────► Integrations (Mollie API, Resend Email API, Google Calendar API)
       ├────► Sentinel Agent (Superviseur embarqué)
       │
[PURITY OS CLIENT PORTAL] (Vercel)
       │
       ├────► Next.js 16 (App Router, React 19, Turbopack)
       ├────► NextAuth.js (JWT Sessions, Role Middleware ADMIN vs CLIENT)
       ├────► Prisma ORM
       └────► PostgreSQL Serverless (Neon DB)
```

---

## 2. COMPOSANTS FRONTEND & STYLING

### A. Structure des Fichiers Frontend
- `index.html` & `index_i18n.html` : Pages d'accueil multilingues sémantiques.
- `css/site.css` & `css/site-extra.css` : Architecture CSS modulaire basée sur la méthodologie BEM avec préfixes dédiés (`.svc-card`, `.b2__num`, `.dp-hero`, `.brique-card`).
- `js/site.js` : Moteur principal d'animations GSAP (`ScrollTrigger`, reveals, carrousels, marquees).
- `js/pack-checkout.js` & `js/order-modal.js` : Modales interactives de réservation et tunnel de paiement en 3 étapes.
- `i18n/*.json` : Fichiers de traduction structurés pour 12 langues (FR, EN, DE, NL, ES, IT, PT, PL, RU, AR, HI, ZH).

### B. Accessibilité & Performance (WCAG 2.2 Level AA)
- Navigation au clavier complète (`tabindex`, `focus-visible`).
- Attributs ARIA explicites (`aria-expanded`, `aria-label`, `role="dialog"`).
- Contraste typographique élevé (#FFFFFF sur #060309 = ratio > 15:1).
- Zéro script externe bloquant.

---

## 3. COMPOSANTS BACKEND NODE.JS NATIF (`server/`)

### A. Core HTTP Server (`server/app.js`)
Le serveur backend est écrit à 100% en Node.js natif via le module `http` :
- **Clustering de production** : Fork automatique sur tous les cœurs CPU en mode production (`cluster.isMaster`).
- **Système de Cache Mémoire (`server/utils/cache.js`)** : Ingestion des fichiers statiques (.html, .css, .js) en mémoire RAM avec pré-compression Gzip et surveillance de répertoire (`fs.watch`) pour invalidation automatique sans redémarrage.
- **Support des Ranges (HTTP 206 / 416)** : Streaming vidéo pour les médias Hero section.

### B. Routing & Controlleurs
- `server/routes/contact.js` : Traitement des formulaires de contact.
- `server/routes/booking.js` : Prise de rendez-vous synchronisée avec Google Calendar via compte de service.
- `server/routes/payment.js` : Tunnel de commande et webhooks.
- `server/controllers/payment.controller.js` : Logique de création de paiements Mollie, écoute des webhooks, et provisionnement des clients sur Purity OS.

---

## 4. BASE DE DONNÉES & PURITY OS (`purity-os/`)

Le portail client **Purity OS** utilise Prisma ORM connecté à une instance PostgreSQL hébergée sur Neon Cloud.

### A. Modèle de Données Clé (Schéma Prisma)
- `User` : Utilisateurs du système (champs : `id`, `email`, `passwordHash`, `role` (`ADMIN` | `CLIENT`), `name`, `createdAt`).
- `Project` / `Order` : Projets rattachés aux clients avec suivi d'avancement, briques souscrites et statut des livrables.
- `SentinelLog` : Historique des audits de télémesure envoyés par le serveur vitrine.

### B. Contrôle d'Accès basé sur les Rôles (RBAC Middleware)
Le fichier `purity-os/src/middleware.ts` protège les routes applicatives :
- Tout accès à `/admin/*` exige un token valide avec `role === "ADMIN"`.
- En cas de tentative d'accès non autorisé par un client, redirection automatique vers `/dashboard`.
- Toute tentative d'accès non authentifié vers `/dashboard/*` redirige vers `/login`.
