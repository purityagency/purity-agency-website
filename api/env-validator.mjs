// Module de validation stricte de l'environnement de production (Zero-Dependency).
// Bloque le démarrage du serveur si une variable critique est corrompue,
// absente ou présente un risque de sécurité (fail-fast, no secret leaks in logs).

import { existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SECRETS_DIR = resolve(HERE, '../../secrets');

export function validateEnvironment() {
  const errors = [];
  const warnings = [];

  // 1. Port réseau
  const port = Number(process.env.PORT || 3001);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    errors.push(`PORT invalide : "${process.env.PORT}". Doit être un entier entre 1024 et 65535.`);
  }

  // 2. Mode d'exécution
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && process.env.PURITY_NO_LISTEN === '1') {
    errors.push('PURITY_NO_LISTEN=1 est interdit en environnement de production.');
  }

  // 3. Clés d'API et secrets (vérification de présence + format sans logger la valeur)
  const secretChecks = [
    {
      name: 'Resend API Key',
      envVar: 'RESEND_API_KEY',
      file: resolve(SECRETS_DIR, '.resend-key'),
      pattern: /^re_[a-zA-Z0-9_-]{20,}$/,
      critical: false // Repli gracieux sur journal local si absent
    },
    {
      name: 'Gemini API Key',
      envVar: 'GEMINI_API_KEY',
      file: resolve(SECRETS_DIR, '.gemini-key'),
      pattern: /^[a-zA-Z0-9_.-]{30,}$/,
      critical: false // Repli gracieux sur fast-router si absent
    },
    {
      name: 'Google Service Account',
      envVar: 'GOOGLE_SERVICE_ACCOUNT_JSON',
      file: resolve(SECRETS_DIR, '.google-service-account.json'),
      validator: (raw) => {
        try {
          const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
          return json?.client_email && json?.private_key?.includes('BEGIN PRIVATE KEY');
        } catch {
          return false;
        }
      },
      critical: false // Agenda indisponible mais site fonctionnel si absent
    }
  ];

  for (const check of secretChecks) {
    let value = process.env[check.envVar]?.trim();
    let source = `env:${check.envVar}`;

    if (!value && existsSync(check.file)) {
      try {
        const stats = statSync(check.file);
        // Sur systèmes POSIX, vérifie le mode 0o600 / 0o400 (lecture exclusive propriétaire)
        if (process.platform !== 'win32') {
          const mode = stats.mode & 0o777;
          if ((mode & 0o077) !== 0) {
            warnings.push(`Fichier ${check.name} (${check.file}) trop permissif (mode ${mode.toString(8)}). Exécutez: chmod 600 ${check.file}`);
          }
        }
        source = `file:${check.file}`;
        value = 'PRESENT';
      } catch (err) {
        errors.push(`Impossible de lire ${check.file} : ${err.message}`);
      }
    }

    if (!value) {
      if (check.critical && isProd) {
        errors.push(`Secret critique manquant pour ${check.name} (défini ni dans ${check.envVar} ni dans ${check.file}).`);
      } else {
        warnings.push(`Secret optionnel non configuré pour ${check.name} (${source}).`);
      }
    } else if (check.pattern && source.startsWith('env:') && !check.pattern.test(value)) {
      if (check.critical) {
        errors.push(`Format invalide pour la variable ${check.envVar} (${check.name}). Longueur: ${value.length} caractères.`);
      } else {
        warnings.push(`Format inattendu pour la variable optionnelle ${check.envVar} (${check.name}). Longueur: ${value.length} caractères.`);
      }
    }
  }

  // Rapport de démarrage
  if (warnings.length > 0 && !isProd) {
    for (const w of warnings) {
      console.warn(`[AppSec Warning] ${w}`);
    }
  }

  if (errors.length > 0) {
    console.error('[AppSec Fatal Error] Échec des pré-requis de sécurité au démarrage :');
    for (const e of errors) {
      console.error(`  - ${e}`);
    }
    throw new Error('APPSEC_VALIDATION_FAILED: Le serveur refuse de démarrer avec une configuration corrompue.');
  }

  return { ok: true, isProd, port };
}

