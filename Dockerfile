# syntax=docker/dockerfile:1.7
# ==============================================================================
# Purity Agency — Hardened Multi-Stage Production Dockerfile
# Zero-Dependency, Non-Root (UID 1000), Read-Only RootFS Compatible
# ==============================================================================

# Stage 1: Build & Integrity Verification
FROM node:22-alpine AS builder

WORKDIR /build

# Copie exclusive des fichiers applicatifs requis
COPY package.json ./
COPY server.mjs ./
COPY api/ ./api/
COPY js/ ./js/
COPY css/ ./css/
COPY assets/ ./assets/
COPY *.html ./
COPY robots.txt ./
COPY sitemap.xml ./
COPY llms.txt ./

# Vérification syntaxique stricte en phase de build (fail-fast si corruption)
RUN for f in server.mjs api/*.mjs js/*.js; do node --check "$f" || exit 1; done

# ==============================================================================
# Stage 2: Hardened Runtime Container
FROM node:22-alpine AS runner

# Variables d'environnement de production durcies
ENV NODE_ENV=production \
    PORT=3001 \
    PURITY_NO_LISTEN=0 \
    NODE_OPTIONS="--enable-source-maps --disallow-code-generation-from-strings"

WORKDIR /app

# Création du répertoire de données local avec permissions restreintes pour l'utilisateur non-root node
RUN mkdir -p /app/data && chown -R node:node /app

# Copie des artefacts depuis le builder avec assignation de propriété stricte
COPY --from=builder --chown=node:node /build /app

# Basculement obligatoire sur utilisateur non-root (UID 1000)
USER node

# Healthcheck périodique natif via script Node (aucune dépendance curl/wget requise)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const http = require('node:http'); \
    const req = http.request({ host: '127.0.0.1', port: process.env.PORT || 3001, path: '/api/health', timeout: 2000 }, (res) => { \
      process.exit(res.statusCode === 200 ? 0 : 1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Exposition exclusive du port applicatif
EXPOSE 3001

# Lancement direct sans wrapper shell pour propagation immédiate des signaux UNIX (SIGTERM / SIGINT)
CMD ["node", "server.mjs"]

