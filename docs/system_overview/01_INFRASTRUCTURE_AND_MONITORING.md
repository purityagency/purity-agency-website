# 01 — INFRASTRUCTURE, MONITORING & TÉLÉMÉTRIE

> **Purity Agency** — Document d'Architecture Infrastructure & Opérations (v1.0)
> *Référence technique pour l'hébergement, la résilience et la surveillance autonome.*

---

## 1. TOPOLOGIE APPLICATIVE & HÉBERGEMENT HYBRIDE

L'écosystème de **Purity Agency** repose sur une architecture découplée, hybride et hautement disponible, combinant deux plateformes Cloud complémentaires :

```mermaid
graph TD
    Client[Client / Prospect] -->|HTTPS Requests| Cloudflare[Cloudflare CDN & Security]
    Cloudflare -->|Route / | Render[Render Web Service - Node.js HTTP Native]
    Cloudflare -->|Route /login & App| Vercel[Vercel Serverless - Next.js 16 Purity OS]
    
    subgraph Render_Instance [Site Vitrine & API Gateway (Render)]
        Render --> StaticCache[In-Memory File Cache & Gzip]
        Render --> PaymentCtrl[Payment & Order Controller]
        Render --> SentinelAgent[Sentinel Background Agent (5m Interval)]
    end

    subgraph Vercel_Instance [Purity OS Client Portal (Vercel)]
        Vercel --> NextAuth[NextAuth RBAC Guard]
        Vercel --> PrismaORM[Prisma ORM]
    end

    PrismaORM --> NeonDB[(Neon PostgreSQL Cloud DB)]
    SentinelAgent -->|Cron Keep-Alive| Render
    SentinelAgent -->|HTTPS Telemetry Push| Vercel
    UptimeRobot[UptimeRobot / Cron-Job.org] -->|GET /api/health (5m)| Render
```

### A. Composant 1 : Site Vitrine & Tunnel de Vente (Render)
- **Runtime** : Node.js (v24.15.0) via `http` natif sans framework lourd (0 dépendance Express).
- **Hébergement** : Render.com (Web Service gratuit avec auto-healing).
- **URL Publique** : `https://purity-agency.be` / `https://purity-agency-website.onrender.com`.
- **Rôle** : Servir les pages HTML/CSS/JS optimisées, gérer les sessions de checkout Mollie, les formulaires de contact/réservation, et faire tourner le bot Sentinel.

### B. Composant 2 : Portail Client & Admin Purity OS (Vercel)
- **Runtime** : Next.js 16 (App Router, React 19, Turbopack).
- **Hébergement** : Vercel Cloud Platform (Serverless Edge & Server Functions).
- **URL Publique** : `https://purity-agency.vercel.app`.
- **Base de Données** : PostgreSQL Serverless hébergé chez Neon DB (pooler + SSL obligatoire).
- **Rôle** : Espace client dédié, onboarding post-achat, suivi des tickets, tableau de bord administrateur avec RBAC.

---

## 2. PROTOCOLE ANTI COLD-START & KEEPALIVE

Pour contourner la mise en veille automatique des instances gratuites Render (qui s'endorment après 15 minutes d'inactivité), un double système Keep-Alive a été mis en œuvre :

1. **UptimeRobot / Cron-Job Ping Service** :
   - **Endpoint ciblé** : `https://purity-agency-website.onrender.com/api/health`
   - **Fréquence** : Toutes les 5 minutes (HTTP GET).
   - **Temps de réponse moyen** : ~170 ms.
   - **Impact** : L'instance Render reste active 24h/24 et 7j/7, éliminant tout délai de premier chargement (Cold Start de 50s évité).

2. **Agent Sentinel Local** :
   - Exécution immédiate au démarrage du serveur Node.js + intervalle récurrent de 5 minutes (`setInterval`).
   - Auto-test local sur `127.0.0.1:3000`.

---

## 3. L'AGENT SENTINEL & PONT DE TÉLÉMÉTRIE

Le service `server/services/sentinel.service.js` agit comme un superviseur autonome embarqué au cœur du serveur Node.js.

### A. Sondes & Métriques Collectées
À chaque cycle d'audit (5 min), Sentinel vérifie :
- **Santé des Routes Sévères** : `/`, `/api/health`, `/hebergement.html`, `/automatisation.html`, `/legal.html`.
- **Métriques Système** : Uptime du processus Node.js, empreinte mémoire RAM (`usedMb` / `totalMb` / `usagePercent`), version Node.js et PID.

### B. Journalisation & Alerte Local (`sentinel.log`)
Les résultats sont formatés sous forme JSON structuré et sauvegardés dans `sentinel.log` à la racine du projet :
```json
[2026-07-22T17:46:02.964Z] [SENTINEL-INFO] Audit complet réussi — 100% opérationnel {"metrics":{"uptimeSeconds":2,"memory":{"totalMb":16229,"usedMb":13263,"usagePercent":"81.7%"},"nodeVersion":"v24.15.0","pid":14256},"testedRoutes":5}
```

### C. Pont Télémétrique avec Purity OS
Une fois l'audit terminé, Sentinel transmet le rapport par requête HTTP POST à l'API interne de Purity OS :
- **Endpoint** : `POST ${CLIENT_PORTAL_URL}/api/internal/sentinel-log`
- **Authentification** : Header `Authorization: Bearer ${INTERNAL_API_SECRET}`
- **Gestion des pannes** : Échec silencieux gracieux (Silent fail gracefully) si Purity OS est momentanément inaccessible.

---

## 4. GESTION DES SECRETS & SÉCURITÉ INFRASTRUCTURE

L'infrastructure applique une séparation stricte entre le code source et les données sensibles.

### A. Hiérarchie des Fichiers de Configuration
Les clés d'API et secrets sont résolus selon la priorité suivante (`server/config/env.js`) :
1. Variables d'environnement système / Render / Vercel (`process.env.*`).
2. Fichiers de fallback sécurisés situés dans `../secrets/` (hors Git) :
   - `secrets/.admin-password`
   - `secrets/.internal-api-secret`
   - `secrets/.resend-key`
   - `secrets/.mollie-key`
   - `secrets/.stripe-key`
   - `secrets/.cloudflare-token`
   - `secrets/.google-service-account.json`

### B. Protections de Sécurité Actives
- **Content Security Policy (CSP)** : Aucun script inline autorisé dans le HTML.
- **CORS** : Restriction stricte des requêtes API uniquement depuis `https://purity-agency.be`, `https://www.purity-agency.be` et les origines de dev locales (`127.0.0.1`).
- **Fichiers Bloqués** : Interdiction formelle de servir les fichiers système `.env`, `server.js`, `leads.log`, ou les dossiers d'accès `.git` / `.codex`.
