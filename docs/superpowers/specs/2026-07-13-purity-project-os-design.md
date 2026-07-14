# Purity Project OS - Architecture & Design Spec

## 1. Vision & Objectifs
Transformer l'expérience client de Purity en remplaçant les canaux de communication éparpillés (e-mails, WhatsApp, Drive) par une plateforme centralisée et ultra-premium (app.purity-agency.be).
L'objectif est d'offrir une expérience de "Project Operating System" qui automatise le suivi, centralise les échanges, gère les fichiers et valide les étapes de manière fluide.

## 2. Architecture Technique
- **Frontend / Backend Unifié :** Next.js (App Router) en TypeScript.
- **Base de Données :** PostgreSQL gérée via Prisma ORM.
- **Hébergement ciblé :** Vercel (pour Next.js) et un fournisseur PostgreSQL (ex: Supabase / Neon).
- **Styling :** Tailwind CSS + shadcn/ui.
- **Animations / Interactions :** Framer Motion.
- **Gestion d'état asynchrone :** TanStack Query pour une interface hyper-réactive sans rechargement.
- **Authentification :** NextAuth.js / Auth.js (Magic links ou Credentials sécurisés).

## 3. Structure Modulaire (Feature-Sliced)
L'application sera divisée en domaines métiers indépendants pour garantir son évolutivité :
- `modules/auth` : Authentification, sessions, rôles (ADMIN, CLIENT).
- `modules/projects` : Entité centrale, progression (%), dates de livraison.
- `modules/timeline` : Gestion des étapes (Stages) et tâches (Tasks) avec système de validation.
- `modules/chat` : Messagerie temps réel attachée aux étapes ou globale au projet.
- `modules/documents` : Gestion des uploads, factures, contrats, stockage S3-compatible.
- `modules/notifications` : Centre de notification intelligent in-app et e-mail.
- `modules/admin` : Dashboard de gestion globale pour Purity (filtres, statuts, actions rapides).
- `modules/ai` : Assistant intelligent contextuel pour guider le client.

## 4. Modèle de Données (Core Schema)
*   **User** : `id`, `email`, `role`, `name`, `createdAt`.
*   **Project** : `id`, `clientId` (relation User), `name`, `status`, `estimatedDelivery`. (Progression calculée dynamiquement).
*   **Stage** : `id`, `projectId`, `title`, `description`, `status` (PENDING, IN_PROGRESS, WAITING_CLIENT, BLOCKED, REVIEW, COMPLETED), `orderIndex`.
*   **Message** : `id`, `stageId` (optionnel), `authorId`, `content`, `createdAt`.
*   **Document** : `id`, `projectId`, `type` (INVOICE, ASSET, CONTRACT), `url`, `filename`, `filesize`, `mimeType`, `uploadedBy`, `uploadedAt`.
*   **Payment** : `id`, `projectId`, `amount`, `status`, `type` (QUOTE, INVOICE, PAYMENT), `createdAt`.

## 5. Expérience Utilisateur (UX)
- **Minimalisme & Premium :** Esthétique "Liquid Glass", fond noir (`#060309`), accents violets (`#7C3AED`), pas de surcharge cognitive.
- **Instantanéité :** Validation d'étapes et envois de messages avec feedback visuel immédiat (optimistic UI).
- **Onboarding Automatique :** La création du compte et du projet déclenche l'envoi des accès. Dès la première connexion, le client atterrit sur une timeline dynamique.
- **Livraison Intégrée :** Apparition conditionnelle d'un bouton "Rejoindre la réunion" (visioconférence) le jour de la livraison finale.

## 6. Automatisations Prévues
- Validation client d'une étape → L'étape passe "COMPLETED", la suivante passe "ACTIVE" → Mise à jour de la jauge de progression globale → Notification Admin.
- Upload de fichier manquant → L'assistant IA clôture la demande d'action correspondante.

## 7. Gestion du Scope (Périmètre)
Ce document couvre l'architecture de base du Project OS.
**La première implémentation (MVP)** se concentrera sur :
1. Le socle technique (Next.js + Prisma + DB).
2. L'authentification.
3. Le Dashboard Client (vue projet, timeline statique puis interactive).
4. Le Dashboard Admin (création/modification de projets).
Les modules complexes comme le Chat temps-réel avancé, le stockage cloud S3 complet et l'IA seront construits de manière itérative dans des plans subséquents.
