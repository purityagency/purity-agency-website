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

module.exports = {
  escapeHtml,
  isValidEmail,
  isValidBCE,
  formatBCE,
  VAT_FRANCHISE_MENTION
};
