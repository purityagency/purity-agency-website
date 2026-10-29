# Purity Agency — Refonte Sécurité (Principal Security Engineer / ASVS Level 3)

## 1. Matrice STRIDE Appliquée

| Menace (STRIDE) | Vecteur Ciblé | Défense Appliquée en Production | Fichier |
| :--- | :--- | :--- | :--- |
| **S — Spoofing** | Falsification d'IP (`X-Forwarded-For`), vol/forge de session OctoMask, CSRF cross-site | Extraction IP vérifiant le pair socket proxy (`isTrustedProxyPeer`), jetons de session signés par **HMAC-SHA256** et vérifiés en temps constant (`timingSafeEqual`), contrôle strict `Origin`/`Referer`/`Sec-Fetch-Site`. | [api/security.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/security.mjs), [api/chat.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/chat.mjs) |
| **T — Tampering** | Prototype Pollution JSON, Path Traversal, Symlink Escape, Injection CRLF | Nettoyage récursif `__proto__`/`constructor`/`prototype`, blocage `%00`/`%2e`/`%2f`/`%5c`, double vérification `resolve()` + `realpath()` sous `ROOT`, purge des caractères de contrôle ASCII. | [server.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/server.mjs), [api/security.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/security.mjs) |
| **R — Repudiation** | Perte de leads en cas d'indisponibilité SMTP, saturation disque par spam | Journalisation locale atomique `data/leads.log` (`0600`), déduplication SHA-256 sur 10 min, rotation automatique à `5 Mo` (`leads.log.1`), piège Honeypot silencieux. | [api/contact.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/contact.mjs) |
| **I — Information Disclosure** | Exposition de fichiers `.mjs`/`.env`/`.log`, fuite de prompt ou prix inventés par LLM, exfiltration navigateur | Allowlist stricte des routes statiques (`isAllowedStaticPath`), CSP `connect-src 'self'` et `script-src-attr 'none'`, validateur de sortie LLM (`validateReply`), zéro stack-trace client. | [server.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/server.mjs), [api/chat.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/chat.mjs) |
| **D — Denial of Service** | Slowloris, saturation mémoire/connexions, épuisement quota Gemini/PageSpeed | Timeouts HTTP (`requestTimeout: 30s`, `headersTimeout: 10s`, `keepAliveTimeout: 5s`), lecture body bornée en octets (`Buffer.byteLength`) avec timeout `8s`, 5 limiteurs de débit isolés par route avec éviction LRU. | [server.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/server.mjs), [api/security.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/security.mjs) |
| **E — Elevation of Privilege** | SSRF & **DNS Rebinding (TOCTOU)** via `/api/audit` et `/api/pagespeed` | Résolution DNS unique (`resolvePublicTarget`) validant toutes les IP (IPv4/IPv6/NAT64/6to4/Teredo/ULA/Loopback/Metadata `169.254.169.254`), puis requête HTTP/HTTPS **épinglée directement sur l'IP vérifiée** (`pinnedRequest` avec SNI `servername`). | [api/audit.mjs](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/api/audit.mjs) |

---

## 2. Plan d'Exécution & Gouvernance Continue (3 Phases)

### Phase 1 — Périmètre Applicatif & Transport (100 % Appliqué)
- [x] **CSP niveau 3 (`connect-src 'self'`, `script-src-attr 'none'`, `frame-ancestors 'none'`)** + HSTS 2 ans `preload`.
- [x] **Anti-DNS Rebinding (`pinnedRequest`)** sur l'audit de site en direct.
- [x] **Signature cryptographique HMAC-SHA256 (`timingSafeEqual`)** des cookies de session `octomask`.
- [x] **Vérification `realpath()` anti-symlink** et blocage des méthodes `TRACE`, `TRACK`, `CONNECT`.
- [x] **Rotation bornée (`5 Mo`) + déduplication SHA-256** sur `data/leads.log` + Honeypot anti-bot.

### Phase 2 — Infrastructure & Edge (Cloudflare / Reverse-Proxy Production)
- [ ] Activer **Cloudflare WAF Managed Rules** (OWASP Core Ruleset) + **Bot Fight Mode** devant `purity-agency.be`.
- [ ] Activer **DNSSEC** et enregistrement **CAA** (`0 issue "letsencrypt.org"`) sur la zone DNS `purity-agency.be`.
- [ ] Configurer **SPF (`-all`)**, **DKIM (2048 bits)** et **DMARC (`p=quarantine` puis `p=reject`)** pour `purity-agency.be`.

### Phase 3 — Audit Continu & Tests Adversariaux CI/CD
- [x] Suite automatisée `node --test tests/*.test.mjs` (`17/17` tests : headers OWASP, CSP, traversal, CSRF, Prototype Pollution, Honeypot, HMAC session, SSRF IPv4/IPv6).
- [x] Gate CI bloquant configuré dans [.github/workflows/security-ci.yml](file:///c:/Users/User/Desktop/Purity%20ONE/purity-agency-site/.github/workflows/security-ci.yml) (vérification syntaxique `node --check` + `npm test` à chaque push/PR sur `main`).
