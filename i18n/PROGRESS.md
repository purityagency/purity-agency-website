# LEDGER — Localisation Purity Agency (mémoire de progression)

> Source de vérité de l'avancement. Survit aux resets de contexte. Ne jamais re-dispatcher une tâche marquée ✅.

## Décisions figées
- 2026-07-01 — Archi = **hybride standard agence** : JSON source/langue → `build.js` → `/<code>/*.html` pré-rendus + `hreflang` + sitemap + switch client instantané.
- 2026-07-01 — Cible = **diaspora / communautés linguistiques & expats en BE/UE** (pas les pays d'origine).
- 2026-07-01 — Prix **EUR partout**, cadre légal **belge (art. 56bis)** conservé, marque non traduite.
- 2026-07-01 — 10 langues : fr(src) en nl de es pt zh ru ar(RTL) hi.

## Phase 0 — Recherche marché (fiche par langue → i18n/research/<code>.md) ✅ COMPLÈTE
| Langue | Angle retenu | Statut |
|--------|-----------|--------|
| en | Expats institutions UE Bruxelles (40k+), anglais neutre, GDPR | ✅ |
| nl | Flandre (langue maternelle + prix transparent) | ✅ |
| de | **Ostbelgien** (~79,5k, niche mal desservie, proche Charleroi) | ✅ |
| es | Espagnols Bruxelles + Latino-Am UE, prix explicite | ✅ |
| pt | Communauté PT établie (~91k BE) + entrepreneurs BR ; pt-PT neutre | ✅ |
| zh | Sinophones BE (40k+, resto/commerce), service en chinois | ✅ |
| ru | Russophones UE tech-savvy, **neutralité politique stricte** | ✅ |
| ar | **Charleroi = forte comm. marocaine (5,2%)**, RTL, proximité | ✅ |
| hi | Comm. indienne UE (~7k, tech) ; angle proximité+IA, Hinglish ok | ✅ |

## Décision structure i18n (prouvée, pas théorique) — 2026-07-01
- **1 JSON par langue** (`i18n/<code>.json`), namespaces internes (hero, svc, tarifs, pages.*).
- Justif data : archi pré-rendue = texte baké dans le HTML au build → pas de load runtime ; site < 300 segments/langue (seuil de split) ; 1 requête (~2ms) bat la cascade namespace (~40ms/req) ; ~18KB gzip/1000 clés. Split/lazy = pour gros SPA runtime, pas notre cas. Sources: i18next, better-i18n, Intlayer.

## Décision méthode build (prouvée) — 2026-07-01
- **Auto-extraction + pré-rendu par langue** (esprit `static-i18n` npm), en **script Node maison zéro-dépendance**.
- Justif data : pour un site EXISTANT, l'extraction auto > réécriture manuelle (moins de retrofit, détecte les incohérences) ; pré-rendu par locale au build = recommandé pour "nombre limité de locales". Script maison (pas le package) car : projet zéro-dépendance (cf server.js), gestion fine des cas <br> hero/footer, RTL ar, HTML inline (em, grad, strong). Sources: static-i18n, s18n, Next SSG, Astro i18n.
- Pipeline : `extract.js` (HTML FR → fr.json + templates) → `build.js` (templates + xx.json → /xx/*.html + hreflang + sitemap).

## Phase 1 — Socle technique
- ⬜ Extraction auto `i18n/fr.json` (source) via extract.js
- ⬜ `build.js` + hreflang + switch + sitemap
- ⬜ Validation pipeline FR+EN
- ✅ Phase 0 recherche COMPLÈTE (11 fiches : en nl de es pt zh ru ar hi pl it)

## Phase 2 — Localisation (JSON par langue)
| Langue | JSON | Statut |
|--------|------|--------|
| en nl de es pt zh ru ar hi | i18n/<code>.json | ⬜ à faire |

## Phase 3 — Intégration & revue
- ⬜ Build final 10 langues
- ⬜ Vérif RTL (ar), hreflang, sitemap
- ⬜ Revue qualité finale

## Décision routage racine (2026-07-01)
- `/` → détection `Accept-Language` (serveur) → redirect `/xx/`. Toutes langues sous `/xx/`, égales.
- Garde-fous : redirect SERVEUR (pas seulement JS) + page fallback avec hreflang complet + x-default ; mémoriser le choix (cookie/localStorage) pour ne pas re-rediriger ; sitemap liste chaque /xx/.

## Git
- `f0633d1` — Baseline: site FR mono-langue avant i18n
