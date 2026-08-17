function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function isValidBCE(bce) {
  if (!bce) return true; // Optional for non-registered freelancers/individuals
  const cleaned = String(bce).replace(/[^0-9]/g, '');
  if (cleaned.length !== 10) return false;
  const prefix = cleaned.substring(0, 1);
  if (prefix !== '0' && prefix !== '1') return false;
  const baseNum = parseInt(cleaned.substring(0, 8), 10);
  const checkSum = parseInt(cleaned.substring(8, 10), 10);
  return (97 - (baseNum % 97)) === checkSum;
}

function formatBCE(bce) {
  const cleaned = String(bce || '').replace(/[^0-9]/g, '');
  if (cleaned.length !== 10) return bce || '';
  return `${cleaned.substring(0, 4)}.${cleaned.substring(4, 7)}.${cleaned.substring(7, 10)}`;
}

const VAT_FRANCHISE_MENTION = "Régime particulier de franchise des petites entreprises — TVA non applicable (Art. 56bis du CTVA).";

// N'autorise que http(s) avant d'utiliser une URL fournie par un visiteur
// (ex: "site web actuel" dans le formulaire de RDV) comme href dans un mail —
// bloque javascript:/data:/autre scheme qui s'exécuterait à l'ouverture.
function safeHttpUrl(url) {
  const raw = String(url || '').trim();
  if (!raw) return '';
  // La plupart des visiteurs tapent "monsite.be" sans schéma — on retente en
  // https:// avant d'abandonner, plutôt que de dégrader silencieusement en
  // texte brut pour le cas le plus courant.
  for (const candidate of [raw, `https://${raw}`]) {
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.href;
    } catch {
      // essaie le candidat suivant
    }
  }
  return '';
}

module.exports = {
  escapeHtml,
  isValidEmail,
  isValidBCE,
  formatBCE,
  safeHttpUrl,
  VAT_FRANCHISE_MENTION
};
