# 05 — SYSTÈME D'EXPLOITATION DES AGENTS & CATALOGUE SKILLS

> **Purity Agency** — Manuel d'Orchestration Agentique & Catalogue de Competences (v1.0)
> *Spécification des règles du workspace, des déclencheurs et de la matrice de compétences agentiques.*

---

## 1. PROTOCOLE MAÎTRE DE NAVIGATION (`AGENTS.md`)

Le développement, la maintenance et l'évolution du projet **Purity Agency** sont gouvernés par une matrice de routing stricte définie dans `AGENTS.md`.

### A. Règle Absolue d'Exécution
Avant toute réponse ou action sur le code source, l'agent IA doit obligatoirement consulter le tableau de déclencheur (Routing Actif) et invoquer les compétences (`skills`) applicables dans l'ordre séquentiel prescrit.

### B. Mode Operatoire "Caveman"
Les réponses de l'assistant sont calibrées en mode **Caveman** : courtes, denses, zéro bavardage useless, focalisées uniquement sur la livraison concrète de code et d'ingénierie.

---

## 2. MATRICE DE ROUTING ACTIF (PURITY ONE / AGENCY)

| Déclencheur Utilisateur | Skills Invoqués dans l'Ordre |
| :--- | :--- |
| **idée, besoin, feature, créer, construire** | `intent-driven-development` → `orch-add-feature` |
| **MVP, démarrer de zéro** | `product-lens` → `orch-build-mvp` |
| **modifier une feature existante** | `orch-change-feature` |
| **plan, étapes, découpage, roadmap** | `product-capability` → `blueprint` → `plan-orchestrate` |
| **bug, erreur, cassé, ne marche pas** | `orch-fix-defect` → `tdd-workflow` → `verification-loop` |
| **refactor, simplifier, nettoyer sans casser** | `orch-refine-code` → `coding-standards` |
| **audit, review, qualité, avant merge** | `production-audit` → `verification-loop` |
| **landing, hero, section, page, UI, style** | `design-taste-frontend` → `frontend-design-direction` |
| **premium, agence, luxe, Awwwards** | `high-end-visual-design` → `make-interfaces-feel-better` |
| **redesign, améliorer le design, refaire** | `redesign-existing-projects` → `design-taste-frontend` |
| **design system, tokens, composants** | `design-system` → `frontend-patterns` |
| **mobile, responsive, dark mode** | `frontend-patterns` → `frontend-a11y` |
| **accessibilité, ARIA, lecteur d’écran** | `accessibility` → `frontend-a11y` |
| **animation, GSAP, transition, scroll, reveal** | `motion-foundations` → `motion-patterns` |
| **micro-interaction, modal, toast, stagger** | `motion-patterns` → `motion-ui` |
| **performance, lent, LCP, CLS, Core Web Vitals** | `benchmark` → `frontend-patterns` |
| **SEO, meta, schema, sitemap** | `seo` |
| **sécurité, formulaire, input, secret, API** | `security-review` |
| **test, E2E, QA, navigateur** | `browser-qa` → `e2e-testing` |
| **commit, branche, PR, merge** | `git-workflow` → `delivery-gate` |
| **déployer, production, lancement** | `deployment-patterns` → `production-audit` → `delivery-gate` |
| **écrire, copy, contenu** | `brand-voice` → `content-engine` |
| **documentation, ADR, visite du code** | `code-tour` → `architecture-decision-records` |

---

## 3. APERÇU DES 288 SKILLS INSTALLÉS (`.agents/skills/`)

Le workspace intègre un catalogue étendu de **288 compétences agentiques** classées par domaines d'expertise :

1. **Agent, Orchestration & Évaluation** : `agentic-engineering`, `agentic-os`, `autonomous-loops`, `claude-devfleet`, `council`, `gan-style-harness`, `plan-orchestrate`, `team-agent-orchestration`.
2. **Design, Frontend & Médias** : `accessibility`, `design-system`, `frontend-patterns`, `liquid-glass-design`, `make-interfaces-feel-better`, `motion-foundations`, `motion-patterns`, `motion-ui`, `taste-skill`.
3. **Qualité, Sécurité & Livraison** : `benchmark`, `browser-qa`, `coding-standards`, `delivery-gate`, `deployment-patterns`, `git-workflow`, `production-audit`, `security-review`, `verification-loop`.
4. **Architecture & API** : `api-design`, `architecture-decision-records`, `backend-patterns`, `error-handling`, `mcp-server-patterns`, `postgres-patterns`, `redis-patterns`.
5. **Produit, CRO & SEO** : `brand-voice`, `content-engine`, `deep-research`, `market-research`, `product-lens`, `seo`.

---

## 4. PROCESSUS DE VÉRIFICATION & QUALITÉ (VERIFICATION LOOP)

Toute modification apportée au code source de Purity Agency suit obligatoirement la boucle de vérification intégrée :
1. **Inspection d'Impact** : Analyse des effets de bord sur le serveur Node.js, l'Agent Sentinel, et le checkout.
2. **Vérification de Non-Régression** : Validation du fonctionnement de `/api/health`, des formulaires et des modales de réservation.
3. **Validation de Sécurité** : Absence de secrets commités et respect des règles CSP.
