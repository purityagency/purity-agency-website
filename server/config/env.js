const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const SECRETS_DIR = path.join(ROOT, '..', 'secrets');

// Helper to read local secrets files safely
function readSecretFile(filename) {
  try {
    return fs.readFileSync(path.join(SECRETS_DIR, filename), 'utf8').trim();
  } catch (err) {
    return '';
  }
}

// Load env variables (fallback to secrets files)
const PORT = parseInt(process.env.PORT, 10) || 3000;
const RESEND_API_KEY = (process.env.RESEND_API_KEY || readSecretFile('.resend-key')).trim();
const MOLLIE_API_KEY = (process.env.MOLLIE_API_KEY || readSecretFile('.mollie-key')).trim();
const INTERNAL_API_SECRET = (process.env.INTERNAL_API_SECRET || readSecretFile('.internal-api-secret')).trim();
const GEMINI_API_KEY = (process.env.GEMINI_API_KEY || readSecretFile('.gemini-key')).trim();

let googleServiceAccount = null;
try {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    googleServiceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  } else {
    googleServiceAccount = JSON.parse(fs.readFileSync(path.join(SECRETS_DIR, '.google-service-account.json'), 'utf8'));
  }
} catch (err) {
  // Graceful fallback if google service account is missing
}

const CONTACT_FROM = 'Purity Agency <hello@purity-agency.be>';
const CONTACT_TO = 'hello@purity-agency.be';
const BASE_URL = process.env.BASE_URL || 'https://purity-agency-website.onrender.com';

module.exports = {
  ROOT,
  PORT,
  RESEND_API_KEY,
  MOLLIE_API_KEY,
  INTERNAL_API_SECRET,
  GEMINI_API_KEY,
  googleServiceAccount,
  CONTACT_FROM,
  CONTACT_TO,
  BASE_URL
};
