const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Défense en profondeur : Cloudflare force déjà HTTPS devant, mais sans cet
  // en-tête posé par l'app elle-même, un accès direct au serveur d'origine
  // (contournant Cloudflare) resterait servable en clair.
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://cdnjs.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    // eu.i.posthog.com est le vrai domaine d'ingestion des events (pas
    // seulement eu.posthog.com) — sans lui, CHAQUE event PostHog était
    // bloqué par la CSP en silence (finding 2026-08-05, confirmé par
    // "errors-in-console" dans l'audit PageSpeed : la mesure d'audience
    // ne fonctionnait pas du tout depuis sa mise en place).
    "connect-src 'self' https://api.posthog.com https://eu.posthog.com https://eu.i.posthog.com",
    "frame-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ].join('; ')
};

function applySecurityHeaders(res) {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.setHeader(key, value);
  }
}

module.exports = {
  applySecurityHeaders
};
